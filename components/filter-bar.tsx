"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

import { categories } from "@/lib/site";
import { getAvailableDifficulties, getAvailableModels } from "@/lib/prompts";

type FilterBarProps = {
  currentCategory?: string;
  currentModel?: string;
  currentDifficulty?: string;
  currentTier?: string;
  hideCategory?: boolean;
};

const tierOptions = [
  { value: "all", label: "全部" },
  { value: "free", label: "免費" },
  { value: "vip", label: "VIP" },
];

export function FilterBar({
  currentCategory = "all",
  currentModel = "all",
  currentDifficulty = "all",
  currentTier = "all",
  hideCategory = false,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const push = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams],
  );

  const models = getAvailableModels();
  const difficulties = getAvailableDifficulties();

  return (
    <div className="space-y-3">
      {!hideCategory && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400">分類</span>
          <FilterPill onClick={() => push("category", "all")} active={currentCategory === "all"}>
            全部
          </FilterPill>
          {categories.map((cat) => (
            <FilterPill key={cat.slug} onClick={() => push("category", cat.slug)} active={currentCategory === cat.slug}>
              {cat.name}
            </FilterPill>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400">模型</span>
          <FilterPill onClick={() => push("model", "all")} active={currentModel === "all"}>
            全部
          </FilterPill>
          {models.map((m) => (
            <FilterPill key={m} onClick={() => push("model", m)} active={currentModel === m}>
              {m}
            </FilterPill>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400">難度</span>
          <FilterPill onClick={() => push("difficulty", "all")} active={currentDifficulty === "all"}>
            全部
          </FilterPill>
          {difficulties.map((d) => (
            <FilterPill key={d} onClick={() => push("difficulty", d)} active={currentDifficulty === d}>
              {d}
            </FilterPill>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400">權限</span>
          {tierOptions.map((t) => (
            <FilterPill key={t.value} onClick={() => push("tier", t.value)} active={currentTier === t.value}>
              {t.label}
            </FilterPill>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterPill({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
        active
          ? "border-violet-300 bg-violet-50 text-violet-700 shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50/50 hover:text-violet-600"
      }`}
    >
      {children}
    </button>
  );
}
