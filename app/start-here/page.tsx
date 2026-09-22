import type { Metadata } from "next";
import Link from "next/link";

import { originalSkillProducts } from "@/lib/original-skill-products";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI新手从这里开始 - Agent站",
  description:
    "不知道 AI 怎么用？Agent站把 AI 办公、内容引流、客服成交和 AI 一人公司整理成 4 条入门路线，适合 AI 新手和小团队。",
  alternates: {
    canonical: `${siteConfig.url}/start-here`,
  },
  openGraph: {
    title: "AI新手从这里开始 - Agent站",
    description: "按你的目标选择 AI 入门路线：办公提效、内容引流、客服成交、AI 一人公司。",
    url: `${siteConfig.url}/start-here`,
    siteName: siteConfig.name,
    type: "website",
  },
};

const paths = [
  {
    label: "办公提效",
    title: "我想用 AI 写周报、邮件、会议纪要",
    desc: "适合上班族、行政、运营、小团队。先学会把日常办公文字交给 AI 起稿，再用检查清单避免出错。",
    steps: [
      { title: "先看教程", href: "/guides/ai-office-daily-workflow" },
      { title: "领免费包", href: "/free-ai-pack" },
      { title: "买办公 Skill", href: "/products/original-skills/ai-office-assistant-skill" },
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "内容引流",
    title: "我想用 AI 做小红书、短视频、文章",
    desc: "适合内容创作者、服务型账号和个人品牌。重点是选题、标题、正文、脚本和复盘，不是让 AI 随便写一篇。",
    steps: [
      { title: "看内容教程", href: "/guides/xiaohongshu-ai-content-plan" },
      { title: "学短视频脚本", href: "/guides/short-video-ai-script-workflow" },
      { title: "买内容 Skill", href: "/products/original-skills/social-content-factory-skill" },
    ],
    color: "from-rose-500 to-violet-600",
  },
  {
    label: "客服成交",
    title: "我想用 AI 回复客户、整理话术、提高成交",
    desc: "适合电商、课程、咨询和本地服务。先把常见问题和售后边界整理清楚，再让 AI 帮你写稳定回复。",
    steps: [
      { title: "看客服教程", href: "/guides/ai-customer-service-knowledge-base" },
      { title: "看工作流", href: "/guides/ai-workflow-for-small-business" },
      { title: "买客服 Skill", href: "/products/original-skills/customer-service-reply-skill" },
    ],
    color: "from-amber-500 to-orange-600",
  },
  {
    label: "AI 一人公司",
    title: "我想用 AI 做副业、个人网站或小型服务",
    desc: "适合自由职业者、个人站长和小老板。先找一个真实需求，做出可展示的结果，再建立内容和付费交付。",
    steps: [
      { title: "看 7 天起步教程", href: "/guides/ai-one-person-company-start-guide" },
      { title: "看输出示例", href: "/examples" },
      { title: "用网站经营 Skill", href: "/products/agentzhan-website-operator-skill" },
    ],
    color: "from-emerald-500 to-teal-600",
  },
];

const trustBlocks = [
  ["先免费", "先看教程和免费包，不用一开始就付款。"],
  ["再复制", "每个 Skill 都有 Prompt、示例和检查清单。"],
  ["能落地", "目标是交付文件、内容、回复和流程，不是只讲概念。"],
];

export default function StartHerePage() {
  return (
    <main className="bg-[#fafafa]">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-violet-100">
              AI 新手入口
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              不知道 AI 怎么用？
              <br />
              先按目标选一条路
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              Agent站把最常见的 AI 入门场景整理成办公提效、内容引流、客服成交和 AI 一人公司四条路线。每条路线都有教程、免费资源和可下载 Skill 包。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#routes"
                className="inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
              >
                选择我的路线
              </a>
              <Link
                href="/free-ai-pack"
                className="inline-flex h-12 items-center rounded-full border border-white/15 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                先领免费 AI 工作包
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-white backdrop-blur">
            <div className="text-sm font-semibold text-violet-100">本站最适合这类人</div>
            <div className="mt-5 space-y-3">
              {["刚开始学 AI 的上班族", "想做内容引流的小店主或博主", "想用 AI 回复客户的小团队", "想买现成 Prompt / Skill 包的人"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {trustBlocks.map(([title, desc]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-lg font-bold text-slate-950">{title}</div>
              <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="routes" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <div className="text-sm font-semibold text-violet-700">4 条路线</div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">你现在最想解决什么？</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            不要一开始就学所有 AI 工具。先选一个最贴近你今天需求的场景，用一个小成果建立信心。
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {paths.map((path) => (
            <article key={path.label} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className={`h-3 bg-gradient-to-r ${path.color}`} />
              <div className="p-6">
                <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {path.label}
                </div>
                <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">{path.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{path.desc}</p>
                <div className="mt-6 space-y-3">
                  {path.steps.map((step, index) => (
                    <Link
                      key={step.href}
                      href={step.href}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-500 shadow-sm">
                        {index + 1}
                      </span>
                      {step.title}
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="text-sm font-semibold text-violet-700">大众 Skill</div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">想快一点，就用现成 Skill 包</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                这些包已包含 SKILL.md、Prompt、检查清单和示例。不会安装也可以直接复制 Prompt 到常见 AI 工具里使用。
              </p>
            </div>
            <Link
              href="/products/agentzhan-original-skills"
              className="inline-flex h-11 shrink-0 items-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              查看全部 Skill
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {originalSkillProducts.map((product) => (
              <Link
                key={product.slug}
                href={product.path}
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-violet-200 hover:bg-white hover:shadow-[0_18px_56px_rgba(15,23,42,0.10)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-violet-700">
                    {product.category}
                  </span>
                  <span className="text-2xl font-black text-slate-950">{product.priceLabel}</span>
                </div>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-950 group-hover:text-violet-700">
                  {product.shortTitle}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{product.outcome}</p>
                <div className="mt-5 text-sm font-semibold text-violet-600">查看详情 →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
