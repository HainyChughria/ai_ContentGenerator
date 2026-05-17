import { ErrorRequestHandler } from "express";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message =
    error instanceof AppError ? error.message : "Something went wrong";

  res.status(statusCode).json({
    message,
    ...(env.nodeEnv === "development" && {
      stack: error.stack
    })
  });
};
