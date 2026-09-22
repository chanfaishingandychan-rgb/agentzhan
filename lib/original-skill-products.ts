import type { DigitalProduct } from "@/lib/products";
import { siteConfig } from "@/lib/site";

export type OriginalSkillFile = {
  name: string;
  content: string;
};

export type OriginalSkillProduct = DigitalProduct & {
  category: string;
  audience: string;
  outcome: string;
  includedItems: string[];
  useCases: { title: string; desc: string }[];
  files: OriginalSkillFile[];
  tokens: string[];
};

function productBase(slug: string) {
  return {
    slug,
    path: `/products/original-skills/${slug}`,
    apiPath: `/api/download/original-skill/${slug}`,
    currency: "CNY" as const,
    paymentQrImage: "/wechat-qr.jpg",
    supportLabel: "微信客服",
    supportHref: "/consulting#wechat-consulting",
  };
}

function commonReadme(title: string, description: string, files: string[]) {
  return `# ${title}

${description}

## 使用方法

1. 如果你的 Agent 支持 Skill，把 SKILL.md 放进对应 Skill 目录。
2. 如果你只用 ChatGPT、DeepSeek、Kimi 或 Claude，可以直接复制 prompts 里的提示词。
3. 先用 examples 里的示例跑一次，确认输出风格。
4. 真正用于客户、老板或公开平台前，必须按 checklist 检查。

## 文件说明

${files.map((item) => `- ${item}`).join("\n")}

## 售后

如果不会安装或想定制到自己的业务流程，可以加 Agent站微信咨询。
`;
}

function supportMessage(productName: string) {
  return `# 微信客服信息模板

购买产品：${productName}
下载码：
你使用的工具：Codex / ChatGPT / DeepSeek / Kimi / 其他
你的使用场景：
你想得到的结果：
遇到的问题：
截图或报错：

请不要发送密码、API Key、后台登录验证码或其他敏感信息。
`;
}

function officeAssistantFiles() {
  return [
    {
      name: "README.md",
      content: commonReadme("AI 办公助手 Skill", "适合上班族、小团队和行政运营人员，把会议、周报、邮件、SOP 和资料总结变成固定 AI 工作流。", [
        "SKILL.md：给 Agent 使用的办公 Skill 说明",
        "prompts/：办公常用 Prompt",
        "checklists/：发送前检查清单",
        "examples/：示例输入和输出",
        "support-message.txt：客服协助模板",
      ]),
    },
    {
      name: "SKILL.md",
      content: `---
name: ai-office-assistant
description: Turn meeting notes, weekly reports, emails, SOPs, and document summaries into practical office deliverables. Use when the user asks for workplace writing, office workflow, or admin productivity help.
---

# AI Office Assistant

Help users turn messy workplace information into clear deliverables.

## Scope

- Meeting minutes
- Weekly reports
- Business emails
- SOP documents
- Document summaries
- Manager briefings

## Rules

- Never invent facts, dates, names, prices, owners, or deadlines.
- Mark missing information as "待确认".
- Use professional Chinese by default.
- Output practical documents, not advice only.
- For anything sent externally, remind the user to check facts and sensitive data.

## Workflow

1. Identify the document type and audience.
2. Ask for or extract raw facts.
3. Produce a clear first draft.
4. Add action items, risks, and missing information.
5. Provide a short checklist before sending.
`,
    },
    {
      name: "prompts/01-meeting-minutes.md",
      content: `# 会议纪要 Prompt

你是一名专业会议纪要助理。请根据下面资料整理会议纪要。

会议主题：
会议日期：
参会人员：
原始记录：

请输出：
1. 会议背景
2. 讨论重点
3. 已确定结论
4. 行动项表格：事项 / 负责人 / 截止时间 / 状态
5. 待确认问题
6. 风险提醒

要求：不要编造资料，没有负责人或日期就写待确认。`,
    },
    {
      name: "prompts/02-weekly-report.md",
      content: `# 周报 Prompt

你是一名职场写作助理。请把我的工作记录整理成清楚、不夸张的周报。

岗位：
本周完成：
进行中：
问题和风险：
下周计划：
需要支持：

请输出：
1. 工作群简短版
2. 发给上级正式版
3. 本周亮点
4. 风险和待协调事项
5. 下周优先级`,
    },
    {
      name: "prompts/03-email-reply.md",
      content: `# 邮件回复 Prompt

你是一名商务邮件助理。请写一封语气合适的回复。

收件人：
双方关系：
对方重点：
我要表达：
是否需要对方行动：
截止时间：

请输出：邮件标题、正式正文、简短版本、温和版本、发送前需确认事项。`,
    },
    {
      name: "checklists/office-send-checklist.md",
      content: `# 办公内容发送前检查清单

- 日期是否正确
- 人名、公司名、项目名是否正确
- 金额、数量、比例是否正确
- 是否泄露内部资料
- 是否承诺了做不到的事
- 语气是否适合对象
- 行动项和截止时间是否清楚
- 是否需要真人再看一遍`,
    },
    {
      name: "examples/example-input.md",
      content: `# 示例输入

任务：写周报
岗位：运营
本周完成：更新 3 篇教程、上线 1 个产品页、检查流量后台
问题：微信咨询少，产品页点击不明
下周计划：新增 Skill 交付包，优化 /skills 页面`,
    },
    {
      name: "examples/example-output.md",
      content: `# 示例输出

本周完成了教程内容更新、产品页上线和流量后台检查。当前主要问题是咨询转化偏少，下一步会围绕 Skill 交付包和 /skills 页面优化转化路径。`,
    },
    { name: "support-message.txt", content: supportMessage("AI 办公助手 Skill") },
  ];
}

