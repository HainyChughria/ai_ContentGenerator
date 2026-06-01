"use client";

import {
  History,
  Image,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  PenLine,
  Settings,
  Sparkles,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDashboardUiStore } from "@/store/dashboard-ui-store";

const navItems = [
  {
    href: "/dashboard",
    label: "Home",
    icon: LayoutDashboard
  },
  {
    href: "/dashboard/onboarding",
    label: "Setup",
    icon: Sparkles
  },
  {
    href: "/dashboard/generate",
    label: "Generate",
    icon: PenLine
  },
  {
    href: "/dashboard/history",
    label: "History",
    icon: History
  },
  {
    href: "/dashboard/images",
    label: "Images",
    icon: Image
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings
  }
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const {
    isSidebarCollapsed,
    isMobileSidebarOpen,
    closeMobileSidebar,
    toggleSidebar
  } = useDashboardUiStore();

  return (
    <>
      {isMobileSidebarOpen ? (
        <button
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-foreground/30 lg:hidden"
          type="button"
          onClick={closeMobileSidebar}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex border-r bg-background/95 shadow-xl shadow-black/5 backdrop-blur transition-all duration-300 lg:sticky lg:top-0 lg:z-0 lg:shadow-none",
          isSidebarCollapsed ? "w-20" : "w-72",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link
              className={cn(
                "flex items-center gap-3 font-semibold",
                isSidebarCollapsed && "justify-center"
              )}
              href="/dashboard"
              onClick={closeMobileSidebar}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm text-primary-foreground shadow-sm">
                CG
              </span>
              {!isSidebarCollapsed ? <span>Content OS</span> : null}
            </Link>
            <button
              aria-label="Close sidebar"
              className="rounded-md p-2 hover:bg-muted lg:hidden"
              type="button"
              onClick={closeMobileSidebar}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground",
                    isActive && "bg-primary/10 text-primary",
                    isSidebarCollapsed && "justify-center px-0"
                  )}
                  href={item.href}
                  title={isSidebarCollapsed ? item.label : undefined}
                  onClick={closeMobileSidebar}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isSidebarCollapsed ? <span>{item.label}</span> : null}
                </Link>
              );
            })}
          </nav>

          <div className="hidden border-t p-3 lg:block">
            <button
              aria-label="Toggle sidebar"
              className="flex h-10 w-full items-center justify-center rounded-md hover:bg-muted"
              type="button"
              onClick={toggleSidebar}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
