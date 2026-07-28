import { NextResponse } from "next/server";

import { updateAiNewsFromFeeds } from "@/lib/ai-news-updater";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const result = await updateAiNewsFromFeeds();
  const redirectUrl = new URL("/admin/logs", request.url);

  redirectUrl.searchParams.set(
    "newsUpdate",
    result.failedCount > 0 && result.insertedCount === 0 ? "error" : "ok",
  );
  redirectUrl.searchParams.set("fetched", String(result.fetchedCount));
  redirectUrl.searchParams.set("inserted", String(result.insertedCount));
  redirectUrl.searchParams.set("failed", String(result.failedCount));

  return NextResponse.redirect(redirectUrl, { status: 303 });
}

export function GET() {
  return NextResponse.json(
    { error: "Use POST from the admin logs page to run this task." },
    { status: 405 },
  );
}
