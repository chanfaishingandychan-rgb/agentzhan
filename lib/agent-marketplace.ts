import { createServiceClient } from "@/lib/supabase/server";

export type AgentPeriod = "today" | "week" | "all";

export type AgentCategory = {
  slug: string;
  nameEn: string;
  nameZhHk: string;
  nameZhCn: string;
};

export type AgentProduct = {
  id: string;
  slug: string;
  name: string;
  websiteUrl: string;
  logoUrl: string | null;
  tagline: string;
  description: string;
  category: AgentCategory;
  tags: string[];
  developerName: string;
  publishedAt: string;
  bidCents: number;
  clicks: number;
  reachedTotalAt: string | null;
};

export type AgentActivity = {
  id: string;
  productName: string;
  amountCents: number;
  createdAt: string;
};

export type AgentMarketplaceSnapshot = {
  products: AgentProduct[];
  sponsored: AgentProduct[];
  latest: AgentProduct[];
  activities: AgentActivity[];
  categories: AgentCategory[];
  stats: {
    products: number;
    developers: number;
    volumeCents: number;
    clicks: number;
  };
  source: "supabase" | "demo";
};

const demoCategories: AgentCategory[] = [
  { slug: "general-agents", nameEn: "General Agents", nameZhHk: "通用 Agent", nameZhCn: "通用 Agent" },
  { slug: "developer-tools", nameEn: "Developer Tools", nameZhHk: "開發工具", nameZhCn: "开发工具" },
  { slug: "productivity", nameEn: "Productivity", nameZhHk: "生產力", nameZhCn: "生产力" },
  { slug: "marketing-sales", nameEn: "Marketing & Sales", nameZhHk: "市場及銷售", nameZhCn: "市场及销售" },
  { slug: "research-data", nameEn: "Research & Data", nameZhHk: "研究及數據", nameZhCn: "研究及数据" },
  { slug: "customer-support", nameEn: "Customer Support", nameZhHk: "客戶服務", nameZhCn: "客户服务" },
  { slug: "content-media", nameEn: "Content & Media", nameZhHk: "內容及媒體", nameZhCn: "内容及媒体" },
  { slug: "automation", nameEn: "Automation", nameZhHk: "自動化", nameZhCn: "自动化" },
];

const category = (slug: string) => demoCategories.find((item) => item.slug === slug) ?? demoCategories[0];

