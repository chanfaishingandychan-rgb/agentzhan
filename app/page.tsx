import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Bot,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ChevronRight,
  CircleCheck,
  Code2,
  FileText,
  Globe2,
  LibraryBig,
  Megaphone,
  MessageSquareMore,
  MousePointerClick,
  Network,
  PackageOpen,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Workflow,
  Zap,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { BrandMark } from "@/components/brand-mark";

const categories = [
  { name: "办公效率", description: "汇报、会议与文档处理", count: 46, icon: BriefcaseBusiness },
  { name: "内容创作", description: "选题、写作与多平台发布", count: 38, icon: FileText },
  { name: "营销增长", description: "获客、转化与用户运营", count: 31, icon: Megaphone },
  { name: "电商运营", description: "商品、客服与店铺增长", count: 27, icon: Store },
  { name: "开发编程", description: "代码、测试与自动部署", count: 35, icon: Code2 },
  { name: "数据分析", description: "报表、洞察与决策建议", count: 22, icon: ChartNoAxesCombined },
];

const agents = [
  {
    title: "全能内容运营官",
    description: "从选题研究到成稿、改写和多平台发布，一次完成整套内容生产。",
    category: "内容创作",
    model: "Claude / ChatGPT",
    uses: "12.8k",
    icon: Sparkles,
    tone: "violet",
  },
  {
    title: "小红书爆款策划师",
    description: "分析人群痛点，生成选题、标题、正文结构和高互动评论引导。",
    category: "营销增长",
    model: "ChatGPT",
    uses: "9.6k",
    icon: MessageSquareMore,
    tone: "rose",
  },
  {
    title: "智能会议执行助理",
    description: "把会议记录整理成结论、待办、负责人和截止时间，并自动跟进。",
    category: "办公效率",
    model: "Gemini / Claude",
    uses: "8.4k",
    icon: CircleCheck,
    tone: "blue",
  },
  {
    title: "电商增长分析师",
    description: "读取店铺数据，定位转化问题，并给出可以立即执行的优化清单。",
    category: "电商运营",
    model: "DeepSeek",
    uses: "7.1k",
    icon: Store,
    tone: "amber",
  },
  {
    title: "SEO 内容研究员",
    description: "完成关键词聚类、搜索意图判断、内容大纲和内链规划。",
    category: "营销增长",
    model: "Claude",
    uses: "6.7k",
    icon: Globe2,
    tone: "emerald",
  },
  {
    title: "代码审查工程师",
    description: "检查潜在缺陷、安全问题和性能风险，输出按优先级排列的建议。",
    category: "开发编程",
    model: "Codex / Cursor",
    uses: "5.9k",
    icon: Code2,
    tone: "slate",
  },
];

const workflows = [
  {
    step: "01",
    title: "热点到多平台内容",
    description: "追踪热点 → 筛选选题 → 生成长文 → 拆分短内容 → 排期发布",
    tools: ["搜索", "Claude", "Notion"],
  },
  {
    step: "02",
    title: "客户咨询自动跟进",
    description: "接收咨询 → 判断意向 → 生成回复 → 写入 CRM → 提醒销售",
    tools: ["邮箱", "AI Agent", "CRM"],
  },
  {
    step: "03",
    title: "每日经营数据简报",
    description: "汇总数据 → 发现异常 → 解释原因 → 给出行动建议 → 定时推送",
    tools: ["表格", "DeepSeek", "飞书"],
  },
];

const resources = [
  {
    label: "SKILL",
    title: "长文深度研究",
    description: "让 Agent 从多个可信来源收集、核验并整合信息。",
    icon: LibraryBig,
    color: "resource-indigo",
  },
  {
    label: "SKILL",
    title: "社媒内容改写",
    description: "将一篇内容适配小红书、公众号、抖音等平台。",
    icon: PackageOpen,
    color: "resource-cyan",
  },
  {
    label: "MCP",
    title: "网页搜索连接器",
    description: "为 Agent 提供实时网页搜索和来源引用能力。",
    icon: Globe2,
    color: "resource-emerald",
  },
  {
    label: "MCP",
    title: "本地文件连接器",
    description: "安全读取指定文件夹中的文档与结构化数据。",
    icon: Network,
    color: "resource-amber",
  },
];

