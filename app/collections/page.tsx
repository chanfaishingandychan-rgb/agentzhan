import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { getAllCollections } from "@/lib/collections";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Prompt 精品合集",
  description: "按办公、短视频、小红书、电商和编程等真实工作场景整理的中文 AI Prompt 精品合集。",
  alternates: { canonical: "/collections" },
  openGraph: {
    title: "AI Prompt 精品合集",
    description: "按真实工作场景整理的中文 AI Prompt 精品合集，适合直接复制使用。",
    url: `${siteConfig.url}/collections`,
    locale: "zh_CN",
    type: "website",
  },
};

export default function CollectionsPage() {
  const collections = getAllCollections();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Prompt 精品合集",
    description: "按真实工作场景整理的中文 AI Prompt 精品合集。",
    url: `${siteConfig.url}/collections`,
    inLanguage: "zh-CN",
    mainEntity: collections.map((collection) => ({
      "@type": "ItemList",
      name: collection.title,
      url: `${siteConfig.url}/collections/${collection.slug}`,
    })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden bg-slate-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />
        <div className="absolute inset-0 bg-mesh" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
              Curated Prompt Collections
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              AI Prompt 精品合集
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-400 sm:text-lg">
              不只是单条提示词，而是按真实工作场景整理好的 AI 使用方案。选择一个合集，直接进入可复制、可落地的工作流。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="精选场景"
          title="从一个工作目标开始使用 AI"
          description="每个合集都包含目标用户、使用场景、操作建议和推荐 Prompt，更适合新手快速上手。"
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection, index) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_60px_rgba(124,58,237,0.12)]"
            >
              <div className="absolute right-4 top-4 text-5xl font-black text-slate-100 transition group-hover:text-violet-100">
                0{index + 1}
              </div>
              <div className="relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-sm font-bold text-white shadow-[0_12px_30px_rgba(124,58,237,0.22)]">
                  AI
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-950">{collection.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-500">{collection.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {collection.useCases.slice(0, 3).map((item) => (
                    <span key={item} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-6 inline-flex text-sm font-semibold text-violet-600">
                  查看合集 &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
