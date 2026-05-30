export type OnboardingData = {
  businessName: string;
  niche: string;
  contentGoals: string[];
  completedAt: string | null;
  isCompleted: boolean;
};

export type OnboardingPayload = {
  businessName: string;
  niche: string;
  contentGoals: string[];
};
