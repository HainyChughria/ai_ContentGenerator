import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
  "MONGODB_URI",
  "CLIENT_URL",
  "JWT_ACCESS_SECRET",
  "GROQ_API_KEY",
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
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  groqApiKey: process.env.GROQ_API_KEY as string,
  groqModel: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
  resendApiKey: process.env.RESEND_API_KEY as string,
  resendFromEmail: process.env.RESEND_FROM_EMAIL as string
};
