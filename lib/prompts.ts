import prompts from "@/content/prompts.json";
import { categories, difficultyOptions, modelOptions } from "@/lib/site";

export type PromptItem = (typeof prompts)[number] & {
  tier?: string;
};

export type PromptFilters = {
  query?: string;
  category?: string;
  model?: string;
  difficulty?: string;
  tier?: string;
};

export function getAllPrompts(): PromptItem[] {
  return prompts as PromptItem[];
}

export function getPromptBySlug(slug: string): PromptItem | undefined {
  return (prompts as PromptItem[]).find((item) => item.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((item) => item.slug === slug);
}

export function getPromptsByCategory(slug: string) {
  return (prompts as PromptItem[]).filter((item) => item.category.slug === slug);
}

export function getLatestPrompts(limit = 8) {
  return [...(prompts as PromptItem[])]
    .sort((a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)))
    .slice(0, limit);
}

export function getPopularPrompts(limit = 8) {
  return [...(prompts as PromptItem[])].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export function getRelatedPrompts(current: PromptItem, limit = 6) {
  return (prompts as PromptItem[])
    .filter((item) => item.slug !== current.slug && item.category.slug === current.category.slug)
    .slice(0, limit);
}

/** Apply text search + filters. Filters that match "all" are ignored. */
export function filterPrompts(filters: PromptFilters): PromptItem[] {
  const all = prompts as PromptItem[];
  let results = [...all];

  // Text search
  const q = (filters.query ?? "").trim().toLowerCase();
  if (q) {
    results = results.filter((item) =>
      [
        item.title,
        item.summary,
        item.category.name,
        item.tags.join(" "),
        item.useCases.join(" "),
        item.bestPractices.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }

  // Category filter
  if (filters.category && filters.category !== "all") {
    results = results.filter((item) => item.category.slug === filters.category);
  }

  // Model filter
  if (filters.model && filters.model !== "all") {
    results = results.filter((item) => item.model === filters.model);
  }

  // Difficulty filter
  if (filters.difficulty && filters.difficulty !== "all") {
    results = results.filter((item) => item.difficulty === filters.difficulty);
  }

  // Tier filter
  if (filters.tier && filters.tier !== "all") {
    results = results.filter((item) => item.tier === filters.tier);
  }

  return results;
}

/** Keep for backward compat – SearchBar still uses this on /search */
export function searchPrompts(query: string) {
  return filterPrompts({ query });
}

export function getHotTags(limit = 18) {
  const tagMap = new Map<string, number>();
  for (const item of prompts as PromptItem[]) {
    for (const tag of item.tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }
  return [...tagMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}

/** For filter bar: unique models from data (ordered as in site config) */
export function getAvailableModels(): string[] {
  const set = new Set((prompts as PromptItem[]).map((p) => p.model));
  return modelOptions.filter((m) => set.has(m));
}

export function getAvailableDifficulties(): string[] {
  const set = new Set((prompts as PromptItem[]).map((p) => p.difficulty));
  return difficultyOptions.filter((d) => set.has(d));
}
