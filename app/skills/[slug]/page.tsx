import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PluginIcon } from "@/components/plugin-icon";
import { Badge } from "@/components/ui/badge";
import { allSkills, getSkillBySlug } from "@/lib/skills";
import { siteConfig } from "@/lib/site";

type SkillPageProps = {
  params: Promise<{ slug: string }>;
};

const dailyUseExamples: Record<string, { title: string; description: string }[]> = {
  "notion-agent-plugin": [
    { title: "整理会议和课程笔记", description: "把零散记录自动归类成主题、待办和下一步提醒。" },
    { title: "建立个人知识库", description: "把文章、资料和灵感沉淀成可以搜索的 Notion 页面。" },
    { title: "生成每周资料摘要", description: "定期汇总最近新增内容，快速知道哪些资料值得继续处理。" },
  ],
  "gmail-agent-plugin": [
    { title: "先看重要邮件", description: "自动识别客户、账单、会议和待办，减少在收件箱里翻找。" },
    { title: "生成回复草稿", description: "根据原邮件语气写出礼貌回复，再由你检查后发送。" },
    { title: "提醒后续跟进", description: "把报价、预约和未回复客户整理成清单，避免忘记处理。" },
  ],
  "google-drive-agent-plugin": [
    { title: "快速找到文件", description: "不用记文件名，也能按项目、客户或用途找到相关资料。" },
    { title: "整理合同和素材", description: "把散落的文档、图片和表格分类，减少重复下载和询问。" },
    { title: "汇总项目资料", description: "把一个文件夹里的重点内容整理成摘要和待办。" },
  ],
  "google-calendar-agent-plugin": [
    { title: "整理一天日程", description: "把会议、课程、客户预约和私人事项排成清楚的时间表。" },
    { title: "自动生成会前提醒", description: "提前列出会议资料、准备事项和需要确认的问题。" },
    { title: "安排跟进时间", description: "把聊天里提到的回访、付款、交付节点同步到日历。" },
  ],
  "slack-team-plugin": [
    { title: "总结群组讨论", description: "把频道里的长对话变成重点、结论和负责人清单。" },
    { title: "提取团队待办", description: "自动找出谁要做什么，减少会议后重复确认。" },
    { title: "发现重要问题", description: "客服、产品或项目频道有异常时，先整理成可处理事项。" },
  ],
  "airtable-database-plugin": [
    { title: "管理客户名单", description: "把客户资料、状态、备注和下一步动作放进一张清楚的表。" },
    { title: "整理内容排期", description: "把选题、负责人、发布时间和素材状态变成可追踪流程。" },
    { title: "生成运营报表", description: "自动汇总库存、项目进度或客户转化情况。" },
  ],
  "trello-task-plugin": [
    { title: "整理待办看板", description: "把零散任务按优先级、状态和负责人重新排列。" },
    { title: "复盘项目进度", description: "自动总结本周完成、卡住和下周要推进的事项。" },
    { title: "规划内容流程", description: "把选题、草稿、审核、发布做成简单可拖动的看板。" },
  ],
  "asana-project-plugin": [
    { title: "查看项目风险", description: "找出延期任务、无人负责事项和需要马上沟通的问题。" },
    { title: "生成项目日报", description: "把团队任务进度整理成管理者能快速阅读的报告。" },
    { title: "安排下一步工作", description: "根据当前状态自动列出负责人、截止日期和优先级。" },
  ],
  "dropbox-file-plugin": [
    { title: "整理图片和素材", description: "按客户、活动、用途把文件夹重新分类，减少重复查找。" },
    { title: "快速搜索旧资料", description: "通过关键词找到合同、报价、照片或项目文件。" },
    { title: "生成文件说明", description: "给一批资料自动写摘要，方便团队知道每个文件夹有什么。" },
  ],
  "github-agent-plugin": [
    { title: "修复网站问题", description: "让 AI 读取代码和错误信息，提出修改方案并协助改文件。" },
    { title: "新增小功能", description: "把需求拆成页面、组件、数据和测试步骤，减少来回沟通。" },
    { title: "整理代码改动", description: "自动生成提交说明、变更摘要和需要检查的地方。" },
  ],
  "vercel-deploy-plugin": [
    { title: "检查上线状态", description: "部署后自动查看是否成功，失败时先读日志找原因。" },
    { title: "修复构建错误", description: "遇到 Next.js、环境变量或依赖问题时，快速定位出错位置。" },
    { title: "确认正式网站", description: "上线后检查域名、页面和关键按钮是否正常访问。" },
  ],
  "supabase-database-plugin": [
    { title: "管理会员资料", description: "查看用户、收藏、提交记录和后台数据是否正常写入。" },
    { title: "整理表单线索", description: "把咨询表单、邮箱和备注统一存进数据库。" },
    { title: "生成数据摘要", description: "定期统计注册、提交、收藏和常见问题。" },
  ],
  "jira-issue-plugin": [
    { title: "拆解需求任务", description: "把一句需求变成开发、设计、测试都能理解的 Issue。" },
    { title: "整理 Bug 优先级", description: "按影响范围、复现步骤和紧急程度排列处理顺序。" },
    { title: "生成迭代复盘", description: "自动汇总本轮完成、延期和下个 Sprint 的重点。" },
  ],
  "figma-design-plugin": [
    { title: "读懂设计稿", description: "把页面结构、组件状态和交互细节整理成开发说明。" },
    { title: "生成页面文案", description: "根据设计位置写标题、按钮、提示语和空状态文案。" },
    { title: "交接给开发", description: "把颜色、间距、组件和响应式注意点整理成清单。" },
  ],
  "lead-capture-plugin": [
    { title: "收集咨询用户", description: "把访问者留下的姓名、微信、需求和来源整理到后台。" },
    { title: "自动分类需求", description: "区分模型咨询、插件安装、网站服务和企业流程问题。" },
    { title: "提醒及时跟进", description: "有新线索时自动通知，减少错过潜在客户。" },
  ],
  "seo-content-plugin": [
    { title: "找长尾关键词", description: "围绕一个主题生成用户会搜索的问题和文章方向。" },
    { title: "生成内容大纲", description: "把关键词变成标题、段落结构和 FAQ，方便继续写文章。" },
    { title: "更新旧文章", description: "检查过时内容，补充新工具、新模型和内部链接。" },
  ],
  "hubspot-crm-plugin": [
    { title: "整理客户状态", description: "把潜在客户、报价、跟进和成交阶段清楚分组。" },
    { title: "生成销售提醒", description: "根据聊天和邮件记录提醒什么时候再次联系客户。" },
    { title: "复盘成交原因", description: "汇总哪些来源、话术和需求最容易转化。" },
  ],
  "wordpress-content-plugin": [
    { title: "快速发布文章", description: "把标题、正文、标签和摘要整理好，再同步到 WordPress。" },
    { title: "优化产品教程", description: "把常见问题写成教程，帮助用户自己找到答案。" },
    { title: "维护内容站", description: "定期检查旧文章，补充链接、图片说明和搜索关键词。" },
  ],
  "zapier-automation-plugin": [
    { title: "连接表单和通知", description: "有人提交资料后，自动写入表格并发送提醒。" },
    { title: "同步常用工具", description: "把邮件、表格、CRM 和消息工具串成简单流程。" },
    { title: "减少手动复制", description: "让重复的录入、转发、提醒自动完成。" },
  ],
  "make-automation-plugin": [
    { title: "处理多步骤流程", description: "把订单、表单、内容、通知串成完整自动化。" },
    { title: "整理跨平台资料", description: "从多个工具读取资料，统一清洗后写入表格或数据库。" },
    { title: "自动分发内容", description: "把一份内容同步到网站、表格、邮箱或团队消息。" },
  ],
  "customer-service-plugin": [
    { title: "统一客服口径", description: "把常见问题、价格说明和售后规则整理成标准回答。" },
    { title: "处理情绪化咨询", description: "先帮你写出更稳妥、礼貌、不激化矛盾的回复。" },
    { title: "沉淀问题知识库", description: "把重复问题自动归类，后续新人也能快速上手。" },
  ],
  "shopify-store-plugin": [
    { title: "优化商品页面", description: "生成标题、卖点、FAQ 和尺寸说明，提高页面清晰度。" },
    { title: "整理订单异常", description: "把退款、延迟、缺货和物流问题归类给客服处理。" },
    { title: "准备活动文案", description: "根据商品和节日生成促销标题、邮件和社媒内容。" },
  ],
  "stripe-payment-plugin": [
    { title: "查看收款情况", description: "汇总付款、退款、订阅和失败扣款，快速知道收入变化。" },
    { title: "跟进付款问题", description: "找出失败付款或快到期订阅，提醒你及时联系用户。" },
    { title: "分析退款原因", description: "把退款记录整理成常见原因，帮助改进产品和说明。" },
  ],
};

