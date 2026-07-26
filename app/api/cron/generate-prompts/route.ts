import { NextResponse } from "next/server";

import { createServiceClient } from "@/lib/supabase/server";
import { generatePromptsWithOpenAI, getConfiguredAIProvider, isOpenAIConfigured } from "@/lib/openai";
import { isSupabaseConfigured } from "@/lib/admin";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  const url = new URL(request.url);
  return auth === `Bearer ${secret}` || url.searchParams.get("secret") === secret;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
  }

  const supabaseOk = isSupabaseConfigured();
  const aiOk = isOpenAIConfigured();
  const aiProvider = getConfiguredAIProvider();
  const client = createServiceClient();

  if (!aiOk) {
    return NextResponse.json(
      {
        error: `${aiProvider.missingKey} is not configured`,
        summary: "缺少 AI API Key 環境變數，無法生成新 Prompt。建議設定 DEEPSEEK_API_KEY。",
      },
      { status: 500 },
    );
  }

  // Gather existing slugs (from Supabase if available, else from JSON)
  const existingSlugs = new Set<string>();
  if (client) {
    try {
      const { data } = await client.from("prompts").select("slug").limit(1000);
      data?.forEach((row: Record<string, unknown>) => existingSlugs.add(String(row.slug)));
    } catch {
      // fallback to empty
    }
  }

  // Call the configured AI provider
  const { prompts, rawResponse, error, provider } = await generatePromptsWithOpenAI(existingSlugs);

  if (error) {
    // Log the failure if Supabase is available
    if (client) {
      await client.from("ai_generation_logs").insert({
        run_time: new Date().toISOString(),
        generated_count: 0,
        published_count: 0,
        draft_count: 0,
        failed_count: 5,
        error_message: error,
        summary: `${provider ?? "AI"} 生成失敗：${error}`,
      });
    }

    return NextResponse.json(
      {
        error,
        raw_response: rawResponse,
        summary: `${provider ?? "AI"} 呼叫失敗。網站本身不受影響。`,
      },
      { status: 500 },
    );
  }

  // Classify
  const published = prompts.filter((p) => p.qualityScore >= 7);
  const drafts = prompts.filter((p) => p.qualityScore < 7);

  let publishedCount = 0;
  let draftCount = 0;
  let failedCount = 0;

  // Write to Supabase if configured
  if (client && supabaseOk) {
    const toInsert = prompts.map((p) => ({
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      seo_title: p.seoTitle,
      seo_description: p.seoDescription,
      category_slug: p.categorySlug,
      tags: p.tags,
      difficulty: p.difficulty,
      model: p.model,
      tier: p.tier,
      status: p.qualityScore >= 7 ? "published" : "draft",
      quality_score: p.qualityScore,
      prompt_content: p.promptContent,
      instructions: p.instructions,
      use_cases: p.useCases,
      best_practices: p.bestPractices,
      example: p.example,
      expected_result: p.expectedResult,
      use_scene: p.useScene,
      faq: p.faq,
      published_at: p.qualityScore >= 7 ? new Date().toISOString() : null,
    }));

    for (const row of toInsert) {
      const { error: insertErr } = await client.from("prompts").insert(row);
      if (insertErr) {
        failedCount++;
      } else if (row.status === "published") {
        publishedCount++;
      } else {
        draftCount++;
      }
    }

    // Insert quality scores
    const scoreRows = prompts.map((p) => ({
      prompt_slug: p.slug,
      prompt_title: p.title,
      score: p.qualityScore,
      reason: p.qualityScore >= 8 ? "內容完整度高，可直接發布" : p.qualityScore >= 7 ? "內容可用，建議人工複審" : "品質不足，需人工編輯",
    }));
    await client.from("prompt_quality_scores").insert(scoreRows);

    // Log
    await client.from("ai_generation_logs").insert({
      run_time: new Date().toISOString(),
      generated_count: prompts.length,
      published_count: publishedCount,
      draft_count: draftCount,
      failed_count: failedCount,
      error_message: null,
      summary: `成功生成 ${prompts.length} 條，發布 ${publishedCount} 條，草稿 ${draftCount} 條。`,
      details: prompts.map((p) => ({ slug: p.slug, score: p.qualityScore, status: p.qualityScore >= 7 ? "published" : "draft" })),
    });
  } else {
    // No Supabase — just count for response
    publishedCount = published.length;
    draftCount = drafts.length;
  }

  return NextResponse.json({
    mode: supabaseOk ? "live-database-write" : "preview-no-database-write",
    ai_provider: provider ?? aiProvider.name,
    ai_model: aiProvider.model,
    run_time: new Date().toISOString(),
    generated_count: prompts.length,
    published_count: publishedCount,
    draft_count: draftCount,
    failed_count: failedCount,
    summary: supabaseOk
      ? `成功生成 ${prompts.length} 條 Prompt，已寫入 Supabase。`
      : "AI 生成成功，但 Supabase 未設定，資料未寫入資料庫。",
    data: prompts.map((p) => ({
      title: p.title,
      slug: p.slug,
      qualityScore: p.qualityScore,
      status: p.qualityScore >= 7 ? "published" : "draft",
    })),
  });
}

export const POST = GET;
