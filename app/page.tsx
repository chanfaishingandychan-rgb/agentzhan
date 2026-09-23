import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  Clock3,
  ExternalLink,
  FileText,
  PackageOpen,
  Puzzle,
} from "lucide-react";

import { HeroWorkflowScene } from "@/components/hero-workflow-scene";
import { SectionHeader } from "@/components/section-header";
import { TrackedLink } from "@/components/tracked-link";
import { getAllCollections } from "@/lib/collections";
import { exampleCases } from "@/lib/examples";
import { getFeaturedGuides } from "@/lib/guides";
import { industries } from "@/lib/industries";
import { learnTasks } from "@/lib/learn";
import { getLatestAiNewsForSite } from "@/lib/news";
import { allSkills } from "@/lib/skills";

const startRoutes = [
  {
    number: "01",
    title: "第一次使用 AI",
    description: "先完成一个 10 分钟任务，认识提问、修改和检查结果的基本方法。",
    href: "/start-here",
    linkLabel: "从这里开始",
  },
  {
    number: "02",
    title: "想系统学习",
    description: "沿着 14 天路线逐步练习，从日常对话走到办公和内容工作。",
    href: "/learn",
    linkLabel: "查看学习路线",
  },
  {
    number: "03",
    title: "已有具体问题",
    description: "直接查找安装、模型选择、工作流和常见故障的完整教程。",
    href: "/guides",
    linkLabel: "查找解决方法",
  },
];

const models = [
  { name: "ChatGPT", use: "综合工作", url: "https://chatgpt.com" },
  { name: "Claude", use: "长文分析", url: "https://claude.ai" },
  { name: "Gemini", use: "搜索与 Google 协作", url: "https://gemini.google.com" },
  { name: "DeepSeek", use: "中文推理与编程", url: "https://chat.deepseek.com" },
  { name: "Kimi", use: "中文文件阅读", url: "https://kimi.moonshot.cn" },
  { name: "通义千问", use: "企业中文场景", url: "https://tongyi.aliyun.com/qianwen/" },
  { name: "Perplexity", use: "资料查证", url: "https://www.perplexity.ai" },
];

const featuredSkillSlugs = [
  "notion-agent-plugin",
  "gmail-agent-plugin",
  "github-agent-plugin",
  "supabase-database-plugin",
];

const offers = [
  {
    icon: PackageOpen,
    eyebrow: "免费领取",
    title: "AI 新手工作包",
    description: "先用一套可复制的模板完成真实任务，再决定是否需要进阶产品。",
    href: "/free-ai-pack",
  },
  {
    icon: FileText,
    eyebrow: "数字产品",
    title: "AI 办公提效 Prompt 包",
    description: "会议纪要、周报、邮件、SOP 和资料整理的完整办公模板。",
    href: "/products/ai-office-prompt-pack",
  },
  {
    icon: Puzzle,
    eyebrow: "安装服务",
    title: "AI 插件代装与设置",
    description: "协助连接邮箱、文档、代码仓库和数据库，并说明日常使用方法。",
    href: "/products/ai-skill-install-service",
  },
  {
    icon: BriefcaseBusiness,
    eyebrow: "方案咨询",
    title: "个人与小团队 AI 工作流",
    description: "从现有工作出发，判断哪些步骤值得交给 AI，以及怎样实际落地。",
    href: "/consulting",
  },
];

export const revalidate = 3600;

