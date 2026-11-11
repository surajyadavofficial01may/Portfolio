# Architecture Overview

## 1. System Summary

This repository implements **Suraj Kumar Yadav's Interactive Retro Developer Console Portfolio**, the **DevOrbit Open Developer Community** (`/devorbit`), an **AI Assistant Companion** powered by a 7-category RAG knowledge base (`Portfolio_Knowledge_Base`), and a restricted **Supabase Knowledge Base Studio** (`/admin`).

The application uses a unified full-stack TypeScript architecture:

- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Vite 6 SPA.
- **Backend**: Express 4 + Node.js HTTP server (`server.ts`) mounting modular API routes (`src/server/routes/apiRouter.ts`), structured logging (`src/server/logger.ts`), centralized exception handling (`src/server/errors.ts`), and server-side services (`src/server/services/`).
- **Cloud Data & Storage Layer**: **Supabase** (`portfolio-knowledge-base` public storage bucket + `public.portfolio_knowledge_base` PostgreSQL table and 7 category views).
- **AI Layer**: Server-side `@google/genai` (`gemini-3.8-flash`) with a deterministic, zero-latency RAG fallback engine.

---

## 2. Directory & Module Structure

```text
/
├── .env.example                        # Documented environment variable template (placeholders only)
├── .gitleaks.toml                      # Automated secret detection rules
├── .github/workflows/
│   ├── sync-supabase-kb.yml            # CI/CD: Auto-syncs 7-tab KB to Supabase on merge to main/master
│   └── security-secret-scan.yml        # CI: Gitleaks, secret scan, unit/API tests, TypeScript check
├── docs/                               # Engineering, architecture, security & operational docs
├── scripts/
│   ├── sync-knowledge-base-to-supabase.ts # CLI & runtime Supabase storage + Postgres upsert engine
│   ├── scan-secrets.ts                 # Pre-commit & CI secret scanner + config validation checks
│   └── test-suite.ts                   # Automated unit, integration, API, security & benchmark tests
├── supabase/
│   └── schema.sql                      # PostgreSQL DDL, indexes, RLS policies, and 7 category views
├── server.ts                           # Express application factory (`createApp`) and server entrypoint
└── src/
    ├── App.tsx                         # Root SPA router (`/`, `/devorbit`, and gated `/admin`)
    ├── types.ts                        # Shared TypeScript domain interfaces
    ├── config/
    │   ├── env.ts                      # Centralized backend/CLI configuration & startup validation
    │   └── clientEnv.ts                # Centralized frontend public configuration (`VITE_*`)
    ├── data/
    │   ├── portfolioData.ts            # Portfolio UI structured data (projects, skills, articles)
    │   ├── devorbitData.ts             # DevOrbit community data
    │   └── knowledgeBaseSchema.ts      # Canonical 7-tab RAG schema, 35 records, and WeakMap indexer
    ├── services/
    │   └── supabaseKnowledgeBaseService.ts # Frontend KB client, admin auth client, and sync trigger
    ├── server/
    │   ├── logger.ts                   # Structured logger with automatic secret redaction
    │   ├── errors.ts                   # Custom exception hierarchy & Express error middleware
    │   ├── middleware/
    │   │   └── security.ts             # Request tracing (`X-Request-Id`), security headers, rate limiting, input validation
    │   ├── services/
    │   │   ├── adminAuthService.ts     # Constant-time password verification & HMAC-SHA256 tokens
    │   │   └── chatService.ts          # Server-side Gemini SDK & deterministic RAG fallback service
    │   └── routes/
    │       └── apiRouter.ts            # Modular `/api/*` REST endpoints
    └── components/                     # Modular UI components (Console, Arcade, Modals, AI Companion, Admin Studio)
```

---

## 3. Data Flow & Knowledge Base Synchronization

1. **Canonical Knowledge Base (`src/data/knowledgeBaseSchema.ts`)**:
   - Defines 7 fixed categories: `Personal_Details`, `Work_Experience`, `Technical_Skills`, `Projects` (ordered newest-first with `PRJ008` Jira Fixer at index 0), `Articles`, `Social_Links`, and `FAQs`.
   - Every row follows the 5-column contract: `(id, title, content, url, active)`.
2. **Automated Synchronization (`scripts/sync-knowledge-base-to-supabase.ts`)**:
   - Triggered automatically on `npm run build`, server startup, `/admin` manual sync, and GitHub Actions merge (`sync-supabase-kb.yml`).
   - Uploads `Portfolio_Knowledge_Base.json` and per-category `.json` and `.csv` objects to the Supabase Storage bucket `portfolio-knowledge-base`, upserts records into `public.portfolio_knowledge_base`, and performs a live read-back verification check.
3. **AI Chatbot RAG Pipeline (`POST /api/chat`)**:
   - Retrieves top-K active rows (`active !== 'FALSE'`) using the pre-indexed `retrieveKnowledgeForQuery` engine and injects verbatim `content` + source citations into the server-side Gemini prompt (or deterministic fallback responder).
