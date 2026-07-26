import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  getCronTaskStatuses,
  getMockGenerationLogs,
  getSupabaseLogs,
  inferCronTaskFromLog,
  isSupabaseConfigured,
} from "@/lib/admin";

export const metadata: Metadata = {
  title: "自动任务日志",
  description: "查看 Agent站 AI 自动生成任务日志。",
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

export default async function AdminLogsPage() {
  let logs = getMockGenerationLogs();
  let connected = false;

  if (isSupabaseConfigured()) {
    const realLogs = await getSupabaseLogs(20);
    if (realLogs && realLogs.length > 0) {
      logs = realLogs;
      connected = true;
    }
  }

  const taskStatuses = getCronTaskStatuses(logs);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/admin" className="text-sm font-semibold text-violet-600">
        返回后台
      </Link>
      <div className="mt-5">
        <Badge variant="blue">Cron Logs</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">自动任务日志</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Prompt 自动生成和 AI 资讯更新都会在每天 03:00 香港时间触发。
          {connected
            ? " 以下资料来自 Supabase ai_generation_logs 资料表。"
            : " 目前显示静态 fallback 资料，设置 Supabase 后会自动读取真实日志。"}
        </p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {taskStatuses.map((task) => (
          <article key={task.key} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-950">{task.title}</h2>
                <p className="mt-1 text-xs text-slate-400">{task.expectedTime}</p>
              </div>
              <Badge
                variant={
                  task.status === "ok" ? "success" : task.status === "error" ? "premium" : "muted"
                }
              >
                {task.status === "ok"
                  ? "今日已更新"
                  : task.status === "error"
                    ? "最近有错误"
                    : task.status === "waiting"
                      ? "今日未见更新"
                      : "暂无日志"}
              </Badge>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              上次执行：
              <span className="font-semibold text-slate-800">
                {task.latestLog ? formatHongKongTime(task.latestLog.run_time) : "暂无记录"}
              </span>
            </p>
          </article>
        ))}
      </section>

      {logs.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-sm text-slate-500">暂无任务日志</p>
          <p className="mt-1 text-xs text-slate-400">等待第一次 cron 触发或手动测试。</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {logs.map((log) => (
            <article key={log.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-950">
                      {formatHongKongTime(log.run_time)}
                    </span>
                    <Badge variant={inferCronTaskFromLog(log) === "news" ? "blue" : "violet"}>
                      {inferCronTaskFromLog(log) === "news"
                        ? "AI 资讯"
                        : inferCronTaskFromLog(log) === "prompts"
                          ? "Prompt"
                          : "自动任务"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{log.summary}</p>
                  {log.error_message && (
                    <p className="mt-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 font-mono">
                      {log.error_message}
                    </p>
                  )}
                </div>
                <Badge variant={log.failed_count > 0 ? "premium" : "success"}>
                  {log.failed_count > 0 ? "有错误" : "正常"}
                </Badge>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {[
                  ["生成", log.generated_count],
                  ["发布", log.published_count],
                  ["草稿", log.draft_count],
                  ["失败", log.failed_count],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-4">
                    <div className="text-xs text-slate-400">{label}</div>
                    <div className="mt-1 text-2xl font-bold text-slate-950">{value}</div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
