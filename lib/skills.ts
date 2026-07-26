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
    slug: "productivity",
    title: "效率办公插件",
    description: "让 Agent 连接文档、邮箱、日程和知识库，自动处理重复办公任务。",
    color: "from-blue-500 to-cyan-500",
    skills: [
      {
        slug: "notion-agent-plugin",
        title: "Notion 知识库插件",
        audience: "个人知识管理者、内容团队、项目团队",
        outcome: "让 AI Agent 读取、整理和更新 Notion 页面，把资料沉淀成可搜索知识库。",
        tools: ["Notion", "AI Agent", "API"],
        difficulty: "进阶",
        timeSaved: "每周 2-5 小时",
        monetization: "中",
        steps: ["授权 Notion 工作区", "选择可访问页面", "设定整理规则", "让 Agent 自动归档资料", "定期生成知识库摘要"],
        promptExample: "适合用于自动整理会议记录、客户需求、选题库、项目资料和 SOP 文档。",
        relatedPack: "Notion 知识库插件方案",
        href: "/skills/notion-agent-plugin",
      },
      {
        slug: "gmail-agent-plugin",
        title: "Gmail 邮件助手插件",
        audience: "销售、客服、自由职业者、企业管理者",
        outcome: "让 Agent 辅助分类邮件、提取待办、生成回复草稿和跟进提醒。",
        tools: ["Gmail", "Google Calendar", "AI Agent"],
        difficulty: "进阶",
        timeSaved: "每天 30-60 分钟",
        monetization: "中",
        steps: ["连接 Gmail", "设定邮件分类规则", "识别重要客户和待办", "生成回复草稿", "同步跟进提醒"],
        promptExample: "适合用于客户跟进、报价回复、会议安排、投诉处理和销售线索整理。",
        relatedPack: "邮件自动化插件方案",
        href: "/skills/gmail-agent-plugin",
      },
    ],
  },
  {
    slug: "development",
    title: "开发部署插件",
    description: "让 Agent 连接代码仓库、数据库和部署平台，帮你完成开发与上线流程。",
    color: "from-violet-600 to-slate-900",
    skills: [
      {
        slug: "github-agent-plugin",
        title: "GitHub 代码仓库插件",
        audience: "开发者、独立站长、AI 创业者",
        outcome: "让 Agent 读取代码、创建分支、提交修改、追踪 Issue，并协助生成 PR。",
        tools: ["GitHub", "Codex", "Cursor"],
        difficulty: "专业",
        timeSaved: "每周 3-8 小时",
        monetization: "高",
        steps: ["连接 GitHub 账号", "授权目标仓库", "让 Agent 分析项目结构", "执行代码修改", "提交 commit 或 PR"],
        promptExample: "适合用于网站改版、Bug 修复、功能迭代、文档更新和自动化维护。",
        relatedPack: "GitHub Agent 开发插件",
        href: "/skills/github-agent-plugin",
      },
      {
        slug: "vercel-deploy-plugin",
        title: "Vercel 自动部署插件",
        audience: "网站站长、SaaS 创业者、前端开发者",
        outcome: "让 Agent 连接 Vercel 项目，查看部署状态、分析构建错误和协助上线。",
        tools: ["Vercel", "Next.js", "GitHub"],
        difficulty: "进阶",
        timeSaved: "每次部署 20-60 分钟",
        monetization: "高",
        steps: ["连接 Vercel 项目", "读取部署日志", "定位构建错误", "修复代码后推送", "确认生产环境状态"],
        promptExample: "适合用于 Next.js 网站上线、域名绑定、构建失败排查和自动部署流程。",
        relatedPack: "Vercel 部署插件方案",
        href: "/skills/vercel-deploy-plugin",
      },
      {
        slug: "supabase-database-plugin",
        title: "Supabase 数据库插件",
        audience: "独立开发者、AI 工具站、会员系统项目",
        outcome: "让 Agent 协助设计数据库表、执行 SQL、查看日志和管理潜在客户资料。",
        tools: ["Supabase", "Postgres", "AI Agent"],
        difficulty: "专业",
        timeSaved: "每周 2-6 小时",
        monetization: "高",
        steps: ["连接 Supabase 项目", "设计数据表结构", "执行 SQL 迁移", "检查 API 权限", "查看数据和日志"],
        promptExample: "适合用于会员系统、收藏功能、线索表单、自动生成内容和后台管理。",
        relatedPack: "Supabase 数据库插件方案",
        href: "/skills/supabase-database-plugin",
      },
    ],
  },
  {
    slug: "marketing",
    title: "营销增长插件",
    description: "让 Agent 连接表单、客户资料和内容平台，帮助网站更快获得线索。",
    color: "from-rose-500 to-violet-600",
    skills: [
      {
        slug: "lead-capture-plugin",
        title: "潜在客户收集插件",
        audience: "AI 工具站、课程卖家、企业服务团队",
        outcome: "在网站中收集邮箱、需求和感兴趣产品，为后续销售和付费转化做准备。",
        tools: ["Supabase", "表单", "邮件系统"],
        difficulty: "入门",
        timeSaved: "持续收集线索",
        monetization: "高",
        steps: ["设计领取入口", "收集邮箱和兴趣标签", "保存到数据库", "后台查看客户", "后续发送产品或服务邀请"],
        promptExample: "适合用于免费资料领取、等待名单、课程预售、企业咨询和工具推荐转化。",
        relatedPack: "线索收集插件方案",
        href: "/skills/lead-capture-plugin",
      },
      {
        slug: "seo-content-plugin",
        title: "SEO 内容增长插件",
        audience: "站长、内容团队、AI 网站运营者",
        outcome: "让 Agent 定期生成主题建议、草稿、标签和 SEO 描述，帮助网站持续扩充页面。",
        tools: ["Vercel Cron", "OpenAI", "Supabase"],
        difficulty: "专业",
        timeSaved: "每天 1-2 小时",
        monetization: "高",
        steps: ["读取已有内容", "分析缺少主题", "生成新内容草稿", "质量评分和去重", "保存为草稿或发布"],
        promptExample: "适合用于 AI 工具站、行业知识库、模板站和长期 SEO 内容增长。",
        relatedPack: "SEO 自动内容插件方案",
        href: "/skills/seo-content-plugin",
      },
    ],
  },
  {
    slug: "business",
    title: "企业流程插件",
    description: "把客服、销售、报表、资料整理等工作接入 Agent，形成可交付的企业 AI 工作流。",
    color: "from-amber-500 to-orange-600",
    skills: [
      {
        slug: "customer-service-plugin",
        title: "AI 客服知识库插件",
        audience: "电商卖家、SaaS 团队、企业客服",
        outcome: "让 Agent 读取产品资料和常见问题，辅助客服回复、售后处理和知识库更新。",
        tools: ["知识库", "客服系统", "AI Agent"],
        difficulty: "进阶",
        timeSaved: "每天 1-3 小时",
        monetization: "高",
        steps: ["整理产品资料", "建立 FAQ 知识库", "设定回复边界", "生成客服草稿", "人工审核后发送"],
        promptExample: "适合用于售前咨询、价格异议、售后安抚、投诉处理和客服培训。",
        relatedPack: "客服知识库插件方案",
        href: "/skills/customer-service-plugin",
      },
    ],
  },
];

export const allSkills = skillBranches.flatMap((branch) =>
  branch.skills.map((skill) => ({ ...skill, branch: branch.title, branchSlug: branch.slug, color: branch.color })),
);

export function getSkillBySlug(slug: string) {
  return allSkills.find((skill) => skill.slug === slug);
}
