import { InferenceClient } from "@huggingface/inference";
import { env } from "../../../config/env.js";
import { AppError } from "../../../utils/app-error.js";
import { logger } from "../../../utils/logger.js";
import {
  AiImageProvider,
  GenerateImageInput,
  GeneratedImageBinary
} from "../types.js";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class HuggingFaceImageProvider implements AiImageProvider {
  name = "huggingface";
  private client = new InferenceClient(env.hfToken);

  async generateImage(input: GenerateImageInput): Promise<GeneratedImageBinary> {
    const models = [env.hfImageModel, env.hfImageFallbackModel].filter(
      (model, index, list) => model && list.indexOf(model) === index
    );

    let lastError: unknown;

    for (const model of models) {
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          logger.info("HuggingFace image generation attempt started", {
            provider: this.name,
            model,
            attempt,
            aspectRatio: input.aspectRatio,
            promptLength: input.prompt.length
          });

          return await this.callModel(model, input);
        } catch (error) {
          lastError = error;
          logger.warn("HuggingFace image generation attempt failed", {
            provider: this.name,
            model,
            attempt,
            errorName: error instanceof Error ? error.name : "UnknownError",
            errorMessage: error instanceof Error ? error.message : String(error),
            errorCause: this.getErrorCause(error)
          });

          if (this.isNonRetryableError(error)) {
            throw this.toAppError(error);
          }

          if (attempt < 3) {
            await sleep(1200 * attempt);
          }
        }
      }
    }

    if (lastError instanceof Error) {
      throw this.toAppError(lastError);
    }

    throw new AppError("Image generation failed", 502);
  }

  private async callModel(
    model: string,
    input: GenerateImageInput
  ): Promise<GeneratedImageBinary> {
    const startedAt = Date.now();

    const imageBlob = await this.client.textToImage({
      model,
      inputs: input.prompt
    }, {
      outputType: "blob"
    });

    const mimeType = imageBlob.type || "image/png";
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    logger.info("HuggingFace image binary parsed", {
      model,
      mimeType,
      bytes: buffer.byteLength,
      durationMs: Date.now() - startedAt
    });

    return {
      buffer,
      mimeType,
      provider: this.name,
      model
    };
  }

  private getErrorCause(error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "cause" in error &&
      error.cause
    ) {
      const cause = error.cause;

      if (cause instanceof Error) {
        return {
          name: cause.name,
          message: cause.message
        };
      }

      return String(cause);
    }

    return undefined;
  }

  private isNonRetryableError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    return (
      message.includes("sufficient permissions") ||
      message.includes("No Inference Provider available") ||
      message.includes("Unauthorized") ||
      message.includes("401") ||
      message.includes("403")
    );
  }

  private toAppError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("sufficient permissions")) {
      return new AppError(
        "HuggingFace token is missing Inference Providers permission. Create a new fine-grained token with 'Make calls to Inference Providers' enabled, update HF_TOKEN, then restart the API server.",
        401
      );
    }

    if (message.includes("No Inference Provider available")) {
      return new AppError(
        "No HuggingFace Inference Provider is available for the configured image model. Change HF_IMAGE_MODEL to a model available in your HuggingFace Inference Providers settings.",
        502
      );
    }

    if (
      message.includes("Unauthorized") ||
      message.includes("401") ||
      message.includes("403")
    ) {
      return new AppError(
        "HuggingFace rejected the image request. Check that HF_TOKEN is valid and has Inference Providers access.",
        401
      );
    }

    return new AppError(`HuggingFace image generation failed: ${message}`, 502);
  }
}
