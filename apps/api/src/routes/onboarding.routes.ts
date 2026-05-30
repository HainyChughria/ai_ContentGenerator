import { Router } from "express";
import {
  readOnboarding,
  upsertOnboarding
} from "../controllers/onboarding.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate-request.middleware.js";
import { onboardingValidator } from "../validators/onboarding.validator.js";

export const onboardingRoutes = Router();

onboardingRoutes.use(requireAuth);
onboardingRoutes.get("/", readOnboarding);
onboardingRoutes.put("/", onboardingValidator, validateRequest, upsertOnboarding);
