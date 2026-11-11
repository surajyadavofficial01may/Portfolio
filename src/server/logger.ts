/**
 * Structured Application Logger with Automatic Secret Redaction
 *
 * Captures:
 * - ISO-8601 timestamp
 * - Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
 * - Service/module name
 * - Request correlation ID (when available)
 * - Execution duration (ms)
 * - Sanitized diagnostic metadata (never logs passwords, tokens, secret keys, or API keys)
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export interface LogMetadata {
  requestId?: string;
  durationMs?: number;
  statusCode?: number;
  errorCategory?: string;
  [key: string]: unknown;
}

const SENSITIVE_KEY_PATTERN =
  /password|passcode|secret|token|apikey|api_key|authorization|cookie|credential|private_key/i;

const SENSITIVE_VALUE_PATTERNS = [
  /sb_secret_[A-Za-z0-9_-]+/g,
  /\bsk-[A-Za-z0-9]{20,}\b/g,
  /\bgsk_[A-Za-z0-9]{20,}\b/g,
  /\bAIza[0-9A-Za-z\-_]{35}\b/g,
];

/**
 * Recursively sanitizes metadata objects so sensitive keys or token patterns
 * are always replaced with `[REDACTED]`.
 */
export function redactSensitiveMetadata(value: unknown, depth = 0): unknown {
  if (depth > 4) return '[MAX_DEPTH]';
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    let sanitized = value;
    for (const pattern of SENSITIVE_VALUE_PATTERNS) {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    }
    return sanitized;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveMetadata(item, depth + 1));
  }

  if (typeof value === 'object') {
    const output: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEY_PATTERN.test(key)) {
        output[key] = '[REDACTED]';
      } else {
        output[key] = redactSensitiveMetadata(val, depth + 1);
      }
    }
    return output;
  }

  return value;
}

export class StructuredLogger {
  private readonly moduleName: string;

  constructor(moduleName: string) {
    this.moduleName = moduleName;
  }

  private emit(level: LogLevel, message: string, meta?: LogMetadata): void {
    const sanitizedMeta = meta
      ? (redactSensitiveMetadata(meta) as Record<string, unknown>)
      : undefined;

    const entry = {
      timestamp: new Date().toISOString(),
      level,
      module: this.moduleName,
      message: redactSensitiveMetadata(message) as string,
      ...(sanitizedMeta && Object.keys(sanitizedMeta).length > 0
        ? { meta: sanitizedMeta }
        : {}),
    };

    const formatted = `[${entry.timestamp}] [${entry.level}] [${entry.module}] ${entry.message}${
      entry.meta ? ` ${JSON.stringify(entry.meta)}` : ''
    }`;

    if (level === 'ERROR' || level === 'CRITICAL') {
      console.error(formatted);
    } else if (level === 'WARNING') {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  public debug(message: string, meta?: LogMetadata): void {
    if (process.env.NODE_ENV === 'development') {
      this.emit('DEBUG', message, meta);
    }
  }

  public info(message: string, meta?: LogMetadata): void {
    this.emit('INFO', message, meta);
  }

  public warn(message: string, meta?: LogMetadata): void {
    this.emit('WARNING', message, meta);
  }

  public error(message: string, meta?: LogMetadata): void {
    this.emit('ERROR', message, meta);
  }

  public critical(message: string, meta?: LogMetadata): void {
    this.emit('CRITICAL', message, meta);
  }
}

export function createLogger(moduleName: string): StructuredLogger {
  return new StructuredLogger(moduleName);
}
