import { createServiceClient } from "@/lib/supabase/server";
import { summarizeAiNewsCandidates } from "@/lib/openai";
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

type LocalizedFeedCopy = {
  title: string;
  summary: string;
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

const localizedFeedCopy: Record<string, LocalizedFeedCopy> = {
  "how ai is expanding what people do at work": {
    title: "AI 正在扩展人们在工作中的能力边界",
    summary: "OpenAI 研究显示，AI 正在扩展员工可承担的任务范围，ChatGPT 用户开始跨岗位处理更多工作，并重新划分原有工作边界。",
  },
  "launching health in chatgpt": {
    title: "ChatGPT 推出健康相关功能",
    summary: "ChatGPT 健康功能可让符合条件的美国用户安全连接医疗记录和 Apple Health，用于获得更个性化的健康洞察。",
  },
  "building ai infrastructure with the effingham county community": {
    title: "OpenAI 与 Effingham County 社区共建 AI 基础设施",
    summary: "OpenAI 公布 Project Camellia，计划在美国乔治亚州 Effingham County 建设 AI 基础设施，并承诺兼顾能源、社区投入、就业和 Codex 使用机会。",
  },
  "how news organizations are using ai to advance their vital missions": {
    title: "新闻机构如何用 AI 推进核心使命",
    summary: "多家新闻机构正在用 OpenAI 工具增强报道、扩大受众并改善业务运营，说明 AI 正在进入更具体的媒体工作流。",
  },
  "advancing the next era of national science": {
    title: "OpenAI 推动国家科学进入 AI 加速时代",
    summary: "OpenAI 介绍与美国能源部及国家实验室合作，用前沿 AI 加速科学发现的计划。",
  },
  "introducing openai presence": {
    title: "OpenAI Presence 发布，面向企业 AI Agent 场景",
    summary: "OpenAI Presence 是面向企业的 AI Agent 平台，可帮助组织部署可信的语音和聊天 Agent，用于客服和内部流程。",
  },
  "ntt data group cuts incident analysis to 30 minutes with codex": {
    title: "NTT DATA Group 借助 Codex 将事件分析缩短到 30 分钟",
    summary: "NTT DATA Group 使用 ChatGPT Enterprise 和 Codex 协助 9000 名员工自动化工作，并将事件分析时间缩短到 30 分钟。",
  },
  "introducing the chatgpt for small business program": {
    title: "OpenAI 推出面向小企业的 ChatGPT 项目",
    summary: "OpenAI 推出面向小企业的 ChatGPT 项目，帮助创业者学习 AI、自动化工作，并配合 ChatGPT Work 推动业务增长。",
  },
  "openai and hugging face partner to address security incident during model evaluation": {
    title: "OpenAI 与 Hugging Face 合作处理模型评估安全事件",
    summary: "OpenAI 与 Hugging Face 分享模型评估期间安全事件的早期发现，重点包括高级网络能力和防御经验。",
  },
  "david vélez and robin vince join the boards of the openai foundation and openai group pbc": {
    title: "David Velez 与 Robin Vince 加入 OpenAI 董事会",
    summary: "David Velez 与 Robin Vince 加入 OpenAI Foundation 和 OpenAI Group PBC 董事会，为金融、科技和治理方向带来全球经验。",
  },
  "safety and alignment in an era of long-horizon models": {
    title: "长周期模型时代的安全与对齐问题",
    summary: "OpenAI 分享长时间运行 AI 模型部署经验，重点讨论新的安全风险、观察到的失败模式，以及通过迭代部署改进防护。",
  },
  "a scorecard for the ai age": {
    title: "OpenAI 提出 AI 时代的成效评分卡",
    summary: "OpenAI CFO Sarah Friar 介绍实用 AI 评分卡，用有效工作、单次成功任务成本、可靠性和算力回报来衡量 AI 投资回报。",
  },
  "why teens deserve access to safe ai": {
    title: "为什么青少年需要安全使用 AI 的机会",
    summary: "OpenAI 介绍如何通过适龄保护、学习工具、家长控制和专家合作，让青少年更安全地使用 ChatGPT。",
  },
  "how codex became a collaborator for openai's creative team": {
    title: "Codex 如何成为 OpenAI 创意团队的协作助手",
    summary: "OpenAI 创意团队使用 Codex 构建定制创意工具、加快构思过程，并通过理解上下文的 AI 更快完成原型。",
  },
  "how cars24 scales conversations and builds faster with openai": {
    title: "Cars24 如何用 OpenAI 扩大对话处理并加快构建速度",
    summary: "Cars24 使用 OpenAI 驱动的语音和聊天 Agent 处理每月超过 100 万分钟对话，追回 12% 流失线索，并把 Agent 工作流带入更多团队。",
  },
  "accelerating the frontiers of scientific discovery: google's $40m commitment to the genesis mission": {
    title: "Google 投入 4000 万美元支持 Genesis Mission，加速科学发现",
    summary: "Google 承诺提供 4000 万美元的 AI token 和 credits 支持 Genesis Mission，推动科学发现前沿。",
  },
  "introducing gemini 3.6 flash, 3.5 flash-lite, and 3.5 flash cyber": {
    title: "Gemini 3.6 Flash、3.5 Flash-Lite 与 3.5 Flash Cyber 发布",
    summary: "Google DeepMind 推出 Gemini 3.6 Flash、3.5 Flash-Lite 和 3.5 Flash Cyber 等新模型。",
  },
  "introducing gemini 3.5 flash cyber": {
    title: "Gemini 3.5 Flash Cyber 发布，面向网络安全任务",
    summary: "Google 推出 Gemini 3.5 Flash Cyber，这是一款轻量级网络安全模型，可用于发现并修补漏洞。",
  },
  "our approach to bioresilience": {
    title: "Google DeepMind 分享生物韧性方向的 AI 做法",
    summary: "Google DeepMind 与 Isomorphic Labs 分享在生物韧性和 AI 模型方面的联合做法。",
  },
  "empowering india's next generation of innovators with atl saathi": {
    title: "ATL Saathi 用 Gemini 支持印度下一代创新者",
    summary: "Google 与 AIM 推出由 Gemini 驱动的 ATL Saathi，帮助印度教育工作者开展机器人实验室教学。",
  },
  "google deepmind and a24 announce first-of-its-kind research partnership": {
    title: "Google DeepMind 与 A24 宣布首创研究合作",
    summary: "Google DeepMind 与 A24 宣布一项首创研究合作，显示生成式 AI 与影视创作、研究探索之间的连接正在加深。",
  },
  "start building with nano banana 2 lite and gemini omni flash": {
    title: "开发者可开始使用 Nano Banana 2 Lite 与 Gemini Omni Flash 构建应用",
    summary: "Google DeepMind 开放 Nano Banana 2 Lite 和 Gemini Omni Flash 相关能力，开发者可以开始围绕这些模型构建应用。",
  },
  "introducing computer use in gemini 3.5 flash": {
    title: "Gemini 3.5 Flash 新增计算机使用能力",
    summary: "Google DeepMind 为 Gemini 3.5 Flash 引入计算机使用能力，说明模型正在向更强的任务执行和工作流控制发展。",
  },
  "unlocking uk house-building with ai-accelerated planning": {
    title: "英国住房建设尝试用 AI 加速规划审批",
    summary: "英国政府与 Google DeepMind 合作开发 AI 原型，目标是加快住房规划决策流程。",
  },
  "securing the future of ai agents": {
    title: "Google DeepMind 讨论 AI Agent 的未来安全",
    summary: "Google DeepMind 介绍 AI Control Roadmap，用传统防护和实时监控结合保障 AI Agent 安全。",
  },
  "diffusiongemma: 4x faster text generation": {
    title: "DiffusionGemma 文本生成速度提升至 4 倍",
    summary: "Google DeepMind 介绍 DiffusionGemma，重点是以更快速度进行文本生成，适合关注模型效率和部署成本的用户。",
  },
  "investing in multi-agent ai safety research": {
    title: "Google DeepMind 投资多 Agent AI 安全研究",
    summary: "Google DeepMind 与合作伙伴宣布 1000 万美元多 Agent 安全研究资助计划。",
  },
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

  const selected = dedupeCandidates(candidates)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, Math.max(limit, 8));

  if (selected.length === 0) return [];

  const summarizedItems = await summarizeOfficialAiNews(selected);

  return selected.map((candidate) => summarizedItems.get(candidate.sourceUrl) ?? toFallbackAiNewsItem(candidate));
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
  const title = localizeTitle(item);

  return {
    slug: `news-${item.publishedAt.replaceAll("-", "")}-${slugify(item.title).slice(0, 80)}`,
    title,
    source: item.source,
    sourceUrl: item.sourceUrl,
    publishedAt: item.publishedAt,
    category: item.category,
    summary: localizeSummary(item, title),
    takeaway: getFallbackTakeaway(item),
    tags: buildTags(item),
  };
}

