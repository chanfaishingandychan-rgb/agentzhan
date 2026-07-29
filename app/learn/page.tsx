import type { Metadata } from "next";
import Link from "next/link";

import { learnTasks } from "@/lib/learn";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI新手每日任务",
  description: "每天 10 分钟，从零开始跟着图文步骤学习 AI。适合完全不会 ChatGPT、DeepSeek、Kimi 的 AI 小白。",
  alternates: {
    canonical: `${siteConfig.url}/learn`,
  },
  openGraph: {
    title: "AI新手每日任务 - Agent站",
    description: "每天一个小任务，跟着图文一步步学会用 AI。",
    url: `${siteConfig.url}/learn`,
    siteName: siteConfig.name,
    type: "website",
  },
};

const guideCards = [
  ["不用懂术语", "每一步都写明要按哪里、复制什么、怎样追问。"],
  ["先完成任务", "不讲太多理论，先让你做出一段文案、一份计划、一个脚本。"],
  ["可以发作业", "完成后到 AI讨论区交流，让别人帮你改得更自然。"],
];

function LearningVisual() {
  return (
    <div className="mt-4 overflow-hidden rounded-[1.6rem] border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-violet-50 p-4">
      <div className="grid gap-3 sm:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[1.4rem] border border-white bg-white/85 p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            </div>
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700">
              图文教学
            </span>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-2/3 rounded-full bg-slate-200" />
            <div className="h-3 w-full rounded-full bg-slate-100" />
            <div className="h-3 w-5/6 rounded-full bg-slate-100" />
          </div>
          <div className="mt-5 rounded-2xl bg-gradient-to-r from-rose-500 to-violet-600 p-3 text-xs font-bold text-white shadow-[0_12px_30px_rgba(225,29,72,0.22)]">
            复制提示词 → 填资料 → 追问修改
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-white bg-slate-950 p-4 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-violet-600 text-xs font-black">
              AI
            </span>
            <div>
              <div className="text-sm font-bold">学习助手</div>
              <div className="text-xs text-slate-400">按步骤帮你改到能用</div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs leading-5">
            <div className="mr-8 rounded-2xl bg-white/10 px-3 py-2 text-slate-200">
              我是新手，今天要学什么？
            </div>
            <div className="ml-8 rounded-2xl bg-white px-3 py-2 text-slate-800">
              先做一个 10 分钟任务，完成后再学下一步。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <main className="bg-gradient-to-b from-white via-rose-50/30 to-white">
      <section className="relative overflow-hidden border-b border-rose-100 bg-white">
        <div className="absolute inset-0 bg-grid opacity-[0.45]" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-rose-200/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 -left-32 h-96 w-96 rounded-full bg-violet-200/60 blur-3xl" />
        <div className="pointer-events-none absolute bottom-16 right-1/4 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-semibold text-violet-700">
              AI 小白从这里开始
            </div>
            <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              每天 10 分钟，跟着图文一步步学会用 AI
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              不需要懂模型、插件、API。第一版先做 7 天任务，每天完成一件很小的事：写自我介绍、改小红书文案、整理文章、做计划、回复消息、写脚本、制定学习路线。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/learn/day-1"
                className="inline-flex h-12 items-center rounded-full bg-gradient-to-r from-rose-500 to-violet-600 px-7 text-sm font-bold text-white shadow-[0_12px_36px_rgba(225,29,72,0.25)] transition hover:-translate-y-0.5"
              >
                从第 1 天开始
              </Link>
              <Link
                href="/community"
                className="inline-flex h-12 items-center rounded-full border border-slate-200 bg-white px-7 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50"
              >
                去 AI讨论区交作业
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-rose-200/70 via-violet-200/50 to-cyan-200/70 blur-2xl" />
            <div className="relative rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
              <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-200">7 Day Path</div>
                    <div className="mt-1 text-xl font-bold">AI 新手学习路线</div>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">零基础</span>
                </div>
                <div className="mt-5 space-y-3">
                  {learnTasks.slice(0, 4).map((task) => (
                    <Link
                      key={task.slug}
                      href={`/learn/${task.slug}`}
                      className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3 transition hover:bg-white/[0.1]"
                    >
                      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${task.color} text-sm font-black`}>
                        D{task.day}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-white">{task.shortTitle}</span>
                        <span className="mt-0.5 block truncate text-xs text-slate-400">{task.outcome}</span>
                      </span>
                      <span className="text-xs text-slate-400">{task.time}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <LearningVisual />
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {guideCards.map(([title, desc]) => (
                  <div key={title} className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
                    <div className="text-sm font-bold text-slate-950">{title}</div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="text-sm font-semibold text-violet-600">7 天入门任务</div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              每天只做一件小事
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-500">
            顺序不用跳。第 1 天先学会开口问 AI，第 7 天再让 AI 帮你制定自己的 30 天路线。
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {learnTasks.map((task) => (
            <Link
              key={task.slug}
              href={`/learn/${task.slug}`}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_56px_rgba(15,23,42,0.10)]"
            >
              <div className={`h-2 bg-gradient-to-r ${task.color}`} />
              <div className="relative p-5">
                <div className="pointer-events-none absolute right-4 top-4 h-20 w-20 rounded-full bg-gradient-to-br from-rose-100 to-violet-100 opacity-70 blur-xl" />
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${task.color} text-sm font-black text-white shadow-lg`}>
                    DAY {task.day}
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{task.level}</span>
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">{task.time}</span>
                  </div>
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-950 group-hover:text-violet-700">
                  {task.shortTitle}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{task.description}</p>
                <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xs font-bold text-slate-500">完成后你会得到</div>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{task.outcome}</p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-400">{task.steps.length} 个图文步骤</span>
                  <span className="text-sm font-semibold text-violet-600 transition group-hover:translate-x-0.5">
                    开始学习 →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
