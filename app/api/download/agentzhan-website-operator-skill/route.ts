import { NextRequest, NextResponse } from "next/server";

import { createZip } from "@/lib/simple-zip";
import { isWebsiteOperatorSkillUnlockCodeValid, websiteOperatorSkillProduct } from "@/lib/products";

export const runtime = "nodejs";

function file(name: string, content: string) {
  return { name, data: Buffer.from(content, "utf8") };
}

function readme() {
  return `# ${websiteOperatorSkillProduct.title}

感谢购买。这是 Agent站原创的 AI 网站经营 Skill 包，适合个人站长、AI 工具站、内容站和小团队使用。

## 你买到的是什么

这不是单条 Prompt，而是一套可以交给 Agent 使用的网站经营流程：

- SKILL.md：给 Agent / Codex 使用的 Skill 说明
- prompts/：网站经营、内容计划、流量诊断、变现漏斗 Prompt
- checklists/：每周经营检查清单
- examples/：示例输入和示例输出
- support-message.txt：不会使用时复制给 Agent站微信客服

## 使用方法

1. 如果你的 Agent 支持 Skill，把 SKILL.md 放进对应 Skill 目录。
2. 如果你只是用 ChatGPT / DeepSeek / Kimi，可以直接复制 prompts 里的提示词。
3. 每周固定运行一次「网站经营周报」。
4. 每次更新网站前，先跑「页面变现检查」。
5. 每次看流量后，记录页面、来源、转化动作和下一步。

## 建议执行节奏

- 每周一：让 Agent 生成本周内容计划
- 每周三：检查热门页面和低转化页面
- 每周五：新增或优化一个变现入口
- 每月底：复盘流量、线索、产品和成交

## 售后

如果你不会放进 Agent，或想让我们帮你配置到网站经营流程，可以加 Agent站微信咨询。
`;
}

function skillMd() {
  return `---
name: ai-website-operator
description: Operate a personal AI website by planning content, diagnosing traffic, improving internal links, and turning pages into lead or product conversion paths. Use when the user asks to run, grow, monetize, or improve a website.
---

# AI Website Operator

Use this skill to help a site owner operate an AI content or tool website as a repeatable business asset.

## Core Goal

Turn website activity into a weekly operating loop:

1. Publish or refresh useful pages.
2. Route readers to a free resource, product, or consultation.
3. Check traffic and recent visits.
4. Improve the next page based on observed behavior.

## Operating Principles

- Prioritize real business outcomes: visitors, leads, product clicks, downloads, and consultations.
- Do not only suggest ideas. Produce concrete page topics, titles, CTAs, internal links, and follow-up actions.
- Prefer small weekly improvements over large redesigns.
- Every content page should have a next step: free pack, product page, consultation, related tutorial, or discussion.
- Avoid promising guaranteed income, traffic, rankings, or conversion rates.

## Weekly Workflow

When asked to operate the site:

1. Identify the target audience and monetization goal for the week.
2. Review existing pages or the latest traffic summary if available.
3. Choose one of these actions:
   - create a new SEO tutorial page;
   - improve an existing page's CTA and internal links;
   - create or improve a low-price product page;
   - create a lead magnet or consultation path;
   - write a weekly operating plan.
4. Output:
   - what to change;
   - why it matters;
   - exact copy or prompt to use;
   - internal links to add;
   - one measurable next check.

## Page Evaluation Checklist

For any page, check:

- Is the target reader obvious?
- Does the title match a search or buying intent?
- Does the first screen explain the value quickly?
- Is there a next step above or near the end of the page?
- Are there internal links to related tutorials, products, and consultation?
- Does the page avoid vague claims and unsupported income promises?
- Can a new visitor understand what to do next in under 10 seconds?

## Monetization Paths

Use these paths depending on intent:

- Beginner readers: tutorial -> free pack -> email/WeChat lead
- Buyers with clear task: tutorial -> low-price product -> download code
- Business users: guide or skill page -> consultation -> custom service
- Returning readers: novel/content -> creator guide -> free pack or product

## Output Style

Write in concise Chinese unless the user requests another language. Be specific and practical. If code or deployment is needed, explain that publishing requires explicit confirmation before external deployment.
`;
}

function weeklyOperatorPrompt() {
  return `# Prompt：网站经营周报

你是一名 AI 网站经营顾问。请根据下面资料，帮我制定本周网站经营计划。

网站主题：
目标用户：
现有页面：
可售卖产品：
免费资源：
最近流量数据：
我本周可投入时间：

请输出：
1. 本周最应该优化的 3 个页面
2. 本周应该新增的 3 个内容主题
3. 每个页面应该导向哪个下一步：免费资源 / 产品 / 咨询 / 讨论区
4. 具体标题、描述和 CTA 文案
5. 本周需要检查的 5 个数据
6. 下周复盘问题

要求：
- 不要空泛建议。
- 每个动作都要说明为什么能帮助流量或变现。
- 不要承诺保证赚钱或保证排名。
`;
}

function contentPlanPrompt() {
  return `# Prompt：7 天内容计划

你是一名 SEO 内容运营。请为我的网站生成 7 天内容计划。

网站定位：
目标读者：
我想卖的产品或服务：
已有内容类型：
读者最常见问题：

请输出表格：
1. 第几天
2. 文章标题
3. 搜索意图
4. 文章大纲
5. 内链到哪些页面
6. CTA 文案
7. 发布后要看什么数据

要求：
- 每篇文章只解决一个具体问题。
- 标题要像真实用户会搜索的句子。
- 每篇文章都要有商业下一步。
`;
}