export default async function HomePage() {
  const latestNews = await getLatestAiNewsForSite(4);
  const featuredGuides = getFeaturedGuides(4);
  const topCollections = getAllCollections().slice(0, 5);
  const featuredSkills = featuredSkillSlugs
    .map((slug) => allSkills.find((skill) => skill.slug === slug))
    .filter((skill): skill is (typeof allSkills)[number] => Boolean(skill));

  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-neutral-300 bg-[#f6f6f3]">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] border-l border-neutral-200/80 bg-[#efefeb] lg:block" />
        <div className="relative mx-auto min-h-[calc(100svh-8rem)] max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pb-16 sm:pt-20 lg:min-h-[640px] lg:px-8 lg:py-16">
          <div className="relative z-10 max-w-2xl lg:pt-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span className="h-px w-6 bg-emerald-600" aria-hidden="true" />
              中文 AI 工作指南
            </div>
            <h1 className="mt-4 text-5xl font-semibold leading-none text-neutral-950 sm:mt-5 sm:text-6xl lg:text-7xl">Agent站</h1>
            <p className="mt-4 max-w-xl text-2xl font-medium leading-tight text-neutral-900 sm:mt-6 sm:text-3xl">
              把复杂的 AI 工具，整理成可以直接工作的中文方案。
            </p>
            <p className="mt-4 max-w-xl text-base leading-8 text-neutral-600 sm:mt-5">
              从模型选择、插件安装到工作流搭建，先看真实结果，再决定从哪里开始。
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-5 sm:mt-8">
              <TrackedLink
                href="/start-here"
                eventName="hero-start-here"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-neutral-950 px-6 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                从这里开始 <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </TrackedLink>
              <TrackedLink
                href="/examples"
                eventName="hero-examples"
                className="inline-flex h-12 items-center text-sm font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 transition-colors hover:text-emerald-700"
              >
                查看真实案例
              </TrackedLink>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-neutral-300 pt-5 text-xs text-neutral-600 sm:mt-9">
              <span><strong className="font-semibold text-neutral-950">430+</strong> 中文 Prompt</span>
              <span><strong className="font-semibold text-neutral-950">23</strong> 插件指南</span>
              <span><strong className="font-semibold text-neutral-950">14 天</strong> 新手路线</span>
            </div>
          </div>
          <div className="relative mt-5 sm:mt-10 lg:absolute lg:bottom-8 lg:right-8 lg:top-0 lg:mt-0 lg:w-[49%]">
            <HeroWorkflowScene />
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-300 bg-white" aria-label="最新 AI 资讯">
        <div className="mx-auto grid max-w-7xl divide-y divide-neutral-200 px-4 sm:px-6 lg:grid-cols-[0.7fr_repeat(3,1fr)] lg:divide-x lg:divide-y-0 lg:px-8">
          <div className="flex items-center justify-between py-4 pr-5 lg:block lg:py-5">
            <div className="text-xs font-semibold text-emerald-700">最新更新</div>
            <Link href="/news" className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-neutral-950 hover:text-emerald-700">
              每日 AI 资讯 <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </div>
          {latestNews.slice(0, 3).map((item, index) => (
            <Link key={item.slug} href={`/news/${item.slug}`} className="group flex min-w-0 gap-3 py-4 lg:px-5 lg:py-5">
              <span className="text-xs font-semibold text-neutral-400">0{index + 1}</span>
              <span className="min-w-0">
                <span className="block text-xs text-neutral-500">{item.source} · {item.publishedAt.slice(5).replace("-", ".")}</span>
                <span className="mt-1 block line-clamp-2 text-sm font-medium leading-5 text-neutral-900 transition-colors group-hover:text-emerald-700">{item.title}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="learn" className="border-b border-neutral-300 bg-[#f6f6f3] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="01 · 开始与学习"
            title="选择一条最短路径"
            description="不需要先学懂所有模型和术语。按你现在的情况进入，先完成一件具体工作。"
          />
          <div className="grid border-y border-neutral-300 lg:grid-cols-3 lg:divide-x lg:divide-neutral-300">
            {startRoutes.map((route) => (
              <Link key={route.number} href={route.href} className="group border-b border-neutral-300 py-7 last:border-b-0 lg:border-b-0 lg:px-8 lg:first:pl-0 lg:last:pr-0">
                <div className="font-mono text-xs text-neutral-400">{route.number}</div>
                <h3 className="mt-5 text-xl font-semibold text-neutral-950 group-hover:text-emerald-700">{route.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-600">{route.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-neutral-950">
                  {route.linkLabel}<ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-800">
                <BookOpen aria-hidden="true" className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-neutral-950">14 天新手路线</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-600">每天一个约 10 分钟的练习，包含可复制模板、修改方法和常见错误。</p>
              <Link href="/learn" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                查看完整路线 <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-neutral-300 border-t border-neutral-300">
              {learnTasks.slice(0, 4).map((task) => (
                <Link key={task.slug} href={`/learn/${task.slug}`} className="group grid grid-cols-[3rem_1fr_auto] items-center gap-3 py-4">
                  <span className="font-mono text-xs text-neutral-400">D{String(task.day).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-sm font-semibold text-neutral-950 group-hover:text-emerald-700">{task.shortTitle}</span>
                    <span className="mt-1 hidden text-xs text-neutral-500 sm:block">{task.description}</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs text-neutral-500"><Clock3 aria-hidden="true" className="h-3.5 w-3.5" />{task.time}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="proof" className="border-b border-neutral-300 bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="02 · 案例与教程"
            title="先看结果，再学习方法"
            description="案例展示输入怎样变成可交付结果；教程则把安装、判断和执行步骤逐一写清楚。"
          />
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <div className="mb-4 flex items-center justify-between border-b border-neutral-950 pb-3">
                <h3 className="text-sm font-semibold text-neutral-950">真实前后对照</h3>
                <Link href="/examples" className="text-xs font-semibold text-neutral-500 hover:text-emerald-700">全部案例</Link>
              </div>
              <div className="divide-y divide-neutral-200">
                {exampleCases.map((item, index) => (
                  <Link key={item.slug} href={`/examples/${item.slug}`} className="group grid grid-cols-[2.25rem_1fr] gap-3 py-5">
                    <span className="font-mono text-xs text-neutral-400">0{index + 1}</span>
                    <span>
                      <span className="text-xs font-semibold text-emerald-700">{item.category}</span>
                      <span className="mt-1 block text-base font-semibold leading-6 text-neutral-950 group-hover:text-emerald-700">{item.title}</span>
                      <span className="mt-2 line-clamp-2 block text-sm leading-6 text-neutral-600">{item.description}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-4 flex items-center justify-between border-b border-neutral-950 pb-3">
                <h3 className="text-sm font-semibold text-neutral-950">精选实战教程</h3>
                <Link href="/guides" className="text-xs font-semibold text-neutral-500 hover:text-emerald-700">全部教程</Link>
              </div>
              <div className="divide-y divide-neutral-200">
                {featuredGuides.map((guide, index) => (
                  <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group grid grid-cols-[2.25rem_1fr_auto] gap-3 py-5">
                    <span className="font-mono text-xs text-neutral-400">0{index + 1}</span>
                    <span>
                      <span className="text-xs text-neutral-500">{guide.category}</span>
                      <span className="mt-1 block text-base font-semibold leading-6 text-neutral-950 group-hover:text-emerald-700">{guide.shortTitle}</span>
                      <span className="mt-2 line-clamp-2 block text-sm leading-6 text-neutral-600">{guide.description}</span>
                    </span>
                    <span className="text-xs text-neutral-400">{guide.readingTime}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="resources" className="border-b border-neutral-800 bg-neutral-950 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400"><span className="h-px w-5 bg-emerald-400" aria-hidden="true" />03 · 工具与资源</div>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">从工具，走到工作流</h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-neutral-400">模型负责理解，插件负责连接资料，Prompt 负责定义标准。按任务组合，而不是盲目追逐工具。</p>
              <div className="mt-8 grid grid-cols-3 border-y border-neutral-700 py-5 text-center">
                {["选择模型", "连接插件", "执行任务"].map((step, index) => (
                  <div key={step} className="relative px-2">
                    <div className="font-mono text-xs text-emerald-400">0{index + 1}</div>
                    <div className="mt-2 text-sm font-semibold">{step}</div>
                    {index < 2 ? <ArrowRight aria-hidden="true" className="absolute -right-2 top-4 h-4 w-4 text-neutral-600" /> : null}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                <Link href="/skills" className="inline-flex items-center gap-1 font-semibold text-white hover:text-emerald-400">浏览插件库 <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
                <Link href="/search" className="inline-flex items-center gap-1 font-semibold text-white hover:text-emerald-400">搜索 Prompt <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
              </div>
            </div>
            <div className="grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="border-b border-neutral-700 pb-3 text-sm font-semibold">主流模型</h3>
                <div className="divide-y divide-neutral-800">
                  {models.map((model) => (
                    <a key={model.name} href={model.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 py-3.5">
                      <span className="text-sm font-medium group-hover:text-emerald-400">{model.name}</span>
                      <span className="flex items-center gap-1 text-right text-xs text-neutral-500">{model.use}<ExternalLink aria-hidden="true" className="h-3 w-3" /></span>
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="border-b border-neutral-700 pb-3 text-sm font-semibold">常用插件</h3>
                <div className="divide-y divide-neutral-800">
                  {featuredSkills.map((skill) => (
                    <Link key={skill.slug} href={skill.href} className="group block py-3.5">
                      <span className="text-sm font-medium group-hover:text-emerald-400">{skill.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-neutral-500">{skill.outcome}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-14 grid gap-10 border-t border-neutral-700 pt-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="mb-4 text-xs font-semibold text-neutral-400">按行业浏览</div>
              <div className="grid grid-cols-2 gap-x-6 border-t border-neutral-800 sm:grid-cols-3 lg:grid-cols-4">
                {industries.map((industry) => (
                  <Link key={industry.slug} href={`/industry/${industry.slug}`} className="border-b border-neutral-800 py-3 text-sm text-neutral-300 hover:text-emerald-400">{industry.name}</Link>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-4 text-xs font-semibold text-neutral-400">精选合集</div>
              <div className="border-t border-neutral-800">
                {topCollections.map((collection) => (
                  <Link key={collection.slug} href={`/collections/${collection.slug}`} className="group flex items-center justify-between gap-3 border-b border-neutral-800 py-3 text-sm text-neutral-300 hover:text-emerald-400">
                    <span>{collection.title}</span><ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="bg-[#f6f6f3] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="04 · 产品与服务"
            title="需要更快完成，可以直接使用"
            description="从免费模板到插件安装和工作流咨询，每项服务都说明交付内容与适用对象。"
          />
          <div className="grid overflow-hidden rounded-lg border border-neutral-300 bg-white lg:grid-cols-[0.82fr_1.18fr]">
            <Link href="/products/ai-office-prompt-pack" className="group relative min-h-[25rem] overflow-hidden border-b border-neutral-300 bg-neutral-100 p-7 lg:border-b-0 lg:border-r lg:p-10">
              <div className="relative z-10 max-w-sm">
                <div className="text-xs font-semibold text-emerald-700">重点产品</div>
                <h3 className="mt-3 text-3xl font-semibold leading-tight text-neutral-950">AI 办公提效 Prompt 包</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-600">不是零散提示词，而是围绕会议、周报、邮件和 SOP 整理的可复用工作模板。</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-neutral-950">查看内容与示例 <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </div>
              <Image src="/pack-office.svg" alt="AI 办公提效 Prompt 包封面" width={320} height={240} className="absolute -bottom-7 -right-8 w-60 rotate-[-3deg] drop-shadow-xl transition-transform duration-500 group-hover:-translate-y-2 sm:w-72" />
            </Link>
            <div className="divide-y divide-neutral-300">
              {offers.map((offer) => {
                const Icon = offer.icon;
                return (
                  <Link key={offer.title} href={offer.href} className="group grid grid-cols-[2.75rem_1fr_auto] gap-4 p-5 sm:p-7">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-300 bg-[#f6f6f3] text-neutral-700"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                    <span>
                      <span className="text-xs font-semibold text-emerald-700">{offer.eyebrow}</span>
                      <span className="mt-1 block text-base font-semibold text-neutral-950 group-hover:text-emerald-700">{offer.title}</span>
                      <span className="mt-1 hidden text-sm leading-6 text-neutral-600 sm:block">{offer.description}</span>
                    </span>
                    <ArrowRight aria-hidden="true" className="mt-4 h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-700" />
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="mt-10 flex flex-col justify-between gap-5 border-t border-neutral-300 pt-8 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950"><Check aria-hidden="true" className="h-4 w-4 text-emerald-700" />先了解需求，再决定是否购买</div>
              <p className="mt-2 text-sm text-neutral-600">不确定应该选产品、插件还是咨询，可以先说明你目前想完成的工作。</p>
            </div>
            <Link href="/consulting" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-neutral-950 px-5 text-sm font-semibold text-neutral-950 hover:bg-neutral-950 hover:text-white">
              查看咨询方式 <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
