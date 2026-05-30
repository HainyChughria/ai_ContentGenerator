import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../config/cloudinary.js";
import { AppError } from "../utils/app-error.js";
import { logger } from "../utils/logger.js";

export const bufferToDataUri = (buffer: Buffer, mimeType: string) => {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
};

export const uploadGeneratedImage = async (
  buffer: Buffer,
  mimeType: string
): Promise<UploadApiResponse> => {
  logger.info("Cloudinary upload started", {
    mimeType,
    bytes: buffer.byteLength,
    folder: "ai-saas/generated-images"
  });

  try {
    const upload = await uploadBufferToCloudinary(buffer);

    logger.info("Cloudinary upload completed", {
      publicId: upload.public_id,
      width: upload.width,
      height: upload.height,
      format: upload.format,
      bytes: upload.bytes
    });

    return upload;
  } catch (error) {
    const cloudinaryError = getCloudinaryErrorDetails(error);

    logger.error("Cloudinary upload failed", {
      ...cloudinaryError
    });

    throw new AppError(`Cloudinary upload failed: ${cloudinaryError.message}`, 502);
  }
};

const uploadBufferToCloudinary = (buffer: Buffer) => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ai-saas/generated-images",
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload did not return a result"));
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

const getCloudinaryErrorDetails = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message
    };
  }

  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;

    return {
      name: String(record.name ?? record.http_code ?? "CloudinaryError"),
      message: String(record.message ?? record.error?.toString() ?? JSON.stringify(record)),
      httpCode: record.http_code,
      error
    };
  }

  return {
    name: "CloudinaryError",
    message: String(error)
  };
};
