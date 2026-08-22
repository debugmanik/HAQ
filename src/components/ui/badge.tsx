import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "primary", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold transition-colors border",
        variant === "primary" && "border-transparent bg-navy text-paper",
        variant === "secondary" && "border-transparent bg-navy-light text-navy",
        variant === "outline" && "border-stone-border text-foreground bg-transparent",
        variant === "success" && "border-transparent bg-emerald-50 text-emerald-800 border-emerald-200/50",
        variant === "warning" && "border-transparent bg-amber-50 text-amber-850 border-amber-200/50",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
