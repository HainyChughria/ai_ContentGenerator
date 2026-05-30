"use client";

import { create } from "zustand";
import { onboardingApi } from "@/lib/onboarding-api";
import { OnboardingData, OnboardingPayload } from "@/types/onboarding";

type OnboardingState = {
  onboarding: OnboardingData | null;
  isLoading: boolean;
  error: string;
  fetchOnboarding: () => Promise<void>;
  saveOnboarding: (payload: OnboardingPayload) => Promise<OnboardingData>;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  onboarding: null,
  isLoading: false,
  error: "",
  fetchOnboarding: async () => {
    set({ isLoading: true, error: "" });
    try {
      const onboarding = await onboardingApi.get();
      set({ onboarding });
    } catch {
      set({ error: "Could not load onboarding" });
    } finally {
      set({ isLoading: false });
    }
  },
  saveOnboarding: async (payload) => {
    set({ isLoading: true, error: "" });
    try {
      const onboarding = await onboardingApi.save(payload);
      set({ onboarding });
      return onboarding;
    } finally {
      set({ isLoading: false });
    }
  }
}));
