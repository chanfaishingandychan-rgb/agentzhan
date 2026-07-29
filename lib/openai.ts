import OpenAI from "openai";

export interface GeneratedPrompt {
  title: string;
  slug: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  categorySlug: string;
  tags: string[];
  difficulty: string;
  model: string;
  tier: "free" | "vip";
  promptContent: string;
  instructions: string[];
  useCases: string[];
  bestPractices: string[];
  example: string;
  expectedResult: string;
  useScene: string;
  faq: Array<{ question: string; answer: string }>;
  qualityScore: number;
}

type AIProvider = {
  client: OpenAI;
  configured: boolean;
  displayName: "DeepSeek" | "OpenAI";
  missingKey: "DEEPSEEK_API_KEY" | "OPENAI_API_KEY";
  model: string;
};

type AiNewsCandidate = {
  title: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  category: "模型更新" | "产品功能" | "Agent趋势" | "行业应用" | "安全与合规";
  description: string;
};

type SummarizedAiNewsItem = {
  slug: string;
  title: string;
  rawTitle: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  category: AiNewsCandidate["category"];
  summary: string;
  takeaway: string;
  tags: string[];
};

let _client: OpenAI | null = null;
let _clientSignature = "";

/** Get a lazily initialized AI client (server-side only). DeepSeek is preferred when configured. */
function getAIProvider(): AIProvider {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const preferredProvider = process.env.AI_PROVIDER?.toLowerCase();

  const useOpenAI = preferredProvider === "openai" && Boolean(openaiKey);
  const useDeepSeek = !useOpenAI && Boolean(deepseekKey);

  if (useDeepSeek) {
    const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
    const signature = `deepseek:${model}:${deepseekKey}`;
    if (!_client || _clientSignature !== signature) {
      _client = new OpenAI({
        apiKey: deepseekKey,
        baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
      });
      _clientSignature = signature;
    }
    return { client: _client, configured: true, displayName: "DeepSeek", missingKey: "DEEPSEEK_API_KEY", model };
  }

  if (openaiKey) {
    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    const signature = `openai:${model}:${openaiKey}`;
    if (!_client || _clientSignature !== signature) {
      _client = new OpenAI({ apiKey: openaiKey });
      _clientSignature = signature;
    }
    return { client: _client, configured: true, displayName: "OpenAI", missingKey: "OPENAI_API_KEY", model };
  }

  return {
    client: null as unknown as OpenAI,
    configured: false,
    displayName: deepseekKey ? "DeepSeek" : "OpenAI",
    missingKey: "DEEPSEEK_API_KEY",
    model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
  };
}

const DIFFICULTIES = ["入门", "进阶", "专业"] as const;
const MODELS = ["ChatGPT", "Claude", "DeepSeek", "通义千问", "文心一言"] as const;

const SCENARIO_POOL = [
  { category: "AI写作", slug: "ai-writing", topic: "公众号爆款选题", model: "ChatGPT" },
  { category: "AI办公", slug: "ai-office", topic: "周报自动生成", model: "Claude" },
  { category: "AI学习", slug: "ai-learning", topic: "错题分析教练", model: "DeepSeek" },
  { category: "AI短视频", slug: "ai-short-video", topic: "抖音脚本分镜", model: "ChatGPT" },
  { category: "AI电商", slug: "ai-ecommerce", topic: "淘宝标题优化", model: "DeepSeek" },
  { category: "AI营销", slug: "ai-marketing", topic: "小红书投放文案", model: "Claude" },
  { category: "AI客服", slug: "ai-customer-service", topic: "售后话术模板", model: "通义千问" },
  { category: "AI创业", slug: "ai-startup", topic: "商业计划书大纲", model: "ChatGPT" },
  { category: "AI个人助理", slug: "ai-personal-assistant", topic: "个人周计划安排", model: "Claude" },
  { category: "AI效率工具", slug: "ai-efficiency-tools", topic: "工作流自动化设计", model: "DeepSeek" },
];

