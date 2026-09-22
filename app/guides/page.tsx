import type { Metadata } from "next";
import Link from "next/link";

import { getAllGuides } from "@/lib/guides";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI教程",
  description: "Agent站 AI教程中心，整理 ChatGPT、DeepSeek、AI办公、AI电商、AI客服、短视频和工作流实用教学。",
  alternates: {
    canonical: `${siteConfig.url}/guides`,
  },
  openGraph: {
    title: "AI教程 - Agent站",
    description: "从新手入门到工作流落地，按场景学习怎么把 AI 用到真实工作里。",
    url: `${siteConfig.url}/guides`,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <main className="bg-[#fafafa]">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.05]" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-violet-100">
            AI GUIDE
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            AI教程：把 ChatGPT、DeepSeek 和 AI 工具用到真实工作
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            这里不是新闻列表，而是长期可复用的 AI 实战教学。每篇都围绕一个真实场景，给你步骤、提示词、检查清单和相关资源。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group flex min-h-[24rem] flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_56px_rgba(15,23,42,0.10)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                  {guide.category}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  {guide.readingTime}
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 group-hover:text-violet-700">
                {guide.title}
              </h2>
              <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600">{guide.description}</p>
              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs font-bold text-slate-500">看完后你会得到</div>
                <p className="mt-1 text-sm leading-6 text-slate-700">{guide.outcome}</p>
              </div>
              <div className="mt-auto pt-6">
                <div className="flex flex-wrap gap-2">
                  {guide.keywords.slice(0, 3).map((keyword) => (
                    <span key={keyword} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                      {keyword}
                    </span>
                  ))}
                </div>
                <div className="mt-5 border-t border-slate-100 pt-4 text-sm font-semibold text-violet-600">
                  阅读教程 →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
