import { body } from "express-validator";

export const onboardingValidator = [
  body("businessName")
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Business name must be between 2 and 120 characters"),
  body("niche")
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Niche must be between 2 and 120 characters"),
  body("contentGoals")
    .isArray({ min: 1, max: 5 })
    .withMessage("Choose between 1 and 5 content goals"),
  body("contentGoals.*")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Each content goal must be between 2 and 80 characters")
];
