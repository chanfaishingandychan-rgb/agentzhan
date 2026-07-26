import {
  siAirtable,
  siAsana,
  siDropbox,
  siFigma,
  siGithub,
  siGmail,
  siGooglecalendar,
  siGoogledrive,
  siGoogleforms,
  siHubspot,
  siJira,
  siMake,
  siNotion,
  siPostgresql,
  siShopify,
  siStripe,
  siSupabase,
  siTrello,
  siVercel,
  siWordpress,
  siZapier,
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
  "google-drive-agent-plugin": { label: siGoogledrive.title, path: siGoogledrive.path, hex: siGoogledrive.hex, fallback: "D", bg: "bg-white" },
  "google-calendar-agent-plugin": { label: siGooglecalendar.title, path: siGooglecalendar.path, hex: siGooglecalendar.hex, fallback: "C", bg: "bg-white" },
  "slack-team-plugin": { label: "Slack", fallback: "S", bg: "bg-white" },
  "airtable-database-plugin": { label: siAirtable.title, path: siAirtable.path, hex: siAirtable.hex, fallback: "A", bg: "bg-white" },
  "trello-task-plugin": { label: siTrello.title, path: siTrello.path, hex: siTrello.hex, fallback: "T", bg: "bg-white" },
  "asana-project-plugin": { label: siAsana.title, path: siAsana.path, hex: siAsana.hex, fallback: "A", bg: "bg-white" },
  "dropbox-file-plugin": { label: siDropbox.title, path: siDropbox.path, hex: siDropbox.hex, fallback: "D", bg: "bg-white" },
  "github-agent-plugin": { label: siGithub.title, path: siGithub.path, hex: siGithub.hex, fallback: "GH", bg: "bg-white" },
  "vercel-deploy-plugin": { label: siVercel.title, path: siVercel.path, hex: siVercel.hex, fallback: "▲", bg: "bg-white" },
  "supabase-database-plugin": { label: siSupabase.title, path: siSupabase.path, hex: siSupabase.hex, fallback: "S", bg: "bg-white" },
  "jira-issue-plugin": { label: siJira.title, path: siJira.path, hex: siJira.hex, fallback: "J", bg: "bg-white" },
  "figma-design-plugin": { label: siFigma.title, path: siFigma.path, hex: siFigma.hex, fallback: "F", bg: "bg-white" },
  "lead-capture-plugin": { label: "Google Forms", path: siGoogleforms.path, hex: siGoogleforms.hex, fallback: "F", bg: "bg-white" },
  "seo-content-plugin": { label: "PostgreSQL", path: siPostgresql.path, hex: siPostgresql.hex, fallback: "SEO", bg: "bg-white" },
  "hubspot-crm-plugin": { label: siHubspot.title, path: siHubspot.path, hex: siHubspot.hex, fallback: "H", bg: "bg-white" },
  "wordpress-content-plugin": { label: siWordpress.title, path: siWordpress.path, hex: siWordpress.hex, fallback: "W", bg: "bg-white" },
  "zapier-automation-plugin": { label: siZapier.title, path: siZapier.path, hex: siZapier.hex, fallback: "Z", bg: "bg-white" },
  "make-automation-plugin": { label: siMake.title, path: siMake.path, hex: siMake.hex, fallback: "M", bg: "bg-white" },
  "shopify-store-plugin": { label: siShopify.title, path: siShopify.path, hex: siShopify.hex, fallback: "S", bg: "bg-white" },
  "stripe-payment-plugin": { label: siStripe.title, path: siStripe.path, hex: siStripe.hex, fallback: "$", bg: "bg-white" },
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
