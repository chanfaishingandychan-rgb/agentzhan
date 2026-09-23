import type { Metadata } from "next";

import { AgentSubmissionPage } from "@/components/agent-submission-page";

export const metadata: Metadata = {
  title: "Submit an AI product",
  description: "Submit an AI agent, tool or automation to the Agentzhan directory for review.",
};

export default function Page() {
  return <AgentSubmissionPage locale="en" />;
}
