import type { Metadata } from "next";

import { PromptCard } from "@/components/prompt-card";
import { SearchBox } from "@/components/search-box";
import { searchPrompts } from "@/lib/prompts";

export const metadata: Metadata = {
  title: "站内搜索",
  description: "搜索中文 AI 提示词、工作流、标签与应用场景。",
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">站内搜索</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">支持按标题、标签、分类、场景进行搜索，方便百度自然流量进入后的二次浏览。</p>
        <div className="mt-6">
          <SearchBox initialKeyword={q} />
        </div>
      </div>
      <div className="mt-10 text-sm text-slate-500">
        {q ? `关键词“${q}”共找到 ${prompts.length} 条结果` : `当前共收录 ${prompts.length} 条提示词内容`}
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.slug} prompt={prompt} />
        ))}
      </div>
    </main>
  );
}
