import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import type { ReactNode } from "react";

import { MobileNav } from "@/components/mobile-nav";
import { buttonStyles } from "@/components/ui/button";
import { primaryNavItems, secondaryNavItems } from "@/lib/navigation";
import { categories, siteConfig } from "@/lib/site";

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`${compact ? "h-8 w-8" : "h-9 w-9"} relative flex shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-sm font-semibold text-white`}
      aria-hidden="true"
    >
      A
      <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-sm bg-emerald-400" />
    </span>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f6f3] text-neutral-950">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Agent站首页">
            <BrandMark compact />
            <span>
              <span className="block text-sm font-semibold text-neutral-950 sm:text-base">{siteConfig.name}</span>
              <span className="hidden text-xs text-neutral-500 sm:block">中文 AI 工作指南</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-neutral-600 lg:flex" aria-label="主要导航">
            {primaryNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 font-medium transition-colors hover:text-neutral-950 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              aria-label="搜索网站内容"
              title="搜索"
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:inline-flex"
            >
              <Search aria-hidden="true" className="h-[18px] w-[18px]" />
            </Link>
            <Link href="/consulting" className={buttonStyles({ variant: "outline", size: "sm", className: "hidden sm:inline-flex" })}>
              咨询
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
            <MobileNav />
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-neutral-300 bg-[#ecece7]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1.5fr]">
            <div>
              <div className="flex items-center gap-3">
                <BrandMark />
                <div className="text-base font-semibold text-neutral-950">{siteConfig.name}</div>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-7 text-neutral-600">
                把 AI 模型、插件和工作流整理成可直接使用的中文指南，帮助个人和小团队更快完成工作。
              </p>
              <Link
                href="/start-here"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-950 underline decoration-neutral-400 underline-offset-4 transition-colors hover:text-emerald-700"
              >
                从这里开始
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-8 lg:contents">
              <div>
                <div className="text-xs font-semibold uppercase text-neutral-500">主要入口</div>
                <div className="mt-4 space-y-3 text-sm text-neutral-700">
                  {primaryNavItems.map((item) => (
                    <Link key={item.href} href={item.href} className="block transition-colors hover:text-emerald-700">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase text-neutral-500">探索内容</div>
                <div className="mt-4 space-y-3 text-sm text-neutral-700">
                  {secondaryNavItems.map((item) => (
                    <Link key={item.href} href={item.href} className="block transition-colors hover:text-emerald-700">
                      {item.label}
                    </Link>
                  ))}
                  <Link href="/search" className="block transition-colors hover:text-emerald-700">搜索 Prompt</Link>
                </div>
              </div>
            </div>

            <div id="wechat" className="scroll-mt-24">
              <div className="text-xs font-semibold uppercase text-neutral-500">微信联系</div>
              <p className="mt-4 text-sm leading-6 text-neutral-600">交流群和一对一咨询分开使用，请按需要扫码。</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-neutral-300 bg-[#f6f6f3] p-3">
                  <Image src="/wechat-group-qr.jpg" alt="AI小白微信交流群二维码" width={80} height={80} className="h-20 w-20 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-neutral-950">AI小白交流群</div>
                    <p className="mt-1 text-xs leading-5 text-neutral-600">模型、Prompt 与工具交流</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-neutral-300 bg-[#f6f6f3] p-3">
                  <Image src="/wechat-qr.jpg" alt="微信咨询二维码" width={80} height={80} className="h-20 w-20 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-neutral-950">一对一咨询</div>
                    <p className="mt-1 text-xs leading-5 text-neutral-600">安装、网站与工作流</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-neutral-300 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
            <div>&copy; {new Date().getFullYear()} {siteConfig.name}</div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {categories.slice(0, 4).map((category) => (
                <Link key={category.slug} href={`/category/${category.slug}`} className="transition-colors hover:text-neutral-950">
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
