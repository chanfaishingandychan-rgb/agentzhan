import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Skill 插件代安装服务 - Agent站",
  description:
    "Agent站提供 AI Skill、Agent 插件和自动化工作流代安装服务，适合需要连接 Notion、Gmail、Google Drive、GitHub、Vercel、Supabase 等工具的用户。",
  alternates: {
    canonical: `${siteConfig.url}/products/ai-skill-install-service`,
  },
  openGraph: {
    title: "AI Skill 插件代安装服务 - Agent站",
    description: "把 AI 接到真实工具里：插件代安装、权限配置、流程测试和使用说明。",
    url: `${siteConfig.url}/products/ai-skill-install-service`,
    siteName: siteConfig.name,
    type: "website",
  },
};

const packages = [
  {
    name: "单个 Skill 代安装",
    price: "¥68 起",
    badge: "入门",
    description: "适合只想先接一个工具，例如 Notion、Gmail、Google Drive、Trello 或 Vercel。",
    includes: ["确认账号和工具权限", "协助连接 1 个 Skill / 插件", "完成一次可用性测试", "提供基础使用说明"],
  },
  {
    name: "工作流配置包",
    price: "¥198 起",
    badge: "推荐",
    description: "适合想把多个工具串成流程，例如表单线索、邮件跟进、资料整理、内容发布。",
    includes: ["梳理一个业务场景", "连接 2-3 个工具", "配置提示词和执行步骤", "交付一份使用流程说明"],
  },
  {
    name: "企业流程评估",
    price: "¥499 起",
    badge: "定制",
    description: "适合小团队或公司，先评估哪些流程适合 AI Agent，再决定是否落地。",
    includes: ["30-60 分钟需求沟通", "分析可自动化流程", "推荐工具组合", "输出落地优先级清单"],
  },
];

const useCases = [
  "把客户表单写入表格或数据库，并提醒微信跟进",
  "让 AI 读取 Notion / Google Drive 资料，整理成摘要和待办",
  "连接 GitHub / Vercel，协助检查网站部署和构建错误",
  "把邮件、日历、任务看板整理成每天的工作清单",
  "为客服、内容、电商或小团队搭建固定 AI 工作流",
];

export default function AiSkillInstallServicePage() {
  return (
    <main className="bg-[#fafafa]">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8 lg:py-24">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="premium">Skill 售卖</Badge>
              <Badge variant="blue">插件代安装</Badge>
              <Badge variant="violet">工作流配置</Badge>
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              AI Skill 插件代安装服务
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              不是只告诉你插件在哪里，而是帮你确认需求、连接工具、测试流程，并把使用方法整理成你能重复执行的步骤。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#wechat"
                className="inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
              >
                微信咨询安装
              </a>
              <Link
                href="/skills"
                className="inline-flex h-12 items-center rounded-full border border-white/15 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                先看插件库
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
            <div className="text-sm font-semibold text-violet-100">适合谁</div>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              <li>不会连接插件，但想让 AI 处理真实工具的人</li>
              <li>有网站、邮箱、文档、数据库或客户资料的小团队</li>
              <li>想用 AI 做内容、客服、线索、部署或资料整理的人</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-3">
          {packages.map((item) => (
            <article key={item.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <Badge variant={item.badge === "推荐" ? "premium" : item.badge === "定制" ? "blue" : "violet"}>
                  {item.badge}
                </Badge>
                <div className="text-3xl font-black text-slate-950">{item.price}</div>
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">{item.name}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              <ul className="mt-5 space-y-3">
                {item.includes.map((include) => (
                  <li key={include} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {include}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <div className="text-sm font-semibold text-violet-700">可落地场景</div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Skill 要卖的是结果，不只是安装</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              用户真正需要的是：插件接好后，AI 能帮他少做重复工作。所以服务会先确认场景，再决定应该接什么工具。
            </p>
          </div>
          <div className="grid gap-3">
            {useCases.map((useCase) => (
              <div key={useCase} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                {useCase}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="wechat" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 rounded-[2rem] border border-violet-200 bg-gradient-to-br from-white via-violet-50 to-blue-50 p-6 shadow-sm sm:p-8 lg:grid-cols-[220px_1fr]">
          <div className="rounded-3xl border border-white bg-white p-5 shadow-sm">
            <Image src="/wechat-qr.jpg" alt="Agent站微信咨询二维码" width={180} height={180} className="h-44 w-44" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-sm font-semibold text-violet-700">购买流程</div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">先加微信，确认可行后再付款</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              发送你想连接的工具、使用场景、是否已有账号和遇到的问题。我会先判断是否适合安装，确认价格和交付范围后再开始。
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["说明需求", "确认报价", "安装交付"].map((step, index) => (
                <div key={step} className="rounded-2xl border border-white bg-white/80 p-4">
                  <div className="text-xs font-semibold text-slate-400">STEP {index + 1}</div>
                  <div className="mt-1 font-bold text-slate-950">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
