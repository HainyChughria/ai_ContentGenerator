import {
  changePassword,
  updateProfile
} from "../services/user.service.js";
import { catchAsync } from "../utils/catch-async.js";

export const updateMyProfile = catchAsync(async (req, res) => {
  const user = await updateProfile(req.user._id.toString(), req.body.name);

  res.status(200).json({
    message: "Profile updated",
    user
  });
});

export const changeMyPassword = catchAsync(async (req, res) => {
  await changePassword(
    req.user._id.toString(),
    req.body.currentPassword,
    req.body.newPassword
  );

  res.status(200).json({
    message: "Password changed"
  });
});
