import {
  generateImage,
  generateImageFromContent,
  getImageGallery
} from "../services/image.service.js";
import { catchAsync } from "../utils/catch-async.js";

export const createImage = catchAsync(async (req, res) => {
  const result = await generateImage(req.user._id.toString(), req.body);

  res.status(201).json(result);
});

export const createImageFromContent = catchAsync(async (req, res) => {
  const result = await generateImageFromContent(
    req.user._id.toString(),
    req.body.contentId,
    req.body.aspectRatio
  );

  res.status(201).json(result);
});

export const listImages = catchAsync(async (req, res) => {
  const images = await getImageGallery(req.user._id.toString());

  res.status(200).json({ images });
});
