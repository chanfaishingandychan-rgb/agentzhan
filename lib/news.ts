import { createServiceClient } from "@/lib/supabase/server";
import { XMLParser } from "fast-xml-parser";

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

type SupabaseAiNewsRow = {
  slug: string;
  title: string;
  source: string;
  source_url: string;
  published_at: string;
  category: AiNewsItem["category"];
  summary: string;
  takeaway: string;
  tags: string[] | null;
};

type FeedSource = {
  source: string;
  feedUrl: string;
  fallbackCategory: AiNewsItem["category"];
};

type FeedCandidate = {
  title: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  category: AiNewsItem["category"];
  description: string;
};

const officialFeedSources: FeedSource[] = [
  {
    source: "OpenAI",
    feedUrl: "https://openai.com/news/rss.xml",
    fallbackCategory: "产品功能",
  },
  {
    source: "Google DeepMind",
    feedUrl: "https://deepmind.google/blog/rss.xml",
    fallbackCategory: "模型更新",
  },
];

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
  trimValues: true,
});

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

export async function getLatestAiNewsForSite(limit = aiNewsItems.length): Promise<AiNewsItem[]> {
  const items: AiNewsItem[] = [];
  const client = createServiceClient();

  if (client) {
    try {
      const { data, error } = await client
        .from("ai_news")
        .select("slug,title,source,source_url,published_at,category,summary,takeaway,tags")
        .order("published_at", { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        items.push(...(data as SupabaseAiNewsRow[]).map(toAiNewsItem));
      }
    } catch {
      // Fall through to live official feeds and static fallback.
    }
  }

  const liveFeedItems = await getLatestOfficialAiNews(limit);
  items.push(...liveFeedItems);

  const merged = mergeAiNewsItems(items).slice(0, limit);
  if (merged.length > 0) return merged;

  return getLatestAiNews(limit);
}

function toAiNewsItem(item: SupabaseAiNewsRow): AiNewsItem {
  return {
    slug: item.slug,
    title: item.title,
    source: item.source,
    sourceUrl: item.source_url,
    publishedAt: item.published_at,
    category: item.category,
    summary: item.summary,
    takeaway: item.takeaway,
    tags: item.tags ?? [],
  };
}

async function getLatestOfficialAiNews(limit: number): Promise<AiNewsItem[]> {
  const candidates: FeedCandidate[] = [];

  for (const source of officialFeedSources) {
    try {
      candidates.push(...(await fetchFeedCandidates(source)));
    } catch {
      // A failed feed should not block the page or hide other sources.
    }
  }

  return dedupeCandidates(candidates)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, Math.max(limit, 8))
    .map(toFallbackAiNewsItem);
}

