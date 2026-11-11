/**
 * Security, Request Tracing, Rate Limiting & Input Validation Middleware
 */
import crypto from 'crypto';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { RateLimitError, ValidationError } from '../errors';
import { createLogger } from '../logger';

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
          options.message || 'Rate limit exceeded. Please wait before retrying.',
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

export function validateChatInput(body: unknown): {
  message: string;
  ragContext?: string;
} {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body must be a JSON object.');
  }

  const { message, ragContext } = body as Record<string, unknown>;
  if (typeof message !== 'string' || !message.trim()) {
    throw new ValidationError('Message is required and must be a non-empty string.');
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length > 2000) {
    throw new ValidationError('Message must not exceed 2000 characters.');
  }

  const sanitizedRagContext =
    typeof ragContext === 'string' ? ragContext.slice(0, 16000) : undefined;

  return {
    message: trimmedMessage,
    ragContext: sanitizedRagContext,
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
