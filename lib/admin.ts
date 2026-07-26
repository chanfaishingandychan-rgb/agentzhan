import { categories, difficultyOptions, modelOptions } from "@/lib/site";
import { getAllPrompts, type PromptItem } from "@/lib/prompts";

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

export function getAdminPromptRows(limit?: number) {
  const rows = getAllPrompts().map(toAdminPromptRow);
  return typeof limit === "number" ? rows.slice(0, limit) : rows;
}

export function getAdminStats() {
  const prompts = getAdminPromptRows();
  const vipCount = prompts.filter((item) => item.tier === "vip").length;
  return {
    totalPrompts: prompts.length,
    publishedCount: prompts.filter((item) => item.status === "published").length,
    draftCount: prompts.filter((item) => item.status === "draft").length,
    vipCount,
    freeCount: prompts.length - vipCount,
    categoryCount: categories.length,
    modelCount: new Set(prompts.map((item) => item.model)).size,
  };
}

export function buildGenerationCandidates(): GenerationCandidate[] {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  const sourceCategories = [
    { category: "AI写作", topic: "公众号选题拆解", model: "ChatGPT" },
    { category: "AI办公", topic: "Excel销售数据复盘", model: "Claude" },
    { category: "AI营销", topic: "小红书投放文案测试", model: "DeepSeek" },
    { category: "AI效率工具", topic: "Cursor代码重构计划", model: "ChatGPT" },
    { category: "AI短视频", topic: "抖音直播复盘脚本", model: "通义千问" },
  ];

  return sourceCategories.map((item, index) => {
    const qualityScore = index === 4 ? 6 : 8 + (index % 2);
    const status = qualityScore >= 7 ? "published" : "draft";
    return {
      title: `${item.topic}提示词`,
      slug: `auto-${date}-${index + 1}`,
      description: `适合中文用户直接复制使用的${item.topic}提示词，帮助快速完成真实工作任务。`,
      prompt_content: `你是一名资深${item.category}顾问，请围绕“${item.topic}”生成一份可直接执行的中文方案。请先确认目标、用户、限制条件，再输出结构化步骤、示例内容、风险提醒和下一步优化建议。`,
      use_case: item.topic,
      category: item.category,
      model: item.model,
      difficulty: difficultyOptions[index % difficultyOptions.length],
      tags: [item.category, item.model, item.topic, "中文提示词"],
      is_vip: index === 3,
      seo_title: `${item.topic}提示词 - Agent站`,
      seo_description: `查看${item.topic}中文提示词，适合${item.model}等模型使用，包含场景、方法、案例和优化建议。`,
      faq: [
        {
          question: "这个提示词可以直接复制吗？",
          answer: "可以。建议补充你的业务背景、目标用户和输出渠道，效果会更稳定。",
        },
      ],
      quality_score: qualityScore,
      status,
    };
  });
}

export function getMockGenerationLogs(): GenerationLog[] {
  const candidates = buildGenerationCandidates();
  return [
    {
      id: "latest-preview",
      run_time: new Date().toISOString(),
      generated_count: candidates.length,
      published_count: candidates.filter((item) => item.status === "published").length,
      draft_count: candidates.filter((item) => item.status === "draft").length,
      failed_count: 0,
      error_message: null,
      summary: "测试生成任务已完成。当前为无数据库预览模式，内容不会写入线上数据表。",
    },
  ];
}

export function getSystemReadiness() {
  return {
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    openaiApiKey: Boolean(process.env.OPENAI_API_KEY),
    cronSecret: Boolean(process.env.CRON_SECRET),
    adminPassword: Boolean(process.env.ADMIN_PASSWORD),
    models: modelOptions,
  };
}
