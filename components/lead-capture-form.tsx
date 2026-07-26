"use client";

import { FormEvent, useState } from "react";

export function LeadCaptureForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }

    const existing = JSON.parse(window.localStorage.getItem("agentzhan_leads") || "[]") as string[];
    const next = Array.from(new Set([...existing, email.trim()]));
    window.localStorage.setItem("agentzhan_leads", JSON.stringify(next));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
        已记录。下一步接入 Supabase 后，我们会把 Prompt 包发送到你的邮箱。
      </div>
    );
  }

  return (
    <form className="mt-8 flex flex-col justify-center gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="your@email.com"
        className="h-12 w-full max-w-sm rounded-full border border-slate-300 bg-white px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
      />
      <button
        type="submit"
        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-7 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(124,58,237,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(124,58,237,0.35)]"
      >
        免费领取
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </form>
  );
}
