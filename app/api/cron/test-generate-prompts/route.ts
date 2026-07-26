import { NextResponse } from "next/server";

import { buildGenerationCandidates, getSystemReadiness } from "@/lib/admin";

export async function GET() {
  const candidates = buildGenerationCandidates();
  return NextResponse.json({
    mode: "manual-test-preview",
    run_time: new Date().toISOString(),
    generated_count: candidates.length,
    published_count: candidates.filter((item) => item.status === "published").length,
    draft_count: candidates.filter((item) => item.status === "draft").length,
    failed_count: 0,
    readiness: getSystemReadiness(),
    data: candidates,
    summary: "手动测试生成成功。当前接口用于验证主题、评分、草稿/发布判断，尚未写入数据库。",
  });
}
