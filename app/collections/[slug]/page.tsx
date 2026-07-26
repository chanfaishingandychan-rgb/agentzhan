import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PromptCard } from "@/components/prompt-card";
import { Badge } from "@/components/ui/badge";
import {
  getAllCollections,
  getCollectionBySlug,
  getCollectionPrompts,
} from "@/lib/collections";
import { siteConfig } from "@/lib/site";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllCollections().map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};

  return {
    title: collection.seoTitle,
    description: collection.seoDescription,
    keywords: [
      collection.title,
      ...collection.useCases,
      ...collection.relatedModels,
      "AI Prompt",
      "提示词合集",
    ],
    alternates: { canonical: `/collections/${slug}` },
    openGraph: {
      title: collection.seoTitle,
      description: collection.seoDescription,
      url: `${siteConfig.url}/collections/${slug}`,
      locale: "zh_CN",
      type: "article",
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const prompts = getCollectionPrompts(collection, 8);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: collection.seoTitle,
    description: collection.seoDescription,
    inLanguage: "zh-CN",
    author: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/collections/${collection.slug}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: collection.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "精品合集", item: `${siteConfig.url}/collections` },
      {
        "@type": "ListItem",
        position: 3,
        name: collection.title,
        item: `${siteConfig.url}/collections/${collection.slug}`,
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />
        <div className="absolute inset-0 bg-mesh" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-white">首页</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-white">精品合集</Link>
            <span>/</span>
            <span className="text-slate-500">{collection.title}</span>
          </div>

          <div className="max-w-4xl">
            <div className="mb-5 flex flex-wrap gap-2">
              {collection.relatedModels.map((model) => (
                <Badge key={model} variant="blue">{model}</Badge>
              ))}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {collection.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
              {collection.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#prompts"
                className="inline-flex h-11 items-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(124,58,237,0.35)] transition hover:-translate-y-0.5"
              >
                查看推荐 Prompt
              </Link>
              <Link
                href="/collections"
                className="inline-flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                返回合集
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr,340px] lg:px-8 lg:py-20">
        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">怎么使用这个合集</h2>
            <div className="mt-6 space-y-4">
              {collection.guide.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-7 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="prompts" className="scroll-mt-24">
            <div className="mb-6">
              <div className="text-sm font-semibold text-violet-600">推荐 Prompt</div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">可以直接复制使用</h2>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                这些 Prompt 从现有内容库中筛选而来，适合当前合集的核心场景。
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.slug} prompt={prompt} />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">常见问题</h2>
            <div className="mt-6 space-y-3">
              {collection.faq.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-slate-200 bg-white">
                  <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold text-slate-950">
                    {item.question}
                    <svg className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-7 text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">适合谁使用</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {collection.targetUsers.map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">核心场景</h2>
            <ul className="mt-4 space-y-3">
              {collection.useCases.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 p-6">
            <h2 className="text-base font-bold text-slate-950">未来变现方向</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{collection.monetizationHint}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
