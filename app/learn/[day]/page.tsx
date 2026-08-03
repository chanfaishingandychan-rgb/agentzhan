import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyButton } from "@/components/copy-button";
import { getLearnTask, getNextLearnTask, getPreviousLearnTask, learnTasks, type LearnStep } from "@/lib/learn";
import { siteConfig } from "@/lib/site";

type LearnTaskPageProps = {
  params: Promise<{ day: string }>;
};

const learnGradient = "from-rose-500 to-violet-600";

export function generateStaticParams() {
  return learnTasks.map((task) => ({ day: task.slug }));
}

export async function generateMetadata({ params }: LearnTaskPageProps): Promise<Metadata> {
  const { day } = await params;
  const task = getLearnTask(day);
  if (!task) return {};

  return {
    title: task.title,
    description: task.description,
    alternates: {
      canonical: `${siteConfig.url}/learn/${task.slug}`,
    },
    openGraph: {
      title: `${task.title} - Agent站`,
      description: task.description,
      url: `${siteConfig.url}/learn/${task.slug}`,
      siteName: siteConfig.name,
      type: "article",
    },
  };
}

function PhoneMockup({ step, index, color }: { step: LearnStep; index: number; color: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[20rem]">
      <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-rose-200 via-white to-violet-200 blur-xl" />
      <div className="relative rounded-[2.2rem] border border-slate-200 bg-slate-950 p-2 shadow-[0_22px_70px_rgba(15,23,42,0.22)]">
        <div className="rounded-[1.75rem] bg-gradient-to-b from-white via-rose-50/40 to-violet-50/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-1.5 w-14 rounded-full bg-slate-200" />
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-300" />
              <span className="h-2 w-2 rounded-full bg-violet-300" />
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-white bg-white/90 p-3 shadow-sm">
            <div>
              <div className="text-[11px] font-semibold text-slate-400">STEP {index + 1}</div>
              <div className="mt-0.5 text-sm font-bold text-slate-950">{step.visualTitle}</div>
            </div>
            <span className={`flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-xs font-black text-white`}>
              {index + 1}
            </span>
          </div>
          <div className="mt-4 space-y-2">
            {step.visualLines.map((line, lineIndex) => (
              <div
                key={line}
                className={`flex items-start gap-2 rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm ${
                  lineIndex === step.visualLines.length - 1
                    ? "ml-4 bg-gradient-to-r from-rose-500 to-violet-600 text-white"
                    : "mr-4 border border-white bg-white text-slate-700"
                }`}
              >
                <span
                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                    lineIndex === step.visualLines.length - 1 ? "bg-white/80" : "bg-violet-300"
                  }`}
                />
                {line}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-rose-100 bg-white/90 px-3 py-2 text-xs leading-5 text-slate-600 shadow-sm">
            <span className="font-bold text-violet-700">提示：</span>
            {step.tip}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function LearnTaskPage({ params }: LearnTaskPageProps) {
  const { day } = await params;
  const task = getLearnTask(day);
  if (!task) notFound();

  const previousTask = getPreviousLearnTask(task.day);
  const nextTask = getNextLearnTask(task.day);

  return (
    <main className="bg-[#fafafa]">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-grid opacity-[0.45]" />
        <div className={`pointer-events-none absolute -right-28 -top-32 h-96 w-96 rounded-full bg-gradient-to-br ${learnGradient} opacity-20 blur-3xl`} />
        <div className="pointer-events-none absolute -bottom-40 -left-28 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="text-violet-600 transition hover:text-violet-700">首页</Link>
            <span>/</span>
            <Link href="/learn" className="text-violet-600 transition hover:text-violet-700">AI新手每日任务</Link>
            <span>/</span>
            <span className="text-slate-400">第 {task.day} 天</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full bg-gradient-to-r ${learnGradient} px-3 py-1 text-xs font-bold text-white`}>
              DAY {task.day}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
              {task.level}
            </span>
            <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              {task.time}
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            {task.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{task.description}</p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {[
              ["今天目标", task.outcome],
              ["适合人群", "完全不会 AI，也可以照着做"],
              ["完成方式", "复制提示词，按步骤追问修改"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-rose-100 bg-white/90 p-4 shadow-sm">
                <div className="text-sm font-bold text-slate-950">{title}</div>
                <p className="mt-1 text-sm leading-6 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">开始前准备</h2>
            <div className="mt-5 space-y-3">
              {task.prepare.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${learnGradient} text-xs font-bold text-white`}>
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-rose-50 via-white to-violet-50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">今天直接复制这段</h2>
              <CopyButton text={task.prompt} />
            </div>
            <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-white bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm">
              {task.prompt}
            </pre>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">不会填？照这个例子改</h2>
          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
            {task.example}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-8">
            <div className="text-sm font-semibold text-violet-600">图文步骤</div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              跟着这 {task.steps.length} 步做，不用自己想
            </h2>
          </div>
          <div className="space-y-8">
            {task.steps.map((step, index) => (
              <section
                key={step.title}
                className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_22rem] lg:p-6"
              >
                <div className="flex flex-col justify-center">
                  <div className="mb-4 flex items-center gap-3">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${learnGradient} text-sm font-black text-white shadow-lg`}>
                      {index + 1}
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-950">{step.title}</h3>
                  </div>
                  <p className="text-base font-semibold leading-8 text-slate-800">{step.action}</p>
                  <p className="mt-3 text-sm leading-8 text-slate-600">{step.detail}</p>
                  <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
                    <span className="font-bold">小白提醒：</span>
                    {step.tip}
                  </div>
                </div>
                <PhoneMockup step={step} index={index} color={learnGradient} />
              </section>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">AI 回答不满意时，这样追问</h2>
            <div className="mt-5 space-y-3">
              {task.followUps.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm leading-7 text-slate-700">{item}</p>
                  <div className="mt-3">
                    <CopyButton text={item} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-rose-100 bg-rose-50/70 p-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">新手最容易犯的错</h2>
            <ul className="mt-5 space-y-3">
              {task.mistakes.map((item) => (
                <li key={item} className="rounded-2xl border border-white bg-white p-4 text-sm leading-7 text-slate-700 shadow-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-12 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="text-sm font-semibold text-violet-200">今日作业</div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">{task.homework}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                完成后可以发到 AI讨论区。你不用发得很完美，先发出来，别人才能帮你改。
              </p>
            </div>
            <Link
              href="/community"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              去讨论区交作业
            </Link>
          </div>
        </section>

        <nav className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {previousTask ? (
            <Link
              href={`/learn/${previousTask.slug}`}
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
            >
              ← 第 {previousTask.day} 天：{previousTask.shortTitle}
            </Link>
          ) : (
            <Link
              href="/learn"
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
            >
              ← 返回学习区
            </Link>
          )}
          {nextTask ? (
            <Link
              href={`/learn/${nextTask.slug}`}
              className={`inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r ${learnGradient} px-5 text-sm font-bold text-white transition hover:-translate-y-0.5`}
            >
              第 {nextTask.day} 天：{nextTask.shortTitle} →
            </Link>
          ) : (
            <Link
              href="/learn"
              className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              回到 14 天路线
            </Link>
          )}
        </nav>
      </article>
    </main>
  );
}
