# Testing Guide

## 1. Overview

The automated test suite (`scripts/test-suite.ts`) and security verification suite (`scripts/scan-secrets.ts`) validate unit logic, REST API endpoints, authentication controls, secret redaction, and RAG retrieval performance without requiring external mocks for core application logic.

---

## 2. Running Tests

```bash
# Run all unit, integration, API, security & performance tests:
npm test

# Run repository secret scan & missing-config validation checks:
npm run security:scan

# Run TypeScript static analysis:
npm run lint
```

---

## 3. Test Coverage Breakdown

1. **Suite 1 — Knowledge Base Schema & RAG Retrieval (`scripts/test-suite.ts`)**:
   - Verifies all 7 canonical categories exist and contain valid records.
   - Verifies newest-first ordering in `Projects` (`PRJ008` Jira Fixer at index 0).
   - Verifies top-K RAG retrieval accuracy and citation formatting.
   - Verifies retired rows (`active = 'FALSE'`) are strictly excluded from RAG output.
   - Verifies `flattenKnowledgeBaseForSupabase` preserves `sort_order` and boolean `active` flags.
2. **Suite 2 — Security, Redaction, Auth & Input Validation**:
   - Verifies recursive secret redaction (`redactSensitiveMetadata`) across nested objects and token strings.
   - Verifies HMAC-SHA256 admin session token issuance, valid verification, signature tampering rejection, and TTL expiration.
   - Verifies `validateChatInput` and `validateContactInput` boundary conditions.
3. **Suite 3 — Express API Integration Tests**:
   - Spins up an ephemeral HTTP server instance via `createApp()` and tests live HTTP requests against `/api/health`, `/api/knowledge-base`, `/api/knowledge-base/Projects/csv`, `/api/knowledge-base/NonExistentTab` (`404`), `/api/admin/verify` (`401` & `200`), `/api/knowledge-base/sync-supabase` (`401`), `/api/chat` (`400` & `200`), and `/api/contact` (`400` & `200`).
4. **Suite 4 — Performance Benchmark**:
   - Executes 1,000 consecutive RAG queries against `retrieveKnowledgeForQuery` and asserts completion in `< 150ms` (actual: `~18ms`, or `0.018ms/query`).
