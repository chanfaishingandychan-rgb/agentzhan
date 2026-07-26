import { NextResponse } from "next/server";

import { updateAiNewsFromFeeds } from "@/lib/ai-news-updater";

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

  const result = await updateAiNewsFromFeeds();
  const status = result.failedCount > 0 && result.insertedCount === 0 ? 500 : 200;

  return NextResponse.json(
    {
      mode: "daily-ai-news-update",
      schedule: "03:00 Asia/Hong_Kong",
      run_time: new Date().toISOString(),
      ...result,
    },
    { status },
  );
}

export const POST = GET;
