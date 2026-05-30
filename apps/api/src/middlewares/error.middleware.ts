import { ErrorRequestHandler } from "express";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";
import { sendError } from "../utils/api-response.js";
import { logger } from "../utils/logger.js";

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message =
    error instanceof AppError ? error.message : "Something went wrong";

  logger.error("Request failed", {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage: error instanceof Error ? error.message : String(error),
    stack: env.nodeEnv === "development" && error instanceof Error
      ? error.stack
      : undefined
  });

  sendError(res, statusCode, message, {
    ...(env.nodeEnv === "development" && {
      stack: error.stack
    })
  });
};
