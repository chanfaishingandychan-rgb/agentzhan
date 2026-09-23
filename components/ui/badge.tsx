import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "muted" | "violet" | "blue" | "success" | "premium";

const badgeStyles: Record<BadgeVariant, string> = {
  default: "border-neutral-300 bg-white text-neutral-700",
  muted: "border-neutral-200 bg-neutral-100 text-neutral-600",
  violet: "border-neutral-300 bg-neutral-50 text-neutral-800",
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
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        badgeStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
