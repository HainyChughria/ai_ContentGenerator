import { body } from "express-validator";

export const generateImageValidator = [
  body("prompt")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Prompt must be between 10 and 2000 characters"),
  body("aspectRatio")
    .isIn(["1:1", "16:9", "9:16", "4:5"])
    .withMessage("Choose a valid aspect ratio"),
  body("sourceText")
    .optional()
    .trim()
    .isLength({ max: 4000 })
    .withMessage("Source text is too long")
];

export const generateImageFromContentValidator = [
  body("contentId").isMongoId().withMessage("Invalid content id"),
  body("aspectRatio")
    .isIn(["1:1", "16:9", "9:16", "4:5"])
    .withMessage("Choose a valid aspect ratio")
];
