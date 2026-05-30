import mongoose, { InferSchemaType } from "mongoose";

const generatedImageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    sourceText: {
      type: String,
      trim: true,
      maxlength: 4000
    },
    aspectRatio: {
      type: String,
      enum: ["1:1", "16:9", "9:16", "4:5"],
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    cloudinaryPublicId: {
      type: String,
      required: true
    },
    width: Number,
    height: Number,
    format: String,
    bytes: Number,
    provider: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
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

export type GeneratedImage = InferSchemaType<typeof generatedImageSchema>;

export const GeneratedImageModel = mongoose.model(
  "GeneratedImage",
  generatedImageSchema
);
