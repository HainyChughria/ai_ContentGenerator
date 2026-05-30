import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "MONGODB_URI",
  "CLIENT_URL",
  "JWT_ACCESS_SECRET",
  "GROQ_API_KEY",
  "HF_TOKEN",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL"
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  mongoUri: process.env.MONGODB_URI as string,
  clientUrl: process.env.CLIENT_URL as string,
  apiUrl: process.env.API_URL ?? `http://localhost:${Number(process.env.PORT ?? 5000)}`,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  groqApiKey: process.env.GROQ_API_KEY as string,
  groqModel: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
  hfToken: process.env.HF_TOKEN as string,
  hfImageModel:
    process.env.HF_IMAGE_MODEL ?? "stabilityai/stable-diffusion-xl-base-1.0",
  hfImageFallbackModel:
    process.env.HF_IMAGE_FALLBACK_MODEL ??
    "stable-diffusion-v1-5/stable-diffusion-v1-5",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY as string,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET as string,
  resendApiKey: process.env.RESEND_API_KEY as string,
  resendFromEmail: process.env.RESEND_FROM_EMAIL as string
};