/**
 * Call the configured AI provider to generate 5 prompts. Returns parsed results.
 * On any failure, returns the raw response text for debugging.
 */
export async function generatePromptsWithOpenAI(existingSlugs: Set<string>): Promise<{
  prompts: GeneratedPrompt[];
  rawResponse: string;
  error?: string;
  provider?: string;
}> {
  const provider = getAIProvider();
  if (!provider.configured) {
    return { prompts: [], rawResponse: "", error: `${provider.missingKey} is not configured`, provider: provider.displayName };
  }

  const selected = SCENARIO_POOL.sort(() => Math.random() - 0.5).slice(0, 5);

  const systemPrompt = `你是一个专业的 AI Prompt 工程师，负责为中文用户生成高质量的 AI 提示词。你需要输出严格的 JSON 数组格式。

要求：
- 全部使用简体中文
- 每个提示词必须包含完整、可直接使用的 prompt 内容
- 场景描述必须具体、可执行
- FAQ 至少 2 条
- 标签 4-6 个
- quality_score 是 1-10 的整数，根据内容完整度、实用性、可复制性评分
- 输出必须是合法的 JSON 数组，不要有 markdown 代码块标记

请为以下 5 个主题各生成一个提示词：${selected.map((s) => s.topic).join("、")}

JSON schema:
[
  {
    "title": "提示词标题",
    "summary": "一句话描述（30字以内）",
    "seoTitle": "SEO标题（含关键词）",
    "seoDescription": "SEO描述（120字以内）",
    "categorySlug": "${selected[0].slug}",
    "tags": ["标签1", "标签2"],
    "difficulty": "入门",
    "model": "ChatGPT",
    "tier": "free",
    "promptContent": "完整的提示词，包含角色设置、任务描述、输出要求、格式规范",
    "instructions": ["使用步骤1", "使用步骤2"],
    "useCases": ["场景1", "场景2"],
    "bestPractices": ["最佳实践1"],
    "example": "使用案例描述",
    "expectedResult": "预期效果",
    "useScene": "适用场景",
    "faq": [{"question": "问题", "answer": "答案"}],
    "qualityScore": 8
  }
]

注意：5 个提示词分别对应以下主题：${selected.map((s, i) => `${i + 1}. ${s.topic}（categorySlug: ${s.slug}, model: ${s.model}）`).join("，")}`;

  try {
    const completion = await provider.client.chat.completions.create({
      model: provider.model,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `现有 slugs（避免重复）：${[...existingSlugs].slice(0, 200).join(", ")}。请生成 5 个高质量中文提示词。`,
        },
      ],
      temperature: 0.8,
      max_tokens: 8000,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const prompts = parseGeneratedJSON(raw, selected, existingSlugs);
    return { prompts, rawResponse: raw, provider: provider.displayName };
  } catch (err: unknown) {
    return {
      prompts: [],
      rawResponse: "",
      error: err instanceof Error ? err.message : String(err),
      provider: provider.displayName,
    };
  }
}

