/**
 * Server-Side Administrator Authentication & Session Token Service
 */
import crypto from 'crypto';
import {
  getServerConfig,
  validateAdminAuthConfig,
  timingSafeCompare,
} from '../../config/env.ts';

const ADMIN_SESSION_SIGNING_KEY = crypto.randomBytes(32).toString('hex');
export const ADMIN_TOKEN_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

export function issueAdminSessionToken(ttlMs = ADMIN_TOKEN_TTL_MS): string {
  const expiresAt = Date.now() + ttlMs;
  const payload = `admin:${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', ADMIN_SESSION_SIGNING_KEY)
    .update(payload)
    .digest('hex');
  return Buffer.from(`${payload}:${signature}`, 'utf8').toString('base64url');
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token || typeof token !== 'string') return false;
  try {
    const decoded = Buffer.from(token.trim(), 'base64url').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length !== 3 || parts[0] !== 'admin') return false;

    const expiresAt = Number(parts[1]);
    const providedSignature = parts[2];
    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

    const payload = `admin:${expiresAt}`;
    const expectedSignature = crypto
      .createHmac('sha256', ADMIN_SESSION_SIGNING_KEY)
      .update(payload)
      .digest('hex');

    return timingSafeCompare(providedSignature, expectedSignature);
  } catch {
    return false;
  }
}

export function authenticateAdminPassword(candidatePassword: string): {
  authenticated: boolean;
  token?: string;
  expiresInSeconds?: number;
} {
  const config = getServerConfig();
  validateAdminAuthConfig(config);

  if (!timingSafeCompare(candidatePassword, config.security.adminPassword)) {
    return { authenticated: false };
  }

  return {
    authenticated: true,
    token: issueAdminSessionToken(),
    expiresInSeconds: ADMIN_TOKEN_TTL_MS / 1000,
  };
}
