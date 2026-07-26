import type { MetadataRoute } from "next";

import { getAllPrompts } from "@/lib/prompts";
import { categories, siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const promptEntries = getAllPrompts().map((prompt) => ({
    url: `${siteConfig.url}/prompt/${prompt.slug}`,
    lastModified: prompt.publishedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryEntries = categories.map((category) => ({
    url: `${siteConfig.url}/category/${category.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteConfig.url,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/search`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...categoryEntries,
    ...promptEntries,
  ];
}

