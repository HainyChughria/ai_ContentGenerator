import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDb = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};
