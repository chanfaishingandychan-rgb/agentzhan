import { NextRequest, NextResponse } from "next/server";

import { officePromptPackProduct, isOfficePromptPackUnlockCodeValid } from "@/lib/products";
import { createZip } from "@/lib/simple-zip";

export const runtime = "nodejs";

function file(name: string, content: string) {
  return { name, data: Buffer.from(content, "utf8") };
}

function readme() {
  return `# ${officePromptPackProduct.title}

感谢购买。这个包适合每天要写会议纪要、周报、邮件、SOP、资料总结和汇报的人。

## 使用方法

1. 先打开对应场景文件。
2. 把尖括号里的内容替换成你的真实资料。
3. 复制完整 Prompt 到 ChatGPT、DeepSeek、Kimi 或 Claude。
4. 生成后先检查事实、日期、姓名、金额和承诺。
5. 对外发送前，必须人工复核。

## 文件说明

- 01-meeting-minutes.md：会议纪要 Prompt
- 02-weekly-report.md：周报 Prompt
- 03-email-reply.md：邮件回复 Prompt
- 04-sop-document.md：SOP 文档 Prompt
- 05-document-summary.md：资料总结 Prompt
- 06-manager-briefing.md：给老板的汇报 Prompt
- 07-quality-checklist.md：发布前检查清单

## 售后

如需定制岗位版本、团队培训或企业工作流，可通过 Agent站微信咨询。
`;
}

function meetingMinutes() {
  return `# 会议纪要 Prompt

你是一名专业会议纪要助理。请根据下面资料，整理成清楚、可执行的会议纪要。

会议主题：<填写主题>
会议日期：<填写日期>
参会人员：<填写人员>
原始记录：<粘贴会议文字、录音转写或手动要点>

请输出：
1. 会议背景
2. 讨论重点
3. 已确定结论
4. 待确认问题
5. 行动项表格：事项 / 负责人 / 截止时间 / 当前状态
6. 需要提醒老板或客户注意的风险

要求：
- 不要编造没有出现在资料里的结论。
- 如果负责人或截止时间缺失，请标记「待确认」。
- 语言要专业、简洁、可直接发给团队。
`;
}

function weeklyReport() {
  return `# 周报 Prompt

你是一名职场写作助理。请把我的工作记录整理成一份清楚、有重点、不夸张的周报。

岗位/角色：<填写岗位>
本周完成：<逐条列出>
进行中事项：<逐条列出>
遇到的问题：<逐条列出>
下周计划：<逐条列出>
需要上级支持：<如没有写无>

请输出：
1. 精简版周报，适合发工作群
2. 正式版周报，适合发给直属上级
3. 本周亮点
4. 风险和待协调事项
5. 下周优先级排序

要求：
- 不要把普通事项包装成夸张成绩。
- 语气专业、具体、有责任感。
- 不要编造数据。
`;
}

function emailReply() {
  return `# 邮件回复 Prompt

你是一名商务邮件助理。请根据下面情况，写一封语气合适、表达清楚的邮件回复。

收件人身份：<客户 / 老板 / 同事 / 供应商>
双方关系：<陌生 / 熟悉 / 合作中 / 有争议>
对方邮件重点：<粘贴或概括>
我想表达：<填写你的立场和目的>
是否需要对方行动：<是/否，若是请写清楚>
截止时间：<如没有写无>

请输出：
1. 邮件标题
2. 正式邮件正文
3. 更简短版本
4. 语气更温和版本
5. 发送前需要人工确认的信息

要求：
- 不要过度承诺。
- 不要使用攻击性表达。
- 如果信息不足，请先列出需要补充的问题。
`;
}

function sopDocument() {
  return `# SOP 文档 Prompt

你是一名流程文档顾问。请把下面的工作流程整理成新人也能照着做的 SOP。

流程名称：<填写名称>
适用对象：<谁会使用这个 SOP>
触发条件：<什么时候开始做>
原始步骤：<粘贴你的流程要点>
常见异常：<列出常见问题>
完成标准：<怎样算完成>

请输出：
1. SOP 目标
2. 适用范围
3. 操作步骤表格：步骤 / 操作 / 注意事项 / 产出
4. 异常处理
5. 检查清单
6. 新人常见错误

要求：
- 步骤要具体，避免空话。
- 不确定的信息标记「待确认」。
- 用团队内部文档风格书写。
`;
}

function documentSummary() {
  return `# 资料总结 Prompt

你是一名资料整理助理。请把下面资料整理成方便阅读和决策的摘要。

资料类型：<文章 / 报告 / 客户资料 / 会议记录 / 竞品资料>
使用目的：<汇报 / 学习 / 决策 / 发给客户 / 内部存档>
原始资料：<粘贴内容>

请输出：
1. 100 字以内摘要
2. 关键观点
3. 重要数据或事实
4. 对我有用的行动建议
5. 可能存在的风险或不确定信息
6. 适合继续追问 AI 的 5 个问题

要求：
- 区分事实和推测。
- 不要编造来源。
- 如果内容太长，先整理结构，再分段总结。
`;
}

function managerBriefing() {
  return `# 给老板的汇报 Prompt

你是一名管理汇报顾问。请把下面资料整理成老板容易快速理解的汇报。

汇报主题：<填写主题>
老板最关心：<进度 / 成本 / 风险 / 结果 / 决策>
当前情况：<填写>
关键数据：<填写，没有就写无>
需要老板决定：<填写，没有就写无>

请输出：
1. 一句话结论
2. 当前进度
3. 关键变化
4. 主要风险
5. 需要老板拍板的事项
6. 建议下一步

要求：
- 先讲结论，再讲过程。
- 不要堆太多细节。
- 涉及金额、日期、责任人必须提醒人工核对。
`;
}

function checklist() {
  return `# AI 办公内容发布前检查清单

每次把 AI 生成内容发给客户、老板、同事或公开平台前，请检查：

1. 日期是否正确
2. 人名、公司名、项目名是否正确
3. 金额、价格、比例、数量是否正确
4. 是否出现 AI 编造的数据或案例
5. 是否泄露客户资料、合同内容或内部信息
6. 是否承诺了自己做不到的交付
7. 语气是否符合对象关系
8. 是否需要加上附件、链接或截图
9. 是否保留了行动项和截止时间
10. 是否需要请真人再看一遍

原则：AI 可以帮你起草和整理，但最终责任在发送的人。
`;
}

function buildProductZip() {
  return createZip([
    file("README.md", readme()),
    file("01-meeting-minutes.md", meetingMinutes()),
    file("02-weekly-report.md", weeklyReport()),
    file("03-email-reply.md", emailReply()),
    file("04-sop-document.md", sopDocument()),
    file("05-document-summary.md", documentSummary()),
    file("06-manager-briefing.md", managerBriefing()),
    file("07-quality-checklist.md", checklist()),
  ]);
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim() || "";

  if (!isOfficePromptPackUnlockCodeValid(token)) {
    return NextResponse.json({ error: "Download locked" }, { status: 401 });
  }

  const archive = buildProductZip();

  return new NextResponse(new Uint8Array(archive), {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="${officePromptPackProduct.downloadName}"`,
      "Content-Length": String(archive.byteLength),
      "Content-Type": "application/zip",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
