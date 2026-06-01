export type OnboardingData = {
  businessName: string;
  niche: string;
  audience: string;
  offer: string;
  brandVoice: string;
  website: string;
  socialHandles: {
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  contentGoals: string[];
  completedAt: string | null;
  isCompleted: boolean;
};

export type OnboardingPayload = {
  businessName: string;
  niche: string;
  audience: string;
  offer: string;
  brandVoice: string;
  website: string;
  socialHandles: {
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  contentGoals: string[];
};
