"use client";

import { create } from "zustand";
import { dashboardApi } from "@/lib/dashboard-api";
import { DashboardSummary } from "@/types/dashboard";

type DashboardState = {
  summary: DashboardSummary | null;
  isLoading: boolean;
  error: string;
  fetchSummary: () => Promise<void>;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: null,
  isLoading: false,
  error: "",
  fetchSummary: async () => {
    set({ isLoading: true, error: "" });
    try {
      const summary = await dashboardApi.summary();
      set({ summary });
    } catch {
      set({ error: "Could not load dashboard summary" });
    } finally {
      set({ isLoading: false });
    }
  }
}));
