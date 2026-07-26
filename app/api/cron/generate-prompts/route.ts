import { NextResponse } from "next/server";

import { buildGenerationCandidates, getSystemReadiness } from "@/lib/admin";

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

  const readiness = getSystemReadiness();
  const candidates = buildGenerationCandidates();
  const published = candidates.filter((item) => item.status === "published");
  const drafts = candidates.filter((item) => item.status === "draft");
  const configuredForWrite = readiness.supabaseUrl && readiness.supabaseServiceRole && readiness.openaiApiKey;

  return NextResponse.json({
    mode: configuredForWrite ? "ready-for-database-write" : "preview-no-database-write",
    run_time: new Date().toISOString(),
    generated_count: candidates.length,
    published_count: published.length,
    draft_count: drafts.length,
    failed_count: 0,
    readiness,
    data: candidates,
    summary: configuredForWrite
      ? "环境变量已具备写入条件。下一步接入 Supabase insert 与 OpenAI 真实生成。"
      : "当前缺少 Supabase/OpenAI 环境变量，本次只生成预览数据，不会写入数据库。",
  });
}

export const POST = GET;
