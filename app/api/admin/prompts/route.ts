import { NextResponse } from "next/server";

import { createServiceClient } from "@/lib/supabase/server";
import { getAdminPromptRows, getAdminStats, isSupabaseConfigured } from "@/lib/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 50);

  if (isSupabaseConfigured()) {
    const client = createServiceClient();
    if (client) {
      try {
        const { data, error, count } = await client
          .from("prompts")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .limit(limit);

        if (!error && data) {
          return NextResponse.json({
            stats: {
              totalPrompts: count ?? data.length,
              publishedCount: data.filter((r: Record<string, unknown>) => r.status === "published").length,
              draftCount: data.filter((r: Record<string, unknown>) => r.status === "draft").length,
              vipCount: data.filter((r: Record<string, unknown>) => r.tier === "vip").length,
              freeCount: data.filter((r: Record<string, unknown>) => r.tier !== "vip").length,
              categoryCount: new Set(data.map((r: Record<string, unknown>) => r.category_slug)).size,
              modelCount: new Set(data.map((r: Record<string, unknown>) => r.model)).size,
            },
            data: data.map((row: Record<string, unknown>) => ({
              id: String(row.id),
              title: row.title,
              slug: row.slug,
              description: row.summary ?? "",
              category: row.category_slug ?? "",
              model: row.model ?? "",
              difficulty: row.difficulty ?? "",
              tier: row.tier ?? "free",
              status: row.status ?? "draft",
              qualityScore: row.quality_score ?? 0,
              copyCount: row.copy_count ?? 0,
              viewCount: row.view_count ?? 0,
              updatedAt: row.updated_at ?? row.created_at,
            })),
          });
        }
      } catch {
        // Fallback to static
      }
    }
  }

  // Static fallback
  return NextResponse.json({
    stats: getAdminStats(),
    data: getAdminPromptRows(limit),
  });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Database is not configured yet.", message: "請先設定 Supabase 環境變數。" },
      { status: 501 },
    );
  }

  const client = createServiceClient();
  if (!client) {
    return NextResponse.json({ error: "Supabase client unavailable" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { error } = await client.from("prompts").insert({
      title: body.title,
      slug: body.slug || `manual-${Date.now()}`,
      summary: body.summary ?? "",
      seo_title: body.seoTitle ?? body.title,
      seo_description: body.seoDescription ?? "",
      category_slug: body.categorySlug ?? body.category,
      tags: body.tags ?? [],
      difficulty: body.difficulty ?? "入門",
      model: body.model ?? "ChatGPT",
      tier: body.tier ?? "free",
      status: body.status ?? "draft",
      quality_score: body.qualityScore ?? 0,
      prompt_content: body.promptContent ?? "",
      instructions: body.instructions ?? [],
      use_cases: body.useCases ?? [],
      best_practices: body.bestPractices ?? [],
      example: body.example ?? "",
      expected_result: body.expectedResult ?? "",
      use_scene: body.useScene ?? "",
      faq: body.faq ?? [],
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Database is not configured yet." },
      { status: 501 },
    );
  }

  const client = createServiceClient();
  if (!client) {
    return NextResponse.json({ error: "Supabase client unavailable" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { error } = await client
      .from("prompts")
      .update({
        title: body.title,
        summary: body.summary,
        seo_title: body.seoTitle,
        seo_description: body.seoDescription,
        category_slug: body.categorySlug ?? body.category,
        tags: body.tags,
        difficulty: body.difficulty,
        model: body.model,
        tier: body.tier,
        status: body.status,
        quality_score: body.qualityScore,
        prompt_content: body.promptContent,
        instructions: body.instructions,
        use_cases: body.useCases,
        best_practices: body.bestPractices,
        example: body.example,
        expected_result: body.expectedResult,
        use_scene: body.useScene,
        faq: body.faq,
      })
      .eq("slug", body.slug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Database is not configured yet." },
      { status: 501 },
    );
  }

  const client = createServiceClient();
  if (!client) {
    return NextResponse.json({ error: "Supabase client unavailable" }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
    }

    const { error } = await client.from("prompts").delete().eq("slug", slug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