export async function summarizeAiNewsCandidates(candidates: AiNewsCandidate[]): Promise<{
  items: SummarizedAiNewsItem[];
  rawResponse: string;
  error?: string;
  provider?: string;
}> {
  const provider = getAIProvider();
  if (!provider.configured) {
    return { items: [], rawResponse: "", error: `${provider.missingKey} is not configured`, provider: provider.displayName };
  }

  const systemPrompt = `你是 Agent站的 AI 新闻编辑，负责把官方 AI 新闻整理成简体中文资讯。

要求：
- 只根据输入材料总结，不要编造不存在的事实
- 全部使用简体中文
- title 适合中文 SEO，不能夸大
- summary 用 1 句到 2 句说明发生了什么
- takeaway 说明这对普通用户、站长、小团队或企业有什么用
- tags 3-5 个
- category 必须从：模型更新、产品功能、Agent趋势、行业应用、安全与合规 中选择
- 输出严格 JSON 数组，不要 markdown`;

  try {
    const completion = await provider.client.chat.completions.create({
      model: provider.model,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify(
            candidates.map((item) => ({
              title: item.title,
              source: item.source,
              sourceUrl: item.sourceUrl,
              publishedAt: item.publishedAt,
              category: item.category,
              description: item.description,
            })),
          ),
        },
      ],
      temperature: 0.4,
      max_tokens: 4000,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = parseSummarizedNewsJSON(raw, candidates);
    return { items: parsed, rawResponse: raw, provider: provider.displayName };
  } catch (err: unknown) {
    return {
      items: [],
      rawResponse: "",
      error: err instanceof Error ? err.message : String(err),
      provider: provider.displayName,
    };
  }
}

