-- Agent站 Supabase Schema
-- 在 Supabase SQL Editor 中執行此檔案以建立資料表與輔助索引/函數

-- 1. categories
CREATE TABLE IF NOT EXISTS categories (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT,
  intro       TEXT,
  keywords    TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. prompts
CREATE TABLE IF NOT EXISTS prompts (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  summary         TEXT,
  seo_title       TEXT,
  seo_description TEXT,
  category_slug   TEXT REFERENCES categories(slug),
  tags            TEXT[] DEFAULT '{}',
  difficulty      TEXT NOT NULL DEFAULT '入门',
  model           TEXT NOT NULL DEFAULT 'ChatGPT',
  tier            TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'vip')),
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  quality_score   INTEGER NOT NULL DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 10),
  prompt_content  TEXT NOT NULL,
  instructions    TEXT[] DEFAULT '{}',
  use_cases       TEXT[] DEFAULT '{}',
  best_practices  TEXT[] DEFAULT '{}',
  example         TEXT,
  expected_result TEXT,
  use_scene       TEXT,
  faq             JSONB DEFAULT '[]',
  popularity      INTEGER NOT NULL DEFAULT 0,
  copy_count      INTEGER NOT NULL DEFAULT 0,
  view_count      INTEGER NOT NULL DEFAULT 0,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category_slug);
CREATE INDEX IF NOT EXISTS idx_prompts_status   ON prompts(status);
CREATE INDEX IF NOT EXISTS idx_prompts_tier     ON prompts(tier);
CREATE INDEX IF NOT EXISTS idx_prompts_model    ON prompts(model);
CREATE INDEX IF NOT EXISTS idx_prompts_difficulty ON prompts(difficulty);
CREATE INDEX IF NOT EXISTS idx_prompts_quality  ON prompts(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_created  ON prompts(created_at DESC);

-- 3. ai_generation_logs
CREATE TABLE IF NOT EXISTS ai_generation_logs (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  run_time        TIMESTAMPTZ NOT NULL DEFAULT now(),
  generated_count INTEGER NOT NULL DEFAULT 0,
  published_count INTEGER NOT NULL DEFAULT 0,
  draft_count     INTEGER NOT NULL DEFAULT 0,
  failed_count    INTEGER NOT NULL DEFAULT 0,
  error_message   TEXT,
  summary         TEXT,
  details         JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_logs_run_time ON ai_generation_logs(run_time DESC);

-- 4. prompt_quality_scores
CREATE TABLE IF NOT EXISTS prompt_quality_scores (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  prompt_slug  TEXT NOT NULL,
  prompt_title TEXT,
  score        INTEGER NOT NULL CHECK (score >= 0 AND score <= 10),
  reason       TEXT,
  scored_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scores_slug ON prompt_quality_scores(prompt_slug);

-- 5. leads
CREATE TABLE IF NOT EXISTS leads (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email           TEXT NOT NULL,
  source          TEXT NOT NULL DEFAULT 'homepage',
  interested_pack TEXT NOT NULL DEFAULT 'free-prompt-pack',
  status          TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'ignored')),
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email_pack ON leads (email, interested_pack);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_pack ON leads(interested_pack);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- 6. page_views
CREATE TABLE IF NOT EXISTS page_views (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  path        TEXT NOT NULL,
  search      TEXT,
  full_path   TEXT NOT NULL,
  title       TEXT,
  referrer    TEXT,
  visitor_id  TEXT,
  session_id  TEXT,
  user_agent  TEXT,
  device_type TEXT NOT NULL DEFAULT 'unknown',
  is_bot      BOOLEAN NOT NULL DEFAULT false,
  country     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_device ON page_views(device_type);
CREATE INDEX IF NOT EXISTS idx_page_views_country ON page_views(country);

-- API 權限：server-side Supabase service role 需要讀寫站內資料表。
GRANT USAGE ON SCHEMA public TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  public.categories,
  public.prompts,
  public.ai_generation_logs,
  public.prompt_quality_scores,
  public.leads,
  public.page_views
TO service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO service_role;

NOTIFY pgrst, 'reload schema';

-- 輔助：自動更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prompts_updated_at ON prompts;
CREATE TRIGGER trg_prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入預設分類（與 lib/site.ts 對齊）
INSERT INTO categories (slug, name, description, intro, keywords) VALUES
  ('ai-writing',            'AI寫作',     '覆蓋爆款選題、文章改寫、公眾號、履歷、營銷文案等高頻寫作場景。', 'AI寫作分類面向內容創作者、運營團隊、品牌市場和個人表達場景。', ARRAY['AI寫作提示詞','中文寫作提示詞','公眾號提示詞','文案提示詞']),
  ('ai-office',             'AI辦公',     '面向職場與企業管理，包含匯報、會議紀要、表格分析、郵件與 SOP。', 'AI辦公分類聚焦上班族和企業團隊日常提效。', ARRAY['AI辦公提示詞','會議紀要提示詞','週報提示詞','職場AI工具']),
  ('ai-learning',           'AI學習',     '服務學生和終身學習者，適合預習、複習、考試、論文與語言學習。', 'AI學習分類服務學生、考證人群和終身學習者。', ARRAY['AI學習提示詞','考試提示詞','論文提示詞','學生AI工具']),
  ('ai-short-video',        'AI短視頻',   '聚焦抖音、快手、小紅書視頻腳本、分鏡、標題、直播與漲粉玩法。', 'AI短視頻分類聚焦短視頻創作與直播轉化。', ARRAY['短視頻提示詞','抖音腳本提示詞','直播話術提示詞','小紅書視頻文案']),
  ('ai-ecommerce',          'AI電商',     '適合淘寶、天貓、京東、拼多多、獨立站與跨境賣家進行運營提效。', 'AI電商分類面向平台賣家、品牌電商和跨境團隊。', ARRAY['AI電商提示詞','淘寶提示詞','電商運營提示詞','跨境電商AI']),
  ('ai-marketing',          'AI營銷',     '覆蓋品牌傳播、投放優化、增長策劃、私域轉化、活動創意與用戶運營。', 'AI營銷分類適合品牌市場、增長團隊、投放團隊和私域操盤手。', ARRAY['AI營銷提示詞','增長提示詞','私域營銷提示詞','品牌策劃AI']),
  ('ai-customer-service',   'AI客服',     '面向售前、售後、回訪、知識庫、標準話術與服務質量管理場景。', 'AI客服分類適合電商客服、SaaS 客服、企業服務團隊和售後管理者。', ARRAY['AI客服提示詞','售後話術提示詞','客服知識庫提示詞','客服AI']),
  ('ai-startup',            'AI創業',     '覆蓋創業方向驗證、商業模式梳理、融資材料、產品定位與冷啟動方案。', 'AI創業分類面向創業者、小團隊和中小企業老闆。', ARRAY['AI創業提示詞','商業計劃書提示詞','創業項目AI','融資路演AI']),
  ('ai-personal-assistant', 'AI個人助理', '適合日程管理、個人復盤、生活決策、溝通協助與多任務安排。', 'AI個人助理分類適合個人效率管理者、自由職業者和高密度工作者。', ARRAY['AI個人助理提示詞','日程管理AI','個人規劃提示詞','效率助手AI']),
  ('ai-efficiency-tools',   'AI效率工具', '聚焦自動化、工具組合、流程提效、知識管理與跨平台協作。', 'AI效率工具分類強調工具鏈組合與流程自動化。', ARRAY['AI效率工具','AI自動化提示詞','工作流提示詞','知識管理AI'])
ON CONFLICT (slug) DO NOTHING;
