import prompts from "@/content/prompts.json";
import { categories } from "@/lib/site";

export type PromptItem = (typeof prompts)[number];

export function getAllPrompts(): PromptItem[] {
  return prompts;
}

export function getPromptBySlug(slug: string): PromptItem | undefined {
  return prompts.find((item) => item.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((item) => item.slug === slug);
}

export function getPromptsByCategory(slug: string) {
  return prompts.filter((item) => item.category.slug === slug);
}

export function getLatestPrompts(limit = 8) {
  return [...prompts]
    .sort((a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)))
    .slice(0, limit);
}

export function getPopularPrompts(limit = 8) {
  return [...prompts].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export function getRelatedPrompts(current: PromptItem, limit = 6) {
  return prompts
    .filter((item) => item.slug !== current.slug && item.category.slug === current.category.slug)
    .slice(0, limit);
}

export function searchPrompts(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return prompts;
  return prompts.filter((item) =>
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
      .includes(normalized),
  );
}

export function getHotTags(limit = 18) {
  const tagMap = new Map<string, number>();
  for (const item of prompts) {
    for (const tag of item.tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }
  return [...tagMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}

