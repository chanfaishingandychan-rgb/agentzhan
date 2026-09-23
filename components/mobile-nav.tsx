"use client";

import Link from "next/link";
import { ChevronRight, Menu, Search, X } from "lucide-react";
import { useState } from "react";

import { primaryNavItems, secondaryNavItems } from "@/lib/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "关闭网站菜单" : "打开网站菜单"}
        aria-expanded={open}
        aria-controls="mobile-site-menu"
        title={open ? "关闭菜单" : "网站菜单"}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      >
        {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
      </button>

      {open ? (
        <div
          id="mobile-site-menu"
          className="absolute inset-x-0 top-16 border-b border-neutral-200 bg-white shadow-[0_12px_28px_rgba(18,18,18,0.08)]"
        >
          <nav className="mx-auto max-w-7xl px-4 py-5 sm:px-6" aria-label="手机网站菜单">
            <div className="text-xs font-semibold uppercase text-neutral-500">主要入口</div>
            <div className="mt-2 divide-y divide-neutral-100 border-y border-neutral-200">
              {primaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center justify-between py-3 text-sm font-medium text-neutral-900 transition-colors hover:text-emerald-700"
                >
                  {item.label}
                  <ChevronRight aria-hidden="true" className="h-4 w-4 text-neutral-400" />
                </Link>
              ))}
            </div>

            <div className="mt-5 text-xs font-semibold uppercase text-neutral-500">更多内容</div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-neutral-600 transition-colors hover:text-neutral-950"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Link
                href="/search"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white text-sm font-semibold text-neutral-800"
              >
                <Search aria-hidden="true" className="h-4 w-4" />
                搜索
              </Link>
              <Link
                href="/consulting"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-neutral-950 text-sm font-semibold text-white"
              >
                咨询服务
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
