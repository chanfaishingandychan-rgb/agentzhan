import type { Metadata } from "next";
import Link from "next/link";

import { NovelCover } from "@/app/novels/novel-cover";
import { getAllNovels } from "@/lib/novels";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI小说",
  description: "Agent站 AI小说入口，集中展示站长原创小说、章节连载和 AI 辅助创作内容。",
  alternates: {
    canonical: "/novels",
  },
  openGraph: {
    title: "AI小说 - Agent站",
    description: "站长原创小说与 AI 辅助创作连载入口。",
    url: `${siteConfig.url}/novels`,
    locale: "zh_CN",
    type: "website",
  },
};

export default function NovelsPage() {
  const novels = getAllNovels();

  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.05]" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Link href="/" className="text-sm font-semibold text-slate-300 transition hover:text-white">
            返回首页
          </Link>
          <div className="mt-10 max-w-3xl">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-violet-100">
              AI NOVEL
            </div>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              AI小说
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
              这里会放你的原创小说、章节连载和 AI 辅助创作内容。读者可以从作品页进入，按章节连续阅读。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {novels.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {novels.map((novel) => (
              <Link
                key={novel.slug}
                href={`/novels/${novel.slug}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_56px_rgba(15,23,42,0.10)]"
              >
                <NovelCover novel={novel} compact />
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                    {novel.status}
                  </span>
                  {novel.genre.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 group-hover:text-violet-700">
                  {novel.title}
                </h2>
                <p className="mt-2 text-sm font-semibold text-slate-500">{novel.subtitle}</p>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{novel.description}</p>
                <div className="mt-5 border-t border-slate-100 pt-4 text-sm font-semibold text-violet-600">
                  开始阅读 →
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-violet-200 bg-violet-50/60 p-8 lg:p-10">
            <div className="text-sm font-bold text-violet-700">等待小说内容</div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950">
              入口已经准备好，下一步放入你的小说正文。
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-600">
              你可以把小说标题、简介、作者名和章节正文发给我。我会把它整理成作品页和章节阅读页，并保留适合手机阅读的排版。
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
