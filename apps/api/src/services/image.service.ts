import { Types } from "mongoose";
import { aspectRatioDimensions } from "../ai/media/aspect-ratios.js";
import { createImageProvider } from "../ai/media/providers/index.js";
import { AspectRatio, GenerateImageInput } from "../ai/media/types.js";
import { ContentModel } from "../models/content.model.js";
import { GeneratedImageModel } from "../models/generated-image.model.js";
import { UserModel } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { logger } from "../utils/logger.js";
import { createActivity } from "./activity.service.js";
import { uploadGeneratedImage } from "./media-upload.service.js";

const IMAGE_GENERATION_CREDIT_COST = 2;

const serializeImage = (image: {
  _id: { toString: () => string };
  prompt: string;
  sourceText?: string | null;
  aspectRatio: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  bytes?: number | null;
  provider: string;
  model: string;
  createdAt: Date;
}) => ({
  id: image._id.toString(),
  prompt: image.prompt,
  sourceText: image.sourceText ?? "",
  aspectRatio: image.aspectRatio,
  imageUrl: image.imageUrl,
  cloudinaryPublicId: image.cloudinaryPublicId,
  width: image.width ?? null,
  height: image.height ?? null,
  format: image.format ?? "",
  bytes: image.bytes ?? 0,
  provider: image.provider,
  model: image.model,
  createdAt: image.createdAt
});

export const getImageGallery = async (userId: string) => {
  const images = await GeneratedImageModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(60)
    .lean();

  return images.map(serializeImage);
};

export const generateImage = async (
  userId: string,
  input: GenerateImageInput
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.credits < IMAGE_GENERATION_CREDIT_COST) {
    logger.warn("Image generation blocked by insufficient credits", {
      userId,
      credits: user.credits,
      requiredCredits: IMAGE_GENERATION_CREDIT_COST
    });
    throw new AppError("Not enough credits to generate an image", 402);
  }

  logger.info("Image generation workflow started", {
    userId,
    aspectRatio: input.aspectRatio,
    promptLength: input.prompt.length,
    hasSourceText: Boolean(input.sourceText)
  });

  const provider = createImageProvider();
  const binary = await provider.generateImage(input);
  logger.info("Image provider returned binary", {
    userId,
    provider: binary.provider,
    model: binary.model,
    mimeType: binary.mimeType,
    bytes: binary.buffer.byteLength
  });

  const upload = await uploadGeneratedImage(binary.buffer, binary.mimeType);
  const dimensions = aspectRatioDimensions[input.aspectRatio];

  const image = await GeneratedImageModel.create({
    userId,
    prompt: input.prompt,
    sourceText: input.sourceText,
    aspectRatio: input.aspectRatio,
    imageUrl: upload.secure_url,
    cloudinaryPublicId: upload.public_id,
    width: upload.width ?? dimensions.width,
    height: upload.height ?? dimensions.height,
    format: upload.format,
    bytes: upload.bytes,
    provider: binary.provider,
    model: binary.model
  });

  user.credits = Math.max(user.credits - IMAGE_GENERATION_CREDIT_COST, 0);
  await user.save();

  await createActivity({
    userId,
    type: "image_generation",
    title: "Generated image",
    metadata: {
      imageId: image._id.toString(),
      aspectRatio: input.aspectRatio
    }
  });

  logger.info("Image generation workflow completed", {
    userId,
    imageId: image._id.toString(),
    provider: binary.provider,
    model: binary.model,
    creditsRemaining: user.credits
  });

  return {
    image: serializeImage(image),
    creditsRemaining: user.credits
  };
};

export const generateImageFromContent = async (
  userId: string,
  contentId: string,
  aspectRatio: AspectRatio
) => {
  if (!Types.ObjectId.isValid(contentId)) {
    throw new AppError("Invalid content id", 400);
  }

  const content = await ContentModel.findOne({
    _id: contentId,
    userId
  });

  if (!content) {
    throw new AppError("Content not found", 404);
  }

  const prompt = [
    "Create a high-quality marketing image based on this generated content.",
    "Avoid text overlays unless explicitly needed.",
    content.result.slice(0, 1200)
  ].join(" ");

  return generateImage(userId, {
    prompt,
    sourceText: content.result,
    aspectRatio
  });
};
