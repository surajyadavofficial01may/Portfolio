/**
 * Automated Build & CI/CD Sync Script for Portfolio_Knowledge_Base -> Supabase
 *
 * Exclusively stores and syncs all 7 Knowledge Base categories:
 * - Personal_Details
 * - Work_Experience
 * - Technical_Skills
 * - Projects (latest projects on top: Jira Fixer PRJ008, EVEE PRJ001, etc.)
 * - Articles
 * - Social_Links
 * - FAQs
 *
 * Columns per row: id | title | content | url | active
 *
 * Security Note:
 * All Supabase credentials (`SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWKS_URL`)
 * are loaded exclusively from environment variables via `src/config/env.ts`.
 * No credentials or fallback keys are hardcoded in source code.
 */
import {
  DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
  MASTER_SPREADSHEET_TITLE,
  PORTFOLIO_SHEETS_SCHEMA,
  PortfolioKnowledgeBaseData,
  SheetTabName,
} from '../src/data/knowledgeBaseSchema';
import { getServerConfig, validateSupabaseSyncConfig } from '../src/config/env';

export interface SupabaseSyncResult {
  synced: boolean;
  supabaseUrl: string;
  bucketName: string;
  tableName: string;
  publicMasterJsonUrl: string;
  tableSynced: boolean;
  totalRows: number;
  tabsSynced: SheetTabName[];
  lastSyncedAt: string;
  message: string;
}

export interface FlatSupabaseKBRecord {
  id: string;
  category: SheetTabName;
  title: string;
  content: string;
  url: string;
  active: boolean;
  sort_order: number;
  updated_at: string;
}

function escapeCsvCell(val: string): string {
  return `"${String(val ?? '').replace(/"/g, '""')}"`;
}

function buildCsvForTab(
  tabName: SheetTabName,
  kbData: PortfolioKnowledgeBaseData
): string {
  const tabSchema = PORTFOLIO_SHEETS_SCHEMA.find((t) => t.name === tabName)!;
  const headers = tabSchema.columns.map((c) => c.key);
  const rows = kbData[tabName] || [];
  const lines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) => headers.map((h) => escapeCsvCell(row[h] ?? '')).join(',')),
  ];
  return lines.join('\n');
}

export function flattenKnowledgeBaseForSupabase(
  kbData: PortfolioKnowledgeBaseData = DEFAULT_PORTFOLIO_KNOWLEDGE_BASE
): FlatSupabaseKBRecord[] {
  const now = new Date().toISOString();
  const records: FlatSupabaseKBRecord[] = [];

  for (const tab of PORTFOLIO_SHEETS_SCHEMA) {
    const rows = kbData[tab.name] || [];
    rows.forEach((row, index) => {
      records.push({
        id: row.id,
        category: tab.name,
        title: row.title || '',
        content: row.content || '',
        url: row.url || '',
        active: String(row.active || 'TRUE').toUpperCase() !== 'FALSE',
        sort_order: index + 1,
        updated_at: now,
      });
    });
  }

  return records;
}

async function ensureSupabaseBucketExists(
  supabaseUrl: string,
  secretKey: string,
  bucketName: string
): Promise<void> {
  const headers = {
    apikey: secretKey,
    Authorization: `Bearer ${secretKey}`,
    'Content-Type': 'application/json',
  };

  const checkRes = await fetch(`${supabaseUrl}/storage/v1/bucket/${bucketName}`, {
    method: 'GET',
    headers,
  });

  if (checkRes.status === 401 || checkRes.status === 403) {
    throw new Error(
      `Supabase authentication failed (${checkRes.status}) while checking bucket "${bucketName}". Verify SUPABASE_SECRET_KEY in your environment/secrets.`
    );
  }

  if (!checkRes.ok) {
    const createRes = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: bucketName,
        name: bucketName,
        public: true,
      }),
    });
    if (!createRes.ok && createRes.status !== 409) {
      const errBody = await createRes.text().catch(() => '');
      throw new Error(
        `Failed to create Supabase storage bucket "${bucketName}" (HTTP ${createRes.status}): ${errBody}`
      );
    }
  }
}

async function uploadSupabaseStorageObject(
  supabaseUrl: string,
  secretKey: string,
  bucketName: string,
  objectPath: string,
  content: string,
  contentType: string
): Promise<void> {
  const res = await fetch(
    `${supabaseUrl}/storage/v1/object/${bucketName}/${objectPath}`,
    {
      method: 'POST',
      headers: {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': contentType,
        'x-upsert': 'true',
        'Cache-Control': '3600',
      },
      body: content,
    }
  );
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(
      `Failed to upload "${objectPath}" to Supabase bucket "${bucketName}" (HTTP ${res.status}): ${errText}`
    );
  }
}

