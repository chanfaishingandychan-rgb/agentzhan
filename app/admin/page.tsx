import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  getAdminPromptRows,
  getAdminStats,
  getSupabasePrompts,
  getSupabaseStats,
  getSystemReadiness,
  isSupabaseConfigured,
} from "@/lib/admin";

export const metadata: Metadata = {
  title: "後台管理",
  description: "Agent站內容管理後台。",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const readiness = getSystemReadiness();
  const connected = isSupabaseConfigured();

  // Try Supabase first, fallback to static JSON
  let stats = getAdminStats();
  let prompts = getAdminPromptRows(12);

  if (connected) {
    const [sbStats, sbPrompts] = await Promise.all([getSupabaseStats(), getSupabasePrompts(12)]);
    if (sbStats) {
      stats = {
        ...stats,
        totalPrompts: sbStats.totalPrompts,
        publishedCount: sbStats.publishedCount,
        draftCount: sbStats.draftCount,
        vipCount: sbStats.vipCount,
        freeCount: sbStats.freeCount,
      };
    }
    if (sbPrompts && sbPrompts.length > 0) {
      prompts = sbPrompts;
    }
  }

  const readinessItems: Array<[string, boolean]> = [
    ["Supabase URL", readiness.supabaseUrl],
    ["Service Role", readiness.supabaseServiceRole],
    [`AI Key${readiness.aiProvider ? ` (${readiness.aiProvider})` : ""}`, readiness.deepseekApiKey || readiness.openaiApiKey],
    ["Cron Secret", readiness.cronSecret],
    ["Admin Password", readiness.adminPassword],
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="violet">Admin</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Agent站後台</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            {connected
              ? "已連接 Supabase，顯示即時資料庫內容。"
              : "使用靜態 JSON fallback。設定 Supabase 環境變數後會自動切換至即時資料。"}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/logs"
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
          >
            查看任務日誌
          </Link>
          <Link
            href="/api/cron/test-generate-prompts"
            className="inline-flex h-10 items-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            測試生成接口
          </Link>
        </div>
      </div>

      {/* Stats */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Prompt 總數", stats.totalPrompts],
          ["已發布", stats.publishedCount],
          ["草稿", stats.draftCount],
          ["VIP 內容", stats.vipCount],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-2 text-3xl font-bold text-slate-950">{value}</div>
          </div>
        ))}
      </section>

      {/* Readiness */}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">系統準備狀態</h2>
            <p className="mt-1 text-sm text-slate-500">
              綠色 = 已配置，灰色 = 需在 Vercel 環境變數中補齊。
              {connected && " Supabase 已連接。"}
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {readinessItems.map(([label, ready]) => (
            <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-700">{label}</div>
              <div className={`mt-2 text-sm font-semibold ${ready ? "text-emerald-600" : "text-slate-400"}`}>
                {ready ? "已配置" : "未配置"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prompts table */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-semibold text-slate-950">內容管理</h2>
          <p className="mt-1 text-sm text-slate-500">
            {connected
              ? "資料來自 Supabase。後續可在此進行審核、編輯、刪除。"
              : "目前使用靜態 JSON。接入 Supabase 後將開放新增、修改、刪除。"}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">標題</th>
                <th className="px-5 py-3">分類</th>
                <th className="px-5 py-3">模型</th>
                <th className="px-5 py-3">難度</th>
                <th className="px-5 py-3">狀態</th>
                <th className="px-5 py-3">權限</th>
                <th className="px-5 py-3">品質</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prompts.map((prompt) => (
                <tr key={prompt.slug} className="hover:bg-slate-50/70">
                  <td className="max-w-sm px-5 py-4">
                    <Link
                      href={`/prompt/${prompt.slug}`}
                      className="font-medium text-slate-950 hover:text-violet-600"
                    >
                      {prompt.title}
                    </Link>
                    <div className="mt-1 truncate text-xs text-slate-400">{prompt.slug}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{prompt.category}</td>
                  <td className="px-5 py-4 text-slate-600">{prompt.model}</td>
                  <td className="px-5 py-4 text-slate-600">{prompt.difficulty}</td>
                  <td className="px-5 py-4">
                    <Badge variant={prompt.status === "published" ? "success" : "muted"}>
                      {prompt.status === "published" ? "已發布" : "草稿"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={prompt.tier === "vip" ? "premium" : "success"}>
                      {prompt.tier === "vip" ? "VIP" : "免費"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{prompt.qualityScore}/10</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
