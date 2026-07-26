import { cn } from "@/lib/utils";

const iconMap: Record<string, { label: string; bg: string; fg: string; mark: string }> = {
  "notion-agent-plugin": { label: "Notion", bg: "bg-white", fg: "text-black", mark: "N" },
  "gmail-agent-plugin": { label: "Gmail", bg: "bg-white", fg: "text-red-500", mark: "M" },
  "github-agent-plugin": { label: "GitHub", bg: "bg-slate-950", fg: "text-white", mark: "GH" },
  "vercel-deploy-plugin": { label: "Vercel", bg: "bg-black", fg: "text-white", mark: "▲" },
  "supabase-database-plugin": { label: "Supabase", bg: "bg-emerald-500", fg: "text-white", mark: "S" },
  "lead-capture-plugin": { label: "Leads", bg: "bg-violet-600", fg: "text-white", mark: "L" },
  "seo-content-plugin": { label: "SEO", bg: "bg-blue-600", fg: "text-white", mark: "SEO" },
  "customer-service-plugin": { label: "Service", bg: "bg-amber-500", fg: "text-white", mark: "CS" },
};

export function PluginIcon({ slug, className }: { slug: string; className?: string }) {
  const icon = iconMap[slug] ?? { label: "Plugin", bg: "bg-slate-900", fg: "text-white", mark: "P" };

  return (
    <div
      aria-label={icon.label}
      className={cn(
        "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-base font-black shadow-sm ring-1 ring-black/5",
        icon.bg,
        icon.fg,
        className,
      )}
      title={icon.label}
    >
      <span className={cn(icon.mark.length > 1 && "text-xs tracking-tight")}>{icon.mark}</span>
    </div>
  );
}
