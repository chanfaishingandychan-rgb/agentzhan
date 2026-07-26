const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agentzhan.com";
const siteUrl = rawSiteUrl.replace(/\/+$/, "");

export const siteConfig = {
  name: "Agent站",
  description:
    "Agent站是中文 AI 生产力工作站，整理 AI 技能、Prompt、工具和工作流，帮助创作者、电商卖家、上班族和小老板用 AI 更快完成工作。",
  title: "Agent站 - 把 AI 变成你的工作助手",
  subtitle:
    "整理 AI 技能、Prompt、工具和工作流，帮你完成写作、办公、电商、短视频、编程和自动化任务。",
  url: siteUrl,
  keywords: [
    "Agent站",
    "AI提示词库",
    "ChatGPT提示词",
    "Claude提示词",
    "DeepSeek提示词",
    "AI工作流",
    "AI Agent",
    "百度SEO",
    "中文AI提示词",
  ],
};

export const categories = [
  {
    slug: "ai-writing",
    name: "AI写作",
    description: "覆盖爆款选题、文章改写、公众号、简历、营销文案等高频写作场景。",
    intro:
      "AI写作分类面向内容创作者、运营团队、品牌市场和个人表达场景，重点覆盖选题、提纲、正文、改写、润色、案例包装和内容转化。",
    keywords: ["AI写作提示词", "中文写作提示词", "公众号提示词", "文案提示词"],
  },
  {
    slug: "ai-office",
    name: "AI办公",
    description: "面向职场与企业管理，包含汇报、会议纪要、表格分析、邮件与 SOP。",
    intro:
      "AI办公分类聚焦上班族和企业团队日常提效，适合会议纪要、周报、PPT、邮件、流程文档、汇报材料和协同沟通。",
    keywords: ["AI办公提示词", "会议纪要提示词", "周报提示词", "职场AI工具"],
  },
  {
    slug: "ai-learning",
    name: "AI学习",
    description: "服务学生和终身学习者，适合预习、复习、考试、论文与语言学习。",
    intro:
      "AI学习分类服务学生、考证人群和终身学习者，覆盖预习、复习、考试冲刺、论文写作、语言学习和知识点拆解。",
    keywords: ["AI学习提示词", "考试提示词", "论文提示词", "学生AI工具"],
  },
  {
    slug: "ai-short-video",
    name: "AI短视频",
    description: "聚焦抖音、快手、小红书视频脚本、分镜、标题、直播与涨粉玩法。",
    intro:
      "AI短视频分类聚焦短视频创作与直播转化，适合抖音、快手、小红书等平台的脚本、选题、分镜、标题、预热和复盘。",
    keywords: ["短视频提示词", "抖音脚本提示词", "直播话术提示词", "小红书视频文案"],
  },
  {
    slug: "ai-ecommerce",
    name: "AI电商",
    description: "适合淘宝、天猫、京东、拼多多、独立站与跨境卖家进行运营提效。",
    intro:
      "AI电商分类面向平台卖家、品牌电商和跨境团队，覆盖标题优化、详情页、客服、活动、数据分析、上新和复购运营。",
    keywords: ["AI电商提示词", "淘宝提示词", "电商运营提示词", "跨境电商AI"],
  },
  {
    slug: "ai-marketing",
    name: "AI营销",
    description: "覆盖品牌传播、投放优化、增长策划、私域转化、活动创意与用户运营。",
    intro:
      "AI营销分类适合品牌市场、增长团队、投放团队和私域操盘手，围绕获客、转化、复购和品牌心智建设设计内容与策略。",
    keywords: ["AI营销提示词", "增长提示词", "私域营销提示词", "品牌策划AI"],
  },
  {
    slug: "ai-customer-service",
    name: "AI客服",
    description: "面向售前、售后、回访、知识库、标准话术与服务质量管理场景。",
    intro:
      "AI客服分类适合电商客服、SaaS 客服、企业服务团队和售后管理者，重点解决响应效率、统一口径、情绪安抚与知识沉淀。",
    keywords: ["AI客服提示词", "售后话术提示词", "客服知识库提示词", "客服AI"],
  },
  {
    slug: "ai-startup",
    name: "AI创业",
    description: "覆盖创业方向验证、商业模式梳理、融资材料、产品定位与冷启动方案。",
    intro:
      "AI创业分类面向创业者、小团队和中小企业老板，适合做项目验证、用户需求研究、商业模式梳理、路演和增长冷启动。",
    keywords: ["AI创业提示词", "商业计划书提示词", "创业项目AI", "融资路演AI"],
  },
  {
    slug: "ai-personal-assistant",
    name: "AI个人助理",
    description: "适合日程管理、个人复盘、生活决策、沟通协助与多任务安排。",
    intro:
      "AI个人助理分类适合个人效率管理者、自由职业者和高密度工作者，用于安排事务、拆解目标、整理信息和辅助决策。",
    keywords: ["AI个人助理提示词", "日程管理AI", "个人规划提示词", "效率助手AI"],
  },
  {
    slug: "ai-efficiency-tools",
    name: "AI效率工具",
    description: "聚焦自动化、工具组合、流程提效、知识管理与跨平台协作。",
    intro:
      "AI效率工具分类强调工具链组合与流程自动化，适合把零散任务沉淀成标准化工作流，服务个人和团队规模化提效。",
    keywords: ["AI效率工具", "AI自动化提示词", "工作流提示词", "知识管理AI"],
  },
] as const;

export const modelOptions = [
  "ChatGPT",
  "Claude",
  "DeepSeek",
  "通义千问",
  "文心一言",
];

export const difficultyOptions = ["入门", "进阶", "专业"] as const;
