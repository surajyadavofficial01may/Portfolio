/**
 * Portfolio External RAG Service Client (`/api/v1/chat/ask`)
 *
 * Exclusively connects the portfolio chatbot to the external RAG service
 * (`https://rag-as-service.onrender.com/api/v1/chat/ask` or `RAG_SERVICE_URL`).
 *
 * Contract:
 * - POST `${ragServiceUrl}/api/v1/chat/ask`
 * - Request body: `{ question: string (1-1000 chars), history: Array<{ role: "user" | "assistant", content: string (1-2000 chars) }> }`
 * - 200 OK: `{ success: true, answer: string, sources: [{ category, title, url }], debug: Record<string, unknown> | null }`
 * - 422 Unprocessable Entity: `{ success: false, error: string, details: [{ field, message }] }`
 * - 429 Too Many Requests: `{ success: false, error: string, details: [] }` + `Retry-After` header
 * - 503 Service Unavailable: `{ success: false, error: string, details: [] }` + `Retry-After` header
 *
 * Reliability notes:
 * - The RAG service is hosted on Render. On the free tier it sleeps after ~15 min of
 *   inactivity and a cold start can take 30-60 s, so a short timeout makes the first
 *   request after idle always fail. This client therefore uses a longer time budget and
 *   retries transient failures (network errors, timeouts, 502/503/504).
 * - Input is normalised to the upstream limits so the service never answers 422 for
 *   something we could have trimmed ourselves.
 */
import { getServerConfig } from '../../config/env.ts';
import {
  RateLimitError,
  ServiceUnavailableError,
  UnprocessableEntityError,
  type FieldValidationDetail,
} from '../errors.ts';
import type { ValidatedHistoryTurn } from '../middleware/security.ts';
import { createLogger } from '../logger.ts';

const logger = createLogger('ChatService');

export const UNAVAILABLE_KB_ANSWER =
  'That information is not available in the portfolio knowledge base.';

/* ------------------------------------------------------------------ */
/* Tunables                                                            */
/* ------------------------------------------------------------------ */

const MAX_QUESTION_CHARS = 1000;
const MAX_HISTORY_CONTENT_CHARS = 2000;
const MAX_HISTORY_TURNS = 10;

const MAX_ATTEMPTS = 3;
/** Single attempt limit; long enough to ride out a Render cold start. */
const ATTEMPT_TIMEOUT_MS = 45_000;
/** Hard ceiling for the whole call including retries. */
const TOTAL_BUDGET_MS = 75_000;
/** Never wait longer than this between retries. */
const MAX_RETRY_DELAY_MS = 5_000;

const DEFAULT_RETRY_AFTER_SECONDS = 30;
const MAX_RETRY_AFTER_SECONDS = 120;

const RETRYABLE_STATUS = new Set([502, 503, 504]);
const LOCAL_IPS = new Set(['local', '::1', '127.0.0.1', '::ffff:127.0.0.1']);

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface RagSourceCitation {
  category: string;
  title: string;
  url: string;
}

export interface ChatAskResponse {
  success: true;
  answer: string;
  sources: RagSourceCitation[];
  debug?: Record<string, unknown> | null;
}

