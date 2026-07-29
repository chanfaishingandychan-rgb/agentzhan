import { XMLParser } from "fast-xml-parser";

import { createServiceClient } from "@/lib/supabase/server";
import { getConfiguredAIProvider, isOpenAIConfigured, summarizeAiNewsCandidates } from "@/lib/openai";
import type { AiNewsItem } from "@/lib/news";

type FeedSource = {
  source: string;
  feedUrl: string;
  fallbackCategory: AiNewsItem["category"];
};

export type NewsUpdateResult = {
  fetchedCount: number;
  candidateCount: number;
  insertedCount: number;
  skippedCount: number;
  failedCount: number;
  errors: string[];
  provider: string;
  model: string;
};

type FeedCandidate = {
  title: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  category: AiNewsItem["category"];
  description: string;
};

const feedSources: FeedSource[] = [
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

const parser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: true,
  trimValues: true,
});

export async function updateAiNewsFromFeeds(): Promise<NewsUpdateResult> {
  const client = createServiceClient();
  const aiProvider = getConfiguredAIProvider();

  if (!client) {
    return {
      fetchedCount: 0,
      candidateCount: 0,
      insertedCount: 0,
      skippedCount: 0,
      failedCount: 1,
      errors: ["Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."],
      provider: aiProvider.name,
      model: aiProvider.model,
    };
  }

  if (!isOpenAIConfigured()) {
    return {
      fetchedCount: 0,
      candidateCount: 0,
      insertedCount: 0,
      skippedCount: 0,
      failedCount: 1,
      errors: [`${aiProvider.missingKey} is not configured.`],
      provider: aiProvider.name,
      model: aiProvider.model,
    };
  }

  const errors: string[] = [];
  const candidates: FeedCandidate[] = [];

  for (const source of feedSources) {
    try {
      const sourceItems = await fetchFeedCandidates(source);
      candidates.push(...sourceItems);
    } catch (error) {
      errors.push(`${source.source}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const deduped = dedupeCandidates(candidates)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, 8);

  const existingUrls = new Set<string>();
  if (deduped.length > 0) {
    const { data } = await client
      .from("ai_news")
      .select("source_url")
      .in("source_url", deduped.map((item) => item.sourceUrl));
    data?.forEach((row: Record<string, unknown>) => existingUrls.add(String(row.source_url)));
  }

  const freshCandidates = deduped.filter((item) => !existingUrls.has(item.sourceUrl)).slice(0, 4);
  if (freshCandidates.length === 0) {
    await logNewsRun(client, {
      generatedCount: deduped.length,
      publishedCount: 0,
      failedCount: errors.length,
      summary: `AI資訊更新完成：抓取 ${candidates.length} 条，无新增可发布资讯。`,
      errorMessage: errors.length > 0 ? errors.join("\n") : null,
    });

    return {
      fetchedCount: candidates.length,
      candidateCount: deduped.length,
      insertedCount: 0,
      skippedCount: deduped.length,
      failedCount: errors.length,
      errors,
      provider: aiProvider.name,
      model: aiProvider.model,
    };
  }

  const summarized = await summarizeAiNewsCandidates(freshCandidates);
  if (summarized.error) {
    errors.push(summarized.error);
  }

  const rows = summarized.items.map((item) => ({
    slug: item.slug,
    title: item.title,
    source: item.source,
    source_url: item.sourceUrl,
    published_at: item.publishedAt,
    category: item.category,
    summary: item.summary,
    takeaway: item.takeaway,
    tags: item.tags,
    raw_title: item.rawTitle,
    created_at: new Date().toISOString(),
  }));

  let insertedCount = 0;
  let failedCount = errors.length;

  if (rows.length > 0) {
    const { error } = await client.from("ai_news").upsert(rows, { onConflict: "source_url" });
    if (error) {
      failedCount++;
      errors.push(error.message);
    } else {
      insertedCount = rows.length;
    }
  }

  await logNewsRun(client, {
    generatedCount: freshCandidates.length,
    publishedCount: insertedCount,
    failedCount,
    summary: `AI資訊更新完成：抓取 ${candidates.length} 条，新增发布 ${insertedCount} 条。`,
    errorMessage: errors.length > 0 ? errors.join("\n") : null,
  });

  return {
    fetchedCount: candidates.length,
    candidateCount: deduped.length,
    insertedCount,
    skippedCount: Math.max(0, deduped.length - freshCandidates.length),
    failedCount,
    errors,
    provider: summarized.provider ?? aiProvider.name,
    model: aiProvider.model,
  };
}

async function fetchFeedCandidates(source: FeedSource): Promise<FeedCandidate[]> {
  const response = await fetch(source.feedUrl, {
    headers: {
      accept: "application/rss+xml, application/xml, text/xml",
      "user-agent": "AgentZhanBot/1.0 (+https://agentzhan.com/news)",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`feed request failed with ${response.status}`);
  }

  const xml = await response.text();
  const parsed = parser.parse(xml);
  const channel = parsed?.rss?.channel ?? parsed?.feed;
  const rawItems = toArray(channel?.item ?? channel?.entry).slice(0, 10);

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

function inferCategory(title: string, description: string, fallback: AiNewsItem["category"]): AiNewsItem["category"] {
  const text = `${title} ${description}`.toLowerCase();
  if (/safety|security|policy|privacy|risk|合规|安全/.test(text)) return "安全与合规";
  if (/agent|connector|tool|workflow|插件|工作流/.test(text)) return "Agent趋势";
  if (/model|gpt|claude|gemini|deepseek|模型/.test(text)) return "模型更新";
  if (/business|enterprise|industry|customer|企业|行业|应用/.test(text)) return "行业应用";
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

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 500);
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

async function logNewsRun(
  client: NonNullable<ReturnType<typeof createServiceClient>>,
  input: {
    generatedCount: number;
    publishedCount: number;
    failedCount: number;
    summary: string;
    errorMessage: string | null;
  },
) {
  try {
    await client.from("ai_generation_logs").insert({
      run_time: new Date().toISOString(),
      generated_count: input.generatedCount,
      published_count: input.publishedCount,
      draft_count: 0,
      failed_count: input.failedCount,
      error_message: input.errorMessage,
      summary: input.summary,
    });
  } catch {
    // Logging should not fail the cron response.
  }
}
