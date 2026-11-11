/**
 * Automated Build & CI/CD Sync Script for Portfolio_Knowledge_Base -> Supabase
 */
import {
  DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
  MASTER_SPREADSHEET_TITLE,
  PORTFOLIO_SHEETS_SCHEMA,
  type PortfolioKnowledgeBaseData,
  type SheetTabName,
} from '../src/data/knowledgeBaseSchema.ts';
import { getServerConfig, validateSupabaseSyncConfig } from '../src/config/env.ts';

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

  const tableSynced = await tryUpsertPostgresTable(
    supabaseUrl,
    secretKey,
    kbTable,
    flatRecords
  );

  const publicMasterJsonUrl = `${supabaseUrl}/storage/v1/object/public/${kbBucket}/Portfolio_Knowledge_Base.json`;

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

const isMainModule =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  process.argv[1].includes('sync-knowledge-base-to-supabase');

if (isMainModule) {
  const isStrictCli = process.argv.includes('--strict');
  const cfg = getServerConfig();

  // During Cloud Build (`npm run build`), `.env` is gitignored and may not be present in the container build phase.
  // Skip build-time remote sync gracefully unless `--strict` is passed (e.g. in GitHub Actions).
  if (!isStrictCli && (!cfg.supabase.url || !cfg.supabase.secretKey)) {
    console.log(
      '[Supabase KB Sync] Skipping build-time remote sync (SUPABASE_URL / SUPABASE_SECRET_KEY not present in container build environment; using bundled 7-tab schema).'
    );
    process.exit(0);
  }

  syncKnowledgeBaseToSupabase()
    .then((result) => {
      console.log(`[Supabase KB Sync] ${result.message}`);
    })
    .catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      if (isStrictCli) {
        console.error(`[Supabase KB Sync Error] ${msg}`);
        process.exit(1);
      } else {
        console.warn(`[Supabase KB Sync Warning] ${msg}`);
        process.exit(0);
      }
    });
}
