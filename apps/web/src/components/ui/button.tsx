import * as React from "react";
import { cn } from "../../lib/utils"

type ButtonVariant = "primary" | "brand" | "outline" | "ghost" | "figmaDark";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-dark text-white hover:bg-[#272727]",
  brand: "bg-brand text-white hover:bg-[#ef4d1d]",
  outline: "border border-border bg-white text-text hover:bg-bg",
  ghost: "bg-transparent text-text hover:bg-bg",
  figmaDark:
    "border-[3px] border-[#ff7a59] bg-gradient-to-b from-[#3a3a3a] to-[#1f1f1f] text-white shadow-[0_10px_24px_rgba(255,86,35,0.22)] hover:scale-[1.01] hover:shadow-[0_12px_28px_rgba(255,86,35,0.3)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";