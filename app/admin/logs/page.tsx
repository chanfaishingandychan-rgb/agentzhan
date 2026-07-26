import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getMockGenerationLogs } from "@/lib/admin";

export const metadata: Metadata = {
  title: "自动任务日志",
  description: "查看 Agent站 AI 自动生成任务日志。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLogsPage() {
  const logs = getMockGenerationLogs();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/admin" className="text-sm font-semibold text-violet-600">
        返回后台
      </Link>
      <div className="mt-5">
        <Badge variant="blue">Cron Logs</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">自动任务日志</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          每晚 23:30 港台时间会触发 Vercel Cron。当前为预览日志，接入 Supabase 后会读取真实 ai_generation_logs 数据表。
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {logs.map((log) => (
          <article key={log.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-950">{new Date(log.run_time).toLocaleString("zh-HK")}</div>
                <p className="mt-1 text-sm text-slate-500">{log.summary}</p>
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
    </main>
  );
}
