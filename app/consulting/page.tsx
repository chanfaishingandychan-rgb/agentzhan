import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "AI 咨询与交流群",
  description: "Agent站提供模型使用咨询、AI 插件安装、工作流搭建、AI 小白微信交流群和企业 AI 落地建议。",
};

const serviceItems = [
  {
    title: "模型使用咨询",
    desc: "帮你判断 ChatGPT、Claude、DeepSeek、Kimi、Gemini 等模型适合哪些任务，避免一直换工具试错。",
    color: "from-violet-500 to-fuchsia-500",
    points: ["模型选择", "会员方案判断", "提示词用法"],
  },
  {
    title: "AI 插件安装",
    desc: "协助连接邮箱、文档、Notion、代码仓库、数据库和网站后台，让 AI 能读取资料和执行动作。",
    color: "from-blue-500 to-cyan-500",
    points: ["插件选择", "连接设置", "权限检查"],
  },
  {
    title: "工作流搭建",
    desc: "把选题、写作、客服、线索收集、资料整理、内容更新等重复工作整理成可复用流程。",
    color: "from-emerald-500 to-teal-500",
    points: ["流程梳理", "工具组合", "落地测试"],
  },
  {
    title: "企业 AI 咨询",
    desc: "面向小团队和中小企业，先找最值得做的场景，再设计工具组合、培训和维护方式。",
    color: "from-amber-400 to-orange-500",
    points: ["场景诊断", "落地优先级", "团队培训"],
  },
];

const processSteps = [
  ["先说需求", "你告诉我现在想用 AI 解决什么问题，例如写内容、做客服、整理资料或接插件。"],
  ["判断方案", "我帮你判断应该先用哪个模型、需不需要插件、是否值得做自动化。"],
  ["给出做法", "整理成可以直接执行的步骤，必要时帮你检查设置和测试效果。"],
];

export default function ConsultingPage() {
  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <Badge variant="violet">AI 咨询服务</Badge>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              不知道 AI 怎么用，先从这里开始
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Agent站可以帮你选择模型、安装插件、整理 Prompt 和搭建工作流。适合 AI 新手、个人站长、小团队和中小企业。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#wechat-consulting"
                className="inline-flex h-12 items-center rounded-full bg-slate-950 px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                扫码咨询
              </a>
              <a
                href="#wechat-group"
                className="inline-flex h-12 items-center rounded-full border border-slate-200 bg-white px-7 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
              >
                加入交流群
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {serviceItems.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-sm font-black text-white shadow-sm`}>
                  AI
                </div>
                <h2 className="text-lg font-bold text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.points.map((point) => (
                    <span key={point} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
                      {point}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Badge variant="blue">适合谁</Badge>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">
                不是卖课程，先帮你把问题弄清楚
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                很多人卡住不是因为 AI 太难，而是不知道应该先解决哪个场景。先把任务、资料、工具和输出标准讲清楚，AI 才会真的帮到你。
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {processSteps.map(([title, desc], index) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 font-bold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article id="wechat-group" className="scroll-mt-24 rounded-2xl border border-violet-100 bg-violet-50/70 p-6">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="shrink-0 rounded-2xl border border-white bg-white p-3 shadow-sm">
                <Image src="/wechat-group-qr.jpg" alt="AI小白微信交流群二维码" width={180} height={180} className="h-44 w-44" />
              </div>
              <div className="min-w-0">
                <Badge variant="violet">AI小白微信交流群</Badge>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">想和大家一起交流，扫这个群码</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  适合讨论模型使用、Prompt 写法、插件选择、AI 工具和入门问题。群码失效时，可以扫个人微信咨询。
                </p>
              </div>
            </div>
          </article>

          <article id="wechat-consulting" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="shrink-0 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                <Image src="/wechat-qr.jpg" alt="微信咨询二维码" width={180} height={180} className="h-44 w-44" />
              </div>
              <div className="min-w-0">
                <Badge variant="success">一对一微信咨询</Badge>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">需要私聊解决问题，扫这个个人微信</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  适合模型选择、插件安装、网站接入、企业 AI 工作流和具体项目落地咨询。
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-950 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">也可以先自己查资料</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              先看插件库、Prompt 和 AI 资讯，遇到不会做的地方再加微信问。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/skills" className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:bg-violet-50">
              查看插件库
            </Link>
            <Link href="/search" className="inline-flex h-11 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:bg-white/10">
              搜索 Prompt
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
