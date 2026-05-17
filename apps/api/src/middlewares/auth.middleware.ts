import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { verifyAccessToken } from "../services/token.service.js";

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;

    if (!token) {
      throw new AppError("Authentication token is required", 401);
    }

    const payload = verifyAccessToken(token);
    const user = await UserModel.findById(payload.userId);

    if (!user) {
      throw new AppError("Authenticated user no longer exists", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
