/**
 * Comprehensive Automated Unit, Integration, API, Security & Performance Test Suite
 * Run via: `npm test`
 *
 * Tests:
 * 1. Unit: Knowledge Base RAG retrieval, ranking, and active=FALSE retirement filtering
 * 2. Unit: Supabase record flattening & ordering preservation (PRJ008 Jira Fixer first)
 * 3. Unit: Structured Logger secret redaction (`password`, `secretKey`, `token`, `sb_secret_*`)
 * 4. Unit: Admin Auth HMAC token issuance, verification, tampering rejection, and expiry
 * 5. Unit: Input validation (`validateChatInput`, `validateContactInput`)
 * 6. Integration/API: Live Express application endpoints (`/api/health`, `/api/knowledge-base`,
 *    `/api/knowledge-base/:tab`, `/api/knowledge-base/:tab/csv`, `/api/knowledge-base/rag`,
 *    `/api/admin/verify`, `/api/knowledge-base/sync-supabase`, `/api/chat`, `/api/contact`)
 * 7. Performance Benchmark: RAG retrieval throughput (1,000 queries)
 */
import assert from 'assert';
import http from 'http';
import {
  DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
  PORTFOLIO_SHEETS_SCHEMA,
  PortfolioKnowledgeBaseData,
  retrieveKnowledgeForQuery,
} from '../src/data/knowledgeBaseSchema';
import { flattenKnowledgeBaseForSupabase } from './sync-knowledge-base-to-supabase';
import { redactSensitiveMetadata } from '../src/server/logger';
import {
  issueAdminSessionToken,
  verifyAdminSessionToken,
} from '../src/server/services/adminAuthService';
import {
  validateChatInput,
  validateContactInput,
} from '../src/server/middleware/security';
import { ValidationError } from '../src/server/errors';
import { createApp } from '../server';

let passedTests = 0;

