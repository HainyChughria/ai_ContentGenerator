import mongoose, { InferSchemaType } from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: [
        "onboarding_completed",
        "profile_updated",
        "password_changed",
        "generation"
      ],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false
    },
    versionKey: false
  }
);

export type Activity = InferSchemaType<typeof activitySchema>;

export const ActivityModel = mongoose.model("Activity", activitySchema);
