import { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-[#9d96a2]",
        className
      )}
      {...props}
    />
  );
}
