import { NextResponse } from "next/server";

import { getPromptBySlug } from "@/lib/prompts";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);
  if (!prompt) {
    return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
  }

  return NextResponse.json({ data: prompt });
}
