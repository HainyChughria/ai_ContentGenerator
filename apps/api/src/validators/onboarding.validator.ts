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
  body("audience")
    .trim()
    .isLength({ min: 2, max: 180 })
    .withMessage("Audience must be between 2 and 180 characters"),
  body("offer")
    .trim()
    .isLength({ min: 2, max: 240 })
    .withMessage("Offer must be between 2 and 240 characters"),
  body("brandVoice")
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Brand voice must be between 2 and 120 characters"),
  body("website")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 180 })
    .withMessage("Website must be 180 characters or fewer"),
  body("socialHandles.linkedin")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 120 })
    .withMessage("LinkedIn handle must be 120 characters or fewer"),
  body("socialHandles.twitter")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 120 })
    .withMessage("X/Twitter handle must be 120 characters or fewer"),
  body("socialHandles.instagram")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 120 })
    .withMessage("Instagram handle must be 120 characters or fewer"),
  body("contentGoals")
    .isArray({ min: 1, max: 6 })
    .withMessage("Choose between 1 and 6 content goals"),
  body("contentGoals.*")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Each content goal must be between 2 and 80 characters")
];
