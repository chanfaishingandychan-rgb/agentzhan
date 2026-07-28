import { categories, modelOptions } from "@/lib/site";
import { getAllPrompts, type PromptItem } from "@/lib/prompts";
import { createServiceClient } from "@/lib/supabase/server";

// ── Types ──

export type AdminPromptRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  model: string;
  difficulty: string;
  tier: "free" | "vip";
  status: "published" | "draft";
  qualityScore: number;
  copyCount: number;
  viewCount: number;
  updatedAt: string;
};

export type GenerationCandidate = {
  title: string;
  slug: string;
  description: string;
  prompt_content: string;
  use_case: string;
  category: string;
  model: string;
  difficulty: string;
  tags: string[];
  is_vip: boolean;
  seo_title: string;
  seo_description: string;
  faq: Array<{ question: string; answer: string }>;
  quality_score: number;
  status: "published" | "draft";
};

export type GenerationLog = {
  id: string;
  run_time: string;
  generated_count: number;
  published_count: number;
  draft_count: number;
  failed_count: number;
  error_message: string | null;
  summary: string;
};

export type CronTaskKey = "prompts" | "news";

export type CronTaskStatus = {
  key: CronTaskKey;
  title: string;
  schedule: string;
  expectedTime: string;
  latestLog: GenerationLog | null;
  hasRunToday: boolean;
  status: "ok" | "error" | "waiting" | "unknown";
};

export type LeadRow = {
  id: string;
  email: string;
  source: string;
  interestedPack: string;
  status: string;
  createdAt: string;
};

export type TrafficMetricRow = {
  label: string;
  value: number;
};

export type TrafficPageRow = {
  path: string;
  title: string;
  views: number;
  visitors: number;
};

export type TrafficRecentView = {
  id: string;
  path: string;
  title: string;
  referrer: string;
  deviceType: string;
  country: string;
  createdAt: string;
};

export type TrafficDashboardStats = {
  status: "ready" | "not_configured" | "table_missing" | "error";
  todayViews: number;
  last24hViews: number;
  last7dViews: number;
  uniqueVisitors7d: number;
  topPages: TrafficPageRow[];
  referrers: TrafficMetricRow[];
  devices: TrafficMetricRow[];
  countries: TrafficMetricRow[];
  recentViews: TrafficRecentView[];
  sampleLimited: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseRow = Record<string, any>;

// ── Static fallback helpers (when Supabase is not configured) ──

export function toAdminPromptRow(prompt: PromptItem, index: number): AdminPromptRow {
  return {
    id: String(index + 1),
    title: prompt.title,
    slug: prompt.slug,
    description: prompt.summary,
    category: prompt.category.name,
    model: prompt.model,
    difficulty: prompt.difficulty,
    tier: prompt.tier === "vip" ? "vip" : "free",
    status: "published",
    qualityScore: Math.min(10, Math.max(7, Math.round(prompt.popularity / 120))),
    copyCount: Math.round(prompt.popularity / 5),
    viewCount: prompt.popularity * 3,
    updatedAt: prompt.publishedAt,
  };
}

export function getAdminPromptRows(limit?: number): AdminPromptRow[] {
  const rows = getAllPrompts().map(toAdminPromptRow);
  return typeof limit === "number" ? rows.slice(0, limit) : rows;
}

export function getAdminStats() {
  const prompts = getAdminPromptRows();
  const vipCount = prompts.filter((p) => p.tier === "vip").length;
  return {
    totalPrompts: prompts.length,
    publishedCount: prompts.filter((p) => p.status === "published").length,
    draftCount: prompts.filter((p) => p.status === "draft").length,
    vipCount,
    freeCount: prompts.length - vipCount,
    categoryCount: categories.length,
    modelCount: new Set(prompts.map((p) => p.model)).size,
  };
}

export function getMockGenerationLogs(): GenerationLog[] {
  return [
    {
      id: "fallback-static",
      run_time: new Date().toISOString(),
      generated_count: 0,
      published_count: 0,
      draft_count: 0,
      failed_count: 0,
      error_message: null,
      summary: "Supabase 尚未设置，显示静态 fallback 资料。",
    },
  ];
}

const cronTasks: Array<Omit<CronTaskStatus, "latestLog" | "hasRunToday" | "status">> = [
  {
    key: "prompts",
    title: "Prompt 自动生成",
    schedule: "每天 03:00",
    expectedTime: "03:00 Asia/Hong_Kong",
  },
  {
    key: "news",
    title: "AI 资讯更新",
    schedule: "每天 03:00",
    expectedTime: "03:00 Asia/Hong_Kong",
  },
];

function getHongKongDateKey(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function getHongKongDayStartIso(value: Date) {
  const [year, month, day] = getHongKongDateKey(value).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, -8, 0, 0, 0)).toISOString();
}

