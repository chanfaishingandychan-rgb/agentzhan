export type Industry = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  audience: string;
  keywords: string[];
  color: string;
};

export const industries: Industry[] = [
  {
    slug: "ecommerce-retail",
    name: "电商零售",
    shortName: "电商",
    description: "适合淘宝、天猫、亚马逊、独立站、直播带货和店铺运营。",
    audience: "电商卖家、运营、客服主管、品牌店铺负责人",
    keywords: ["电商", "淘宝", "天猫", "亚马逊", "Shopee", "Lazada", "独立站", "商品", "店铺", "详情页", "主图", "客服催付", "差评", "发货", "大促", "带货", "直播间", "跨境", "复购", "搜索词"],
    color: "from-orange-500 to-amber-500",
  },
  {
    slug: "content-media",
    name: "自媒体内容",
    shortName: "自媒",
    description: "适合公众号、小红书、抖音、短视频、直播和个人 IP 内容生产。",
    audience: "自媒体创作者、博主、短视频团队、内容运营",
    keywords: ["公众号", "小红书", "自媒体", "短视频", "视频", "直播", "口播", "脚本", "封面", "标题", "评论区", "热点", "涨粉", "账号定位", "剧情", "人设", "种草", "达人"],
    color: "from-rose-500 to-violet-500",
  },
  {
    slug: "education-training",
    name: "教育培训",
    shortName: "教育",
    description: "适合课程、训练营、考试、论文、学习计划和知识讲解。",
    audience: "老师、培训机构、学生、考证人群、知识博主",
    keywords: ["课程", "训练营", "线上课", "培训", "学习", "考试", "中学", "考研", "雅思", "托福", "论文", "课堂", "教师", "错题", "单词", "数学", "英语", "作文", "答辩", "实验", "知识点"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    slug: "enterprise-office",
    name: "企业办公",
    shortName: "办公",
    description: "适合会议、周报、PPT、Excel、SOP、项目管理和跨部门协作。",
    audience: "上班族、行政、人事、项目经理、企业管理者",
    keywords: ["周报", "会议", "OKR", "PPT", "Excel", "商务邮件", "SOP", "项目", "跨部门", "绩效", "制度", "合同", "行政", "老板", "竞品", "客户需求", "招聘", "汇报", "复盘"],
    color: "from-slate-700 to-blue-600",
  },
  {
    slug: "marketing-brand",
    name: "品牌营销",
    shortName: "营销",
    description: "适合广告、品牌故事、公关回应、活动策划、私域和新品推广。",
    audience: "品牌市场、增长运营、广告投放、私域运营",
    keywords: ["广告", "品牌", "公关", "新闻稿", "活动", "营销", "落地页", "海报", "私域", "促销", "新品", "招商", "用户激活", "召回", "增长", "投流"],
    color: "from-violet-600 to-fuchsia-500",
  },
  {
    slug: "sales-crm",
    name: "销售获客",
    shortName: "销售",
    description: "适合线索管理、客户跟进、售前咨询、招商转化和成交复盘。",
    audience: "销售、顾问、BD、代理招商、企业服务团队",
    keywords: ["销售", "客户", "线索", "售前", "招商", "报价", "成交", "促单", "跟进", "合作推进", "代理", "咨询", "转化", "客户见证"],
    color: "from-emerald-500 to-teal-500",
  },
  {
    slug: "customer-service-after-sales",
    name: "客服售后",
    shortName: "客服",
    description: "适合客服话术、售后回复、投诉处理、FAQ 和知识库沉淀。",
    audience: "客服团队、售后负责人、电商客服、服务型企业",
    keywords: ["客服", "售后", "投诉", "FAQ", "差评", "发货延迟", "快捷回复", "高频咨询", "帮助中心", "知识库", "评论区", "官方回应", "用户投诉"],
    color: "from-cyan-500 to-blue-500",
  },
  {
    slug: "hr-recruitment",
    name: "人事招聘",
    shortName: "人事",
    description: "适合简历、招聘 JD、绩效面谈、员工培训和人事通知。",
    audience: "HR、部门主管、求职者、培训负责人",
    keywords: ["简历", "求职", "招聘", "JD", "人事", "绩效", "晋升", "新员工", "onboarding", "内训", "岗位", "人才", "面试"],
    color: "from-indigo-500 to-violet-500",
  },
  {
    slug: "finance-legal",
    name: "财务法务",
    shortName: "财法",
    description: "适合合同初审、预算说明、定价分析、利润测算和风险提示。",
    audience: "老板、财务、法务、运营负责人、项目负责人",
    keywords: ["财务", "合同", "预算", "风险", "利润", "定价", "收款", "退款", "条款", "报价", "费用", "付款", "测算"],
    color: "from-amber-500 to-yellow-500",
  },
  {
    slug: "local-life-catering",
    name: "餐饮本地生活",
    shortName: "本地",
    description: "适合餐饮探店、团购引流、门店活动、客户沙龙和本地服务推广。",
    audience: "餐饮店、本地商家、门店运营、团购达人",
    keywords: ["餐饮", "本地生活", "团购", "探店", "本地探店", "门店", "线下活动", "客户沙龙", "店主", "活动方案"],
    color: "from-red-500 to-orange-500",
  },
  {
    slug: "beauty-fashion",
    name: "美妆时尚",
    shortName: "美妆",
    description: "适合美妆、穿搭、种草、达人带货、测评和小红书内容。",
    audience: "美妆品牌、穿搭博主、达人、女性消费品牌",
    keywords: ["美妆", "种草", "小红书", "达人", "带货", "测评", "产品展示", "品牌种草", "主图", "封面", "口播"],
    color: "from-pink-500 to-rose-500",
  },
  {
    slug: "software-saas",
    name: "软件 SaaS",
    shortName: "SaaS",
    description: "适合 SaaS 官网、帮助中心、产品说明、定制开发和客户成功。",
    audience: "软件公司、SaaS 团队、产品经理、技术服务商",
    keywords: ["SaaS", "产品帮助中心", "客服FAQ", "定制开发", "产品研发", "项目管理", "官网", "产品说明", "客户见证", "售前咨询", "需求澄清"],
    color: "from-sky-500 to-indigo-500",
  },
  {
    slug: "startup-business",
    name: "创业老板",
    shortName: "创业",
    description: "适合项目冷启动、品牌故事、路演发言、预算申请和老板汇报。",
    audience: "创业者、小老板、独立站长、小团队负责人",
    keywords: ["创业", "老板", "路演", "融资", "项目复盘", "预算申请", "产品冷启动", "新品冷启动", "IP 孵化", "商业", "品牌故事", "招商"],
    color: "from-purple-600 to-blue-600",
  },
  {
    slug: "real-estate-home",
    name: "地产家居",
    shortName: "家居",
    description: "适合家居测评、门店推广、客户接待、招商手册和本地生活内容。",
    audience: "家居品牌、地产销售、装修门店、本地服务商",
    keywords: ["家居", "本地生活", "探店", "招商手册", "客户沙龙", "产品展示", "商品测评", "门店", "客户沟通"],
    color: "from-lime-500 to-emerald-500",
  },
  {
    slug: "health-wellness",
    name: "健康医美",
    shortName: "健康",
    description: "适合健康科普、医美种草、咨询回复、私域运营和服务说明。",
    audience: "健康品牌、医美机构、养生账号、服务顾问",
    keywords: ["健康", "医美", "美妆", "科普", "咨询", "私域", "小红书", "种草", "客服", "售后", "知识账号"],
    color: "from-teal-500 to-emerald-500",
  },
];

export function getIndustryBySlug(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}

export function buildIndustrySearchText(item: {
  title: string;
  summary: string;
  tags: string[];
  useScene: string;
  useCases: string[];
  bestPractices: string[];
}) {
  return [
    item.title,
    item.summary,
    item.tags.join(" "),
    item.useScene,
    item.useCases.join(" "),
    item.bestPractices.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export function matchesIndustry(industry: Industry, searchText: string) {
  return industry.keywords.some((keyword) => searchText.includes(keyword.toLowerCase()));
}
