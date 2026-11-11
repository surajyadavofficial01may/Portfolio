# ADR 002: Server-Side Admin Authentication Gate & Server-Side AI Execution

## Status
Accepted

## Context
The `/admin` route provides inspection of the 7-category knowledge base and a 1-click "Sync to Supabase" trigger. Furthermore, the AI Assistant companion queries Google Gemini (`@google/genai`). Neither the administrator password, the Supabase secret key (`SUPABASE_SECRET_KEY`), nor the Gemini API key (`GEMINI_API_KEY`) may ever be exposed in the frontend bundle.

## Decision
1. **Route-Level Unmounted Gate (`src/App.tsx`)**: Visiting `/admin` renders only a password prompt while `<KnowledgeBaseStudioModal />` remains unmounted until the password is verified by `POST /api/admin/verify`.
2. **Constant-Time Verification & HMAC Session Tokens (`src/server/services/adminAuthService.ts`)**: The backend compares the submitted password against `process.env.ADMIN_PASSWORD` using `crypto.timingSafeEqual` and issues a 2-hour HMAC-SHA256 Bearer token required by `POST /api/knowledge-base/sync-supabase`.
3. **Server-Side AI & Deterministic Fallback (`src/server/services/chatService.ts`)**: All `@google/genai` calls execute on the server (`POST /api/chat`), with a deterministic RAG fallback responder ensuring 100% availability even if `GEMINI_API_KEY` is unset or rate-limited.

## Consequences
- Zero private credentials exist in the client bundle.
- `/admin` write operations are cryptographically authenticated on the backend.