export function generateStaticParams() {
  return allSkills.map((skill) => ({
    slug: skill.slug,
  }));
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);

  if (!skill) {
    return {};
  }

  const title = `${skill.title} - Agent插件介绍 - Agent站`;
  const description = `${skill.title}适合${skill.audience}，了解如何连接 ${skill.tools.join("、")}，让 Agent 完成可交付的自动化任务。`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/skills/${skill.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/skills/${skill.slug}`,
      siteName: siteConfig.name,
      type: "article",
    },
  };
}

export default async function SkillDetailPage({ params }: SkillPageProps) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);

  if (!skill) {
    notFound();
  }

  const relatedSkills = allSkills
    .filter((item) => item.slug !== skill.slug && (item.branchSlug === skill.branchSlug || item.monetization === "高"))
    .slice(0, 3);
  const examples = dailyUseExamples[skill.slug] ?? [
    { title: "处理重复任务", description: "把每天都要做的整理、生成、检查流程交给 AI 先完成初稿。" },
    { title: "提高资料整理效率", description: "把分散的信息变成清单、摘要、表格或下一步行动。" },
    { title: "接入真实工具", description: "让 AI 不只回答问题，也能连接工具完成实际工作。" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: skill.title,
    description: skill.outcome,
    applicationCategory: "AI Agent Plugin",
    operatingSystem: "Web",
    featureList: skill.steps,
  };

  return (
    <main className="bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <div className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className={`pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-gradient-to-br ${skill.color} opacity-25 blur-3xl`} />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <Link href="/skills" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
              <span aria-hidden="true">&larr;</span>
              返回 AI 插件库
            </Link>

            <div className="mt-8 max-w-4xl">
              <div className="mb-6 flex items-center gap-4">
                <PluginIcon slug={skill.slug} className="h-16 w-16 rounded-3xl" />
                <div className="text-sm text-slate-400">
                  官方入口：{skill.installLabel}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="violet">{skill.branch}</Badge>
                <Badge variant={skill.difficulty === "入门" ? "success" : skill.difficulty === "进阶" ? "blue" : "premium"}>
                  {skill.difficulty}
                </Badge>
                <Badge variant="muted">
                  节省：{skill.timeSaved}
                </Badge>
              </div>

              <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                {skill.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                {skill.outcome}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={skill.installUrl}
                  target={skill.installUrl.startsWith("http") ? "_blank" : undefined}
                  rel={skill.installUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                >
                  {skill.installLabel}
                </a>
                <a
                  href="#wechat"
                  className="inline-flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                >
                  微信咨询代安装
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr,340px] lg:px-8 lg:py-16">
        <div className="space-y-8">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">这个插件能帮你做什么？</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard title="适合人群" content={skill.audience} />
              <InfoCard title="预计节省时间" content={skill.timeSaved} />
              <InfoCard title="连接工具" content={skill.tools.join("、")} />
              <InfoCard title="应用方向" content={skill.promptExample} />
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">插件接入步骤</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              插件的关键不是“会说”，而是能连接真实工具、执行任务、记录结果，最后形成可重复交付的自动化能力。
            </p>
            <ol className="mt-6 space-y-4">
              {skill.steps.map((step, index) => (
                <li key={step} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-950">{step}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      把这一步变成固定流程，后面就可以复制给不同项目或客户使用。
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-950 p-6 shadow-sm sm:p-8">
            <div className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-violet-100">
              应用场景
            </div>
            <h2 className="text-2xl font-bold text-white">这个插件适合用在哪里？</h2>
            <p className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-slate-200">
              {skill.promptExample}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              重点是先从一个具体问题开始：准备好资料、说明目标，让 AI 按步骤帮你整理、生成或执行。
            </p>
          </article>

          <article className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">日常可以这样用</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {examples.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
            <a
              href="#wechat"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              微信咨询怎样开始使用
            </a>
          </article>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">插件摘要</h2>
            <div className="mt-5 space-y-4 text-sm">
              <SummaryRow label="分支" value={skill.branch} />
              <SummaryRow label="难度" value={skill.difficulty} />
              <SummaryRow label="节省" value={skill.timeSaved} />
              <SummaryRow label="工具" value={skill.tools.join(" / ")} />
            </div>
            <Link
              href="/skills"
              className="mt-6 inline-flex w-full justify-center rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              查看更多 AI 插件
            </Link>
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">相关插件</h2>
            <div className="mt-4 space-y-3">
              {relatedSkills.map((item) => (
                <Link key={item.slug} href={`/skills/${item.slug}`} className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-violet-200 hover:bg-violet-50">
                  <div className="text-sm font-semibold text-slate-950">{item.title}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">{item.outcome}</div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function InfoCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold text-slate-400">{title}</div>
      <div className="mt-2 text-sm font-semibold leading-6 text-slate-800">{content}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-semibold text-slate-800">{value}</span>
    </div>
  );
}
