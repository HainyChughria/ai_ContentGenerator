import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    credits: {
      type: Number,
      default: 10,
      min: 0
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    otp: {
      type: String,
      select: false
    },
    otpExpiry: {
      type: Date,
      select: false
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

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;

export const UserModel = mongoose.model("User", userSchema);
