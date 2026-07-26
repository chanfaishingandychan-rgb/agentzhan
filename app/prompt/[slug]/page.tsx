import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyButton } from "@/components/copy-button";
import { PromptCard } from "@/components/prompt-card";
import { Badge } from "@/components/ui/badge";
import { getAllPrompts, getPromptBySlug, getRelatedPrompts } from "@/lib/prompts";
import { siteConfig } from "@/lib/site";

type PromptPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPrompts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PromptPageProps): Promise<Metadata> {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);
  if (!prompt) return {};
  return {
    title: prompt.seoTitle,
    description: prompt.seoDescription,
    keywords: [...prompt.tags, prompt.category.name, prompt.model],
    alternates: { canonical: `/prompt/${slug}` },
    openGraph: {
      title: prompt.seoTitle,
      description: prompt.seoDescription,
      url: `${siteConfig.url}/prompt/${slug}`,
      locale: "zh_CN",
      type: "article",
    },
  };
}

export default async function PromptPage({ params }: PromptPageProps) {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);
  if (!prompt) notFound();
  const related = getRelatedPrompts(prompt, 6);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: prompt.seoTitle,
    description: prompt.seoDescription,
    datePublished: prompt.publishedAt,
    dateModified: prompt.publishedAt,
    inLanguage: "zh-CN",
    author: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/prompt/${prompt.slug}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: prompt.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首頁", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: prompt.category.name, item: `${siteConfig.url}/category/${prompt.category.slug}` },
      { "@type": "ListItem", position: 3, name: prompt.title, item: `${siteConfig.url}/prompt/${prompt.slug}` },
    ],
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="text-violet-600 hover:text-violet-700">首頁</Link>
        <span>/</span>
        <Link href={`/category/${prompt.category.slug}`} className="text-violet-600 hover:text-violet-700">
          {prompt.category.name}
        </Link>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-[200px] sm:max-w-xs">{prompt.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="violet">{prompt.category.name}</Badge>
          <Badge variant="blue">{prompt.model}</Badge>
          <Badge variant="muted">{prompt.difficulty}</Badge>
          {prompt.tier === "vip" && <Badge variant="premium">VIP</Badge>}
          {prompt.tier === "free" && <Badge variant="success">免費</Badge>}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          {prompt.title}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">{prompt.summary}</p>
      </div>

      {/* Quick info grid */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {[
          ["適用場景", prompt.useScene],
          ["適用模型", prompt.model],
          ["預期效果", prompt.expectedResult],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
          </div>
        ))}
      </div>

      {/* Prompt + Copy */}
      <section className="mb-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold text-slate-900">完整提示詞</h2>
          <CopyButton text={prompt.prompt} />
        </div>
        <div className="relative rounded-2xl bg-slate-950 p-4 sm:p-6 lg:p-8">
          <pre className="overflow-x-auto text-sm leading-7 text-slate-100 whitespace-pre-wrap break-words font-mono">
            {prompt.prompt}
          </pre>
        </div>
      </section>

      {/* Instructions + Example */}
      <div className="mb-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">使用方法</h2>
          <ul className="mt-4 space-y-3">
            {prompt.instructions.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm leading-7 text-slate-600">
                <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">使用案例</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{prompt.example}</p>
        </div>
      </div>

      {/* Best practices */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">最佳實踐</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {prompt.bestPractices.map((item, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-600">
                {i + 1}
              </div>
              <p className="text-sm leading-6 text-slate-600">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">常見問題</h2>
        <div className="space-y-3">
          {prompt.faq.map((item) => (
            <details key={item.question} className="group rounded-2xl border border-slate-200 bg-white transition-colors hover:border-violet-100">
              <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold text-slate-900">
                {item.question}
                <svg className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="px-5 pb-5">
                <p className="text-sm leading-7 text-slate-600">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Tags */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">標籤</h2>
        <div className="flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section className="mb-10 grid gap-4 sm:grid-cols-3">
        <Link
          href={`/category/${prompt.category.slug}`}
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-violet-200 hover:-translate-y-0.5"
        >
          <div className="text-sm font-semibold text-slate-900">所屬分類</div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            瀏覽更多 {prompt.category.name} 提示詞
          </p>
          <span className="mt-2 inline-block text-sm font-semibold text-violet-600">查看分類 &rarr;</span>
        </Link>
        <Link
          href={`/search?model=${encodeURIComponent(prompt.model)}`}
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-violet-200 hover:-translate-y-0.5"
        >
          <div className="text-sm font-semibold text-slate-900">適用模型</div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            主適配 {prompt.model}，兼容 ChatGPT、Claude、DeepSeek
          </p>
          <span className="mt-2 inline-block text-sm font-semibold text-violet-600">同模型內容 &rarr;</span>
        </Link>
        <Link
          href={`/search?q=${encodeURIComponent(prompt.title)}`}
          className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-violet-200 hover:-translate-y-0.5"
        >
          <div className="text-sm font-semibold text-slate-900">延伸搜尋</div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            搜尋相關標籤、場景詞和業務關鍵詞
          </p>
          <span className="mt-2 inline-block text-sm font-semibold text-violet-600">搜尋相近內容 &rarr;</span>
        </Link>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-slate-200 pt-12">
          <h2 className="mb-6 text-xl font-bold text-slate-900">相關推薦</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <PromptCard key={item.slug} prompt={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
