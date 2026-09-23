import type { MetadataRoute } from "next";

import { getAllCollections } from "@/lib/collections";
import { exampleCases } from "@/lib/examples";
import { getAllGuides } from "@/lib/guides";
import { industries } from "@/lib/industries";
import { learnTasks } from "@/lib/learn";
import { getLatestAiNewsForSite } from "@/lib/news";
import { getAllNovels } from "@/lib/novels";
import { originalSkillProducts } from "@/lib/original-skill-products";
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

  const guideEntries = getAllGuides().map((guide) => ({
    url: `${siteConfig.url}/guides/${guide.slug}`,
    lastModified: guide.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.83,
  }));

  const skillEntries = allSkills.map((skill) => ({
    url: `${siteConfig.url}/skills/${skill.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const newsEntries = await getLatestAiNewsForSitemap();
  const learnEntries = learnTasks.map((task) => ({
    url: `${siteConfig.url}/learn/${task.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.82,
  }));
  const novelEntries = getAllNovels().flatMap((novel) => [
    {
      url: `${siteConfig.url}/novels/${novel.slug}`,
      lastModified: novel.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.78,
    },
  ]);
  const originalSkillProductEntries = originalSkillProducts.map((product) => ({
    url: `${siteConfig.url}${product.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.86,
  }));
  const exampleEntries = exampleCases.map((example) => ({
    url: `${siteConfig.url}/examples/${example.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.82,
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
      url: `${siteConfig.url}/start-here`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.92,
    },
    {
      url: `${siteConfig.url}/agents`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.94,
    },
    {
      url: `${siteConfig.url}/zh-hk/agents`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.86,
    },
    {
      url: `${siteConfig.url}/zh-cn/agents`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.86,
    },
    {
      url: `${siteConfig.url}/examples`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...exampleEntries,
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
      url: `${siteConfig.url}/learn`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.88,
    },
    {
      url: `${siteConfig.url}/guides`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/free-ai-pack`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
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
      url: `${siteConfig.url}/services/chatgpt-setup`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.86,
    },
    {
      url: `${siteConfig.url}/community`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: 0.82,
    },
    {
      url: `${siteConfig.url}/novels`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.84,
    },
    {
      url: `${siteConfig.url}/products/codex-deepseek-mac-installer`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.86,
    },
    {
      url: `${siteConfig.url}/products/ai-office-prompt-pack`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.86,
    },
    {
      url: `${siteConfig.url}/products/ai-skill-install-service`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.86,
    },
    {
      url: `${siteConfig.url}/products/agentzhan-original-skills`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.86,
    },
    {
      url: `${siteConfig.url}/products/agentzhan-website-operator-skill`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 0.86,
    },
    ...originalSkillProductEntries,
    ...skillEntries,
    ...guideEntries,
    ...learnEntries,
    ...novelEntries,
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
