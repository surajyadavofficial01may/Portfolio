/**
 * Centralized Frontend Public Configuration Module
 *
 * IMPORTANT SECURITY BOUNDARY:
 * - Frontend environment variables (VITE_*) are embedded in the client bundle at build time
 *   and are visible to browsers.
 * - NEVER place private credentials (such as SUPABASE_SECRET_KEY, ADMIN_PASSWORD, GEMINI_API_KEY,
 *   database passwords, or OAuth client secrets) in this module or in any VITE_* variable.
 */

export interface ClientPublicConfig {
  supabaseUrl: string;
  supabasePublishableKey: string;
  supabaseJwksUrl: string;
  supabaseKbBucket: string;
  supabaseKbTable: string;
  ragServiceUrl: string;
}

function getViteEnv(key: string): string {
  const meta = import.meta as unknown as { env?: Record<string, string | undefined> };
  if (typeof meta !== 'undefined' && meta.env && key in meta.env) {
    const val = meta.env[key];
    return typeof val === 'string' ? val.trim() : '';
  }
  return '';
}

export function getClientConfig(): ClientPublicConfig {
  const supabaseUrl = getViteEnv('VITE_SUPABASE_URL').replace(/\/+$/, '');
  const supabasePublishableKey = getViteEnv('VITE_SUPABASE_PUBLISHABLE_KEY');
  const supabaseJwksUrl =
    getViteEnv('VITE_SUPABASE_JWKS_URL') ||
    (supabaseUrl ? `${supabaseUrl}/auth/v1/.well-known/jwks.json` : '');

  return {
    supabaseUrl,
    supabasePublishableKey,
    supabaseJwksUrl,
    supabaseKbBucket:
      getViteEnv('VITE_SUPABASE_KB_BUCKET') || 'portfolio-knowledge-base',
    supabaseKbTable:
      getViteEnv('VITE_SUPABASE_KB_TABLE') || 'portfolio_knowledge_base',
    ragServiceUrl: getViteEnv('VITE_RAG_SERVICE_URL').replace(/\/+$/, ''),
  };
}
