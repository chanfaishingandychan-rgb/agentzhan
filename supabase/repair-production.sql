-- AgentZhan production database repair
-- Run this once in Supabase SQL Editor for project jutbbpvdhumxoymeaaeq.

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

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  public.categories,
  public.prompts,
  public.ai_generation_logs,
  public.prompt_quality_scores,
  public.leads,
  public.ai_news,
  public.page_views
TO service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO service_role;

NOTIFY pgrst, 'reload schema';
