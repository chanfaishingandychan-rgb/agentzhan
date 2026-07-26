import { NextResponse } from "next/server";

import { filterPromptsForSite } from "@/lib/prompts-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const results = await filterPromptsForSite({
    query,
    category: searchParams.get("category") ?? undefined,
    model: searchParams.get("model") ?? undefined,
    difficulty: searchParams.get("difficulty") ?? undefined,
    tier: searchParams.get("tier") ?? undefined,
  });

  return NextResponse.json({
    query,
    count: results.length,
    data: results,
  });
}
