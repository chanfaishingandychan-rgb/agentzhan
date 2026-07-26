import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getAdminPromptRows, getAdminStats, getSystemReadiness } from "@/lib/admin";

export const metadata: Metadata = {
  title: "后台管理",
  description: "Agent站内容管理后台。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  const stats = getAdminStats();
  const prompts = getAdminPromptRows(12);
  const readiness = getSystemReadiness();
  const readinessItems: Array<[string, boolean]> = [
    ["Supabase URL", readiness.supabaseUrl],
    ["Service Role", readiness.supabaseServiceRole],
    ["OpenAI Key", readiness.openaiApiKey],
    ["Cron Secret", readiness.cronSecret],
    ["Admin Password", readiness.adminPassword],
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="violet">Admin</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Agent站后台</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            这里用于查看 Prompt 内容、分类状态、VIP 标记和自动生成系统准备情况。线上后台已用 Basic Auth 保护。
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/logs"
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
          >
            查看任务日志
          </Link>
          <Link
            href="/api/cron/test-generate-prompts"
            className="inline-flex h-10 items-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            测试生成接口
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Prompt 总数", stats.totalPrompts],
          ["已发布", stats.publishedCount],
          ["分类数量", stats.categoryCount],
          ["VIP 内容", stats.vipCount],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-2 text-3xl font-bold text-slate-950">{value}</div>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">自动化系统准备状态</h2>
            <p className="mt-1 text-sm text-slate-500">绿色表示已配置，灰色表示下一步需要在 Vercel 环境变量中补齐。</p>
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

      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-semibold text-slate-950">内容管理预览</h2>
          <p className="mt-1 text-sm text-slate-500">
            当前数据来自静态 JSON。接入 Supabase 后，这里会开放新增、修改、删除和审核操作。
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">标题</th>
                <th className="px-5 py-3">分类</th>
                <th className="px-5 py-3">模型</th>
                <th className="px-5 py-3">难度</th>
                <th className="px-5 py-3">权限</th>
                <th className="px-5 py-3">质量</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prompts.map((prompt) => (
                <tr key={prompt.slug} className="hover:bg-slate-50/70">
                  <td className="max-w-sm px-5 py-4">
                    <Link href={`/prompt/${prompt.slug}`} className="font-medium text-slate-950 hover:text-violet-600">
                      {prompt.title}
                    </Link>
                    <div className="mt-1 truncate text-xs text-slate-400">{prompt.slug}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{prompt.category}</td>
                  <td className="px-5 py-4 text-slate-600">{prompt.model}</td>
                  <td className="px-5 py-4 text-slate-600">{prompt.difficulty}</td>
                  <td className="px-5 py-4">
                    <Badge variant={prompt.tier === "vip" ? "premium" : "success"}>
                      {prompt.tier === "vip" ? "VIP" : "免费"}
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
