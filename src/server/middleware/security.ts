/**
 * Security, Request Tracing, Rate Limiting & Input Validation Middleware
 */
import crypto from 'crypto';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import {
  RateLimitError,
  ValidationError,
  UnprocessableEntityError,
  type FieldValidationDetail,
} from '../errors.ts';
import { createLogger } from '../logger.ts';

const httpLogger = createLogger('HTTP');

/**
 * Attaches a unique `x-request-id` header, sets defensive HTTP security headers,
 * and logs structured request completion metrics.
 */
export function securityAndTracingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();
  const existingId = req.headers['x-request-id'];
  const requestId =
    typeof existingId === 'string' && existingId.trim()
      ? existingId.trim()
      : crypto.randomUUID();

  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-Id', requestId);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  res.on('finish', () => {
    if (req.path.startsWith('/api/')) {
      const durationMs = Date.now() - startTime;
      httpLogger.info(`${req.method} ${req.path}`, {
        requestId,
        statusCode: res.statusCode,
        durationMs,
      });
    }
  });

  next();
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

/**
 * Creates a lightweight sliding-window in-memory rate limiter for API routes.
 */
export function createRateLimiter(options: {
  windowMs: number;
  maxRequests: number;
  message?: string;
}): RequestHandler {
  const buckets = new Map<string, RateLimitBucket>();

  return (req: Request, _res: Response, next: NextFunction): void => {
    const now = Date.now();
    const clientIp =
      (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'local';
    const key = `${clientIp}:${req.path}`;

    const entry = buckets.get(key);
    if (!entry || now >= entry.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs });
      next();
      return;
    }

    if (entry.count >= options.maxRequests) {
      const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      next(
        new RateLimitError(
          options.message || 'Rate limit exceeded; see Retry-After.',
          retryAfterSeconds
        )
      );
      return;
    }

    entry.count += 1;
    next();
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidatedHistoryTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ValidatedChatAskInput {
  question: string;
  history: ValidatedHistoryTurn[];
}

/**
 * Validates POST /api/v1/chat/ask request payloads according to the RAG Service OpenAPI schema:
 * - question: 1–1000 characters
 * - history: optional array of up to 20 turns (oldest first)
 *   - history[i].role: strictly "user" or "assistant" (any other role rejected with 422)
 *   - history[i].content: 1–2000 characters
 */
export function validateChatAskInput(body: unknown): ValidatedChatAskInput {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new UnprocessableEntityError('Invalid request body', [
      {
        field: 'body',
        message: 'Input should be a valid JSON object',
      },
    ]);
  }

  const record = body as Record<string, unknown>;
  const details: FieldValidationDetail[] = [];

  const rawQuestion = record.question;
  let cleanQuestion = '';

  if (typeof rawQuestion !== 'string') {
    details.push({
      field: 'question',
      message: 'Input should be a valid string',
    });
  } else {
    cleanQuestion = rawQuestion.trim();
    if (cleanQuestion.length < 1 || cleanQuestion.length > 1000) {
      details.push({
        field: 'question',
        message: 'String should have at least 1 character and at most 1000 characters',
      });
    }
  }

  const rawHistory = record.history;
  const cleanHistory: ValidatedHistoryTurn[] = [];

  if (rawHistory !== undefined) {
    if (!Array.isArray(rawHistory)) {
      details.push({
        field: 'history',
        message: 'Input should be a valid list',
      });
    } else {
      if (rawHistory.length > 20) {
        details.push({
          field: 'history',
          message: 'List should have at most 20 items after validation',
        });
      }

      rawHistory.forEach((turn, idx) => {
        if (!turn || typeof turn !== 'object' || Array.isArray(turn)) {
          details.push({
            field: `history.${idx}`,
            message: 'Input should be a valid object',
          });
          return;
        }

        const turnObj = turn as Record<string, unknown>;
        const role = turnObj.role;
        const content = turnObj.content;

        if (role !== 'user' && role !== 'assistant') {
          details.push({
            field: `history.${idx}.role`,
            message: "Input should be 'user' or 'assistant'",
          });
        }

        if (typeof content !== 'string') {
          details.push({
            field: `history.${idx}.content`,
            message: 'Input should be a valid string',
          });
        } else {
          const trimmedContent = content.trim();
          if (trimmedContent.length < 1 || trimmedContent.length > 2000) {
            details.push({
              field: `history.${idx}.content`,
              message:
                'String should have at least 1 character and at most 2000 characters',
            });
          } else if (role === 'user' || role === 'assistant') {
            cleanHistory.push({
              role,
              content: trimmedContent,
            });
          }
        }
      });
    }
  }

  if (details.length > 0) {
    throw new UnprocessableEntityError('Invalid request body', details);
  }

  return {
    question: cleanQuestion,
    history: cleanHistory,
  };
}

export function validateContactInput(body: unknown): {
  name: string;
  email: string;
  message: string;
} {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body must be a JSON object.');
  }

  const { name, email, message } = body as Record<string, unknown>;
  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim() : '';
  const cleanMessage = typeof message === 'string' ? message.trim() : '';

  if (!cleanName || !cleanEmail || !cleanMessage) {
    throw new ValidationError('All fields (name, email, message) are required.');
  }

  if (cleanName.length > 120) {
    throw new ValidationError('Name must not exceed 120 characters.');
  }

  if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 254) {
    throw new ValidationError('Please provide a valid email address.');
  }

  if (cleanMessage.length > 4000) {
    throw new ValidationError('Message must not exceed 4000 characters.');
  }

  return {
    name: cleanName,
    email: cleanEmail,
    message: cleanMessage,
  };
}
