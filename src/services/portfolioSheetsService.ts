import {
  MASTER_SPREADSHEET_TITLE,
  PORTFOLIO_SHEETS_SCHEMA,
  DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
  PortfolioKnowledgeBaseData,
  SheetTabName,
  SheetRecord,
} from '../data/knowledgeBaseSchema';

export interface DriveSpreadsheetFile {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface SpreadsheetSyncMeta {
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  availableTabs: string[];
  lastSyncedAt: string;
}

// In-memory shared store for the active Knowledge Base data & metadata
let currentKBData: PortfolioKnowledgeBaseData = structuredClone(DEFAULT_PORTFOLIO_KNOWLEDGE_BASE);
let currentSyncMeta: SpreadsheetSyncMeta | null = null;
const listeners = new Set<() => void>();

export function getActiveKnowledgeBase(): {
  data: PortfolioKnowledgeBaseData;
  syncMeta: SpreadsheetSyncMeta | null;
} {
  return { data: currentKBData, syncMeta: currentSyncMeta };
}

export function setActiveKnowledgeBase(
  data: PortfolioKnowledgeBaseData,
  syncMeta: SpreadsheetSyncMeta | null
) {
  currentKBData = data;
  currentSyncMeta = syncMeta;
  listeners.forEach((fn) => fn());
}

export function subscribeKnowledgeBase(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Search Google Drive for spreadsheets (prioritizing Portfolio_Knowledge_Base)
 */
export async function listDriveSpreadsheets(
  accessToken: string
): Promise<DriveSpreadsheetFile[]> {
  const q = encodeURIComponent(
    "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false"
  );
  const fields = encodeURIComponent('files(id,name,modifiedTime,webViewLink)');
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&orderBy=modifiedTime desc&pageSize=25`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Google Drive API error (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  const files: DriveSpreadsheetFile[] = Array.isArray(data.files) ? data.files : [];

  // Sort so Portfolio_Knowledge_Base appears first if present
  return files.sort((a, b) => {
    const aIsMaster = a.name.toLowerCase() === MASTER_SPREADSHEET_TITLE.toLowerCase() ? -1 : 0;
    const bIsMaster = b.name.toLowerCase() === MASTER_SPREADSHEET_TITLE.toLowerCase() ? -1 : 0;
    return aIsMaster - bIsMaster;
  });
}

/**
 * Fetch spreadsheet metadata first to identify actual tab names, then batchGet values
 * and convert into PortfolioKnowledgeBaseData.
 */
export async function loadSpreadsheetFromGoogleSheets(
  accessToken: string,
  spreadsheetId: string
): Promise<{
  kbData: PortfolioKnowledgeBaseData;
  meta: SpreadsheetSyncMeta;
}> {
  // 1. Fetch spreadsheet metadata to inspect existing sheet tabs dynamically
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!metaRes.ok) {
    const errText = await metaRes.text();
    throw new Error(`Failed to read spreadsheet metadata (${metaRes.status}): ${errText}`);
  }

  const metaJson = await metaRes.json();
  const spreadsheetTitle: string = metaJson.properties?.title || MASTER_SPREADSHEET_TITLE;
  const spreadsheetUrl: string =
    metaJson.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  const existingTabTitles: string[] = (metaJson.sheets || [])
    .map((s: { properties?: { title?: string } }) => s.properties?.title)
    .filter((t: string | undefined): t is string => Boolean(t));

  // 2. Build ranges for any of the 8 schema tabs that exist in this spreadsheet
  const matchingTabs = PORTFOLIO_SHEETS_SCHEMA.filter((schemaTab) =>
    existingTabTitles.some((t) => t.toLowerCase() === schemaTab.name.toLowerCase())
  );

  const kbData: PortfolioKnowledgeBaseData = {
    Personal_Details: [],
    Work_Experience: [],
    Tech_Knowledge: [],
    Projects: [],
    Articles: [],
    Social_Media: [],
    Knowledge_Base: [],
    Chatbot_FAQ: [],
  };

  if (matchingTabs.length > 0) {
    const rangesQuery = matchingTabs
      .map((schemaTab) => {
        const actualName =
          existingTabTitles.find((t) => t.toLowerCase() === schemaTab.name.toLowerCase()) ||
          schemaTab.name;
        return `ranges=${encodeURIComponent(`'${actualName}'!A1:Z500`)}`;
      })
      .join('&');

    const valuesRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
        spreadsheetId
      )}/values:batchGet?${rangesQuery}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (valuesRes.ok) {
      const valuesJson = await valuesRes.json();
      const valueRanges: Array<{ range?: string; values?: string[][] }> =
        valuesJson.valueRanges || [];

      valueRanges.forEach((vr, index) => {
        const schemaTab = matchingTabs[index];
        if (!schemaTab) return;
        const rows = vr.values || [];
        if (rows.length < 2) {
          kbData[schemaTab.name] = [];
          return;
        }

        const headerRow = rows[0].map((h) => String(h || '').trim());
        const records: SheetRecord[] = [];

        for (let r = 1; r < rows.length; r++) {
          const rowCells = rows[r];
          if (!rowCells || rowCells.every((c) => !String(c || '').trim())) continue;
          const record: SheetRecord = {};
          schemaTab.columns.forEach((col, colIdx) => {
            const headerIndex = headerRow.findIndex(
              (h) => h.toLowerCase() === col.key.toLowerCase()
            );
            const cellIndex = headerIndex >= 0 ? headerIndex : colIdx;
            record[col.key] = rowCells[cellIndex] !== undefined ? String(rowCells[cellIndex]) : '';
          });
          records.push(record);
        }

        kbData[schemaTab.name] = records;
      });
    }
  }

  const meta: SpreadsheetSyncMeta = {
    spreadsheetId,
    spreadsheetTitle,
    spreadsheetUrl,
    availableTabs: existingTabTitles,
    lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  setActiveKnowledgeBase(kbData, meta);
  return { kbData, meta };
}

/**
 * Create a brand-new `Portfolio_Knowledge_Base` spreadsheet in Google Drive with all 8 tabs
 * and seed it with the structured headers + initial portfolio rows.
 */
export async function createAndSeedMasterSpreadsheet(
  accessToken: string,
  seedData: PortfolioKnowledgeBaseData = DEFAULT_PORTFOLIO_KNOWLEDGE_BASE
): Promise<{
  kbData: PortfolioKnowledgeBaseData;
  meta: SpreadsheetSyncMeta;
}> {
  // 1. Create the spreadsheet with all 8 sheets
  const createPayload = {
    properties: {
      title: MASTER_SPREADSHEET_TITLE,
    },
    sheets: PORTFOLIO_SHEETS_SCHEMA.map((tab, index) => ({
      properties: {
        title: tab.name,
        index,
        gridProperties: {
          frozenRowCount: 1,
        },
      },
    })),
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPayload),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Failed to create spreadsheet (${createRes.status}): ${errText}`);
  }

