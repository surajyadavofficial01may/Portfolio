# ADR 001: Supabase Dual Storage & PostgREST Architecture for the 7-Tab RAG Knowledge Base

## Status
Accepted

## Context
The portfolio AI chatbot and external services require a single, authoritative 7-category knowledge base (`Personal_Details`, `Work_Experience`, `Technical_Skills`, `Projects`, `Articles`, `Social_Links`, `FAQs`) where each row has a stable `id`, standalone verbatim `content`, optional citation `title`/`url`, and an `active` flag (`TRUE`/`FALSE`). Additionally, external services written in Python or Node.js need to consume this data either as structured JSON/CSV files or via SQL/REST queries, and updates merged to GitHub must sync automatically without manual intervention.

## Decision
We store and sync `Portfolio_Knowledge_Base` in **Supabase** using a dual-target sync in `scripts/sync-knowledge-base-to-supabase.ts`:
1. **Supabase Storage Public Bucket (`portfolio-knowledge-base`)**: Hosts `Portfolio_Knowledge_Base.json` and per-category `{Category}.json` and `{Category}.csv` files with automatic read-back verification.
2. **Supabase PostgreSQL Table (`public.portfolio_knowledge_base`) & 7 Category Views (`supabase/schema.sql`)**: Upserts all 35 records by stable `id` with `sort_order` preservation (`PRJ008` Jira Fixer first in `Projects`) and public read Row Level Security (RLS).

## Consequences
- External services can read the knowledge base immediately via HTTP GET (JSON/CSV) or PostgREST (`/rest/v1/portfolio_knowledge_base`).
- Every merge to `main`/`master` automatically syncs and verifies the knowledge base via `.github/workflows/sync-supabase-kb.yml`.