export default function Home() {
  return (
    <div id="top">
      <SiteHeader />

      <main>
        <section className="hero-section">
          <div className="hero-grid" aria-hidden="true" />
          <div className="shell hero-content">
            <a className="eyebrow" href="#agents">
              <span className="eyebrow-dot" />
              中文 AI Agent 资源平台
              <ChevronRight size={14} />
            </a>
            <h1>
              让 AI 真正替你
              <span>完成工作</span>
            </h1>
            <p className="hero-description">
              发现可直接使用的 AI Agent、自动化工作流、Skills 与 MCP 资源，
              <br className="desktop-break" />
              从一个想法到完整结果，少走弯路，更快交付。
            </p>

            <form className="hero-search" action="#agents">
              <Search size={21} aria-hidden="true" />
              <input aria-label="搜索资源" placeholder="搜索 Agent、工作流、Skills 或 MCP" />
              <button type="submit">
                开始探索
                <ArrowRight size={17} />
              </button>
            </form>

            <div className="quick-links" aria-label="热门搜索">
              <span>热门：</span>
              <a href="#agents">内容创作</a>
              <a href="#agents">办公自动化</a>
              <a href="#agents">小红书</a>
              <a href="#resources">MCP</a>
            </div>

            <div className="agent-demo" aria-label="Agent 工作演示">
              <div className="demo-topbar">
                <div className="demo-window-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="demo-title">Agent 工作台</span>
                <span className="demo-status">
                  <span />运行中
                </span>
              </div>
              <div className="demo-body">
                <div className="demo-request">
                  <span className="demo-avatar">你</span>
                  <div>
                    <span className="demo-label">任务需求</span>
                    <p>分析本周行业热点，生成一份适合公众号和小红书的内容计划。</p>
                  </div>
                </div>
                <div className="demo-steps">
                  <div className="demo-step complete">
                    <span className="step-icon"><Search size={16} /></span>
                    <span><strong>热点研究</strong><small>已筛选 18 个可信来源</small></span>
                    <BadgeCheck size={18} />
                  </div>
                  <span className="step-line complete" />
                  <div className="demo-step active">
                    <span className="step-icon"><Bot size={16} /></span>
                    <span><strong>内容策划</strong><small>正在生成双平台内容框架</small></span>
                    <span className="loading-dots"><i /><i /><i /></span>
                  </div>
                  <span className="step-line" />
                  <div className="demo-step pending">
                    <span className="step-icon"><FileText size={16} /></span>
                    <span><strong>交付结果</strong><small>公众号长文 + 5 篇小红书笔记</small></span>
                  </div>
                </div>
                <div className="demo-output">
                  <div className="output-icon"><Zap size={18} /></div>
                  <div>
                    <span>预计节省时间</span>
                    <strong>4.5 小时</strong>
                  </div>
                  <button type="button"><Play size={14} fill="currentColor" />查看演示</button>
                </div>
              </div>
            </div>

            <div className="trust-row">
              <span><ShieldCheck size={17} />经过测试与人工筛选</span>
              <span><MousePointerClick size={17} />直接复制，即刻使用</span>
              <span><Zap size={17} />持续更新实用资源</span>
            </div>
          </div>
        </section>

        <section className="section shell" id="agents">
          <div className="section-heading">
            <div>
              <span className="section-kicker">按场景探索</span>
              <h2>找到适合你的 AI 工作方式</h2>
            </div>
            <a href="#agents">查看全部分类 <ArrowRight size={16} /></a>
          </div>
          <div className="category-grid">
            {categories.map(({ name, description, count, icon: Icon }) => (
              <a className="category-card" href="#featured" key={name}>
                <span className="category-icon"><Icon size={21} /></span>
                <span className="category-copy"><strong>{name}</strong><small>{description}</small></span>
                <span className="category-count">{count}</span>
                <ChevronRight className="category-arrow" size={17} />
              </a>
            ))}
          </div>
        </section>

        <section className="section section-soft" id="featured">
          <div className="shell">
            <div className="section-heading">
              <div>
                <span className="section-kicker">编辑精选</span>
                <h2>本周热门 Agent</h2>
                <p>经过实际任务测试，可以立即放进你的工作流程。</p>
              </div>
              <a href="#agents">浏览全部 Agent <ArrowRight size={16} /></a>
            </div>
            <div className="agent-grid">
              {agents.map(({ title, description, category, model, uses, icon: Icon, tone }) => (
                <article className="agent-card" key={title}>
                  <div className="agent-card-top">
                    <span className={`agent-icon ${tone}`}><Icon size={22} /></span>
                    <span className="verified"><BadgeCheck size={14} />精选</span>
                  </div>
                  <div className="agent-meta"><span>{category}</span><span>{model}</span></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <div className="agent-footer">
                    <span><Play size={13} fill="currentColor" />{uses} 次使用</span>
                    <a href="#cta" aria-label={`查看${title}`}><ArrowRight size={17} /></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="workflow-section" id="workflows">
          <div className="shell">
            <div className="workflow-heading">
              <span className="section-kicker light">自动化工作流</span>
              <h2>不只是回答，<br />而是把整件事做完</h2>
              <p>把多个工具和步骤连接起来，让 Agent 按照清晰流程持续完成任务。</p>
              <a className="button button-light" href="#cta">探索工作流 <ArrowRight size={17} /></a>
            </div>
            <div className="workflow-list">
              {workflows.map((workflow) => (
                <article className="workflow-card" key={workflow.step}>
                  <div className="workflow-number">{workflow.step}</div>
                  <div className="workflow-content">
                    <h3>{workflow.title}</h3>
                    <p>{workflow.description}</p>
                    <div className="tool-tags">
                      {workflow.tools.map((tool) => <span key={tool}>{tool}</span>)}
                    </div>
                  </div>
                  <a href="#cta" aria-label={`查看${workflow.title}`}><ArrowRight size={18} /></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section shell" id="resources">
          <div className="section-heading">
            <div>
              <span className="section-kicker">能力扩展</span>
              <h2>为你的 Agent 装上新能力</h2>
              <p>精选 Skills 与 MCP 连接器，让智能体能搜索、读取、分析和执行。</p>
            </div>
            <a href="#resources">查看资源库 <ArrowRight size={16} /></a>
          </div>
          <div className="resource-grid">
            {resources.map(({ label, title, description, icon: Icon, color }) => (
              <article className="resource-card" key={title}>
                <div className={`resource-icon ${color}`}><Icon size={21} /></div>
                <span className="resource-label">{label}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <a href="#cta">查看详情 <ArrowRight size={15} /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="proof-section" id="learn">
          <div className="shell proof-grid">
            <div>
              <span className="section-kicker">为什么选择 Agent站</span>
              <h2>少一点概念，<br />多一点真实结果</h2>
              <p>每项资源都围绕实际工作任务设计。清楚说明适用场景、配置方法与预期结果。</p>
            </div>
            <div className="proof-points">
              <div><span><CircleCheck size={20} /></span><strong>可直接使用</strong><p>提供完整配置、提示词和操作步骤。</p></div>
              <div><span><BadgeCheck size={20} /></span><strong>中文场景优化</strong><p>针对本地平台与真实工作习惯设计。</p></div>
              <div><span><ShieldCheck size={20} /></span><strong>人工测试筛选</strong><p>明确标注限制，不收录低质量重复资源。</p></div>
              <div><span><Workflow size={20} /></span><strong>从入门到进阶</strong><p>普通用户能直接用，开发者也能深入扩展。</p></div>
            </div>
          </div>
        </section>

        <section className="cta-section shell" id="cta">
          <div className="cta-panel">
            <div className="cta-pattern" aria-hidden="true" />
            <div className="cta-icon"><Blocks size={26} /></div>
            <h2>找到你的第一个 AI Agent</h2>
            <p>从今天开始，把重复工作交给 AI，把时间留给更重要的决定。</p>
            <div className="cta-actions">
              <a className="button button-light" href="#agents">立即探索 <ArrowRight size={17} /></a>
              <a className="button button-ghost-light" href="#workflows">查看工作流</a>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <a className="brand" href="#top"><BrandMark /><span>Agent站</span></a>
            <p>中文 AI Agent、工作流、Skills 与 MCP 资源平台。</p>
          </div>
          <div><strong>资源</strong><a href="#agents">AI Agent</a><a href="#workflows">工作流</a><a href="#resources">Skills</a><a href="#resources">MCP</a></div>
          <div><strong>探索</strong><a href="#featured">热门精选</a><a href="#featured">最新发布</a><a href="#learn">学习中心</a><a href="#footer">提交资源</a></div>
          <div><strong>关于</strong><a href="#footer">关于我们</a><a href="#footer">联系我们</a><a href="#footer">隐私政策</a><a href="#footer">使用条款</a></div>
        </div>
        <div className="shell footer-bottom"><span>© 2026 Agent站</span><span>agentzhan.com</span></div>
      </footer>
    </div>
  );
}
