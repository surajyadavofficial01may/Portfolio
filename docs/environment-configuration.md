# Environment Configuration Reference

## 1. Configuration Architecture

All environment variables are managed through two centralized modules:

- **Backend / CLI (`src/config/env.ts`)**: Loads `.env` via `dotenv`, normalizes values, and validates required secrets via `validateStartupConfig()`, `validateSupabaseSyncConfig()`, and `validateAdminAuthConfig()`.
- **Frontend (`src/config/clientEnv.ts`)**: Reads only public `VITE_*` variables for read-only Supabase discovery.

---

## 2. Environment Variables Table

| Variable | Scope | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | Backend | No | `development` | `development`, `production`, or `test`. |
| `PORT` | Backend | No | `3000` | Port bound by `server.ts`. |
| `APP_URL` | Backend | No | `undefined` | Public base URL of the application. |
| `GEMINI_API_KEY` | Backend | No | `undefined` | Server-side Google Gemini API key (`gemini-3.8-flash`). |
| `SUPABASE_URL` | Backend / CLI | **Yes** | None | Supabase project URL (`https://<project-ref>.supabase.co`). |
| `SUPABASE_PUBLISHABLE_KEY` | Backend / CLI | **Yes** | None | Supabase publishable / anon key. |
| `SUPABASE_SECRET_KEY` | Backend / CLI | **Yes** | None | Supabase secret key for server-side Storage & Postgres upserts. |
| `SUPABASE_JWKS_URL` | Backend / CLI | No | `${SUPABASE_URL}/auth/v1/.well-known/jwks.json` | Supabase JWKS endpoint. |
| `SUPABASE_KB_BUCKET` | Backend / CLI | No | `portfolio-knowledge-base` | Public storage bucket name for KB JSON/CSV files. |
| `SUPABASE_KB_TABLE` | Backend / CLI | No | `portfolio_knowledge_base` | Postgres table name for KB records. |
| `ADMIN_PASSWORD` | Backend | **Yes** | None | Password required by `POST /api/admin/verify` to unlock `/admin`. |
| `VITE_SUPABASE_URL` | Frontend | No | `""` | Public Supabase URL for read-only browser queries. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Frontend | No | `""` | Public Supabase publishable key for read-only browser queries. |
| `VITE_SUPABASE_JWKS_URL` | Frontend | No | `""` | Public Supabase JWKS URL. |
| `VITE_SUPABASE_KB_BUCKET` | Frontend | No | `portfolio-knowledge-base` | Public bucket identifier. |
| `VITE_SUPABASE_KB_TABLE` | Frontend | No | `portfolio_knowledge_base` | Public table identifier. |
