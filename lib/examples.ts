export type ExampleCase = {
  slug: string;
  category: string;
  title: string;
  description: string;
  beforeLabel: string;
  before: string;
  afterLabel: string;
  after: string;
  relatedSkillTitle: string;
  relatedSkillHref: string;
};

export const exampleCases: ExampleCase[] = [
  {
    slug: "google-drive-project-files-to-weekly-update",
    category: "插件工作流",
    title: "把 Google Drive 零散项目资料整理成每周进度摘要",
    description:
      "适合项目负责人、行政和小团队。展示连接 Google Drive 后，怎样限定文件范围，把会议记录与进度表整理成可检查的每周摘要。",
    beforeLabel: "指定资料范围",
    before:
      "资料来源：Google Drive / 客户网站改版文件夹\n时间范围：9 月 14 日至 9 月 20 日\n\n文件 1：0916 会议记录\n客户希望首页先突出免费资源，购买说明要写清楚下载码流程。阿明改文案，小林负责页面。\n\n文件 2：项目进度表\n首页文案：进行中，负责人阿明\n手机菜单：已完成，负责人小林\n付款 FAQ：未开始，负责人空白\n\n要求：只根据这两个文件整理，不要搜索其他资料，不要替空白项目猜负责人。",
    afterLabel: "插件整理后输出",
    after:
      "项目：客户网站改版\n报告周期：9 月 14 日至 9 月 20 日\n资料来源：0916 会议记录、项目进度表\n\n本周已完成：\n- 手机菜单已经完成，负责人：小林。\n\n进行中：\n- 首页文案正在修改，负责人：阿明。\n- 重点方向：突出免费资源，并让购买说明清楚解释下载码流程。\n\n未开始：\n- 付款 FAQ 尚未开始。\n\n待确认：\n- 付款 FAQ 的负责人没有写明，需要项目负责人补充。\n- 原始资料没有截止日期，不能判断任务是否延期。\n\n下周建议：\n1. 确认付款 FAQ 负责人和截止日期。\n2. 首页文案完成后，检查免费资源入口和下载码说明是否同时出现。\n3. 发布前用手机重新测试菜单和购买流程。",
    relatedSkillTitle: "AI 插件安装服务",
    relatedSkillHref: "/products/ai-skill-install-service",
  },
  {
    slug: "meeting-notes-to-minutes",
    category: "AI办公",
    title: "把一段乱会议记录整理成正式会议纪要",
    description: "适合上班族、行政、运营和小团队。展示 AI 办公助手 Skill 怎样把零散文字变成可执行纪要。",
    beforeLabel: "原始输入",
    before:
      "今日同客户讨论新版页面。客户说首页不够清楚，要突出免费资源和 Skill 包。客服入口要明显。下周三前先改首页，阿明负责文案，小林负责上线。客户担心付款后不知道怎样下载，要加下载码说明。还有 FAQ 要补。",
    afterLabel: "整理后输出",
    after:
      "会议主题：新版页面优化\n\n已确定事项：\n1. 首页需要突出免费资源和 Skill 包。\n2. 客服/微信咨询入口需要更明显。\n3. 购买流程需补充下载码说明。\n4. FAQ 需要补充付款后如何下载。\n\n行动项：\n- 首页文案优化：阿明负责，下周三前完成。\n- 页面上线：小林负责，下周三前完成。\n- FAQ 与下载码说明：负责人待确认。\n\n风险提醒：付款后下载流程如果不清楚，会影响信任和成交。",
    relatedSkillTitle: "AI 办公助手 Skill",
    relatedSkillHref: "/products/original-skills/ai-office-assistant-skill",
  },
  {
    slug: "topic-to-xiaohongshu-post",
    category: "内容引流",
    title: "把普通选题变成小红书标题和正文",
    description: "适合内容创作者、小店主和知识博主。展示内容工厂 Skill 怎样把一个想法变成可发布内容。",
    beforeLabel: "原始输入",
    before:
      "账号方向：AI 新手教学。目标读者：上班族。选题：用 AI 写周报。想让读者收藏，并去领取免费 AI 工作包。语气自然，不要太夸张。",
    afterLabel: "整理后输出",
    after:
      "标题候选：\n1. 我用 AI 把周报时间从 1 小时压到 10 分钟\n2. 周五不想写周报？这个 AI 模板可以直接套\n3. 上班族一定要存的 AI 周报写法\n\n正文开头：\n以前每到周五，我最怕的不是开会，而是写周报。明明做了很多事，真正落到文字里又很散。\n\n正文结构：\n1. 先列事实，不要让 AI 编成果。\n2. 用模板分成完成事项、进行中、风险、下周计划。\n3. 最后让 AI 生成群内简版和正式汇报版。\n\n结尾：\n我把这个周报 Prompt 放进了免费 AI 工作包，需要的话可以去领取。",
    relatedSkillTitle: "短视频小红书内容工厂 Skill",
    relatedSkillHref: "/products/original-skills/social-content-factory-skill",
  },
  {
    slug: "customer-complaint-reply",
    category: "客服成交",
    title: "把客户投诉变成稳妥客服回复",
    description: "适合电商、课程、咨询和数字产品卖家。展示客服 Skill 怎样避免乱承诺，同时安抚客户。",
    beforeLabel: "原始输入",
    before:
      "客户说：我已经付钱了，为什么还不能下载？你们是不是骗人？赶紧给我处理，不然我投诉。规则：付款后客服核对，再发送下载码。不能承诺即时自动发货。",
    afterLabel: "整理后输出",
    after:
      "您好，抱歉让您等久了。我先帮您核对付款记录。\n\n这个产品目前是客服确认后发送下载码，不是系统自动即时发货。请您把付款截图或付款备注发我，我确认后会尽快把下载码发给您。\n\n如果您已经发过截图，也可以再提醒我一次付款时间，我会优先处理。感谢理解。",
    relatedSkillTitle: "AI 客服回复系统 Skill",
    relatedSkillHref: "/products/original-skills/customer-service-reply-skill",
  },
];

export function getExampleBySlug(slug: string) {
  return exampleCases.find((item) => item.slug === slug);
}
