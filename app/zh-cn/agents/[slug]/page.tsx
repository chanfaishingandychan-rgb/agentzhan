import { AgentProductPage } from "@/components/agent-product-page";

export default async function AgentDetailZhCnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AgentProductPage slug={slug} locale="zh-cn" />;
}
