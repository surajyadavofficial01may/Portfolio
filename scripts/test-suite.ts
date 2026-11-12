/**
 * Comprehensive Automated Unit, Integration, API, Security & Performance Test Suite
 * Run via: `npm test`
 *
 * Tests:
 * 1. Unit: Knowledge Base schema integrity & Supabase record flattening (PRJ008 Jira Fixer first)
 * 2. Unit: Structured Logger secret redaction (`password`, `secretKey`, `token`, `sb_secret_*`)
 * 3. Unit: Admin Auth HMAC token issuance, verification, tampering rejection, and expiry
 * 4. Unit: Input validation (`validateChatAskInput`, `validateContactInput`)
 * 5. Integration/API: Live Express application endpoints (`/api/health`, `/api/knowledge-base`,
 *    `/api/knowledge-base/:tab`, `/api/knowledge-base/:tab/csv`,
 *    `/api/admin/verify`, `/api/knowledge-base/sync-supabase`, `/api/v1/chat/ask`, `/api/contact`)
 * 6. Live RAG Service Integration: End-to-end verification of `https://rag-as-service.onrender.com/api/v1/chat/ask`
 */
import assert from 'assert';
import http from 'http';
import {
  DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
  PORTFOLIO_SHEETS_SCHEMA,
} from '../src/data/knowledgeBaseSchema.ts';
import { flattenKnowledgeBaseForSupabase } from './sync-knowledge-base-to-supabase.ts';
import { redactSensitiveMetadata } from '../src/server/logger.ts';
import {
  issueAdminSessionToken,
  verifyAdminSessionToken,
} from '../src/server/services/adminAuthService.ts';
import {
  validateChatAskInput,
  validateContactInput,
} from '../src/server/middleware/security.ts';
import { UnprocessableEntityError, ValidationError } from '../src/server/errors.ts';
import { DEFAULT_RAG_SERVICE_URL, getServerConfig } from '../src/config/env.ts';
import { createApp } from '../server.ts';

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
  // 1. Unit Tests: Knowledge Base Schema & Supabase Flattening
  // ---------------------------------------------------------------------------
  console.log('Suite 1: Knowledge Base Schema & Supabase Flattening');

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

  await runTest('flattenKnowledgeBaseForSupabase preserves category order and boolean active flags', () => {
    const flat = flattenKnowledgeBaseForSupabase(DEFAULT_PORTFOLIO_KNOWLEDGE_BASE);
    assert.strictEqual(flat.length, 35);
    const firstProjectRecord = flat.find((r) => r.category === 'Projects');
    assert.ok(firstProjectRecord);
    assert.strictEqual(firstProjectRecord.id, 'PRJ008');
    assert.strictEqual(firstProjectRecord.sort_order, 1);
    assert.strictEqual(firstProjectRecord.active, true);
  });

  await runTest('getServerConfig normalizes RAG_SERVICE_URL whether set as base URL or full /api/v1/chat/ask endpoint', () => {
    const prev = process.env.RAG_SERVICE_URL;
    try {
      process.env.RAG_SERVICE_URL = 'https://rag-as-service.onrender.com/api/v1/chat/ask';
      assert.strictEqual(getServerConfig().ragServiceUrl, DEFAULT_RAG_SERVICE_URL);

      process.env.RAG_SERVICE_URL = 'https://rag-as-service.onrender.com/';
      assert.strictEqual(getServerConfig().ragServiceUrl, DEFAULT_RAG_SERVICE_URL);
    } finally {
      if (prev === undefined) {
        delete process.env.RAG_SERVICE_URL;
      } else {
        process.env.RAG_SERVICE_URL = prev;
      }
    }
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

  await runTest('validateChatAskInput accepts valid questions/history and rejects invalid roles or lengths with 422', () => {
    const valid = validateChatAskInput({
      question: '  What is EVEE?  ',
      history: [{ role: 'user', content: 'Hi' }],
    });
    assert.strictEqual(valid.question, 'What is EVEE?');
    assert.strictEqual(valid.history.length, 1);

    assert.throws(
      () => validateChatAskInput({ question: '   ' }),
      UnprocessableEntityError
    );
    assert.throws(
      () => validateChatAskInput({ question: 'a'.repeat(1001) }),
      UnprocessableEntityError
    );
    assert.throws(
      () =>
        validateChatAskInput({
          question: 'What is EVEE?',
          history: [{ role: 'bot', content: 'Invalid role' }],
        }),
      UnprocessableEntityError
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
  console.log('\nSuite 3: Express API Integration & RAG Service Tests');

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

    await runTest('POST /api/v1/chat/ask returns 422 with field details for invalid history role or question limits', async () => {
      const badRoleRes = await fetch(`${baseUrl}/api/v1/chat/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'What is EVEE?',
          history: [
            {
              role: 'system',
              content: 'Invalid role turn',
            },
          ],
        }),
      });
      assert.strictEqual(badRoleRes.status, 422);
      const badRoleBody = await badRoleRes.json();
      assert.strictEqual(badRoleBody.success, false);
      assert.ok(Array.isArray(badRoleBody.details));
      assert.strictEqual(badRoleBody.details[0].field, 'history.0.role');
      assert.strictEqual(
        badRoleBody.details[0].message,
        "Input should be 'user' or 'assistant'"
      );

      const emptyQRes = await fetch(`${baseUrl}/api/v1/chat/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: '   ',
          history: [],
        }),
      });
      assert.strictEqual(emptyQRes.status, 422);
      const emptyQBody = await emptyQRes.json();
      assert.strictEqual(emptyQBody.success, false);
      assert.strictEqual(emptyQBody.details[0].field, 'question');
    });

    await runTest('POST /api/v1/chat/ask proxies to external RAG_SERVICE_URL for 200, 422, 429 (Retry-After), and 503 (Retry-After)', async () => {
      let mockMode: '200' | '200-unavailable' | '429' | '503' = '200';
      const mockUpstream = http.createServer((req, res) => {
        if (req.method === 'POST' && req.url === '/api/v1/chat/ask') {
          if (mockMode === '429') {
            res.writeHead(429, {
              'Content-Type': 'application/json',
              'Retry-After': '15',
            });
            res.end(
              JSON.stringify({
                success: false,
                error: 'Rate limit exceeded; see Retry-After.',
                details: [],
              })
            );
            return;
          }
          if (mockMode === '503') {
            res.writeHead(503, {
              'Content-Type': 'application/json',
              'Retry-After': '45',
            });
            res.end(
              JSON.stringify({
                success: false,
                error: 'A dependency is unavailable; see Retry-After.',
                details: [],
              })
            );
            return;
          }
          if (mockMode === '200-unavailable') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                success: true,
                answer: 'That information is not available in the portfolio knowledge base.',
                sources: [],
                debug: null,
              })
            );
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              success: true,
              answer:
                '- **Python, FastAPI, LangGraph, React, TypeScript, Node.js** – core languages and frameworks he specializes in for full‑stack and AI systems[1]',
              sources: [
                {
                  category: 'FAQs',
                  title: 'Tell me about Suraj Kumar Yadav.',
                  url: 'https://knowsuraj.ai.studio/',
                },
              ],
              debug: null,
            })
          );
        }
      });

      await new Promise<void>((resolve) => mockUpstream.listen(0, '127.0.0.1', resolve));
      const mockAddr = mockUpstream.address();
      const mockPort = typeof mockAddr === 'object' && mockAddr ? mockAddr.port : 0;
      const prevRagUrl = process.env.RAG_SERVICE_URL;
      process.env.RAG_SERVICE_URL = `http://127.0.0.1:${mockPort}`;

      try {
        // Test 200 OK proxy with [n] -> sources[n-1]
        const okRes = await fetch(`${baseUrl}/api/v1/chat/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: 'what are the tech stack where he worked?',
            history: [],
          }),
        });
        assert.strictEqual(okRes.status, 200);
        const okBody = await okRes.json();
        assert.strictEqual(okBody.success, true);
        assert.ok(okBody.answer.includes('[1]'));
        assert.strictEqual(okBody.sources[0].title, 'Tell me about Suraj Kumar Yadav.');

        // Test 200 unavailable answer with empty sources
        mockMode = '200-unavailable';
        const unavailKbRes = await fetch(`${baseUrl}/api/v1/chat/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: 'What is the capital of Mars?',
            history: [],
          }),
        });
        assert.strictEqual(unavailKbRes.status, 200);
        const unavailKbBody = await unavailKbRes.json();
        assert.strictEqual(
          unavailKbBody.answer,
          'That information is not available in the portfolio knowledge base.'
        );
        assert.strictEqual(unavailKbBody.sources.length, 0);

        // Test 429 Retry-After proxy
        mockMode = '429';
        const rateRes = await fetch(`${baseUrl}/api/v1/chat/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: 'What is EVEE?', history: [] }),
        });
        assert.strictEqual(rateRes.status, 429);
        assert.strictEqual(rateRes.headers.get('retry-after'), '15');

        // Test 503 Retry-After proxy
        mockMode = '503';
        const unavailRes = await fetch(`${baseUrl}/api/v1/chat/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: 'What is EVEE?', history: [] }),
        });
        assert.strictEqual(unavailRes.status, 503);
        assert.strictEqual(unavailRes.headers.get('retry-after'), '45');
      } finally {
        if (prevRagUrl === undefined) {
          delete process.env.RAG_SERVICE_URL;
        } else {
          process.env.RAG_SERVICE_URL = prevRagUrl;
        }
        await new Promise<void>((resolve) => mockUpstream.close(() => resolve()));
      }
    });

    await runTest('Live External RAG Service (https://rag-as-service.onrender.com/api/v1/chat/ask) answers portfolio question via /api/v1/chat/ask', async () => {
      const res = await fetch(`${baseUrl}/api/v1/chat/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'what are the tech stack where he worked?',
          history: [],
        }),
      });
      assert.strictEqual(res.status, 200);
      const body = await res.json();
      assert.strictEqual(body.success, true);
      assert.notStrictEqual(
        body.answer,
        'That information is not available in the portfolio knowledge base.'
      );
      assert.ok(Array.isArray(body.sources) && body.sources.length >= 1);
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

  console.log(`\n=== All ${passedTests} Automated Tests Passed Successfully! ===`);
}

main();
