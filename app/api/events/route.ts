import { NextResponse, type NextRequest } from "next/server";

import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const allowedEvents = new Set([
  "hero-start-here",
  "hero-free-pack",
  "hero-paid-skills",
  "guide-product-cta",
  "guide-consulting-cta",
]);
const botPattern =
  /bot|crawler|spider|slurp|baidu|bytespider|bingpreview|facebookexternalhit|whatsapp|telegram|curl|python|httpclient/i;

function sanitizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, maxLength);
  return trimmed || null;
}

function sanitizeRelativePath(value: unknown) {
  const path = sanitizeText(value, 260);
  return path?.startsWith("/") ? path : null;
}

function getDeviceType(userAgent: string) {
  const normalized = userAgent.toLowerCase();
  if (/ipad|tablet|kindle/.test(normalized)) return "tablet";
  if (/mobile|iphone|android|phone/.test(normalized)) return "mobile";
  return "desktop";
}

export async function POST(request: NextRequest) {
  const client = createServiceClient();
  if (!client) return new NextResponse(null, { status: 204 });

  const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? "";
  if (botPattern.test(userAgent)) return new NextResponse(null, { status: 204 });

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const eventName = sanitizeText(payload.eventName, 80);
  const path = sanitizeRelativePath(payload.path);
  const href = sanitizeRelativePath(payload.href);
  if (!eventName || !allowedEvents.has(eventName) || !path || !href) {
    return new NextResponse(null, { status: 204 });
  }

  const details = {
    event_name: eventName,
    path,
    href,
    visitor_id: sanitizeText(payload.visitorId, 120),
    device_type: getDeviceType(userAgent),
    country: request.headers.get("x-vercel-ip-country")?.slice(0, 2) ?? null,
  };

  await client.from("ai_generation_logs").insert({
    generated_count: 0,
    published_count: 0,
    draft_count: 0,
    failed_count: 0,
    summary: "conversion_event",
    error_message: JSON.stringify(details),
  });

  return new NextResponse(null, { status: 204 });
}
