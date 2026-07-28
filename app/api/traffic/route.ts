import { NextResponse, type NextRequest } from "next/server";

import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ignoredPrefixes = ["/admin", "/api", "/_next"];
const botPattern =
  /bot|crawler|spider|slurp|baidu|bytespider|bingpreview|facebookexternalhit|whatsapp|telegram|curl|python|httpclient/i;

function sanitizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, maxLength);
  return trimmed || null;
}

function sanitizePath(value: unknown) {
  const path = sanitizeText(value, 260);
  if (!path || !path.startsWith("/")) return null;
  if (ignoredPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return null;
  return path;
}

function getDeviceType(userAgent: string) {
  const normalized = userAgent.toLowerCase();
  if (botPattern.test(normalized)) return "bot";
  if (/ipad|tablet|kindle/.test(normalized)) return "tablet";
  if (/mobile|iphone|android|phone/.test(normalized)) return "mobile";
  return "desktop";
}

export async function POST(request: NextRequest) {
  const client = createServiceClient();
  if (!client) {
    return new NextResponse(null, { status: 204 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const path = sanitizePath(payload.path);
  if (!path) {
    return new NextResponse(null, { status: 204 });
  }

  const search = sanitizeText(payload.search, 500);
  const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? "";

  const { error } = await client.from("page_views").insert({
    path,
    search,
    full_path: search ? `${path}?${search}` : path,
    title: sanitizeText(payload.title, 180),
    referrer: sanitizeText(payload.referrer, 500),
    visitor_id: sanitizeText(payload.visitorId, 120),
    session_id: sanitizeText(payload.sessionId, 120),
    user_agent: userAgent || null,
    device_type: getDeviceType(userAgent),
    is_bot: botPattern.test(userAgent),
    country: request.headers.get("x-vercel-ip-country")?.slice(0, 2) ?? null,
  });

  if (error) {
    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.json({ ok: true });
}
