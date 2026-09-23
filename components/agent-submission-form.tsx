"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { agentMessages, type AgentLocale } from "@/lib/agent-marketplace-i18n";
import type { AgentCategory } from "@/lib/agent-marketplace";

function categoryName(category: AgentCategory, locale: AgentLocale) {
  return locale === "zh-hk" ? category.nameZhHk : locale === "zh-cn" ? category.nameZhCn : category.nameEn;
}

type SubmissionStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string };

export function AgentSubmissionForm({ locale, categories }: { locale: AgentLocale; categories: AgentCategory[] }) {
  const messages = agentMessages[locale];
  const [status, setStatus] = useState<SubmissionStatus>({ state: "idle" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ state: "submitting" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error || messages.submitError);

      form.reset();
      setStatus({ state: "success" });
    } catch (error) {
      setStatus({ state: "error", message: error instanceof Error ? error.message : messages.submitError });
    }
  }

  const inputClass =
    "mt-2 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-600 focus:ring-2 focus:ring-neutral-200";
  const labelClass = "text-sm font-semibold text-neutral-900";

  if (status.state === "success") {
    return (
      <div role="status" className="border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
        <CheckCircle2 aria-hidden="true" className="h-7 w-7 text-emerald-700" />
        <h2 className="mt-5 text-xl font-semibold text-neutral-950">{messages.submitSuccess}</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">{messages.reviewNotice}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-8" noValidate={false}>
      <fieldset className="grid gap-5 border-0 p-0 sm:grid-cols-2">
        <legend className="mb-5 w-full border-b border-neutral-200 pb-3 text-sm font-semibold text-neutral-950 sm:col-span-2">
          {messages.productSection}
        </legend>

        <label className={labelClass}>
          {messages.productName} <span className="font-normal text-neutral-400">({messages.required})</span>
          <input className={inputClass} name="name" required minLength={2} maxLength={80} autoComplete="organization-title" />
        </label>
        <label className={labelClass}>
          {messages.websiteUrl} <span className="font-normal text-neutral-400">({messages.required})</span>
          <input className={inputClass} name="websiteUrl" type="url" inputMode="url" required maxLength={500} placeholder="https://" />
        </label>
        <label className={labelClass}>
          {messages.logoUrl}
          <input className={inputClass} name="logoUrl" type="url" inputMode="url" maxLength={500} placeholder="https://" />
        </label>
        <label className={labelClass}>
          {messages.category} <span className="font-normal text-neutral-400">({messages.required})</span>
          <select className={inputClass} name="category" required defaultValue="">
            <option value="" disabled>{messages.category}</option>
            {categories.map((category) => <option key={category.slug} value={category.slug}>{categoryName(category, locale)}</option>)}
          </select>
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          {messages.tagline} <span className="font-normal text-neutral-400">({messages.required})</span>
          <input className={inputClass} name="tagline" required minLength={10} maxLength={160} />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          {messages.description} <span className="font-normal text-neutral-400">({messages.required})</span>
          <textarea className="mt-2 min-h-36 w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-3 text-sm leading-6 text-neutral-950 outline-none transition focus:border-neutral-600 focus:ring-2 focus:ring-neutral-200" name="description" required minLength={40} maxLength={3000} />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          {messages.tags}
          <input className={inputClass} name="tags" maxLength={240} placeholder="Automation, Research, Teams" />
          <span className="mt-2 block text-xs font-normal text-neutral-500">{messages.tagsHint}</span>
        </label>
      </fieldset>

      <fieldset className="grid gap-5 border-0 p-0 sm:grid-cols-2">
        <legend className="mb-5 w-full border-b border-neutral-200 pb-3 text-sm font-semibold text-neutral-950 sm:col-span-2">
          {messages.developerSection}
        </legend>
        <label className={labelClass}>
          {messages.developerName} <span className="font-normal text-neutral-400">({messages.required})</span>
          <input className={inputClass} name="developerName" required minLength={2} maxLength={100} autoComplete="organization" />
        </label>
        <label className={labelClass}>
          {messages.developerEmail} <span className="font-normal text-neutral-400">({messages.required})</span>
          <input className={inputClass} name="developerEmail" type="email" required maxLength={254} autoComplete="email" />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          {messages.developerUrl}
          <input className={inputClass} name="developerUrl" type="url" inputMode="url" maxLength={500} placeholder="https://" />
        </label>
      </fieldset>

      <input type="hidden" name="locale" value={locale} />
      <label className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        Company fax
        <input name="companyFax" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="border-t border-neutral-200 pt-6">
        <p className="max-w-2xl text-xs leading-5 text-neutral-500">{messages.reviewNotice}</p>
        {status.state === "error" ? <p role="alert" className="mt-3 text-sm font-medium text-red-700">{status.message}</p> : null}
        <button
          type="submit"
          disabled={status.state === "submitting"}
          className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-60"
        >
          {status.state === "submitting" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <ArrowRight aria-hidden="true" className="h-4 w-4" />}
          {status.state === "submitting" ? messages.submitting : messages.submitProduct}
        </button>
      </div>
    </form>
  );
}
