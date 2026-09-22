import type { Metadata } from "next";
import Link from "next/link";

import { LeadCaptureForm } from "@/components/lead-capture-form";
import { siteConfig } from "@/lib/site";

const packCards = [
  {
    title: "100 个 AI 提效 Prompt",
    desc: "覆盖写作、办公、客服、电商、短视频和学习，适合新手马上复制使用。",
  },
  {
    title: "小红书 30 天内容框架",
    desc: "选题、标题、正文、评论区互动和复盘方向，适合内容账号冷启动。",
  },
  {
    title: "电商成交话术清单",
    desc: "商品卖点、客服回复、活动文案和售后安抚，帮助小店提升转化。",
  },
  {
    title: "AI 办公模板包",
    desc: "会议纪要、周报、邮件、SOP 和资料总结，适合上班族日常提效。",
  },
];

const useCases = [
  "不知道 ChatGPT 该怎么问",
  "想用 AI 写内容但结果太像模板",
  "想给店铺、账号或团队做一套 AI 流程",
  "想先试用免费资料，再决定是否购买付费包或咨询服务",
];

export const metadata: Metadata = {
  title: "免费 AI 工作包",
  description: "免费领取 Agent站整理的 AI Prompt、内容模板、电商话术和办公提效工作包。",
  alternates: {
    canonical: `${siteConfig.url}/free-ai-pack`,
  },
  openGraph: {
    title: "免费 AI 工作包 - Agent站",
    description: "领取 AI Prompt、内容模板、电商话术和办公提效资料，先把 AI 用到真实工作里。",
    url: `${siteConfig.url}/free-ai-pack`,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function FreeAiPackPage() {
  return (
    <main className="bg-[#fafafa]">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.05]" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-600/15 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr,0.85fr] lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-violet-100">
              免费资源
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              免费领取 AI 工作包，把提示词变成每天能用的流程
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              留下邮箱，选择你最需要的资料。Agent站会优先发送可复制的 Prompt、模板和落地清单，后续再按需求推荐更完整的付费包或咨询服务。
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {useCases.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur">
            <div className="rounded-2xl bg-white p-5">
              <div className="text-sm font-semibold text-violet-700">选择一个你最想要的工作包</div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">先领取免费版</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                邮箱只用于发送资料和后续更新。你可以先拿免费资料测试，觉得有用再考虑付费 Prompt 包或一对一咨询。
              </p>
              <LeadCaptureForm source="free-ai-pack-page" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {packCards.map((pack) => (
            <div key={pack.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-sm font-bold text-violet-700">
                AI
              </div>
              <h2 className="mt-5 text-lg font-bold tracking-tight text-slate-950">{pack.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{pack.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr,1.1fr] lg:px-8">
          <div>
            <div className="text-sm font-semibold text-violet-700">为什么先做免费入口</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">变现不是先卖东西，而是先知道访客想要什么</h2>
          </div>
          <div className="space-y-4 text-sm leading-7 text-slate-600">
            <p>
              Agent站现在有教程、Prompt、AI 小说和工具内容。免费工作包可以把这些浏览量集中起来，判断用户最关心的是写作、办公、电商、内容运营还是企业工作流。
            </p>
            <p>
              当某一类领取人数明显增加，就可以优先制作对应的付费 Prompt 包、咨询服务或工具推荐页，避免盲目做产品。
            </p>
            <div className="pt-2">
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products/ai-office-prompt-pack"
                  className="inline-flex items-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
                >
                  查看 ¥29.9 办公 Prompt 包
                </Link>
                <Link
                  href="/guides"
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:border-violet-200 hover:bg-violet-50"
                >
                  先看 AI 教程
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
