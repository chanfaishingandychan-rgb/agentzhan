const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agentzhan.com";
const siteUrl = rawSiteUrl.replace(/\/+$/, "");

export const siteConfig = {
  name: "Agent站",
  description:
    "Agent站 — 最全中文 AI Agent 與 Prompt 提示詞工具站。首批上線 100 個高質量中文提示詞，覆蓋 ChatGPT、Claude、DeepSeek，持續擴充 Agent 技能、工作流與實戰案例。",
  title: "Agent站 - 中文最全 AI Agent & Prompt 提示詞庫",
  subtitle:
    "首批上線 100 個高質量中文提示詞，覆蓋寫作、辦公、學習、短視頻、電商等高頻場景。",
  url: siteUrl,
  keywords: [
    "Agent站",
    "AI提示詞庫",
    "ChatGPT提示詞",
    "Claude提示詞",
    "DeepSeek提示詞",
    "AI工作流",
    "AI Agent",
    "百度SEO",
    "中文AI提示詞",
  ],
};

export const categories = [
  {
    slug: "ai-writing",
    name: "AI寫作",
    description: "覆蓋爆款選題、文章改寫、公眾號、履歷、營銷文案等高頻寫作場景。",
    intro:
      "AI寫作分類面向內容創作者、運營團隊、品牌市場和個人表達場景，重點覆蓋選題、提綱、正文、改寫、潤色、案例包裝和內容轉化。",
    keywords: ["AI寫作提示詞", "中文寫作提示詞", "公眾號提示詞", "文案提示詞"],
  },
  {
    slug: "ai-office",
    name: "AI辦公",
    description: "面向職場與企業管理，包含匯報、會議紀要、表格分析、郵件與 SOP。",
    intro:
      "AI辦公分類聚焦上班族和企業團隊日常提效，適合會議紀要、週報、PPT、郵件、流程文檔、匯報材料和協同溝通。",
    keywords: ["AI辦公提示詞", "會議紀要提示詞", "週報提示詞", "職場AI工具"],
  },
  {
    slug: "ai-learning",
    name: "AI學習",
    description: "服務學生和終身學習者，適合預習、複習、考試、論文與語言學習。",
    intro:
      "AI學習分類服務學生、考證人群和終身學習者，覆蓋預習、複習、考試衝刺、論文寫作、語言學習和知識點拆解。",
    keywords: ["AI學習提示詞", "考試提示詞", "論文提示詞", "學生AI工具"],
  },
  {
    slug: "ai-short-video",
    name: "AI短視頻",
    description: "聚焦抖音、快手、小紅書視頻腳本、分鏡、標題、直播與漲粉玩法。",
    intro:
      "AI短視頻分類聚焦短視頻創作與直播轉化，適合抖音、快手、小紅書等平台的腳本、選題、分鏡、標題、預熱和復盤。",
    keywords: ["短視頻提示詞", "抖音腳本提示詞", "直播話術提示詞", "小紅書視頻文案"],
  },
  {
    slug: "ai-ecommerce",
    name: "AI電商",
    description: "適合淘寶、天貓、京東、拼多多、獨立站與跨境賣家進行運營提效。",
    intro:
      "AI電商分類面向平台賣家、品牌電商和跨境團隊，覆蓋標題優化、詳情頁、客服、活動、數據分析、上新和復購運營。",
    keywords: ["AI電商提示詞", "淘寶提示詞", "電商運營提示詞", "跨境電商AI"],
  },
  {
    slug: "ai-marketing",
    name: "AI營銷",
    description: "覆蓋品牌傳播、投放優化、增長策劃、私域轉化、活動創意與用戶運營。",
    intro:
      "AI營銷分類適合品牌市場、增長團隊、投放團隊和私域操盤手，圍繞獲客、轉化、復購和品牌心智建設設計內容與策略。",
    keywords: ["AI營銷提示詞", "增長提示詞", "私域營銷提示詞", "品牌策劃AI"],
  },
  {
    slug: "ai-customer-service",
    name: "AI客服",
    description: "面向售前、售後、回訪、知識庫、標準話術與服務質量管理場景。",
    intro:
      "AI客服分類適合電商客服、SaaS 客服、企業服務團隊和售後管理者，重點解決響應效率、統一口徑、情緒安撫與知識沉澱。",
    keywords: ["AI客服提示詞", "售後話術提示詞", "客服知識庫提示詞", "客服AI"],
  },
  {
    slug: "ai-startup",
    name: "AI創業",
    description: "覆蓋創業方向驗證、商業模式梳理、融資材料、產品定位與冷啟動方案。",
    intro:
      "AI創業分類面向創業者、小團隊和中小企業老闆，適合做項目驗證、用戶需求研究、商業模式梳理、路演和增長冷啟動。",
    keywords: ["AI創業提示詞", "商業計劃書提示詞", "創業項目AI", "融資路演AI"],
  },
  {
    slug: "ai-personal-assistant",
    name: "AI個人助理",
    description: "適合日程管理、個人復盤、生活決策、溝通協助與多任務安排。",
    intro:
      "AI個人助理分類適合個人效率管理者、自由職業者和高密度工作者，用於安排事務、拆解目標、整理信息和輔助決策。",
    keywords: ["AI個人助理提示詞", "日程管理AI", "個人規劃提示詞", "效率助手AI"],
  },
  {
    slug: "ai-efficiency-tools",
    name: "AI效率工具",
    description: "聚焦自動化、工具組合、流程提效、知識管理與跨平台協作。",
    intro:
      "AI效率工具分類強調工具鏈組合與流程自動化，適合把零散任務沉澱成標準化工作流，服務個人和團隊規模化提效。",
    keywords: ["AI效率工具", "AI自動化提示詞", "工作流提示詞", "知識管理AI"],
  },
] as const;

export const modelOptions = [
  "ChatGPT",
  "Claude",
  "DeepSeek",
  "通義千問",
  "文心一言",
];

export const difficultyOptions = ["入門", "進階", "專業"] as const;
