import type { MetadataRoute } from "next";

import { getAllCollections } from "@/lib/collections";
import { industries } from "@/lib/industries";
import { getLatestAiNewsForSite } from "@/lib/news";
import { getAllPrompts } from "@/lib/prompts";
import { allSkills } from "@/lib/skills";
import { categories, siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const industryEntries = industries.map((industry) => ({
    url: `${siteConfig.url}/industry/${industry.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.78,
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

  const newsEntries = await getLatestAiNewsForSitemap();

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
      url: `${siteConfig.url}/news`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${siteConfig.url}/collections`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/consulting`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.82,
    },
    {
      url: `${siteConfig.url}/products/codex-deepseek-mac-installer`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.86,
    },
    ...skillEntries,
    ...newsEntries,
    ...collectionEntries,
    ...industryEntries,
    ...categoryEntries,
    ...promptEntries,
  ];
}

async function getLatestAiNewsForSitemap() {
  try {
    const news = await getLatestAiNewsForSite(20);
    return news.map((item) => ({
      url: `${siteConfig.url}/news/${item.slug}`,
      lastModified: item.publishedAt,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}
