import { NextRequest, NextResponse } from "next/server";

import {
  getOriginalSkillProduct,
  isOriginalSkillUnlockCodeValid,
  originalSkillProducts,
} from "@/lib/original-skill-products";
import { createZip } from "@/lib/simple-zip";

export const runtime = "nodejs";

type OriginalSkillDownloadRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return originalSkillProducts.map((product) => ({ slug: product.slug }));
}

export async function GET(request: NextRequest, { params }: OriginalSkillDownloadRouteProps) {
  const { slug } = await params;
  const product = getOriginalSkillProduct(slug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const token = request.nextUrl.searchParams.get("token")?.trim() || "";
  if (!isOriginalSkillUnlockCodeValid(slug, token)) {
    return NextResponse.json({ error: "Download locked" }, { status: 401 });
  }

  const archive = createZip(product.files.map((file) => ({
    name: file.name,
    data: Buffer.from(file.content, "utf8"),
  })));

  return new NextResponse(new Uint8Array(archive), {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="${product.downloadName}"`,
      "Content-Length": String(archive.byteLength),
      "Content-Type": "application/zip",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
