# Suraj Kumar Yadav — Interactive Retro Developer Console Portfolio & Supabase RAG Platform

An interactive full-stack developer portfolio, open-source community hub (**DevOrbit** at `/devorbit`), AI Assistant Companion, and **Supabase Knowledge Base Studio** (`/admin`).

---

## Core Features

- **3D Retro Handheld Developer Console (`/`)**: Tactile hardware console interface with D-pad/keyboard navigation, CRT screen transitions, sound effects, full section dossiers (About, Projects, Articles, Contact), and 3 playable retro mini-games (Bug Shooter, Code Runner, Memory Match).
- **DevOrbit Community Hub (`/devorbit`)**: Dedicated platform for the DevOrbit open developer community (*"Discover. Build. Collaborate. Grow."*).
- **AI Assistant Companion (`/api/chat`)**: Server-side Gemini (`gemini-3.8-flash`) + deterministic RAG engine backed by the 7-category `Portfolio_Knowledge_Base`.
- **Supabase Knowledge Base Studio (`/admin`)**: Route-gated administrative studio protected by server-side `ADMIN_PASSWORD` verification (`POST /api/admin/verify`), offering 7-category inspection, live RAG testing, 1-click Supabase synchronization, SQL schema export, and Python/Node.js service snippets.
- **Automated CI/CD Supabase Sync**: Every merge to `main`/`master` automatically syncs and verifies all 7 categories (`Personal_Details`, `Work_Experience`, `Technical_Skills`, `Projects`, `Articles`, `Social_Links`, `FAQs`) in Supabase Storage and PostgreSQL.

---

## Technology Stack

- **Frontend**: React 19, TypeScript 5.8, Tailwind CSS v4, Lucide Icons, Motion, Vite 6
- **Backend**: Node.js, Express 4, `@google/genai` SDK, Structured Logger, Custom Error Hierarchy
- **Database & Storage**: Supabase (PostgreSQL + Public Storage Bucket `portfolio-knowledge-base`)
- **Security & QA**: Gitleaks, `scripts/scan-secrets.ts`, `scripts/test-suite.ts`, Constant-Time Auth (`crypto.timingSafeEqual`), HMAC-SHA256 Session Tokens

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```
Fill in `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `ADMIN_PASSWORD`, and optional `GEMINI_API_KEY` in `.env`. See [`docs/environment-configuration.md`](docs/environment-configuration.md) for full details.

### 3. Run in Development (Port 3000)
```bash
npm run dev
```

### 4. Run Tests, Secret Scan & Type Check
```bash
npm test
npm run security:scan
npm run lint
```

### 5. Production Build & Start
```bash
npm run build
npm start
```

---

## Engineering Documentation

- [Architecture Overview](docs/architecture-overview.md)
- [Codebase Audit Report](docs/codebase-audit.md)
- [Technical Debt Register](docs/technical-debt.md)
- [Refactoring Roadmap](docs/refactoring-roadmap.md)
- [REST API Documentation](docs/api-documentation.md)
- [Security Guidelines](docs/security-guidelines.md)
- [Secrets Migration Report](docs/SECURITY_SECRETS_MIGRATION.md)
- [Environment Configuration](docs/environment-configuration.md)
- [Testing Guide](docs/testing-guide.md)
- [Deployment Guide](docs/deployment-guide.md)
- [ADR 001: Supabase RAG Knowledge Base](docs/architecture-decisions/001-supabase-rag-knowledge-base.md)
- [ADR 002: Server-Side Auth & AI](docs/architecture-decisions/002-server-side-auth-and-ai.md)
