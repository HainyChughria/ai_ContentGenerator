import { Types } from "mongoose";
import { ActivityModel } from "../models/activity.model.js";

type ActivityType =
  | "onboarding_completed"
  | "profile_updated"
  | "password_changed"
  | "generation";

type CreateActivityInput = {
  userId: string;
  type: ActivityType;
  title: string;
  metadata?: Record<string, unknown>;
};

export const createActivity = async ({
  userId,
  type,
  title,
  metadata = {}
}: CreateActivityInput) => {
  await ActivityModel.create({
    userId: new Types.ObjectId(userId),
    type,
    title,
    metadata
  });
};

export const getRecentActivities = async (userId: string, limit = 5) => {
  return ActivityModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const countGenerations = async (userId: string) => {
  return ActivityModel.countDocuments({
    userId,
    type: "generation"
  });
};
