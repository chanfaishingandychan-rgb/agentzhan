import type { Metadata } from "next";

import { AgentMarketplacePage } from "@/components/agent-marketplace-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Agent Leaderboard and Product Directory",
  description: "Discover AI agents, tools and automations through clearly disclosed sponsored rankings and organic product listings.",
  alternates: { canonical: `${siteConfig.url}/agents`, languages: { en: `${siteConfig.url}/agents`, "zh-HK": `${siteConfig.url}/zh-hk/agents`, "zh-CN": `${siteConfig.url}/zh-cn/agents` } },
};

export const dynamic = "force-dynamic";

export default function AgentsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <AgentMarketplacePage locale="en" searchParams={searchParams} />;
}
