import { body, param } from "express-validator";

export const generateContentValidator = [
  body("contentType")
    .isIn(["blog", "linkedin", "twitter", "instagram", "email", "ad"])
    .withMessage("Choose a valid content type"),
  body("tone")
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Tone must be between 2 and 60 characters"),
  body("request")
    .trim()
    .isLength({ min: 4, max: 500 })
    .withMessage("Request must be between 4 and 500 characters")
];

export const contentIdValidator = [
  param("contentId").isMongoId().withMessage("Invalid content id")
];
