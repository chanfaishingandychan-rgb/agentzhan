import { NextResponse } from "next/server";

import { getPromptBySlugForSite } from "@/lib/prompts-server";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prompt = await getPromptBySlugForSite(slug);
  if (!prompt) {
    return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
  }

  return NextResponse.json({ data: prompt });
}
