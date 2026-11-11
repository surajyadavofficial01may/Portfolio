import {
  DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
  MASTER_SPREADSHEET_TITLE,
  PORTFOLIO_SHEETS_SCHEMA,
  PortfolioKnowledgeBaseData,
  SheetTabName,
  SheetRecord,
} from '../data/knowledgeBaseSchema';
import { getClientConfig } from '../config/clientEnv';

export interface SupabaseSyncMeta {
  supabaseUrl: string;
  bucketName: string;
  tableName: string;
  publicMasterJsonUrl: string;
  tableSynced: boolean;
  totalRows: number;
  lastSyncedAt: string;
}

const clientCfg = getClientConfig();

const DEFAULT_SYNC_META: SupabaseSyncMeta = {
  supabaseUrl: clientCfg.supabaseUrl,
  bucketName: clientCfg.supabaseKbBucket,
  tableName: clientCfg.supabaseKbTable,
  publicMasterJsonUrl: clientCfg.supabaseUrl
    ? `${clientCfg.supabaseUrl}/storage/v1/object/public/${clientCfg.supabaseKbBucket}/Portfolio_Knowledge_Base.json`
    : '/api/knowledge-base',
  tableSynced: false,
  totalRows: Object.values(DEFAULT_PORTFOLIO_KNOWLEDGE_BASE).reduce(
    (sum, rows) => sum + rows.length,
    0
  ),
  lastSyncedAt: new Date().toLocaleString(),
};

let currentKnowledgeBase: PortfolioKnowledgeBaseData = DEFAULT_PORTFOLIO_KNOWLEDGE_BASE;
let currentSyncMeta: SupabaseSyncMeta = DEFAULT_SYNC_META;
let hasInitializedRemoteFetch = false;

type KBListener = () => void;
const listeners = new Set<KBListener>();