async function tryUpsertPostgresTable(
  supabaseUrl: string,
  secretKey: string,
  tableName: string,
  records: FlatSupabaseKBRecord[]
): Promise<boolean> {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/${tableName}?on_conflict=id`,
      {
        method: 'POST',
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify(records),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncKnowledgeBaseToSupabase(
  kbData: PortfolioKnowledgeBaseData = DEFAULT_PORTFOLIO_KNOWLEDGE_BASE
): Promise<SupabaseSyncResult> {
  const config = getServerConfig();
  validateSupabaseSyncConfig(config);

  const { url: supabaseUrl, secretKey, jwksUrl, kbBucket, kbTable } = config.supabase;

  const syncedAt = new Date().toISOString();
  const flatRecords = flattenKnowledgeBaseForSupabase(kbData);
  const tabsSynced: SheetTabName[] = [];

  await ensureSupabaseBucketExists(supabaseUrl, secretKey, kbBucket);

  // 1. Upload master Portfolio_Knowledge_Base.json to Supabase Storage
  const masterPayload = {
    title: MASTER_SPREADSHEET_TITLE,
    storageProvider: 'Supabase',
    supabaseUrl,
    bucket: kbBucket,
    jwksUrl,
    syncedAt,
    totalRows: flatRecords.length,
    schema: PORTFOLIO_SHEETS_SCHEMA.map((s) => ({
      number: s.number,
      name: s.name,
      columns: s.columns.map((c) => c.key),
      rowCount: (kbData[s.name] || []).length,
    })),
    tabs: kbData,
    records: flatRecords,
  };

  await uploadSupabaseStorageObject(
    supabaseUrl,
    secretKey,
    kbBucket,
    'Portfolio_Knowledge_Base.json',
    JSON.stringify(masterPayload, null, 2),
    'application/json; charset=utf-8'
  );

  // 2. Upload each of the 7 tabs as individual JSON and CSV objects in Supabase Storage
  for (const tab of PORTFOLIO_SHEETS_SCHEMA) {
    const tabRows = kbData[tab.name] || [];
    const tabJson = JSON.stringify(
      {
        tab: tab.name,
        number: tab.number,
        columns: ['id', 'title', 'content', 'url', 'active'],
        syncedAt,
        rowCount: tabRows.length,
        rows: tabRows,
      },
      null,
      2
    );
    const tabCsv = buildCsvForTab(tab.name, kbData);

    await Promise.all([
      uploadSupabaseStorageObject(
        supabaseUrl,
        secretKey,
        kbBucket,
        `${tab.name}.json`,
        tabJson,
        'application/json; charset=utf-8'
      ),
      uploadSupabaseStorageObject(
        supabaseUrl,
        secretKey,
        kbBucket,
        `${tab.name}.csv`,
        tabCsv,
        'text/csv; charset=utf-8'
      ),
    ]);

    tabsSynced.push(tab.name);
  }

  // 3. Upsert into PostgreSQL table `public.portfolio_knowledge_base` if table exists
  const tableSynced = await tryUpsertPostgresTable(
    supabaseUrl,
    secretKey,
    kbTable,
    flatRecords
  );

  const publicMasterJsonUrl = `${supabaseUrl}/storage/v1/object/public/${kbBucket}/Portfolio_Knowledge_Base.json`;

  // 4. Verify live read-back from Supabase Storage so CI/CD fails fast if public read is broken
  const verifyRes = await fetch(`${publicMasterJsonUrl}?t=${Date.now()}`);
  if (!verifyRes.ok) {
    throw new Error(
      `Supabase sync read-back verification failed (HTTP ${verifyRes.status}) on ${publicMasterJsonUrl}`
    );
  }

  return {
    synced: true,
    supabaseUrl,
    bucketName: kbBucket,
    tableName: kbTable,
    publicMasterJsonUrl,
    tableSynced,
    totalRows: flatRecords.length,
    tabsSynced,
    lastSyncedAt: syncedAt,
    message: tableSynced
      ? `Synced & verified all 7 tabs (${flatRecords.length} rows) in Supabase Postgres table "${kbTable}" and Storage bucket "${kbBucket}".`
      : `Synced & verified all 7 tabs (${flatRecords.length} rows) as JSON & CSV in Supabase Storage bucket "${kbBucket}".`,
  };
}

// Run directly when invoked from CLI (`npm run sync:supabase`)
const isMainModule =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  process.argv[1].includes('sync-knowledge-base-to-supabase');

if (isMainModule) {
  syncKnowledgeBaseToSupabase()
    .then((result) => {
      console.log(`[Supabase KB Sync] ${result.message}`);
    })
    .catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Supabase KB Sync Error] ${msg}`);
      process.exit(1);
    });
}
