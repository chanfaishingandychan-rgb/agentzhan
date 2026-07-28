import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAiNewsArticleForSite, getLatestAiNewsForSite, type AiNewsItem } from "@/lib/news";
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

  const related = (await getLatestAiNewsForSite(8)).filter((item) => item.slug !== article.item.slug).slice(0, 3);

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
      { "@type": "ListItem", position: 2, name: "AI资讯", item: `${siteConfig.url}/news` },
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
            <Link href="/news" className="text-violet-600 transition hover:text-violet-700">AI资讯</Link>
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
              返回 AI资讯
            </Link>
          </div>
        </div>
      </section>

      <article className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8 lg:py-14">
        <div className="space-y-8">
          <section className="rounded-3xl border border-violet-100 bg-violet-50/70 p-6">
            <div className="text-sm font-bold text-violet-800">一句话看懂</div>
            <p className="mt-2 text-base leading-8 text-violet-950/80">{article.item.summary}</p>
          </section>

          {article.sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold tracking-tight text-slate-950">{section.title}</h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-8 text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">下一步可以做什么</h2>
            <div className="mt-5 grid gap-3">
              {article.actionItems.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">观察重点</h2>
            <ul className="mt-4 space-y-3">
              {article.watchPoints.map((item) => (
                <li key={item} className="text-sm leading-6 text-slate-600">
                  <span className="mr-2 text-violet-600">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">相关搜索</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {article.relatedQueries.map((query) => (
                <Link
                  key={query}
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                >
                  #{query}
                </Link>
              ))}
            </div>
          </section>

          {related.length > 0 && (
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-950">更多快讯</h2>
              <div className="mt-4 space-y-4">
                {related.map((item) => (
                  <Link key={item.slug} href={`/news/${item.slug}`} className="block border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
                    <div className="text-xs font-medium text-slate-400">{item.publishedAt}</div>
                    <div className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-slate-800 transition hover:text-violet-600">
                      {item.title}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </article>
    </main>
  );
}
