/**
 * Modular Express API Router (`/api/*`)
 */
import { Router } from 'express';
import {
  DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
  MASTER_SPREADSHEET_TITLE,
  PORTFOLIO_SHEETS_SCHEMA,
  type SheetTabName,
  retrieveKnowledgeForQuery,
} from '../../data/knowledgeBaseSchema.ts';
import { syncKnowledgeBaseToSupabase } from '../../../scripts/sync-knowledge-base-to-supabase.ts';
import { getServerConfig } from '../../config/env.ts';
import {
  authenticateAdminPassword,
  verifyAdminSessionToken,
} from '../services/adminAuthService.ts';
import { generateAssistantChatReply } from '../services/chatService.ts';
import {
  createRateLimiter,
  validateChatInput,
  validateContactInput,
} from '../middleware/security.ts';
import {
  AuthenticationError,
  NotFoundError,
  ExternalServiceError,
} from '../errors.ts';
import { createLogger } from '../logger.ts';

const logger = createLogger('ApiRouter');

export interface SupabaseRuntimeSyncState {
  supabaseUrl: string;
  bucketName: string;
  tableName: string;
  publicMasterJsonUrl: string;
  tableSynced: boolean;
  lastSyncedAt: string;
}

const initialConfig = getServerConfig();

let supabaseSyncStatus: SupabaseRuntimeSyncState = {
  supabaseUrl: initialConfig.supabase.url,
  bucketName: initialConfig.supabase.kbBucket,
  tableName: initialConfig.supabase.kbTable,
  publicMasterJsonUrl: initialConfig.supabase.url
    ? `${initialConfig.supabase.url}/storage/v1/object/public/${initialConfig.supabase.kbBucket}/Portfolio_Knowledge_Base.json`
    : '/api/knowledge-base',
  tableSynced: false,
  lastSyncedAt: new Date().toISOString(),
};

export function updateSupabaseRuntimeSyncState(
  next: Partial<SupabaseRuntimeSyncState>
): void {
  supabaseSyncStatus = { ...supabaseSyncStatus, ...next };
}

export function getSupabaseRuntimeSyncState(): SupabaseRuntimeSyncState {
  return supabaseSyncStatus;
}