interface UpstreamHistoryTurn {
  role: 'user' | 'assistant';
  content: string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function resolveRagAskEndpoint(ragServiceUrl: string): string {
  let trimmed = ragServiceUrl.trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  if (/\/api\/v1\/chat\/ask$/i.test(trimmed)) {
    return trimmed;
  }
  const base = trimmed
    .replace(/\/api\/v1\/chat$/i, '')
    .replace(/\/api\/v1$/i, '')
    .replace(/\/+$/, '');
  return `${base}/api/v1/chat/ask`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Supports both `Retry-After: 30` and `Retry-After: <HTTP date>`. */
function parseRetryAfterSeconds(header: string | null): number {
  if (!header) return DEFAULT_RETRY_AFTER_SECONDS;
  const asNumber = Number(header);
  if (Number.isFinite(asNumber)) {
    return clamp(Math.ceil(asNumber), 1, MAX_RETRY_AFTER_SECONDS);
  }
  const asDate = Date.parse(header);
  if (!Number.isNaN(asDate)) {
    return clamp(Math.ceil((asDate - Date.now()) / 1000), 1, MAX_RETRY_AFTER_SECONDS);
  }
  return DEFAULT_RETRY_AFTER_SECONDS;
}

function extractDetails(payload: Record<string, unknown>): FieldValidationDetail[] {
  if (!Array.isArray(payload.details)) return [];
  return (payload.details as unknown[]).filter(
    (d): d is FieldValidationDetail =>
      !!d &&
      typeof d === 'object' &&
      typeof (d as Record<string, unknown>).field === 'string' &&
      typeof (d as Record<string, unknown>).message === 'string'
  );
}

function normalizeHistory(history: ValidatedHistoryTurn[] | undefined): UpstreamHistoryTurn[] {
  const result: UpstreamHistoryTurn[] = [];
  for (const turn of history ?? []) {
    if (!turn || (turn.role !== 'user' && turn.role !== 'assistant')) continue;
    if (typeof turn.content !== 'string') continue;
    const content = turn.content.trim().slice(0, MAX_HISTORY_CONTENT_CHARS);
    if (!content) continue;
    result.push({ role: turn.role, content });
  }
  return result.slice(-MAX_HISTORY_TURNS);
}

/**
 * Keeps the upstream order and count exactly as received: the answer text cites sources
 * as `[n]` which the client maps to `sources[n - 1]`, so dropping or de-duplicating
 * entries here would silently shift every citation number.
 */
function normalizeSources(raw: unknown): RagSourceCitation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s: unknown): RagSourceCitation => {
    const item = (s && typeof s === 'object' ? s : {}) as Record<string, unknown>;
    return {
      category: typeof item.category === 'string' ? item.category : '',
      title: typeof item.title === 'string' ? item.title : '',
      url: typeof item.url === 'string' ? item.url : '',
    };
  });
}

/**
 * POSTs to the RAG service, retrying transient failures.
 * Returns the final Response (even if it is a retryable status on the last attempt,
 * so the caller can read its error body / Retry-After). Throws only when no HTTP
 * response could be obtained at all.
 */
async function postWithRetry(
  targetUrl: string,
  headers: Record<string, string>,
  body: string
): Promise<Response> {
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const remaining = deadline - Date.now();
    if (remaining < 1_000) break;

    const isLastAttempt = attempt === MAX_ATTEMPTS;

    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body,
        signal: AbortSignal.timeout(Math.min(ATTEMPT_TIMEOUT_MS, remaining)),
      });

      if (RETRYABLE_STATUS.has(res.status) && !isLastAttempt) {
        const hinted = res.headers.get('retry-after');
        await res.body?.cancel().catch(() => undefined);
        const delay = hinted
          ? Math.min(parseRetryAfterSeconds(hinted) * 1000, MAX_RETRY_DELAY_MS)
          : Math.min(1_500 * attempt, MAX_RETRY_DELAY_MS);
        logger.warn('RAG service returned a transient error; retrying', {
          targetUrl,
          status: res.status,
          attempt,
          delayMs: delay,
        });
        await sleep(Math.min(delay, Math.max(0, deadline - Date.now())));
        continue;
      }

      return res;
    } catch (err: unknown) {
      lastError = err;
      logger.warn('RAG service request failed', {
        targetUrl,
        attempt,
        error: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
      });
      if (!isLastAttempt) {
        await sleep(Math.min(1_500 * attempt, MAX_RETRY_DELAY_MS, Math.max(0, deadline - Date.now())));
      }
    }
  }

  logger.error('External RAG service unreachable after retries', {
    targetUrl,
    error: lastError instanceof Error ? lastError.message : String(lastError),
  });
  throw new ServiceUnavailableError(
    'A dependency is unavailable; see Retry-After.',
    DEFAULT_RETRY_AFTER_SECONDS
  );
}

/* ------------------------------------------------------------------ */
/* Main handler                                                        */
/* ------------------------------------------------------------------ */

/**
 * Main handler for `POST /api/v1/chat/ask`
 * Forwards validated `{ question, history }` to `${config.ragServiceUrl}/api/v1/chat/ask`.
 */
