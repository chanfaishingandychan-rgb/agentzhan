import Link from "next/link";
import Image from "next/image";
import { siClaude, siDeepseek, siGooglegemini, siKimi, siPerplexity, siQwen } from "simple-icons";

import { LeadCaptureForm } from "@/components/lead-capture-form";
import { PromptCard } from "@/components/prompt-card";
import { SectionHeader } from "@/components/section-header";
import { getAllCollections } from "@/lib/collections";
import { getHotTags, getLatestPrompts, getPopularPrompts } from "@/lib/prompts";

const openAiIconPath =
  "M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716m-6.097 8.406a3.05 3.05 0 0 1-1.945-.694l.096-.054 3.23-1.838a.53.53 0 0 0 .265-.455v-4.49l1.366.778q.02.011.025.035v3.722c-.003 1.653-1.361 2.992-3.037 2.996m-6.53-2.75a2.95 2.95 0 0 1-.36-2.01l.095.057L5.29 12.09a.53.53 0 0 0 .527 0l3.949-2.246v1.555a.05.05 0 0 1-.022.041L6.473 13.3c-1.454.826-3.311.335-4.15-1.098m-.85-6.94A3.02 3.02 0 0 1 3.07 3.949v3.785a.51.51 0 0 0 .262.451l3.93 2.237-1.366.779a.05.05 0 0 1-.048 0L2.585 9.342a2.98 2.98 0 0 1-1.113-4.094zm11.216 2.571L8.747 5.576l1.362-.776a.05.05 0 0 1 .048 0l3.265 1.86a3 3 0 0 1 1.173 1.207 2.96 2.96 0 0 1-.27 3.2 3.05 3.05 0 0 1-1.36.997V8.279a.52.52 0 0 0-.276-.445m1.36-2.015-.097-.057-3.226-1.855a.53.53 0 0 0-.53 0L6.249 6.153V4.598a.04.04 0 0 1 .019-.04L9.533 2.7a3.07 3.07 0 0 1 3.257.139c.474.325.843.778 1.066 1.303.223.526.289 1.103.191 1.664zM5.503 8.575 4.139 7.8a.05.05 0 0 1-.026-.037V4.049c0-.57.166-1.127.476-1.607s.752-.864 1.275-1.105a3.08 3.08 0 0 1 3.234.41l-.096.054-3.23 1.838a.53.53 0 0 0-.265.455zm.742-1.577 1.758-1 1.762 1v2l-1.755 1-1.762-1z";

const premiumPacks = [
  {
    title: "小红书爆款 Prompt 包",
    desc: "30 条高转化种草文案 Prompt，包含标题、开头、正文、标签和评论区互动模板。",
    price: "¥29.9",
    tag: "即将推出",
    accent: "from-rose-500 to-violet-600",
    cover: "小红书\n30天内容包",
    image: "/pack-xiaohongshu.svg",
  },
  {
    title: "电商成交 Prompt 包",
    desc: "标题优化、详情页卖点、客服话术、促销活动，一套 Prompt 打通电商转化链路。",
    price: "¥39.9",
    tag: "即将推出",
    accent: "from-amber-500 to-orange-600",
    cover: "电商成交\n话术包",
    image: "/pack-ecommerce.svg",
  },
  {
    title: "AI 办公提效 Prompt 包",
    desc: "会议纪要、周报、邮件、数据分析、SOP 文档，职场人每天都能复用。",
    price: "¥29.9",
    tag: "即将推出",
    accent: "from-blue-500 to-cyan-500",
    cover: "办公提效\n模板包",
    image: "/pack-office.svg",
  },
];

