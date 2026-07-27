import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PromptCard } from "@/components/prompt-card";
import { Badge } from "@/components/ui/badge";
import { getPromptsByIndustry, getPopularPrompts } from "@/lib/prompts";
import { getIndustryBySlug, industries } from "@/lib/industries";
import { siteConfig } from "@/lib/site";

type IndustryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return {};

  const count = getPromptsByIndustry(slug).length;
  const title = `${industry.name} AI提示词 - Agent站`;
  const description = `${industry.description} 当前整理 ${count} 条相关中文 Prompt，适合${industry.audience}快速复制使用。`;

  return {
    title,
    description,
    keywords: [`${industry.name}AI提示词`, `${industry.name}Prompt`, ...industry.keywords.slice(0, 8)],
    alternates: {
      canonical: `${siteConfig.url}/industry/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/industry/${slug}`,
      siteName: siteConfig.name,
      type: "website",
    },
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) notFound();

  const prompts = getPromptsByIndustry(slug);
  const fallbackPrompts = getPopularPrompts(6);
  const relatedIndustries = industries.filter((item) => item.slug !== industry.slug).slice(0, 6);
  const shownPrompts = prompts.length > 0 ? prompts : fallbackPrompts;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${industry.name} AI提示词`,
    description: industry.description,
    url: `${siteConfig.url}/industry/${slug}`,
    inLanguage: "zh-CN",
  };

  return (
    <main className="bg-[#fafafa]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className={`pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br ${industry.color} opacity-30 blur-3xl`} />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Link href="/#industries" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
            <span aria-hidden="true">&larr;</span>
            返回行业分类
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-violet-100">
                行业 Prompt
              </div>
              <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                {industry.name} AI提示词
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                {industry.description} 这里会把相关写作、运营、客服、销售和办公 Prompt 集中到一个行业入口，方便直接复制使用。
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {industry.keywords.slice(0, 8).map((keyword) => (
                  <span key={keyword} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${industry.color} text-base font-black text-white shadow-lg`}>
                {industry.shortName}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-black">{prompts.length}</div>
                  <div className="mt-1 text-xs text-slate-400">相关提示词</div>
                </div>
                <div>
                  <div className="text-3xl font-black">{industry.keywords.length}</div>
                  <div className="mt-1 text-xs text-slate-400">匹配场景</div>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-300">适合：{industry.audience}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="violet">{industry.name}</Badge>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              这个行业常用的 Prompt
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              优先显示和 {industry.name} 相关的提示词。复制后补充你的产品、客户、渠道和限制条件，效果会更贴近真实业务。
            </p>
          </div>
          <Link
            href="/search"
            className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-violet-600 transition hover:border-violet-200 hover:bg-violet-50"
          >
            搜索全部 Prompt
          </Link>
        </div>

        {prompts.length === 0 ? (
          <div className="mb-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950/80">
            这个行业的专属提示词正在补充中，下面先显示站内热门 Prompt。你也可以用搜索框查找更细的场景词。
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {shownPrompts.map((prompt) => (
            <PromptCard key={prompt.slug} prompt={prompt} />
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-950">也可以看看这些行业</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">如果你的业务横跨内容、电商、客服或办公，可以从相近行业继续找 Prompt。</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedIndustries.map((item) => (
              <Link
                key={item.slug}
                href={`/industry/${item.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-xs font-bold text-white`}>
                  {item.shortName}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-950 group-hover:text-violet-700">{item.name}</div>
                  <div className="mt-1 line-clamp-1 text-xs text-slate-500">{item.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
