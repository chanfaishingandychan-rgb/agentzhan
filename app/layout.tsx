import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://agentzhan.com"),
  title: {
    default: "Agent站 - 中文 AI Agent、工作流与技能库",
    template: "%s | Agent站",
  },
  description:
    "发现可直接使用的中文 AI Agent、自动化工作流、Skills 与 MCP 资源，让 AI 真正替你完成工作。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Agent站 - 让 AI 真正替你完成工作",
    description: "中文 AI Agent、工作流、Skills 与 MCP 资源平台。",
    url: "https://agentzhan.com",
    siteName: "Agent站",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
