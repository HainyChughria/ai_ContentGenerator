import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data ? { data } : {})
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  details?: unknown
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {})
  });
};
