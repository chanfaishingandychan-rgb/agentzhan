import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getSupabaseLeads, getSupabaseLeadStats, isSupabaseConfigured } from "@/lib/admin";

export const metadata: Metadata = {
  title: "潜在客户",
  description: "查看 Agent站免费工作包领取记录。",
  robots: { index: false, follow: false },
};

const packLabels: Record<string, string> = {
  "free-prompt-pack": "100 个 AI 提效 Prompt 包",
  "xiaohongshu-content-pack": "小红书 30 天内容包",
  "ecommerce-sales-pack": "电商成交话术包",
  "office-productivity-pack": "AI 办公提效模板包",
  "enterprise-ai-workflow": "企业 AI 工作流方案",
};

export default async function AdminLeadsPage() {
  const configured = isSupabaseConfigured();
  const [leads, stats] = configured
    ? await Promise.all([getSupabaseLeads(100), getSupabaseLeadStats()])
    : [null, null];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/admin" className="text-sm font-semibold text-violet-600">
        返回后台
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="violet">Leads</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">潜在客户</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            查看首页免费领取表单提交记录，用来判断哪个工作包最有变现机会。
          </p>
        </div>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["总线索", stats?.totalLeads ?? 0],
          ["小红书", stats?.xiaohongshuCount ?? 0],
          ["电商", stats?.ecommerceCount ?? 0],
          ["办公", stats?.officeCount ?? 0],
          ["企业", stats?.enterpriseCount ?? 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-2 text-3xl font-bold text-slate-950">{value}</div>
          </div>
        ))}
      </section>

      {!configured ? (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-800">
          Supabase 尚未配置。请先在 Supabase SQL Editor 执行 `supabase/schema.sql`，并在 Vercel 配置 Supabase 环境变量。
        </div>
      ) : !leads || leads.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-sm text-slate-500">暂无领取记录</p>
          <p className="mt-1 text-xs text-slate-400">等用户提交首页表单后会显示在这里。</p>
        </div>
      ) : (
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-5 py-3">邮箱</th>
                  <th className="px-5 py-3">想要的工作包</th>
                  <th className="px-5 py-3">来源</th>
                  <th className="px-5 py-3">状态</th>
                  <th className="px-5 py-3">提交时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4 font-medium text-slate-950">{lead.email}</td>
                    <td className="px-5 py-4 text-slate-600">{packLabels[lead.interestedPack] ?? lead.interestedPack}</td>
                    <td className="px-5 py-4 text-slate-500">{lead.source}</td>
                    <td className="px-5 py-4">
                      <Badge variant={lead.status === "converted" ? "success" : "muted"}>{lead.status}</Badge>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleString("zh-HK") : "-"}
                    </td>
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
