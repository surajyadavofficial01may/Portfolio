# Technical Debt Register

## 1. Resolved Technical Debt

| Debt ID | Area | Description | Resolution |
| :--- | :--- | :--- | :--- |
| **TD-01** | Security & Config | Scattered `process.env` reads and hardcoded fallback keys across scripts and services. | Centralized in `src/config/env.ts` and `src/config/clientEnv.ts` with `ConfigurationError` startup validation. |
| **TD-02** | Backend Architecture | Monolithic `server.ts` mixing HTTP transport, business logic, AI prompts, and auth signing. | Refactored into modular `src/server/{logger,errors,middleware,services,routes}` layers. |
| **TD-03** | Error Handling | Ad-hoc `res.status(400/500).json(...)` responses with inconsistent payload shapes. | Standardized via `AppError` hierarchy and `errorHandlerMiddleware` with correlation `requestId`. |
| **TD-04** | Observability | Unstructured `console.log`/`console.error` calls without timestamps, request IDs, or secret redaction. | Replaced with `StructuredLogger` (`src/server/logger.ts`) and `securityAndTracingMiddleware`. |
| **TD-05** | CI/CD Reliability | `npm ci` lockfile mismatch and silent Supabase upload failures. | Fixed workflow install step and added strict HTTP status + read-back verification in `sync-knowledge-base-to-supabase.ts`. |
| **TD-06** | Dependency Hygiene | Unused `firebase` SDK and duplicate `vite` declaration in `package.json`. | Cleaned up `package.json` and removed unused `firebase-applet-config.json`. |

---

## 2. Remaining / Future Technical Debt (Tracked & Low Risk)

| Debt ID | Area | Description | Mitigation & Future Plan |
| :--- | :--- | :--- | :--- |
| **TD-07** | Rate Limiting & Admin Sessions | Rate limiters and HMAC signing keys are stored in process memory (`Map` / per-process random key). | Appropriate for single-instance deployment; if horizontally scaled across multiple replicas, back rate limiting and session verification with Redis or a shared `ADMIN_SESSION_SECRET` env var. |
| **TD-08** | Contact Form Persistence | `POST /api/contact` validates and logs transmissions with a unique `TX-...` ID in structured server logs rather than persisting to a database table. | Can optionally be persisted to a Supabase `contact_transmissions` table if long-term inbox storage is desired. |
| **TD-09** | Vector Embeddings in RAG | `retrieveKnowledgeForQuery` uses weighted token matching and category boosting across the 35 curated facts. | Because the 7-tab knowledge base is compact (35 self-contained facts), in-memory token scoring executes in ~0.018ms/query with 100% determinism; pgvector in Supabase can be added if the KB grows beyond 1,000+ rows. |
