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

export type LeadRow = {
  id: string;
  email: string;
  source: string;
  interestedPack: string;
  status: string;
  createdAt: string;
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

/** Check if we have all env vars needed for Supabase write operations */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_KEY ||
        process.env.SUPABASE_KEY),
  );
}
