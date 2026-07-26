import Link from "next/link";
import type { ReactNode } from "react";

import { buttonStyles } from "@/components/ui/button";
import { categories, siteConfig } from "@/lib/site";

const navItems = [
  { label: "搜索", href: "/search" },
  { label: "合集", href: "/collections" },
  { label: "分类", href: "/#categories" },
  { label: "最新", href: "/#latest" },
  { label: "热门", href: "/#popular" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-950">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-sm font-bold text-white shadow-[0_8px_24px_rgba(124,58,237,0.25)]">
              A
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-tight text-slate-950 sm:text-base">
                {siteConfig.name}
              </span>
              <span className="hidden text-xs text-slate-500 sm:block">中文 AI Agent & Prompt 工具站</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50/80 p-1 text-sm text-slate-600 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 transition hover:bg-white hover:text-slate-950 hover:shadow-sm"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`/category/${categories[0].slug}`}
              className="rounded-full px-3 py-2 transition hover:bg-white hover:text-slate-950 hover:shadow-sm"
            >
              {categories[0].name}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/search" className={buttonStyles({ variant: "outline", size: "sm" })}>
              找 Prompt
            </Link>
            <Link
              href="/admin"
              className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 sm:inline-flex"
            >
              后台入口
            </Link>
          </div>
        </div>
      </header>

      {children}

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[2fr,1fr,1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-sm font-bold text-white shadow-sm">
                A
              </span>
              <div className="text-base font-semibold text-slate-950">{siteConfig.name}</div>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
              中文 AI Agent & Prompt 工具站，面向写作、办公、营销、开发和内容创作场景持续扩展。
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-950">核心分类</div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-500">
              {categories.slice(0, 8).map((category) => (
                <Link key={category.slug} href={`/category/${category.slug}`} className="transition hover:text-violet-600">
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-950">平台能力</div>
            <div className="mt-3 space-y-2 text-sm text-slate-500">
              <div>Prompt 搜索</div>
              <div>分类导航</div>
              <div>Sitemap / Robots</div>
              <Link href="/admin" className="transition hover:text-violet-600">后台与自动化</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 px-4 py-6 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} {siteConfig.name} · {siteConfig.url}
        </div>
      </footer>
    </div>
  );
}
