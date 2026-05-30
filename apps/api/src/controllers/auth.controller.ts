import { Response } from "express";
import {
  requestPasswordReset,
  loginUser,
  registerUser,
  resetPassword,
  resendVerificationOtp,
  verifyEmailOtp
} from "../services/auth.service.js";
import { catchAsync } from "../utils/catch-async.js";
import { sanitizeUser } from "../utils/sanitize-user.js";

export const register = catchAsync(async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    message: "Registration successful. Please verify your email.",
    user
  });
});

export const login = catchAsync(async (req, res) => {
  const result = await loginUser(req.body);

  res.status(200).json({
    message: "Login successful",
    ...result
  });
});

export const verifyEmail = catchAsync(async (req, res) => {
  const user = await verifyEmailOtp(req.body.email, req.body.otp);

  res.status(200).json({
    message: "Email verified successfully",
    user
  });
});

export const resendOtp = catchAsync(async (req, res) => {
  const result = await resendVerificationOtp(req.body.email);

  res.status(200).json(result);
});

export const getMe = catchAsync(async (req, res: Response) => {
  res.status(200).json({
    user: sanitizeUser(req.user)
  });
});

export const forgotPassword = catchAsync(async (req, res) => {
  await requestPasswordReset(req.body.email);

  res.status(200).json({
    message:
      "If an account exists for that email, a password reset link has been sent."
  });
});

export const updateForgottenPassword = catchAsync(async (req, res) => {
  await resetPassword(req.body.email, req.body.token, req.body.password);

  res.status(200).json({
    message: "Password reset successful"
  });
});
