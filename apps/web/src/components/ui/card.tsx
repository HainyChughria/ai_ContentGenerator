import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f] p-5 shadow-sm shadow-black/20",
        className
      )}
      {...props}
    />
  );
}
