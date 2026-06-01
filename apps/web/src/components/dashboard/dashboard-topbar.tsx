"use client";

import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useDashboardUiStore } from "@/store/dashboard-ui-store";

export function DashboardTopbar() {
  const { user, logout } = useAuthStore();
  const { openMobileSidebar } = useDashboardUiStore();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/85 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button
          aria-label="Open sidebar"
          className="rounded-md p-2 hover:bg-muted lg:hidden"
          type="button"
          onClick={openMobileSidebar}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-medium">{user?.name ?? "Dashboard"}</p>
          <p className="text-xs text-muted-foreground">
            {user?.onboarding.isCompleted
              ? user.onboarding.businessName
              : user?.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm shadow-sm sm:flex">
          <Sparkles className="h-4 w-4 text-primary" />
          {user?.credits ?? 0}
        </div>
        <Button variant="secondary" onClick={logout}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
