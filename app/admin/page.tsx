import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  getAdminPromptRows,
  getAdminStats,
  getCronTaskStatuses,
  getSupabasePrompts,
  getSupabaseLogs,
  getSupabaseStats,
  getSystemReadiness,
  isSupabaseConfigured,
} from "@/lib/admin";

export const metadata: Metadata = {
  title: "后台管理",
  description: "Agent站内容管理后台。",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatHongKongTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(+date)) return "时间未知";

  return new Intl.DateTimeFormat("zh-HK", {
    timeZone: "Asia/Hong_Kong",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminPage() {
  const readiness = getSystemReadiness();
  const connected = isSupabaseConfigured();

  // Try Supabase first, fallback to static JSON
  let stats = getAdminStats();
  let prompts = getAdminPromptRows(12);
  let taskStatuses = getCronTaskStatuses([]);

  if (connected) {
    const [sbStats, sbPrompts, sbLogs] = await Promise.all([
      getSupabaseStats(),
      getSupabasePrompts(12),
      getSupabaseLogs(50),
    ]);
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
    if (sbLogs) {
      taskStatuses = getCronTaskStatuses(sbLogs);
    }
  }

  const readinessItems: Array<[string, boolean]> = [
    ["Supabase URL", readiness.supabaseUrl],
    ["Service Role", readiness.supabaseServiceRole],
    [`AI Key${readiness.aiProvider ? ` (${readiness.aiProvider})` : ""}`, readiness.deepseekApiKey || readiness.openaiApiKey],
    ["Cron Secret", readiness.cronSecret],
    ["Admin Password", readiness.adminPassword],
  ];

  const overviewStats = [
    {
      label: "Prompt 总数",
      value: stats.totalPrompts,
      detail: `${stats.freeCount} 条免费内容`,
    },
    {
      label: "已发布",
      value: stats.publishedCount,
      detail: stats.totalPrompts > 0 ? `${Math.round((stats.publishedCount / stats.totalPrompts) * 100)}% 发布率` : "暂无内容",
    },
    {
      label: "待处理草稿",
      value: stats.draftCount,
      detail: stats.draftCount > 0 ? "需要审核" : "目前没有积压",
    },
    {
      label: "VIP 内容",
      value: stats.vipCount,
      detail: stats.totalPrompts > 0 ? `${Math.round((stats.vipCount / stats.totalPrompts) * 100)}% 内容占比` : "暂无内容",
    },
  ];

  const adminNavigation = [
    { href: "/admin/traffic", label: "流量分析", description: "浏览与转化" },
    { href: "/admin/leads", label: "潜在客户", description: "表单线索" },
    { href: "/admin/logs", label: "任务日志", description: "执行记录" },
  ];

  return (
    <main className="min-h-screen border-b border-slate-200 bg-[#f6f7f9]">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase text-slate-500">运营中心 / 概览</div>
            <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">Agent站 Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              集中查看内容、自动任务和系统配置，优先处理需要关注的项目。
            </p>
          </div>
          <div
            className={`inline-flex h-9 w-fit items-center gap-2 rounded-lg border px-3 text-sm font-medium ${
              connected
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-900"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-amber-500"}`} aria-hidden="true" />
            {connected ? "Supabase 实时连接" : "静态资料模式"}
          </div>
        </header>

        <nav aria-label="后台分区" className="mt-5 grid grid-cols-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
          {adminNavigation.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-col justify-center px-3 py-2 transition hover:bg-slate-50 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:px-5 ${
                index > 0 ? "border-l border-slate-200" : ""
              }`}
            >
              <span className="text-sm font-semibold text-slate-900">{item.label}</span>
              <span className="mt-0.5 hidden text-xs text-slate-500 sm:block">{item.description}</span>
            </Link>
          ))}
        </nav>

        <section aria-labelledby="overview-heading" className="mt-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="overview-heading" className="text-lg font-semibold text-slate-950">内容概览</h2>
              <p className="mt-1 text-sm text-slate-500">当前 Prompt 库的发布和权限分布。</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {overviewStats.map((item) => (
              <article key={item.label} className="min-h-32 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
                <div className="text-sm font-medium text-slate-600">{item.label}</div>
                <div className="mt-3 text-3xl font-bold text-slate-950">{item.value}</div>
                <div className="mt-2 text-xs text-slate-500">{item.detail}</div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="automation-heading" className="mt-7 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 id="automation-heading" className="text-lg font-semibold text-slate-950">自动任务</h2>
              <p className="mt-1 text-sm text-slate-500">每天香港时间 03:00 执行，状态以最近一次日志为准。</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/logs"
                className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                查看日志
              </Link>
              <Link
                href="/api/cron/test-generate-prompts"
                className="inline-flex h-10 items-center rounded-lg border border-amber-300 bg-amber-50 px-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                title="会立即调用测试生成接口"
              >
                运行测试生成
              </Link>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {taskStatuses.map((task) => {
              const latestLog = task.latestLog;
              const statusLabel =
                task.status === "ok"
                  ? "今日已更新"
                  : task.status === "error"
                    ? "最近有错误"
                    : task.status === "waiting"
                      ? "今日未见更新"
                      : "暂无日志";
              const statusClasses =
                task.status === "ok"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : task.status === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-slate-200 bg-slate-100 text-slate-700";

              return (
                <article key={task.key} className="grid gap-5 px-4 py-5 sm:px-5 lg:grid-cols-[minmax(220px,1.2fr)_minmax(420px,1fr)] lg:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-950">{task.title}</h3>
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses}`}>
                        {statusLabel}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{task.schedule} · {task.expectedTime}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                      {latestLog
                        ? latestLog.summary
                        : "暂时未读取到日志；下一次自动任务执行后会在这里显示结果。"}
                    </p>
                  </div>

                  <dl className="grid grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="min-w-0 p-3 sm:p-4">
                      <dt className="text-xs text-slate-500">上次执行</dt>
                      <dd className="mt-1 truncate text-sm font-semibold text-slate-800" title={latestLog ? formatHongKongTime(latestLog.run_time) : "暂无记录"}>
                        {latestLog ? formatHongKongTime(latestLog.run_time) : "暂无记录"}
                      </dd>
                    </div>
                    <div className="p-3 sm:p-4">
                      <dt className="text-xs text-slate-500">发布</dt>
                      <dd className="mt-1 text-xl font-bold text-slate-950">{latestLog ? latestLog.published_count : 0}</dd>
                    </div>
                    <div className="p-3 sm:p-4">
                      <dt className="text-xs text-slate-500">失败</dt>
                      <dd className={`mt-1 text-xl font-bold ${latestLog?.failed_count ? "text-red-700" : "text-slate-950"}`}>
                        {latestLog ? latestLog.failed_count : 0}
                      </dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="readiness-heading" className="mt-7 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
            <h2 id="readiness-heading" className="text-lg font-semibold text-slate-950">系统准备状态</h2>
            <p className="mt-1 text-sm text-slate-500">检查生产环境所需配置，不显示任何敏感值。</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5">
            {readinessItems.map(([label, ready], index) => (
              <div
                key={label}
                className={`min-h-24 p-4 sm:p-5 ${index % 2 ? "border-l border-slate-200" : ""} ${index >= 2 ? "border-t border-slate-200 lg:border-t-0" : ""} ${index > 0 ? "lg:border-l" : "lg:border-l-0"}`}
              >
                <div className="text-sm font-medium text-slate-700">{label}</div>
                <div className={`mt-3 flex items-center gap-2 text-sm font-semibold ${ready ? "text-emerald-700" : "text-amber-800"}`}>
                  <span className={`h-2 w-2 rounded-full ${ready ? "bg-emerald-500" : "bg-amber-500"}`} aria-hidden="true" />
                  {ready ? "已配置" : "需要配置"}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="content-heading" className="mt-7 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="content-heading" className="text-lg font-semibold text-slate-950">最近内容</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {connected ? "资料来自 Supabase。" : "目前显示静态 JSON 内容。"}
                </p>
              </div>
              <div className="text-xs text-slate-500">显示最近 {prompts.length} 条</div>
            </div>
            <p className="mt-3 text-xs text-slate-500 sm:hidden">可左右滑动查看更多栏位。</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[760px] divide-y divide-slate-200 text-sm">
              <caption className="sr-only">最近 Prompt 内容、发布状态、权限和质量评分</caption>
              <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-600">
                <tr>
                  <th scope="col" className="px-5 py-3">标题</th>
                  <th scope="col" className="px-5 py-3">分类</th>
                  <th scope="col" className="px-5 py-3">模型</th>
                  <th scope="col" className="px-5 py-3">难度</th>
                  <th scope="col" className="px-5 py-3">状态</th>
                  <th scope="col" className="px-5 py-3">权限</th>
                  <th scope="col" className="px-5 py-3 text-right">质量</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prompts.length > 0 ? prompts.map((prompt) => (
                  <tr key={prompt.slug} className="transition hover:bg-slate-50">
                    <td className="max-w-sm px-5 py-4">
                      <Link
                        href={`/prompt/${prompt.slug}`}
                        className="font-medium text-slate-950 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                      >
                        {prompt.title}
                      </Link>
                      <div className="mt-1 truncate text-xs text-slate-500">{prompt.slug}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{prompt.category}</td>
                    <td className="px-5 py-4 text-slate-600">{prompt.model}</td>
                    <td className="px-5 py-4 text-slate-600">{prompt.difficulty}</td>
                    <td className="px-5 py-4">
                      <Badge variant={prompt.status === "published" ? "success" : "muted"}>
                        {prompt.status === "published" ? "已发布" : "草稿"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={prompt.tier === "vip" ? "premium" : "success"}>
                        {prompt.tier === "vip" ? "VIP" : "免费"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-800">{prompt.qualityScore}/10</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <div className="font-medium text-slate-700">暂时没有内容</div>
                      <div className="mt-1 text-sm text-slate-500">完成首次内容生成后，记录会显示在这里。</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
