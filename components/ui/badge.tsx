import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "muted" | "violet" | "blue" | "success" | "premium";

const badgeStyles: Record<BadgeVariant, string> = {
  default: "border-slate-200 bg-white text-slate-700",
  muted: "border-slate-200 bg-slate-100 text-slate-600",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  premium: "border-amber-200 bg-amber-50 text-amber-700",
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        badgeStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
