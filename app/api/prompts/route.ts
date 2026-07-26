import { NextResponse } from "next/server";

import { filterPromptsForSite } from "@/lib/prompts-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prompts = await filterPromptsForSite({
    query: searchParams.get("q") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    model: searchParams.get("model") ?? undefined,
    difficulty: searchParams.get("difficulty") ?? undefined,
    tier: searchParams.get("tier") ?? undefined,
  });

  return NextResponse.json({
    data: prompts,
    count: prompts.length,
  });
}
