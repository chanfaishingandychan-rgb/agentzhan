import Link from "next/link";

import { PromptCard } from "@/components/prompt-card";
import { SearchBox } from "@/components/search-box";
import { SectionHeading } from "@/components/section-heading";
import { getAllCollections } from "@/lib/collections";
import { getHotTags, getLatestPrompts, getPopularPrompts } from "@/lib/prompts";
import { categories, siteConfig } from "@/lib/site";

const categoryIcons: Record<string, string> = {
  "ai-writing": "M16 4h4v4h-4zM8 4h4v4H8zM16 12h4v4h-4zM8 12h4v4H8zM4 4h2v12H4zM22 4h2v12h-2z",
  "ai-office": "M4 8h16M4 16h16M8 4v16M16 4v16",
  "ai-learning": "M12 4l8 8-8 8-8-8z",
  "ai-short-video": "M8 6l10 6-10 6z",
  "ai-ecommerce": "M3 10h18M7 15h1m4 0h1m4 0h1M5 10l1-6h12l1 6",
  "ai-marketing": "M12 2L2 22h20z",
  "ai-customer-service": "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0z",
  "ai-startup": "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  "ai-personal-assistant": "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  "ai-efficiency-tools": "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
};

export default function HomePage() {
  const latestPrompts = getLatestPrompts(8);
  const popularPrompts = getPopularPrompts(8);
  const hotTags = getHotTags(20);
  const collections = getAllCollections();

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />
        <div className="absolute inset-0 bg-mesh" />
        {/* Geometric illustration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg className="absolute right-[-10%] top-[-5%] h-[120%] w-[65%] opacity-30" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="hg2" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            {/* Large orb */}
            <circle cx="520" cy="350" r="180" fill="url(#hg1)" opacity="0.3" filter="blur(40px)" className="animate-pulse-glow" />
            {/* Medium orb */}
            <circle cx="300" cy="200" r="90" fill="url(#hg2)" opacity="0.25" filter="blur(30px)" className="animate-float" />
            {/* Small accent */}
            <circle cx="650" cy="550" r="50" fill="#818cf8" opacity="0.2" filter="blur(20px)" className="animate-float-slow" />
            {/* Connection lines */}
            <line x1="300" y1="200" x2="520" y2="350" stroke="#7c3aed" strokeWidth="0.5" opacity="0.15" />
            <line x1="520" y1="350" x2="650" y2="550" stroke="#3b82f6" strokeWidth="0.5" opacity="0.12" />
            <line x1="300" y1="200" x2="200" y2="500" stroke="#06b6d4" strokeWidth="0.5" opacity="0.1" />
            {/* Grid dots */}
            {Array.from({ length: 8 }).flatMap((_, row) =>
              Array.from({ length: 6 }).map((_, col) => (
                <circle key={`${row}-${col}`} cx={100 + col * 90} cy={80 + row * 90} r="1.5" fill="#94a3b8" opacity="0.15" />
              ))
            )}
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pb-32 lg:pt-36">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-slate-300">100+ Prompts · 10 Categories · Updated Weekly</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="text-gradient">Agent站</span>
              <br />
              <span className="text-white/90">中文最全 AI Prompt 工具站</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              {siteConfig.subtitle}
            </p>

            {/* Search */}
            <div className="mt-8 max-w-2xl">
              <SearchBox placeholder="搜尋 ChatGPT、Claude、DeepSeek 提示詞..." buttonLabel="搜尋提示詞" />
            </div>

            {/* Stats row */}
            <div className="mt-12 flex flex-wrap gap-x-12 gap-y-4">
              {[
                { value: "100+", label: "高質量提示詞" },
                { value: "10", label: "場景分類" },
                { value: "5+", label: "主流模型覆蓋" },
                { value: "SEO", label: "百度收錄友好" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="mt-1 text-sm text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="categories" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="場景分類"
          title="按場景快速找到可用的中文提示詞"
          description="10 大分類覆蓋寫作、辦公、學習、短視頻、電商等高頻場景，每個分類均有專屬提示詞庫。"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_16px_48px_rgba(124,58,237,0.10)]"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Card icon */}
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-blue-50 text-violet-600 transition-colors group-hover:from-violet-100 group-hover:to-blue-100">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcons[cat.slug] ?? "M12 4l8 8-8 8-8-8z"} />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">{cat.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{cat.description}</p>
              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Collections ── */}
      <section className="border-y border-slate-200 bg-slate-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="精品合集"
            title="不只是单条 Prompt，而是一套工作方案"
            description="按办公、小红书、短视频、电商和编程等真实场景整理，让新手也能快速找到可直接复制的 AI 工作方法。"
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {collections.map((collection) => (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_16px_50px_rgba(124,58,237,0.12)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-xs font-bold text-white shadow-[0_10px_26px_rgba(124,58,237,0.2)]">
                  AI
                </div>
                <h3 className="text-base font-bold leading-6 text-slate-950">{collection.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-500 line-clamp-4">{collection.description}</p>
                <span className="mt-5 text-sm font-semibold text-violet-600">查看合集 &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Prompts ── */}
      <section id="popular" className="scroll-mt-24 bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="熱門提示詞"
            title="高搜索意圖頁面"
            description="百度 SEO 優先的精選提示詞頁面，每個頁面獨立 title、description、FAQ Schema，適合搜索引擎收錄。"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularPrompts.map((prompt) => (
              <PromptCard key={prompt.slug} prompt={prompt} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Prompts ── */}
      <section id="latest" className="scroll-mt-24 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="最新收錄"
            title="最新提示詞內容"
            description="持續更新中文提示詞庫，每週新增高質量內容，緊跟 AI 工具生態發展。"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latestPrompts.map((prompt) => (
              <PromptCard key={prompt.slug} prompt={prompt} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform Vision ── */}
      <section className="border-y border-slate-200 bg-slate-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="平台能力"
            title="不只是提示詞庫"
            description="Agent站 正在從提示詞庫進化為完整的 AI Agent 生態平台，後續將陸續上線工作流、技能商店與協作空間。"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
                title: "AI 工作流庫",
                desc: "可複製的工作流模板，一鍵導入你的 AI 工具鏈。",
              },
              {
                icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
                title: "付費提示詞專區",
                desc: "會員權限、收藏夾、購買與授權分層，專業版內容。",
              },
              {
                icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
                title: "AI Agent Skills",
                desc: "Agent、MCP 資源庫和技能商店，形成長期增長結構。",
              },
              {
                icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197",
                title: "社群協作",
                desc: "提示詞評論、分享、協作編輯，建立 AI 創作者社群。",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tags ── */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="熱門標籤"
            title="高頻檢索關鍵詞"
            description="從熱門標籤快速定位感興趣的提示詞主題，每個標籤都有對應的搜索結果頁。"
          />
          <div className="flex flex-wrap gap-3">
            {hotTags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 hover:shadow-sm"
              >
                <span className="text-violet-400 transition-colors group-hover:text-violet-500">#</span>
                {tag}
                <span className="text-xs text-slate-400">({count})</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-slate-950 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            準備好用 AI 提升效率了嗎？
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-400">
            100+ 高質量中文提示詞，覆蓋 ChatGPT、Claude、DeepSeek，免費取用，直接複製。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/search"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-8 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(124,58,237,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(124,58,237,0.45)]"
            >
              開始搜尋提示詞
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href={`/category/${categories[0].slug}`}
              className="inline-flex h-12 items-center rounded-full border border-white/20 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:border-white/30 hover:bg-white/10"
            >
              瀏覽分類
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
