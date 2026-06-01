"use client";

import { usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ForgeAppShell } from "@/components/layout/forge-app-shell";
import { ForgeNavItem } from "@/components/layout/forge-sidebar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const isGenerator = pathname.startsWith("/dashboard/generate");
  const activeItem: ForgeNavItem = isGenerator
    ? "generate"
    : pathname.startsWith("/dashboard/onboarding")
      ? "onboarding"
    : pathname.startsWith("/dashboard/history")
      ? "history"
      : pathname.startsWith("/dashboard/images")
        ? "images"
        : pathname.startsWith("/dashboard/settings")
          ? "settings"
          : "dashboard";

  return (
    <AuthGuard>
      <ForgeAppShell
        activeItem={activeItem}
        searchPlaceholder={isGenerator ? "Search generated content..." : "Search workspace..."}
        showProfile
        wideSearch={isGenerator}
      >
        {children}
      </ForgeAppShell>
    </AuthGuard>
  );
}
