/**
 * Portfolio Full-Stack Application Server Entrypoint
 *
 * Compatible with both `node server.ts` (Node 22 native TypeScript execution in production)
 * and `tsx server.ts` (development).
 */
import express from 'express';
import path from 'path';
import fs from 'fs';
import { DEFAULT_PORTFOLIO_KNOWLEDGE_BASE } from './src/data/knowledgeBaseSchema.ts';
import { syncKnowledgeBaseToSupabase } from './scripts/sync-knowledge-base-to-supabase.ts';
import { getServerConfig, validateStartupConfig } from './src/config/env.ts';
import { securityAndTracingMiddleware } from './src/server/middleware/security.ts';
import { errorHandlerMiddleware } from './src/server/errors.ts';
import {
  createApiRouter,
  updateSupabaseRuntimeSyncState,
} from './src/server/routes/apiRouter.ts';
import { createLogger } from './src/server/logger.ts';

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

  // Validate startup configuration (non-fatal on Cloud Run so the container always binds to PORT)
  const startupCheck = validateStartupConfig({ strict: false });
  if (!startupCheck.valid) {
    logger.warn(
      `Optional/external environment variables not set in runtime environment: ${startupCheck.missing.join(
        ', '
      )}. Using bundled 7-tab knowledge base.`
    );
  } else {
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

  const distPath = path.join(process.cwd(), 'dist');
  const hasBuiltDist = fs.existsSync(path.join(distPath, 'index.html'));

  // Serve built static assets in production (or when dist/ exists and NODE_ENV=production), otherwise mount Vite dev middleware
  if (config.nodeEnv === 'production' || (hasBuiltDist && process.env.K_SERVICE)) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on http://0.0.0.0:${PORT}`, {
      environment: config.nodeEnv,
    });
  });
}

if (process.env.SKIP_SERVER_AUTOSTART !== 'true') {
  startServer();
}
