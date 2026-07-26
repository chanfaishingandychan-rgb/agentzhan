create table if not exists public.ai_news (
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

create index if not exists ai_news_published_at_idx on public.ai_news (published_at desc);
create index if not exists ai_news_category_idx on public.ai_news (category);
