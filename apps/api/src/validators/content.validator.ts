import { body, param } from "express-validator";

export const generateContentValidator = [
  body("contentType")
    .isIn(["blog", "linkedin", "twitter", "instagram"])
    .withMessage("Choose a valid content type"),
  body("tone")
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Tone must be between 2 and 60 characters"),
  body("prompt")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Prompt must be between 10 and 2000 characters")
];

export const contentIdValidator = [
  param("contentId").isMongoId().withMessage("Invalid content id")
];
