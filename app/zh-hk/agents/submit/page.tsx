import type { Metadata } from "next";

import { AgentSubmissionPage } from "@/components/agent-submission-page";

export const metadata: Metadata = {
  title: "提交 AI 產品",
  description: "免費提交 AI Agent、工具或自動化產品，經審核後在 Agentzhan 產品目錄公開。",
};

export default function Page() {
  return <AgentSubmissionPage locale="zh-hk" />;
}
