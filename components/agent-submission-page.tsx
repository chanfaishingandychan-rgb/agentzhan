import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { AgentSubmissionForm } from "@/components/agent-submission-form";
import { agentLocalePaths, agentMessages, type AgentLocale } from "@/lib/agent-marketplace-i18n";
import { getAgentMarketplaceSnapshot } from "@/lib/agent-marketplace";

export async function AgentSubmissionPage({ locale }: { locale: AgentLocale }) {
  const messages = agentMessages[locale];
  const snapshot = await getAgentMarketplaceSnapshot("all");

  return (
    <main className="min-h-screen bg-[#f6f6f3]">
      <section className="border-b border-neutral-300 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Link href={agentLocalePaths[locale]} className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-950">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {messages.backToDirectory}
          </Link>
          <div className="mt-10 flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            {messages.freeReview}
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-neutral-950 sm:text-6xl">{messages.submitTitle}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600">{messages.submitIntro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="border border-neutral-300 bg-white p-5 sm:p-8">
          <AgentSubmissionForm locale={locale} categories={snapshot.categories} />
        </div>
      </section>
    </main>
  );
}
