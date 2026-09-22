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
  paymentImageAlt?: string;
  paymentImageCaption?: string;
  purchaseStepOne?: string;
  purchaseStepTwo?: string;
  purchaseStepThree?: string;
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
  paymentImageAlt: "Mac Codex 接入 DeepSeek 自助安装包 微信收款码",
  paymentImageCaption: "扫码付款 ¥98",
  downloadName: "agentzhan-codex-deepseek-mac-installer.zip",
  supportLabel: "微信客服",
  supportHref: "/consulting#wechat-consulting",
};

export const officePromptPackProduct: DigitalProduct = {
  slug: "ai-office-prompt-pack",
  path: "/products/ai-office-prompt-pack",
  apiPath: "/api/download/ai-office-prompt-pack",
  title: "AI 办公提效 Prompt 包",
  shortTitle: "AI 办公提效模板包",
  description:
    "覆盖会议纪要、周报、邮件回复、SOP、资料总结和汇报整理的中文 Prompt 模板包，适合上班族和小团队每天复用。",
  priceLabel: "¥29.9",
  priceAmount: 29.9,
  currency: "CNY",
  paymentQrImage: "/wechat-qr.jpg",
  paymentImageAlt: "Agent站客服微信二维码",
  paymentImageCaption: "先加客服微信，确认后发送 ¥29.9 收款方式",
  purchaseStepOne: "先加客服微信，确认产品内容和交付方式",
  purchaseStepTwo: "确认无误后，按客服发送的 ¥29.9 收款方式付款",
  purchaseStepThree: "客服确认收款后发送下载码，在本页输入即可下载文件",
  downloadName: "agentzhan-ai-office-prompt-pack.zip",
  supportLabel: "微信客服",
  supportHref: "/consulting#wechat-consulting",
};

export const websiteOperatorSkillProduct: DigitalProduct = {
  slug: "agentzhan-website-operator-skill",
  path: "/products/agentzhan-website-operator-skill",
  apiPath: "/api/download/agentzhan-website-operator-skill",
  title: "AI 网站经营 Skill 包",
  shortTitle: "AI 网站经营 Skill",
  description:
    "给个人站长和 AI 工具站使用的原创 Skill 包，包含 SKILL.md、网站经营 Prompt、流量诊断、内容计划、变现漏斗和交付检查清单。",
  priceLabel: "¥99",
  priceAmount: 99,
  currency: "CNY",
  paymentQrImage: "/wechat-qr.jpg",
  paymentImageAlt: "Agent站客服微信二维码",
  paymentImageCaption: "先加客服微信，确认后发送 ¥99 收款方式",
  purchaseStepOne: "先加客服微信，说明要购买 AI 网站经营 Skill 包",
  purchaseStepTwo: "确认无误后，按客服发送的 ¥99 收款方式付款",
  purchaseStepThree: "客服确认收款后发送下载码，在本页输入即可下载 ZIP",
  downloadName: "agentzhan-website-operator-skill.zip",
  supportLabel: "微信客服",
  supportHref: "/consulting#wechat-consulting",
};

export function getCodexDeepSeekCanonicalUrl() {
  return `${siteConfig.url}${codexDeepSeekProduct.path}`;
}

export function getOfficePromptPackCanonicalUrl() {
  return `${siteConfig.url}${officePromptPackProduct.path}`;
}

export function getWebsiteOperatorSkillCanonicalUrl() {
  return `${siteConfig.url}${websiteOperatorSkillProduct.path}`;
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

const fallbackOfficePromptPackDownloadTokens = [
  "OFFICE29-HK2026",
  "AIOFFICE-7M3Q9",
  "ZHAN-OFFICE-29",
  "PROMPT-6K8X2",
  "WORK-AI-5P7N",
];

export function getOfficePromptPackDownloadTokens() {
  const configuredTokens = [
    process.env.OFFICE_PROMPT_PACK_DOWNLOAD_TOKEN,
    process.env.OFFICE_PROMPT_PACK_DOWNLOAD_TOKENS,
  ]
    .filter(Boolean)
    .flatMap((value) => value!.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return Array.from(new Set([...fallbackOfficePromptPackDownloadTokens, ...configuredTokens]));
}

export function isOfficePromptPackUnlockCodeValid(code: string | undefined) {
  const normalizedCode = code?.trim();
  return Boolean(normalizedCode && getOfficePromptPackDownloadTokens().includes(normalizedCode));
}

const fallbackWebsiteOperatorSkillDownloadTokens = [
  "WEBSITE99-AI2026",
  "AGENTZHAN-SKILL-99",
  "SITE-OP-8K6Q2",
  "ZHAN-WEB-7P9M3",
  "AI-SITE-5X2N8",
];

export function getWebsiteOperatorSkillDownloadTokens() {
  const configuredTokens = [
    process.env.WEBSITE_OPERATOR_SKILL_DOWNLOAD_TOKEN,
    process.env.WEBSITE_OPERATOR_SKILL_DOWNLOAD_TOKENS,
  ]
    .filter(Boolean)
    .flatMap((value) => value!.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return Array.from(new Set([...fallbackWebsiteOperatorSkillDownloadTokens, ...configuredTokens]));
}

export function isWebsiteOperatorSkillUnlockCodeValid(code: string | undefined) {
  const normalizedCode = code?.trim();
  return Boolean(normalizedCode && getWebsiteOperatorSkillDownloadTokens().includes(normalizedCode));
}