function contentFactoryFiles() {
  return [
    {
      name: "README.md",
      content: commonReadme("短视频小红书内容工厂 Skill", "适合小红书、短视频、知识博主和服务型账号，用 AI 做选题、标题、正文、脚本和复盘。", [
        "SKILL.md：给 Agent 使用的内容工厂 Skill",
        "prompts/：选题、标题、正文、脚本和复盘 Prompt",
        "checklists/：发布前检查清单",
        "examples/：示例输入和输出",
        "support-message.txt：客服协助模板",
      ]),
    },
    {
      name: "SKILL.md",
      content: `---
name: social-content-factory
description: Create practical Xiaohongshu and short-video content plans, titles, drafts, scripts, and performance reviews. Use for social content creation and weekly publishing workflows.
---

# Social Content Factory

Help creators produce realistic, non-hype social content.

## Rules

- Start from audience, problem, real experience, and platform.
- Avoid exaggerated promises and fake results.
- Generate multiple options, then recommend the most natural one.
- Every post should have a clear reader action: save, comment, follow, message, or visit a page.

## Workflow

1. Define account positioning and target reader.
2. Generate a topic pool from real reader problems.
3. Produce titles by angle.
4. Draft content using real details.
5. Create a short-video script when needed.
6. Review performance and suggest the next iteration.
`,
    },
    {
      name: "prompts/01-topic-pool.md",
      content: `# 选题池 Prompt

你是一名内容运营。请为我的账号生成 30 个真实用户会关心的选题。

账号定位：
目标读者：
我能分享的真实经验：
产品或服务：
禁用表达：

请按痛点型、经验型、避坑型、清单型、故事型分类输出。`,
    },
    {
      name: "prompts/02-title-generator.md",
      content: `# 标题生成 Prompt

请根据下面选题生成 20 个标题。

选题：
目标读者：
平台：小红书 / 抖音 / 快手 / 视频号
语气：自然、不夸张、有点击理由

请按痛点、结果、避坑、清单、故事五类输出，并推荐最适合的 3 个。`,
    },
    {
      name: "prompts/03-post-draft.md",
      content: `# 正文草稿 Prompt

你是一名中文内容编辑。请把下面素材写成适合发布的正文。

标题：
真实经历：
读者痛点：
核心方法：
想引导的动作：

请输出：开头、正文、结尾互动、标签。要求像真人分享，不要硬广。`,
    },
    {
      name: "prompts/04-short-video-script.md",
      content: `# 短视频脚本 Prompt

你是一名短视频编导。请写一条 45 秒脚本。

账号领域：
目标观众：
选题：
拍摄条件：
视频目的：

请输出：前 3 秒开头、分镜表、口播、字幕、结尾互动、拍摄清单。`,
    },
    {
      name: "prompts/05-review.md",
      content: `# 内容复盘 Prompt

你是一名内容增长分析师。请根据数据复盘。

标题：
发布时间：
浏览：
点赞：
收藏：
评论：
转发：
新增关注：

请判断：选题、标题、开头、内容结构、结尾互动哪里可优化，并给下次 5 个新选题。`,
    },
    {
      name: "checklists/publish-checklist.md",
      content: `# 发布前检查清单

- 标题是否具体
- 开头是否 3 秒内给理由
- 内容是否有真实细节
- 是否避免夸张承诺
- 是否有明确互动问题
- 标签是否相关
- 是否泄露隐私或客户资料`,
    },
    { name: "examples/example-input.md", content: "账号定位：AI 新手教学\n目标读者：上班族\n真实经验：用 AI 写周报、整理会议、做内容计划\n产品：AI Skill 包" },
    { name: "examples/example-output.md", content: "标题示例：我用 AI 把周报时间从 1 小时压到 10 分钟\n开头：以前每到周五我都最怕写周报..." },
    { name: "support-message.txt", content: supportMessage("短视频小红书内容工厂 Skill") },
  ];
}

