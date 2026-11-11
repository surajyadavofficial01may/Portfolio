import dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables from .env once across all backend modules and CLI scripts
dotenv.config();

export class ConfigurationError extends Error {
  public readonly missingVariables: string[];

  constructor(missingVariables: string[], context: string) {
    super(
      `[ConfigurationError] Missing required environment variable(s) for ${context}: ${missingVariables.join(
        ', '
      )}. Configure them in your .env file (local development) or platform Secret Manager (CI/CD & production). See .env.example for documentation.`
    );
    this.name = 'ConfigurationError';
    this.missingVariables = missingVariables;
  }
}

export interface ServerConfig {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  appUrl?: string;
  geminiApiKey?: string;
  supabase: {
    url: string;
    publishableKey: string;
    secretKey: string;
    jwksUrl: string;
    kbBucket: string;
    kbTable: string;
  };
  security: {
    adminPassword: string;
  };
}

function cleanEnvValue(value: string | undefined): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function getServerConfig(): ServerConfig {
  const rawNodeEnv = cleanEnvValue(process.env.NODE_ENV) || 'development';
  const nodeEnv =
    rawNodeEnv === 'production' || rawNodeEnv === 'test' ? rawNodeEnv : 'development';

  const parsedPort = Number(cleanEnvValue(process.env.PORT));
  const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 3000;

  const supabaseUrl = cleanEnvValue(process.env.SUPABASE_URL).replace(/\/+$/, '');
  const supabasePublishableKey = cleanEnvValue(process.env.SUPABASE_PUBLISHABLE_KEY);
  const supabaseSecretKey = cleanEnvValue(process.env.SUPABASE_SECRET_KEY);
  const supabaseJwksUrl =
    cleanEnvValue(process.env.SUPABASE_JWKS_URL) ||
    (supabaseUrl ? `${supabaseUrl}/auth/v1/.well-known/jwks.json` : '');

  return {
    nodeEnv,
    port,
    appUrl: cleanEnvValue(process.env.APP_URL) || undefined,
    geminiApiKey: cleanEnvValue(process.env.GEMINI_API_KEY) || undefined,
    supabase: {
      url: supabaseUrl,
      publishableKey: supabasePublishableKey,
      secretKey: supabaseSecretKey,
      jwksUrl: supabaseJwksUrl,
      kbBucket: cleanEnvValue(process.env.SUPABASE_KB_BUCKET) || 'portfolio-knowledge-base',
      kbTable: cleanEnvValue(process.env.SUPABASE_KB_TABLE) || 'portfolio_knowledge_base',
    },
    security: {
      adminPassword: cleanEnvValue(process.env.ADMIN_PASSWORD),
    },
  };
}

/**
 * Validates that required Supabase write/sync credentials are present.
 * Throws a clear ConfigurationError if any required variable is missing.
 */
export function validateSupabaseSyncConfig(config: ServerConfig = getServerConfig()): void {
  const missing: string[] = [];
  if (!config.supabase.url) {
    missing.push('SUPABASE_URL');
  }
  if (!config.supabase.secretKey) {
    missing.push('SUPABASE_SECRET_KEY');
  }
  if (missing.length > 0) {
    throw new ConfigurationError(missing, 'Supabase Knowledge Base Sync');
  }
}

/**
 * Validates that ADMIN_PASSWORD is configured on the server before verifying admin login.
 */
export function validateAdminAuthConfig(config: ServerConfig = getServerConfig()): void {
  if (!config.security.adminPassword) {
    throw new ConfigurationError(['ADMIN_PASSWORD'], 'Admin Studio Authentication');
  }
}

/**
 * Performs startup validation of core server environment variables.
 * In production mode (or when strict validation is enabled), throws immediately on missing secrets.
 */
export function validateStartupConfig(options?: { strict?: boolean }): {
  valid: boolean;
  missing: string[];
} {
  const config = getServerConfig();
  const missing: string[] = [];

  if (!config.supabase.url) missing.push('SUPABASE_URL');
  if (!config.supabase.publishableKey) missing.push('SUPABASE_PUBLISHABLE_KEY');
  if (!config.supabase.secretKey) missing.push('SUPABASE_SECRET_KEY');
  if (!config.security.adminPassword) missing.push('ADMIN_PASSWORD');

  const isStrict = options?.strict ?? config.nodeEnv === 'production';
  if (missing.length > 0 && isStrict) {
    throw new ConfigurationError(missing, 'Application Startup');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Constant-time secret comparison to prevent timing side-channel attacks.
 */
export function timingSafeCompare(candidate: string, expected: string): boolean {
  if (!candidate || !expected) return false;
  const candidateBuf = Buffer.from(candidate, 'utf8');
  const expectedBuf = Buffer.from(expected, 'utf8');
  if (candidateBuf.length !== expectedBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(candidateBuf, expectedBuf);
}
