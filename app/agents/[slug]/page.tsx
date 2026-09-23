import type { Metadata } from "next";

import { AgentProductPage } from "@/components/agent-product-page";
import { getAgentProductBySlug } from "@/lib/agent-marketplace";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getAgentProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return { title: `${product.name} — AI Agent Directory`, description: product.tagline, alternates: { canonical: `${siteConfig.url}/agents/${slug}` }, openGraph: { title: product.name, description: product.tagline, url: `${siteConfig.url}/agents/${slug}`, type: "website" } };
}

export default async function AgentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AgentProductPage slug={slug} locale="en" />;
}
