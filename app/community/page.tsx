import type { Metadata } from "next";
import Link from "next/link";

import { CommunityBoard } from "@/components/community-board";
import { getCommunityThreads } from "@/lib/community";

export const metadata: Metadata = {
  title: "AI討論區 - Agent站",
  description: "在 Agent站 AI討論區公开讨论 AI 模型、提示词、插件安装、工作流和网站运营问题。",
  alternates: {
    canonical: "/community",
  },
};

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const { threads, storageMode } = await getCommunityThreads(30);

  return (
    <main className="bg-[#f5f5f5]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-950">AI討論區</h1>
            <p className="mt-1 text-sm text-slate-500">公开讨论模型、提示词、插件和工作流问题。</p>
          </div>
          <Link
            href="/consulting#wechat"
            className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-yellow-300 hover:bg-yellow-50"
          >
            微信交流
          </Link>
        </div>
      </section>

      <section id="ask" className="mx-auto max-w-3xl scroll-mt-24 py-4 sm:px-4">
        {storageMode === "fallback" ? (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            数据库暂时未连接，页面先显示示例讨论；连接 Supabase 后会自动保存真实问题和回应。
          </div>
        ) : null}
        <CommunityBoard initialThreads={threads} />
      </section>
    </main>
  );
}
