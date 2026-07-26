import {
  filterPromptItems,
  getAllPrompts,
  getLatestPrompts,
  getPromptBySlug,
  getRelatedPrompts,
  type PromptFilters,
  type PromptItem,
} from "@/lib/prompts";
import { categories } from "@/lib/site";
import { createServiceClient } from "@/lib/supabase/server";

type SupabasePromptRow = {
  title: string;
  slug: string;
  summary: string | null;
  seo_title: string | null;
  seo_description: string | null;
  category_slug: string | null;
  tags: string[] | null;
  difficulty: string | null;
  model: string | null;
  tier: string | null;
  prompt_content: string | null;
  instructions: string[] | null;
  use_cases: string[] | null;
  best_practices: string[] | null;
  example: string | null;
  expected_result: string | null;
  use_scene: string | null;
  faq: Array<{ question: string; answer: string }> | null;
  popularity: number | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const promptSelect = [
  "title",
  "slug",
  "summary",
  "seo_title",
  "seo_description",
  "category_slug",
  "tags",
  "difficulty",
  "model",
  "tier",
  "prompt_content",
  "instructions",
  "use_cases",
  "best_practices",
  "example",
  "expected_result",
  "use_scene",
  "faq",
  "popularity",
  "published_at",
  "created_at",
  "updated_at",
].join(",");

function normalizeFaq(value: SupabasePromptRow["faq"]) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item?.question && item?.answer);
}

function toPromptItem(row: SupabasePromptRow): PromptItem {
  const category = categories.find((item) => item.slug === row.category_slug) ?? {
    slug: row.category_slug ?? "ai-writing",
    name: row.category_slug ?? "AI写作",
    description: "",
    intro: "",
  };
  const title = row.title;
  const summary = row.summary ?? "";

  return {
    slug: row.slug,
    title,
    summary,
    seoTitle: row.seo_title ?? `${title} - Agent站`,
    seoDescription: row.seo_description ?? summary,
    category,
    tags: row.tags ?? [],
    difficulty: row.difficulty ?? "入门",
    model: row.model ?? "ChatGPT",
    useScene: row.use_scene ?? "",
    useCases: row.use_cases ?? [],
    prompt: row.prompt_content ?? "",
    instructions: row.instructions ?? [],
    example: row.example ?? "",
    expectedResult: row.expected_result ?? "",
    faq: normalizeFaq(row.faq),
    bestPractices: row.best_practices ?? [],
    tier: row.tier ?? "free",
    popularity: row.popularity ?? 0,
    publishedAt: row.published_at ?? row.created_at ?? row.updated_at ?? new Date(0).toISOString(),
  } as PromptItem;
}

async function getSupabasePrompts(limit = 300): Promise<PromptItem[] | null> {
  const client = createServiceClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("prompts")
      .select(promptSelect)
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return null;
    return (data as unknown as SupabasePromptRow[]).map(toPromptItem);
  } catch {
    return null;
  }
}

function mergeWithStatic(prompts: PromptItem[]) {
  const seen = new Set(prompts.map((item) => item.slug));
  return [...prompts, ...getAllPrompts().filter((item) => !seen.has(item.slug))];
}

export async function getLatestPromptsForSite(limit = 8): Promise<PromptItem[]> {
  const dbPrompts = await getSupabasePrompts(limit);
  if (!dbPrompts || dbPrompts.length === 0) return getLatestPrompts(limit);
  return mergeWithStatic(dbPrompts)
    .sort((a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)))
    .slice(0, limit);
}

export async function getPromptBySlugForSite(slug: string): Promise<PromptItem | undefined> {
  const client = createServiceClient();
  if (!client) return getPromptBySlug(slug);

  try {
    const { data, error } = await client
      .from("prompts")
      .select(promptSelect)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) return getPromptBySlug(slug);
    return toPromptItem(data as unknown as SupabasePromptRow);
  } catch {
    return getPromptBySlug(slug);
  }
}

export async function getRelatedPromptsForSite(current: PromptItem, limit = 6): Promise<PromptItem[]> {
  const dbPrompts = await getSupabasePrompts(300);
  if (!dbPrompts || dbPrompts.length === 0) return getRelatedPrompts(current, limit);

  return mergeWithStatic(dbPrompts)
    .filter((item) => item.slug !== current.slug && item.category.slug === current.category.slug)
    .slice(0, limit);
}

export async function filterPromptsForSite(filters: PromptFilters): Promise<PromptItem[]> {
  const dbPrompts = await getSupabasePrompts(300);
  if (!dbPrompts || dbPrompts.length === 0) return filterPromptItems(getAllPrompts(), filters);

  return filterPromptItems(mergeWithStatic(dbPrompts), filters);
}

export async function searchPromptsForSite(query: string): Promise<PromptItem[]> {
  return filterPromptsForSite({ query });
}
