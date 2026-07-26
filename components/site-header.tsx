import { ArrowUpRight, Menu, Search } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand" href="#top" aria-label="Agent站首页">
          <BrandMark />
          <span>Agent站</span>
        </a>

        <nav className="desktop-nav" aria-label="主要导航">
          <a href="#agents">智能体</a>
          <a href="#workflows">工作流</a>
          <a href="#resources">Skills</a>
          <a href="#resources">MCP</a>
          <a href="#learn">学习中心</a>
        </nav>

        <div className="header-actions">
          <button className="icon-button" type="button" aria-label="搜索">
            <Search size={18} />
          </button>
          <a className="header-login" href="#footer">
            登录
          </a>
          <a className="button button-small button-dark desktop-action" href="#agents">
            探索 Agent
            <ArrowUpRight size={15} />
          </a>
          <details className="mobile-menu">
            <summary aria-label="打开导航">
              <Menu size={20} />
            </summary>
            <nav aria-label="手机导航">
              <a href="#agents">智能体</a>
              <a href="#workflows">工作流</a>
              <a href="#resources">Skills 与 MCP</a>
              <a href="#learn">学习中心</a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