const tools = [
  { name: "ChatGPT", desc: "全能 AI 对话", url: "https://chat.openai.com", tag: "AI 写作" },
  { name: "Claude", desc: "长文和分析", url: "https://claude.ai", tag: "AI 写作" },
  { name: "DeepSeek", desc: "中文推理与编程", url: "https://deepseek.com", tag: "AI 编程" },
  { name: "Midjourney", desc: "AI 图片生成", url: "https://midjourney.com", tag: "AI 图片" },
  { name: "Canva AI", desc: "设计和修图", url: "https://canva.com", tag: "AI 图片" },
  { name: "Runway", desc: "AI 视频生成", url: "https://runwayml.com", tag: "AI 视频" },
  { name: "Cursor", desc: "AI 代码编辑器", url: "https://cursor.sh", tag: "AI 编程" },
  { name: "Codex", desc: "桌面 AI 代理", url: "https://openai.com/codex", tag: "AI 编程" },
  { name: "Notion AI", desc: "文档和知识库", url: "https://notion.so", tag: "AI 办公" },
  { name: "Gamma", desc: "AI PPT 生成", url: "https://gamma.app", tag: "AI 办公" },
];

const aiModels = [
  {
    name: "ChatGPT",
    company: "OpenAI",
    url: "https://chatgpt.com",
    icon: { path: openAiIconPath },
    iconViewBox: "0 0 16 16",
    fallback: "GPT",
    color: "from-slate-900 to-slate-700",
    desc: "综合能力强，适合写作、分析、编程、图片理解和日常工作助手。",
    strengths: ["通用能力均衡", "工具生态成熟", "适合复杂任务拆解"],
    weaknesses: ["国内访问门槛较高", "部分高级能力需要付费", "中文本地化语气需调整"],
    bestFor: "日常办公、写作、编程、综合问答",
  },
  {
    name: "Claude",
    company: "Anthropic",
    url: "https://claude.ai",
    icon: siClaude,
    color: "from-orange-500 to-amber-600",
    desc: "长文理解和结构化表达表现好，适合文档分析、写作润色和复杂资料整理。",
    strengths: ["长文处理优秀", "表达自然克制", "适合文档和逻辑分析"],
    weaknesses: ["部分地区访问不稳定", "工具生态相对少", "实时联网能力依赖版本"],
    bestFor: "长文总结、资料分析、写作润色",
  },
  {
    name: "Gemini",
    company: "Google",
    url: "https://gemini.google.com",
    icon: siGooglegemini,
    color: "from-blue-500 to-cyan-500",
    desc: "和 Google 生态结合紧密，适合搜索、资料整理、多模态理解和办公协作。",
    strengths: ["Google 生态强", "多模态能力好", "适合搜索和资料交叉验证"],
    weaknesses: ["部分地区服务限制", "中文细腻表达有时需润色", "企业功能依赖账号体系"],
    bestFor: "搜索研究、图片理解、Google 办公协作",
  },
  {
    name: "DeepSeek",
    company: "DeepSeek",
    url: "https://chat.deepseek.com",
    icon: siDeepseek,
    color: "from-sky-500 to-blue-700",
    desc: "中文推理和代码能力突出，适合低成本做分析、编程、学习和中文任务。",
    strengths: ["中文体验好", "推理和代码能力强", "性价比高"],
    weaknesses: ["高峰期可能较慢", "生态插件较少", "复杂多模态能力需搭配其他工具"],
    bestFor: "中文分析、编程、学习、性价比任务",
  },
  {
    name: "Kimi",
    company: "月之暗面",
    url: "https://kimi.moonshot.cn",
    icon: siKimi,
    color: "from-violet-500 to-purple-700",
    desc: "中文长文阅读和资料整理友好，适合文件阅读、总结、提纲和学习辅助。",
    strengths: ["中文长文阅读方便", "文件处理体验好", "适合学生和办公资料整理"],
    weaknesses: ["深度 Agent 生态仍在发展", "复杂代码任务不是主场", "跨工具自动化能力有限"],
    bestFor: "文件阅读、中文总结、学习整理",
  },
  {
    name: "通义千问",
    company: "阿里云",
    url: "https://tongyi.aliyun.com/qianwen/",
    icon: siQwen,
    color: "from-indigo-500 to-blue-700",
    desc: "适合中文办公、企业应用和阿里云生态场景，后续接入企业服务比较顺。",
    strengths: ["中文和企业场景友好", "阿里云生态适配", "适合国内合规场景"],
    weaknesses: ["海外工具生态较少", "个别创意表达需二次打磨", "高级能力依赖具体版本"],
    bestFor: "企业办公、国内云服务、中文业务流程",
  },
  {
    name: "Perplexity",
    company: "Perplexity",
    url: "https://www.perplexity.ai",
    icon: siPerplexity,
    color: "from-teal-500 to-cyan-700",
    desc: "偏 AI 搜索和资料查证，适合找资料、看来源、做竞品和行业研究。",
    strengths: ["搜索体验强", "来源引用清楚", "适合快速研究"],
    weaknesses: ["不适合深度工作流执行", "中文内容覆盖取决于来源", "创作和自动化不是主场"],
    bestFor: "资料搜索、竞品研究、行业调研",
  },
];