async function runTest(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    passedTests += 1;
    console.log(`  ✓ ${name}`);
  } catch (err: unknown) {
    console.error(`  ✗ FAILED: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

async function main() {
  console.log('=== Running Portfolio Automated Test Suite ===\n');

  // ---------------------------------------------------------------------------
  // 1. Unit Tests: Knowledge Base Schema & RAG Retrieval
  // ---------------------------------------------------------------------------
  console.log('Suite 1: Knowledge Base Schema & RAG Retrieval');

  await runTest('All 7 canonical categories exist and have active rows', () => {
    assert.strictEqual(PORTFOLIO_SHEETS_SCHEMA.length, 7);
    for (const tab of PORTFOLIO_SHEETS_SCHEMA) {
      const rows = DEFAULT_PORTFOLIO_KNOWLEDGE_BASE[tab.name];
      assert.ok(Array.isArray(rows) && rows.length > 0, `Category ${tab.name} should not be empty`);
    }
  });

  await runTest('Projects category places latest project PRJ008 (Jira Fixer) at index 0', () => {
    const firstProject = DEFAULT_PORTFOLIO_KNOWLEDGE_BASE.Projects[0];
    assert.strictEqual(firstProject.id, 'PRJ008');
    assert.ok(firstProject.title.includes('Jira Fixer'));
  });

  await runTest('retrieveKnowledgeForQuery returns relevant PRJ008 and FAQ007 chunks for Jira Fixer query', () => {
    const context = retrieveKnowledgeForQuery(
      'What is Jira Fixer and how does it block edits?',
      DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
      4
    );
    assert.ok(context.includes('PRJ008') || context.includes('FAQ007'));
    assert.ok(context.includes('Jira-Ticket-Fixer'));
  });

  await runTest('retrieveKnowledgeForQuery strictly excludes retired rows (active = FALSE)', () => {
    const customKB: PortfolioKnowledgeBaseData = {
      ...DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
      Projects: [
        {
          id: 'PRJ_RETIRED',
          title: 'Retired Secret Prototype',
          content: 'UniqueTokenXYZ987654321 should never appear in RAG output.',
          url: 'https://example.com',
          active: 'FALSE',
        },
        ...DEFAULT_PORTFOLIO_KNOWLEDGE_BASE.Projects,
      ],
    };

    const result = retrieveKnowledgeForQuery('UniqueTokenXYZ987654321', customKB, 10);
    assert.strictEqual(
      result.includes('UniqueTokenXYZ987654321'),
      false,
      'Retired row with active=FALSE must be excluded from RAG retrieval'
    );
  });

  await runTest('flattenKnowledgeBaseForSupabase preserves category order and boolean active flags', () => {
    const flat = flattenKnowledgeBaseForSupabase(DEFAULT_PORTFOLIO_KNOWLEDGE_BASE);
    assert.strictEqual(flat.length, 35);
    const firstProjectRecord = flat.find((r) => r.category === 'Projects');
    assert.ok(firstProjectRecord);
    assert.strictEqual(firstProjectRecord.id, 'PRJ008');
    assert.strictEqual(firstProjectRecord.sort_order, 1);
    assert.strictEqual(firstProjectRecord.active, true);
  });

  // ---------------------------------------------------------------------------
  // 2. Unit Tests: Security, Redaction, Auth Tokens & Input Validation
  // ---------------------------------------------------------------------------
  console.log('\nSuite 2: Security, Secret Redaction, Auth & Input Validation');

  await runTest('redactSensitiveMetadata masks sensitive keys and token values', () => {
    const syntheticSupabaseKey = ['sb', 'secret', '1234567890abcdef'].join('_');
    const syntheticAiKey = ['sk', '123456789012345678901234'].join('-');
    const raw = {
      user: 'suraj',
      password: 'my-secret-password',
      supabaseSecretKey: syntheticSupabaseKey,
      nested: {
        authorization: 'Bearer token123',
        note: `Key is ${syntheticAiKey} in text`,
      },
    };
    const sanitized = redactSensitiveMetadata(raw) as Record<string, unknown>;
    assert.strictEqual(sanitized.user, 'suraj');
    assert.strictEqual(sanitized.password, '[REDACTED]');
    assert.strictEqual(sanitized.supabaseSecretKey, '[REDACTED]');
    const nested = sanitized.nested as Record<string, unknown>;
    assert.strictEqual(nested.authorization, '[REDACTED]');
    assert.ok(String(nested.note).includes('[REDACTED]'));
  });

  await runTest('Admin HMAC session tokens verify when valid and reject tampering or expiration', () => {
    const validToken = issueAdminSessionToken(60_000);
    assert.strictEqual(verifyAdminSessionToken(validToken), true);

    const tamperedToken = `${validToken.slice(0, -4)}abcd`;
    assert.strictEqual(verifyAdminSessionToken(tamperedToken), false);

    const expiredToken = issueAdminSessionToken(-1000);
    assert.strictEqual(verifyAdminSessionToken(expiredToken), false);
    assert.strictEqual(verifyAdminSessionToken(''), false);
    assert.strictEqual(verifyAdminSessionToken(undefined), false);
  });

  await runTest('validateChatInput accepts valid messages and rejects empty or oversized payloads', () => {
    const valid = validateChatInput({ message: '  What is EVEE?  ' });
    assert.strictEqual(valid.message, 'What is EVEE?');

    assert.throws(() => validateChatInput({ message: '   ' }), ValidationError);
    assert.throws(
      () => validateChatInput({ message: 'a'.repeat(2005) }),
      ValidationError
    );
  });

  await runTest('validateContactInput validates email format and required fields', () => {
    const valid = validateContactInput({
      name: 'Ada Lovelace',
      email: 'ada@analytical.engine',
      message: 'Hello Suraj!',
    });
    assert.strictEqual(valid.email, 'ada@analytical.engine');

    assert.throws(
      () =>
        validateContactInput({
          name: 'Ada',
          email: 'invalid-email',
          message: 'Hi',
        }),
      ValidationError
    );
  });

  // ---------------------------------------------------------------------------
  // 3. Integration & API Endpoint Tests
  // ---------------------------------------------------------------------------
  console.log('\nSuite 3: Express API Integration Tests');

  const testApp = createApp();
  const server = http.createServer(testApp);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    await runTest('GET /api/health returns 200 OK with security headers and X-Request-Id', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      assert.strictEqual(res.status, 200);
      assert.ok(res.headers.get('x-request-id'));
      assert.strictEqual(res.headers.get('x-content-type-options'), 'nosniff');
      const body = await res.json();
      assert.strictEqual(body.status, 'ok');
      assert.strictEqual('secretKey' in body, false);
    });

    await runTest('GET /api/knowledge-base returns all 7 categories and 35 records', async () => {
      const res = await fetch(`${baseUrl}/api/knowledge-base`);
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.tabs.length, 7);
      assert.strictEqual(body.data.Projects[0].id, 'PRJ008');
    });

    await runTest('GET /api/knowledge-base/Projects/csv exports RFC-4180 CSV with headers', async () => {
      const res = await fetch(`${baseUrl}/api/knowledge-base/Projects/csv`);
      assert.strictEqual(res.status, 200);
      const csv = await res.text();
      const lines = csv.trim().split('\n');
      assert.strictEqual(lines[0], '"id","title","content","url","active"');
      assert.ok(lines[1].startsWith('"PRJ008"'));
    });

    await runTest('GET /api/knowledge-base/NonExistentTab returns standardized 404 NotFoundError', async () => {
      const res = await fetch(`${baseUrl}/api/knowledge-base/NonExistentTab`);
      assert.strictEqual(res.status, 404);
      const body = await res.json();
      assert.strictEqual(body.category, 'NOT_FOUND_ERROR');
    });

    await runTest('POST /api/admin/verify rejects invalid password (401) and accepts valid ADMIN_PASSWORD (200)', async () => {
      const originalAdminPwd = process.env.ADMIN_PASSWORD;
      process.env.ADMIN_PASSWORD = 'test-suite-admin-secret';
      try {
        const badRes = await fetch(`${baseUrl}/api/admin/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: 'wrong-password' }),
        });
        assert.strictEqual(badRes.status, 401);

        const okRes = await fetch(`${baseUrl}/api/admin/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: 'test-suite-admin-secret' }),
        });
        assert.strictEqual(okRes.status, 200);
        const okBody = await okRes.json();
        assert.strictEqual(okBody.authenticated, true);
        assert.ok(typeof okBody.token === 'string' && okBody.token.length > 20);
      } finally {
        if (originalAdminPwd !== undefined) {
          process.env.ADMIN_PASSWORD = originalAdminPwd;
        }
      }
    });

    await runTest('POST /api/knowledge-base/sync-supabase rejects unauthenticated requests (401)', async () => {
      const res = await fetch(`${baseUrl}/api/knowledge-base/sync-supabase`, {
        method: 'POST',
      });
      assert.strictEqual(res.status, 401);
      const body = await res.json();
      assert.strictEqual(body.category, 'AUTHENTICATION_ERROR');
    });

    await runTest('POST /api/chat validates input and returns accurate response', async () => {
      const invalidRes = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '' }),
      });
      assert.strictEqual(invalidRes.status, 400);

      const validRes = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'What is Jira Fixer?' }),
      });
      assert.strictEqual(validRes.status, 200);
      const body = await validRes.json();
      assert.ok(typeof body.reply === 'string' && body.reply.includes('Jira Fixer'));
    });

    await runTest('POST /api/contact validates email and returns transmission ID', async () => {
      const invalidRes = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test', email: 'not-an-email', message: 'Hi' }),
      });
      assert.strictEqual(invalidRes.status, 400);

      const validRes = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Grace Hopper',
          email: 'grace@navy.mil',
          message: 'Great portfolio architecture!',
        }),
      });
      assert.strictEqual(validRes.status, 200);
      const body = await validRes.json();
      assert.strictEqual(body.success, true);
      assert.ok(String(body.transmissionId).startsWith('TX-'));
    });
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }

  // ---------------------------------------------------------------------------
  // 4. Performance Benchmark: Pre-Indexed RAG Retrieval Throughput
  // ---------------------------------------------------------------------------
  console.log('\nSuite 4: Performance Benchmark');

  await runTest('1,000 RAG retrieval queries complete in under 150ms using WeakMap index cache', () => {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      retrieveKnowledgeForQuery(
        'What is Jira Fixer, EVEE, and VAssureAI architecture?',
        DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
        6
      );
    }
    const elapsedMs = performance.now() - start;
    console.log(`    [Benchmark] 1,000 RAG queries completed in ${elapsedMs.toFixed(2)}ms (${(elapsedMs / 1000).toFixed(4)}ms/query)`);
    assert.ok(elapsedMs < 150, `Expected <150ms for 1,000 queries, took ${elapsedMs.toFixed(2)}ms`);
  });

  console.log(`\n=== All ${passedTests} Automated Tests Passed Successfully! ===`);
}

main();
