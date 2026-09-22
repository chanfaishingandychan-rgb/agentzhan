import type { Metadata } from "next";
import Link from "next/link";

import { exampleCases } from "@/lib/examples";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Skill 示例中心 - Agent站",
  description:
    "查看 AI 办公、内容引流和客服回复的真实输入输出示例，了解 Agent站 Skill 包买回去能产出什么。",
  alternates: {
    canonical: `${siteConfig.url}/examples`,
  },
  openGraph: {
    title: "AI Skill 示例中心 - Agent站",
    description: "用前后对比示例展示 AI Skill 怎样把乱资料变成可用成果。",
    url: `${siteConfig.url}/examples`,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function ExamplesPage() {
  return (
    <main className="bg-[#fafafa]">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-violet-100">
            示例中心
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            买 Skill 之前，先看它能产出什么
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            这里用真实场景做前后对比：左边是普通人给 AI 的零散输入，右边是 Skill 流程整理后的结果。看懂结果，再决定要不要买。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="space-y-8">
          {exampleCases.map((item) => (
            <article key={item.slug} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-6 sm:p-8">
                <div className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                  {item.category}
                </div>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">{item.title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
              <div className="grid gap-0 lg:grid-cols-2">
                <div className="border-b border-slate-200 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                  <div className="text-sm font-bold text-slate-500">{item.beforeLabel}</div>
                  <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                    {item.before}
                  </pre>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="text-sm font-bold text-violet-700">{item.afterLabel}</div>
                  <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-violet-100 bg-violet-50/70 p-5 text-sm leading-7 text-slate-800">
                    {item.after}
                  </pre>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-4 border-t border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:p-8">
                <div>
                  <div className="text-xs font-semibold text-slate-400">对应工具或服务</div>
                  <div className="mt-1 text-base font-bold text-slate-950">{item.relatedSkillTitle}</div>
                </div>
                <Link
                  href={`/examples/${item.slug}`}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-violet-700 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50"
                >
                  查看完整示例
                </Link>
                <Link
                  href={item.relatedSkillHref}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
                >
                  查看详情
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
