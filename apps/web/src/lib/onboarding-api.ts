import { OnboardingData, OnboardingPayload } from "@/types/onboarding";
import { api } from "./api";

export const onboardingApi = {
  get: async () => {
    const { data } = await api.get<{ onboarding: OnboardingData }>(
      "/onboarding"
    );
    return data.onboarding;
  },
  save: async (payload: OnboardingPayload) => {
    const { data } = await api.put<{ onboarding: OnboardingData }>(
      "/onboarding",
      payload
    );
    return data.onboarding;
  }
};
