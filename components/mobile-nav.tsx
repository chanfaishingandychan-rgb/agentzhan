"use client";

import Link from "next/link";
import { useState } from "react";

import { primaryNavItems } from "@/lib/navigation";

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
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-2xl leading-none text-slate-800 shadow-sm transition hover:border-violet-200 hover:text-violet-700"
      >
        <span aria-hidden="true" className={open ? "text-2xl" : "-mt-0.5 text-2xl"}>
          {open ? "×" : "≡"}
        </span>
      </button>

      {open ? (
        <div
          id="mobile-site-menu"
          className="absolute inset-x-0 top-16 border-b border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
        >
          <nav className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 py-4 sm:px-6" aria-label="手机网站菜单">
            {primaryNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/products/agentzhan-original-skills"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
            >
              付费 Skill
            </Link>
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
            >
              搜索内容
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
