"use client";

import { create } from "zustand";
import { contentApi } from "@/lib/content-api";
import { GeneratedContent, GenerateContentPayload } from "@/types/content";

type ContentState = {
  history: GeneratedContent[];
  isLoading: boolean;
  isGenerating: boolean;
  streamingText: string;
  error: string;
  fetchHistory: () => Promise<void>;
  generate: (payload: GenerateContentPayload) => Promise<GeneratedContent | null>;
  deleteContent: (contentId: string) => Promise<void>;
  clearStreamingText: () => void;
};

export const useContentStore = create<ContentState>((set, get) => ({
  history: [],
  isLoading: false,
  isGenerating: false,
  streamingText: "",
  error: "",
  fetchHistory: async () => {
    set({ isLoading: true, error: "" });
    try {
      const history = await contentApi.history();
      set({ history });
    } catch {
      set({ error: "Could not load generation history" });
    } finally {
      set({ isLoading: false });
    }
  },
  generate: async (payload) => {
    set({ isGenerating: true, streamingText: "", error: "" });
    try {
      const response = await contentApi.streamGenerate(payload, (text) => {
        set((state) => ({
          streamingText: `${state.streamingText}${text}`
        }));
      });

      if (response.content) {
        set((state) => ({
          history: [response.content as GeneratedContent, ...state.history]
        }));
      }

      return response.content;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Generation failed"
      });
      return null;
    } finally {
      set({ isGenerating: false });
    }
  },
  deleteContent: async (contentId) => {
    await contentApi.delete(contentId);
    set({
      history: get().history.filter((content) => content.id !== contentId)
    });
  },
  clearStreamingText: () => set({ streamingText: "" })
}));
