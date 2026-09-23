import { createHash } from "node:crypto";

import { NextResponse, type NextRequest } from "next/server";

import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const placements = new Set(["sponsored", "organic", "product_page"]);
const botPattern = /bot|crawler|spider|slurp|headless|preview|facebookexternalhit|whatsapp|telegram/i;

function visitorHash(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.AGENT_CLICK_HASH_SALT || process.env.AGENT_SUBMISSION_HASH_SALT || "agentzhan-click";
  return createHash("sha256").update(`${salt}:${day}:${address}`).digest("hex");
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = createServiceClient();
  if (!client) return NextResponse.json({ error: "Product directory unavailable" }, { status: 503 });

  const { data: product, error } = await client
    .from("agent_products")
    .select("id,website_url")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  if (error || !product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  let destination: URL;
  try {
    destination = new URL(product.website_url);
  } catch {
    return NextResponse.json({ error: "Invalid product URL" }, { status: 500 });
  }
  if (destination.protocol !== "http:" && destination.protocol !== "https:") {
    return NextResponse.json({ error: "Invalid product URL" }, { status: 500 });
  }

  const placementInput = request.nextUrl.searchParams.get("placement") || "product_page";
  const placement = placements.has(placementInput) ? placementInput : "product_page";
  const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? "";

  await client.from("agent_product_clicks").insert({
    product_id: product.id,
    placement,
    visitor_hash: visitorHash(request),
    referrer: request.headers.get("referer")?.slice(0, 500) ?? null,
    country: request.headers.get("x-vercel-ip-country")?.slice(0, 2) ?? null,
    user_agent: userAgent || null,
    is_bot: botPattern.test(userAgent),
  });

  return NextResponse.redirect(destination, 302);
}