function trafficDiagnosisPrompt() {
  return `# Prompt：流量诊断

你是一名网站增长分析师。请根据下面流量资料，判断网站目前的问题和下一步。

今日浏览：
24 小时浏览：
7 日浏览：
7 日访客：
热门页面：
来源：
设备：
地区：
最近访问记录：
已知转化：邮箱 / 微信 / 购买 / 下载 / 咨询

请输出：
1. 当前流量是否像真人用户，还是可能偏爬虫/工具
2. 哪些页面值得继续优化
3. 哪些页面缺少转化入口
4. 下一个最值得新增的页面
5. 本周最小可执行动作
6. 需要继续观察的数据

要求：
- 不要只看浏览量，要看页面意图和转化动作。
- 如果数据不足，请说明还需要记录什么。
`;
}

function monetizationFunnelPrompt() {
  return `# Prompt：页面变现漏斗

你是一名网站变现顾问。请帮我把一个页面变成可转化路径。

页面标题：
页面内容摘要：
读者是谁：
读者看完后可能想解决什么：
我可以提供的免费资源：
我可以卖的产品：
我可以提供的咨询服务：

请输出：
1. 页面顶部 CTA
2. 页面中部自然插入的内链
3. 页面底部转化模块
4. 适合的免费资源入口
5. 适合的低价产品入口
6. 适合的微信咨询话术
7. 不应该写的夸张承诺

要求：
- CTA 要自然，不要像硬广。
- 先帮读者解决问题，再引导购买。
`;
}

function checklist() {
  return `# AI 网站经营检查清单

每周至少检查一次：

## 内容

- 本周是否新增至少 1 篇有搜索意图的内容
- 旧内容是否更新了过时信息
- 新内容是否有清楚标题和描述
- 每篇内容是否只有一个核心问题

## 内链

- 新页面是否链接到相关教程
- 新页面是否链接到免费资源
- 新页面是否链接到产品或咨询
- 热门页面是否加了下一步入口

## 变现

- 是否有免费领取入口
- 是否有低价产品入口
- 是否有微信咨询入口
- 购买流程是否清楚
- 价格和交付范围是否一致

## 数据

- 热门页面是哪几个
- 来源是否真实
- 7 日访客是否增长
- 是否有人提交表单或加微信
- 是否有人点击产品页

## 风险

- 是否有保证赚钱、保证排名等夸张承诺
- 是否有价格不一致
- 是否有无法交付的产品
- 是否有无效链接或错误页面
`;
}

function exampleInput() {
  return `# 示例输入

网站主题：AI 工具、Prompt、Skill、小说和 AI 咨询
目标用户：AI 新手、个人站长、小老板、内容创作者
现有页面：首页、AI教程、AI小说、Skill库、免费工作包、Prompt包、咨询页
可售卖产品：AI办公 Prompt 包、AI Skill 代安装、自制 Skill 包
免费资源：AI 工作包
最近流量数据：7 日浏览 2044，7 日访客 997，来源主要是直接访问，设备多为爬虫/工具
本周可投入时间：每天 1 小时
`;
}

function exampleOutput() {
  return `# 示例输出

## 本周优先动作

1. 优化 /skills
   - 原因：Skill 页面接近付费服务，商业意图更强。
   - 动作：顶部加入「自制 Skill 包」和「代安装服务」两个入口。
   - 检查：看 /skills 到产品页的访问是否增加。

2. 新增「AI 网站经营 Skill」产品页
   - 原因：这是站点自身案例，最容易解释价值。
   - 动作：说明交付内容、价格、适合人群、微信购买流程。
   - 检查：看页面访问和微信咨询。

3. 给小说页加创作教程入口
   - 原因：小说读者未必买办公包，但可能对 AI 写作感兴趣。
   - 动作：底部链接到 AI 小说写作教程。
   - 检查：看小说页到教程页的点击。

## 本周内容主题

1. AI Skill 是什么，普通人怎么用？
2. 个人网站怎样用 AI 每周自动经营？
3. Prompt 包和 Skill 包有什么区别？

## 本周数据

- /skills 访问
- /products/agentzhan-original-skills 访问
- /products/agentzhan-website-operator-skill 访问
- /free-ai-pack 表单提交
- 微信咨询数量
`;
}

function supportMessage() {
  return `# 微信客服信息模板

购买产品：AI 网站经营 Skill 包
下载码：
你使用的工具：Codex / ChatGPT / DeepSeek / Kimi / 其他
你的网站地址：
你想经营的方向：
遇到的问题：
截图或报错：

请不要发送密码、API Key、后台登录验证码或其他敏感信息。
`;
}

function buildProductZip() {
  return createZip([
    file("README.md", readme()),
    file("SKILL.md", skillMd()),
    file("prompts/01-weekly-website-operator.md", weeklyOperatorPrompt()),
    file("prompts/02-7-day-content-plan.md", contentPlanPrompt()),
    file("prompts/03-traffic-diagnosis.md", trafficDiagnosisPrompt()),
    file("prompts/04-monetization-funnel.md", monetizationFunnelPrompt()),
    file("checklists/website-operation-checklist.md", checklist()),
    file("examples/example-input.md", exampleInput()),
    file("examples/example-output.md", exampleOutput()),
    file("support-message.txt", supportMessage()),
  ]);
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim() || "";

  if (!isWebsiteOperatorSkillUnlockCodeValid(token)) {
    return NextResponse.json({ error: "Download locked" }, { status: 401 });
  }

  const archive = buildProductZip();

  return new NextResponse(new Uint8Array(archive), {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="${websiteOperatorSkillProduct.downloadName}"`,
      "Content-Length": String(archive.byteLength),
      "Content-Type": "application/zip",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
