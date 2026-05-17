import { NextFunction, Request, Response } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const catchAsync =
  (controller: AsyncController) =>
  (req: Request, res: Response, next: NextFunction) => {
    controller(req, res, next).catch(next);
  };
