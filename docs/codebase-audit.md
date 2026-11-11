# Codebase Audit Report

## 1. Audit Scope

A full-repository audit was performed across all 19 engineering dimensions: directory layout, frontend/backend architecture, REST API design, Supabase integration, authentication/authorization, AI/LLM integration, configuration management, error handling, observability, testing, CI/CD, and dependency hygiene.

---

## 2. Key Findings & Remediation Matrix

| ID | Location | Problem Description | Impact | Severity | Resolution Implemented |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AUD-01** | `scripts/sync-knowledge-base-to-supabase.ts` | Hardcoded fallback credentials (`SUPABASE_DEFAULT_SECRET_KEY`, `SUPABASE_DEFAULT_URL`, `SUPABASE_DEFAULT_PUBLISHABLE_KEY`) and silent ignore of HTTP upload errors. | Exposed credentials in source control; CI could report green even if Supabase uploads failed with `401/403`. | **CRITICAL** | Removed all hardcoded secrets; integrated `src/config/env.ts`; added strict HTTP status assertions and post-upload read-back verification. |
| **AUD-02** | `src/components/KnowledgeBaseStudioModal.tsx` & `src/App.tsx` | `/admin` password was previously hardcoded in client code (`ADMIN_PASSCODE`), and `<KnowledgeBaseStudioModal />` was mounted before authentication. | Client bundle inspection could reveal the password; admin component mounted prematurely. | **HIGH** | Moved password verification to `POST /api/admin/verify` using constant-time comparison against `process.env.ADMIN_PASSWORD`; updated `App.tsx` so `<KnowledgeBaseStudioModal />` stays unmounted until `adminToken` is issued. |
| **AUD-03** | `server.ts` | Monolithic 347-line server file combining Express setup, Gemini SDK initialization, RAG fallback strings, admin token logic, and route handlers without request size limits, rate limiting, or structured error middleware. | Tight coupling, harder unit/API testing, and lack of brute-force protection on `/api/admin/verify` and `/api/chat`. | **HIGH** | Extracted `src/server/logger.ts`, `src/server/errors.ts`, `src/server/middleware/security.ts`, `src/server/services/adminAuthService.ts`, `src/server/services/chatService.ts`, and `src/server/routes/apiRouter.ts`; added 64KB body limit and sliding-window rate limiters. |
| **AUD-04** | `.github/workflows/sync-supabase-kb.yml` | Used `cache: "npm"` and `npm ci` in a repository with `bun.lock` and no `package-lock.json`. | GitHub Actions runner would fail at dependency installation on merge. | **HIGH** | Updated workflow to detect `package-lock.json` and fall back cleanly to `npm install --no-audit --no-fund`, plus added concurrency locking and `workflow_dispatch`. |
| **AUD-05** | `src/data/knowledgeBaseSchema.ts` | `retrieveKnowledgeForQuery` re-concatenated and re-lowercased all 35 knowledge base records on every single query invocation. | Avoidable string allocations and CPU overhead on repeated RAG queries. | **MEDIUM** | Implemented `WeakMap<PortfolioKnowledgeBaseData, IndexedChunk[]>` pre-indexing, reducing 1,000 RAG queries to ~18ms (~0.018ms/query). |
| **AUD-06** | `package.json` & `/firebase-applet-config.json` | Unused `firebase` (`^13.2.0`) dependency, duplicate `vite` entry in `devDependencies`, and unused `firebase-applet-config.json` file. | Unnecessary dependency footprint and dead configuration file. | **MEDIUM** | Removed unused `firebase` dependency, deduplicated `vite`, and deleted `/firebase-applet-config.json`. |
| **AUD-07** | `scripts/test-suite.ts` | No automated unit or API integration test suite existed beyond secret scanning. | Regressions in RAG filtering, API status codes, or auth tokens could go undetected. | **HIGH** | Created `scripts/test-suite.ts` (`npm test`) covering unit, integration, API, security, and performance benchmarks, and added it to CI. |
