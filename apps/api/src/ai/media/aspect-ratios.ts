import { AspectRatio, ImageDimensions } from "./types.js";

export const aspectRatioDimensions: Record<AspectRatio, ImageDimensions> = {
  "1:1": {
    width: 1024,
    height: 1024
  },
  "16:9": {
    width: 1344,
    height: 768
  },
  "9:16": {
    width: 768,
    height: 1344
  },
  "4:5": {
    width: 1024,
    height: 1280
  }
};