export function createApiRouter(): Router {
  const router = Router();

  const adminVerifyLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 15,
    message: 'Too many login attempts. Please wait a minute before trying again.',
  });

  const chatLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 45,
    message: 'Rate limit reached for AI Assistant chat. Please wait a moment.',
  });

  const contactLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 10,
    message: 'Too many contact transmissions. Please wait a minute.',
  });

  // 1. Health, Liveness & Readiness Endpoint
  router.get('/health', (_req, res) => {
    const cfg = getServerConfig();
    res.json({
      status: 'ok',
      environment: cfg.nodeEnv,
      uptimeSeconds: Math.floor(process.uptime()),
      supabaseConfigured: Boolean(cfg.supabase.url && cfg.supabase.secretKey),
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Server-Side Admin Authentication Endpoint (`POST /api/admin/verify`)
  router.post('/admin/verify', adminVerifyLimiter, (req, res, next) => {
    try {
      const candidatePassword =
        typeof req.body?.password === 'string' ? req.body.password : '';

      const result = authenticateAdminPassword(candidatePassword);
      if (!result.authenticated) {
        return res.status(401).json({
          authenticated: false,
          error: 'Invalid administrator password.',
        });
      }

      return res.json({
        authenticated: true,
        token: result.token,
        expiresInSeconds: result.expiresInSeconds,
      });
    } catch (err: unknown) {
      next(err);
    }
  });

  // 3. Protected Admin Sync to Supabase (`POST /api/knowledge-base/sync-supabase`)
  router.post('/knowledge-base/sync-supabase', async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length).trim()
        : '';

      if (!verifyAdminSessionToken(token)) {
        throw new AuthenticationError(
          'Unauthorized: Valid administrator session token is required.'
        );
      }

      const syncResult = await syncKnowledgeBaseToSupabase(
        DEFAULT_PORTFOLIO_KNOWLEDGE_BASE
      );
      updateSupabaseRuntimeSyncState({
        supabaseUrl: syncResult.supabaseUrl,
        bucketName: syncResult.bucketName,
        tableName: syncResult.tableName,
        publicMasterJsonUrl: syncResult.publicMasterJsonUrl,
        tableSynced: syncResult.tableSynced,
        lastSyncedAt: syncResult.lastSyncedAt,
      });

      res.json({
        success: true,
        ...syncResult,
        supabase: supabaseSyncStatus,
      });
    } catch (err: unknown) {
      if (err instanceof AuthenticationError) {
        next(err);
      } else {
        const msg = err instanceof Error ? err.message : 'Supabase sync failed';
        next(new ExternalServiceError(msg));
      }
    }
  });

  // 4. Automated GitHub Push/Merge Webhook -> Syncs directly to Supabase
  router.post('/knowledge-base/webhook/github', async (_req, res, next) => {
    try {
      const syncResult = await syncKnowledgeBaseToSupabase(
        DEFAULT_PORTFOLIO_KNOWLEDGE_BASE
      );
      updateSupabaseRuntimeSyncState({
        supabaseUrl: syncResult.supabaseUrl,
        bucketName: syncResult.bucketName,
        tableName: syncResult.tableName,
        publicMasterJsonUrl: syncResult.publicMasterJsonUrl,
        tableSynced: syncResult.tableSynced,
        lastSyncedAt: syncResult.lastSyncedAt,
      });
      res.json({
        success: true,
        ...syncResult,
        supabase: supabaseSyncStatus,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Automated Supabase sync failed';
      next(new ExternalServiceError(msg));
    }
  });

  // 5. RAG Retrieval API for external codebases/services (`GET /api/knowledge-base/rag`)
  router.get('/knowledge-base/rag', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const query = typeof req.query.q === 'string' ? req.query.q.slice(0, 500) : '';
    const requestedTopK = Number(req.query.topK);
    const topK =
      Number.isFinite(requestedTopK) && requestedTopK >= 1 && requestedTopK <= 25
        ? Math.floor(requestedTopK)
        : 6;

    const context = retrieveKnowledgeForQuery(
      query,
      DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
      topK
    );
    res.json({
      query,
      topK,
      supabase: supabaseSyncStatus,
      context,
    });
  });

  // 6. Complete 7-Category Knowledge Base JSON API (`GET /api/knowledge-base`)
  router.get('/knowledge-base', (_req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=60');
    const baseUrl = supabaseSyncStatus.supabaseUrl;
    const bucket = supabaseSyncStatus.bucketName;

    res.json({
      title: MASTER_SPREADSHEET_TITLE,
      storageProvider: 'Supabase',
      supabase: supabaseSyncStatus,
      tabs: PORTFOLIO_SHEETS_SCHEMA.map((s) => ({
        number: s.number,
        name: s.name,
        columns: s.columns.map((c) => c.key),
        rowCount: (DEFAULT_PORTFOLIO_KNOWLEDGE_BASE[s.name] || []).length,
        supabaseJsonUrl: baseUrl
          ? `${baseUrl}/storage/v1/object/public/${bucket}/${s.name}.json`
          : `/api/knowledge-base/${s.name}`,
        supabaseCsvUrl: baseUrl
          ? `${baseUrl}/storage/v1/object/public/${bucket}/${s.name}.csv`
          : `/api/knowledge-base/${s.name}/csv`,
      })),
      data: DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
    });
  });

  // 7. Live CSV Export for any of the 7 categories (`GET /api/knowledge-base/:tab/csv`)
  router.get('/knowledge-base/:tab/csv', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const requested = req.params.tab.toLowerCase();
    const matchedSchema = PORTFOLIO_SHEETS_SCHEMA.find(
      (s) => s.name.toLowerCase() === requested
    );
    if (!matchedSchema) {
      return next(
        new NotFoundError(
          `Unknown category "${req.params.tab}". Valid categories: ${PORTFOLIO_SHEETS_SCHEMA.map(
            (s) => s.name
          ).join(', ')}`
        )
      );
    }

    const tabName = matchedSchema.name as SheetTabName;
    const rows = DEFAULT_PORTFOLIO_KNOWLEDGE_BASE[tabName] || [];
    const headers = matchedSchema.columns.map((c) => c.key);
    const escapeCell = (val: string) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const csvLines = [
      headers.map(escapeCell).join(','),
      ...rows.map((row) => headers.map((h) => escapeCell(row[h] ?? '')).join(',')),
    ];
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.send(csvLines.join('\n'));
  });

  // 8. Single Category JSON Endpoint (`GET /api/knowledge-base/:tab`)
  router.get('/knowledge-base/:tab', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const requested = req.params.tab.toLowerCase();
    const matchedSchema = PORTFOLIO_SHEETS_SCHEMA.find(
      (s) => s.name.toLowerCase() === requested
    );
    if (!matchedSchema) {
      return next(
        new NotFoundError(
          `Unknown category "${req.params.tab}". Valid categories: ${PORTFOLIO_SHEETS_SCHEMA.map(
            (s) => s.name
          ).join(', ')}`
        )
      );
    }

    const tabName = matchedSchema.name as SheetTabName;
    res.json({
      tab: tabName,
      supabase: supabaseSyncStatus,
      columns: matchedSchema.columns,
      rows: DEFAULT_PORTFOLIO_KNOWLEDGE_BASE[tabName] || [],
    });
  });

  // 9. AI Assistant Chat Endpoint (`POST /api/chat`)
  router.post('/chat', chatLimiter, async (req, res, next) => {
    try {
      const { message, ragContext } = validateChatInput(req.body);
      const reply = await generateAssistantChatReply({ message, ragContext });
      return res.json({ reply });
    } catch (err: unknown) {
      next(err);
    }
  });

  // 10. Contact Transmission Endpoint (`POST /api/contact`)
  router.post('/contact', contactLimiter, (req, res, next) => {
    try {
      const { name, email } = validateContactInput(req.body);
      const transmissionId = `TX-${Math.floor(100000 + Math.random() * 900000)}`;

      logger.info(`Contact transmission logged: ${transmissionId}`, {
        senderName: name,
        senderEmailDomain: email.split('@')[1] || 'unknown',
      });

      res.json({
        success: true,
        transmissionId,
        message: "Transmission received and logged in Suraj's terminal!",
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      next(err);
    }
  });

  return router;
}
