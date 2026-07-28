import { NextResponse, type NextRequest } from "next/server";

import { toCommunityReply } from "@/lib/community";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function sanitizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export async function POST(request: NextRequest) {
  const client = createServiceClient();
  if (!client) {
    return NextResponse.json({ error: "回应暂时无法保存，请稍后再试。" }, { status: 503 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误。" }, { status: 400 });
  }

  const honeypot = sanitizeText(payload.website, 120);
  if (honeypot) return NextResponse.json({ ok: true });

  const threadId = sanitizeText(payload.threadId, 80);
  const name = sanitizeText(payload.name, 24) || "匿名用户";
  const reply = sanitizeText(payload.reply, 500);

  if (!threadId) {
    return NextResponse.json({ error: "找不到要回应的问题。" }, { status: 400 });
  }

  if (reply.length < 2) {
    return NextResponse.json({ error: "回应太短，请写清楚一点。" }, { status: 400 });
  }

  const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;
  const country = request.headers.get("x-vercel-ip-country")?.slice(0, 2) ?? null;

  const { data, error } = await client
    .from("ai_generation_logs")
    .insert({
      generated_count: 0,
      published_count: 0,
      draft_count: 0,
      failed_count: 0,
      summary: "community_reply",
      details: {
        threadId,
        name,
        reply,
        country,
        userAgent,
      },
    })
    .select("id, summary, run_time, created_at, details")
    .single();

  const savedReply = data ? toCommunityReply(data) : null;

  if (error || !savedReply) {
    return NextResponse.json({ error: "保存失败，请稍后再试。" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    reply: savedReply,
  });
}
