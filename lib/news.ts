import { createServiceClient } from "@/lib/supabase/server";
import { summarizeAiNewsCandidates } from "@/lib/openai";
import { XMLParser } from "fast-xml-parser";

export type AiNewsItem = {
  slug: string;
  rawTitle?: string;
  title: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  category: "模型更新" | "产品功能" | "Agent趋势" | "行业应用" | "安全与合规";
  summary: string;
  takeaway: string;
  tags: string[];
};

export type AiNewsArticle = {
  item: AiNewsItem;
  deck: string;
  sections: Array<{
    title: string;
    paragraphs: string[];
  }>;
  actionItems: string[];
  watchPoints: string[];
  relatedQueries: string[];
};

type SupabaseAiNewsRow = {
  slug: string;
  raw_title?: string | null;
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

const aiNewsSelectFields = "slug,raw_title,title,source,source_url,published_at,category,summary,takeaway,tags";

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
  {
    source: "通义千问",
    feedUrl: "https://qwenlm.github.io/blog/index.xml",
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
  "health in chatgpt": {
    title: "ChatGPT 健康功能更新",
    summary: "OpenAI 介绍 ChatGPT 健康相关能力更新，强调在医疗和个人健康场景中需要更清楚的安全边界、资料来源和使用限制。",
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
    slug: "deepseek-v4-model-switch-july-24",
    title: "DeepSeek 7 月 24 日完成 V4 模型入口切换",
    source: "DeepSeek",
    sourceUrl: "https://api-docs.deepseek.com/zh-cn/updates/",
    publishedAt: "2026-07-24",
    category: "产品功能",
    summary: "DeepSeek 官方更新日志显示，V4-Pro 和 V4-Flash 已成为 API 入口；旧的 deepseek-chat 与 deepseek-reasoner 在 2026 年 7 月 24 日停止使用。",
    takeaway: "如果你的网站、插件或 Codex 接入还在用旧模型名，需要尽快检查模型参数和调用成本，避免接口切换影响服务。",
    tags: ["DeepSeek", "中国AI", "API", "模型切换"],
  },
  {
    slug: "china-ai-models-waic-2026",
    title: "WAIC 2026 后，中国大模型从 DeepSeek 走向群星竞争",
    source: "中国新闻网",
    sourceUrl: "https://www.chinanews.com.cn/cj/2026/07-20/10663137.shtml",
    publishedAt: "2026-07-20",
    category: "行业应用",
    summary: "中国新闻网报道，2026 世界人工智能大会期间，阿里千问、百度、腾讯、MiniMax、阶跃星辰等企业集中展示 AI 新品，中国开源大模型全球累计下载量已突破 100 亿次。",
    takeaway: "中国 AI 不再只看单一爆款模型，而是进入模型、应用、开源生态和行业落地同时竞争的阶段，普通用户可以更主动比较国产工具的实际效果。",
    tags: ["中国AI", "WAIC", "开源模型", "行业趋势"],
  },
  {
    slug: "kimi-k3-release",
    title: "Kimi K3 发布，月之暗面把中国开源模型推向 2.8T",
    source: "月之暗面",
    sourceUrl: "https://www.moonshot.cn/",
    publishedAt: "2026-07-16",
    category: "模型更新",
    summary: "月之暗面官网显示，Kimi K3 于 2026 年 7 月 16 日发布，定位为新一代旗舰模型，具备 2.8 万亿参数、原生多模态和百万 token 上下文。",
    takeaway: "这说明中国模型不只是便宜替代，而是在开源权重、长上下文和 Agent 编程场景上主动冲击全球开发者生态。",
    tags: ["Kimi", "月之暗面", "中国AI", "开源模型"],
  },
  {
    slug: "kimi-k3-api-platform",
    title: "Kimi API 平台上线 K3，主打 1M 上下文和软件工程任务",
    source: "Kimi",
    sourceUrl: "https://platform.moonshot.cn/",
    publishedAt: "2026-07-16",
    category: "Agent趋势",
    summary: "Kimi API 平台将 K3 列为最新模型，强调 1M tokens 上下文，面向软件工程、知识工作和深度推理，并公布缓存命中、输入和输出价格。",
    takeaway: "对站长和开发者来说，K3 值得观察 API 成本、长文处理、代码 Agent 和多工具调用场景。",
    tags: ["Kimi", "API", "中国AI", "长上下文"],
  },
  {
    slug: "tencent-hunyuan-3-yuanbao-agent",
    title: "腾讯发布混元 3 正式版，元宝接入并上线免费 Agent 功能",
    source: "财新",
    sourceUrl: "https://companies.caixin.com/m/2026-07-06/102461428.html",
    publishedAt: "2026-07-06",
    category: "Agent趋势",
    summary: "财新报道，腾讯在 7 月 6 日发布混元 3 正式版，较预览版继续提升后训练、数据质量和 Agent 能力，并由元宝接入相关能力。",
    takeaway: "这类更新说明国内 AI 助手正在从聊天入口走向可执行 Agent，电商、客服、搜索和办公流程都会更容易接入。",
    tags: ["腾讯", "混元", "元宝", "中国AI"],
  },
  {
    slug: "minimax-music-3-release",
    title: "MiniMax Music-3.0 发布，AI 内容生成继续细分到音乐场景",
    source: "MiniMax",
    sourceUrl: "https://platform.minimax.io/docs/release-notes/models",
    publishedAt: "2026-07-16",
    category: "产品功能",
    summary: "MiniMax 模型发布记录显示，Music-3.0 于 2026 年 7 月 16 日上线，展示国内 AI 公司在文本、代码之外继续扩展音频和内容生成能力。",
    takeaway: "AI 工具的竞争不只在大语言模型。短视频、直播、内容号和品牌营销也会越来越需要图像、音乐、视频等多模态能力。",
    tags: ["MiniMax", "中国AI", "音乐生成", "多模态"],
  },
  {
    slug: "baidu-ernie-5-1-release",
    title: "百度文心 5.1 发布，强化 Agent、推理和创作能力",
    source: "百度文心",
    sourceUrl: "https://yiyan.baidu.com/blog/zh/posts/ernie-5.1-0508-release/",
    publishedAt: "2026-05-09",
    category: "模型更新",
    summary: "百度文心 5.1 正式上线，官方重点强调通过强化学习和智能体后训练，提升 Agent、推理、创作等能力。",
    takeaway: "国内模型正在强化中文创作、办公和智能体能力。普通用户可以重点观察它在中文资料整理、内容生成和国产办公场景中的表现。",
    tags: ["百度文心", "中国AI", "Agent", "推理"],
  },
  {
    slug: "deepseek-v4-preview-release",
    title: "DeepSeek V4 Preview 发布，支持 1M 上下文和开源权重",
    source: "DeepSeek",
    sourceUrl: "https://api-docs.deepseek.com/news/news260424/",
    publishedAt: "2026-04-24",
    category: "模型更新",
    summary: "DeepSeek 官方发布 V4 Preview，包括 V4-Pro 与 V4-Flash，强调 1M 上下文、Agent 编程能力、API 兼容 OpenAI Chat Completions 与 Anthropic API。",
    takeaway: "这类国产模型更新会直接影响 API 成本、长文处理和 Codex/编程 Agent 接入方案，适合站长和小团队重点关注。",
    tags: ["DeepSeek", "中国AI", "开源模型", "Agent"],
  },
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
  const sorted = [...aiNewsItems].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  return balanceChinaInternationalNews(sorted, limit).slice(0, limit);
}

export async function getLatestAiNewsForSite(limit = aiNewsItems.length): Promise<AiNewsItem[]> {
  const items: AiNewsItem[] = [];
  const client = createServiceClient();

  if (client) {
    try {
      const { data, error } = await client
        .from("ai_news")
        .select(aiNewsSelectFields)
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
  items.push(...getLatestAiNews(Math.max(limit, aiNewsItems.length)));

  const merged = balanceChinaInternationalNews(mergeAiNewsItems(items), limit).slice(0, limit);
  if (merged.length > 0) return merged;

  return getLatestAiNews(limit);
}

export async function getAiNewsArticleForSite(slug: string): Promise<AiNewsArticle | null> {
  const normalizedSlug = normalizeNewsSlug(slug);
  const supabaseItem = await getSupabaseAiNewsItemByAnySlug(normalizedSlug);
  if (supabaseItem) return buildAiNewsArticle(supabaseItem);

  const staticItem = aiNewsItems.find((entry) => newsSlugMatches(entry, normalizedSlug));
  if (staticItem) return buildAiNewsArticle(staticItem);

  const news = await getLatestAiNewsForSite(50);
  const item = news.find((entry) => newsSlugMatches(entry, normalizedSlug));
  if (!item) return null;

  return buildAiNewsArticle(item);
}

async function getSupabaseAiNewsItemByAnySlug(slug: string): Promise<AiNewsItem | null> {
  const client = createServiceClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("ai_news")
      .select(aiNewsSelectFields)
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) return toAiNewsItem(data as SupabaseAiNewsRow);

    const { data: rows, error: rowsError } = await client
      .from("ai_news")
      .select(aiNewsSelectFields)
      .order("published_at", { ascending: false })
      .limit(100);

    if (rowsError || !rows) return null;
    return (rows as SupabaseAiNewsRow[])
      .map(toAiNewsItem)
      .find((item) => newsSlugMatches(item, slug)) ?? null;
  } catch {
    return null;
  }
}

function toAiNewsItem(item: SupabaseAiNewsRow): AiNewsItem {
  const fallbackCandidate: FeedCandidate = {
    title: item.raw_title || item.title,
    source: item.source,
    sourceUrl: item.source_url,
    publishedAt: item.published_at,
    category: item.category,
    description: item.summary,
  };
  const localizedTitle = isLocalizedText(item.title) ? item.title : localizeTitle(fallbackCandidate);
  const localizedSummary = isLocalizedText(item.summary) ? item.summary : localizeSummary(fallbackCandidate, localizedTitle);
  const localizedTakeaway = isLocalizedText(item.takeaway) ? item.takeaway : getFallbackTakeaway(fallbackCandidate);

  return {
    slug: item.slug,
    rawTitle: item.raw_title ?? undefined,
    title: localizedTitle,
    source: item.source,
    sourceUrl: item.source_url,
    publishedAt: item.published_at,
    category: item.category,
    summary: localizedSummary,
    takeaway: localizedTakeaway,
    tags: item.tags ?? buildTags(fallbackCandidate),
  };
}

function buildAiNewsArticle(item: AiNewsItem): AiNewsArticle {
  const bodyParagraphs = getChineseArticleParagraphs(item);
  const summaryParagraphs = getArticleSummaryParagraphs(item);

  return {
    item,
    deck: `以下是根据 ${item.source} 公开消息整理的中文翻译阅读版，先呈现原文要点，最后再给出 Agent站总结。`,
    sections: [
      {
        title: "中文原文",
        paragraphs: bodyParagraphs,
      },
      {
        title: "Agent站总结",
        paragraphs: summaryParagraphs,
      },
    ],
    actionItems: [
      "打开官方来源，确认功能是否已经向你的账号或地区开放。",
      "用 1 个真实工作任务测试效果，不要只看发布标题判断价值。",
      "把可复用步骤整理成 Prompt、检查清单或 SOP，方便下次继续使用。",
      "如果涉及客户资料、健康、财务、企业数据或代码仓库，先确认权限和人工复核流程。",
    ],
    watchPoints: [
      `${item.source} 后续是否继续发布同方向更新`,
      "同类模型或产品是否跟进",
      "这项能力是否进入 API、企业版或插件生态",
      "真实使用成本、速度、稳定性和权限边界",
    ],
    relatedQueries: [...new Set([item.source, item.category, ...item.tags])].slice(0, 6),
  };
}

const articleBodyCopy: Record<string, string[]> = {
  "deepseek-v4-model-switch-july-24": [
    "DeepSeek 这次更新的重点，不是单纯发布一个新模型名称，而是把 API 使用入口正式切换到 V4 体系。官方更新日志显示，V4-Pro 和 V4-Flash 已成为主要模型入口，旧的 deepseek-chat 与 deepseek-reasoner 在 2026 年 7 月 24 日停止使用。",
    "对普通用户来说，这种变化未必会直接出现在聊天界面里；但对正在做网站、插件、自动化流程或 Codex 接入的人来说，影响会更直接。只要你的程序里写死了旧模型名，或者某个自动化流程依赖旧接口，就有机会因为模型入口切换而出现调用失败、输出变化或成本变化。",
    "更值得留意的是，DeepSeek 把 V4-Pro 和 V4-Flash 分开，也代表模型使用正在变得更精细。不是所有任务都需要最强模型，简单问答、资料整理、客服初稿可能更适合速度快、成本低的模型；复杂代码、长文推理、Agent 多步骤任务，才更需要更强的版本。",
    "如果你已经把 DeepSeek 接入自己的网站或工作流，接下来最实际的做法，是打开后台检查 API 模型名称、调用参数、价格和失败日志。不要等用户发现不能用才处理，最好先用几个真实任务测试一次，确认输出稳定后再继续放到正式流程里。",
  ],
  "china-ai-models-waic-2026": [
    "2026 世界人工智能大会之后，中国大模型行业的看点已经不再只集中在某一个爆款模型。报道提到，阿里千问、百度、腾讯、MiniMax、阶跃星辰等公司都在展示新的 AI 产品和应用方向，中国开源大模型的全球累计下载量也已经突破 100 亿次。",
    "这说明中国 AI 正在进入一个更复杂的阶段：一边是模型能力竞争，一边是开源生态竞争，另一边则是行业应用和实际落地。过去大家可能只关心某个模型是否便宜、是否中文更好，现在还要看它有没有生态、有没有工具链、能不能稳定接入真实业务。",
    "对普通用户来说，这类资讯的价值不在于记住每家公司发布了什么，而是知道自己有更多选择。写作、客服、电商、短视频、办公自动化、编程辅助，不一定只依赖海外模型，很多国产模型在中文表达、本地平台和价格上会更贴近大陆用户。",
    "接下来可以重点观察几个方向：哪些国产模型开放 API，哪些工具适合小团队使用，哪些平台可以稳定生成内容、处理文档或连接业务流程。真正有价值的，不是发布会上的概念，而是能不能帮你每天少做重复工作。",
  ],
  "kimi-k3-release": [
    "月之暗面在 2026 年 7 月推出 Kimi K3，把它定位为新一代旗舰模型。公开信息里最容易被注意到的是 2.8 万亿参数、原生多模态和 1M token 上下文，这几个词背后指向的是更长文本、更复杂任务和更强的综合处理能力。",
    "Kimi 过去给很多用户的印象，是擅长长文阅读、资料整理和中文场景。K3 的方向则更进一步，不只是让你上传一篇文章让它总结，而是希望模型可以处理更长的资料、更复杂的知识工作，甚至参与软件工程和 Agent 任务。",
    "这对内容创作者、学生、研究人员和小团队都有现实意义。比如整理一批资料、读长报告、拆解竞品页面、写方案初稿、做知识库问答，这类任务通常不是一句话就能完成，而是需要模型理解上下文、保持结构和持续跟进。",
    "不过，参数和上下文长度本身不等于最终体验一定最好。用户真正要比较的，是它在自己场景里的稳定性、速度、价格和中文表达。Kimi K3 值得试，但最好用真实工作任务测试，而不是只看发布参数。",
  ],
  "kimi-k3-api-platform": [
    "Kimi API 平台把 K3 放到开发者可调用的位置，说明这次更新不只是给普通聊天用户看的，也是给开发者、站长和做自动化工具的人使用。平台强调 1M tokens 上下文、软件工程、知识工作和深度推理，这些都是目前 Agent 产品最需要的能力。",
    "长上下文的意义很直接：模型可以一次读取更多资料。对网站来说，它可以处理更长的用户输入、更多文档内容，甚至把多个页面、表格或代码片段放在同一轮任务里理解。对插件开发来说，这会让资料整理、报告生成和代码辅助更容易做得完整。",
    "API 价格同样重要。做个人工具时，一次调用贵一点可能无所谓；但如果放到网站里给很多用户使用，输入、输出、缓存命中都会变成真实成本。Kimi 在平台上公开价格，方便开发者计算不同任务应该用哪种调用方式。",
    "如果你想把 Kimi 接入自己的网站，可以先从小场景开始，例如长文总结、知识库问答、商品资料整理或代码解释。先确认速度、成本和效果，再决定是否放到更复杂的自动化流程里。",
  ],
  "tencent-hunyuan-3-yuanbao-agent": [
    "腾讯混元 3 正式版的重点，不只是模型本身更新，而是和元宝这样的产品入口结合起来。报道提到，这次更新继续提升后训练、数据质量和 Agent 能力，说明腾讯正在把大模型能力放进更具体的用户场景。",
    "国内 AI 产品和海外模型有一个明显差异：国内产品更容易接近微信、腾讯文档、会议、内容平台和本地服务生态。只要模型能力足够稳定，它就不只是聊天工具，而可能成为办公、客服、搜索和内容生产里的入口。",
    "Agent 能力是这一类更新的关键。普通聊天是你问一句、AI 答一句；Agent 则更接近帮你连续完成任务，例如整理资料、规划步骤、生成内容、调用工具或跟进结果。对小团队来说，这种能力比单纯模型跑分更有用。",
    "如果你已经在用腾讯生态里的工具，可以留意元宝和混元后续会开放哪些能力。真正值得测试的不是宣传语，而是它能不能在微信沟通、文档整理、客户回复或企业流程里减少重复操作。",
  ],
  "minimax-music-3-release": [
    "MiniMax Music-3.0 的发布说明，AI 内容生成正在继续细分。过去很多人提到 AI，第一反应是写文章、写代码或做问答；但对短视频、直播、电商和品牌内容来说，音乐、音效、语音和视频同样重要。",
    "音乐生成模型的价值，不一定是让普通人变成专业作曲人，而是降低内容制作门槛。比如短视频配乐、品牌活动背景音乐、直播暖场素材、课程片头片尾，都可能从这种能力里受益。",
    "对创作者来说，AI 音乐真正好用的前提，是生成结果能否贴合场景、版权和商用边界是否清楚、导出质量是否稳定。如果这些问题解决得好，它就会成为内容生产流程里的一个环节，而不是单独拿来玩的功能。",
    "这类模型也提醒我们，AI 工具库不能只盯着聊天模型。未来用户需要的是一套组合：文字生成、图片生成、音乐生成、视频剪辑、数据整理和自动发布，最后连接成完整工作流。",
  ],
};

function getChineseArticleParagraphs(item: AiNewsItem) {
  const customCopy = articleBodyCopy[item.slug];
  if (customCopy) return customCopy;

  return [
    `${item.source} 在 ${item.publishedAt} 发布了这条动态。简单来说，核心信息是：${item.summary}`,
    `这条资讯属于「${item.category}」。它值得放进 AI 资讯里，不是因为标题看起来新，而是因为它可能影响用户选择模型、使用工具、搭建插件或设计工作流的方式。`,
    `${item.takeaway} 这类变化最适合用真实任务验证，例如写一份文章、整理一批资料、处理客户问题、分析一个表格，或者测试一次代码和自动化流程。`,
    "如果你只是浏览资讯，可以先记住它代表的方向；如果你已经在实际使用 AI，就应该回到自己的高频场景里测试一次。AI 新闻真正有用的时候，不是看完觉得热闹，而是能转化成一个更省时间的做法。",
  ];
}

function getArticleSummaryParagraphs(item: AiNewsItem) {
  if (item.category === "模型更新") {
    return [
      "这条资讯的重点，是模型能力和使用入口正在变化。对普通用户来说，可以关注它是否让写作、资料整理、编程或长文理解变得更稳定。",
      item.takeaway,
      "不要只看模型发布名称，最好用自己的真实任务测试一次。能稳定省时间，才值得长期使用。",
    ];
  }
  if (item.category === "Agent趋势") {
    return [
      "这条资讯的重点，是 AI 正在从单纯聊天走向可以连续执行任务的 Agent 形态。",
      item.takeaway,
      "真正落地时，要把任务拆成输入、执行和人工确认几步，先从小流程测试，再考虑接入网站或团队工作。",
    ];
  }
  if (item.category === "行业应用") {
    return [
      "这条资讯的重点，是 AI 已经进入更具体的行业场景，不再只是模型公司之间的参数竞争。",
      item.takeaway,
      "对普通人和小团队来说，最值得做的是找到一个自己的日常场景，把新闻里的方向变成可复制的流程。",
    ];
  }
  if (item.category === "安全与合规") {
    return [
      "这条资讯的重点，是 AI 使用越深入，数据、权限和安全边界就越重要。",
      item.takeaway,
      "涉及客户资料、健康、财务、代码仓库或企业数据时，不应完全交给 AI 自动处理，必须保留人工复核。",
    ];
  }
  return [
    "这条资讯的重点，是 AI 产品能力继续细分，开始进入更具体的使用场景。",
    item.takeaway,
    "建议先确认功能是否对你的账号开放，再用一个真实任务测试效果。能减少重复操作，才有继续使用的价值。",
  ];
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

  const unknownCandidates = selected.filter((candidate) => !localizedFeedCopy[getLookupKey(candidate.title)]);
  const summarizedItems = unknownCandidates.length > 0 ? await summarizeOfficialAiNews(unknownCandidates) : new Map<string, AiNewsItem>();

  return selected.map((candidate) => {
    if (localizedFeedCopy[getLookupKey(candidate.title)]) return toFallbackAiNewsItem(candidate);
    return summarizedItems.get(candidate.sourceUrl) ?? toFallbackAiNewsItem(candidate);
  });
}

async function fetchFeedCandidates(source: FeedSource): Promise<FeedCandidate[]> {
  const response = await fetch(source.feedUrl, {
    headers: {
      accept: "application/rss+xml, application/xml, text/xml",
      "user-agent": "AgentZhanBot/1.0 (+https://agentzhan.com/news)",
    },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(8000),
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
    slug: buildNewsSlug(item.publishedAt, item.title),
    rawTitle: item.title,
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

function getArticleAudience(category: AiNewsItem["category"]) {
  if (category === "模型更新") return "经常写作、编程、做资料分析或搭建自动化的人";
  if (category === "产品功能") return "已经在用 AI 工具处理日常任务的用户";
  if (category === "Agent趋势") return "想把 AI 从聊天工具升级成执行助手的团队";
  if (category === "行业应用") return "站长、内容团队、小企业和正在找 AI 落地场景的人";
  return "企业、开发者、管理者和需要处理敏感数据的团队";
}

function getArticleWorkflow(category: AiNewsItem["category"]) {
  if (category === "模型更新") {
    return "建议重点测试长文本理解、复杂指令跟随、多步骤推理和输出稳定性。旧 Prompt 不一定失效，但很可能有优化空间，特别是角色设定、输入资料结构和输出格式。";
  }
  if (category === "产品功能") {
    return "建议从最重复的任务开始试用，例如整理资料、生成草稿、更新表格、处理客户问题或做会议后续。能否节省时间，比功能名字本身更重要。";
  }
  if (category === "Agent趋势") {
    return "建议把任务拆成输入、判断、执行、复核四步，再决定哪些步骤交给 Agent，哪些步骤必须人工确认。这样比一次性让 AI 接管整条流程更稳。";
  }
  if (category === "行业应用") {
    return "建议观察它能否转化为具体业务场景，例如获客、客服、内容生产、研发提效、培训或数据分析。能落到一个岗位或一个流程，才有真正价值。";
  }
  return "建议先列出数据来源、访问权限、输出用途和复核责任。安全与合规类更新不能只看能力提升，还要看出错后的责任边界。";
}

function getArticleRisk(category: AiNewsItem["category"]) {
  if (category === "模型更新") {
    return "模型能力提升不等于所有任务都可以自动化。涉及事实、代码、医疗、金融或法律判断时，仍需要来源核对和人工复核。";
  }
  if (category === "产品功能") {
    return "产品功能可能存在地区、账号、套餐或灰度限制。上线到正式工作流前，应先确认可用范围、数据权限和导出能力。";
  }
  if (category === "Agent趋势") {
    return "Agent 能执行任务，也可能放大错误操作。凡是涉及发邮件、改数据、删文件、付款、发布内容的步骤，都应保留确认机制。";
  }
  if (category === "行业应用") {
    return "行业案例通常展示成功面，不代表每个团队都能直接复制。要结合自己的客群、数据质量、团队能力和预算重新评估。";
  }
  return "安全与合规信息需要格外谨慎。不要把官方新闻当成完整合规建议，真正上线前仍要结合内部政策、当地法规和专业意见。";
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

function balanceChinaInternationalNews(items: AiNewsItem[], limit: number) {
  if (items.length === 0) return items;

  const chinaItems = items.filter(isChinaAiNews);
  const internationalItems = items.filter((item) => !isChinaAiNews(item));
  if (chinaItems.length === 0 || internationalItems.length === 0) return items;

  const targetChina = Math.ceil(limit / 2);
  const targetInternational = Math.floor(limit / 2);
  const result: AiNewsItem[] = [];
  let chinaIndex = 0;
  let internationalIndex = 0;
  let useChina =
    +new Date(chinaItems[0]?.publishedAt ?? 0) >= +new Date(internationalItems[0]?.publishedAt ?? 0);

  while (result.length < limit && (chinaIndex < chinaItems.length || internationalIndex < internationalItems.length)) {
    if (useChina && chinaIndex < chinaItems.length && chinaIndex < targetChina) {
      result.push(chinaItems[chinaIndex++]);
    } else if (!useChina && internationalIndex < internationalItems.length && internationalIndex < targetInternational) {
      result.push(internationalItems[internationalIndex++]);
    } else if (chinaIndex < chinaItems.length && chinaIndex < targetChina) {
      result.push(chinaItems[chinaIndex++]);
    } else if (internationalIndex < internationalItems.length && internationalIndex < targetInternational) {
      result.push(internationalItems[internationalIndex++]);
    } else if (chinaIndex < chinaItems.length) {
      result.push(chinaItems[chinaIndex++]);
    } else if (internationalIndex < internationalItems.length) {
      result.push(internationalItems[internationalIndex++]);
    }

    useChina = !useChina;
  }

  return result;
}

function isChinaAiNews(item: AiNewsItem) {
  return /DeepSeek|通义|通義|千问|千問|百度|文心|智谱|智譜|Kimi|月之暗面|豆包|字节|字節|MiniMax|中国AI|中國AI|腾讯|騰訊|混元|元宝|元寶|阿里|阶跃|階躍/i.test(
    `${item.source} ${item.title} ${item.tags.join(" ")}`,
  );
}

function newsSlugMatches(item: AiNewsItem, slug: string) {
  if (item.slug === slug) return true;
  if (item.rawTitle && buildNewsSlug(item.publishedAt, item.rawTitle) === slug) return true;
  return buildNewsSlug(item.publishedAt, item.title.replace(`${item.source}：`, "")) === slug;
}

function buildNewsSlug(publishedAt: string, title: string) {
  return `news-${publishedAt.replaceAll("-", "")}-${slugify(title).slice(0, 80)}`;
}

function normalizeNewsSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
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
