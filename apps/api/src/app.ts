import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { notFoundHandler } from "./middlewares/not-found.middleware.js";
import { authRoutes } from "./routes/auth.routes.js";
import { contentRoutes } from "./routes/content.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import { imageRoutes } from "./routes/image.routes.js";
import { onboardingRoutes } from "./routes/onboarding.routes.js";
import { userRoutes } from "./routes/user.routes.js";

export const app = express();

app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    }
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === env.clientUrl) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/user", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
