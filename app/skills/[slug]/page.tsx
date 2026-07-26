import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PluginIcon } from "@/components/plugin-icon";
import { Badge } from "@/components/ui/badge";
import { allSkills, getSkillBySlug } from "@/lib/skills";
import { siteConfig } from "@/lib/site";

type SkillPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allSkills.map((skill) => ({
    slug: skill.slug,
  }));
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);

  if (!skill) {
    return {};
  }

  const title = `${skill.title} - Agent插件介绍 - Agent站`;
  const description = `${skill.title}适合${skill.audience}，了解如何连接 ${skill.tools.join("、")}，让 Agent 完成可交付的自动化任务。`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/skills/${skill.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/skills/${skill.slug}`,
      siteName: siteConfig.name,
      type: "article",
    },
  };
}

export default async function SkillDetailPage({ params }: SkillPageProps) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);

  if (!skill) {
    notFound();
  }

  const relatedSkills = allSkills
    .filter((item) => item.slug !== skill.slug && (item.branchSlug === skill.branchSlug || item.monetization === "高"))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: skill.title,
    description: skill.outcome,
    applicationCategory: "AI Agent Plugin",
    operatingSystem: "Web",
    featureList: skill.steps,
  };

  return (
    <main className="bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className={`pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-gradient-to-br ${skill.color} opacity-25 blur-3xl`} />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <Link href="/skills" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
              <span aria-hidden="true">&larr;</span>
              返回 AI 插件库
            </Link>

            <div className="mt-8 max-w-4xl">
              <div className="mb-6 flex items-center gap-4">
                <PluginIcon slug={skill.slug} className="h-16 w-16 rounded-3xl" />
                <div className="text-sm text-slate-400">
                  官方入口：{skill.installLabel}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="violet">{skill.branch}</Badge>
                <Badge variant={skill.difficulty === "入门" ? "success" : skill.difficulty === "进阶" ? "blue" : "premium"}>
                  {skill.difficulty}
                </Badge>
                <Badge variant={skill.monetization === "高" ? "premium" : "muted"}>
                  变现潜力：{skill.monetization}
                </Badge>
              </div>

              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                {skill.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                {skill.outcome}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={skill.installUrl}
                  target={skill.installUrl.startsWith("http") ? "_blank" : undefined}
                  rel={skill.installUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  {skill.installLabel}
                </a>
                <a
                  href="#wechat"
                  className="inline-flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  微信咨询代安装
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr,340px] lg:px-8 lg:py-16">
        <div className="space-y-8">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">这个插件能帮你做什么？</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard title="适合人群" content={skill.audience} />
              <InfoCard title="预计节省时间" content={skill.timeSaved} />
              <InfoCard title="连接工具" content={skill.tools.join("、")} />
              <InfoCard title="可包装服务" content={skill.relatedPack} />
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">插件接入步骤</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              插件的关键不是“会说”，而是能连接真实工具、执行任务、记录结果，最后形成可重复交付的自动化能力。
            </p>
            <ol className="mt-6 space-y-4">
              {skill.steps.map((step, index) => (
                <li key={step} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-950">{step}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      把这一步变成固定流程，后面就可以复制给不同项目或客户使用。
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-950 p-6 shadow-sm sm:p-8">
            <div className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-violet-100">
              应用场景
            </div>
            <h2 className="text-2xl font-bold text-white">这个插件适合用在哪里？</h2>
            <p className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-slate-200">
              {skill.promptExample}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              重点是把这个场景产品化：明确用户、输入资料、执行流程、审核节点和最后交付物。
            </p>
          </article>

          <article className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">如何用这个插件变现？</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                "做成付费插件方案",
                "提供安装配置服务",
                "为企业搭建自动化流程",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/70 bg-white/80 p-4 text-sm font-semibold text-slate-700 shadow-sm">
                  {item}
                </div>
              ))}
            </div>
            <a
              href="#wechat"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              微信咨询企业插件服务
            </a>
          </article>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">插件摘要</h2>
            <div className="mt-5 space-y-4 text-sm">
              <SummaryRow label="分支" value={skill.branch} />
              <SummaryRow label="难度" value={skill.difficulty} />
              <SummaryRow label="变现" value={skill.monetization} />
              <SummaryRow label="工具" value={skill.tools.join(" / ")} />
            </div>
            <Link
              href="/skills"
              className="mt-6 inline-flex w-full justify-center rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              查看更多 AI 插件
            </Link>
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">相关插件</h2>
            <div className="mt-4 space-y-3">
              {relatedSkills.map((item) => (
                <Link key={item.slug} href={`/skills/${item.slug}`} className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-violet-200 hover:bg-violet-50">
                  <div className="text-sm font-semibold text-slate-950">{item.title}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">{item.outcome}</div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function InfoCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold text-slate-400">{title}</div>
      <div className="mt-2 text-sm font-semibold leading-6 text-slate-800">{content}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-semibold text-slate-800">{value}</span>
    </div>
  );
}
