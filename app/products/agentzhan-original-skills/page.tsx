import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { originalSkillProducts } from "@/lib/original-skill-products";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Agent站原创 AI Skill 包 - 自制 Skill 售卖",
  description:
    "Agent站原创 AI Skill 包，包含网站经营、AI 小说连载、小红书内容工厂、客服知识库和 Prompt 产品化等可复制工作流。",
  alternates: {
    canonical: `${siteConfig.url}/products/agentzhan-original-skills`,
  },
  openGraph: {
    title: "Agent站原创 AI Skill 包",
    description: "购买可复制到 Agent 里的原创 Skill：流程、提示词、检查清单和交付模板。",
    url: `${siteConfig.url}/products/agentzhan-original-skills`,
    siteName: siteConfig.name,
    type: "website",
  },
};

const originalSkills = [
  ...originalSkillProducts.map((product) => ({
    name: product.title,
    price: product.priceLabel,
    tag: product.category,
    href: product.path,
    audience: product.audience,
    outcome: product.outcome,
    includes: product.includedItems.slice(0, 4),
  })),
  {
    name: "AI 网站经营 Skill",
    price: "¥99",
    tag: "站长首选",
    href: "/products/agentzhan-website-operator-skill",
    audience: "个人站长、AI 工具站、小团队老板",
    outcome: "让 Agent 每周帮你规划内容、检查流量、设计转化入口和生成更新清单。",
    includes: ["网站体检 Prompt", "7 天内容经营流程", "SEO 内链检查清单", "变现入口设计模板"],
  },
  {
    name: "AI 小说连载 Skill",
    price: "¥69",
    tag: "内容创作",
    href: "#wechat",
    audience: "小说作者、AI 写作新手、故事号运营者",
    outcome: "把人物设定、章节大纲、正文改稿和下一章钩子整理成稳定连载流程。",
    includes: ["人物档案模板", "章节大纲 Prompt", "情绪节点检查表", "连载更新计划"],
  },
  {
    name: "小红书内容工厂 Skill",
    price: "¥99",
    tag: "引流",
    href: "#wechat",
    audience: "小红书博主、知识博主、服务型账号",
    outcome: "让 Agent 从选题、标题、正文、标签到复盘，生成一周内容生产计划。",
    includes: ["30 个选题生成器", "标题多版本 Prompt", "正文改稿流程", "数据复盘表"],
  },
  {
    name: "AI 客服知识库 Skill",
    price: "¥129",
    tag: "企业流程",
    href: "#wechat",
    audience: "电商卖家、SaaS 团队、本地服务商家",
    outcome: "把常见问题、售前话术、售后边界和转人工规则整理成可交付客服知识库。",
    includes: ["FAQ 收集模板", "标准回复 Prompt", "转人工规则表", "售后风险检查清单"],
  },
  {
    name: "Prompt 产品化 Skill",
    price: "¥99",
    tag: "变现",
    href: "#wechat",
    audience: "内容创作者、个人站长、AI 副业新手",
    outcome: "把零散提示词整理成可卖的 Prompt 包，包含目录、卖点、交付和售后说明。",
    includes: ["产品定位表", "Prompt 包目录模板", "销售页文案 Prompt", "售后边界说明"],
  },
  {
    name: "线索跟进 Skill",
    price: "¥129",
    tag: "成交",
    href: "#wechat",
    audience: "咨询服务、课程销售、B2B 小团队",
    outcome: "把表单、微信咨询、客户需求和跟进动作整理成可执行销售流程。",
    includes: ["线索评分规则", "微信跟进话术", "客户需求摘要 Prompt", "成交复盘模板"],
  },
];

const deliveryItems = [
  "一个可复制的 SKILL.md 使用说明",
  "一组对应场景的中文 Prompt",
  "交付检查清单和测试步骤",
  "适合新手照做的使用教程",
  "可选：微信协助你放进自己的 Agent 流程",
];

export default function AgentzhanOriginalSkillsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Agent站原创 AI Skill 包",
    description: "面向个人站长、内容创作者和小团队的原创 AI Skill 工作流包。",
    brand: {
      "@type": "Brand",
      name: "Agent站",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "CNY",
      lowPrice: "69",
      highPrice: "129",
      offerCount: String(originalSkills.length),
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/products/agentzhan-original-skills`,
    },
  };

  return (
    <main className="bg-[#fafafa]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-rose-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8 lg:py-24">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="premium">Agent站原创</Badge>
              <Badge variant="violet">可复制 Skill</Badge>
              <Badge variant="blue">首批 ¥69 起</Badge>
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              自制 AI Skill 包，上架售卖
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              这些不是普通教程，而是可以放进 Agent 工作流的 Skill 包：包含流程、提示词、检查清单、测试步骤和交付模板。适合想用 AI 经营网站、做内容、做客服和卖数字产品的人。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#skill-store"
                className="inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
              >
                查看原创 Skill
              </a>
              <a
                href="#wechat"
                className="inline-flex h-12 items-center rounded-full border border-white/15 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                微信购买
              </a>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-white backdrop-blur">
            <div className="text-sm text-slate-300">首批价格</div>
            <div className="mt-2 text-5xl font-black tracking-tight">¥69 起</div>
            <div className="mt-2 text-sm text-slate-300">单个 Skill 包，可按场景购买</div>
            <div className="mt-6 space-y-3 text-sm text-slate-200">
              {deliveryItems.slice(0, 4).map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <div className="text-sm font-semibold text-violet-700">先学会怎样用</div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
              Skill 不是一句提示词，而是一套可重复使用的流程
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              买家拿到 ZIP 后，可以直接复制 Prompt 使用；如果他的 Agent 支持 Skill，也可以把 SKILL.md 放进去，让 AI 按固定流程做事。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["看 README", "先知道这个 Skill 适合什么场景、里面有哪些文件。"],
              ["复制 Prompt", "不会安装也没关系，直接把 prompts 文件复制到 AI 对话框就能用。"],
              ["填真实资料", "把业务、产品、客户问题、账号定位等资料填进去。"],
              ["用清单检查", "发给客户、老板或公开平台前，用 checklist 逐项确认。"],
            ].map(([title, desc], index) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-3 font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="skill-store" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <div className="text-sm font-semibold text-violet-700">原创 Skill 商店</div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">先卖结果最清楚的大众 Skill</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            办公、内容、客服是最容易让普通用户理解的场景。用户买到的不只是提示词，而是一套可以照着跑的流程。
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {originalSkills.map((skill) => (
            <article key={skill.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <Badge variant={skill.tag === "变现" || skill.tag === "成交" ? "premium" : "violet"}>
                  {skill.tag}
                </Badge>
                <div className="text-3xl font-black text-slate-950">{skill.price}</div>
              </div>
              <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">{skill.name}</h3>
              <p className="mt-2 text-sm font-semibold text-slate-500">适合：{skill.audience}</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">{skill.outcome}</p>
              <div className="mt-5 space-y-2">
                {skill.includes.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
              <Link
                href={skill.href}
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                {skill.href.startsWith("/products/") ? "查看下载页" : "咨询购买"}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <div className="text-sm font-semibold text-violet-700">交付内容</div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
              每个 Skill 都要让用户能马上跑起来
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              自制 Skill 的价值在于把你的经验变成固定流程。用户不用从零提问，只要按说明填资料、执行步骤、检查结果。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {deliveryItems.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="wechat" className="mx-auto max-w-5xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 rounded-[2rem] border border-violet-200 bg-gradient-to-br from-white via-violet-50 to-blue-50 p-6 shadow-sm sm:p-8 lg:grid-cols-[220px_1fr]">
          <div className="rounded-3xl border border-white bg-white p-5 shadow-sm">
            <Image src="/wechat-qr.jpg" alt="Agent站微信咨询二维码" width={180} height={180} className="h-44 w-44" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-sm font-semibold text-violet-700">购买方式</div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">先加微信，说明想买哪个 Skill</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              发送 Skill 名称和你的使用场景。我会确认你适不适合这个包，再发付款方式和交付文件。需要我帮你放进 Agent 流程，也可以加配置服务。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products/ai-skill-install-service"
                className="inline-flex h-11 items-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                需要代安装配置
              </Link>
              <Link
                href="/skills"
                className="inline-flex h-11 items-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-violet-700 transition hover:border-violet-200 hover:bg-violet-50"
              >
                返回插件库
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
