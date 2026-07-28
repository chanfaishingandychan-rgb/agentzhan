import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getSupabaseTrafficStats } from "@/lib/admin";

export const metadata: Metadata = {
  title: "流量统计",
  description: "查看 Agent站页面浏览量、热门页面和最近访问。",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatHongKongTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(+date)) return "时间未知";

  return new Intl.DateTimeFormat("zh-HK", {
    timeZone: "Asia/Hong_Kong",
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-HK").format(value);
}

export default async function AdminTrafficPage() {
  const stats = await getSupabaseTrafficStats();
  const isReady = stats.status === "ready";

  const statusMessage =
    stats.status === "not_configured"
      ? "Supabase 尚未配置，暂时不能保存流量。请先补齐 Vercel 环境变量。"
      : stats.status === "table_missing"
        ? "流量资料表尚未建立。请在 Supabase SQL Editor 执行 supabase/schema.sql 中的 page_views 段落。"
        : stats.status === "error"
          ? "暂时无法读取流量资料，稍后再刷新查看。"
          : "";

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/admin" className="text-sm font-semibold text-violet-600">
        返回后台
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="blue">Traffic</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">流量统计</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            查看网站页面浏览量、7 日访客、热门页面、来源和最近访问。后台页不会计入这里。
          </p>
        </div>
      </div>

      {!isReady && (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-800">
          {statusMessage}
        </div>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["今日浏览", stats.todayViews],
          ["24 小时浏览", stats.last24hViews],
          ["7 日浏览", stats.last7dViews],
          ["7 日访客", stats.uniqueVisitors7d],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-2 text-3xl font-bold text-slate-950">{formatNumber(Number(value))}</div>
          </div>
        ))}
      </section>

      {stats.sampleLimited && (
        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
          7 日资料较多，热门页和来源以最近 5000 条记录计算；浏览总数仍使用数据库精确计数。
        </div>
      )}

      {isReady && stats.storageMode === "generation_logs" && (
        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
          当前使用兼容记录模式保存流量。之后建立 page_views 表后，会自动切换到专用流量表。
        </div>
      )}

      {isReady && stats.last7dViews === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-sm text-slate-500">暂无流量记录</p>
          <p className="mt-1 text-xs text-slate-400">部署后有新访客打开页面，这里会自动出现资料。</p>
        </div>
      ) : isReady ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr,1fr]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-5">
              <h2 className="text-lg font-semibold text-slate-950">热门页面</h2>
              <p className="mt-1 text-sm text-slate-500">按最近 7 日浏览量排序。</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-5 py-3">页面</th>
                    <th className="px-5 py-3">浏览</th>
                    <th className="px-5 py-3">访客</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.topPages.map((page) => (
                    <tr key={page.path} className="hover:bg-slate-50/70">
                      <td className="max-w-xl px-5 py-4">
                        <Link href={page.path} className="font-medium text-slate-950 hover:text-violet-600">
                          {page.title}
                        </Link>
                        <div className="mt-1 truncate text-xs text-slate-400">{page.path}</div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">{formatNumber(page.views)}</td>
                      <td className="px-5 py-4 text-slate-500">{formatNumber(page.visitors)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-slate-950">来源</h2>
              <div className="mt-4 space-y-3">
                {stats.referrers.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-950">{formatNumber(item.value)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-slate-950">设备</h2>
              <div className="mt-4 space-y-3">
                {stats.devices.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-950">{formatNumber(item.value)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-slate-950">地区</h2>
              <div className="mt-4 space-y-3">
                {stats.countries.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-950">{formatNumber(item.value)}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      ) : null}

      {isReady && stats.recentViews.length > 0 && (
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-lg font-semibold text-slate-950">最近访问</h2>
            <p className="mt-1 text-sm text-slate-500">最多显示最近 50 条，不记录原始 IP。</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-5 py-3">时间</th>
                  <th className="px-5 py-3">页面</th>
                  <th className="px-5 py-3">来源</th>
                  <th className="px-5 py-3">设备</th>
                  <th className="px-5 py-3">地区</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentViews.map((view) => (
                  <tr key={view.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4 text-slate-500">{formatHongKongTime(view.createdAt)}</td>
                    <td className="max-w-sm px-5 py-4">
                      <Link href={view.path} className="font-medium text-slate-950 hover:text-violet-600">
                        {view.title}
                      </Link>
                      <div className="mt-1 truncate text-xs text-slate-400">{view.path}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{view.referrer}</td>
                    <td className="px-5 py-4 text-slate-600">{view.deviceType}</td>
                    <td className="px-5 py-4 text-slate-600">{view.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
