import type { Metadata } from "next";

import { AgentMarketplacePage } from "@/components/agent-marketplace-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Agent 竞价排行榜及产品目录",
  description: "探索全球 AI Agent、工具及自动化产品，清楚区分赞助排名与自然上架内容。",
  alternates: { canonical: `${siteConfig.url}/zh-cn/agents`, languages: { en: `${siteConfig.url}/agents`, "zh-HK": `${siteConfig.url}/zh-hk/agents`, "zh-CN": `${siteConfig.url}/zh-cn/agents` } },
};

export const dynamic = "force-dynamic";

export default function AgentsZhCnPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <AgentMarketplacePage locale="zh-cn" searchParams={searchParams} />;
}
