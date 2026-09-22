import type { Metadata } from "next";
import Link from "next/link";

import { ProductPurchaseBox } from "@/components/product-purchase-box";
import {
  getOfficePromptPackCanonicalUrl,
  isOfficePromptPackUnlockCodeValid,
  officePromptPackProduct,
} from "@/lib/products";
import { siteConfig } from "@/lib/site";

const includedItems = [
  "会议纪要 Prompt",
  "周报 Prompt",
  "商务邮件回复 Prompt",
  "SOP 文档 Prompt",
  "资料总结 Prompt",
  "给老板的汇报 Prompt",
  "AI 内容发布前检查清单",
];

const useCases = [
  {
    title: "会议后 5 分钟出纪要",
    desc: "把录音转写或手动要点交给 AI，输出结论、待办、负责人和截止时间。",
  },
  {
    title: "周报不再从零开始",
    desc: "先列事实，再让 AI 整理成群内简版和正式汇报版，减少空话和套话。",
  },
  {
    title: "邮件回复更稳",
    desc: "按客户、老板、同事、供应商不同关系调整语气，避免过度承诺。",
  },
  {
    title: "经验变成 SOP",
    desc: "把口头流程整理成新人能照做的步骤、异常处理和检查清单。",
  },
];

const faqItems = [
  {
    question: "购买后怎样拿到文件？",
    answer: "扫码付款后通过微信联系，客服核对后发送下载码。回到本页输入下载码即可下载 ZIP。",
  },
  {
    question: "这些 Prompt 可以用在哪些 AI？",
    answer: "可以用于 ChatGPT、DeepSeek、Kimi、Claude 等常见对话模型。不同模型结果会有差异，建议保留人工检查。",
  },
  {
    question: "可以直接发给客户或老板吗？",
    answer: "不建议不检查就发送。包内附有发布前检查清单，尤其要核对姓名、日期、金额、承诺和内部资料。",
  },
];

export const metadata: Metadata = {
  title: officePromptPackProduct.title,
  description: officePromptPackProduct.description,
  alternates: {
    canonical: getOfficePromptPackCanonicalUrl(),
  },
  openGraph: {
    title: `${officePromptPackProduct.title} - Agent站`,
    description: officePromptPackProduct.description,
    url: getOfficePromptPackCanonicalUrl(),
    siteName: siteConfig.name,
    type: "website",
  },
};

type OfficePromptPackPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function OfficePromptPackPage({ searchParams }: OfficePromptPackPageProps) {
  const sp = await searchParams;
  const unlock = typeof sp.unlock === "string" ? sp.unlock.trim() : undefined;
  const unlocked = isOfficePromptPackUnlockCodeValid(unlock);
  const downloadHref = unlocked && unlock
    ? `${officePromptPackProduct.apiPath}?token=${encodeURIComponent(unlock)}`
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: officePromptPackProduct.title,
    description: officePromptPackProduct.description,
    brand: {
      "@type": "Brand",
      name: "Agent站",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: officePromptPackProduct.currency,
      price: String(officePromptPackProduct.priceAmount),
      availability: "https://schema.org/InStock",
      url: getOfficePromptPackCanonicalUrl(),
    },
  };

  return (
    <main className="bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8 lg:py-24">
          <div>
            <Link href="/free-ai-pack" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
              <span aria-hidden="true">&larr;</span>
              返回免费工作包
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-950">付费 Prompt 包</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-violet-100">办公提效</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-100">可下载 ZIP</span>
            </div>
            <h1 className="mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              {officePromptPackProduct.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              一套给上班族和小团队每天复用的中文 AI 办公模板。把会议纪要、周报、邮件、SOP、资料总结和老板汇报，从「不知道怎么问」变成「复制后填资料」。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#buy"
                className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                扫码购买 {officePromptPackProduct.priceLabel}
              </a>
              <a
                href="#included"
                className="inline-flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                查看包含内容
              </a>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
            <div className="text-sm text-slate-300">首批试用价</div>
            <div className="mt-2 text-5xl font-black tracking-tight">{officePromptPackProduct.priceLabel}</div>
            <div className="mt-2 text-sm text-slate-300">一次性下载，长期自用</div>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <SummaryLine label="格式" value="Markdown 模板" />
              <SummaryLine label="文件" value="8 个办公文件" />
              <SummaryLine label="适合" value="上班族 / 小团队" />
              <SummaryLine label="交付" value="下载码解锁" />
            </div>
            <a
              href="#buy"
              className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              购买并下载
            </a>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8 lg:py-20">
        <div className="space-y-8">
          <article id="included" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">这个包包括什么？</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {includedItems.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">最常用的 4 个场景</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {useCases.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-violet-200 bg-violet-50/70 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">适合谁买？</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-700">
              <li>• 每周都要写会议纪要、周报或汇报的人</li>
              <li>• 想让团队统一 AI 使用方法的小老板</li>
              <li>• 刚开始用 ChatGPT / DeepSeek，但不知道怎么提问的新手</li>
              <li>• 想先用低价模板测试 AI 办公价值的人</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">常见问题</h2>
            <div className="mt-5 space-y-4">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-bold text-slate-950">{item.question}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside id="buy" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <ProductPurchaseBox
            product={officePromptPackProduct}
            unlocked={unlocked}
            unlockEnabled
            downloadHref={downloadHref}
          />
          <p className="mt-3 text-xs leading-6 text-slate-500">
            付款前可以先领取免费工作包测试风格。付费包为可下载模板资料，不包含一对一代写服务。
          </p>
        </aside>
      </section>
    </main>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-semibold text-white">{value}</span>
    </div>
  );
}
