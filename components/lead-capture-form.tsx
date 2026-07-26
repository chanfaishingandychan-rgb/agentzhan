"use client";

import { FormEvent, useState } from "react";

const packOptions = [
  { value: "free-prompt-pack", label: "100 个 AI 提效 Prompt 包" },
  { value: "xiaohongshu-content-pack", label: "小红书 30 天内容包" },
  { value: "ecommerce-sales-pack", label: "电商成交话术包" },
  { value: "office-productivity-pack", label: "AI 办公提效模板包" },
  { value: "enterprise-ai-workflow", label: "企业 AI 工作流方案" },
];

export function LeadCaptureForm() {
  const [email, setEmail] = useState("");
  const [interestedPack, setInterestedPack] = useState("free-prompt-pack");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          interestedPack,
          source: "homepage-free-pack",
        }),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "提交失败，请稍后再试。");
      }

      setSubmitted(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "提交失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
        领取成功。我们已记录你的邮箱，后续会优先发送对应工作包。
      </div>
    );
  }

  return (
    <form className="mx-auto mt-8 max-w-2xl rounded-3xl border border-slate-200 bg-white p-3 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-[1fr,1fr,auto]">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="输入邮箱，领取工作包"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
        />
        <select
          value={interestedPack}
          onChange={(event) => setInterestedPack(event.target.value)}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
        >
          {packOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(124,58,237,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(124,58,237,0.35)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? "提交中" : "免费领取"}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
      {errorMessage ? <p className="px-2 pt-3 text-left text-xs font-medium text-red-600">{errorMessage}</p> : null}
    </form>
  );
}