async function summarizeOfficialAiNews(candidates: FeedCandidate[]): Promise<Map<string, AiNewsItem>> {
  const result = new Map<string, AiNewsItem>();

  try {
    const summarized = await summarizeAiNewsCandidates(candidates);
    for (const item of summarized.items) {
      if (!isLocalizedText(item.title) || !isLocalizedText(item.summary)) continue;
      result.set(item.sourceUrl, {
        slug: item.slug,
        title: item.title,
        source: item.source,
        sourceUrl: item.sourceUrl,
        publishedAt: item.publishedAt,
        category: item.category,
        summary: item.summary,
        takeaway: item.takeaway,
        tags: item.tags,
      });
    }
  } catch {
    // Localized static fallback below keeps the public page usable.
  }

  return result;
}

function localizeTitle(item: FeedCandidate) {
  const copy = localizedFeedCopy[getLookupKey(item.title)];
  if (copy) return withSourcePrefix(item.source, copy.title);

  const title = item.title.trim();
  const introduced = title.match(/^introducing\s+(?:the\s+)?(.+)$/i);
  if (introduced) return withSourcePrefix(item.source, `发布 ${localizeProductName(introduced[1])}`);

  const launched = title.match(/^launching\s+(?:the\s+)?(.+)$/i);
  if (launched) return withSourcePrefix(item.source, `推出 ${localizeProductName(launched[1])}`);

  const building = title.match(/^building\s+(.+)$/i);
  if (building) return withSourcePrefix(item.source, `建设 ${localizeProductName(building[1])}`);

  const securing = title.match(/^securing\s+(.+)$/i);
  if (securing) return withSourcePrefix(item.source, `保障 ${localizeProductName(securing[1])}`);

  const product = getPrimaryProduct(title);
  if (product) return withSourcePrefix(item.source, `发布 ${product} 相关更新`);

  return withSourcePrefix(item.source, `${getCategorySubject(item.category)}最新动态`);
}

