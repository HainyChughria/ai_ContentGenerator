import { Router } from "express";
import {
  getMe,
  login,
  register,
  resendOtp,
  verifyEmail
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate-request.middleware.js";
import {
  loginValidator,
  registerValidator,
  resendOtpValidator,
  verifyEmailValidator
} from "../validators/auth.validator.js";

export const authRoutes = Router();

authRoutes.post("/register", registerValidator, validateRequest, register);
authRoutes.post("/login", loginValidator, validateRequest, login);
authRoutes.post(
  "/verify-email",
  verifyEmailValidator,
  validateRequest,
  verifyEmail
);
authRoutes.post("/resend-otp", resendOtpValidator, validateRequest, resendOtp);
authRoutes.get("/me", requireAuth, getMe);