export function inferCronTaskFromLog(log: GenerationLog): CronTaskKey | null {
  const summary = log.summary.toLowerCase();
  if (summary.includes("ai资讯") || summary.includes("ai 資訊") || summary.includes("news")) {
    return "news";
  }
  if (
    summary.includes("prompt") ||
    summary.includes("提示词") ||
    summary.includes("生成") ||
    log.draft_count > 0
  ) {
    return "prompts";
  }
  return null;
}

export function getCronTaskStatuses(logs: GenerationLog[]): CronTaskStatus[] {
  const todayKey = getHongKongDateKey(new Date());

  return cronTasks.map((task) => {
    const latestLog =
      logs.find((log) => inferCronTaskFromLog(log) === task.key) ?? null;
    const latestRunTime = latestLog ? new Date(latestLog.run_time) : null;
    const hasRunToday =
      latestRunTime !== null &&
      !Number.isNaN(+latestRunTime) &&
      getHongKongDateKey(latestRunTime) === todayKey;

    return {
      ...task,
      latestLog,
      hasRunToday,
      status: !latestLog
        ? "unknown"
        : latestLog.failed_count > 0
          ? "error"
          : hasRunToday
            ? "ok"
            : "waiting",
    };
  });
}

export function getSystemReadiness() {
  return {
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL),
    supabaseServiceRole: Boolean(
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_KEY ||
        process.env.SUPABASE_KEY,
    ),
    openaiApiKey: Boolean(process.env.OPENAI_API_KEY),
    deepseekApiKey: Boolean(process.env.DEEPSEEK_API_KEY),
    aiProvider: process.env.DEEPSEEK_API_KEY ? "DeepSeek" : process.env.OPENAI_API_KEY ? "OpenAI" : null,
    cronSecret: Boolean(process.env.CRON_SECRET),
    adminPassword: Boolean(process.env.ADMIN_PASSWORD),
    models: modelOptions,
  };
}

// ── Supabase-backed queries (used when env vars are set) ──

export async function getSupabaseStats(): Promise<{
  totalPrompts: number;
  publishedCount: number;
  draftCount: number;
  vipCount: number;
  freeCount: number;
  connected: boolean;
} | null> {
  const client = createServiceClient();
  if (!client) return null;

  try {
    const { count: total } = await client.from("prompts").select("*", { count: "exact", head: true });
    const { count: published } = await client.from("prompts").select("*", { count: "exact", head: true }).eq("status", "published");
    const { count: draft } = await client.from("prompts").select("*", { count: "exact", head: true }).eq("status", "draft");
    const { count: vip } = await client.from("prompts").select("*", { count: "exact", head: true }).eq("tier", "vip");
    return {
      totalPrompts: total ?? 0,
      publishedCount: published ?? 0,
      draftCount: draft ?? 0,
      vipCount: vip ?? 0,
      freeCount: (total ?? 0) - (vip ?? 0),
      connected: true,
    };
  } catch {
    return null;
  }
}

