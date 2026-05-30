"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type DashboardUiState = {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  toggleSidebar: () => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
};

export const useDashboardUiStore = create<DashboardUiState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      isMobileSidebarOpen: false,
      toggleSidebar: () =>
        set((state) => ({
          isSidebarCollapsed: !state.isSidebarCollapsed
        })),
      openMobileSidebar: () => set({ isMobileSidebarOpen: true }),
      closeMobileSidebar: () => set({ isMobileSidebarOpen: false })
    }),
    {
      name: "ai-saas-dashboard-ui",
      partialize: (state) => ({
        isSidebarCollapsed: state.isSidebarCollapsed
      })
    }
  )
);
