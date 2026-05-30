import { Router } from "express";
import {
  changeMyPassword,
  updateMyProfile
} from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate-request.middleware.js";
import {
  changePasswordValidator,
  updateProfileValidator
} from "../validators/user.validator.js";

export const userRoutes = Router();

userRoutes.use(requireAuth);
userRoutes.put("/profile", updateProfileValidator, validateRequest, updateMyProfile);
userRoutes.put(
  "/password",
  changePasswordValidator,
  validateRequest,
  changeMyPassword
);