export async function getSupabaseLogs(limit = 20): Promise<GenerationLog[] | null> {
  const client = createServiceClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("ai_generation_logs")
      .select("*")
      .order("run_time", { ascending: false })
      .limit(limit);

    if (error || !data) return null;

    return data.map((row: SupabaseRow) => ({
      id: String(row.id),
      run_time: row.run_time,
      generated_count: row.generated_count ?? 0,
      published_count: row.published_count ?? 0,
      draft_count: row.draft_count ?? 0,
      failed_count: row.failed_count ?? 0,
      error_message: row.error_message ?? null,
      summary: row.summary ?? "",
    }));
  } catch {
    return null;
  }
}

export async function getSupabasePrompts(limit = 50): Promise<AdminPromptRow[] | null> {
  const client = createServiceClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("prompts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return null;

    return data.map((row: SupabaseRow) => ({
      id: String(row.id),
      title: row.title,
      slug: row.slug,
      description: row.summary ?? "",
      category: row.category_slug ?? "",
      model: row.model ?? "",
      difficulty: row.difficulty ?? "",
      tier: row.tier ?? "free",
      status: row.status ?? "draft",
      qualityScore: row.quality_score ?? 0,
      copyCount: row.copy_count ?? 0,
      viewCount: row.view_count ?? 0,
      updatedAt: row.updated_at ?? row.created_at,
    }));
  } catch {
    return null;
  }
}

export async function getSupabaseLeads(limit = 100): Promise<LeadRow[] | null> {
  const client = createServiceClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return null;

    return data.map((row: SupabaseRow) => ({
      id: String(row.id),
      email: row.email ?? "",
      source: row.source ?? "",
      interestedPack: row.interested_pack ?? "",
      status: row.status ?? "new",
      createdAt: row.created_at ?? "",
    }));
  } catch {
    return null;
  }
}

export async function getSupabaseLeadStats(): Promise<{
  totalLeads: number;
  xiaohongshuCount: number;
  ecommerceCount: number;
  officeCount: number;
  enterpriseCount: number;
} | null> {
  const client = createServiceClient();
  if (!client) return null;

  try {
    const { count: total } = await client.from("leads").select("*", { count: "exact", head: true });
    const { count: xiaohongshu } = await client
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("interested_pack", "xiaohongshu-content-pack");
    const { count: ecommerce } = await client
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("interested_pack", "ecommerce-sales-pack");
    const { count: office } = await client
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("interested_pack", "office-productivity-pack");
    const { count: enterprise } = await client
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("interested_pack", "enterprise-ai-workflow");

    return {
      totalLeads: total ?? 0,
      xiaohongshuCount: xiaohongshu ?? 0,
      ecommerceCount: ecommerce ?? 0,
      officeCount: office ?? 0,
      enterpriseCount: enterprise ?? 0,
    };
  } catch {
    return null;
  }
}

function emptyTrafficStats(status: TrafficDashboardStats["status"]): TrafficDashboardStats {
  return {
    status,
    todayViews: 0,
    last24hViews: 0,
    last7dViews: 0,
    uniqueVisitors7d: 0,
    topPages: [],
    referrers: [],
    devices: [],
    countries: [],
    recentViews: [],
    sampleLimited: false,
  };
}

function normalizeReferrer(referrer: unknown) {
  if (typeof referrer !== "string" || !referrer.trim()) return "直接访问";

  try {
    const url = new URL(referrer);
    const siteHost = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://agentzhan.com").hostname;
    const host = url.hostname.replace(/^www\./, "");
    if (host === siteHost.replace(/^www\./, "")) return "站内跳转";
    if (host.includes("baidu.")) return "百度";
    if (host.includes("google.")) return "Google";
    if (host.includes("bing.")) return "Bing";
    if (host.includes("xiaohongshu.")) return "小红书";
    if (host.includes("douyin.")) return "抖音";
    if (host.includes("weixin.") || host.includes("wechat.")) return "微信";
    return host;
  } catch {
    return "直接访问";
  }
}

