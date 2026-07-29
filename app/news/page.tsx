import type { Metadata } from "next";
import Link from "next/link";

import { getLatestAiNewsForSite } from "@/lib/news";
import { siteConfig } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "AI最新資訊 - Agent站",
  description: "每日整理 OpenAI、Claude、Gemini、DeepMind、DeepSeek、通义千问、百度文心等 AI 最新消息，并转化成普通用户、站长和企业可理解的使用建议。",
  alternates: {
    canonical: `${siteConfig.url}/news`,
  },
  openGraph: {
    title: "AI最新資訊 - Agent站",
    description: "查看国内外 AI 模型、插件、Agent、自动化和行业应用的最新动态。",
    url: `${siteConfig.url}/news`,
    siteName: siteConfig.name,
    type: "website",
  },
};

const categoryStyles = {
  模型更新: "border-violet-200 bg-violet-50 text-violet-700",
  产品功能: "border-blue-200 bg-blue-50 text-blue-700",
  Agent趋势: "border-cyan-200 bg-cyan-50 text-cyan-700",
  行业应用: "border-emerald-200 bg-emerald-50 text-emerald-700",
  安全与合规: "border-amber-200 bg-amber-50 text-amber-700",
};

export default async function NewsPage() {
  const news = await getLatestAiNewsForSite(20);

  return (
    <main className="bg-[#fafafa]">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-violet-100 backdrop-blur">
              每日 AI 最新消息
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              AI最新資訊
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
              不只是搬运新闻。Agent站会同时关注国外和中国 AI 动态，把模型更新、插件能力、Agent趋势和行业应用，整理成你看得懂、用得上的中文摘要。
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              {[
                [String(news.length), "今日精选"],
                ["国内外", "AI 来源"],
                ["5", "資訊分類"],
                ["每日", "更新计划"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
                  <div className="text-3xl font-bold text-white">{value}</div>
                  <div className="mt-1 text-sm text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="text-sm font-semibold text-violet-600">今日更新</div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              值得关注的 AI 动态
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-500">
            每天 03:00 自动抓取官方来源并生成中文摘要；已加入 DeepSeek、通义千问、百度文心等中国 AI 来源。
          </p>
        </div>

        <div className="grid gap-5">
          {news.map((item) => (
            <article
              key={item.slug}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_56px_rgba(15,23,42,0.10)]"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-950 to-violet-700 text-lg font-black text-white shadow-lg">
                  {item.source.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${categoryStyles[item.category]}`}>
                      {item.category}
                    </span>
                    <span className="text-xs font-medium text-slate-400">{item.publishedAt}</span>
                    <span className="text-xs font-medium text-slate-400">来源：{item.source}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
                    <Link href={`/news/${item.slug}`} className="transition hover:text-violet-600">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.summary}</p>
                  <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
                    <div className="text-xs font-bold text-violet-800">Agent站解读</div>
                    <p className="mt-1 text-sm leading-7 text-violet-950/75">{item.takeaway}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href={`/news/${item.slug}`}
                        className="text-sm font-semibold text-violet-600 transition-all group-hover:translate-x-0.5"
                      >
                        阅读中文解读 →
                      </Link>
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-slate-400 transition hover:text-slate-600"
                      >
                        官方原文
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