export default function HomePage() {
  const popularPrompts = getPopularPrompts(8);
  const latestPrompts = getLatestPrompts(4);
  const hotTags = getHotTags(16);
  const topCollections = getAllCollections().slice(0, 5);

  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.05]" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[100px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-20 sm:px-6 lg:grid-cols-[0.95fr,1.05fr] lg:px-8 lg:pb-28 lg:pt-28">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-slate-300">AI插件 · Agent能力 · 工作流 · 自动化</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              把 AI 变成
              <br />
              <span className="text-gradient">你的工作助手</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Agent站整理 AI 插件、工具和工作流，帮你把邮箱、文档、代码仓库、数据库和网站连接到 AI Agent。
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/skills"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-7 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(124,58,237,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(124,58,237,0.45)]"
              >
                查看插件库
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </Link>
              <a
                href="mailto:hello@agentzhan.com?subject=我想了解 Agent 插件安装服务"
                className="inline-flex h-12 items-center rounded-full border border-white/20 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:border-white/30 hover:bg-white/10"
              >
                获取安装服务
              </a>
            </div>

          </div>

          <div className="relative lg:pt-6">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-violet-500/25 via-blue-500/10 to-cyan-400/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-3 shadow-2xl backdrop-blur-xl">
              <Image
                src="/hero-agent-workstation.svg"
                alt="Agent站 AI 生产力工作台示意图"
                width={1200}
                height={860}
                priority
                className="h-auto w-full rounded-[1.5rem]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="models" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeader
          eyebrow="AI 模型入口"
          title="主流 AI 模型怎么选？"
          description="先了解每个模型的长处和短处，再选择适合你当前任务的 AI 工具。"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {aiModels.map((model) => (
            <a
              key={model.name}
              href={model.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_56px_rgba(15,23,42,0.10)]"
            >
              <div className="flex gap-4">
                <div className={`relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${model.color} shadow-lg`}>
                  <div className="absolute inset-0 bg-white/10" />
                  {model.icon ? (
                    <svg className="relative h-8 w-8" viewBox={model.iconViewBox ?? "0 0 24 24"} aria-hidden="true">
                      <path d={model.icon.path} fill="white" />
                    </svg>
                  ) : (
                    <span className="relative text-base font-black text-white">{model.fallback}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold tracking-tight text-slate-950">{model.name}</h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{model.company}</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{model.desc}</p>
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                    <span className="font-semibold text-slate-950">适合：</span>
                    {model.bestFor}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <div className="text-xs font-bold text-emerald-700">长处</div>
                  <ul className="mt-2 space-y-1.5 text-sm leading-6 text-emerald-950/80">
                    {model.strengths.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                  <div className="text-xs font-bold text-amber-700">短处</div>
                  <ul className="mt-2 space-y-1.5 text-sm leading-6 text-amber-950/80">
                    {model.weaknesses.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm text-slate-500">官方入口</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-violet-600 transition-all group-hover:gap-1.5">
                  打开 {model.name}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="free-pack" className="border-y border-slate-200 bg-slate-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              限时免费
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              免费领取《100 个 AI 提效 Prompt 包》
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              覆盖写作、办公、短视频、电商和编程场景，复制即用。输入邮箱，先锁定免费领取资格。
            </p>
            <LeadCaptureForm />
            <p className="mt-3 text-xs text-slate-400">当前为预登记版本，后续会接入邮件发送和下载链接。</p>
          </div>
        </div>
      </section>

      <section id="popular" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeader
          eyebrow="热门 Prompt"
          title="大家都在用的提示词"
          description="浏览最受欢迎的 Prompt，直接复制到 ChatGPT、Claude、DeepSeek 使用。"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popularPrompts.map((prompt) => (
            <PromptCard key={prompt.slug} prompt={prompt} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-violet-600 transition-all hover:border-violet-300 hover:bg-violet-50 hover:shadow-sm"
          >
            查看全部 Prompt
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="即将推出"
            title="专业 Prompt 包，深度解决工作难题"
            description="针对具体岗位和场景定制的 Prompt 合集，开箱即用，也为后续付费产品预热。"
            align="center"
          />
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {premiumPacks.map((pack) => (
              <div
                key={pack.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
              >
                <Image
                  src={pack.image}
                  alt={`${pack.title}封面`}
                  width={900}
                  height={560}
                  className="mb-5 h-auto w-full rounded-2xl shadow-[0_18px_48px_rgba(15,23,42,0.16)] transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">{pack.tag}</span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{pack.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{pack.desc}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xl font-bold text-slate-900">{pack.price}</span>
                  <span className="text-xs text-slate-400">/ 一次性购买</span>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="精选合集"
            title="按场景整理的 Prompt 合集"
            description="五大工作场景精选合集，每个合集包含完整 Prompt、使用指南和常见问题。"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {topCollections.map((collection) => (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_16px_48px_rgba(124,58,237,0.10)]"
              >
                <h3 className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-violet-700">{collection.title}</h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{collection.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {collection.relatedModels.slice(0, 3).map((model) => (
                    <span key={model} className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500">
                      {model}
                    </span>
                  ))}
                </div>
                <span className="mt-3 inline-block text-xs font-semibold text-violet-600 transition-transform group-hover:translate-x-0.5">
                  查看合集 &rarr;
                </span>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="工具推荐"
            title="搭配这些 AI 工具，效率翻倍"
            description="先把推荐位搭起来，未来可以接广告、联盟分成或工具合作。"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {tools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md"
              >
                <span className="inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                  {tool.tag}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{tool.name}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{tool.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-600 transition-all group-hover:gap-1.5">
                  访问工具
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">需要帮公司建立 AI 工作流？</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
            我们为企业团队提供定制 Prompt 库、AI 工作流搭建和内部培训服务。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:hello@agentzhan.com"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-8 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(124,58,237,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(124,58,237,0.45)]"
            >
              联系我们
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </a>
            <Link
              href="/search"
              className="inline-flex h-12 items-center rounded-full border border-white/20 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:border-white/30 hover:bg-white/10"
            >
              浏览全部 Prompt
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="热门标签" title="快速定位你需要的 Prompt" description="从标签出发，更快找到对应场景的提示词。" />
          <div className="flex flex-wrap gap-2.5">
            {hotTags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 hover:shadow-sm"
              >
                <span className="text-violet-400 transition-colors group-hover:text-violet-500">#</span>
                {tag}
                <span className="text-xs text-slate-400">({count})</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="latest" className="scroll-mt-24 border-t border-slate-200 bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="最新收录" title="最近更新的 Prompt" description="持续新增高质量中文提示词，紧跟 AI 工具发展。" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latestPrompts.map((prompt) => (
              <PromptCard key={prompt.slug} prompt={prompt} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
