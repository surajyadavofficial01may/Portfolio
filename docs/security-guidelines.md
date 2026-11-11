# Security Guidelines

## 1. Secret Management Policy

- **Zero Hardcoded Secrets**: Never hardcode API keys, database credentials, Supabase secret keys (`sb_secret_*`), or passwords in source files, tests, or GitHub Actions YAML files.
- **Centralized Access**:
  - Backend & CLI scripts must read environment variables exclusively through `src/config/env.ts` (`getServerConfig()`).
  - Frontend code must read public configuration exclusively through `src/config/clientEnv.ts` (`getClientConfig()`).
- **Client Bundle Boundary**: Never prefix private secrets (`SUPABASE_SECRET_KEY`, `ADMIN_PASSWORD`, `GEMINI_API_KEY`) with `VITE_`.

---

## 2. Authentication & Authorization (`/admin`)

- The `/admin` route in `src/App.tsx` keeps `<KnowledgeBaseStudioModal />` completely unmounted until authentication succeeds.
- Password verification runs exclusively on the backend (`POST /api/admin/verify`) using constant-time comparison (`crypto.timingSafeEqual`) against `process.env.ADMIN_PASSWORD`.
- Upon verification, the server issues a 2-hour HMAC-SHA256 signed session token required in the `Authorization: Bearer <token>` header for `POST /api/knowledge-base/sync-supabase`.

---

## 3. Input Validation, Rate Limiting & Log Redaction

- **Payload Limits**: Express JSON body parsing is restricted to `64kb` (`express.json({ limit: '64kb' })`).
- **Endpoint Rate Limiting**: Sliding-window rate limiters protect `/api/admin/verify` (15 req/min), `/api/chat` (45 req/min), and `/api/contact` (10 req/min).
- **Automatic Log Redaction**: `StructuredLogger` (`src/server/logger.ts`) recursively masks any metadata key matching `password|passcode|secret|token|apikey|authorization` and any string matching `sb_secret_*`, `sk-*`, `gsk_*`, or `AIza*`.

---

## 4. Automated Secret Scanning

Run the secret scanner before committing:
```bash
npm run security:scan
```
GitHub Actions (`security-secret-scan.yml`) runs both **Gitleaks** (`.gitleaks.toml`) and `npm run security:scan` on every push and pull request.
