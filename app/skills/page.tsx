import type { Metadata } from "next";
import Link from "next/link";

import { PluginIcon } from "@/components/plugin-icon";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section-header";
import { allSkills, skillBranches } from "@/lib/skills";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI插件库 - Agent站",
  description:
    "Agent站 AI插件库，按办公、开发、营销、企业流程等场景整理 Agent 外挂程式、连接工具、使用方法和落地应用。",
  alternates: {
    canonical: `${siteConfig.url}/skills`,
  },
  openGraph: {
    title: "AI插件库 - Agent站",
    description: "查看可落地的 Agent 插件介绍、连接工具、适合场景和使用方法。",
    url: `${siteConfig.url}/skills`,
    siteName: siteConfig.name,
    type: "website",
  },
};

const connectedToolCount = new Set(allSkills.flatMap((skill) => skill.tools)).size;

const stats = [
  { label: "插件分类", value: `${skillBranches.length}` },
  { label: "可用插件", value: `${allSkills.length}+` },
  { label: "连接工具", value: `${connectedToolCount}+` },
];

export default function SkillsPage() {
  return (
    <main className="bg-[#fafafa]">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-violet-100 backdrop-blur">
              Agent插件 · 外挂程式 · 自动化能力
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              AI插件库
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
              这里整理的是 Agent 可以安装和连接的插件能力：邮箱、文档、代码仓库、数据库、部署平台、客户线索和企业知识库。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#skill-list"
                className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-[0_10px_32px_rgba(124,58,237,0.35)] transition hover:-translate-y-0.5"
              >
                查看全部插件
              </Link>
              <Link
                href="#skill-list"
                className="inline-flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                查看插件分类
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/products/codex-deepseek-mac-installer"
            className="group grid gap-6 overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-white via-violet-50 to-blue-50 p-6 shadow-[0_18px_56px_rgba(124,58,237,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_24px_72px_rgba(79,70,229,0.16)] lg:grid-cols-[1fr_220px]"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="premium">付费工具包</Badge>
                <Badge variant="violet">Mac 专用</Badge>
                <Badge variant="blue">Codex × DeepSeek</Badge>
              </div>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950">
                Mac Codex 接入 DeepSeek 自助安装包
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                为 Mac Codex 增加 DeepSeek Flash / Pro 两个独立入口，保留原本 GPT 设置。想接入 Kimi、GLM、Claude、Gemini 或其他模型，也可以联系我们评估。
              </p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">首批试用价</div>
              <div className="mt-2 text-4xl font-black text-slate-950">¥98</div>
              <div className="mt-1 text-xs text-slate-500">一次性工具包</div>
              <div className="mt-4 text-sm font-semibold text-violet-700 transition group-hover:translate-x-0.5">
                查看详情 →
              </div>
            </div>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeader
          eyebrow="插件分类"
          title="先选一个插件方向，再连接到真实工具"
          description="这些插件方向对应最常见的 AI 落地场景：办公自动化、开发部署、营销增长和企业流程。"
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {skillBranches.map((branch) => (
            <a
              key={branch.slug}
              href={`#${branch.slug}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_16px_48px_rgba(124,58,237,0.10)]"
            >
              <div className={`h-24 bg-gradient-to-br ${branch.color} p-5`}>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-lg font-bold text-white backdrop-blur">
                  {branch.title.slice(0, 2)}
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-base font-semibold text-slate-950">{branch.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">{branch.description}</p>
                <div className="mt-4 text-sm font-semibold text-violet-600 transition group-hover:translate-x-0.5">
                  查看插件介绍 &rarr;
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="skill-list" className="border-y border-slate-200 bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="插件介绍"
            title="每个插件都说明能连接什么、能做什么"
            description="插件的价值不是一段提示词，而是把 AI 接到真实工具里，替用户完成可交付的任务。"
          />

          <div className="space-y-10">
            {skillBranches.map((branch) => (
              <div key={branch.slug} id={branch.slug} className="scroll-mt-24">
                <div className="mb-5 flex items-center gap-3">
                  <div className={`h-10 w-1.5 rounded-full bg-gradient-to-b ${branch.color}`} />
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">{branch.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{branch.description}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {branch.skills.map((skill) => (
                    <article
                      key={skill.slug}
                      className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_16px_48px_rgba(15,23,42,0.08)]"
                    >
                      <div className="flex gap-4">
                        <PluginIcon slug={skill.slug} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="violet">{branch.title}</Badge>
                            <Badge variant={skill.difficulty === "入门" ? "success" : skill.difficulty === "进阶" ? "blue" : "premium"}>
                              {skill.difficulty}
                            </Badge>
                            <Badge variant="muted">
                              节省：{skill.timeSaved}
                            </Badge>
                          </div>

                          <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-950">{skill.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-slate-600">{skill.outcome}</p>

                          <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                            <div>
                              <span className="font-semibold text-slate-900">适合：</span>
                              {skill.audience}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900">节省：</span>
                              {skill.timeSaved}
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400">连接工具</span>
                            {skill.tools.map((tool) => (
                              <span key={tool} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                                {tool}
                              </span>
                            ))}
                          </div>

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                            <span className="text-sm text-slate-500">{skill.relatedPack}</span>
                            <div className="flex flex-wrap gap-2">
                              <a
                                href={skill.installUrl}
                                target={skill.installUrl.startsWith("http") ? "_blank" : undefined}
                                rel={skill.installUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                                className="inline-flex h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                              >
                                {skill.installLabel}
                              </a>
                              <Link
                                href={skill.href}
                                className="inline-flex h-10 items-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition group-hover:bg-violet-700"
                              >
                                中文介绍
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