function parseSummarizedNewsJSON(raw: string, candidates: AiNewsCandidate[]): SummarizedAiNewsItem[] {
  let json = raw.trim();
  if (json.startsWith("```")) {
    json = json.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  let parsed: Array<Record<string, unknown>>;
  try {
    parsed = JSON.parse(json);
  } catch {
    return candidates.map(fallbackSummarizedNews);
  }

  if (!Array.isArray(parsed)) return candidates.map(fallbackSummarizedNews);

  return candidates.map((candidate, index) => {
    const item = parsed[index] ?? {};
    const category = isNewsCategory(item.category) ? item.category : candidate.category;
    const fallback = fallbackSummarizedNews({ ...candidate, category });
    const title = String(item.title ?? "").slice(0, 120);
    const summary = String(item.summary ?? "").slice(0, 260);
    const takeaway = String(item.takeaway ?? "").slice(0, 300);

    return {
      slug: `news-${candidate.publishedAt.replaceAll("-", "")}-${slugify(candidate.title).slice(0, 80)}`,
      title: isLocalizedNewsText(title) ? title : fallback.title,
      rawTitle: candidate.title,
      source: candidate.source,
      sourceUrl: candidate.sourceUrl,
      publishedAt: candidate.publishedAt,
      category,
      summary: isLocalizedNewsText(summary) ? summary : fallback.summary,
      takeaway: isLocalizedNewsText(takeaway) ? takeaway : fallback.takeaway,
      tags: Array.isArray(item.tags) ? item.tags.slice(0, 5).map(String) : [candidate.source, category],
    };
  });
}

function fallbackSummarizedNews(candidate: AiNewsCandidate): SummarizedAiNewsItem {
  const product = getPrimaryProduct(candidate.title);
  const title = product
    ? `${candidate.source}：发布 ${product} 相关更新`
    : `${candidate.source}：${getCategorySubject(candidate.category)}最新动态`;

  return {
    slug: `news-${candidate.publishedAt.replaceAll("-", "")}-${slugify(candidate.title).slice(0, 80)}`,
    title,
    rawTitle: candidate.title,
    source: candidate.source,
    sourceUrl: candidate.sourceUrl,
    publishedAt: candidate.publishedAt,
    category: candidate.category,
    summary: `官方来源在 ${candidate.publishedAt} 发布了新的 AI 动态，主题属于「${candidate.category}」。这条资讯已经转成中文概括，适合用来判断模型能力、产品功能、工作流或企业应用是否值得关注。`,
    takeaway: "这条更新来自官方来源，适合关注模型、工具或企业 AI 应用变化的用户进一步查看。",
    tags: [candidate.source, candidate.category],
  };
}

function isNewsCategory(value: unknown): value is AiNewsCandidate["category"] {
  return ["模型更新", "产品功能", "Agent趋势", "行业应用", "安全与合规"].includes(String(value));
}

function isLocalizedNewsText(value: string) {
  const text = value.trim();
  return /[\u4e00-\u9fff]/.test(text) && !/[a-z]{3,}(?:\s+[a-z]{2,}){4,}/i.test(text);
}

function getPrimaryProduct(title: string) {
  return title.match(/\b(ChatGPT(?:\sWork)?|Codex|OpenAI Presence|Gemini[\w\s.-]*|Gemma[\w\s.-]*|GPT-[\w.-]+|Deep Think)\b/)?.[0]?.trim();
}

function getCategorySubject(category: AiNewsCandidate["category"]) {
  if (category === "模型更新") return "AI 模型";
  if (category === "Agent趋势") return "AI Agent";
  if (category === "安全与合规") return "AI 安全";
  if (category === "行业应用") return "AI 行业应用";
  return "AI 产品";
}

function parseGeneratedJSON(
  raw: string,
  scenarios: typeof SCENARIO_POOL,
  existingSlugs: Set<string>,
): GeneratedPrompt[] {
  // Strip markdown fences
  let json = raw.trim();
  if (json.startsWith("```")) {
    json = json.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parsed: any[];
  try {
    parsed = JSON.parse(json);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const results: GeneratedPrompt[] = [];

  for (let i = 0; i < parsed.length && results.length < 5; i++) {
    const item = parsed[i];
    const scenario = scenarios[i] ?? scenarios[0];

    // Validate required fields
    if (!item?.title || !item?.promptContent) continue;

    // Generate unique slug
    let slug = `auto-${date}-${i + 1}`;
    if (item.title) {
      slug = `auto-${date}-${slugify(item.title)}`;
    }
    // Dedup
    let dedupAttempt = 0;
    while (existingSlugs.has(slug) && dedupAttempt < 10) {
      slug = `auto-${date}-${slugify(item.title)}-${dedupAttempt + 2}`;
      dedupAttempt++;
    }
    existingSlugs.add(slug);

    const qualityScore = clampScore(item.qualityScore);
    const tier = item.tier === "vip" ? "vip" : "free";

    results.push({
      title: String(item.title),
      slug,
      summary: String(item.summary ?? item.seoDescription ?? "").slice(0, 200),
      seoTitle: String(item.seoTitle ?? `${item.title} - Agent站`),
      seoDescription: String(item.seoDescription ?? "").slice(0, 160),
      categorySlug: String(item.categorySlug ?? scenario.slug),
      tags: Array.isArray(item.tags) ? item.tags.slice(0, 6).map(String) : [scenario.category, scenario.model],
      difficulty: DIFFICULTIES.includes(item.difficulty) ? item.difficulty : "入门",
      model: MODELS.includes(item.model) ? item.model : scenario.model,
      tier,
      promptContent: String(item.promptContent),
      instructions: Array.isArray(item.instructions) ? item.instructions.slice(0, 5).map(String) : ["直接复制粘贴使用"],
      useCases: Array.isArray(item.useCases) ? item.useCases.slice(0, 5).map(String) : [item.useScene ?? scenario.topic],
      bestPractices: Array.isArray(item.bestPractices) ? item.bestPractices.slice(0, 5).map(String) : [],
      example: String(item.example ?? ""),
      expectedResult: String(item.expectedResult ?? "更快产出结构完整的内容"),
      useScene: String(item.useScene ?? scenario.topic),
      faq: Array.isArray(item.faq)
        ? item.faq.slice(0, 5).map((f: Record<string, unknown>) => ({ question: String(f.question ?? ""), answer: String(f.answer ?? "") }))
        : [],
      qualityScore,
    });
  }

  return results;
}

function clampScore(score: unknown): number {
  const n = Number(score);
  if (isNaN(n)) return 7;
  return Math.max(1, Math.min(10, Math.round(n)));
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/** Check if at least one AI provider is configured */
export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY);
}

export function getConfiguredAIProvider() {
  const provider = getAIProvider();
  return {
    configured: provider.configured,
    name: provider.displayName,
    model: provider.model,
    missingKey: provider.missingKey,
  };
}
