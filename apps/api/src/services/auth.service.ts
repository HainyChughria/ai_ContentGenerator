import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { sanitizeUser } from "../utils/sanitize-user.js";
import { sendVerificationOtp } from "./email.service.js";
import { generateOtp, getOtpExpiry } from "./otp.service.js";
import { generateAccessToken } from "./token.service.js";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export const registerUser = async ({ name, email, password }: RegisterInput) => {
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const otp = generateOtp();

  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    otp,
    otpExpiry: getOtpExpiry()
  });

  await sendVerificationOtp(user.email, otp);

  return sanitizeUser(user);
};

export const verifyEmailOtp = async (email: string, otp: string) => {
  const user = await UserModel.findOne({ email }).select("+otp +otpExpiry");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isVerified) {
    return sanitizeUser(user);
  }

  if (!user.otp || !user.otpExpiry || user.otp !== otp) {
    throw new AppError("Invalid verification code", 400);
  }

  if (user.otpExpiry.getTime() < Date.now()) {
    throw new AppError("Verification code has expired", 400);
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return sanitizeUser(user);
};

export const resendVerificationOtp = async (email: string) => {
  const user = await UserModel.findOne({ email }).select("+otp +otpExpiry");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isVerified) {
    throw new AppError("Account is already verified", 400);
  }

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpiry = getOtpExpiry();
  await user.save();

  await sendVerificationOtp(user.email, otp);

  return { message: "Verification code sent" };
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isVerified) {
    throw new AppError("Please verify your email before logging in", 403);
  }

  const accessToken = generateAccessToken({ userId: user._id.toString() });

  return {
    accessToken,
    user: sanitizeUser(user)
  };
};
