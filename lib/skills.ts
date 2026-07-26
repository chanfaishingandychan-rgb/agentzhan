export type SkillItem = {
  slug: string;
  title: string;
  audience: string;
  outcome: string;
  tools: string[];
  difficulty: "入门" | "进阶" | "专业";
  timeSaved: string;
  monetization: "低" | "中" | "高";
  steps: string[];
  promptExample: string;
  relatedPack: string;
  href: string;
};

export type SkillBranch = {
  slug: string;
  title: string;
  description: string;
  color: string;
  skills: SkillItem[];
};

export const skillBranches: SkillBranch[] = [
  {
    slug: "content",
    title: "AI内容技能",
    description: "用 AI 完成小红书、抖音、公众号和短视频内容创作。",
    color: "from-rose-500 to-violet-600",
    skills: [
      {
        slug: "xiaohongshu-note",
        title: "AI 生成小红书爆款笔记",
        audience: "自媒体创作者、品牌运营、探店博主",
        outcome: "生成选题、标题、开头、正文和标签，快速完成一篇可发布笔记。",
        tools: ["ChatGPT", "DeepSeek", "Claude"],
        difficulty: "入门",
        timeSaved: "30-60 分钟",
        monetization: "高",
        steps: ["输入产品或主题", "让 AI 拆解目标人群和卖点", "生成 10 个标题", "选择标题后生成正文", "补充标签和评论区互动话术"],
        promptExample: "你是小红书爆款笔记策划，请根据我的产品/主题，生成 10 个标题、3 个开头、完整正文和 10 个标签，风格真实、有场景感、避免夸张营销。",
        relatedPack: "小红书 30 天内容包",
        href: "/search?q=小红书",
      },
      {
        slug: "douyin-script",
        title: "AI 生成抖音短视频脚本",
        audience: "短视频创作者、商家、个人 IP",
        outcome: "产出 3 秒钩子、分镜、口播稿和结尾引导。",
        tools: ["DeepSeek", "ChatGPT", "剪映"],
        difficulty: "入门",
        timeSaved: "20-40 分钟",
        monetization: "高",
        steps: ["确定视频目的", "生成 5 个开场钩子", "拆成 5-8 个分镜", "生成口播文案", "补充字幕和话题标签"],
        promptExample: "请为我的短视频主题生成一条 60 秒抖音脚本，包含 3 秒钩子、分镜表、口播稿、字幕重点和结尾互动引导。",
        relatedPack: "短视频脚本工作包",
        href: "/search?q=抖音",
      },
    ],
  },
  {
    slug: "ecommerce",
    title: "AI电商技能",
    description: "用 AI 优化商品标题、详情页、客服话术和促销文案。",
    color: "from-amber-500 to-orange-600",
    skills: [
      {
        slug: "product-copy",
        title: "AI 生成商品卖点和详情页文案",
        audience: "淘宝、拼多多、抖店、跨境卖家",
        outcome: "把产品参数变成更容易成交的标题、卖点和详情页结构。",
        tools: ["DeepSeek", "ChatGPT", "Claude"],
        difficulty: "入门",
        timeSaved: "1-2 小时",
        monetization: "高",
        steps: ["输入产品参数", "提炼目标用户痛点", "生成标题关键词", "生成详情页卖点", "改写成平台适合语气"],
        promptExample: "你是电商转化文案专家，请根据我的产品信息生成商品标题、5 个核心卖点、详情页结构和促销文案，语气真实可信。",
        relatedPack: "电商成交话术包",
        href: "/category/ai-ecommerce",
      },
      {
        slug: "customer-service",
        title: "AI 生成客服成交话术",
        audience: "电商客服、店主、售后团队",
        outcome: "快速生成售前咨询、价格异议、催单、差评回复和售后安抚话术。",
        tools: ["DeepSeek", "ChatGPT"],
        difficulty: "进阶",
        timeSaved: "每天 1 小时",
        monetization: "高",
        steps: ["整理常见客户问题", "分类售前/售后/投诉", "生成标准话术", "加入品牌语气", "沉淀成客服知识库"],
        promptExample: "请把以下客户问题整理成客服标准话术，要求语气礼貌、有成交引导、能处理异议，并给出不同情绪客户的回复版本。",
        relatedPack: "电商客服知识库",
        href: "/category/ai-customer-service",
      },
    ],
  },
  {
    slug: "office",
    title: "AI办公技能",
    description: "用 AI 完成周报、会议纪要、PPT、邮件和 SOP。",
    color: "from-blue-500 to-cyan-500",
    skills: [
      {
        slug: "weekly-report",
        title: "AI 写周报和工作总结",
        audience: "上班族、运营、项目经理、主管",
        outcome: "把零散工作记录整理成结构清楚、有成果感的周报。",
        tools: ["ChatGPT", "DeepSeek", "Claude"],
        difficulty: "入门",
        timeSaved: "20-30 分钟",
        monetization: "中",
        steps: ["输入本周工作事项", "按成果/问题/下周计划分类", "补充数据和影响", "润色成正式语气", "生成精简版和详细版"],
        promptExample: "请把我的本周工作记录整理成一份专业周报，包含完成事项、关键成果、遇到问题、下周计划和需要协助事项。",
        relatedPack: "AI 办公提效模板包",
        href: "/category/ai-office",
      },
      {
        slug: "ppt-outline",
        title: "AI 生成 PPT 大纲",
        audience: "职场汇报、销售、创业者",
        outcome: "生成可直接制作 PPT 的页结构、标题和每页重点。",
        tools: ["ChatGPT", "Gamma", "Claude"],
        difficulty: "进阶",
        timeSaved: "1-2 小时",
        monetization: "中",
        steps: ["输入汇报目标", "确定听众和场景", "生成 8-12 页结构", "补充每页要点", "生成演讲稿"],
        promptExample: "请根据我的主题生成一份 10 页 PPT 大纲，每页包含标题、核心观点、建议图表和演讲备注。",
        relatedPack: "PPT 汇报工作包",
        href: "/search?q=PPT",
      },
    ],
  },
  {
    slug: "automation",
    title: "AI自动化 / Agent 技能",
    description: "用 AI Agent 自动整理资料、生成内容、监控竞品和处理重复任务。",
    color: "from-violet-600 to-slate-900",
    skills: [
      {
        slug: "daily-content-agent",
        title: "每天自动生成内容选题",
        audience: "内容团队、自媒体、SEO 站长",
        outcome: "每天定时生成选题、标题和内容草稿，持续积累内容资产。",
        tools: ["Vercel Cron", "DeepSeek", "Supabase"],
        difficulty: "专业",
        timeSaved: "每天 1-2 小时",
        monetization: "高",
        steps: ["确定内容分类", "读取历史内容避免重复", "AI 生成新主题", "评分筛选", "保存草稿或发布"],
        promptExample: "你是内容增长 Agent，请根据已有分类和最近内容，生成 5 个不重复的新主题，并输出标题、描述、标签和质量评分。",
        relatedPack: "AI 自动内容系统",
        href: "/admin/logs",
      },
      {
        slug: "business-workflow",
        title: "AI 企业工作流搭建",
        audience: "中小企业老板、运营团队、客服团队",
        outcome: "把客服、内容、报表、资料整理等重复工作变成标准 AI 流程。",
        tools: ["Dify", "Coze", "n8n", "Supabase"],
        difficulty: "专业",
        timeSaved: "每周 5-10 小时",
        monetization: "高",
        steps: ["梳理重复任务", "定义输入和输出", "设计 Prompt 和知识库", "接入自动化工具", "记录日志和人工审核"],
        promptExample: "请帮我把以下公司流程拆成可自动化的 AI 工作流，输出触发条件、输入字段、AI 处理步骤、人工审核点和结果保存方式。",
        relatedPack: "企业 AI 工作流方案",
        href: "mailto:hello@agentzhan.com",
      },
    ],
  },
];

export const allSkills = skillBranches.flatMap((branch) =>
  branch.skills.map((skill) => ({ ...skill, branch: branch.title, branchSlug: branch.slug, color: branch.color })),
);
