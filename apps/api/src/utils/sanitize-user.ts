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
    contentGoals: user.onboarding?.contentGoals ?? [],
    completedAt: user.onboarding?.completedAt ?? null,
    isCompleted: Boolean(user.onboarding?.completedAt)
  },
  createdAt: user.createdAt
});
