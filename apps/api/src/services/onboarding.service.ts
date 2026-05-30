import { UserModel } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { sanitizeUser } from "../utils/sanitize-user.js";
import { createActivity } from "./activity.service.js";

type OnboardingInput = {
  businessName: string;
  niche: string;
  contentGoals: string[];
};

export const getOnboarding = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return sanitizeUser(user).onboarding;
};

export const saveOnboarding = async (
  userId: string,
  { businessName, niche, contentGoals }: OnboardingInput
) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      onboarding: {
        businessName,
        niche,
        contentGoals,
        completedAt: new Date()
      }
    },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await createActivity({
    userId,
    type: "onboarding_completed",
    title: "Completed onboarding",
    metadata: {
      businessName,
      niche
    }
  });

  return sanitizeUser(user).onboarding;
};
