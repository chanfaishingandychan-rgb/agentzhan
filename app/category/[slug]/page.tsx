import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PromptCard } from "@/components/prompt-card";
import { SectionHeading } from "@/components/section-heading";
import { getCategoryBySlug, getPopularPrompts, getPromptsByCategory } from "@/lib/prompts";
import { categories, siteConfig } from "@/lib/site";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return {};
  }
  return {
    title: `${category.name}提示词大全`,
    description: `${category.description} ${category.intro} 当前分类已收录 ${getPromptsByCategory(slug).length} 篇高质量中文提示词内容。`,
    keywords: [...category.keywords],
    alternates: {
      canonical: `/category/${slug}`,
    },
    openGraph: {
      title: `${category.name}提示词大全`,
      description: `${category.description} ${category.intro} 当前分类已收录 ${getPromptsByCategory(slug).length} 篇高质量中文提示词内容。`,
      url: `${siteConfig.url}/category/${slug}`,
      locale: "zh_CN",
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const prompts = getPromptsByCategory(slug);
  const fallbackPrompts = getPopularPrompts(6).filter((item) => item.category.slug !== slug);
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name}提示词大全`,
    description: category.description,
    url: `${siteConfig.url}/category/${slug}`,
    inLanguage: "zh-CN",
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <div className="mb-8">
        <Link href="/" className="text-sm text-brand-700">
          返回首页
        </Link>
      </div>
      <SectionHeading
        eyebrow="分类页"
        title={`${category.name}提示词大全`}
        description={`${category.description} ${category.intro} 当前已收录 ${prompts.length} 篇内容，适合百度分类页收录和长尾关键词布局。`}
      />
      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-5">
          <div className="text-sm font-semibold text-slate-900">适合人群</div>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            普通上班族、学生、自媒体创作者、电商卖家、中小企业老板、AI 初学者。
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5">
          <div className="text-sm font-semibold text-slate-900">SEO 价值</div>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            该分类页可承接分类词、场景词、模型词和问题词流量，适合做百度长尾关键词聚合。
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5">
          <div className="text-sm font-semibold text-slate-900">推荐检索词</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {category.keywords.map((keyword) => (
              <Link
                key={keyword}
                href={`/search?q=${encodeURIComponent(keyword)}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-brand-200 hover:text-brand-700"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {prompts.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.slug} prompt={prompt} />
          ))}
        </div>
      ) : (
        <section>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft lg:p-8">
            <h2 className="text-xl font-semibold text-slate-900">分类内容建设说明</h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">
              {category.name}
              分类已经纳入站点信息架构，后续会持续补充专题提示词、工作流案例和模型适配模板。当前建议先从已有高频分类进入，查找可直接复用的中文提示词，再逐步扩展到该专题。
            </p>
            <p className="mt-4 text-sm leading-8 text-slate-600">
              从百度 SEO 角度，这类分类页可以先沉淀分类定义、适用人群、常见问题、相关专题和内部链接，帮助搜索引擎理解网站主题边界，再逐步承接更细的详情页内容。
            </p>
          </div>

          <div className="mt-10">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">先从这些高频提示词开始</h2>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {fallbackPrompts.map((prompt) => (
                <PromptCard key={prompt.slug} prompt={prompt} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
