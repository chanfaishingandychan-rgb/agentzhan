import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock3, Search, ShieldCheck } from "lucide-react";

import { AgentLeaderboardRefresh } from "@/components/agent-leaderboard-refresh";
import { AgentLogo } from "@/components/agent-logo";
import { agentLocalePaths, agentMessages, type AgentLocale } from "@/lib/agent-marketplace-i18n";
import { getAgentMarketplaceSnapshot, type AgentCategory, type AgentPeriod, type AgentProduct } from "@/lib/agent-marketplace";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
}

function number(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function categoryName(category: AgentCategory, locale: AgentLocale) {
  return locale === "zh-hk" ? category.nameZhHk : locale === "zh-cn" ? category.nameZhCn : category.nameEn;
}

function productHref(product: AgentProduct, locale: AgentLocale) {
  return `${agentLocalePaths[locale]}/${product.slug}`;
}

function withFilters(basePath: string, values: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function relativeTime(value: string, locale: AgentLocale) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60_000));
  if (locale === "en") return minutes < 60 ? `${minutes}m ago` : `${Math.round(minutes / 60)}h ago`;
  return minutes < 60 ? `${minutes} 分鐘前` : `${Math.round(minutes / 60)} 小時前`;
}

export async function AgentMarketplacePage({ locale, searchParams }: { locale: AgentLocale; searchParams: SearchParams }) {
  const query = await searchParams;
  const periodValue = typeof query.period === "string" ? query.period : "all";
  const period: AgentPeriod = periodValue === "today" || periodValue === "week" ? periodValue : "all";
  const category = typeof query.category === "string" ? query.category : "";
  const search = typeof query.q === "string" ? query.q.trim().slice(0, 80) : "";
  const snapshot = await getAgentMarketplaceSnapshot(period);
  const messages = agentMessages[locale];
  const basePath = agentLocalePaths[locale];
  const submitPath = `${basePath}/submit`;
  const normalizedSearch = search.toLowerCase();
  const matches = (product: AgentProduct) =>
    (!category || product.category.slug === category) &&
    (!normalizedSearch || [product.name, product.tagline, product.description, ...product.tags].join(" ").toLowerCase().includes(normalizedSearch));
  const sponsored = snapshot.sponsored.filter(matches);
  const latest = snapshot.latest.filter(matches).slice(0, 6);
  const periods: Array<[AgentPeriod, string]> = [["today", messages.today], ["week", messages.week], ["all", messages.allTime]];

  return (
    <main className="min-h-screen bg-[#f6f6f3]">
      <AgentLeaderboardRefresh />

      <section className="border-b border-neutral-300 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-sm bg-emerald-500" />
              {messages.eyebrow}
            </div>
            <nav aria-label="Language" className="flex items-center gap-4 text-xs font-medium text-neutral-500">
              {(Object.keys(agentLocalePaths) as AgentLocale[]).map((item) => (
                <Link key={item} href={agentLocalePaths[item]} className={item === locale ? "text-neutral-950" : "hover:text-neutral-950"}>
                  {agentMessages[item].localeName}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] text-neutral-950 sm:text-6xl lg:text-7xl">{messages.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">{messages.intro}</p>
            </div>
            <Link href={submitPath} className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-lg bg-neutral-950 px-5 text-sm font-semibold text-white hover:bg-neutral-800">
              {messages.submit}<ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-2 border-y border-neutral-300 sm:grid-cols-4">
            {[
              [number(snapshot.stats.products), messages.products],
              [number(snapshot.stats.developers), messages.developers],
              [money(snapshot.stats.volumeCents), messages.volume],
              [number(snapshot.stats.clicks), messages.outboundClicks],
            ].map(([value, label], index) => (
              <div key={label} className={`py-5 ${index % 2 ? "border-l border-neutral-300 pl-5" : "pr-5"} sm:border-l sm:px-5 sm:first:border-l-0 sm:first:pl-0`}>
                <dt className="text-xs text-neutral-500">{label}</dt>
                <dd className="mt-1 text-xl font-semibold text-neutral-950 sm:text-2xl">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {snapshot.source === "demo" ? (
        <div className="border-b border-amber-200 bg-amber-50">
          <p className="mx-auto max-w-7xl px-4 py-3 text-xs leading-5 text-amber-900 sm:px-6 lg:px-8">{messages.demo}</p>
        </div>
      ) : null}

      <section className="border-b border-neutral-300 bg-[#f6f6f3]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <form className="grid gap-3 sm:grid-cols-[1fr_14rem_auto]" action={basePath}>
            <label className="relative">
              <span className="sr-only">{messages.searchPlaceholder}</span>
              <Search aria-hidden="true" className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
              <input name="q" defaultValue={search} placeholder={messages.searchPlaceholder} className="h-11 w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200" />
            </label>
            <label>
              <span className="sr-only">{messages.category}</span>
              <select name="category" defaultValue={category} className="h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200">
                <option value="">{messages.allCategories}</option>
                {snapshot.categories.map((item) => <option key={item.slug} value={item.slug}>{categoryName(item, locale)}</option>)}
              </select>
            </label>
            <input type="hidden" name="period" value={period} />
            <button className="h-11 rounded-lg border border-neutral-950 bg-neutral-950 px-5 text-sm font-semibold text-white hover:bg-neutral-800">{messages.search}</button>
          </form>

          <div className="mt-5 flex gap-1 overflow-x-auto border-b border-neutral-300" aria-label="Leaderboard period">
            {periods.map(([value, label]) => (
              <Link key={value} href={withFilters(basePath, { period: value, category, q: search })} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold ${period === value ? "border-neutral-950 text-neutral-950" : "border-transparent text-neutral-500 hover:text-neutral-950"}`}>
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            <Link href={withFilters(basePath, { period, q: search })} className={`shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium ${!category ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-300 bg-white text-neutral-600"}`}>{messages.global}</Link>
            {snapshot.categories.map((item) => (
              <Link key={item.slug} href={withFilters(basePath, { period, category: item.slug, q: search })} className={`shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium ${category === item.slug ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-500"}`}>
                {categoryName(item, locale)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-300 bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-700"><span className="h-px w-5 bg-amber-500" />{messages.sponsored}</div>
              <h2 className="mt-2 text-2xl font-semibold text-neutral-950 sm:text-3xl">{messages.sponsoredBoard}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{messages.sponsoredDescription}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500"><ShieldCheck aria-hidden="true" className="h-4 w-4" />20s auto-refresh</div>
          </div>

          <div className="mt-7 overflow-hidden rounded-lg border border-neutral-300">
            {sponsored.length ? sponsored.map((product, index) => (
              <article key={product.id} className="grid grid-cols-[2.5rem_3rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-neutral-200 bg-white p-4 last:border-b-0 sm:grid-cols-[3.5rem_3rem_minmax(0,1fr)_9rem_8rem] sm:gap-4 sm:px-5">
                <div className="font-mono text-lg font-semibold text-neutral-400">#{index + 1}</div>
                <AgentLogo name={product.name} logoUrl={product.logoUrl} className="h-12 w-12" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={productHref(product, locale)} className="truncate text-base font-semibold text-neutral-950 hover:text-emerald-700">{product.name}</Link>
                    <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-800">{messages.sponsored}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-neutral-600">{product.tagline}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400 sm:hidden">
                    <span>{money(product.bidCents)}</span><span>{number(product.clicks)} {messages.clicks}</span>
                  </div>
                </div>
                <div className="hidden text-right sm:block">
                  <div className="text-base font-semibold text-neutral-950">{money(product.bidCents)}</div>
                  <div className="mt-1 text-xs text-neutral-500">{messages.totalBid}</div>
                </div>
                <div className="hidden text-right text-xs text-neutral-500 sm:block">{number(product.clicks)}<br />{messages.clicks}</div>
                <Link href={productHref(product, locale)} aria-label={`${messages.viewProduct}: ${product.name}`} className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 sm:hidden"><ArrowRight className="h-4 w-4" /></Link>
              </article>
            )) : <p className="bg-white px-5 py-14 text-center text-sm text-neutral-500">{messages.noResults}</p>}
          </div>
          <p className="mt-4 text-xs leading-5 text-neutral-500">{messages.disclosure}</p>
        </div>
      </section>

      <section className="border-b border-neutral-300 bg-[#f6f6f3] py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.5fr_0.75fr] lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700"><span className="h-px w-5 bg-emerald-600" />{messages.organic}</div>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-950">{messages.latest}</h2>
            <p className="mt-2 text-sm text-neutral-600">{messages.latestDescription}</p>
            <div className="mt-6 grid gap-px overflow-hidden rounded-lg border border-neutral-300 bg-neutral-300 sm:grid-cols-2">
              {latest.map((product) => (
                <Link key={product.id} href={productHref(product, locale)} className="group min-h-52 bg-white p-5 hover:bg-neutral-50">
                  <div className="flex items-start justify-between gap-4">
                    <AgentLogo name={product.name} logoUrl={product.logoUrl} className="h-11 w-11" />
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-neutral-400 group-hover:text-neutral-950" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-neutral-950">{product.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">{product.tagline}</p>
                  <div className="mt-4 text-xs text-neutral-400">{categoryName(product.category, locale)}</div>
                </Link>
              ))}
            </div>
          </div>

          <aside>
            <h2 className="border-b border-neutral-950 pb-3 text-sm font-semibold text-neutral-950">{messages.activity}</h2>
            <div className="divide-y divide-neutral-300">
              {snapshot.activities.map((activity) => (
                <div key={activity.id} className="py-4">
                  <div className="flex items-center justify-between gap-3 text-sm"><span className="font-semibold text-neutral-950">{activity.productName}</span><span className="font-mono text-emerald-700">+{money(activity.amountCents)}</span></div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-neutral-400"><Clock3 aria-hidden="true" className="h-3 w-3" />{relativeTime(activity.createdAt, locale)}</div>
                </div>
              ))}
            </div>
            <Link href={submitPath} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-neutral-950 underline decoration-neutral-400 underline-offset-4 hover:text-emerald-700">{messages.submit}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
