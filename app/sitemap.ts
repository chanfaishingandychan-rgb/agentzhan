import type { MetadataRoute } from "next";

import { getAllCollections } from "@/lib/collections";
import { getAllPrompts } from "@/lib/prompts";
import { allSkills } from "@/lib/skills";
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

  const collectionEntries = getAllCollections().map((collection) => ({
    url: `${siteConfig.url}/collections/${collection.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const skillEntries = allSkills.map((skill) => ({
    url: `${siteConfig.url}/skills/${skill.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
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
    {
      url: `${siteConfig.url}/skills`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/collections`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...skillEntries,
    ...collectionEntries,
    ...categoryEntries,
    ...promptEntries,
  ];
}
