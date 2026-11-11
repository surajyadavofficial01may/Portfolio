# REST API Documentation

All backend endpoints are mounted under `/api` and include `X-Request-Id` and `X-Content-Type-Options: nosniff` response headers.

---

## 1. Health & Readiness

### `GET /api/health`
Returns server liveness, uptime, and whether Supabase credentials are configured.

**Response (`200 OK`)**:
```json
{
  "status": "ok",
  "environment": "development",
  "uptimeSeconds": 142,
  "supabaseConfigured": true,
  "timestamp": "2026-11-11T17:30:00.000Z"
}
```

---

## 2. Knowledge Base & RAG Endpoints (Public Read)

### `GET /api/knowledge-base`
Returns metadata, live Supabase Storage URLs, and all 7 categories (`Personal_Details`, `Work_Experience`, `Technical_Skills`, `Projects`, `Articles`, `Social_Links`, `FAQs`).

### `GET /api/knowledge-base/:tab`
Returns the column definitions and rows for a single category (case-insensitive, e.g. `/api/knowledge-base/Projects`).
- Returns `404 NOT_FOUND_ERROR` if `:tab` is not one of the 7 valid categories.

### `GET /api/knowledge-base/:tab/csv`
Exports the specified category as RFC-4180 CSV (`id,title,content,url,active`).

### `GET /api/knowledge-base/rag?q=<query>&topK=<1..25>`
Retrieves the top-K active rows matching the query string `q` with verbatim `content` and `[Category | id | title | url]` citations.

---

## 3. Admin Authentication & Supabase Synchronization

### `POST /api/admin/verify`
Rate-limited (`15 req/min`). Verifies the administrator password against `process.env.ADMIN_PASSWORD` using constant-time comparison and issues a 2-hour HMAC-SHA256 Bearer token.

**Request Body**:
```json
{
  "password": "your_admin_password"
}
```

**Response (`200 OK`)**:
```json
{
  "authenticated": true,
  "token": "YWRtaW46MTc5...",
  "expiresInSeconds": 7200
}
```

### `POST /api/knowledge-base/sync-supabase`
Requires header `Authorization: Bearer <admin_token>`. Pushes all 7 categories (JSON, CSV, and Postgres table upsert) to Supabase and verifies public read-back.

### `POST /api/knowledge-base/webhook/github`
Triggers a server-side Supabase sync for CI/CD webhook integrations.

---

## 4. AI Assistant & Contact Endpoints

### `POST /api/chat`
Rate-limited (`45 req/min`). Validates `message` (1–2,000 characters) and optional `ragContext`, queries Gemini (`gemini-3.8-flash`) server-side when `GEMINI_API_KEY` is configured, or falls back to the deterministic RAG responder.

### `POST /api/contact`
Rate-limited (`10 req/min`). Validates `name` (<= 120 chars), `email` (valid format), and `message` (<= 4,000 chars) and returns a logged transmission receipt (`TX-xxxxxx`).

---

## 5. Standardized Error Response Format

All error responses (`400`, `401`, `403`, `404`, `429`, `500`, `502`) follow this structure:

```json
{
  "success": false,
  "error": "Descriptive error message",
  "category": "VALIDATION_ERROR | AUTHENTICATION_ERROR | NOT_FOUND_ERROR | RATE_LIMIT_ERROR | EXTERNAL_SERVICE_ERROR | INTERNAL_SERVER_ERROR",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```
