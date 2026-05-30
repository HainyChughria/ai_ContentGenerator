import { api } from "./api";
import { AspectRatio, GeneratedImage, GenerateImagePayload } from "@/types/image";

type GenerateImageResponse = {
  image: GeneratedImage;
  creditsRemaining: number;
};

export const imageApi = {
  gallery: async () => {
    const { data } = await api.get<{ images: GeneratedImage[] }>(
      "/images/gallery"
    );
    return data.images;
  },
  generate: async (payload: GenerateImagePayload) => {
    const { data } = await api.post<GenerateImageResponse>(
      "/images/generate",
      payload
    );
    return data;
  },
  generateFromContent: async (contentId: string, aspectRatio: AspectRatio) => {
    const { data } = await api.post<GenerateImageResponse>(
      "/images/from-content",
      {
        contentId,
        aspectRatio
      }
    );
    return data;
  }
};
