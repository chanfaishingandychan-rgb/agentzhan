import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mac Codex 接入 DeepSeek 自助安装包 - Agent站",
  description:
    "Mac Codex 接入 DeepSeek 自助安装包，首批试用价 ¥98，支持 DeepSeek Flash / Pro 独立入口，保留原本 GPT 设置。",
  alternates: {
    canonical: `${siteConfig.url}/products/codex-deepseek-mac-installer`,
  },
  openGraph: {
    title: "Mac Codex 接入 DeepSeek 自助安装包 - Agent站",
    description: "适合 Mac Codex 用户接入 DeepSeek Flash / Pro。需要自备 DeepSeek API Key，不包含 API 用量费用。",
    url: `${siteConfig.url}/products/codex-deepseek-mac-installer`,
    siteName: siteConfig.name,
    type: "website",
  },
};

const includedItems = [
  "Mac Codex × DeepSeek 自助安装 ZIP",
  "DeepSeek Flash / Pro 两个独立入口",
  "健康检查和最短真实 API 测试工具",
  "回复及移除工具",
  "图文安装说明",
  "微信安装问题咨询",
];

const fitItems = [
  "已经在 Mac 上使用 Codex",
  "想保留 GPT，同时多一个 DeepSeek 选择",
  "不想自己研究 provider、bridge 和配置文件",
  "愿意使用自己的 DeepSeek API Key 和 API 额度",
];

const noticeItems = [
  "只支持 macOS，不支持 Windows、Linux 或 iPhone 直接安装",
  "需要客户自己准备 DeepSeek API Key",
  "DeepSeek API 用量费另计，由客户自己的 DeepSeek 帐户支付",
  "这不是 OpenAI 或 DeepSeek 官方产品",
  "不要把 API Key、密码或验证码发给我们",
];

export default function CodexDeepSeekProductPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Mac Codex 接入 DeepSeek 自助安装包",
    description:
      "为 Mac Codex 增加 DeepSeek Flash / Pro 两个独立入口，保留原本 GPT 设置。首批试用价 ¥98。",
    brand: {
      "@type": "Brand",
      name: "Agent站",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "CNY",
      price: "98",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/products/codex-deepseek-mac-installer`,
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
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8 lg:py-24">
          <div>
            <Link href="/skills" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
              <span aria-hidden="true">&larr;</span>
              返回 AI 插件库
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-950">付费工具包</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-violet-100">Mac 专用</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-blue-100">Codex × DeepSeek</span>
            </div>
            <h1 className="mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Mac Codex 接入 DeepSeek 自助安装包
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              为 Mac 上的 Codex 增加 DeepSeek Flash / Pro 两个独立入口，保留原本 GPT 设置。适合想降低模型使用成本，又不想自己研究 provider、bridge 和配置文件的用户。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#buy"
                className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                查看购买方式
              </a>
              <a
                href="#other-models"
                className="inline-flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                其他模型接入
              </a>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
            <div className="text-sm text-slate-300">首批试用价</div>
            <div className="mt-2 text-5xl font-black tracking-tight">¥98</div>
            <div className="mt-2 text-sm text-slate-300">一次性自助安装包</div>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <SummaryLine label="交付" value="ZIP 安装包" />
              <SummaryLine label="系统" value="macOS" />
              <SummaryLine label="模型" value="DeepSeek Flash / Pro" />
              <SummaryLine label="购买" value="微信咨询后发送" />
            </div>
            <a
              href="#buy"
              className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              微信咨询购买
            </a>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8 lg:py-20">
        <div className="space-y-8">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">这个工具包包括什么？</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {includedItems.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">适合谁购买？</h2>
            <div className="mt-5 grid gap-3">
              {fitItems.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="text-sm font-semibold leading-7 text-slate-700">{item}</div>
                </div>
              ))}
            </div>
          </article>

          <article id="other-models" className="scroll-mt-24 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-violet-50 p-6 sm:p-8">
            <div className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
              客制接入
            </div>
            <h2 className="text-2xl font-bold text-slate-950">想接入其他模型？可以联系我们评估</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              除了 DeepSeek，如果你想把 Codex 接入 Kimi、GLM、Claude、Gemini 或其他 API 相容模型，也可以微信联系。不同模型的 API、稳定性、成本和工具调用能力不同，我们会先了解你的 Mac、Codex 版本和使用场景，再确认可行性与报价。
            </p>
            <a
              href="#buy"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              微信咨询其他模型接入
            </a>
          </article>

          <article className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">购买前请先看清楚</h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-amber-950/80">
              {noticeItems.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        </div>

        <aside id="buy" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">购买方式</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              目前先用微信咨询购买。确认你使用 Mac、Codex 可正常启动，并已有 DeepSeek API 帐户后，再发送 ZIP 安装包。
            </p>
            <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <div className="text-xs font-semibold text-violet-700">首批试用价</div>
              <div className="mt-1 text-3xl font-black text-slate-950">¥98</div>
              <div className="mt-1 text-xs leading-5 text-slate-500">不含 DeepSeek API 用量费</div>
            </div>
            <a
              href="/consulting#wechat-consulting"
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              扫微信咨询购买
            </a>
            <Link
              href="/skills"
              className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              返回插件库
            </Link>
          </div>
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
