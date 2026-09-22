import type { Novel } from "@/lib/novels";

export function NovelCover({ novel, compact = false }: { novel: Novel; compact?: boolean }) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-3xl border-2 border-slate-950 bg-white shadow-[8px_8px_0_rgba(15,23,42,0.12)]",
        compact ? "h-40" : "min-h-80",
      ].join(" ")}
      aria-label={`${novel.title} 漫画风封面`}
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle, #0f172a 1px, transparent 1px)",
          backgroundSize: "10px 10px",
        }}
        aria-hidden="true"
      />

      <div className="absolute left-4 right-4 top-4 z-10 rounded-[1.6rem] border-2 border-slate-950 bg-white px-4 py-3 shadow-[5px_5px_0_rgba(15,23,42,0.14)]">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">AI NOVEL</div>
        <div className={compact ? "mt-1 text-2xl font-black text-slate-950" : "mt-1 text-3xl font-black text-slate-950"}>
          {novel.title}
        </div>
      </div>

      <div className={compact ? "absolute bottom-4 left-5 h-20 w-16" : "absolute bottom-7 left-8 h-32 w-24"} aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-9 w-9 -translate-x-1/2 rounded-full border-2 border-slate-950 bg-white" />
        <div className="absolute left-1/2 top-8 h-12 w-12 -translate-x-1/2 rounded-t-[1.5rem] border-2 border-slate-950 bg-white shadow-[4px_4px_0_rgba(15,23,42,0.12)]" />
        <div className="absolute left-3 top-12 h-10 w-2 -rotate-12 rounded-full bg-slate-950" />
        <div className="absolute right-3 top-12 h-10 w-2 rotate-12 rounded-full bg-slate-950" />
        <div className="absolute left-7 bottom-0 h-10 w-2 rounded-full bg-slate-950" />
        <div className="absolute right-7 bottom-0 h-10 w-2 rounded-full bg-slate-950" />
        <div className="absolute left-7 top-3 h-1 w-2 rounded-full bg-slate-950" />
        <div className="absolute right-7 top-3 h-1 w-2 rounded-full bg-slate-950" />
      </div>

      <div className={compact ? "absolute bottom-4 right-5 h-24 w-20" : "absolute bottom-7 right-8 h-36 w-28"} aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-10 w-14 -translate-x-1/2 rounded-xl border-2 border-slate-950 bg-white shadow-[4px_4px_0_rgba(15,23,42,0.14)]">
          <div className="absolute left-3 top-4 h-2 w-2 rounded-full bg-slate-950" />
          <div className="absolute right-3 top-4 h-2 w-2 rounded-full bg-slate-950" />
          <div className="absolute left-5 top-7 h-0.5 w-4 bg-slate-950" />
        </div>
        <div className="absolute left-1/2 top-11 h-14 w-16 -translate-x-1/2 rounded-2xl border-2 border-slate-950 bg-white">
          <div className="mx-auto mt-4 h-3 w-8 rounded-full border-2 border-slate-950" />
        </div>
        <div className="absolute left-2 top-14 h-9 w-2 rotate-12 rounded-full bg-slate-950" />
        <div className="absolute right-2 top-14 h-9 w-2 -rotate-12 rounded-full bg-slate-950" />
        <div className="absolute left-8 bottom-0 h-12 w-2 rounded-full bg-slate-950" />
        <div className="absolute right-8 bottom-0 h-12 w-2 rounded-full bg-slate-950" />
        <div className="absolute left-1/2 -top-4 h-4 w-0.5 -translate-x-1/2 bg-slate-950" />
        <div className="absolute left-1/2 -top-6 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-950" />
      </div>

      <div className={compact ? "absolute bottom-24 left-[45%] z-20" : "absolute bottom-36 left-[42%] z-20"}>
        <div className="relative rounded-[1.4rem] border-2 border-slate-950 bg-white px-4 py-2 text-sm font-black text-slate-950 shadow-[4px_4px_0_rgba(15,23,42,0.14)]">
          我在
          <div className="absolute -bottom-2 left-6 h-4 w-4 rotate-45 border-b-2 border-r-2 border-slate-950 bg-white" aria-hidden="true" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-12 border-t-2 border-slate-950 bg-white" aria-hidden="true">
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-950/30" />
      </div>
    </div>
  );
}
