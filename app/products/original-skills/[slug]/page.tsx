import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductPurchaseBox } from "@/components/product-purchase-box";
import {
  getOriginalSkillCanonicalUrl,
  getOriginalSkillProduct,
  isOriginalSkillUnlockCodeValid,
  originalSkillProducts,
} from "@/lib/original-skill-products";
import { siteConfig } from "@/lib/site";

type OriginalSkillPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export function generateStaticParams() {
  return originalSkillProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: OriginalSkillPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getOriginalSkillProduct(slug);
  if (!product) return {};

  return {
    title: product.title,
    description: product.description,
    alternates: {
      canonical: getOriginalSkillCanonicalUrl(slug),
    },
    openGraph: {
      title: `${product.title} - Agent站`,
      description: product.description,
      url: getOriginalSkillCanonicalUrl(slug),
      siteName: siteConfig.name,
      type: "website",
    },
  };
}

export default async function OriginalSkillPage({ params, searchParams }: OriginalSkillPageProps) {
  const { slug } = await params;
  const product = getOriginalSkillProduct(slug);
  if (!product) notFound();

  const sp = await searchParams;
  const unlock = typeof sp.unlock === "string" ? sp.unlock.trim() : undefined;
  const unlocked = isOriginalSkillUnlockCodeValid(slug, unlock);
  const downloadHref = unlocked && unlock ? `${product.apiPath}?token=${encodeURIComponent(unlock)}` : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: "Agent站",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: String(product.priceAmount),
      availability: "https://schema.org/InStock",
      url: getOriginalSkillCanonicalUrl(slug),
    },
  };

  return (
    <main className="bg-[#fafafa]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8 lg:py-24">
          <div>
            <Link href="/products/agentzhan-original-skills" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
              <span aria-hidden="true">&larr;</span>
              返回原创 Skill
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-950">大众 Skill</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-violet-100">{product.category}</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-rose-100">可下载 ZIP</span>
            </div>
            <h1 className="mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              {product.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              {product.description}
            </p>
            <div className="mt-6 text-sm font-semibold text-slate-300">
              适合：{product.audience}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#buy"
                className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                购买下载 {product.priceLabel}
              </a>
              <a
                href="#included"
                className="inline-flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                查看交付内容
              </a>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
            <div className="text-sm text-slate-300">首批价格</div>
            <div className="mt-2 text-5xl font-black tracking-tight">{product.priceLabel}</div>
            <div className="mt-2 text-sm text-slate-300">ZIP 下载，内含 Skill 和 Prompt</div>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <SummaryLine label="格式" value="SKILL.md + Markdown" />
              <SummaryLine label="文件" value={`${product.files.length} 个交付文件`} />
              <SummaryLine label="类型" value={product.category} />
              <SummaryLine label="交付" value="下载码解锁" />
            </div>
            <a
              href="#buy"
              className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-rose-500 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              购买并下载
            </a>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8 lg:py-20">
        <div className="space-y-8">
          <article className="rounded-3xl border border-violet-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-sm font-semibold text-violet-700">新手先看</div>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">买回去以后，怎样真正用起来？</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Skill 包不是普通文章。你可以把它当成一套固定流程：先看说明，再复制 Prompt，填入自己的资料，最后用检查清单确认结果。
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {[
                ["1", "打开 README", "先看适合场景和文件说明。"],
                ["2", "复制 Prompt", "选择与你任务最接近的模板。"],
                ["3", "填入资料", "把尖括号和示例换成真实信息。"],
                ["4", "检查结果", "用 checklist 避免错字、乱承诺和资料泄露。"],
              ].map(([step, title, desc]) => (
                <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                    {step}
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-slate-950">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
              如果你的工具支持自定义 Skill，可以把 ZIP 里的 <span className="font-semibold">SKILL.md</span> 放进去；如果不支持，直接复制 prompts 文件夹里的提示词到 ChatGPT、DeepSeek、Kimi 或 Claude 也可以使用。
            </div>
          </article>

          <article id="included" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">这个 Skill 包包括什么？</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.includedItems.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">买回去可以怎样用？</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {product.useCases.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-violet-200 bg-violet-50/70 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">交付方式</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              客户付款后，你发下载码给他。他回到本页输入下载码，就可以下载 ZIP。不会使用的人，可以加价购买 Skill 代安装服务。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/examples"
                className="inline-flex h-11 items-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                先看输出示例
              </Link>
              <Link
                href="/products/ai-skill-install-service"
                className="inline-flex h-11 items-center rounded-full border border-violet-200 bg-white px-6 text-sm font-semibold text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-50"
              >
                查看代安装服务
              </Link>
            </div>
          </article>
        </div>

        <aside id="buy" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <ProductPurchaseBox product={product} unlocked={unlocked} unlockEnabled downloadHref={downloadHref} />
        </aside>
      </section>
    </main>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-semibold text-white">{value}</span>
    </div>
  );
}
