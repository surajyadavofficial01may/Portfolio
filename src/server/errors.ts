/**
 * Centralized Application Exception Hierarchy & Express Error Handler
 *
 * Differentiates between:
 * - ValidationError (400)
 * - AuthenticationError (401)
 * - AuthorizationError (403)
 * - NotFoundError (404)
 * - RateLimitError (429)
 * - ExternalServiceError (502)
 * - InternalServerError (500)
 */
import type { Request, Response, NextFunction } from 'express';
import { createLogger } from './logger';

const logger = createLogger('ErrorHandler');

export type ErrorCategory =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'EXTERNAL_SERVICE_ERROR'
  | 'CONFIGURATION_ERROR'
  | 'INTERNAL_SERVER_ERROR';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly category: ErrorCategory;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    category: ErrorCategory = 'INTERNAL_SERVER_ERROR',
    details?: unknown
  ) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.category = category;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required or invalid credentials.') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Requested resource was not found.') {
    super(message, 404, 'NOT_FOUND_ERROR');
  }
}

export class RateLimitError extends AppError {
  public readonly retryAfterSeconds: number;

  constructor(message = 'Too many requests. Please try again shortly.', retryAfterSeconds = 60) {
    super(message, 429, 'RATE_LIMIT_ERROR', { retryAfterSeconds });
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class ExternalServiceError extends AppError {
  constructor(message = 'Upstream external service error.', details?: unknown) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', details);
  }
}

/**
 * Standardized Express error-handling middleware.
 * Never exposes stack traces or internal secrets to clients.
 */
export function errorHandlerMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = (req.headers['x-request-id'] as string | undefined) || 'unknown';

  if (err instanceof AppError) {
    if (err instanceof RateLimitError) {
      res.setHeader('Retry-After', String(err.retryAfterSeconds));
    }

    logger.warn(err.message, {
      requestId,
      statusCode: err.statusCode,
      errorCategory: err.category,
      path: req.path,
    });

    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      category: err.category,
      requestId,
    });
    return;
  }

  const message =
    err instanceof Error ? err.message : 'An unexpected server error occurred.';

  logger.error(message, {
    requestId,
    statusCode: 500,
    errorCategory: 'INTERNAL_SERVER_ERROR',
    path: req.path,
  });

  res.status(500).json({
    success: false,
    error: 'Internal server error.',
    category: 'INTERNAL_SERVER_ERROR',
    requestId,
  });
}
