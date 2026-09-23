import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink, MousePointerClick } from "lucide-react";
import { notFound } from "next/navigation";

import { AgentLogo } from "@/components/agent-logo";
import { agentLocalePaths, agentMessages, type AgentLocale } from "@/lib/agent-marketplace-i18n";
import { getAgentProductBySlug } from "@/lib/agent-marketplace";

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
}

export async function AgentProductPage({ slug, locale }: { slug: string; locale: AgentLocale }) {
  const { product, source } = await getAgentProductBySlug(slug);
  if (!product) notFound();

  const messages = agentMessages[locale];
  const category = locale === "zh-hk" ? product.category.nameZhHk : locale === "zh-cn" ? product.category.nameZhCn : product.category.nameEn;
  const labels = locale === "en"
    ? { about: "About this product", developer: "Developer", visit: "Visit official website", ranking: "Ranking details", reviewed: "Approved listing", back: "Back to leaderboard", demo: "This is a preview listing and its website link is disabled." }
    : locale === "zh-hk"
      ? { about: "產品介紹", developer: "開發者", visit: "前往官方網站", ranking: "排名資料", reviewed: "已審核上架", back: "返回排行榜", demo: "這是預覽產品，官方網站連結已停用。" }
      : { about: "产品介绍", developer: "开发者", visit: "前往官方网站", ranking: "排名资料", reviewed: "已审核上架", back: "返回排行榜", demo: "这是预览产品，官方网站链接已停用。" };
  const isDemo = source === "demo" || product.id.startsWith("demo-");

  return (
    <main className="min-h-screen bg-[#f6f6f3]">
      <section className="border-b border-neutral-300 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Link href={agentLocalePaths[locale]} className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-600 hover:text-neutral-950"><ArrowLeft className="h-4 w-4" />{labels.back}</Link>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-start">
            <div>
              <div className="flex items-start gap-5">
                <AgentLogo name={product.name} logoUrl={product.logoUrl} className="h-16 w-16 sm:h-20 sm:w-20" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded border border-neutral-300 px-2 py-1 font-medium text-neutral-600">{category}</span>
                    {product.bidCents > 0 ? <span className="rounded border border-amber-200 bg-amber-50 px-2 py-1 font-semibold uppercase text-amber-800">{messages.sponsored}</span> : <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 font-semibold text-emerald-800">{messages.organic}</span>}
                  </div>
                  <h1 className="mt-3 text-4xl font-semibold text-neutral-950 sm:text-5xl">{product.name}</h1>
                </div>
              </div>
              <p className="mt-7 max-w-3xl text-xl leading-8 text-neutral-700 sm:text-2xl">{product.tagline}</p>
              <div className="mt-6 flex flex-wrap gap-2">{product.tags.map((tag) => <span key={tag} className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">{tag}</span>)}</div>
            </div>

            <div className="rounded-lg border border-neutral-300 bg-[#f6f6f3] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" />{isDemo ? messages.previewListing : labels.reviewed}</div>
              <dl className="mt-5 divide-y divide-neutral-300 border-y border-neutral-300 text-sm">
                <div className="flex justify-between gap-4 py-3"><dt className="text-neutral-500">{messages.totalBid}</dt><dd className="font-semibold text-neutral-950">{money(product.bidCents)}</dd></div>
                <div className="flex justify-between gap-4 py-3"><dt className="text-neutral-500">{messages.clicks}</dt><dd className="font-semibold text-neutral-950">{product.clicks.toLocaleString()}</dd></div>
              </dl>
              {isDemo ? <p className="mt-4 text-xs leading-5 text-amber-800">{labels.demo}</p> : (
                <a href={`/go/${product.slug}?placement=product_page`} className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 text-sm font-semibold text-white hover:bg-neutral-800">
                  {labels.visit}<ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_18rem] lg:px-8 lg:py-16">
        <article>
          <h2 className="text-2xl font-semibold text-neutral-950">{labels.about}</h2>
          <p className="mt-5 whitespace-pre-line text-base leading-8 text-neutral-700">{product.description}</p>
          <div className="mt-10 border-t border-neutral-300 pt-6">
            <div className="text-xs font-semibold uppercase text-neutral-400">{labels.developer}</div>
            <div className="mt-2 text-lg font-semibold text-neutral-950">{product.developerName}</div>
          </div>
        </article>
        <aside>
          <h2 className="text-sm font-semibold text-neutral-950">{labels.ranking}</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-neutral-600">
            <p className="flex gap-2"><MousePointerClick className="mt-1 h-4 w-4 shrink-0 text-neutral-400" />{messages.disclosure}</p>
            <p className="flex gap-2"><ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-neutral-400" />{messages.externalVisit}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
