import { Router } from "express";
import {
  createImage,
  createImageFromContent,
  listImages
} from "../controllers/image.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { imageGenerationLimiter } from "../middlewares/rate-limit.middleware.js";
import { validateRequest } from "../middlewares/validate-request.middleware.js";
import {
  generateImageFromContentValidator,
  generateImageValidator
} from "../validators/image.validator.js";

export const imageRoutes = Router();

imageRoutes.use(requireAuth);
imageRoutes.get("/gallery", listImages);
imageRoutes.post(
  "/generate",
  imageGenerationLimiter,
  generateImageValidator,
  validateRequest,
  createImage
);
imageRoutes.post(
  "/from-content",
  imageGenerationLimiter,
  generateImageFromContentValidator,
  validateRequest,
  createImageFromContent
);
