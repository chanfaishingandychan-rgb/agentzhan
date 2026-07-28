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

function getSupabaseKeyMetadata() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_KEY ||
    "";
  const source = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? "SUPABASE_SERVICE_ROLE_KEY"
    : process.env.SUPABASE_SERVICE_KEY
      ? "SUPABASE_SERVICE_KEY"
      : process.env.SUPABASE_KEY
        ? "SUPABASE_KEY"
        : null;

  try {
    const payload = key.split(".")[1];
    if (!payload) {
      return { source, role: null, issuer: null, reference: null };
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(Buffer.from(normalized, "base64").toString("utf8"));

    return {
      source,
      role: typeof decoded.role === "string" ? decoded.role : null,
      issuer: typeof decoded.iss === "string" ? decoded.iss : null,
      reference: typeof decoded.ref === "string" ? decoded.ref : null,
    };
  } catch {
    return { source, role: null, issuer: null, reference: null };
  }
}

async function readProbe(client: NonNullable<ReturnType<typeof createServiceClient>>) {
  const [pageViews, pageViewsExactColumns, generationLogs, generationLogsExactColumns, prompts] =
    await Promise.all([
    client.from("page_views").select("id", { count: "exact", head: true }),
    client
      .from("page_views")
      .select("id,path,title,referrer,visitor_id,device_type,country,created_at")
      .limit(1),
    client.from("ai_generation_logs").select("id", { count: "exact", head: true }),
    client.from("ai_generation_logs").select("id,run_time,summary,error_message").limit(1),
    client.from("prompts").select("id,title,slug,status").limit(1),
  ]);

  return {
    pageViews: {
      ok: !pageViews.error,
      count: pageViews.count ?? null,
      error: summarizeError(pageViews.error),
    },
    pageViewsExactColumns: {
      ok: !pageViewsExactColumns.error,
      rows: pageViewsExactColumns.data?.length ?? null,
      error: summarizeError(pageViewsExactColumns.error),
    },
    generationLogs: {
      ok: !generationLogs.error,
      count: generationLogs.count ?? null,
      error: summarizeError(generationLogs.error),
    },
    generationLogsExactColumns: {
      ok: !generationLogsExactColumns.error,
      rows: generationLogsExactColumns.data?.length ?? null,
      error: summarizeError(generationLogsExactColumns.error),
    },
    prompts: {
      ok: !prompts.error,
      rows: prompts.data?.length ?? null,
      error: summarizeError(prompts.error),
    },
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
    key: getSupabaseKeyMetadata(),
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
  const trafficProbe = {
    path: "/traffic-debug-probe",
    search: null,
    full_path: "/traffic-debug-probe",
    title: "Traffic Debug Probe",
    referrer: null,
    visitor_id: "debug-probe",
    session_id: "debug-probe",
    user_agent: "AgentZhan traffic debug",
    device_type: "desktop",
    is_bot: false,
    country: "HK",
  };

  const pageViewInsert = await client.from("page_views").insert(trafficProbe).select("id").single();
  let pageViewCleanup = null;
  const insert = await client.from("ai_generation_logs").insert(probe).select("id").single();
  let cleanup = null;

  if (!pageViewInsert.error && pageViewInsert.data?.id) {
    const removed = await client.from("page_views").delete().eq("id", pageViewInsert.data.id);

    pageViewCleanup = {
      ok: !removed.error,
      error: summarizeError(removed.error),
    };
  }

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
    key: getSupabaseKeyMetadata(),
    reads: await readProbe(client),
    pageViewWriteProbe: {
      ok: !pageViewInsert.error,
      id: pageViewInsert.data?.id ? String(pageViewInsert.data.id) : null,
      error: summarizeError(pageViewInsert.error),
      cleanup: pageViewCleanup,
    },
    writeProbe: {
      ok: !insert.error,
      id: insert.data?.id ? String(insert.data.id) : null,
      error: summarizeError(insert.error),
      cleanup,
    },
  });
}
