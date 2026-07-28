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
    <main className="bg-[#fafafa]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            AI討論區
          </div>
          <h1 className="mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            有 AI 问题，可以在这里公开讨论
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
            每个问题都是一个讨论串，其他人可以在下面继续回应。适合交流模型选择、Prompt 写法、插件安装、AI 工具、工作流和网站运营。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#ask"
              className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              我要提问
            </a>
            <Link
              href="/consulting#wechat"
              className="inline-flex h-11 items-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50"
            >
              微信交流
            </Link>
          </div>
        </div>
      </section>

      <section id="ask" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
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
