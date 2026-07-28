import { siteConfig } from "@/lib/site";

export type DigitalProduct = {
  slug: string;
  path: string;
  apiPath: string;
  title: string;
  shortTitle: string;
  description: string;
  priceLabel: string;
  priceAmount: number;
  currency: "CNY";
  paymentQrImage: string;
  downloadName: string;
  supportLabel: string;
  supportHref: string;
};

export const codexDeepSeekProduct: DigitalProduct = {
  slug: "codex-deepseek-mac-installer",
  path: "/products/codex-deepseek-mac-installer",
  apiPath: "/api/download/codex-deepseek-mac-installer",
  title: "Mac Codex 接入 DeepSeek 自助安装包",
  shortTitle: "Codex × DeepSeek 安装包",
  description:
    "为 Mac Codex 增加 DeepSeek Flash / Pro 两个独立入口，保留原本 GPT 设置。付款核对后可下载 ZIP 交付包。",
  priceLabel: "¥98",
  priceAmount: 98,
  currency: "CNY",
  paymentQrImage: process.env.NEXT_PUBLIC_PAYMENT_QR_IMAGE || "/payment-qr-scan.png",
  downloadName: "agentzhan-codex-deepseek-mac-installer.zip",
  supportLabel: "微信客服",
  supportHref: "/consulting#wechat-consulting",
};

export function getCodexDeepSeekCanonicalUrl() {
  return `${siteConfig.url}${codexDeepSeekProduct.path}`;
}

const fallbackCodexDeepSeekDownloadTokens = [
  "AGENT98-K7M4Q2",
  "DEEPSEEK-3X8N6P",
  "CODEX-AI-92V7H",
  "ZHAN-5QK8R1",
  "MAC-DS-7P4X9N",
];

export function getCodexDeepSeekDownloadTokens() {
  const configuredTokens = [
    process.env.CODEX_DEEPSEEK_DOWNLOAD_TOKEN,
    process.env.CODEX_DEEPSEEK_DOWNLOAD_TOKENS,
  ]
    .filter(Boolean)
    .flatMap((value) => value!.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return Array.from(new Set([...fallbackCodexDeepSeekDownloadTokens, ...configuredTokens]));
}

export function getCodexDeepSeekDownloadToken() {
  return getCodexDeepSeekDownloadTokens()[0] || "";
}

export function isCodexDeepSeekUnlockCodeValid(code: string | undefined) {
  const normalizedCode = code?.trim();
  return Boolean(normalizedCode && getCodexDeepSeekDownloadTokens().includes(normalizedCode));
}