function customerServiceFiles() {
  return [
    {
      name: "README.md",
      content: commonReadme("AI 客服回复系统 Skill", "适合电商、课程、咨询服务和小团队，把常见问题、售前咨询、售后争议和转人工规则整理成稳定客服流程。", [
        "SKILL.md：给 Agent 使用的客服 Skill",
        "prompts/：FAQ、标准回复、售后、投诉和知识库 Prompt",
        "checklists/：回复前风险检查清单",
        "examples/：示例输入和输出",
        "support-message.txt：客服协助模板",
      ]),
    },
    {
      name: "SKILL.md",
      content: `---
name: ai-customer-service-system
description: Draft customer service replies, build FAQ knowledge bases, handle after-sales messages, and define escalation rules. Use for ecommerce, course, SaaS, or service business customer support.
---

# AI Customer Service System

Help businesses answer customers clearly while reducing risk.

## Rules

- Do not invent policies, prices, delivery times, refund terms, or guarantees.
- Ask for or mark missing policy details.
- De-escalate emotional messages without admitting unsupported liability.
- Escalate legal, refund dispute, account security, payment, privacy, and abusive cases to a human.

## Workflow

1. Identify customer intent and emotional state.
2. Check available policy or knowledge base.
3. Draft a concise reply.
4. Add what to ask next.
5. Mark whether human escalation is needed.
`,
    },
    {
      name: "prompts/01-faq-builder.md",
      content: `# FAQ 知识库 Prompt

你是一名客服知识库设计师。请根据资料整理 FAQ。

业务类型：
产品或服务：
价格规则：
发货或交付方式：
退款售后规则：
常见客户问题：

请输出：问题分类、标准回答、需要追问的信息、必须转人工的情况。`,
    },
    {
      name: "prompts/02-standard-reply.md",
      content: `# 标准客服回复 Prompt

你是一名客服主管。请根据客户问题写回复。

客户问题：
客户情绪：
已知规则：
不能承诺：
希望客户下一步做什么：

请输出：简短版、详细版、微信聊天版、需要人工确认的信息。`,
    },
    {
      name: "prompts/03-after-sales.md",
      content: `# 售后处理 Prompt

请帮我处理一个售后问题。

客户描述：
订单情况：
适用规则：
可提供方案：
不可承诺事项：

请输出：安抚回复、处理步骤、需要客户提供的信息、转人工判断。`,
    },
    {
      name: "prompts/04-complaint.md",
      content: `# 投诉降温 Prompt

你是一名资深客服。客户情绪激动，请写一段稳妥回复。

客户原话：
事实情况：
我们能做的：
我们不能承诺的：

要求：先承认对方感受，再说明会核实，不要乱承诺赔偿或责任。`,
    },
    {
      name: "checklists/reply-risk-checklist.md",
      content: `# 客服回复风险检查清单

- 是否承诺了规则外退款
- 是否承诺了无法保证的时间
- 是否泄露其他客户资料
- 是否要求客户提供敏感信息
- 是否需要人工处理
- 是否存在法律、投诉、支付或账号安全风险
- 语气是否礼貌但不软弱`,
    },
    { name: "examples/example-input.md", content: "客户问题：为什么我付款后还没收到文件？\n规则：客服确认后发送下载码\n不能承诺：不能说系统自动即时发货" },
    { name: "examples/example-output.md", content: "您好，我帮您核对一下付款记录。这个产品是客服确认后发送下载码，请您把付款备注或截图发来，我确认后马上处理。" },
    { name: "support-message.txt", content: supportMessage("AI 客服回复系统 Skill") },
  ];
}

