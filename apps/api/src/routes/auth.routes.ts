import { Router } from "express";
import {
  forgotPassword,
  getMe,
  login,
  register,
  resendOtp,
  updateForgottenPassword,
  verifyEmail
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  authLimiter,
  passwordResetLimiter
} from "../middlewares/rate-limit.middleware.js";
import { validateRequest } from "../middlewares/validate-request.middleware.js";
import {
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  resendOtpValidator,
  verifyEmailValidator
} from "../validators/auth.validator.js";

export const authRoutes = Router();

authRoutes.use(authLimiter);

authRoutes.post("/register", registerValidator, validateRequest, register);
authRoutes.post("/login", loginValidator, validateRequest, login);
authRoutes.post(
  "/verify-email",
  verifyEmailValidator,
  validateRequest,
  verifyEmail
);
authRoutes.post("/resend-otp", resendOtpValidator, validateRequest, resendOtp);
authRoutes.post(
  "/forgot-password",
  passwordResetLimiter,
  forgotPasswordValidator,
  validateRequest,
  forgotPassword
);
authRoutes.post(
  "/reset-password",
  passwordResetLimiter,
  resetPasswordValidator,
  validateRequest,
  updateForgottenPassword
);
authRoutes.get("/me", requireAuth, getMe);
