-- ============================================================================
-- SUPABASE SCHEMA: Portfolio_Knowledge_Base (7-Tab AI Chatbot RAG Schema)
-- Target: Configure SUPABASE_URL in environment variables (.env)
-- Categories: Personal_Details, Work_Experience, Technical_Skills,
--             Projects, Articles, Social_Links, FAQs
-- Columns: id, category, title, content, url, active, sort_order, updated_at
-- ============================================================================

-- 1. Master table storing all 7 knowledge base categories
CREATE TABLE IF NOT EXISTS public.portfolio_knowledge_base (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (
    category IN (
      'Personal_Details',
      'Work_Experience',
      'Technical_Skills',
      'Projects',
      'Articles',
      'Social_Links',
      'FAQs'
    )
  ),
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast category + ordering queries (e.g. latest Projects on top)
CREATE INDEX IF NOT EXISTS idx_portfolio_kb_category_order
  ON public.portfolio_knowledge_base (category, sort_order ASC);

CREATE INDEX IF NOT EXISTS idx_portfolio_kb_active
  ON public.portfolio_knowledge_base (active);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Allow public read access (publishable key) for external AI chatbot services
DROP POLICY IF EXISTS "Allow public read access on portfolio_knowledge_base" ON public.portfolio_knowledge_base;
CREATE POLICY "Allow public read access on portfolio_knowledge_base"
  ON public.portfolio_knowledge_base
  FOR SELECT
  USING (true);

-- 3. Dedicated Views matching each of the 7 Knowledge Base Tabs
--    Each view exposes exact columns: (id, title, content, url, active)
CREATE OR REPLACE VIEW public."Personal_Details" AS
  SELECT id, title, content, url, CASE WHEN active THEN 'TRUE' ELSE 'FALSE' END AS active
  FROM public.portfolio_knowledge_base
  WHERE category = 'Personal_Details'
  ORDER BY sort_order ASC;

CREATE OR REPLACE VIEW public."Work_Experience" AS
  SELECT id, title, content, url, CASE WHEN active THEN 'TRUE' ELSE 'FALSE' END AS active
  FROM public.portfolio_knowledge_base
  WHERE category = 'Work_Experience'
  ORDER BY sort_order ASC;

CREATE OR REPLACE VIEW public."Technical_Skills" AS
  SELECT id, title, content, url, CASE WHEN active THEN 'TRUE' ELSE 'FALSE' END AS active
  FROM public.portfolio_knowledge_base
  WHERE category = 'Technical_Skills'
  ORDER BY sort_order ASC;

CREATE OR REPLACE VIEW public."Projects" AS
  SELECT id, title, content, url, CASE WHEN active THEN 'TRUE' ELSE 'FALSE' END AS active
  FROM public.portfolio_knowledge_base
  WHERE category = 'Projects'
  ORDER BY sort_order ASC;

CREATE OR REPLACE VIEW public."Articles" AS
  SELECT id, title, content, url, CASE WHEN active THEN 'TRUE' ELSE 'FALSE' END AS active
  FROM public.portfolio_knowledge_base
  WHERE category = 'Articles'
  ORDER BY sort_order ASC;

CREATE OR REPLACE VIEW public."Social_Links" AS
  SELECT id, title, content, url, CASE WHEN active THEN 'TRUE' ELSE 'FALSE' END AS active
  FROM public.portfolio_knowledge_base
  WHERE category = 'Social_Links'
  ORDER BY sort_order ASC;

CREATE OR REPLACE VIEW public."FAQs" AS
  SELECT id, title, content, url, CASE WHEN active THEN 'TRUE' ELSE 'FALSE' END AS active
  FROM public.portfolio_knowledge_base
  WHERE category = 'FAQs'
  ORDER BY sort_order ASC;