function normalizeDevice(deviceType: unknown) {
  switch (deviceType) {
    case "mobile":
      return "手机";
    case "tablet":
      return "平板";
    case "bot":
      return "爬虫/工具";
    case "desktop":
      return "电脑";
    default:
      return "未知";
  }
}

function normalizeCountry(country: unknown) {
  if (typeof country !== "string" || !country.trim()) return "未知地区";
  return country.toUpperCase();
}

function topMetricRows(counter: Map<string, number>, limit: number): TrafficMetricRow[] {
  return Array.from(counter.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export async function getSupabaseTrafficStats(limit = 5000): Promise<TrafficDashboardStats> {
  const client = createServiceClient();
  if (!client) return emptyTrafficStats("not_configured");

  const now = new Date();
  const todayStart = getHongKongDayStartIso(now);
  const last24hStart = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const last7dStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    const { data, error, count } = await client
      .from("page_views")
      .select("id,path,title,referrer,visitor_id,device_type,country,created_at", { count: "exact" })
      .gte("created_at", last7dStart)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      if (error?.code === "42P01") return emptyTrafficStats("table_missing");
      return emptyTrafficStats("error");
    }

    const [todayResult, last24hResult] = await Promise.all([
      client.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", todayStart),
      client.from("page_views").select("*", { count: "exact", head: true }).gte("created_at", last24hStart),
    ]);

    const pageMap = new Map<string, { title: string; views: number; visitors: Set<string> }>();
    const referrerMap = new Map<string, number>();
    const deviceMap = new Map<string, number>();
    const countryMap = new Map<string, number>();
    const visitors = new Set<string>();

    data.forEach((row: SupabaseRow) => {
      const path = typeof row.path === "string" && row.path ? row.path : "/";
      const title = typeof row.title === "string" && row.title ? row.title : path;
      const visitor = typeof row.visitor_id === "string" && row.visitor_id ? row.visitor_id : `view:${row.id}`;
      const page = pageMap.get(path) ?? { title, views: 0, visitors: new Set<string>() };

      page.views += 1;
      page.visitors.add(visitor);
      pageMap.set(path, page);
      visitors.add(visitor);

      const referrer = normalizeReferrer(row.referrer);
      referrerMap.set(referrer, (referrerMap.get(referrer) ?? 0) + 1);

      const device = normalizeDevice(row.device_type);
      deviceMap.set(device, (deviceMap.get(device) ?? 0) + 1);

      const country = normalizeCountry(row.country);
      countryMap.set(country, (countryMap.get(country) ?? 0) + 1);
    });

    const topPages = Array.from(pageMap.entries())
      .map(([path, row]) => ({
        path,
        title: row.title,
        views: row.views,
        visitors: row.visitors.size,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    const recentViews = data.slice(0, 50).map((row: SupabaseRow) => ({
      id: String(row.id),
      path: typeof row.path === "string" && row.path ? row.path : "/",
      title: typeof row.title === "string" && row.title ? row.title : row.path ?? "/",
      referrer: normalizeReferrer(row.referrer),
      deviceType: normalizeDevice(row.device_type),
      country: normalizeCountry(row.country),
      createdAt: row.created_at ?? "",
    }));

    return {
      status: "ready",
      todayViews: todayResult.count ?? data.filter((row: SupabaseRow) => row.created_at >= todayStart).length,
      last24hViews: last24hResult.count ?? data.filter((row: SupabaseRow) => row.created_at >= last24hStart).length,
      last7dViews: count ?? data.length,
      uniqueVisitors7d: visitors.size,
      topPages,
      referrers: topMetricRows(referrerMap, 8),
      devices: topMetricRows(deviceMap, 5),
      countries: topMetricRows(countryMap, 8),
      recentViews,
      sampleLimited: Boolean(count && count > limit),
    };
  } catch {
    return emptyTrafficStats("error");
  }
}

/** Check if we have all env vars needed for Supabase write operations */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_KEY ||
        process.env.SUPABASE_KEY),
  );
}
