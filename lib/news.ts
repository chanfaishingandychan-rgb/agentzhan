export type AiNewsItem = {
  slug: string;
  title: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  category: "模型更新" | "产品功能" | "Agent趋势" | "行业应用" | "安全与合规";
  summary: string;
  takeaway: string;
  tags: string[];
};

export const aiNewsItems: AiNewsItem[] = [
  {
    slug: "claude-opus-5-launch",
    title: "Claude Opus 5 发布，强调长任务 Agent、编程和专业工作",
    source: "Anthropic",
    sourceUrl: "https://www.anthropic.com/news/claude-opus-5",
    publishedAt: "2026-07-24",
    category: "模型更新",
    summary: "Anthropic 发布 Claude Opus 5，定位为面向长时间、多步骤 Agent 工作的高能力模型，并强调在编程、知识工作和专业任务上的表现。",
    takeaway: "如果你做代码、分析、文档和复杂工作流，模型选择会越来越影响成本和成功率。Agent站后续会把这类模型更新转化成可执行的使用建议。",
    tags: ["Claude", "Agent", "编程", "专业工作"],
  },
  {
    slug: "openai-health-in-chatgpt",
    title: "OpenAI 推出 ChatGPT 健康相关能力更新",
    source: "OpenAI",
    sourceUrl: "https://openai.com/news/product-releases/",
    publishedAt: "2026-07-23",
    category: "产品功能",
    summary: "OpenAI 新闻页显示，ChatGPT 健康相关能力在 2026 年 7 月 23 日推出新更新，说明 AI 正在进入更细分、更高信任要求的使用场景。",
    takeaway: "健康、教育、金融这类场景不能只靠随便问 AI，需要更清楚的边界、来源核对和提示词结构。",
    tags: ["ChatGPT", "健康", "产品更新", "可信AI"],
  },
  {
    slug: "anthropic-economic-index-connector",
    title: "Claude 新增 Anthropic Economic Index 连接器",
    source: "Anthropic",
    sourceUrl: "https://www.anthropic.com/news/anthropic-economic-index-connector",
    publishedAt: "2026-07-22",
    category: "Agent趋势",
    summary: "Anthropic 推出 Economic Index 连接器，让用户可以在 Claude 中直接查询 AI 在经济和职业中的使用数据。",
    takeaway: "这正是 Agent 插件的方向：模型不只是聊天，而是连接数据源，回答更具体、更可信的问题。",
    tags: ["Claude", "Connector", "数据", "职业趋势"],
  },
  {
    slug: "openai-presence",
    title: "OpenAI Presence 亮相，AI 产品继续向实时协作靠近",
    source: "OpenAI",
    sourceUrl: "https://openai.com/news/product-releases/",
    publishedAt: "2026-07-22",
    category: "产品功能",
    summary: "OpenAI 产品新闻页列出 OpenAI Presence，显示 AI 产品正在从单人对话走向更强的上下文感知和协作体验。",
    takeaway: "未来网站和工具不会只是“输入框 + 回答”，而会越来越像有人在旁边协助你完成整个流程。",
    tags: ["OpenAI", "协作", "产品", "工作流"],
  },
  {
    slug: "chatgpt-small-business-program",
    title: "OpenAI 推出 ChatGPT 小企业项目",
    source: "OpenAI",
    sourceUrl: "https://openai.com/news/ai-adoption/",
    publishedAt: "2026-07-21",
    category: "行业应用",
    summary: "OpenAI AI Adoption 新闻页显示，ChatGPT for small business program 于 2026 年 7 月 21 日推出，面向小企业 AI 应用落地。",
    takeaway: "这说明小老板、个体创业者和中小企业会是 AI 工具的重要用户。Agent站可以围绕这些人做插件、提示词和服务方案。",
    tags: ["ChatGPT", "小企业", "AI落地", "变现"],
  },
  {
    slug: "gemini-flash-cyber",
    title: "Google DeepMind 展示 Gemini 3.5 Flash Cyber 等最新研究动态",
    source: "Google DeepMind",
    sourceUrl: "https://deepmind.google/blog/",
    publishedAt: "2026-07-01",
    category: "安全与合规",
    summary: "Google DeepMind 新闻页在 2026 年 7 月展示 Gemini 3.5 Flash Cyber 等 AI 模型与安全方向动态。",
    takeaway: "AI 安全、企业合规和专业场景会越来越重要。未来插件介绍不能只讲功能，也要讲权限、数据和风险。",
    tags: ["Gemini", "DeepMind", "安全", "企业AI"],
  },
];

export function getLatestAiNews(limit = aiNewsItems.length) {
  return [...aiNewsItems]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, limit);
}
