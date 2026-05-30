import { UserModel } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { countGenerations, getRecentActivities } from "./activity.service.js";

export const getDashboardSummary = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const [totalGenerations, recentActivity] = await Promise.all([
    countGenerations(userId),
    getRecentActivities(userId, 5)
  ]);

  return {
    creditsRemaining: user.credits,
    totalGenerations,
    onboardingCompleted: Boolean(user.onboarding?.completedAt),
    recentActivity: recentActivity.map((activity) => ({
      id: activity._id.toString(),
      type: activity.type,
      title: activity.title,
      createdAt: activity.createdAt
    }))
  };
};
