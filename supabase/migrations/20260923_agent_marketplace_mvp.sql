-- Agentzhan AI marketplace MVP
-- Additive migration: does not alter existing content, analytics, or lead tables.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.agent_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_zh_hk TEXT NOT NULL,
  name_zh_cn TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agent_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id UUID NOT NULL REFERENCES public.agent_categories(id),
  slug TEXT NOT NULL UNIQUE,
  normalized_url TEXT NOT NULL UNIQUE,
  website_url TEXT NOT NULL,
  logo_url TEXT,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  developer_name TEXT NOT NULL,
  developer_email TEXT NOT NULL,
  developer_url TEXT,
  locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'zh-hk', 'zh-cn')),
  translations JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  ownership_status TEXT NOT NULL DEFAULT 'unverified' CHECK (ownership_status IN ('unverified', 'pending', 'verified', 'rejected')),
  review_notes TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agent_bid_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.agent_products(id) ON DELETE RESTRICT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_total_cents BIGINT NOT NULL CHECK (target_total_cents >= 500),
  balance_snapshot_cents BIGINT NOT NULL DEFAULT 0 CHECK (balance_snapshot_cents >= 0),
  charge_delta_cents BIGINT NOT NULL CHECK (charge_delta_cents >= 100),
  currency TEXT NOT NULL DEFAULT 'usd' CHECK (currency = 'usd'),
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'mock')),
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'checkout_pending', 'paid', 'failed', 'expired', 'refunded', 'partially_refunded')),
  idempotency_key TEXT NOT NULL UNIQUE,
  provider_checkout_id TEXT UNIQUE,
  provider_payment_id TEXT UNIQUE,
  failure_code TEXT,
  failure_message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agent_bid_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.agent_products(id) ON DELETE RESTRICT,
  order_id UUID REFERENCES public.agent_bid_orders(id) ON DELETE RESTRICT,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('payment', 'refund', 'chargeback', 'admin_adjustment')),
  amount_cents BIGINT NOT NULL CHECK (amount_cents <> 0),
  currency TEXT NOT NULL DEFAULT 'usd' CHECK (currency = 'usd'),
  provider_reference TEXT UNIQUE,
  note TEXT,
  effective_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agent_payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'mock')),
  provider_event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processed', 'ignored', 'failed')),
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_event_id)
);

