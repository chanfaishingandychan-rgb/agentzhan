import type { Metadata } from "next";

import { PromptCard } from "@/components/prompt-card";
import { SearchBox } from "@/components/search-box";
import { searchPrompts } from "@/lib/prompts";

export const metadata: Metadata = {
  title: "站內搜尋",
  description: "搜尋中文 AI 提示詞、工作流、標籤與應用場景。",
  alternates: {
    canonical: "/search",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const prompts = searchPrompts(q);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">站內搜尋</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">支援按標題、標籤、分類、場景進行搜尋，方便百度自然流量進入後的二次瀏覽。</p>
        <div className="mt-6">
          <SearchBox initialKeyword={q} />
        </div>
      </div>
      <div className="mt-10 text-sm text-slate-500">
        {q ? `關鍵詞“${q}”共找到 ${prompts.length} 條結果` : `當前共收錄 ${prompts.length} 條提示詞內容`}
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.slug} prompt={prompt} />
        ))}
      </div>
    </main>
  );
}
