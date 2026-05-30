import rateLimit from "express-rate-limit";

export const aiGenerationLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many generation requests. Please wait a minute and try again."
  }
});