CREATE TABLE IF NOT EXISTS public.agent_product_clicks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.agent_products(id) ON DELETE CASCADE,
  placement TEXT NOT NULL DEFAULT 'organic' CHECK (placement IN ('sponsored', 'organic', 'product_page')),
  visitor_hash TEXT,
  session_hash TEXT,
  referrer TEXT,
  country TEXT,
  user_agent TEXT,
  is_bot BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agent_submission_attempts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agent_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_type TEXT NOT NULL CHECK (actor_type IN ('admin', 'user', 'system', 'webhook')),
  actor_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  before_data JSONB,
  after_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_products_status_published ON public.agent_products(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_products_category ON public.agent_products(category_id);
CREATE INDEX IF NOT EXISTS idx_agent_products_owner ON public.agent_products(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_agent_ledger_product_effective ON public.agent_bid_ledger(product_id, effective_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_orders_product_status ON public.agent_bid_orders(product_id, status);
CREATE INDEX IF NOT EXISTS idx_agent_clicks_product_created ON public.agent_product_clicks(product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_submission_attempts_hash_created ON public.agent_submission_attempts(ip_hash, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_single_pending_checkout
  ON public.agent_bid_orders(product_id, user_id)
  WHERE status IN ('created', 'checkout_pending');

CREATE OR REPLACE FUNCTION public.agent_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_agent_categories_updated_at ON public.agent_categories;
CREATE TRIGGER trg_agent_categories_updated_at
  BEFORE UPDATE ON public.agent_categories
  FOR EACH ROW EXECUTE FUNCTION public.agent_set_updated_at();

DROP TRIGGER IF EXISTS trg_agent_products_updated_at ON public.agent_products;
CREATE TRIGGER trg_agent_products_updated_at
  BEFORE UPDATE ON public.agent_products
  FOR EACH ROW EXECUTE FUNCTION public.agent_set_updated_at();

DROP TRIGGER IF EXISTS trg_agent_bid_orders_updated_at ON public.agent_bid_orders;
CREATE TRIGGER trg_agent_bid_orders_updated_at
  BEFORE UPDATE ON public.agent_bid_orders
  FOR EACH ROW EXECUTE FUNCTION public.agent_set_updated_at();

CREATE OR REPLACE VIEW public.agent_leaderboard_all_time AS
SELECT
  p.id AS product_id,
  COALESCE(SUM(l.amount_cents), 0)::BIGINT AS amount_cents,
  MAX(l.effective_at) AS reached_total_at,
  COUNT(l.id) FILTER (WHERE l.entry_type = 'payment')::BIGINT AS payment_count
FROM public.agent_products p
LEFT JOIN public.agent_bid_ledger l ON l.product_id = p.id
WHERE p.status = 'approved'
GROUP BY p.id;

CREATE OR REPLACE VIEW public.agent_leaderboard_today AS
SELECT
  p.id AS product_id,
  COALESCE(SUM(l.amount_cents) FILTER (WHERE l.effective_at >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'), 0)::BIGINT AS amount_cents,
  MAX(l.effective_at) FILTER (WHERE l.effective_at >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC') AS reached_total_at,
  COUNT(l.id) FILTER (WHERE l.entry_type = 'payment' AND l.effective_at >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC')::BIGINT AS payment_count
FROM public.agent_products p
LEFT JOIN public.agent_bid_ledger l ON l.product_id = p.id
WHERE p.status = 'approved'
GROUP BY p.id;

CREATE OR REPLACE VIEW public.agent_leaderboard_week AS
SELECT
  p.id AS product_id,
  COALESCE(SUM(l.amount_cents) FILTER (WHERE l.effective_at >= date_trunc('week', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'), 0)::BIGINT AS amount_cents,
  MAX(l.effective_at) FILTER (WHERE l.effective_at >= date_trunc('week', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC') AS reached_total_at,
  COUNT(l.id) FILTER (WHERE l.entry_type = 'payment' AND l.effective_at >= date_trunc('week', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC')::BIGINT AS payment_count
FROM public.agent_products p
LEFT JOIN public.agent_bid_ledger l ON l.product_id = p.id
WHERE p.status = 'approved'
GROUP BY p.id;

CREATE OR REPLACE VIEW public.agent_product_public_metrics AS
SELECT
  p.id AS product_id,
  COUNT(c.id) FILTER (WHERE c.is_bot = false)::BIGINT AS click_count,
  MAX(c.created_at) FILTER (WHERE c.is_bot = false) AS last_clicked_at
FROM public.agent_products p
LEFT JOIN public.agent_product_clicks c ON c.product_id = p.id
WHERE p.status = 'approved'
GROUP BY p.id;

ALTER TABLE public.agent_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_bid_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_bid_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_product_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_submission_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS agent_categories_public_read ON public.agent_categories;
CREATE POLICY agent_categories_public_read ON public.agent_categories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS agent_products_public_read ON public.agent_products;
CREATE POLICY agent_products_public_read ON public.agent_products FOR SELECT USING (status = 'approved');

GRANT SELECT ON public.agent_categories, public.agent_products TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.agent_categories,
  public.agent_products,
  public.agent_bid_orders,
  public.agent_bid_ledger,
  public.agent_payment_events,
  public.agent_product_clicks,
  public.agent_submission_attempts,
  public.agent_audit_logs
TO service_role;
GRANT SELECT ON public.agent_leaderboard_all_time, public.agent_leaderboard_today, public.agent_leaderboard_week, public.agent_product_public_metrics TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

INSERT INTO public.agent_categories (slug, name_en, name_zh_hk, name_zh_cn, sort_order) VALUES
  ('general-agents', 'General Agents', '通用 Agent', '通用 Agent', 10),
  ('developer-tools', 'Developer Tools', '開發工具', '开发工具', 20),
  ('productivity', 'Productivity', '生產力', '生产力', 30),
  ('marketing-sales', 'Marketing & Sales', '市場及銷售', '市场及销售', 40),
  ('research-data', 'Research & Data', '研究及數據', '研究及数据', 50),
  ('customer-support', 'Customer Support', '客戶服務', '客户服务', 60),
  ('content-media', 'Content & Media', '內容及媒體', '内容及媒体', 70),
  ('automation', 'Automation', '自動化', '自动化', 80)
ON CONFLICT (slug) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_zh_hk = EXCLUDED.name_zh_hk,
  name_zh_cn = EXCLUDED.name_zh_cn,
  sort_order = EXCLUDED.sort_order;

NOTIFY pgrst, 'reload schema';
