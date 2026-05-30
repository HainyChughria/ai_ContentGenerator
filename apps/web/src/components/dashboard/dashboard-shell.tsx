"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted lg:flex">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">
          <DashboardTopbar />
          <main className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