export async function askPortfolioKnowledgeBase(params: {
  question: string;
  history: ValidatedHistoryTurn[];
  clientIp?: string;
}): Promise<ChatAskResponse> {
  const { clientIp } = params;
  const question = (params.question ?? '').trim().slice(0, MAX_QUESTION_CHARS);
  const history = normalizeHistory(params.history);

  if (!question) {
    throw new UnprocessableEntityError('Invalid request body', [
      { field: 'question', message: 'question must be between 1 and 1000 characters' },
    ]);
  }

  const config = getServerConfig();
  const targetUrl = resolveRagAskEndpoint(config.ragServiceUrl);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (clientIp && !LOCAL_IPS.has(clientIp)) {
    headers['X-Forwarded-For'] = clientIp;
  }

  const upstreamRes = await postWithRetry(
    targetUrl,
    headers,
    JSON.stringify({ question, history })
  );

  const retryAfterSeconds = parseRetryAfterSeconds(upstreamRes.headers.get('retry-after'));

  // Read the body as text first so a non-JSON reply (e.g. Render's HTML "waking up" page)
  // can be logged instead of silently becoming `{}`.
  let rawBody = '';
  try {
    rawBody = await upstreamRes.text();
  } catch (err: unknown) {
    logger.warn('Failed to read RAG service response body', {
      targetUrl,
      status: upstreamRes.status,
      error: err instanceof Error ? err.message : String(err),
    });
    throw new ServiceUnavailableError(
      'A dependency is unavailable; see Retry-After.',
      retryAfterSeconds
    );
  }

  let payload: Record<string, unknown> = {};
  try {
    const parsed: unknown = JSON.parse(rawBody);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      payload = parsed as Record<string, unknown>;
    }
  } catch {
    logger.warn('RAG service returned a non-JSON body', {
      targetUrl,
      status: upstreamRes.status,
      bodyPreview: rawBody.slice(0, 200),
    });
  }

  const upstreamError =
    typeof payload.error === 'string' && payload.error.trim() ? payload.error : undefined;

  // 400 / 422 -> request was rejected as invalid
  if (upstreamRes.status === 422 || upstreamRes.status === 400) {
    throw new UnprocessableEntityError(
      upstreamError ?? 'Invalid request body',
      extractDetails(payload)
    );
  }

  // 429 -> upstream rate limit
  if (upstreamRes.status === 429) {
    throw new RateLimitError(
      upstreamError ?? 'Rate limit exceeded; see Retry-After.',
      retryAfterSeconds,
      extractDetails(payload)
    );
  }

  // 5xx, any other non-2xx, or a 2xx that explicitly says it failed
  if (!upstreamRes.ok || payload.success === false) {
    if ([401, 403, 404, 405].includes(upstreamRes.status)) {
      logger.error('RAG service rejected the request; check RAG_SERVICE_URL / endpoint path', {
        targetUrl,
        status: upstreamRes.status,
      });
    } else {
      logger.warn('RAG service returned an error response', {
        targetUrl,
        status: upstreamRes.status,
        error: upstreamError,
      });
    }
    throw new ServiceUnavailableError(
      upstreamError ?? 'A dependency is unavailable; see Retry-After.',
      retryAfterSeconds,
      extractDetails(payload)
    );
  }

  const answer =
    typeof payload.answer === 'string' && payload.answer.trim()
      ? payload.answer.trim()
      : UNAVAILABLE_KB_ANSWER;

  return {
    success: true,
    answer,
    sources: normalizeSources(payload.sources),
    debug:
      payload.debug && typeof payload.debug === 'object' && !Array.isArray(payload.debug)
        ? (payload.debug as Record<string, unknown>)
        : null,
  };
}

/* ------------------------------------------------------------------ */
/* Optional: cold-start mitigation for Render free tier                */
/* ------------------------------------------------------------------ */

function ragServiceOrigin(): string {
  return new URL(resolveRagAskEndpoint(getServerConfig().ragServiceUrl)).origin;
}

/** One cheap GET to wake the service (its root returns `{"status":"ok"}`). */
export async function warmUpRagService(): Promise<void> {
  const origin = ragServiceOrigin();
  try {
    const res = await fetch(origin, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(60_000),
    });
    await res.body?.cancel().catch(() => undefined);
    logger.info('RAG service warm-up complete', { origin, status: res.status });
  } catch (err: unknown) {
    logger.warn('RAG service warm-up failed', {
      origin,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

/**
 * Call once at server start. Warms the service immediately, then pings it every
 * 10 minutes so it never reaches Render's 15-minute idle sleep.
 * Returns a function that stops the timer.
 */
export function startRagKeepAlive(intervalMs = 10 * 60 * 1000): () => void {
  void warmUpRagService();
  const timer = setInterval(() => void warmUpRagService(), intervalMs);
  timer.unref?.();
  return () => clearInterval(timer);
}