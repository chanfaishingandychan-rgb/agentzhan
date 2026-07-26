import Link from "next/link";

import { LeadCaptureForm } from "@/components/lead-capture-form";
import { PromptCard } from "@/components/prompt-card";
import { SectionHeader } from "@/components/section-header";
import { getAllCollections } from "@/lib/collections";
import { getHotTags, getLatestPrompts, getPopularPrompts } from "@/lib/prompts";

const scenes = [
  {
    slug: "xiaohongshu",
    title: "小红书文案助手",
    desc: "种草笔记、产品测评、探店攻略，AI 帮你写出更容易被收藏和互动的小红书内容。",
    icon: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z",
    bgGradient: "from-rose-50 to-pink-50",
    link: "/search?q=小红书",
  },
  {
    slug: "douyin",
    title: "抖音脚本助手",
    desc: "3 秒钩子、分镜脚本、话题标签，快速产出更适合短视频发布的脚本。",
    icon: "M8 6l10 6-10 6z",
    bgGradient: "from-violet-50 to-purple-50",
    link: "/search?q=抖音",
  },
  {
    slug: "ecommerce",
    title: "电商卖货助手",
    desc: "商品标题、详情页卖点、客服话术和活动文案，帮卖家提升转化效率。",
    icon: "M3 10h18M7 15h1m4 0h1m4 0h1M5 10l1-6h12l1 6",
    bgGradient: "from-amber-50 to-orange-50",
    link: "/category/ai-ecommerce",
  },
  {
    slug: "office",
    title: "AI 办公助手",
    desc: "会议纪要、周报、邮件、PPT 大纲，上班族每天都能直接用的提效模板。",
    icon: "M4 8h16M4 16h16M8 4v16M16 4v16",
    bgGradient: "from-blue-50 to-cyan-50",
    link: "/category/ai-office",
  },
  {
    slug: "boss",
    title: "老板方案助手",
    desc: "商业计划书、融资路演、增长策略和管理制度，帮老板快速产出决策材料。",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    bgGradient: "from-emerald-50 to-teal-50",
    link: "/category/ai-startup",
  },
  {
    slug: "dev",
    title: "Cursor / Codex 开发助手",
    desc: "代码生成、Bug 排查、重构优化和测试补齐，让 AI 成为你的编程搭档。",
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
    bgGradient: "from-slate-50 to-slate-100",
    link: "/collections/cursor-codex-coding",
  },
];

const premiumPacks = [
  {
    title: "小红书爆款 Prompt 包",
    desc: "30 条高转化种草文案 Prompt，包含标题、开头、正文、标签和评论区互动模板。",
    price: "¥29.9",
    tag: "即将推出",
  },
  {
    title: "电商成交 Prompt 包",
    desc: "标题优化、详情页卖点、客服话术、促销活动，一套 Prompt 打通电商转化链路。",
    price: "¥39.9",
    tag: "即将推出",
  },
  {
    title: "AI 办公提效 Prompt 包",
    desc: "会议纪要、周报、邮件、数据分析、SOP 文档，职场人每天都能复用。",
    price: "¥29.9",
    tag: "即将推出",
  },
];

const tools = [
  { name: "ChatGPT", desc: "全能 AI 对话", url: "https://chat.openai.com", tag: "AI 写作" },
  { name: "Claude", desc: "长文和分析", url: "https://claude.ai", tag: "AI 写作" },
  { name: "DeepSeek", desc: "中文推理与编程", url: "https://deepseek.com", tag: "AI 编程" },
  { name: "Midjourney", desc: "AI 图片生成", url: "https://midjourney.com", tag: "AI 图片" },
  { name: "Canva AI", desc: "设计和修图", url: "https://canva.com", tag: "AI 图片" },
  { name: "Runway", desc: "AI 视频生成", url: "https://runwayml.com", tag: "AI 视频" },
  { name: "Cursor", desc: "AI 代码编辑器", url: "https://cursor.sh", tag: "AI 编程" },
  { name: "Codex", desc: "桌面 AI 代理", url: "https://openai.com/codex", tag: "AI 编程" },
  { name: "Notion AI", desc: "文档和知识库", url: "https://notion.so", tag: "AI 办公" },
  { name: "Gamma", desc: "AI PPT 生成", url: "https://gamma.app", tag: "AI 办公" },
];

