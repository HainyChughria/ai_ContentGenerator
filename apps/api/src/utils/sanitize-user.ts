export type SanitizableUser = {
  _id: {
    toString: () => string;
  };
  name: string;
  email: string;
  credits: number;
  isVerified: boolean;
  createdAt: Date;
  onboarding?: {
    businessName?: string | null;
    niche?: string | null;
    audience?: string | null;
    offer?: string | null;
    brandVoice?: string | null;
    website?: string | null;
    socialHandles?: {
      linkedin?: string | null;
      twitter?: string | null;
      instagram?: string | null;
    } | null;
    contentGoals?: string[] | null;
    completedAt?: Date | null;
  } | null;
};

export const sanitizeUser = (user: SanitizableUser) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  credits: user.credits,
  isVerified: user.isVerified,
  onboarding: {
    businessName: user.onboarding?.businessName ?? "",
    niche: user.onboarding?.niche ?? "",
    audience: user.onboarding?.audience ?? "",
    offer: user.onboarding?.offer ?? "",
    brandVoice: user.onboarding?.brandVoice ?? "",
    website: user.onboarding?.website ?? "",
    socialHandles: {
      linkedin: user.onboarding?.socialHandles?.linkedin ?? "",
      twitter: user.onboarding?.socialHandles?.twitter ?? "",
      instagram: user.onboarding?.socialHandles?.instagram ?? ""
    },
    contentGoals: user.onboarding?.contentGoals ?? [],
    completedAt: user.onboarding?.completedAt ?? null,
    isCompleted: Boolean(user.onboarding?.completedAt)
  },
  createdAt: user.createdAt
});
