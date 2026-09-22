import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyButton } from "@/components/copy-button";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import { TrackedLink } from "@/components/tracked-link";
import { getAllGuides, getGuideBySlug, getRelatedGuides } from "@/lib/guides";
import { siteConfig } from "@/lib/site";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: {
      canonical: `${siteConfig.url}/guides/${guide.slug}`,
    },
    openGraph: {
      title: `${guide.title} - Agent站 AI教程`,
      description: guide.description,
      url: `${siteConfig.url}/guides/${guide.slug}`,
      siteName: siteConfig.name,
      type: "article",
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedGuides = getRelatedGuides(guide.slug, 3);
  const productCta = guide.productCta ?? {
    eyebrow: "可下载 Prompt 包",
    title: "AI 办公提效模板包",
    description: "会议纪要、周报、邮件、SOP 和资料总结模板，适合看完教程后直接复用。",
    href: "/products/ai-office-prompt-pack",
    priceLabel: "¥29.9 下载 →",
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.updatedAt,
    dateModified: guide.updatedAt,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: `${siteConfig.url}/guides/${guide.slug}`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="bg-[#fbfaf8]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="text-violet-600 transition hover:text-violet-700">首页</Link>
            <span>/</span>
            <Link href="/guides" className="text-violet-600 transition hover:text-violet-700">AI教程</Link>
            <span>/</span>
            <span className="text-slate-400">{guide.shortTitle}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              {guide.category}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {guide.readingTime}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {guide.audience}
            </span>
          </div>
          <h1 className="mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{guide.description}</p>
          <div className="mt-6 rounded-3xl border border-violet-100 bg-violet-50/70 p-5">
            <div className="text-sm font-bold text-violet-700">看完后你会得到</div>
            <p className="mt-2 text-base leading-8 text-slate-700">{guide.outcome}</p>
          </div>
        </div>
      </section>

      <article className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:px-8 lg:py-14">
        <div className="min-w-0">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-5 text-[1.03rem] leading-9 text-slate-800">
              {guide.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="mt-8 space-y-6">
            {guide.steps.map((section, index) => (
              <section key={section.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950">{section.title}</h2>
                </div>
                <div className="mt-5 space-y-4 text-base leading-8 text-slate-700">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </section>

          <section className="mt-8 rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">可直接复制的 Prompt</h2>
              <CopyButton text={guide.prompt} />
            </div>
            <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-white bg-white p-5 text-sm leading-7 text-slate-700 shadow-sm">
              {guide.prompt}
            </pre>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">发布前检查清单</h2>
              <ul className="mt-5 space-y-3">
                {guide.checklist.map((item) => (
                  <li key={item} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">常见问题</h2>
              <div className="mt-5 space-y-4">
                {guide.faqs.map((item) => (
                  <div key={item.question} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="font-bold text-slate-950">{item.question}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:p-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="text-sm font-semibold text-violet-200">免费领取</div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">把教程变成可复制的工作包</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                留下邮箱，选择你最想要的 AI 工作包。后续会优先发送 Prompt、模板和落地清单。
              </p>
            </div>
            <LeadCaptureForm source={`guide-${guide.slug}`} />
          </section>
        </div>

        <aside className="h-fit space-y-5 lg:sticky lg:top-24">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">站内相关资源</h2>
            <div className="mt-4 space-y-2">
              {guide.related.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-950">继续阅读</h2>
            <div className="mt-4 space-y-2">
              {relatedGuides.map((item) => (
                <Link
                  key={item.slug}
                  href={`/guides/${item.slug}`}
                  className="block rounded-2xl px-3 py-3 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-violet-700"
                >
                  {item.shortTitle}
                </Link>
              ))}
            </div>
          </section>

          <TrackedLink
            href={productCta.href}
            eventName="guide-product-cta"
            className="block rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-blue-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300"
          >
            <div className="text-sm font-semibold text-violet-700">{productCta.eyebrow}</div>
            <div className="mt-2 text-lg font-bold text-slate-950">{productCta.title}</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{productCta.description}</p>
            <div className="mt-4 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
              {productCta.priceLabel}
            </div>
          </TrackedLink>

          <TrackedLink
            href="/consulting"
            eventName="guide-consulting-cta"
            className="block rounded-3xl bg-slate-950 p-5 text-white shadow-[0_18px_56px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5"
          >
            <div className="text-sm font-semibold text-violet-200">需要落地到你的业务？</div>
            <div className="mt-2 text-lg font-bold">找 Agent站 做 AI 咨询</div>
            <div className="mt-4 text-sm font-semibold text-white">查看服务 →</div>
          </TrackedLink>
        </aside>
      </article>
    </main>
  );
}