export function subscribeKnowledgeBase(listener: KBListener): () => void {
  listeners.add(listener);
  if (!hasInitializedRemoteFetch && typeof window !== 'undefined') {
    hasInitializedRemoteFetch = true;
    fetchKnowledgeBaseFromSupabase().catch(() => {});
  }
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function getActiveKnowledgeBase(): {
  data: PortfolioKnowledgeBaseData;
  syncMeta: SupabaseSyncMeta;
} {
  if (!hasInitializedRemoteFetch && typeof window !== 'undefined') {
    hasInitializedRemoteFetch = true;
    fetchKnowledgeBaseFromSupabase().catch(() => {});
  }
  return {
    data: currentKnowledgeBase,
    syncMeta: currentSyncMeta,
  };
}

/**
 * Reads the live 7-tab knowledge base:
 * 1. First queries backend API (`/api/knowledge-base`) to discover live Supabase status & data
 * 2. If frontend VITE_SUPABASE_URL & VITE_SUPABASE_PUBLISHABLE_KEY are configured, queries Supabase PostgREST or Storage directly
 */
export async function fetchKnowledgeBaseFromSupabase(): Promise<{
  data: PortfolioKnowledgeBaseData;
  syncMeta: SupabaseSyncMeta;
}> {
  const cfg = getClientConfig();

  // 1. Fetch public metadata & records from our backend proxy (/api/knowledge-base)
  try {
    const apiRes = await fetch('/api/knowledge-base');
    if (apiRes.ok) {
      const apiPayload = await apiRes.json();
      if (apiPayload?.supabase) {
        currentSyncMeta = {
          supabaseUrl: apiPayload.supabase.supabaseUrl || cfg.supabaseUrl,
          bucketName: apiPayload.supabase.bucketName || cfg.supabaseKbBucket,
          tableName: apiPayload.supabase.tableName || cfg.supabaseKbTable,
          publicMasterJsonUrl:
            apiPayload.supabase.publicMasterJsonUrl || currentSyncMeta.publicMasterJsonUrl,
          tableSynced: Boolean(apiPayload.supabase.tableSynced),
          totalRows: currentSyncMeta.totalRows,
          lastSyncedAt: apiPayload.supabase.lastSyncedAt
            ? new Date(apiPayload.supabase.lastSyncedAt).toLocaleString()
            : currentSyncMeta.lastSyncedAt,
        };
      }
      if (apiPayload?.data) {
        currentKnowledgeBase = {
          ...DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
          ...apiPayload.data,
        };
        notifyListeners();
      }
    }
  } catch {
    // Continue to direct Supabase fetch if configured
  }

  const activeSupabaseUrl = currentSyncMeta.supabaseUrl || cfg.supabaseUrl;
  const activeBucket = currentSyncMeta.bucketName || cfg.supabaseKbBucket;
  const activeTable = currentSyncMeta.tableName || cfg.supabaseKbTable;

  // 2. If publishable key is configured in client env, try querying Supabase PostgREST table directly
  if (activeSupabaseUrl && cfg.supabasePublishableKey) {
    try {
      const tableRes = await fetch(
        `${activeSupabaseUrl}/rest/v1/${activeTable}?select=id,category,title,content,url,active,sort_order&order=sort_order.asc`,
        {
          headers: {
            apikey: cfg.supabasePublishableKey,
            Authorization: `Bearer ${cfg.supabasePublishableKey}`,
          },
        }
      );

      if (tableRes.ok) {
        const rows = (await tableRes.json()) as Array<{
          id: string;
          category: SheetTabName;
          title: string;
          content: string;
          url: string;
          active: boolean;
        }>;

        if (Array.isArray(rows) && rows.length > 0) {
          const grouped: PortfolioKnowledgeBaseData = {
            Personal_Details: [],
            Work_Experience: [],
            Technical_Skills: [],
            Projects: [],
            Articles: [],
            Social_Links: [],
            FAQs: [],
          };

          for (const r of rows) {
            if (grouped[r.category]) {
              const record: SheetRecord = {
                id: r.id,
                title: r.title || '',
                content: r.content || '',
                url: r.url || '',
                active: r.active === false ? 'FALSE' : 'TRUE',
              };
              grouped[r.category].push(record);
            }
          }

          currentKnowledgeBase = grouped;
          currentSyncMeta = {
            ...currentSyncMeta,
            tableSynced: true,
            totalRows: rows.length,
            lastSyncedAt: new Date().toLocaleString(),
          };
          notifyListeners();
          return { data: currentKnowledgeBase, syncMeta: currentSyncMeta };
        }
      }
    } catch {
      // Fall through to Supabase Storage public bucket
    }
  }

  // 3. Fetch live JSON from Supabase Storage public bucket if URL is available
  if (activeSupabaseUrl) {
    try {
      const storageUrl = `${activeSupabaseUrl}/storage/v1/object/public/${activeBucket}/Portfolio_Knowledge_Base.json?t=${Date.now()}`;
      const storageRes = await fetch(storageUrl);
      if (storageRes.ok) {
        const payload = await storageRes.json();
        if (payload && payload.tabs) {
          const merged: PortfolioKnowledgeBaseData = {
            ...DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
            ...payload.tabs,
          };
          const totalRows = PORTFOLIO_SHEETS_SCHEMA.reduce(
            (acc, s) => acc + (merged[s.name]?.length || 0),
            0
          );
          currentKnowledgeBase = merged;
          currentSyncMeta = {
            supabaseUrl: activeSupabaseUrl,
            bucketName: activeBucket,
            tableName: activeTable,
            publicMasterJsonUrl: `${activeSupabaseUrl}/storage/v1/object/public/${activeBucket}/Portfolio_Knowledge_Base.json`,
            tableSynced: Boolean(payload.tableSynced),
            totalRows,
            lastSyncedAt: payload.syncedAt
              ? new Date(payload.syncedAt).toLocaleString()
              : new Date().toLocaleString(),
          };
          notifyListeners();
        }
      }
    } catch {
      // Keep currentKnowledgeBase
    }
  }

  return {
    data: currentKnowledgeBase,
    syncMeta: currentSyncMeta,
  };
}

/**
 * Verifies the administrator password server-side via POST /api/admin/verify.
 * Never stores or compares the admin password in client-side source code.
 */
export async function verifyAdminPasswordServerSide(password: string): Promise<{
  authenticated: boolean;
  token?: string;
  error?: string;
}> {
  const res = await fetch('/api/admin/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.authenticated) {
    return {
      authenticated: false,
      error: data.error || 'Invalid administrator password.',
    };
  }

  return {
    authenticated: true,
    token: data.token,
  };
}

/**
 * Triggers a server-side sync to push the latest 7-tab codebase knowledge base
 * to Supabase Storage and Supabase Postgres (`POST /api/knowledge-base/sync-supabase`).
 */
export async function triggerSupabaseSyncFromAdmin(adminToken: string): Promise<{
  success: boolean;
  message: string;
  syncMeta: SupabaseSyncMeta;
}> {
  const res = await fetch('/api/knowledge-base/sync-supabase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to sync knowledge base to Supabase.');
  }

  await fetchKnowledgeBaseFromSupabase();

  currentSyncMeta = {
    supabaseUrl: data.supabaseUrl || currentSyncMeta.supabaseUrl,
    bucketName: data.bucketName || currentSyncMeta.bucketName,
    tableName: data.tableName || currentSyncMeta.tableName,
    publicMasterJsonUrl:
      data.publicMasterJsonUrl || currentSyncMeta.publicMasterJsonUrl,
    tableSynced: Boolean(data.tableSynced),
    totalRows: data.totalRows || currentSyncMeta.totalRows,
    lastSyncedAt: new Date().toLocaleString(),
  };
  notifyListeners();

  return {
    success: true,
    message:
      data.message ||
      `Synced all 7 tabs of ${MASTER_SPREADSHEET_TITLE} to Supabase!`,
    syncMeta: currentSyncMeta,
  };
}

export function getSupabaseTabPublicUrl(
  tabName: SheetTabName,
  format: 'json' | 'csv' = 'json'
): string {
  const baseUrl = currentSyncMeta.supabaseUrl || getClientConfig().supabaseUrl;
  const bucket = currentSyncMeta.bucketName || getClientConfig().supabaseKbBucket;
  if (!baseUrl) {
    return format === 'csv'
      ? `/api/knowledge-base/${tabName}/csv`
      : `/api/knowledge-base/${tabName}`;
  }
  return `${baseUrl}/storage/v1/object/public/${bucket}/${tabName}.${format}`;
}
