import { NextResponse, type NextRequest } from "next/server";

import { getCommunityQuestions } from "@/lib/community";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const allowedTopics = new Set(["模型选择", "提示词", "插件安装", "工作流", "网站运营", "AI工具", "其他问题"]);

function sanitizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export async function GET() {
  const data = await getCommunityQuestions(30);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const client = createServiceClient();
  if (!client) {
    return NextResponse.json({ error: "留言暂时无法保存，请稍后再试。" }, { status: 503 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误。" }, { status: 400 });
  }

  const honeypot = sanitizeText(payload.website, 120);
  if (honeypot) return NextResponse.json({ ok: true });

  const name = sanitizeText(payload.name, 24) || "匿名用户";
  const topicInput = sanitizeText(payload.topic, 24);
  const topic = allowedTopics.has(topicInput) ? topicInput : "其他问题";
  const question = sanitizeText(payload.question, 500);

  if (question.length < 6) {
    return NextResponse.json({ error: "问题太短，请写清楚一点。" }, { status: 400 });
  }

  const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;
  const country = request.headers.get("x-vercel-ip-country")?.slice(0, 2) ?? null;

  const { error } = await client.from("ai_generation_logs").insert({
    generated_count: 0,
    published_count: 0,
    draft_count: 0,
    failed_count: 0,
    summary: "community_question",
    details: {
      name,
      topic,
      question,
      country,
      userAgent,
    },
  });

  if (error) {
    return NextResponse.json({ error: "保存失败，请稍后再试。" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    question: {
      id: crypto.randomUUID(),
      name,
      topic,
      question,
      createdAt: new Date().toISOString(),
      country,
    },
  });
}
