import { getAllPrompts, type PromptItem } from "@/lib/prompts";

export type PromptCollection = {
  title: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  targetUsers: string[];
  useCases: string[];
  relatedCategories: string[];
  relatedModels: string[];
  recommendedPromptSlugs: string[];
  guide: string[];
  faq: { question: string; answer: string }[];
  monetizationHint: string;
};

export const collections: PromptCollection[] = [
  {
    title: "AI办公效率 Prompt 合集",
    slug: "ai-office-productivity",
    description: "把会议纪要、周报、邮件、PPT 大纲和流程文档变成可复制的 AI 办公方案。",
    seoTitle: "AI办公效率 Prompt 合集 - 周报、会议纪要、邮件与PPT提示词",
    seoDescription: "精选 AI 办公效率 Prompt，覆盖周报、会议纪要、邮件、PPT、SOP 和表格分析，适合职场人直接复制使用。",
    targetUsers: ["上班族", "团队主管", "行政与运营", "中小企业老板"],
    useCases: ["会议纪要整理", "工作周报生成", "邮件润色", "PPT 大纲", "SOP 文档"],
    relatedCategories: ["ai-office", "ai-efficiency-tools", "ai-personal-assistant"],
    relatedModels: ["ChatGPT", "Claude", "DeepSeek"],
    recommendedPromptSlugs: ["ai-office-01", "ai-office-02", "ai-office-03", "ai-office-04", "ai-office-05", "ai-efficiency-tools-01"],
    guide: [
      "先把任务背景、目标读者和输出格式写清楚，再复制 Prompt 给 AI。",
      "如果是会议纪要或周报，建议补充原始记录、项目进度和需要强调的风险。",
      "第一次输出后，让 AI 按你的公司口吻进行二次润色，结果会更像真实工作文档。",
    ],
    faq: [
      {
        question: "这些 Prompt 可以直接用于公司工作吗？",
        answer: "可以。建议先删除敏感信息，再把会议记录、项目背景或任务要求填入 Prompt 中。",
      },
      {
        question: "适合哪个 AI 模型？",
        answer: "ChatGPT、Claude、DeepSeek 都适合。长文档整理可以优先使用上下文能力较强的模型。",
      },
    ],
    monetizationHint: "后续可扩展为职场 AI 办公模板包、企业内训课和团队工作流服务。",
  },
  {
    title: "小红书文案 Prompt 合集",
    slug: "xiaohongshu-copywriting",
    description: "覆盖爆款标题、种草笔记、探店内容、产品卖点和账号选题的小红书创作 Prompt。",
    seoTitle: "小红书文案 Prompt 合集 - 爆款标题、种草笔记与选题提示词",
    seoDescription: "收录适合小红书创作者、品牌运营和电商卖家的文案 Prompt，帮助快速生成爆款标题、笔记结构和种草内容。",
    targetUsers: ["自媒体创作者", "品牌运营", "电商卖家", "探店博主"],
    useCases: ["爆款标题", "种草笔记", "产品卖点", "探店脚本", "账号选题"],
    relatedCategories: ["ai-writing", "ai-marketing", "ai-short-video"],
    relatedModels: ["ChatGPT", "Claude", "DeepSeek"],
    recommendedPromptSlugs: ["ai-writing-01", "ai-writing-02", "ai-writing-03", "ai-marketing-01", "ai-short-video-01", "ai-short-video-02"],
    guide: [
      "先确定账号定位、人群画像和产品卖点，不要只让 AI 写一段泛泛文案。",
      "要求 AI 输出多个标题版本，并标注每个标题的吸引点。",
      "发布前要人工检查真实体验、功效表述和平台合规风险。",
    ],
    faq: [
      {
        question: "AI 写的小红书文案会不会太像广告？",
        answer: "会，所以要加入真实体验、使用前后变化和细节场景，避免只有卖点堆叠。",
      },
      {
        question: "适合新手账号使用吗？",
        answer: "适合。新手可以先用 Prompt 做选题和结构，再根据自己的经历补充真实内容。",
      },
    ],
    monetizationHint: "后续可做小红书账号起号课、行业文案包和品牌内容代运营服务。",
  },
  {
    title: "抖音短视频 Prompt 合集",
    slug: "douyin-short-video",
    description: "从选题、开头 3 秒、分镜脚本到直播话术，帮助短视频创作者快速出内容。",
    seoTitle: "抖音短视频 Prompt 合集 - 脚本、分镜、标题与直播话术",
    seoDescription: "精选抖音短视频 Prompt，覆盖选题、脚本、分镜、标题、直播话术和复盘优化，适合短视频运营直接使用。",
    targetUsers: ["短视频创作者", "本地商家", "直播运营", "自媒体团队"],
    useCases: ["短视频脚本", "开头钩子", "分镜设计", "直播话术", "内容复盘"],
    relatedCategories: ["ai-short-video", "ai-marketing", "ai-ecommerce"],
    relatedModels: ["ChatGPT", "DeepSeek", "Claude"],
    recommendedPromptSlugs: ["ai-short-video-01", "ai-short-video-02", "ai-short-video-03", "ai-short-video-04", "ai-marketing-02", "ai-ecommerce-01"],
    guide: [
      "输入行业、产品、目标用户和视频时长，让 AI 按秒拆分镜。",
      "要求输出至少 5 个开头钩子，选择最容易让用户停留的版本。",
      "拍摄后把数据反馈给 AI，让它分析完播率、点击率和互动点。",
    ],
    faq: [
      {
        question: "Prompt 能直接生成爆款视频吗？",
        answer: "不能保证爆款，但可以显著提升选题、脚本和复盘效率，减少从零开始的时间。",
      },
      {
        question: "适合本地商家吗？",
        answer: "适合。餐饮、美业、教育和门店服务都可以用它生成探店、活动和转化脚本。",
      },
    ],
    monetizationHint: "后续可变成短视频脚本会员库、行业脚本包和直播间话术工具。",
  },
  {
    title: "AI电商运营 Prompt 合集",
    slug: "ecommerce-operations",
    description: "面向淘宝、天猫、拼多多、跨境和独立站卖家的标题、详情页、客服与活动 Prompt。",
    seoTitle: "AI电商运营 Prompt 合集 - 商品标题、详情页、客服与活动提示词",
    seoDescription: "适合电商卖家的 AI Prompt 合集，覆盖商品标题优化、详情页文案、客服话术、促销活动和数据分析。",
    targetUsers: ["电商卖家", "跨境运营", "客服主管", "品牌店铺负责人"],
    useCases: ["商品标题优化", "详情页卖点", "客服回复", "活动策划", "复购运营"],
    relatedCategories: ["ai-ecommerce", "ai-customer-service", "ai-marketing"],
    relatedModels: ["ChatGPT", "Claude", "DeepSeek"],
    recommendedPromptSlugs: ["ai-ecommerce-01", "ai-ecommerce-02", "ai-ecommerce-03", "ai-ecommerce-04", "ai-customer-service-01", "ai-marketing-03"],
    guide: [
      "把产品参数、目标人群、价格区间和竞品信息补充完整。",
      "让 AI 分别输出平台搜索标题、详情页卖点和客服口径，不要混在一个结果里。",
      "重要页面上线前需要人工检查平台规则、禁用词和真实承诺。",
    ],
    faq: [
      {
        question: "可以用于跨境电商吗？",
        answer: "可以，但跨境场景建议再加入目标国家、语言、物流承诺和平台规则。",
      },
      {
        question: "客服 Prompt 会不会回答过度承诺？",
        answer: "有可能，所以需要在 Prompt 中明确售后边界、退款规则和不能承诺的内容。",
      },
    ],
    monetizationHint: "后续可做电商运营工具包、客服知识库模板和店铺诊断服务。",
  },
  {
    title: "Cursor / Codex 编程 Prompt 合集",
    slug: "cursor-codex-coding",
    description: "帮助开发者用 AI 写代码、修 Bug、重构组件、生成测试和整理技术方案。",
    seoTitle: "Cursor Codex 编程 Prompt 合集 - 写代码、修Bug、重构与测试提示词",
    seoDescription: "精选 Cursor、Codex、ChatGPT 编程 Prompt，覆盖需求拆解、代码生成、Bug 修复、重构、测试和代码审查。",
    targetUsers: ["开发者", "独立产品人", "技术负责人", "AI 编程新手"],
    useCases: ["需求拆解", "代码生成", "Bug 修复", "组件重构", "测试用例", "代码审查"],
    relatedCategories: ["ai-efficiency-tools", "ai-office", "ai-learning"],
    relatedModels: ["Cursor", "Codex", "ChatGPT", "Claude"],
    recommendedPromptSlugs: ["ai-efficiency-tools-01", "ai-efficiency-tools-02", "ai-efficiency-tools-03", "ai-learning-01", "ai-office-06", "ai-writing-04"],
    guide: [
      "把目标、当前代码、错误日志和限制条件一起交给 AI，避免只说“帮我修”。",
      "要求 AI 先列修改计划，再分文件改动，最后说明如何测试。",
      "涉及数据库、权限和支付逻辑时，一定要人工复核安全风险。",
    ],
    faq: [
      {
        question: "Cursor 和 Codex Prompt 有什么区别？",
        answer: "Cursor 更适合在 IDE 内改代码，Codex 更适合完整任务推进、代码审查和多步骤工程处理。",
      },
      {
        question: "非程序员可以用吗？",
        answer: "可以用于生成小工具和网页原型，但上线前建议让开发者检查安全、性能和边界情况。",
      },
    ],
    monetizationHint: "后续可做 AI 编程训练营、代码模板库和中小企业自动化开发服务。",
  },
];

export function getAllCollections() {
  return collections;
}

export function getCollectionBySlug(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getCollectionPrompts(collection: PromptCollection, limit = 8): PromptItem[] {
  const all = getAllPrompts();
  const bySlug = collection.recommendedPromptSlugs
    .map((slug) => all.find((prompt) => prompt.slug === slug))
    .filter((prompt): prompt is PromptItem => Boolean(prompt));

  if (bySlug.length >= limit) return bySlug.slice(0, limit);

  const fallback = all.filter(
    (prompt) =>
      !bySlug.some((item) => item.slug === prompt.slug) &&
      collection.relatedCategories.includes(prompt.category.slug),
  );

  return [...bySlug, ...fallback].slice(0, limit);
}
