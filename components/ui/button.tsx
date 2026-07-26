import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_8px_24px_rgba(124,58,237,0.25)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(124,58,237,0.35)]",
  secondary:
    "bg-violet-600 text-white shadow-[0_8px_24px_rgba(124,58,237,0.25)] hover:-translate-y-0.5 hover:bg-violet-700",
  outline:
    "border border-slate-200 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/60",
  ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-950",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

export function Button({ className, variant = "primary", size = "md", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}
