import { BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

type ForgeLogoProps = {
  compact?: boolean;
  className?: string;
};

export function ForgeLogo({ compact = false, className }: ForgeLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#d8a5ff] text-[#130817] shadow-[0_0_24px_rgba(216,165,255,0.18)]">
        <BrainCircuit className="h-5 w-5" />
      </div>
      {!compact ? (
        <div className="leading-none">
          <p className="text-[18px] font-bold tracking-[-0.02em] text-[#f3f1f5]">
            ContentForge AI
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#8e8895]">
            Business Content OS
          </p>
        </div>
      ) : null}
    </div>
  );
}
