import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          // Variants
          variant === "primary" && "bg-navy text-paper hover:bg-navy-hover active:bg-navy border border-navy",
          variant === "secondary" && "bg-navy-light text-navy hover:bg-stone-border/30 border border-transparent",
          variant === "outline" && "border border-stone-border bg-transparent text-foreground hover:bg-navy-light hover:text-navy",
          variant === "ghost" && "hover:bg-navy-light hover:text-navy bg-transparent text-foreground",
          variant === "link" && "text-navy underline-offset-4 hover:underline bg-transparent p-0 h-auto font-normal",
          // Sizes
          size === "sm" && "h-9 px-3 text-sm rounded-sm",
          size === "md" && "h-11 px-5 text-sm rounded-md",
          size === "lg" && "h-12 px-6 text-base rounded-md",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
