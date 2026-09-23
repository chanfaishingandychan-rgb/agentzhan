/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils";

const tones = [
  "bg-neutral-950 text-white",
  "bg-emerald-700 text-white",
  "bg-blue-700 text-white",
  "bg-amber-400 text-neutral-950",
  "bg-rose-700 text-white",
  "bg-cyan-800 text-white",
];

export function AgentLogo({ name, logoUrl, className }: { name: string; logoUrl?: string | null; className?: string }) {
  const tone = tones[name.charCodeAt(0) % tones.length];

  if (logoUrl) {
    return (
      <span className={cn("flex shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white", className)}>
        <img src={logoUrl} alt={`${name} logo`} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-lg text-base font-semibold", tone, className)} aria-hidden="true">
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}
