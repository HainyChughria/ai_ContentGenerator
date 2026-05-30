"use client";

import axios from "axios";
import { create } from "zustand";
import { imageApi } from "@/lib/image-api";
import { AspectRatio, GeneratedImage, GenerateImagePayload } from "@/types/image";

type ImageState = {
  images: GeneratedImage[];
  isLoading: boolean;
  isGenerating: boolean;
  error: string;
  fetchGallery: () => Promise<void>;
  generateImage: (payload: GenerateImagePayload) => Promise<GeneratedImage | null>;
  generateFromContent: (
    contentId: string,
    aspectRatio: AspectRatio
  ) => Promise<GeneratedImage | null>;
};

export const useImageStore = create<ImageState>((set) => ({
  images: [],
  isLoading: false,
  isGenerating: false,
  error: "",
  fetchGallery: async () => {
    set({ isLoading: true, error: "" });
    try {
      const images = await imageApi.gallery();
      set({ images });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Could not load image gallery"
          : "Could not load image gallery"
      });
    } finally {
      set({ isLoading: false });
    }
  },
  generateImage: async (payload) => {
    set({ isGenerating: true, error: "" });
    try {
      const response = await imageApi.generate(payload);
      set((state) => ({
        images: [response.image, ...state.images]
      }));
      return response.image;
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Could not generate image"
          : "Could not generate image"
      });
      return null;
    } finally {
      set({ isGenerating: false });
    }
  },
  generateFromContent: async (contentId, aspectRatio) => {
    set({ isGenerating: true, error: "" });
    try {
      const response = await imageApi.generateFromContent(contentId, aspectRatio);
      set((state) => ({
        images: [response.image, ...state.images]
      }));
      return response.image;
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message ??
            "Could not generate image from content"
          : "Could not generate image from content"
      });
      return null;
    } finally {
      set({ isGenerating: false });
    }
  }
}));
