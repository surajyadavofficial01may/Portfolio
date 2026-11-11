# Deployment Guide

## 1. Production Build Process

The production build pipeline (`npm run build`) executes three sequential steps:

1. **Supabase Knowledge Base Synchronization**:
   Runs `tsx scripts/sync-knowledge-base-to-supabase.ts` to push all 7 categories (`Personal_Details`, `Work_Experience`, `Technical_Skills`, `Projects`, `Articles`, `Social_Links`, `FAQs`) to Supabase Storage and Postgres, and verifies public read-back.
2. **Frontend Static Bundle**:
   Runs `vite build` to compile the React 19 SPA into `dist/`.
3. **Backend Server Bundle**:
   Runs `esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`.

---

## 2. Starting the Production Server

```bash
NODE_ENV=production npm start
```
In production mode (`NODE_ENV=production`), `validateStartupConfig({ strict: true })` enforces that `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, and `ADMIN_PASSWORD` are present before starting the server.

---

## 3. GitHub Actions CI/CD Workflows

1. **`sync-supabase-kb.yml` (Automated Merge Sync)**:
   - Triggers on every `push` (or merged PR) to `main` or `master`, as well as manual `workflow_dispatch`.
   - Uses concurrency group `supabase-kb-sync-${{ github.ref }}` to prevent overlapping syncs.
   - Requires Repository Secrets: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWKS_URL`.
2. **`security-secret-scan.yml` (Quality & Security Gate)**:
   - Triggers on every `push` and `pull_request`.
   - Executes Gitleaks, `npm run security:scan`, `npm test`, and `npm run lint`.

---

## 4. Rollback Strategy

- **Application Rollback**: Revert to the previous immutable container image or Git tag and redeploy.
- **Knowledge Base Rollback**: Because `src/data/knowledgeBaseSchema.ts` is version-controlled in Git and rows use stable IDs (`PER001`, `PRJ008`, etc.), reverting a commit on `main` automatically triggers `sync-supabase-kb.yml` to restore the exact prior state in Supabase.