const demoProducts: AgentProduct[] = [
  {
    id: "demo-flowpilot",
    slug: "flowpilot",
    name: "FlowPilot",
    websiteUrl: "https://example.com/flowpilot",
    logoUrl: null,
    tagline: "Turn recurring operations into reliable agent workflows.",
    description: "A workflow agent for small teams that converts repeatable operating procedures into reviewable, human-approved automations.",
    category: category("automation"),
    tags: ["Workflow", "Operations", "Teams"],
    developerName: "Northstar Labs",
    publishedAt: "2026-09-23T02:20:00.000Z",
    bidCents: 4200,
    clicks: 1842,
    reachedTotalAt: "2026-09-23T02:20:00.000Z",
  },
  {
    id: "demo-inboxsmith",
    slug: "inboxsmith",
    name: "InboxSmith",
    websiteUrl: "https://example.com/inboxsmith",
    logoUrl: null,
    tagline: "A support agent that drafts answers from approved knowledge.",
    description: "InboxSmith connects support inboxes to a controlled knowledge base and drafts responses with citations for human approval.",
    category: category("customer-support"),
    tags: ["Support", "Email", "Knowledge Base"],
    developerName: "InboxSmith Studio",
    publishedAt: "2026-09-22T13:10:00.000Z",
    bidCents: 2700,
    clicks: 1124,
    reachedTotalAt: "2026-09-22T13:10:00.000Z",
  },
  {
    id: "demo-codeharbor",
    slug: "codeharbor",
    name: "CodeHarbor",
    websiteUrl: "https://example.com/codeharbor",
    logoUrl: null,
    tagline: "Review pull requests against your engineering rules.",
    description: "A developer agent that checks pull requests for project conventions, missing tests and risky changes before review.",
    category: category("developer-tools"),
    tags: ["Code Review", "Git", "Testing"],
    developerName: "Harbor Systems",
    publishedAt: "2026-09-22T08:45:00.000Z",
    bidCents: 1800,
    clicks: 936,
    reachedTotalAt: "2026-09-22T08:45:00.000Z",
  },
  {
    id: "demo-signaldesk",
    slug: "signaldesk",
    name: "SignalDesk",
    websiteUrl: "https://example.com/signaldesk",
    logoUrl: null,
    tagline: "Research markets with traceable sources and clear briefs.",
    description: "SignalDesk gathers public sources, highlights disagreements and turns research into compact decision briefs.",
    category: category("research-data"),
    tags: ["Research", "Sources", "Briefs"],
    developerName: "SignalDesk Research",
    publishedAt: "2026-09-21T16:25:00.000Z",
    bidCents: 950,
    clicks: 604,
    reachedTotalAt: "2026-09-21T16:25:00.000Z",
  },
  {
    id: "demo-meetinglane",
    slug: "meetinglane",
    name: "MeetingLane",
    websiteUrl: "https://example.com/meetinglane",
    logoUrl: null,
    tagline: "Convert meeting notes into owners, deadlines and follow-ups.",
    description: "A practical meeting assistant focused on accountable actions instead of generic summaries.",
    category: category("productivity"),
    tags: ["Meetings", "Tasks", "Follow-up"],
    developerName: "Lane Software",
    publishedAt: "2026-09-23T04:10:00.000Z",
    bidCents: 0,
    clicks: 322,
    reachedTotalAt: null,
  },
  {
    id: "demo-campaigncanvas",
    slug: "campaigncanvas",
    name: "CampaignCanvas",
    websiteUrl: "https://example.com/campaigncanvas",
    logoUrl: null,
    tagline: "Plan multi-channel campaigns from one grounded brief.",
    description: "CampaignCanvas turns positioning, evidence and channel limits into a coordinated launch plan for small marketing teams.",
    category: category("marketing-sales"),
    tags: ["Campaigns", "Planning", "Marketing"],
    developerName: "Canvas Works",
    publishedAt: "2026-09-23T03:05:00.000Z",
    bidCents: 0,
    clicks: 241,
    reachedTotalAt: null,
  },
];

function toNumber(value: unknown) {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
}

function buildDemoSnapshot(period: AgentPeriod): AgentMarketplaceSnapshot {
  const multiplier = period === "today" ? 0.24 : period === "week" ? 0.62 : 1;
  const products = demoProducts.map((product) => ({ ...product, bidCents: Math.round(product.bidCents * multiplier) }));
  const sponsored = products.filter((product) => product.bidCents > 0).sort((a, b) => b.bidCents - a.bidCents);
  return {
    products,
    sponsored,
    latest: [...products].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    activities: sponsored.slice(0, 4).map((product, index) => ({
      id: `activity-${product.id}`,
      productName: product.name,
      amountCents: [500, 1200, 700, 550][index] ?? 500,
      createdAt: new Date(Date.now() - index * 37 * 60 * 1000).toISOString(),
    })),
    categories: demoCategories,
    stats: {
      products: products.length,
      developers: new Set(products.map((product) => product.developerName)).size,
      volumeCents: products.reduce((sum, product) => sum + product.bidCents, 0),
      clicks: products.reduce((sum, product) => sum + product.clicks, 0),
    },
    source: "demo",
  };
}

type ProductRow = Record<string, unknown> & {
  agent_categories?: Record<string, unknown> | Array<Record<string, unknown>> | null;
};

