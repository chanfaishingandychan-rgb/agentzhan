import { NextResponse, type NextRequest } from "next/server";

import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const actions = new Set(["approve", "reject", "suspend"]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  const client = createServiceClient();
  if (!client) return NextResponse.json({ error: "Supabase client unavailable" }, { status: 503 });

  const formData = await request.formData();
  const productId = String(formData.get("productId") ?? "");
  const action = String(formData.get("action") ?? "");
  const reviewNotes = String(formData.get("reviewNotes") ?? "").replace(/\s+/g, " ").trim().slice(0, 500) || null;

  if (!uuidPattern.test(productId) || !actions.has(action)) {
    return NextResponse.json({ error: "Invalid moderation request" }, { status: 400 });
  }

  const { data: before, error: readError } = await client
    .from("agent_products")
    .select("id,slug,status,published_at")
    .eq("id", productId)
    .maybeSingle();

  if (readError || !before) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const status = action === "approve" ? "approved" : action === "reject" ? "rejected" : "suspended";
  const changes = {
    status,
    review_notes: reviewNotes,
    published_at: status === "approved" ? before.published_at || new Date().toISOString() : before.published_at,
  };
  const { data: after, error } = await client
    .from("agent_products")
    .update(changes)
    .eq("id", productId)
    .select("id,slug,status,published_at,review_notes")
    .single();

  if (error || !after) return NextResponse.json({ error: "Unable to update product" }, { status: 500 });

  await client.from("agent_audit_logs").insert({
    actor_type: "admin",
    actor_id: process.env.ADMIN_USERNAME || "admin",
    action: `product.${status}`,
    entity_type: "agent_product",
    entity_id: productId,
    before_data: before,
    after_data: after,
  });

  return NextResponse.redirect(new URL(`/admin/agents?updated=${encodeURIComponent(after.slug)}`, request.url), 303);
}
