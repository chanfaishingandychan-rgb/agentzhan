import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PromptCard } from "@/components/prompt-card";
import { getAllPrompts, getPromptBySlug, getRelatedPrompts } from "@/lib/prompts";
import { siteConfig } from "@/lib/site";

type PromptPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPrompts().map((prompt) => ({ slug: prompt.slug }));
}

export async function generateMetadata({ params }: PromptPageProps): Promise<Metadata> {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);
  if (!prompt) return {};

  return {
    title: prompt.seoTitle,
    description: prompt.seoDescription,
    keywords: [...prompt.tags, prompt.category.name, prompt.model],
    alternates: {
      canonical: `/prompt/${slug}`,
    },
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
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: `${siteConfig.url}/prompt/${prompt.slug}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: prompt.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首頁",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: prompt.category.name,
        item: `${siteConfig.url}/category/${prompt.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: prompt.title,
        item: `${siteConfig.url}/prompt/${prompt.slug}`,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <Link href="/" className="text-brand-700">
          首頁
        </Link>
        <span>/</span>
        <Link href={`/category/${prompt.category.slug}`} className="text-brand-700">
          {prompt.category.name}
        </Link>
        <span>/</span>
        <span>{prompt.title}</span>
      </div>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft lg:p-10">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-brand-50 px-3 py-1 font-medium text-brand-700">{prompt.category.name}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{prompt.model}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{prompt.difficulty}</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{prompt.title}</h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">{prompt.summary}</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            ["适用场景", prompt.useScene],
            ["適用模型", prompt.model],
            ["预期效果", prompt.expectedResult],
          ].map(([title, value]) => (
            <div key={title} className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">{title}</div>
              <p className="mt-2 text-sm leading-7 text-slate-600">{value}</p>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">完整提示詞</h2>
          <pre className="mt-4 rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-slate-100">{prompt.prompt}</pre>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">使用方法</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              {prompt.instructions.map((item) => (
                <li key={item} className="rounded-2xl bg-slate-50 p-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">使用案例</h2>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">{prompt.example}</div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">最佳實踐</h2>
          <ul className="mt-4 grid gap-3 lg:grid-cols-3">
            {prompt.bestPractices.map((item) => (
              <li key={item} className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">常見問題</h2>
          <div className="mt-4 space-y-3">
            {prompt.faq.map((item) => (
              <details key={item.question} className="rounded-2xl bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900">{item.question}</summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">標籤</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {prompt.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:border-brand-200 hover:text-brand-700"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-900">所屬分類</div>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              该提示詞归属于 {prompt.category.name}，适合继续浏览同类场景模板。
            </p>
            <Link href={`/category/${prompt.category.slug}`} className="mt-3 inline-block text-sm font-semibold text-brand-700">
              查看分類页
            </Link>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-900">適用模型</div>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              当前主适配模型为 {prompt.model}，但也兼容 ChatGPT、Claude、DeepSeek 等常见大模型。
            </p>
            <Link href={`/search?q=${encodeURIComponent(prompt.model)}`} className="mt-3 inline-block text-sm font-semibold text-brand-700">
              查看同模型內容
            </Link>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-900">延伸搜尋</div>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              建议继续搜尋相关標籤、场景词和业务关键词，扩大提示詞组合使用效果。
            </p>
            <Link href={`/search?q=${encodeURIComponent(prompt.title)}`} className="mt-3 inline-block text-sm font-semibold text-brand-700">
              搜尋相近内容
            </Link>
          </div>
        </section>
      </article>

      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">相關推薦</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {related.map((item) => (
            <PromptCard key={item.slug} prompt={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