async function fetchFeedCandidates(source: FeedSource): Promise<FeedCandidate[]> {
  const response = await fetch(source.feedUrl, {
    headers: {
      accept: "application/rss+xml, application/xml, text/xml",
      "user-agent": "AgentZhanBot/1.0 (+https://agentzhan.com/news)",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`feed request failed with ${response.status}`);
  }

  const xml = await response.text();
  const parsed = xmlParser.parse(xml);
  const channel = parsed?.rss?.channel ?? parsed?.feed;
  const rawItems = toArray<Record<string, unknown>>(channel?.item ?? channel?.entry).slice(0, 12);

  return rawItems
    .map((item) => normalizeFeedItem(item, source))
    .filter((item): item is FeedCandidate => Boolean(item));
}

function normalizeFeedItem(item: Record<string, unknown>, source: FeedSource): FeedCandidate | null {
  const title = getText(item.title);
  const sourceUrl = getLink(item);
  const publishedAt = normalizeDate(getText(item.pubDate) || getText(item.published) || getText(item.updated));
  const description = stripHtml(getText(item.description) || getText(item.summary) || getText(item.encoded));

  if (!title || !sourceUrl || !publishedAt) return null;

  return {
    title,
    source: source.source,
    sourceUrl,
    publishedAt,
    category: inferCategory(title, description, source.fallbackCategory),
    description,
  };
}

function toFallbackAiNewsItem(item: FeedCandidate): AiNewsItem {
  return {
    slug: `news-${item.publishedAt.replaceAll("-", "")}-${slugify(item.title).slice(0, 80)}`,
    title: `${item.source}：${item.title}`,
    source: item.source,
    sourceUrl: item.sourceUrl,
    publishedAt: item.publishedAt,
    category: item.category,
    summary: item.description
      ? `官方发布「${item.title}」。${item.description}`
      : `官方发布「${item.title}」，建议关注它对模型能力、产品功能和实际工作流的影响。`,
    takeaway: getFallbackTakeaway(item),
    tags: buildTags(item),
  };
}

function getFallbackTakeaway(item: FeedCandidate) {
  if (item.category === "模型更新") {
    return "模型更新会直接影响写作、编程、搜索和自动化任务的效果，建议结合自己的高频场景重新测试提示词。";
  }
  if (item.category === "Agent趋势") {
    return "Agent 和连接器类更新说明 AI 正在从聊天工具走向可执行工作流，适合关注插件、权限和数据源整合。";
  }
  if (item.category === "安全与合规") {
    return "安全与合规动态适合企业和团队重点关注，上线 AI 工作流前需要明确数据、权限和人工复核边界。";
  }
  if (item.category === "行业应用") {
    return "行业应用类案例适合拆成具体工作流，评估它能否用于获客、内容、客服、研发或内部提效。";
  }
  return "产品功能更新要关注能否直接减少重复操作，或为现有 Prompt、插件和自动化流程带来新的入口。";
}

function buildTags(item: FeedCandidate) {
  const text = `${item.title} ${item.description}`;
  const tags = [item.source];
  for (const tag of ["GPT", "ChatGPT", "Gemini", "Agent", "模型", "安全", "API", "企业", "研究"]) {
    if (text.toLowerCase().includes(tag.toLowerCase())) tags.push(tag);
  }
  return [...new Set(tags)].slice(0, 4);
}

function mergeAiNewsItems(items: AiNewsItem[]) {
  const seen = new Set<string>();
  const result: AiNewsItem[] = [];
  for (const item of items) {
    const key = item.sourceUrl || item.slug;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

function inferCategory(title: string, description: string, fallback: AiNewsItem["category"]): AiNewsItem["category"] {
  const text = `${title} ${description}`.toLowerCase();
  if (/safety|security|policy|privacy|risk|biosecurity|合规|安全/.test(text)) return "安全与合规";
  if (/agent|connector|tool|workflow|plugin|插件|工作流/.test(text)) return "Agent趋势";
  if (/model|gpt|claude|gemini|deepseek|flash|omni|模型/.test(text)) return "模型更新";
  if (/business|enterprise|industry|customer|science|education|企业|行业|应用/.test(text)) return "行业应用";
  return fallback;
}

function dedupeCandidates(items: FeedCandidate[]) {
  const seen = new Set<string>();
  const result: FeedCandidate[] = [];
  for (const item of items) {
    const key = item.sourceUrl || `${item.source}:${item.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function getText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object" && "#text" in value) {
    return String((value as Record<string, unknown>)["#text"] ?? "").trim();
  }
  return "";
}

function getLink(item: Record<string, unknown>): string {
  const link = item.link;
  if (typeof link === "string") return link;
  if (Array.isArray(link)) {
    const href = link
      .map((entry) => (typeof entry === "object" && entry ? String((entry as Record<string, unknown>)["@_href"] ?? "") : ""))
      .find(Boolean);
    return href ?? "";
  }
  if (link && typeof link === "object") {
    return String((link as Record<string, unknown>)["@_href"] ?? "");
  }
  return "";
}

function normalizeDate(value: string) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(+date)) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500);
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}
