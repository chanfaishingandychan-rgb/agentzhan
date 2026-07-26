import {
  siGithub,
  siGmail,
  siGoogleforms,
  siNotion,
  siPostgresql,
  siSupabase,
  siVercel,
} from "simple-icons";

import { cn } from "@/lib/utils";

type BrandIcon = {
  label: string;
  path?: string;
  hex?: string;
  fallback: string;
  bg?: string;
};

const iconMap: Record<string, BrandIcon> = {
  "notion-agent-plugin": { label: siNotion.title, path: siNotion.path, hex: siNotion.hex, fallback: "N", bg: "bg-white" },
  "gmail-agent-plugin": { label: siGmail.title, path: siGmail.path, hex: siGmail.hex, fallback: "M", bg: "bg-white" },
  "github-agent-plugin": { label: siGithub.title, path: siGithub.path, hex: siGithub.hex, fallback: "GH", bg: "bg-white" },
  "vercel-deploy-plugin": { label: siVercel.title, path: siVercel.path, hex: siVercel.hex, fallback: "▲", bg: "bg-white" },
  "supabase-database-plugin": { label: siSupabase.title, path: siSupabase.path, hex: siSupabase.hex, fallback: "S", bg: "bg-white" },
  "lead-capture-plugin": { label: "Google Forms", path: siGoogleforms.path, hex: siGoogleforms.hex, fallback: "F", bg: "bg-white" },
  "seo-content-plugin": { label: "PostgreSQL", path: siPostgresql.path, hex: siPostgresql.hex, fallback: "SEO", bg: "bg-white" },
  "customer-service-plugin": { label: "AI Customer Service", fallback: "CS", bg: "bg-white" },
};

export function PluginIcon({ slug, className }: { slug: string; className?: string }) {
  const icon = iconMap[slug] ?? { label: "Plugin", fallback: "P", bg: "bg-white", hex: "4f46e5" };

  return (
    <div
      aria-label={icon.label}
      className={cn(
        "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 shadow-sm ring-1 ring-black/5",
        icon.bg,
        className,
      )}
      title={icon.label}
    >
      {icon.path ? (
        <svg className="h-7 w-7" viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d={icon.path} fill={`#${icon.hex ?? "111827"}`} />
        </svg>
      ) : (
        <span className={cn("text-sm font-black text-slate-900", icon.fallback.length > 2 && "text-xs tracking-tight")}>
          {icon.fallback}
        </span>
      )}
    </div>
  );
}
