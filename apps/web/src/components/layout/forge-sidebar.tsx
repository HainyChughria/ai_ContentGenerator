"use client";

import {
  Blocks,
  CircleHelp,
  FileText,
  Gauge,
  ImageIcon,
  LogOut,
  PenLine,
  Settings,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ForgeLogo } from "@/components/shared/forge-logo";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export type ForgeNavItem =
  | "dashboard"
  | "onboarding"
  | "generate"
  | "images"
  | "history"
  | "settings";

const navItems: {
  id: ForgeNavItem;
  label: string;
  href: string;
  icon: typeof Gauge;
}[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: Blocks },
  { id: "onboarding", label: "Onboarding", href: "/dashboard/onboarding", icon: Sparkles },
  { id: "generate", label: "Content Sandbox", href: "/dashboard/generate", icon: PenLine },
  { id: "images", label: "Image Sandbox", href: "/dashboard/images", icon: ImageIcon },
  { id: "history", label: "History", href: "/dashboard/history", icon: FileText },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: Settings }
];

type ForgeSidebarProps = {
  activeItem: ForgeNavItem;
  tier?: "enterprise" | "enterprise-tier";
};

export function ForgeSidebar({ activeItem, tier = "enterprise-tier" }: ForgeSidebarProps) {
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const signOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[300px] border-r border-[#202026] bg-[#171719] lg:flex lg:flex-col">
      <div className="px-6 pt-5">
        <ForgeLogo />
        {tier === "enterprise-tier" ? (
          <p className="ml-[56px] mt-[-6px] font-mono text-[10px] uppercase tracking-[0.14em] text-[#8d8793]">
            Business Workspace
          </p>
        ) : null}
      </div>

      <nav className="mt-[66px] space-y-3 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <Link
              key={item.id}
              className={cn(
                "flex h-[46px] items-center gap-5 rounded-[3px] px-5 text-[16px] font-semibold text-[#dfd8e4] transition-colors hover:bg-[#252329]",
                isActive && "bg-[#302b36] text-[#e5bbff]"
              )}
              href={item.href}
            >
              <Icon className="h-[21px] w-[21px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pb-7">
        <div className="mb-8 border-t border-[#242329]" />
        <button
          className="mb-6 flex h-[44px] w-full items-center justify-center gap-3 rounded-[2px] border border-[#5f4d68] bg-[#24202a] font-mono text-[13px] font-bold uppercase tracking-[0.06em] text-[#e2b6ff] transition-colors hover:bg-[#30263a]"
          type="button"
        >
          <ShieldCheck className="h-4 w-4" />
          {user?.credits ?? 0} Credits
        </button>
        <div className="space-y-5 px-4 text-[15px] font-medium">
          <Link className="flex items-center gap-4 text-[#ded8e4]" href="#">
            <CircleHelp className="h-5 w-5" />
            Support
          </Link>
          <button
            className="flex items-center gap-4 text-[#c98a7f]"
            type="button"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
