import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, ExternalLink, ShieldAlert, X } from "lucide-react";

import { createServiceClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "AI 产品审核",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type AdminProduct = Record<string, unknown> & {
  agent_categories?: Record<string, unknown> | Array<Record<string, unknown>> | null;
};

function dateTime(value: unknown) {
  if (typeof value !== "string") return "时间未知";
  return new Intl.DateTimeFormat("zh-HK", {
    timeZone: "Asia/Hong_Kong",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminAgentsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const requestedStatus = typeof params.status === "string" ? params.status : "pending";
  const status = new Set(["pending", "approved", "rejected", "suspended", "all"]).has(requestedStatus) ? requestedStatus : "pending";
  const client = createServiceClient();
  let products: AdminProduct[] = [];
  let databaseReady = Boolean(client);

  if (client) {
    let query = client
      .from("agent_products")
      .select("id,slug,name,website_url,logo_url,tagline,developer_name,developer_email,status,ownership_status,review_notes,created_at,published_at,agent_categories(name_en)")
      .order("created_at", { ascending: false })
      .limit(100);
    if (status !== "all") query = query.eq("status", status);
    const result = await query;
    databaseReady = !result.error;
    products = (result.data ?? []) as AdminProduct[];
  }

  const filters = [
    ["pending", "待审核"],
    ["approved", "已公开"],
    ["rejected", "已拒绝"],
    ["suspended", "已暂停"],
    ["all", "全部"],
  ];

  return (
    <main className="min-h-screen bg-[#f6f7f9]">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <header className="border-b border-slate-200 pb-7">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />返回 Dashboard
          </Link>
          <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-semibold uppercase text-emerald-700">Agent Marketplace</div>
              <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">AI 产品审核</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">提交内容必须经批准后才会出现在公开目录及排行榜。</p>
            </div>
            <Link href="/agents" className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50">
              查看公开目录<ExternalLink aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {typeof params.updated === "string" ? (
          <div role="status" className="mt-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            已更新 {params.updated}。
          </div>
        ) : null}

        {!databaseReady ? (
          <section className="mt-7 border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            <div className="flex items-center gap-2 font-semibold"><ShieldAlert aria-hidden="true" className="h-5 w-5" />市场数据库尚未就绪</div>
            <p className="mt-2">先执行 <code className="rounded bg-amber-100 px-1 py-0.5">20260923_agent_marketplace_mvp.sql</code> migration，提交与审核才会正式启用。</p>
          </section>
        ) : (
          <>
            <nav aria-label="产品状态" className="mt-6 flex gap-1 overflow-x-auto border-b border-slate-300">
              {filters.map(([value, label]) => (
                <Link key={value} href={`/admin/agents?status=${value}`} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold ${status === value ? "border-slate-950 text-slate-950" : "border-transparent text-slate-500 hover:text-slate-950"}`}>
                  {label}
                </Link>
              ))}
            </nav>

            <section className="mt-6 space-y-4">
              {products.length ? products.map((product) => {
                const relation = Array.isArray(product.agent_categories) ? product.agent_categories[0] : product.agent_categories;
                const productStatus = String(product.status);
                return (
                  <article key={String(product.id)} className="border border-slate-200 bg-white p-4 sm:p-5">
                    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem]">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-semibold text-slate-950">{String(product.name)}</h2>
                          <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">{productStatus}</span>
                          <span className="text-xs text-slate-400">{String(relation?.name_en ?? "Uncategorised")}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{String(product.tagline)}</p>
                        <a href={String(product.website_url)} target="_blank" rel="noreferrer" className="mt-3 inline-flex max-w-full items-center gap-1 truncate text-sm font-medium text-emerald-700 hover:underline">
                          {String(product.website_url)}<ExternalLink aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                        </a>
                        <dl className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
                          <div><dt>开发者</dt><dd className="mt-1 font-medium text-slate-800">{String(product.developer_name)}</dd></div>
                          <div><dt>联络</dt><dd className="mt-1 truncate font-medium text-slate-800">{String(product.developer_email)}</dd></div>
                          <div><dt>提交时间</dt><dd className="mt-1 font-medium text-slate-800">{dateTime(product.created_at)}</dd></div>
                        </dl>
                      </div>

                      <form action="/api/admin/agents" method="post" className="border-t border-slate-200 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                        <input type="hidden" name="productId" value={String(product.id)} />
                        <label className="text-xs font-semibold text-slate-700">
                          审核备注
                          <textarea name="reviewNotes" defaultValue={typeof product.review_notes === "string" ? product.review_notes : ""} maxLength={500} className="mt-2 min-h-20 w-full resize-y rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />
                        </label>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {productStatus !== "approved" ? <button name="action" value="approve" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-700 px-3 text-xs font-semibold text-white hover:bg-emerald-800"><Check className="h-3.5 w-3.5" />批准</button> : null}
                          {productStatus !== "rejected" ? <button name="action" value="reject" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 hover:bg-red-100"><X className="h-3.5 w-3.5" />拒绝</button> : null}
                          {productStatus === "approved" ? <button name="action" value="suspend" className="inline-flex h-9 items-center rounded-lg border border-amber-200 bg-amber-50 px-3 text-xs font-semibold text-amber-800 hover:bg-amber-100">暂停</button> : null}
                        </div>
                      </form>
                    </div>
                  </article>
                );
              }) : <div className="border border-dashed border-slate-300 bg-white px-5 py-16 text-center text-sm text-slate-500">这个状态暂时没有产品。</div>}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
