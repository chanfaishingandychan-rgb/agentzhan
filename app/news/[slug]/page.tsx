import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAiNewsArticleForSite, getLatestAiNews, type AiNewsItem } from "@/lib/news";
import { siteConfig } from "@/lib/site";

type NewsArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

const categoryStyles: Record<AiNewsItem["category"], string> = {
  模型更新: "border-violet-200 bg-violet-50 text-violet-700",
  产品功能: "border-blue-200 bg-blue-50 text-blue-700",
  Agent趋势: "border-cyan-200 bg-cyan-50 text-cyan-700",
  行业应用: "border-emerald-200 bg-emerald-50 text-emerald-700",
  安全与合规: "border-amber-200 bg-amber-50 text-amber-700",
};

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getAiNewsArticleForSite(slug);
  if (!article) return {};

  return {
    title: `${article.item.title} - 中文解读`,
    description: article.item.summary,
    alternates: {
      canonical: `${siteConfig.url}/news/${slug}`,
    },
    openGraph: {
      title: `${article.item.title} - 中文解读`,
      description: article.item.summary,
      url: `${siteConfig.url}/news/${slug}`,
      siteName: siteConfig.name,
      locale: "zh_CN",
      type: "article",
      publishedTime: article.item.publishedAt,
    },
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = await getAiNewsArticleForSite(slug);
  if (!article) notFound();

  const related = getLatestAiNews(8).filter((item) => item.slug !== article.item.slug).slice(0, 3);
  const originalSection = article.sections.find((section) => section.title === "中文原文");
  const summarySection = article.sections.find((section) => section.title === "Agent站总结");

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${article.item.title} - 中文解读`,
    description: article.item.summary,
    datePublished: article.item.publishedAt,
    dateModified: article.item.publishedAt,
    inLanguage: "zh-CN",
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/news/${article.item.slug}`,
    isBasedOn: article.item.sourceUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "AI資訊", item: `${siteConfig.url}/news` },
      { "@type": "ListItem", position: 3, name: article.item.title, item: `${siteConfig.url}/news/${article.item.slug}` },
    ],
  };

  return (
    <main className="bg-[#fafafa]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="text-violet-600 transition hover:text-violet-700">首页</Link>
            <span>/</span>
            <Link href="/news" className="text-violet-600 transition hover:text-violet-700">AI資訊</Link>
            <span>/</span>
            <span className="max-w-[220px] truncate text-slate-400 sm:max-w-md">{article.item.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${categoryStyles[article.item.category]}`}>
              {article.item.category}
            </span>
            <span className="text-xs font-medium text-slate-400">{article.item.publishedAt}</span>
            <span className="text-xs font-medium text-slate-400">来源：{article.item.source}</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {article.item.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{article.deck}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={article.item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              查看官方原文
            </a>
            <Link
              href="/news"
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50"
            >
              返回 AI資訊
            </Link>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-[2rem] border border-slate-200 bg-white px-5 py-8 shadow-sm sm:px-8 lg:px-10">
          <div className="border-b border-slate-100 pb-8">
            <div className="mb-4 text-sm font-semibold text-violet-600">中文原文翻译</div>
            <p className="text-lg leading-9 text-slate-700">{article.item.summary}</p>
          </div>

          <div className="py-10">
            <div className="space-y-6">
              {originalSection?.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-[17px] leading-9 text-slate-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <section className="border-t border-slate-100 pt-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">Agent站总结</h2>
            <div className="mt-5 space-y-5">
              {summarySection?.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-[17px] leading-9 text-slate-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {article.relatedQueries.map((query) => (
            <Link
              key={query}
              href={`/search?q=${encodeURIComponent(query)}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
            >
              #{query}
            </Link>
          ))}
        </div>

        {related.length > 0 && (
          <section className="mt-12 border-t border-slate-200 pt-8">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">继续阅读</h2>
            <div className="mt-5 grid gap-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/news/${item.slug}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-violet-200 hover:bg-violet-50/50"
                >
                  <div className="text-xs font-medium text-slate-400">{item.publishedAt} · {item.source}</div>
                  <div className="mt-1 text-base font-semibold leading-7 text-slate-900 transition hover:text-violet-600">
                    {item.title}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