  const createdJson = await createRes.json();
  const spreadsheetId: string = createdJson.spreadsheetId;
  const spreadsheetUrl: string =
    createdJson.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. Write headers and seed records into all 8 tabs using values:batchUpdate
  const dataPayload = PORTFOLIO_SHEETS_SCHEMA.map((tab) => {
    const headers = tab.columns.map((c) => c.key);
    const records = seedData[tab.name] || [];
    const rows = records.map((rec) => tab.columns.map((c) => rec[c.key] ?? ''));
    return {
      range: `'${tab.name}'!A1`,
      majorDimension: 'ROWS',
      values: [headers, ...rows],
    };
  });

  const batchRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: dataPayload,
      }),
    }
  );

  if (!batchRes.ok) {
    const errText = await batchRes.text();
    throw new Error(`Failed to populate spreadsheet tabs (${batchRes.status}): ${errText}`);
  }

  const meta: SpreadsheetSyncMeta = {
    spreadsheetId,
    spreadsheetTitle: MASTER_SPREADSHEET_TITLE,
    spreadsheetUrl,
    availableTabs: PORTFOLIO_SHEETS_SCHEMA.map((t) => t.name),
    lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const cloned = structuredClone(seedData);
  setActiveKnowledgeBase(cloned, meta);
  return { kbData: cloned, meta };
}

