import { createHash, randomBytes } from "node:crypto";
import { isIP } from "node:net";

import { NextResponse, type NextRequest } from "next/server";

import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const validLocales = new Set(["en", "zh-hk", "zh-cn"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function isPrivateHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) return true;

  const version = isIP(host);
  if (version === 4) {
    const [a, b] = host.split(".").map(Number);
    return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
  }
  if (version === 6) {
    return host === "::1" || host === "::" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe8") || host.startsWith("fe9") || host.startsWith("fea") || host.startsWith("feb");
  }
  return !host.includes(".");
}

function normalizeUrl(value: unknown, optional?: false): string;
function normalizeUrl(value: unknown, optional: true): string | null;
function normalizeUrl(value: unknown, optional = false) {
  const input = text(value, 500);
  if (!input && optional) return null;
  if (!input) throw new Error("A valid website URL is required.");

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error("Enter a complete URL beginning with http:// or https://.");
  }

  if (!new Set(["http:", "https:"]).has(url.protocol) || url.username || url.password || isPrivateHost(url.hostname)) {
    throw new Error("This URL cannot be accepted.");
  }

  url.hostname = url.hostname.toLowerCase();
  url.hash = "";
  url.search = "";
  if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");

  const canonical = url.toString();
  return canonical.endsWith("/") && url.pathname === "/" ? canonical.slice(0, -1) : canonical;
}

function slugify(value: string) {
  const base = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 54);
  return `${base || "agent"}-${randomBytes(3).toString("hex")}`;
}

function requestHash(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "unknown";
  const salt = process.env.AGENT_SUBMISSION_HASH_SALT || process.env.NEXT_PUBLIC_SITE_URL || "agentzhan-submission";
  return createHash("sha256").update(`${salt}:${address}`).digest("hex");
}

export async function POST(request: NextRequest) {
  const client = createServiceClient();
  if (!client) {
    return NextResponse.json({ error: "Submissions are temporarily unavailable." }, { status: 503 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (text(payload.companyFax, 120)) return NextResponse.json({ ok: true });

  const ipHash = requestHash(request);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await client
    .from("agent_submission_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", oneHourAgo);

  if (countError) {
    return NextResponse.json({ error: "The product directory is not ready for submissions yet." }, { status: 503 });
  }
  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: "Too many submissions. Please try again in one hour." }, { status: 429 });
  }

  const { data: attempt } = await client
    .from("agent_submission_attempts")
    .insert({ ip_hash: ipHash, accepted: false })
    .select("id")
    .single();

  try {
    const name = text(payload.name, 80);
    const tagline = text(payload.tagline, 160);
    const description = text(payload.description, 3000);
    const categorySlug = text(payload.category, 80);
    const developerName = text(payload.developerName, 100);
    const developerEmail = text(payload.developerEmail, 254).toLowerCase();
    const localeInput = text(payload.locale, 10).toLowerCase();
    const locale = validLocales.has(localeInput) ? localeInput : "en";

    if (name.length < 2 || tagline.length < 10 || description.length < 40 || developerName.length < 2) {
      return NextResponse.json({ error: "Complete all required fields with enough detail." }, { status: 400 });
    }
    if (!emailPattern.test(developerEmail)) {
      return NextResponse.json({ error: "Enter a valid contact email." }, { status: 400 });
    }

    const websiteUrl = normalizeUrl(payload.websiteUrl);
    const logoUrl = normalizeUrl(payload.logoUrl, true);
    const developerUrl = normalizeUrl(payload.developerUrl, true);
    const tags = Array.from(
      new Set(
        text(payload.tags, 240)
          .split(/[,;，；]/)
          .map((tag) => text(tag, 32))
          .filter(Boolean),
      ),
    ).slice(0, 8);

    const [{ data: category, error: categoryError }, { data: duplicate, error: duplicateError }] = await Promise.all([
      client.from("agent_categories").select("id").eq("slug", categorySlug).eq("is_active", true).maybeSingle(),
      client.from("agent_products").select("id,status").eq("normalized_url", websiteUrl).maybeSingle(),
    ]);

    if (categoryError || !category) {
      return NextResponse.json({ error: "Choose a valid product category." }, { status: 400 });
    }
    if (duplicateError) {
      return NextResponse.json({ error: "We could not check this website URL." }, { status: 500 });
    }
    if (duplicate) {
      return NextResponse.json({ error: "This website has already been submitted." }, { status: 409 });
    }

    const { data: product, error } = await client
      .from("agent_products")
      .insert({
        category_id: category.id,
        slug: slugify(name),
        normalized_url: websiteUrl,
        website_url: websiteUrl,
        logo_url: logoUrl,
        name,
        tagline,
        description,
        tags,
        developer_name: developerName,
        developer_email: developerEmail,
        developer_url: developerUrl,
        locale,
        status: "pending",
        ownership_status: "unverified",
      })
      .select("id,slug")
      .single();

    if (error || !product) {
      if (error?.code === "23505") return NextResponse.json({ error: "This website has already been submitted." }, { status: 409 });
      return NextResponse.json({ error: "We could not save this submission." }, { status: 500 });
    }

    if (attempt?.id) {
      await client.from("agent_submission_attempts").update({ accepted: true }).eq("id", attempt.id);
    }
    await client.from("agent_audit_logs").insert({
      actor_type: "system",
      action: "product.submitted",
      entity_type: "agent_product",
      entity_id: product.id,
      after_data: { slug: product.slug, locale, category: categorySlug },
    });

    return NextResponse.json({ ok: true, status: "pending" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid submission." }, { status: 400 });
  }
}
