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
        summary: "缺少 AI API Key，無法測試生成。建議在 Vercel 環境變數中設定 DEEPSEEK_API_KEY。",
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
        summary: `${provider ?? "AI"} 呼叫失敗：${error}。網站本身不受影響。`,
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
      ? "測試成功。正式 cron 觸發時會寫入 Supabase。"
      : "測試成功。但 Supabase 未設定，正式 cron 不會寫入資料庫。",
  });
}
