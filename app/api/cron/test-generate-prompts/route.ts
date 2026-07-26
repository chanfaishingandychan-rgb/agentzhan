import { NextResponse } from "next/server";

import { generatePromptsWithOpenAI, getConfiguredAIProvider, isOpenAIConfigured } from "@/lib/openai";
import { isSupabaseConfigured, getSystemReadiness } from "@/lib/admin";

export async function GET() {
  const readiness = getSystemReadiness();
  const aiOk = isOpenAIConfigured();
  const aiProvider = getConfiguredAIProvider();
  const supabaseOk = isSupabaseConfigured();

  if (!aiOk) {
    return NextResponse.json(
      {
        error: `${aiProvider.missingKey} is not configured`,
        summary: "缺少 AI API Key，无法测试生成。建议在 Vercel 环境变量中设置 DEEPSEEK_API_KEY。",
        readiness,
      },
      { status: 500 },
    );
  }

  // Call AI provider with empty slug set (test mode — won't write to DB)
  const { prompts, rawResponse, error, provider } = await generatePromptsWithOpenAI(new Set());

  if (error) {
    return NextResponse.json(
      {
        error,
        raw_response: rawResponse?.slice(0, 1000),
        summary: `${provider ?? "AI"} 调用失败：${error}。网站本身不受影响。`,
        readiness,
      },
      { status: 500 },
    );
  }

  const published = prompts.filter((p) => p.qualityScore >= 7);
  const drafts = prompts.filter((p) => p.qualityScore < 7);

  return NextResponse.json({
    mode: "manual-test",
    supabase_configured: supabaseOk,
    ai_configured: aiOk,
    ai_provider: provider ?? aiProvider.name,
    ai_model: aiProvider.model,
    run_time: new Date().toISOString(),
    generated_count: prompts.length,
    published_count: published.length,
    draft_count: drafts.length,
    failed_count: 0,
    readiness,
    data: prompts.map((p) => ({
      title: p.title,
      slug: p.slug,
      category: p.categorySlug,
      model: p.model,
      difficulty: p.difficulty,
      tier: p.tier,
      qualityScore: p.qualityScore,
      status: p.qualityScore >= 7 ? "published" : "draft",
      prompt_preview: p.promptContent.slice(0, 300) + "...",
    })),
    summary: supabaseOk
      ? "测试成功。正式 cron 触发时会写入 Supabase。"
      : "测试成功。但 Supabase 未设置，正式 cron 不会写入数据库。",
  });
}
