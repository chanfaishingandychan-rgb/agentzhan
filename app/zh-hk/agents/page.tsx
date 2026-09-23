import type { Metadata } from "next";

import { AgentMarketplacePage } from "@/components/agent-marketplace-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Agent 競價排行榜及產品目錄",
  description: "探索全球 AI Agent、工具及自動化產品，清楚區分贊助排名與自然上架內容。",
  alternates: { canonical: `${siteConfig.url}/zh-hk/agents`, languages: { en: `${siteConfig.url}/agents`, "zh-HK": `${siteConfig.url}/zh-hk/agents`, "zh-CN": `${siteConfig.url}/zh-cn/agents` } },
};

export const dynamic = "force-dynamic";

export default function AgentsZhHkPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <AgentMarketplacePage locale="zh-hk" searchParams={searchParams} />;
}