export default function HomePage() {
  const popularPrompts = getPopularPrompts(8);
  const latestPrompts = getLatestPrompts(4);
  const hotTags = getHotTags(16);
  const topCollections = getAllCollections().slice(0, 5);

  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pb-28 lg:pt-32">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-slate-300">100+ Prompts · 6 大场景 · 每周更新</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              选一个工作场景，
              <br />
              <span className="text-gradient">直接复制能用的 AI Prompt</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Agent站整理小红书、抖音、电商、办公、编程和老板管理等高频场景 Prompt，帮你更快完成实际工作。
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#free-pack"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-7 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(124,58,237,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(124,58,237,0.45)]"
              >
                免费领取 Prompt 包
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </a>
              <Link
                href="#scenes"
                className="inline-flex h-12 items-center rounded-full border border-white/20 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:border-white/30 hover:bg-white/10"
              >
                开始探索场景
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3">
              {[
                { value: "100+", label: "精选 Prompt" },
                { value: "6", label: "工作场景" },
                { value: "10+", label: "AI 模型覆盖" },
                { value: "免费", label: "核心功能" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-xl font-bold text-white">{value}</div>
                  <div className="mt-1 text-xs text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="scenes" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeader
          eyebrow="工作场景"
          title="选一个场景，直接复制 AI Prompt"
          description="每个场景都整理了经过验证的高频 Prompt，拿来就能用，不用从零开始写提示词。"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scenes.map((scene) => (
            <Link
              key={scene.slug}
              href={scene.link}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_16px_48px_rgba(124,58,237,0.10)]"
            >
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${scene.bgGradient}`}>
                <svg className="h-5 w-5 text-slate-600 transition-colors group-hover:text-violet-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={scene.icon} />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-violet-700">{scene.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{scene.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-600 transition-all group-hover:gap-1.5">
                进入场景
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </section>

      <section id="free-pack" className="border-y border-slate-200 bg-slate-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              限时免费
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              免费领取《100 个 AI 提效 Prompt 包》
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              覆盖写作、办公、短视频、电商和编程场景，复制即用。输入邮箱，先锁定免费领取资格。
            </p>
            <LeadCaptureForm />
            <p className="mt-3 text-xs text-slate-400">当前为预登记版本，后续会接入邮件发送和下载链接。</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeader
          eyebrow="热门 Prompt"
          title="大家都在用的提示词"
          description="浏览最受欢迎的 Prompt，直接复制到 ChatGPT、Claude、DeepSeek 使用。"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popularPrompts.map((prompt) => (
            <PromptCard key={prompt.slug} prompt={prompt} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-violet-600 transition-all hover:border-violet-300 hover:bg-violet-50 hover:shadow-sm"
          >
            查看全部 Prompt
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="即将推出"
            title="专业 Prompt 包，深度解决工作难题"
            description="针对具体岗位和场景定制的 Prompt 合集，开箱即用，也为后续付费产品预热。"
            align="center"
          />
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {premiumPacks.map((pack) => (
              <div
                key={pack.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
              >
                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  {pack.tag}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{pack.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{pack.desc}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xl font-bold text-slate-900">{pack.price}</span>
                  <span className="text-xs text-slate-400">/ 一次性购买</span>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="精选合集"
            title="按场景整理的 Prompt 合集"
            description="五大工作场景精选合集，每个合集包含完整 Prompt、使用指南和常见问题。"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {topCollections.map((collection) => (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_16px_48px_rgba(124,58,237,0.10)]"
              >
                <h3 className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-violet-700">{collection.title}</h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{collection.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {collection.relatedModels.slice(0, 3).map((model) => (
                    <span key={model} className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500">
                      {model}
                    </span>
                  ))}
                </div>
                <span className="mt-3 inline-block text-xs font-semibold text-violet-600 transition-transform group-hover:translate-x-0.5">
                  查看合集 &rarr;
                </span>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="工具推荐"
            title="搭配这些 AI 工具，效率翻倍"
            description="先把推荐位搭起来，未来可以接广告、联盟分成或工具合作。"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {tools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-md"
              >
                <span className="inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                  {tool.tag}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{tool.name}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{tool.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-600 transition-all group-hover:gap-1.5">
                  访问工具
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">需要帮公司建立 AI 工作流？</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
            我们为企业团队提供定制 Prompt 库、AI 工作流搭建和内部培训服务。
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:hello@agentzhan.com"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-8 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(124,58,237,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(124,58,237,0.45)]"
            >
              联系我们
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </a>
            <Link
              href="/search"
              className="inline-flex h-12 items-center rounded-full border border-white/20 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:border-white/30 hover:bg-white/10"
            >
              浏览全部 Prompt
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="热门标签" title="快速定位你需要的 Prompt" description="从标签出发，更快找到对应场景的提示词。" />
          <div className="flex flex-wrap gap-2.5">
            {hotTags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 hover:shadow-sm"
              >
                <span className="text-violet-400 transition-colors group-hover:text-violet-500">#</span>
                {tag}
                <span className="text-xs text-slate-400">({count})</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="最新收录" title="最近更新的 Prompt" description="持续新增高质量中文提示词，紧跟 AI 工具发展。" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latestPrompts.map((prompt) => (
              <PromptCard key={prompt.slug} prompt={prompt} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
