import { Response } from "express";
import {
  deleteContent,
  getContentHistory,
  streamGeneratedContent
} from "../services/content.service.js";
import { AppError } from "../utils/app-error.js";
import { catchAsync } from "../utils/catch-async.js";

const sendSseEvent = (
  res: Response,
  event: string,
  data: Record<string, unknown>
) => {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

export const generateContent = catchAsync(async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  try {
    for await (const message of streamGeneratedContent(
      req.user._id.toString(),
      req.body
    )) {
      sendSseEvent(res, message.event, message.data);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Content generation failed";
    sendSseEvent(res, "error", { message });
  } finally {
    res.end();
  }
});

export const listContentHistory = catchAsync(async (req, res) => {
  const contents = await getContentHistory(req.user._id.toString());

  res.status(200).json({ contents });
});

export const removeContent = catchAsync(async (req, res) => {
  const contentId = req.params.contentId;

  if (typeof contentId !== "string") {
    throw new AppError("Invalid content id", 400);
  }

  await deleteContent(req.user._id.toString(), contentId);

  res.status(200).json({
    message: "Content deleted"
  });
});
