import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-[4px] border border-[#2b2a31] bg-[#111114] px-3 py-2 text-sm text-[#f1eef4] outline-none transition-all placeholder:text-[#5f5964] focus:border-[#d7a6ff] focus:ring-4 focus:ring-[#d7a6ff]/10",
        className
      )}
      {...props}
    />
  );
}
