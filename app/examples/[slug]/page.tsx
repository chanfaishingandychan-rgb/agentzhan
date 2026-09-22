import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { exampleCases, getExampleBySlug } from "@/lib/examples";
import { siteConfig } from "@/lib/site";

type ExampleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return exampleCases.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ExampleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const example = getExampleBySlug(slug);
  if (!example) return {};

  return {
    title: `${example.title} - AI Skill 示例`,
    description: example.description,
    alternates: {
      canonical: `${siteConfig.url}/examples/${example.slug}`,
    },
    openGraph: {
      title: `${example.title} - Agent站示例中心`,
      description: example.description,
      url: `${siteConfig.url}/examples/${example.slug}`,
      siteName: siteConfig.name,
      type: "article",
    },
  };
}

export default async function ExampleDetailPage({ params }: ExampleDetailPageProps) {
  const { slug } = await params;
  const example = getExampleBySlug(slug);
  if (!example) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: example.title,
    description: example.description,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: `${siteConfig.url}/examples/${example.slug}`,
  };

  return (
    <main className="bg-[#fafafa]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="text-violet-600 transition hover:text-violet-700">首页</Link>
            <span>/</span>
            <Link href="/examples" className="text-violet-600 transition hover:text-violet-700">示例中心</Link>
            <span>/</span>
            <span>{example.category}</span>
          </div>
          <div className="mt-6 inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            {example.category}
          </div>
          <h1 className="mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            {example.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            {example.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            <section className="border-b border-slate-200 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <h2 className="text-sm font-bold text-slate-500">{example.beforeLabel}</h2>
              <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                {example.before}
              </pre>
            </section>
            <section className="p-6 sm:p-8">
              <h2 className="text-sm font-bold text-violet-700">{example.afterLabel}</h2>
              <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-violet-100 bg-violet-50/70 p-5 text-sm leading-7 text-slate-800">
                {example.after}
              </pre>
            </section>
          </div>
        </article>

        <section className="mt-8 rounded-3xl border border-violet-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-sm font-semibold text-violet-700">对应工具或服务</div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{example.relatedSkillTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            这个示例只展示其中一个用法。你可以参考资料范围、处理步骤和检查清单，把同一方法套到自己的真实场景里。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={example.relatedSkillHref}
              className="inline-flex h-11 items-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              查看详情
            </Link>
            <Link
              href="/examples"
              className="inline-flex h-11 items-center rounded-full border border-slate-200 bg-slate-50 px-6 text-sm font-semibold text-violet-700 transition hover:border-violet-200 hover:bg-violet-50"
            >
              返回示例中心
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
