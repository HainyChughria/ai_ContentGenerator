import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-all hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0",
        variant === "primary" &&
          "bg-[#d7a6ff] text-[#1c1024] shadow-sm hover:bg-[#e2bfff] hover:shadow-md",
        variant === "secondary" &&
          "border border-[#2b2a31] bg-[#1c1b1f] text-[#f1eef4] shadow-sm hover:bg-[#25242a]",
        className
      )}
      {...props}
    />
  );
}
