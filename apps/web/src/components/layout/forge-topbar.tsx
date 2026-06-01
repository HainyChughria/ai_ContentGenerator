"use client";

import { Bell, Search } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

type ForgeTopbarProps = {
  placeholder: string;
  showProfile?: boolean;
  wideSearch?: boolean;
};

export function ForgeTopbar({
  placeholder,
  showProfile = true,
  wideSearch = false
}: ForgeTopbarProps) {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-20 flex h-[70px] items-center border-b border-[#1f1f24] bg-[#111114]/95 px-5 backdrop-blur lg:ml-[300px]">
      <div
        className={
          wideSearch
            ? "relative h-[46px] w-full max-w-[400px]"
            : "relative h-[48px] w-full max-w-[405px]"
        }
      >
        <Search className="absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#8f8996]" />
        <input
          className="h-full w-full rounded-[2px] border border-[#26252b] bg-[#1b1a1f] pl-16 pr-12 text-[15px] text-[#dad6de] outline-none placeholder:text-[#6f6974] focus:border-[#5b4a66]"
          placeholder={placeholder}
          type="search"
        />
        {!wideSearch ? (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[11px] text-[#77717b]">
            ⌘K
          </span>
        ) : null}
      </div>

      {showProfile ? (
        <div className="ml-auto flex items-center gap-5">
          <Bell className="h-5 w-5 text-[#ddd8e2]" />
          <div className="h-6 w-px bg-[#24232a]" />
          <div className="text-right">
            <p className="font-mono text-[13px] tracking-[0.04em] text-[#e9e3ee]">
              {user?.onboarding.businessName || user?.name || "Workspace"}
            </p>
            <p className="mt-1 text-[11px] text-[#8d8793]">{user?.email}</p>
          </div>
          <div
            aria-label="Operator avatar"
            className="h-8 w-8 overflow-hidden rounded-full border border-[#34323a] bg-[radial-gradient(circle_at_50%_20%,#b99cff_0_8%,#1f6f82_9%_22%,#121214_23%_100%)]"
            role="img"
          >
            <div className="mx-auto mt-[9px] h-[15px] w-[12px] rounded-t-full bg-[#1f2930]" />
          </div>
        </div>
      ) : null}
    </header>
  );
}
