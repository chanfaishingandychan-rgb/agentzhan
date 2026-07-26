# AI提示词库

面向中国大陆市场的中文 AI 提示词库 MVP，基于 Next.js、TypeScript、Tailwind CSS 构建，重点面向百度自然流量获取。

## 本地运行

1. 安装依赖

```bash
pnpm install
```

2. 生成内容

```bash
pnpm generate:content
```

3. 启动开发环境

```bash
pnpm dev
```

4. 生产构建

```bash
pnpm build
pnpm start
```

如果系统里没有全局 `pnpm` / `node`，可以先把 Codex runtime 路径加入 `PATH`：

```bash
export PATH="/Users/labubu/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:/Users/labubu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
```

## 部署方法

先复制环境变量：

```bash
cp .env.example .env.local
```

并把 `NEXT_PUBLIC_SITE_URL` 改成正式域名，例如：

```bash
NEXT_PUBLIC_SITE_URL=https://aipromptku.cn
```

### Vercel

1. 导入仓库
2. 设置环境变量 `NEXT_PUBLIC_SITE_URL=https://你的正式域名`
3. Build Command: `pnpm build`
4. Output 由 Next.js 自动处理
5. 域名接入后，确认首页源码中的 canonical、OG URL、sitemap 域名已经切换为正式域名

### Node.js 服务器

```bash
pnpm install
NEXT_PUBLIC_SITE_URL=https://你的正式域名 pnpm build
pnpm start
```

推荐配合 Nginx 反向代理，并开启 Brotli / Gzip、HTTP/2、TLS。

### Docker 部署

```bash
docker build -t ai-prompt-site .
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_SITE_URL=https://你的正式域名 \
  --name ai-prompt-site \
  ai-prompt-site
```

## 上线检查

上线前至少确认以下项目：

1. 正式域名已配置到 `NEXT_PUBLIC_SITE_URL`
2. `https://你的域名/sitemap.xml` 可访问
3. `https://你的域名/robots.txt` 可访问
4. 首页 canonical 指向正式域名
5. 任意提示词页 title、description、FAQ schema 正常输出
6. 百度站长平台已提交站点与 sitemap
7. 已接入基础统计和错误监控

## 项目结构

```text
app/
  page.tsx                  首页
  search/page.tsx           站内搜索页
  category/[slug]/page.tsx  分类页
  prompt/[slug]/page.tsx    提示词详情页
  sitemap.ts                Sitemap.xml
  robots.ts                 Robots.txt
components/
  prompt-card.tsx           提示词卡片
  search-box.tsx            搜索组件
  section-heading.tsx       区块标题
content/
  prompts.json              100 篇提示词数据
lib/
  prompts.ts                数据查询方法
  schema.ts                 Schema.org 结构化数据
  site.ts                   站点配置与分类配置
scripts/
  generate-prompts.mjs      内容生成脚本
```

## SEO 设定说明

- 所有页面均输出独立 `title`、`description`、`canonical`
- 首页、分类页、详情页包含 Open Graph 元信息
- 首页注入 `Organization` 与 `WebSite` Schema
- 分类页注入 `CollectionPage` Schema
- 提示词详情页注入 `Article`、`FAQPage`、`BreadcrumbList` Schema
- 自动生成 `sitemap.xml`
- 自动生成 `robots.txt`
- URL 结构简洁，适合百度抓取
- 所有内容使用简体中文
- 详情页字段完整，利于长尾关键词布局
- 搜索页为 `noindex,follow`，避免与详情页竞争收录
- 已添加基础安全响应头，适合直接上线

## 内容说明

- 当前已生成 100 篇提示词页面
- 分类分布：
  - AI写作 20 篇
  - AI办公 20 篇
  - AI学习 20 篇
  - AI短视频 20 篇
  - AI电商 20 篇
- 每篇包含标题、适用场景、使用方法、完整提示词、使用案例、最佳实践、FAQ、标签、SEO 字段

## 后续扩展建议

1. 把 `content/prompts.json` 升级为 CMS 或数据库，支持编辑后台与批量导入
2. 增加收藏、登录、会员权限、付费提示词和订单体系
3. 拆出工作流库、Agent Skills、MCP 资源库等二级频道
4. 接入百度统计、百度站长平台、自动推送与日志监控
5. 为分类页和标签页增加分页、筛选和排序，提高规模化收录能力
6. 为详情页增加相关推荐规则、作者页、专题页和内部链接网络
