import { Router } from "express";
import {
  generateContent,
  listContentHistory,
  removeContent
} from "../controllers/content.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { aiGenerationLimiter } from "../middlewares/rate-limit.middleware.js";
import { validateRequest } from "../middlewares/validate-request.middleware.js";
import {
  contentIdValidator,
  generateContentValidator
} from "../validators/content.validator.js";

export const contentRoutes = Router();

contentRoutes.use(requireAuth);
contentRoutes.get("/history", listContentHistory);
contentRoutes.post(
  "/generate",
  aiGenerationLimiter,
  generateContentValidator,
  validateRequest,
  generateContent
);
contentRoutes.delete(
  "/:contentId",
  contentIdValidator,
  validateRequest,
  removeContent
);
