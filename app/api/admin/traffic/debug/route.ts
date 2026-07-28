import { NextResponse } from "next/server";

import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SupabaseError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

function summarizeError(error: SupabaseError | null | undefined) {
  if (!error) return null;

  return {
    code: error.code ?? null,
    message: error.message ?? null,
    details: error.details ?? null,
    hint: error.hint ?? null,
  };
}

async function readProbe(client: NonNullable<ReturnType<typeof createServiceClient>>) {
  const [pageViews, generationLogs, prompts] = await Promise.all([
    client.from("page_views").select("id", { count: "exact", head: true }),
    client.from("ai_generation_logs").select("id", { count: "exact", head: true }),
    client.from("prompts").select("id", { count: "exact", head: true }),
  ]);

  return {
    pageViews: { ok: !pageViews.error, count: pageViews.count ?? null, error: summarizeError(pageViews.error) },
    generationLogs: {
      ok: !generationLogs.error,
      count: generationLogs.count ?? null,
      error: summarizeError(generationLogs.error),
    },
    prompts: { ok: !prompts.error, count: prompts.count ?? null, error: summarizeError(prompts.error) },
  };
}

export async function GET() {
  const client = createServiceClient();
  if (!client) {
    return NextResponse.json({
      configured: false,
      message: "Supabase service client is not configured.",
    });
  }

  return NextResponse.json({
    configured: true,
    reads: await readProbe(client),
  });
}

export async function POST() {
  const client = createServiceClient();
  if (!client) {
    return NextResponse.json({
      configured: false,
      message: "Supabase service client is not configured.",
    });
  }

  const probe = {
    generated_count: 0,
    published_count: 0,
    draft_count: 0,
    failed_count: 0,
    summary: "traffic_debug_probe",
    error_message: JSON.stringify({
      path: "/traffic-debug-probe",
      title: "Traffic Debug Probe",
      visitor_id: "debug-probe",
      session_id: "debug-probe",
      referrer: null,
      device_type: "desktop",
      country: "HK",
    }),
  };

  const insert = await client.from("ai_generation_logs").insert(probe).select("id").single();
  let cleanup = null;

  if (!insert.error && insert.data?.id) {
    const removed = await client
      .from("ai_generation_logs")
      .delete()
      .eq("id", insert.data.id)
      .eq("summary", "traffic_debug_probe");

    cleanup = {
      ok: !removed.error,
      error: summarizeError(removed.error),
    };
  }

  return NextResponse.json({
    configured: true,
    reads: await readProbe(client),
    writeProbe: {
      ok: !insert.error,
      id: insert.data?.id ? String(insert.data.id) : null,
      error: summarizeError(insert.error),
      cleanup,
    },
  });
}
