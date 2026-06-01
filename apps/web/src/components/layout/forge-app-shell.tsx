"use client";

import { motion } from "framer-motion";
import { ForgeSidebar, ForgeNavItem } from "./forge-sidebar";
import { ForgeTopbar } from "./forge-topbar";

type ForgeAppShellProps = {
  activeItem: ForgeNavItem;
  children: React.ReactNode;
  searchPlaceholder: string;
  showProfile?: boolean;
  wideSearch?: boolean;
};

export function ForgeAppShell({
  activeItem,
  children,
  searchPlaceholder,
  showProfile = true,
  wideSearch = false
}: ForgeAppShellProps) {
  return (
    <div className="min-h-screen bg-[#111114] text-[#f0edf2]">
      <ForgeSidebar activeItem={activeItem} />
      <ForgeTopbar
        placeholder={searchPlaceholder}
        showProfile={showProfile}
        wideSearch={wideSearch}
      />
      <motion.main
        animate={{ opacity: 1, y: 0 }}
        className="lg:ml-[300px]"
        initial={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.main>
    </div>
  );
}