export const originalSkillProducts: OriginalSkillProduct[] = [
  {
    ...productBase("ai-office-assistant-skill"),
    title: "AI 办公助手 Skill",
    shortTitle: "AI 办公助手 Skill",
    description: "把会议纪要、周报、邮件、SOP 和资料总结变成可重复使用的 AI 办公流程。",
    priceLabel: "¥69",
    priceAmount: 69,
    category: "办公提效",
    audience: "上班族、行政、运营、小团队老板",
    outcome: "让买家每天都能用 AI 处理办公文字和流程。",
    paymentImageAlt: "AI 办公助手 Skill 微信二维码",
    paymentImageCaption: "先加客服微信，确认后发送 ¥69 收款方式",
    purchaseStepOne: "先加客服微信，说明要购买 AI 办公助手 Skill",
    purchaseStepTwo: "确认无误后，按客服发送的 ¥69 收款方式付款",
    purchaseStepThree: "客服确认收款后发送下载码，在本页输入即可下载 ZIP",
    downloadName: "agentzhan-ai-office-assistant-skill.zip",
    includedItems: ["SKILL.md", "会议纪要 Prompt", "周报 Prompt", "邮件回复 Prompt", "办公发送前检查清单", "示例输入和输出"],
    useCases: [
      { title: "会议后整理纪要", desc: "把原始记录变成结论、待办、负责人和截止时间。" },
      { title: "快速写周报", desc: "根据事实清单生成群内版和正式汇报版。" },
      { title: "回复商务邮件", desc: "按客户、老板、同事不同关系调整语气。" },
      { title: "整理 SOP", desc: "把口头流程变成新人能照做的文档。" },
    ],
    files: officeAssistantFiles(),
    tokens: ["OFFICE-SKILL-69", "AGENT-OFFICE-2026", "WORKFLOW-69-AI"],
  },
  {
    ...productBase("social-content-factory-skill"),
    title: "短视频小红书内容工厂 Skill",
    shortTitle: "内容工厂 Skill",
    description: "从选题、标题、正文、短视频脚本到数据复盘，给内容创作者的一套 AI 内容生产流程。",
    priceLabel: "¥99",
    priceAmount: 99,
    category: "内容引流",
    audience: "小红书博主、短视频创作者、知识博主、服务型账号",
    outcome: "让买家每周稳定产出选题、标题、正文和脚本。",
    paymentImageAlt: "短视频小红书内容工厂 Skill 微信二维码",
    paymentImageCaption: "先加客服微信，确认后发送 ¥99 收款方式",
    purchaseStepOne: "先加客服微信，说明要购买内容工厂 Skill",
    purchaseStepTwo: "确认无误后，按客服发送的 ¥99 收款方式付款",
    purchaseStepThree: "客服确认收款后发送下载码，在本页输入即可下载 ZIP",
    downloadName: "agentzhan-social-content-factory-skill.zip",
    includedItems: ["SKILL.md", "选题池 Prompt", "标题生成 Prompt", "正文草稿 Prompt", "短视频脚本 Prompt", "内容复盘 Prompt"],
    useCases: [
      { title: "做一周选题", desc: "围绕目标读者生成痛点、经验、避坑、清单和故事选题。" },
      { title: "批量写标题", desc: "一个选题生成多种角度标题，再挑最自然的版本。" },
      { title: "生成短视频脚本", desc: "拆成开头、分镜、口播、字幕和拍摄清单。" },
      { title: "发布后复盘", desc: "根据浏览、收藏、评论等数据规划下一轮内容。" },
    ],
    files: contentFactoryFiles(),
    tokens: ["CONTENT-SKILL-99", "XHS-FACTORY-2026", "SOCIAL-AI-99"],
  },
  {
    ...productBase("customer-service-reply-skill"),
    title: "AI 客服回复系统 Skill",
    shortTitle: "AI 客服回复 Skill",
    description: "把常见问题、售前咨询、售后争议、投诉降温和转人工规则整理成 AI 客服流程。",
    priceLabel: "¥99",
    priceAmount: 99,
    category: "客服成交",
    audience: "电商卖家、课程卖家、本地服务、SaaS 小团队",
    outcome: "让买家快速建立客服知识库和标准回复流程。",
    paymentImageAlt: "AI 客服回复系统 Skill 微信二维码",
    paymentImageCaption: "先加客服微信，确认后发送 ¥99 收款方式",
    purchaseStepOne: "先加客服微信，说明要购买 AI 客服回复系统 Skill",
    purchaseStepTwo: "确认无误后，按客服发送的 ¥99 收款方式付款",
    purchaseStepThree: "客服确认收款后发送下载码，在本页输入即可下载 ZIP",
    downloadName: "agentzhan-customer-service-reply-skill.zip",
    includedItems: ["SKILL.md", "FAQ 知识库 Prompt", "标准回复 Prompt", "售后处理 Prompt", "投诉降温 Prompt", "风险检查清单"],
    useCases: [
      { title: "整理常见问题", desc: "把客户问题变成 FAQ、标准回答和追问信息。" },
      { title: "回复售前咨询", desc: "回答价格、交付、适合人群和下一步购买问题。" },
      { title: "处理售后争议", desc: "稳妥回复退款、延迟、下载码和交付问题。" },
      { title: "判断是否转人工", desc: "识别支付、投诉、隐私和法律风险。" },
    ],
    files: customerServiceFiles(),
    tokens: ["SERVICE-SKILL-99", "CUSTOMER-AI-2026", "REPLY-SYSTEM-99"],
  },
];

export function getOriginalSkillProduct(slug: string) {
  return originalSkillProducts.find((product) => product.slug === slug);
}

export function getOriginalSkillCanonicalUrl(slug: string) {
  return `${siteConfig.url}/products/original-skills/${slug}`;
}

export function isOriginalSkillUnlockCodeValid(slug: string, code: string | undefined) {
  const normalizedCode = code?.trim();
  const product = getOriginalSkillProduct(slug);
  const configuredTokens = [
    process.env.ORIGINAL_SKILL_DOWNLOAD_TOKEN,
    process.env.ORIGINAL_SKILL_DOWNLOAD_TOKENS,
    process.env[`ORIGINAL_SKILL_${slug.toUpperCase().replaceAll("-", "_")}_TOKEN`],
    process.env[`ORIGINAL_SKILL_${slug.toUpperCase().replaceAll("-", "_")}_TOKENS`],
  ]
    .filter(Boolean)
    .flatMap((value) => value!.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return Boolean(normalizedCode && product && [...product.tokens, ...configuredTokens].includes(normalizedCode));
}
