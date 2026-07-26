import type { Metadata } from "next";
import Link from "next/link";

import { PluginVisual } from "@/components/plugin-visual";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section-header";
import { allSkills, skillBranches } from "@/lib/skills";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI插件库 - Agent站",
  description:
    "Agent站 AI插件库，按办公、开发、营销、企业流程等场景整理 Agent 外挂程式、连接工具、使用方法和变现方向。",
  alternates: {
    canonical: `${siteConfig.url}/skills`,
  },
  openGraph: {
    title: "AI插件库 - Agent站",
    description: "查看可落地的 Agent 插件介绍、连接工具、适合场景和变现方向。",
    url: `${siteConfig.url}/skills`,
    siteName: siteConfig.name,
    type: "website",
  },
};

const stats = [
  { label: "插件分类", value: `${skillBranches.length}` },
  { label: "可用插件", value: `${allSkills.length}+` },
  { label: "高变现场景", value: `${allSkills.filter((skill) => skill.monetization === "高").length}` },
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

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeader
          eyebrow="插件分类"
          title="先选一个插件方向，再连接到真实工具"
          description="这些插件方向对应未来最容易变现的场景：办公自动化、开发部署、营销增长和企业流程。"
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

                <div className="grid gap-5 lg:grid-cols-2">
                  {branch.skills.map((skill) => (
                    <article
                      key={skill.slug}
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:bg-white hover:shadow-[0_16px_48px_rgba(15,23,42,0.08)]"
                    >
                      <PluginVisual title={skill.title} accent={branch.color} compact />

                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <Badge variant="violet">{branch.title}</Badge>
                        <Badge variant={skill.difficulty === "入门" ? "success" : skill.difficulty === "进阶" ? "blue" : "premium"}>
                          {skill.difficulty}
                        </Badge>
                        <Badge variant={skill.monetization === "高" ? "premium" : "muted"}>
                          变现潜力：{skill.monetization}
                        </Badge>
                      </div>

                      <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-950">{skill.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{skill.outcome}</p>

                      <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
                        <div>
                          <span className="font-semibold text-slate-900">适合人群：</span>
                          <span className="text-slate-600">{skill.audience}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">预计节省：</span>
                          <span className="text-slate-600">{skill.timeSaved}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-900">连接工具：</span>
                          {skill.tools.map((tool) => (
                            <span key={tool} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5">
                        <h4 className="text-sm font-semibold text-slate-950">接入步骤</h4>
                        <ol className="mt-3 space-y-2">
                          {skill.steps.map((step, index) => (
                            <li key={step} className="flex gap-3 text-sm leading-6 text-slate-600">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                                {index + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="mt-5 rounded-2xl bg-slate-950 p-4">
                        <div className="mb-2 text-xs font-semibold text-violet-200">典型应用场景</div>
                        <p className="text-sm leading-7 text-slate-200">{skill.promptExample}</p>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-sm text-slate-500">相关产品：{skill.relatedPack}</span>
                        <Link
                          href={skill.href}
                          className="inline-flex h-10 items-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
                        >
                          查看插件详情
                        </Link>
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
