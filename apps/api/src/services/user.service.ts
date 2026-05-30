import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { sanitizeUser } from "../utils/sanitize-user.js";
import { createActivity } from "./activity.service.js";

export const updateProfile = async (userId: string, name: string) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { name },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await createActivity({
    userId,
    type: "profile_updated",
    title: "Updated profile"
  });

  return sanitizeUser(user);
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await UserModel.findById(userId).select("+password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new AppError("Current password is incorrect", 400);
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  await createActivity({
    userId,
    type: "password_changed",
    title: "Changed password"
  });
};
