import Link from "next/link";

import type { AiNewsItem } from "@/lib/news";

type HeroNewsPanelProps = {
  items: AiNewsItem[];
};

const categoryStyles: Record<AiNewsItem["category"], string> = {
  模型更新: "border-violet-300/20 bg-violet-400/10 text-violet-200",
  产品功能: "border-blue-300/20 bg-blue-400/10 text-blue-200",
  Agent趋势: "border-cyan-300/20 bg-cyan-400/10 text-cyan-200",
  行业应用: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
  安全与合规: "border-amber-300/20 bg-amber-400/10 text-amber-200",
};

const newsRowStyles = [
  {
    row: "border-violet-400/20 bg-violet-500/10 hover:border-violet-300/40 hover:bg-violet-500/15",
    number: "border-violet-300/20 bg-violet-400/10 text-violet-200",
    arrow: "group-hover:text-violet-300",
  },
  {
    row: "border-blue-400/20 bg-blue-500/10 hover:border-blue-300/40 hover:bg-blue-500/15",
    number: "border-blue-300/20 bg-blue-400/10 text-blue-200",
    arrow: "group-hover:text-blue-300",
  },
  {
    row: "border-cyan-400/20 bg-cyan-500/10 hover:border-cyan-300/40 hover:bg-cyan-500/15",
    number: "border-cyan-300/20 bg-cyan-400/10 text-cyan-200",
    arrow: "group-hover:text-cyan-300",
  },
];

function formatDate(value: string) {
  const [, month, day] = value.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

export function HeroNewsPanel({ items }: HeroNewsPanelProps) {
  return (
    <div className="relative lg:pt-6">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-violet-500/25 via-blue-500/10 to-cyan-400/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.065] p-3 shadow-2xl backdrop-blur-xl sm:p-4">
        <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/75">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-5">
            <div className="flex items-center gap-3">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-[0_8px_24px_rgba(99,102,241,0.35)]">
                <svg className="h-[18px] w-[18px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V9m5 10V5m5 14v-7m5 7V3" />
                </svg>
              </span>
              <div>
                <div className="text-sm font-bold text-white">每日 AI 快訊</div>
                <div className="mt-0.5 text-[11px] text-slate-400">大陆 / 国外动态，一起看懂</div>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              每日更新
            </div>
          </div>

          <div className="space-y-2 p-3 sm:p-4">
            {items.slice(0, 3).map((item, index) => (
              <Link
                key={item.slug}
                href={`/news/${item.slug}`}
                className={`group grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-2xl border px-3 py-3.5 transition-all duration-200 hover:-translate-y-0.5 sm:px-4 ${newsRowStyles[index].row}`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-bold transition group-hover:text-white ${newsRowStyles[index].number}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${categoryStyles[item.category]}`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.source}</span>
                  </span>
                  <span className="mt-1.5 block line-clamp-2 text-sm font-semibold leading-5 text-slate-100 transition group-hover:text-white">
                    {item.title}
                  </span>
                </span>
                <span className="flex flex-col items-end gap-2 pl-1">
                  <span className="whitespace-nowrap text-[10px] text-slate-500">{formatDate(item.publishedAt)}</span>
                  <svg className={`h-4 w-4 text-slate-500 transition group-hover:translate-x-0.5 ${newsRowStyles[index].arrow}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 bg-white/[0.025] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <div className="text-xs font-semibold text-slate-200">3 分钟掌握今天的 AI 变化</div>
              <div className="mt-1 text-[11px] text-slate-500">大陆 AI、海外模型、插件与行业应用</div>
            </div>
            <Link
              href="/news"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.07] px-4 text-xs font-semibold text-white transition hover:border-violet-300/30 hover:bg-violet-500/15"
            >
              查看全部資訊
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
