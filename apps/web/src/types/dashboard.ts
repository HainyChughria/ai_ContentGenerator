export type ActivityItem = {
  id: string;
  type: "onboarding_completed" | "profile_updated" | "password_changed" | "generation";
  title: string;
  createdAt: string;
};

export type DashboardSummary = {
  creditsRemaining: number;
  totalGenerations: number;
  onboardingCompleted: boolean;
  recentActivity: ActivityItem[];
};
