-- AgentZhan production database repair
-- Run this once in Supabase SQL Editor for project jutbbpvdhumxoymeaaeq.

CREATE TABLE IF NOT EXISTS public.ai_generation_logs (
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

CREATE INDEX IF NOT EXISTS idx_logs_run_time ON public.ai_generation_logs(run_time DESC);

CREATE TABLE IF NOT EXISTS public.prompt_quality_scores (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  prompt_slug  TEXT NOT NULL,
  prompt_title TEXT,
  score        INTEGER NOT NULL CHECK (score >= 0 AND score <= 10),
  reason       TEXT,
  scored_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scores_slug ON public.prompt_quality_scores(prompt_slug);

CREATE TABLE IF NOT EXISTS public.leads (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email           TEXT NOT NULL,
  source          TEXT NOT NULL DEFAULT 'homepage',
  interested_pack TEXT NOT NULL DEFAULT 'free-prompt-pack',
  status          TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'ignored')),
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email_pack ON public.leads (email, interested_pack);
CREATE INDEX IF NOT EXISTS idx_leads_created ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_pack ON public.leads(interested_pack);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

CREATE TABLE IF NOT EXISTS public.ai_news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  raw_title text,
  source text not null,
  source_url text not null unique,
  published_at date not null,
  category text not null check (category in ('模型更新', '产品功能', 'Agent趋势', '行业应用', '安全与合规')),
  summary text not null,
  takeaway text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

CREATE INDEX IF NOT EXISTS ai_news_published_at_idx ON public.ai_news (published_at DESC);
CREATE INDEX IF NOT EXISTS ai_news_category_idx ON public.ai_news (category);

CREATE TABLE IF NOT EXISTS public.page_views (
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

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_page_views_created ON public.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON public.page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_device ON public.page_views(device_type);
CREATE INDEX IF NOT EXISTS idx_page_views_country ON public.page_views(country);

GRANT USAGE ON SCHEMA public TO service_role;

DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'categories',
    'prompts',
    'ai_generation_logs',
    'prompt_quality_scores',
    'leads',
    'ai_news',
    'page_views'
  ]
  LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO service_role', table_name);
    END IF;
  END LOOP;
END $$;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO service_role;

NOTIFY pgrst, 'reload schema';
