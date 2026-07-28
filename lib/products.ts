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
  paymentQrImage: process.env.NEXT_PUBLIC_PAYMENT_QR_IMAGE || "/payment-qr.png",
  downloadName: "agentzhan-codex-deepseek-mac-installer.zip",
  supportLabel: "微信客服",
  supportHref: "/consulting#wechat-consulting",
};

export function getCodexDeepSeekCanonicalUrl() {
  return `${siteConfig.url}${codexDeepSeekProduct.path}`;
}

export function getCodexDeepSeekDownloadToken() {
  return process.env.CODEX_DEEPSEEK_DOWNLOAD_TOKEN?.trim() || "";
}

export function isCodexDeepSeekUnlockCodeValid(code: string | undefined) {
  const token = getCodexDeepSeekDownloadToken();
  return Boolean(token && code && code === token);
}
