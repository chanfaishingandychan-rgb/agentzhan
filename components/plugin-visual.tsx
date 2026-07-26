import { cn } from "@/lib/utils";

export function PluginVisual({
  title,
  accent = "from-violet-600 to-blue-600",
  compact = false,
}: {
  title: string;
  accent?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/20 bg-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.22)]",
        compact ? "h-44" : "h-72",
      )}
    >
      <div className="absolute inset-0 bg-grid opacity-[0.08]" />
      <div className={cn("absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br blur-3xl", accent, "opacity-55")} />
      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="absolute left-5 top-5 rounded-2xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
        Agent 插件
      </div>

      <div className="absolute inset-x-5 bottom-5">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-bold text-white", accent)}>
              插
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{title}</div>
              <div className="mt-1 text-xs text-slate-300">连接工具 · 执行任务 · 记录结果</div>
            </div>
          </div>
        </div>
      </div>

      <svg className="absolute left-1/2 top-1/2 h-40 w-72 -translate-x-1/2 -translate-y-[58%]" viewBox="0 0 288 160" fill="none" aria-hidden="true">
        <path d="M64 80H144M144 80H224M144 80V34M144 80V126" stroke="url(#line)" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 8" />
        <rect x="104" y="48" width="80" height="64" rx="20" fill="white" fillOpacity=".12" stroke="white" strokeOpacity=".22" />
        <rect x="44" y="60" width="40" height="40" rx="14" fill="white" fillOpacity=".10" stroke="white" strokeOpacity=".18" />
        <rect x="204" y="60" width="40" height="40" rx="14" fill="white" fillOpacity=".10" stroke="white" strokeOpacity=".18" />
        <rect x="124" y="14" width="40" height="40" rx="14" fill="white" fillOpacity=".10" stroke="white" strokeOpacity=".18" />
        <rect x="124" y="106" width="40" height="40" rx="14" fill="white" fillOpacity=".10" stroke="white" strokeOpacity=".18" />
        <path d="M134 79.5l7 7 15-17" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="64" cy="80" r="5" fill="white" fillOpacity=".82" />
        <circle cx="224" cy="80" r="5" fill="white" fillOpacity=".82" />
        <circle cx="144" cy="34" r="5" fill="white" fillOpacity=".82" />
        <circle cx="144" cy="126" r="5" fill="white" fillOpacity=".82" />
        <defs>
          <linearGradient id="line" x1="64" y1="34" x2="224" y2="126" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A78BFA" />
            <stop offset="1" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
