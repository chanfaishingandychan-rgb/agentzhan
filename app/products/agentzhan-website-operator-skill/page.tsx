import type { Metadata } from "next";
import Link from "next/link";

import { ProductPurchaseBox } from "@/components/product-purchase-box";
import {
  getWebsiteOperatorSkillCanonicalUrl,
  isWebsiteOperatorSkillUnlockCodeValid,
  websiteOperatorSkillProduct,
} from "@/lib/products";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: websiteOperatorSkillProduct.title,
  description: websiteOperatorSkillProduct.description,
  alternates: {
    canonical: getWebsiteOperatorSkillCanonicalUrl(),
  },
  openGraph: {
    title: `${websiteOperatorSkillProduct.title} - Agent站`,
    description: websiteOperatorSkillProduct.description,
    url: getWebsiteOperatorSkillCanonicalUrl(),
    siteName: siteConfig.name,
    type: "website",
  },
};

type WebsiteOperatorSkillPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const includedItems = [
  "SKILL.md：可放进 Agent 的网站经营 Skill 说明",
  "网站经营周报 Prompt",
  "7 天内容计划 Prompt",
  "流量诊断 Prompt",
  "页面变现漏斗 Prompt",
  "每周网站经营检查清单",
  "示例输入和示例输出",
  "微信客服排查信息模板",
];

const useCases = [
  {
    title: "每周让 Agent 给网站排计划",
    desc: "根据现有页面、产品和流量数据，生成本周应该更新的内容、内链和转化入口。",
  },
  {
    title: "把教程页面导向变现",
    desc: "检查页面有没有免费资源、产品入口或微信咨询入口，减少读者看完就离开。",
  },
  {
    title: "看懂流量是不是有价值",
    desc: "不只看浏览量，也检查来源、热门页面、设备、地区和真实转化动作。",
  },
  {
    title: "持续制造可卖内容",
    desc: "围绕网站主题，把教程、Skill、Prompt 包和咨询服务串成经营路径。",
  },
];

export default async function WebsiteOperatorSkillPage({ searchParams }: WebsiteOperatorSkillPageProps) {
  const sp = await searchParams;
  const unlock = typeof sp.unlock === "string" ? sp.unlock.trim() : undefined;
  const unlocked = isWebsiteOperatorSkillUnlockCodeValid(unlock);
  const downloadHref = unlocked && unlock
    ? `${websiteOperatorSkillProduct.apiPath}?token=${encodeURIComponent(unlock)}`
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: websiteOperatorSkillProduct.title,
    description: websiteOperatorSkillProduct.description,
    brand: {
      "@type": "Brand",
      name: "Agent站",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: websiteOperatorSkillProduct.currency,
      price: String(websiteOperatorSkillProduct.priceAmount),
      availability: "https://schema.org/InStock",
      url: getWebsiteOperatorSkillCanonicalUrl(),
    },
  };

  return (
    <main className="bg-[#fafafa]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8 lg:py-24">
          <div>
            <Link href="/products/agentzhan-original-skills" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
              <span aria-hidden="true">&larr;</span>
              返回原创 Skill
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-950">原创 Skill 包</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-violet-100">网站经营</span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-rose-100">可下载 ZIP</span>
            </div>
            <h1 className="mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              {websiteOperatorSkillProduct.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              第一套已经可以交付的 Agent站原创 Skill。适合个人站长、AI 工具站和内容站，用来每周规划内容、诊断流量、检查内链和设计变现入口。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#buy"
                className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                购买下载 {websiteOperatorSkillProduct.priceLabel}
              </a>
              <a
                href="#included"
                className="inline-flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                查看交付内容
              </a>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur">
            <div className="text-sm text-slate-300">首批价格</div>
            <div className="mt-2 text-5xl font-black tracking-tight">{websiteOperatorSkillProduct.priceLabel}</div>
            <div className="mt-2 text-sm text-slate-300">ZIP 下载，内含 10 个文件</div>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <SummaryLine label="格式" value="SKILL.md + Markdown" />
              <SummaryLine label="文件" value="10 个交付文件" />
              <SummaryLine label="适合" value="个人站长 / AI 工具站" />
              <SummaryLine label="交付" value="下载码解锁" />
            </div>
            <a
              href="#buy"
              className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-violet-600 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              购买并下载
            </a>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8 lg:py-20">
        <div className="space-y-8">
          <article id="included" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">这个 Skill 包包括什么？</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {includedItems.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">买回去可以怎样用？</h2>
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
            <h2 className="text-2xl font-bold text-slate-950">你现在可以怎样交付给客户？</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              客户付款后，你发下载码给他。他回到本页输入下载码，就可以下载 ZIP。不会使用的人，可以加价购买 Skill 代安装服务。
            </p>
            <Link
              href="/products/ai-skill-install-service"
              className="mt-5 inline-flex h-11 items-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              查看代安装服务
            </Link>
          </article>
        </div>

        <aside id="buy" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <ProductPurchaseBox
            product={websiteOperatorSkillProduct}
            unlocked={unlocked}
            unlockEnabled
            downloadHref={downloadHref}
          />
        </aside>
      </section>
    </main>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-semibold text-white">{value}</span>
    </div>
  );
}
