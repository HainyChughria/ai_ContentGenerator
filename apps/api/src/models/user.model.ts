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
    },
    passwordResetToken: {
      type: String,
      select: false
    },
    passwordResetExpiry: {
      type: Date,
      select: false
    },
    onboarding: {
      businessName: {
        type: String,
        trim: true,
        maxlength: 120
      },
      niche: {
        type: String,
        trim: true,
        maxlength: 120
      },
      audience: {
        type: String,
        trim: true,
        maxlength: 180
      },
      offer: {
        type: String,
        trim: true,
        maxlength: 240
      },
      brandVoice: {
        type: String,
        trim: true,
        maxlength: 120
      },
      website: {
        type: String,
        trim: true,
        maxlength: 180
      },
      socialHandles: {
        linkedin: {
          type: String,
          trim: true,
          maxlength: 120,
          default: ""
        },
        twitter: {
          type: String,
          trim: true,
          maxlength: 120,
          default: ""
        },
        instagram: {
          type: String,
          trim: true,
          maxlength: 120,
          default: ""
        }
      },
      contentGoals: {
        type: [String],
        default: []
      },
      completedAt: {
        type: Date
      }
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
