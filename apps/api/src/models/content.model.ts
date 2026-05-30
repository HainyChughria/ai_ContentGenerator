import mongoose, { InferSchemaType } from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["blog", "linkedin", "twitter", "instagram"],
      required: true
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    result: {
      type: String,
      required: true
    },
    tokensUsed: {
      type: Number,
      required: true,
      min: 0
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

export type Content = InferSchemaType<typeof contentSchema>;

export const ContentModel = mongoose.model("Content", contentSchema);
