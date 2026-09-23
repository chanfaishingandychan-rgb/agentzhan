import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border border-neutral-300 bg-white px-3.5 text-base text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100",
        className,
      )}
      {...props}
    />
  );
}
