/**
 * Portfolio External RAG Service Client (`/api/v1/chat/ask`)
 *
 * Exclusively connects the portfolio chatbot to the external RAG service
 * (`https://rag-as-service.onrender.com/api/v1/chat/ask` or `RAG_SERVICE_URL`).
 * All in-house RAG engine logic has been removed per architectural specification.
 *
 * Contract:
 * - POST `${ragServiceUrl}/api/v1/chat/ask`
 * - Request body: `{ question: string (1-1000 chars), history: Array<{ role: "user" | "assistant", content: string (1-2000 chars) }> }`
 * - 200 OK: `{ success: true, answer: string, sources: [{ category, title, url }], debug: Record<string, unknown> | null }`
 * - 422 Unprocessable Entity: `{ success: false, error: string, details: [{ field, message }] }`
 * - 429 Too Many Requests: `{ success: false, error: string, details: [] }` + `Retry-After` header
 * - 503 Service Unavailable: `{ success: false, error: string, details: [] }` + `Retry-After` header
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

export function resolveRagAskEndpoint(ragServiceUrl: string): string {
  const trimmed = ragServiceUrl.trim().replace(/\/+$/, '');
  if (/\/api\/v1\/chat\/ask$/i.test(trimmed)) {
    return trimmed;
  }
  const base = trimmed
    .replace(/\/api\/v1\/chat$/i, '')
    .replace(/\/api\/v1$/i, '')
    .replace(/\/+$/, '');
  return `${base}/api/v1/chat/ask`;
}

/**
 * Main handler for `POST /api/v1/chat/ask`
 * Forwards validated `{ question, history }` to `${config.ragServiceUrl}/api/v1/chat/ask`.
 */
export async function askPortfolioKnowledgeBase(params: {
  question: string;
  history: ValidatedHistoryTurn[];
  clientIp?: string;
}): Promise<ChatAskResponse> {
  const { question, history, clientIp } = params;
  const config = getServerConfig();
  const targetUrl = resolveRagAskEndpoint(config.ragServiceUrl);

  let upstreamRes: Response;
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (clientIp && clientIp !== 'local' && clientIp !== '::1' && clientIp !== '127.0.0.1') {
      headers['X-Forwarded-For'] = clientIp;
    }

    upstreamRes = await fetch(targetUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ question, history }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err: unknown) {
    logger.warn('External RAG service unreachable; throwing 503 ServiceUnavailableError', {
      targetUrl,
      error: err instanceof Error ? err.message : String(err),
    });
    throw new ServiceUnavailableError(
      'A dependency is unavailable; see Retry-After.',
      30
    );
  }

  const retryAfterHeader = upstreamRes.headers.get('retry-after');
  const retryAfterSeconds = retryAfterHeader
    ? Math.max(1, Number.parseInt(retryAfterHeader, 10) || 30)
    : 30;

  let payload: Record<string, unknown> = {};
  try {
    payload = (await upstreamRes.json()) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  if (upstreamRes.status === 422) {
    const details = Array.isArray(payload.details)
      ? (payload.details as FieldValidationDetail[])
      : [];
    throw new UnprocessableEntityError(
      typeof payload.error === 'string' ? payload.error : 'Invalid request body',
      details
    );
  }

  if (upstreamRes.status === 429) {
    const details = Array.isArray(payload.details)
      ? (payload.details as FieldValidationDetail[])
      : [];
    throw new RateLimitError(
      typeof payload.error === 'string'
        ? payload.error
        : 'Rate limit exceeded; see Retry-After.',
      retryAfterSeconds,
      details
    );
  }

  if (upstreamRes.status === 503 || upstreamRes.status >= 500 || !upstreamRes.ok) {
    const details = Array.isArray(payload.details)
      ? (payload.details as FieldValidationDetail[])
      : [];
    throw new ServiceUnavailableError(
      typeof payload.error === 'string'
        ? payload.error
        : 'A dependency is unavailable; see Retry-After.',
      retryAfterSeconds,
      details
    );
  }

  const rawSources = Array.isArray(payload.sources) ? payload.sources : [];
  const sources: RagSourceCitation[] = rawSources.map((s: unknown) => {
    const item = (s && typeof s === 'object' ? s : {}) as Record<string, unknown>;
    return {
      category: typeof item.category === 'string' ? item.category : '',
      title: typeof item.title === 'string' ? item.title : '',
      url: typeof item.url === 'string' ? item.url : '',
    };
  });

  return {
    success: true,
    answer:
      typeof payload.answer === 'string' && payload.answer.trim()
        ? payload.answer
        : UNAVAILABLE_KB_ANSWER,
    sources,
    debug:
      payload.debug && typeof payload.debug === 'object'
        ? (payload.debug as Record<string, unknown>)
        : null,
  };
}
