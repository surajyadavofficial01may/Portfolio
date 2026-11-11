# Development Guide

## 1. Prerequisites

- **Node.js**: v20+ (LTS recommended)
- **npm**: v10+ (or `bun`)
- **Supabase Project**: For hosting the 7-tab `Portfolio_Knowledge_Base`

---

## 2. Local Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env` and populate your credentials:
   ```bash
   cp .env.example .env
   ```
   Required variables in `.env`:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY`
   - `ADMIN_PASSWORD`
   - `GEMINI_API_KEY` *(optional; uses deterministic RAG responder if unset)*

3. **Start the full-stack development server (Port 3000)**:
   ```bash
   npm run dev
   ```

---

## 3. Common Development Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Express + Vite middleware server on `http://0.0.0.0:3000` |
| `npm test` | Runs the automated unit, integration, API, security, and benchmark test suite |
| `npm run security:scan` | Scans the entire repository for hardcoded secrets and validates config error handling |
| `npm run lint` | Runs TypeScript static type checking (`tsc --noEmit`) |
| `npm run sync:supabase` | Syncs all 7 categories of `Portfolio_Knowledge_Base` to Supabase Storage & Postgres |
| `npm run build` | Syncs Supabase KB, builds the production Vite bundle (`dist/`), and bundles `dist/server.cjs` |
| `npm start` | Runs the compiled production server (`node dist/server.cjs`) |

---

## 4. Updating the Portfolio Knowledge Base

Whenever you add or update personal details, work experience, skills, projects, articles, social links, or FAQs:

1. Edit the corresponding category in `src/data/knowledgeBaseSchema.ts` (`DEFAULT_PORTFOLIO_KNOWLEDGE_BASE`):
   - Keep the 7 fixed category names: `Personal_Details`, `Work_Experience`, `Technical_Skills`, `Projects`, `Articles`, `Social_Links`, `FAQs`.
   - Assign a unique, stable `id` (never reuse or rename existing IDs).
   - Write `content` as a complete, self-contained fact.
   - Place the newest project at index `0` of `Projects`.
   - To retire a fact, set `active: 'FALSE'` instead of deleting the row.
2. Run `npm run sync:supabase` (or merge to `main`/`master` so GitHub Actions syncs automatically).
