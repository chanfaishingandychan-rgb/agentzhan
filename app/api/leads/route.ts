import { NextResponse, type NextRequest } from "next/server";

import { createServiceClient } from "@/lib/supabase/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const allowedPacks = new Set([
  "free-prompt-pack",
  "xiaohongshu-content-pack",
  "ecommerce-sales-pack",
  "office-productivity-pack",
  "enterprise-ai-workflow",
]);

function sanitizeText(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim().slice(0, 120);
  return trimmed || fallback;
}

export async function POST(request: NextRequest) {
  const client = createServiceClient();
  if (!client) {
    return NextResponse.json(
      { error: "Supabase 尚未配置，暂时无法保存领取资料。" },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误。" }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;
  const email = sanitizeText(body.email, "").toLowerCase();
  const interestedPack = sanitizeText(body.interestedPack, "free-prompt-pack");
  const source = sanitizeText(body.source, "homepage");

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "请输入正确的邮箱地址。" }, { status: 400 });
  }

  if (!allowedPacks.has(interestedPack)) {
    return NextResponse.json({ error: "领取项目无效。" }, { status: 400 });
  }

  const { error } = await client.from("leads").upsert(
    {
      email,
      source,
      interested_pack: interestedPack,
      user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
    },
    { onConflict: "email,interested_pack" },
  );

  if (error) {
    return NextResponse.json({ error: "保存失败，请稍后再试。" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: "领取成功。我们已记录你的邮箱。",
  });
}