/**
 * Ensure all 8 tabs exist in an existing spreadsheet and write/overwrite the full dataset
 */
export async function syncFullKnowledgeBaseToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  kbData: PortfolioKnowledgeBaseData
): Promise<SpreadsheetSyncMeta> {
  // 1. Inspect existing tabs
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (!metaRes.ok) {
    throw new Error(`Could not inspect spreadsheet (${metaRes.status})`);
  }
  const metaJson = await metaRes.json();
  const existingTabs: string[] = (metaJson.sheets || [])
    .map((s: { properties?: { title?: string } }) => s.properties?.title)
    .filter(Boolean);

  // 2. Add any missing tabs among the 8 required sheets
  const missingTabs = PORTFOLIO_SHEETS_SCHEMA.filter(
    (tab) => !existingTabs.some((t) => t.toLowerCase() === tab.name.toLowerCase())
  );

  if (missingTabs.length > 0) {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
        spreadsheetId
      )}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: missingTabs.map((tab) => ({
            addSheet: {
              properties: {
                title: tab.name,
                gridProperties: { frozenRowCount: 1 },
              },
            },
          })),
        }),
      }
    );
  }

  // 3. Batch update all 8 tabs with headers + rows
  const dataPayload = PORTFOLIO_SHEETS_SCHEMA.map((tab) => {
    const headers = tab.columns.map((c) => c.key);
    const records = kbData[tab.name] || [];
    const rows = records.map((rec) => tab.columns.map((c) => rec[c.key] ?? ''));
    return {
      range: `'${tab.name}'!A1`,
      majorDimension: 'ROWS',
      values: [headers, ...rows],
    };
  });

  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: dataPayload,
      }),
    }
  );

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`Failed to write data to Google Sheets (${updateRes.status}): ${errText}`);
  }

  const updatedMeta: SpreadsheetSyncMeta = {
    spreadsheetId,
    spreadsheetTitle: metaJson.properties?.title || MASTER_SPREADSHEET_TITLE,
    spreadsheetUrl:
      metaJson.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    availableTabs: PORTFOLIO_SHEETS_SCHEMA.map((t) => t.name),
    lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  setActiveKnowledgeBase(structuredClone(kbData), updatedMeta);
  return updatedMeta;
}

/**
 * Append a single record to a specific sheet tab in Google Sheets
 */
export async function appendRecordToGoogleSheet(
  accessToken: string,
  spreadsheetId: string,
  tabName: SheetTabName,
  newRecord: SheetRecord
): Promise<void> {
  const schemaTab = PORTFOLIO_SHEETS_SCHEMA.find((t) => t.name === tabName);
  if (!schemaTab) throw new Error(`Unknown sheet tab: ${tabName}`);

  const rowValues = schemaTab.columns.map((col) => newRecord[col.key] ?? '');

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/${encodeURIComponent(`'${tabName}'!A1`)}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        majorDimension: 'ROWS',
        values: [rowValues],
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to append row to ${tabName} (${res.status}): ${errText}`);
  }

  // Update in-memory store
  const nextData = structuredClone(currentKBData);
  nextData[tabName] = [...(nextData[tabName] || []), newRecord];
  if (currentSyncMeta) {
    currentSyncMeta = {
      ...currentSyncMeta,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
  setActiveKnowledgeBase(nextData, currentSyncMeta);
}
