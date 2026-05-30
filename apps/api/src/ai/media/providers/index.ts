import { AiImageProvider } from "../types.js";
import { HuggingFaceImageProvider } from "./huggingface-image.provider.js";

export const createImageProvider = (): AiImageProvider => {
  return new HuggingFaceImageProvider();
};