function localizeSummary(item: FeedCandidate, localizedTitle: string) {
  const copy = localizedFeedCopy[getLookupKey(item.title)];
  if (copy) return copy.summary;

  const readableTitle = localizedTitle.replace(`${item.source}：`, "");
  return `官方消息显示，${item.source}发布「${readableTitle}」。这项更新属于「${item.category}」，建议关注它对模型能力、产品功能、工作流效率或企业应用的影响。`;
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

function withSourcePrefix(source: string, title: string) {
  if (title.startsWith(source)) return title;
  return `${source}：${title}`;
}

function localizeProductName(value: string) {
  return value
    .trim()
    .replace(/\bAI\b/g, "AI")
    .replace(/\bagents?\b/gi, "AI Agent")
    .replace(/\bagentic workflows?\b/gi, "Agent 工作流")
    .replace(/\bcomputer use\b/gi, "计算机使用能力")
    .replace(/\bsmall business\b/gi, "小企业")
    .replace(/\bhealth\b/gi, "健康功能")
    .replace(/\binfrastructure\b/gi, "基础设施")
    .replace(/\bsafety\b/gi, "安全")
    .replace(/\bsecurity\b/gi, "安全")
    .replace(/\bresearch\b/gi, "研究")
    .replace(/\bprogram\b/gi, "项目")
    .replace(/\bpartnership\b/gi, "合作");
}

function getPrimaryProduct(title: string) {
  return title.match(/\b(ChatGPT(?:\sWork)?|Codex|OpenAI Presence|Gemini[\w\s.-]*|Gemma[\w\s.-]*|GPT-[\w.-]+|Deep Think)\b/)?.[0]?.trim();
}

function getCategorySubject(category: AiNewsItem["category"]) {
  if (category === "模型更新") return "AI 模型";
  if (category === "Agent趋势") return "AI Agent";
  if (category === "安全与合规") return "AI 安全";
  if (category === "行业应用") return "AI 行业应用";
  return "AI 产品";
}

function getLookupKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, " ");
}

function isLocalizedText(value: string) {
  return /[\u4e00-\u9fff]/.test(value) && !/[a-z]{3,}(?:\s+[a-z]{2,}){4,}/i.test(value);
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