function mapProduct(row: ProductRow, bidCents: number, clicks: number, reachedTotalAt: string | null): AgentProduct {
  const relation = Array.isArray(row.agent_categories) ? row.agent_categories[0] : row.agent_categories;
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    websiteUrl: String(row.website_url),
    logoUrl: typeof row.logo_url === "string" ? row.logo_url : null,
    tagline: String(row.tagline ?? ""),
    description: String(row.description ?? ""),
    category: {
      slug: String(relation?.slug ?? "general-agents"),
      nameEn: String(relation?.name_en ?? "General Agents"),
      nameZhHk: String(relation?.name_zh_hk ?? "通用 Agent"),
      nameZhCn: String(relation?.name_zh_cn ?? "通用 Agent"),
    },
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    developerName: String(row.developer_name ?? "Independent developer"),
    publishedAt: String(row.published_at ?? row.created_at ?? new Date().toISOString()),
    bidCents,
    clicks,
    reachedTotalAt,
  };
}

export async function getAgentMarketplaceSnapshot(period: AgentPeriod = "all"): Promise<AgentMarketplaceSnapshot> {
  const client = createServiceClient();
  if (!client) return buildDemoSnapshot(period);

  const view = period === "today" ? "agent_leaderboard_today" : period === "week" ? "agent_leaderboard_week" : "agent_leaderboard_all_time";
  const [productsResult, rankingResult, metricsResult, categoriesResult, activityResult] = await Promise.all([
    client
      .from("agent_products")
      .select("id,slug,website_url,logo_url,name,tagline,description,tags,developer_name,published_at,created_at,agent_categories(slug,name_en,name_zh_hk,name_zh_cn)")
      .eq("status", "approved")
      .order("published_at", { ascending: false }),
    client.from(view).select("product_id,amount_cents,reached_total_at"),
    client.from("agent_product_public_metrics").select("product_id,click_count"),
    client.from("agent_categories").select("slug,name_en,name_zh_hk,name_zh_cn").eq("is_active", true).order("sort_order"),
    client
      .from("agent_bid_ledger")
      .select("id,product_id,amount_cents,effective_at,agent_products(name)")
      .eq("entry_type", "payment")
      .order("effective_at", { ascending: false })
      .limit(8),
  ]);

  if (productsResult.error || rankingResult.error || categoriesResult.error) return buildDemoSnapshot(period);

  const rankingMap = new Map((rankingResult.data ?? []).map((row) => [String(row.product_id), row]));
  const metricsMap = new Map((metricsResult.data ?? []).map((row) => [String(row.product_id), row]));
  const products = (productsResult.data ?? []).map((row) => {
    const ranking = rankingMap.get(String(row.id));
    const metrics = metricsMap.get(String(row.id));
    return mapProduct(
      row as ProductRow,
      toNumber(ranking?.amount_cents),
      toNumber(metrics?.click_count),
      typeof ranking?.reached_total_at === "string" ? ranking.reached_total_at : null,
    );
  });
  const sponsored = products
    .filter((product) => product.bidCents > 0)
    .sort((a, b) => b.bidCents - a.bidCents || String(a.reachedTotalAt).localeCompare(String(b.reachedTotalAt)));
  const categories = (categoriesResult.data ?? []).map((row) => ({
    slug: String(row.slug),
    nameEn: String(row.name_en),
    nameZhHk: String(row.name_zh_hk),
    nameZhCn: String(row.name_zh_cn),
  }));
  const activities = (activityResult.data ?? []).map((row) => {
    const relation = Array.isArray(row.agent_products) ? row.agent_products[0] : row.agent_products;
    return {
      id: String(row.id),
      productName: String((relation as Record<string, unknown> | null)?.name ?? "AI product"),
      amountCents: toNumber(row.amount_cents),
      createdAt: String(row.effective_at),
    };
  });

  return {
    products,
    sponsored,
    latest: [...products].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    activities,
    categories,
    stats: {
      products: products.length,
      developers: new Set(products.map((product) => product.developerName)).size,
      volumeCents: products.reduce((sum, product) => sum + product.bidCents, 0),
      clicks: products.reduce((sum, product) => sum + product.clicks, 0),
    },
    source: "supabase",
  };
}

export async function getAgentProductBySlug(slug: string) {
  const snapshot = await getAgentMarketplaceSnapshot("all");
  return { product: snapshot.products.find((item) => item.slug === slug) ?? null, source: snapshot.source };
}
