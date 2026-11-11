/**
 * Portfolio Full-Stack Application Server Entrypoint
 *
 * Mounts:
 * - Structured request tracing & security headers (`securityAndTracingMiddleware`)
 * - Request payload size limits (`express.json({ limit: '64kb' })`)
 * - Modular REST API router (`/api/*`)
 * - Centralized error-handling middleware (`errorHandlerMiddleware`)
 * - Vite dev middleware (development) or static SPA serving (production)
 */
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { DEFAULT_PORTFOLIO_KNOWLEDGE_BASE } from './src/data/knowledgeBaseSchema';
import { syncKnowledgeBaseToSupabase } from './scripts/sync-knowledge-base-to-supabase';
import { getServerConfig, validateStartupConfig } from './src/config/env';
import { securityAndTracingMiddleware } from './src/server/middleware/security';
import { errorHandlerMiddleware } from './src/server/errors';
import {
  createApiRouter,
  updateSupabaseRuntimeSyncState,
} from './src/server/routes/apiRouter';
import { createLogger } from './src/server/logger';

const logger = createLogger('Server');
const config = getServerConfig();

export function createApp(): express.Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(securityAndTracingMiddleware);
  app.use(express.json({ limit: '64kb' }));

  // Mount API routes
  app.use('/api', createApiRouter());

  // Centralized API error handler
  app.use(errorHandlerMiddleware);

  return app;
}

export const app = createApp();

async function startServer(): Promise<void> {
  const PORT = config.port;

  // Validate startup configuration
  const startupCheck = validateStartupConfig({
    strict: config.nodeEnv === 'production',
  });
  if (!startupCheck.valid) {
    logger.warn(
      `Missing environment variables: ${startupCheck.missing.join(
        ', '
      )}. Configure them in .env.`
    );
  } else {
    // Automatically sync all 7 categories of Portfolio_Knowledge_Base to Supabase on startup
    syncKnowledgeBaseToSupabase(DEFAULT_PORTFOLIO_KNOWLEDGE_BASE)
      .then((res) => {
        updateSupabaseRuntimeSyncState({
          supabaseUrl: res.supabaseUrl,
          bucketName: res.bucketName,
          tableName: res.tableName,
          publicMasterJsonUrl: res.publicMasterJsonUrl,
          tableSynced: res.tableSynced,
          lastSyncedAt: res.lastSyncedAt,
        });
        logger.info(res.message);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        logger.warn(`Supabase startup auto-sync warning: ${msg}`);
      });
  }

  // Vite middleware for development or static dist serving for production
  if (config.nodeEnv !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on http://0.0.0.0:${PORT}`, {
      environment: config.nodeEnv,
    });
  });
}

const isMainServerEntry =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  (process.argv[1].endsWith('server.ts') || process.argv[1].endsWith('server.cjs'));

if (isMainServerEntry) {
  startServer();
}
