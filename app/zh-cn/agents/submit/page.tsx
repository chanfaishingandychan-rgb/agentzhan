import type { Metadata } from "next";

import { AgentSubmissionPage } from "@/components/agent-submission-page";

export const metadata: Metadata = {
  title: "提交 AI 产品",
  description: "免费提交 AI Agent、工具或自动化产品，经审核后在 Agentzhan 产品目录公开。",
};

export default function Page() {
  return <AgentSubmissionPage locale="zh-cn" />;
}
