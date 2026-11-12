import React, { useState, useEffect, useMemo } from 'react';
import {
  ExternalLink,
  Search,
  AlertTriangle,
  Database,
  Sparkles,
  Table,
  BookOpen,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Download,
  Code2,
  Copy,
  Check,
  RefreshCw,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  MASTER_SPREADSHEET_TITLE,
  PORTFOLIO_SHEETS_SCHEMA,
  PortfolioKnowledgeBaseData,
  SheetTabName,
} from '../data/knowledgeBaseSchema';
import {
  SupabaseSyncMeta,
  getActiveKnowledgeBase,
  subscribeKnowledgeBase,
  verifyAdminPasswordServerSide,
  triggerSupabaseSyncFromAdmin,
  getSupabaseTabPublicUrl,
} from '../services/supabaseKnowledgeBaseService';
import { soundManager } from '../utils/soundEffects';

interface KnowledgeBaseStudioModalProps {
  isOpen: boolean;
  adminToken?: string | null;
  onLock?: () => void;
  onClose: () => void;
}

export const KnowledgeBaseStudioModal: React.FC<KnowledgeBaseStudioModalProps> = ({
  isOpen,
  adminToken: externalAdminToken = null,
  onLock,
  onClose,
}) => {
  // Server-Validated Password Gate State for /admin (No hardcoded password in client bundle)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => Boolean(externalAdminToken));
  const [adminToken, setAdminToken] = useState<string | null>(() => externalAdminToken);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Supabase KB Studio State (7 Official Chatbot RAG Categories)
  const [activeTab, setActiveTab] = useState<SheetTabName>('Projects');
  const [viewMode, setViewMode] = useState<'records' | 'schema' | 'supabase_service'>(
    'records'
  );
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Knowledge base state synced with Supabase
  const [kbState, setKbState] = useState<{
    data: PortfolioKnowledgeBaseData;
    syncMeta: SupabaseSyncMeta;
  }>(() => getActiveKnowledgeBase());

  // Supabase Cloud Sync State
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [syncErrorMsg, setSyncErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubKB = subscribeKnowledgeBase(() => {
      const latest = getActiveKnowledgeBase();
      setKbState({ ...latest });
    });
    return () => {
      unsubKB();
    };
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim() || isVerifyingPassword) return;

    setIsVerifyingPassword(true);
    setPasswordError('');

    try {
      const verifyRes = await verifyAdminPasswordServerSide(passwordInput);
      if (verifyRes.authenticated && verifyRes.token) {
        soundManager.playSelect();
        setAdminToken(verifyRes.token);
        setIsUnlocked(true);
        setPasswordError('');
        setPasswordInput('');
      } else {
        soundManager.playBack();
        setPasswordError(
          verifyRes.error || 'Invalid admin password. Please enter the authorized passcode.'
        );
      }
    } catch {
      soundManager.playBack();
      setPasswordError('Unable to verify password with server. Please try again.');
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const handleLockAdmin = () => {
    soundManager.playBack();
    setIsUnlocked(false);
    setAdminToken(null);
    setPasswordInput('');
    setPasswordError('');
    onLock?.();
  };

  const handleSyncToSupabase = async () => {
    if (!adminToken) {
      setSyncErrorMsg('Admin session expired. Please lock and re-authenticate.');
      return;
    }

    soundManager.playSelect();
    setIsSyncingSupabase(true);
    setSyncErrorMsg(null);
    setSyncStatusMsg(null);

    try {
      const result = await triggerSupabaseSyncFromAdmin(adminToken);
      setSyncStatusMsg(
        `${result.message} Reminder: Please sync your chatbot's index so the updated Supabase records take effect.`
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to sync knowledge base to Supabase.';
      setSyncErrorMsg(message);
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const activeTabSchema = useMemo(
    () => PORTFOLIO_SHEETS_SCHEMA.find((t) => t.name === activeTab)!,
    [activeTab]
  );

  const activeRecords = useMemo(() => {
    const list = kbState.data[activeTab] || [];
    const q = searchFilter.trim().toLowerCase();
    if (!q) return list;
    return list.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [kbState.data, activeTab, searchFilter]);

  const totalRowsCount = useMemo(
    () =>
      PORTFOLIO_SHEETS_SCHEMA.reduce(
        (acc, tab) => acc + (kbState.data[tab.name]?.length || 0),
        0
      ),
    [kbState.data]
  );

  const handleDownloadTabCsv = (tabName: SheetTabName) => {
    soundManager.playSelect();
    const schema = PORTFOLIO_SHEETS_SCHEMA.find((t) => t.name === tabName);
    if (!schema) return;
    const rows = kbState.data[tabName] || [];
    const headers = schema.columns.map((c) => c.key);
    const escapeCell = (val: string) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const csvLines = [
      headers.map(escapeCell).join(','),
      ...rows.map((row) => headers.map((h) => escapeCell(row[h] ?? '')).join(',')),
    ];
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tabName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySnippet = (id: string, text: string) => {
    soundManager.playSelect();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 2000);
  };

  if (!isOpen) return null;

  const bucketName = kbState.syncMeta.bucketName || 'portfolio-knowledge-base';
  const tableName = kbState.syncMeta.tableName || 'portfolio_knowledge_base';

  const supabaseSqlMigrationSnippet = `-- Run once in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.${tableName} (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (
    category IN (
      'Personal_Details', 'Work_Experience', 'Technical_Skills',
      'Projects', 'Articles', 'Social_Links', 'FAQs'
    )
  ),
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.${tableName} ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.${tableName};
CREATE POLICY "Allow public read access"
  ON public.${tableName} FOR SELECT USING (true);`;

  const pythonSupabaseServiceSnippet = `# Read Portfolio_Knowledge_Base directly from Supabase in Python using environment variables
import os
import requests

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_PUBLISHABLE_KEY = os.environ["SUPABASE_PUBLISHABLE_KEY"]

# 1. Read all 7 tabs (Personal_Details, Work_Experience, Technical_Skills, Projects, Articles, Social_Links, FAQs)
master_url = f"{SUPABASE_URL}/storage/v1/object/public/${bucketName}/Portfolio_Knowledge_Base.json"
kb_payload = requests.get(master_url, timeout=10).json()
projects = kb_payload["tabs"]["Projects"]  # PRJ008 (Jira Fixer) is first!

# 2. Or read a single category JSON / CSV directly from Supabase:
tab_json_url = f"{SUPABASE_URL}/storage/v1/object/public/${bucketName}/${activeTab}.json"
tab_rows = requests.get(tab_json_url, timeout=10).json()["rows"]

# 3. Or query the Supabase PostgreSQL REST API directly:
rest_res = requests.get(
    f"{SUPABASE_URL}/rest/v1/${tableName}?category=eq.${activeTab}&active=eq.true&order=sort_order.asc",
    headers={
        "apikey": SUPABASE_PUBLISHABLE_KEY,
        "Authorization": f"Bearer {SUPABASE_PUBLISHABLE_KEY}",
    },
    timeout=10,
)
print(f"Loaded {len(tab_rows)} active rows for ${activeTab} from Supabase")`;

  const nodeSupabaseServiceSnippet = `// Read Portfolio_Knowledge_Base from Supabase in Node.js / TypeScript via process.env
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;

// Option A: Fetch complete 7-tab Knowledge Base JSON from Supabase Storage
export async function fetchPortfolioKBFromSupabase() {
  const res = await fetch(
    \`\${SUPABASE_URL}/storage/v1/object/public/${bucketName}/Portfolio_Knowledge_Base.json\`
  );
  const data = await res.json();
  return data.tabs; // { Personal_Details, Work_Experience, Technical_Skills, Projects, Articles, Social_Links, FAQs }
}

// Option B: Query Supabase PostgREST Table directly
export async function querySupabaseCategory(category = "${activeTab}") {
  const res = await fetch(
    \`\${SUPABASE_URL}/rest/v1/${tableName}?category=eq.\${category}&active=eq.true&order=sort_order.asc\`,
    {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: \`Bearer \${SUPABASE_PUBLISHABLE_KEY}\`,
      },
    }
  );
  return res.json();
}`;

  // STEP 1: ADMIN PASSWORD GATE WHEN VISITING /admin
  if (!isUnlocked) {
    return (
      <div className="min-h-screen w-full bg-[#050B1D] text-[#F5F7FF] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
        {/* Top bar with Back to Portfolio link */}
        <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 z-10">
          <button
            type="button"
            onClick={() => {
              soundManager.playNavigate();
              onClose();
            }}
            className="min-h-[42px] px-4 py-2 rounded-xl border border-[#36C8FF]/40 bg-[#0B1733]/90 hover:bg-[#132854] text-[#F5F7FF] font-mono-tech text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} className="text-[#36C8FF]" />
            <span>Back to Portfolio</span>
          </button>

          <span className="font-mono-tech text-xs text-[#7F90B2]">
            SYS://SUPABASE_KB_ADMIN · /admin
          </span>
        </header>

        {/* Center Password Card */}
        <main className="flex-1 flex items-center justify-center z-10 my-8">
          <div className="w-full max-w-md rounded-2xl border-2 border-[#36C8FF]/45 bg-[#0B1430]/95 p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.75)] space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#38E69B]/15 border border-[#38E69B]/40 flex items-center justify-center text-[#38E69B] shrink-0">
                <Lock size={22} />
              </div>
              <div>
                <span className="font-mono-tech text-[11px] uppercase tracking-widest text-[#38E69B] font-bold block">
                  Restricted Endpoint · /admin
                </span>
                <h1 className="font-display font-bold text-xl text-[#F5F7FF]">
                  Supabase KB Admin Access
                </h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-mono-tech text-[#AAB7D2] leading-relaxed">
              This knowledge base studio (<code className="text-[#36C8FF]">Portfolio_Knowledge_Base</code>) is hidden from public visitors. Enter the administrator password to inspect the 7 Supabase categories (`id`, `title`, `content`, `url`, `active`), trigger live Supabase syncs, and connect your external AI chatbot service.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-password-input"
                  className="block font-mono-tech text-xs font-semibold text-[#CBD5E1] mb-1.5"
                >
                  Administrator Password
                </label>
                <div className="relative">
                  <KeyRound
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#36C8FF] pointer-events-none"
                  />
                  <input
                    id="admin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="Enter admin password..."
                    autoFocus
                    className="w-full min-h-[44px] pl-10 pr-11 py-2.5 rounded-xl bg-[#050B1D] border border-[#4191FF]/40 focus:border-[#38E69B] text-sm font-mono-tech text-[#F5F7FF] placeholder-[#64748B] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#AAB7D2] hover:text-white rounded-lg cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-mono-tech flex items-center gap-2">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifyingPassword}
                className="w-full min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#36C8FF] to-[#3578FF] hover:opacity-95 disabled:opacity-50 text-[#050B1D] font-display font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <ShieldCheck size={17} />
                <span>
                  {isVerifyingPassword ? 'Verifying Credentials...' : 'Unlock Supabase KB Studio'}
                </span>
              </button>
            </form>
          </div>
        </main>

        <footer className="w-full max-w-5xl mx-auto text-center py-2 font-mono-tech text-[11px] text-[#7F90B2]">
          PROTECTED ROUTE · SURAJ YADAV PORTFOLIO ADMIN
        </footer>
      </div>
    );
  }

  // STEP 2: UNLOCKED SUPABASE KB STUDIO
  return (
    <div className="min-h-screen w-full bg-[#050B1D] text-[#10283F] dark:text-[#F5F7FF] flex flex-col">
      <div className="w-full flex-1 bg-[#F4E9D5] dark:bg-[#0B1430] flex flex-col overflow-hidden relative">
        {/* TOP ADMIN STUDIO HEADER */}
        <div className="bg-[#092A4A] dark:bg-[#081026] text-[#F4E9D5] dark:text-[#F5F7FF] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#061B30] dark:border-[#36C8FF]/25 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#38E69B]/15 border border-[#38E69B]/40 flex items-center justify-center text-[#38E69B] shrink-0">
              <Database size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-bold text-sm sm:text-lg truncate">
                  {MASTER_SPREADSHEET_TITLE}
                </h1>
                <span className="px-2 py-0.5 rounded bg-[#38E69B]/20 text-[#38E69B] font-mono-tech text-[10px] font-bold">
                  SUPABASE CLOUD · 7-TAB RAG SCHEMA
                </span>
                <a
                  href={kbState.syncMeta.publicMasterJsonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 rounded bg-[#36C8FF]/20 text-[#36C8FF] font-mono-tech text-[10px] font-bold inline-flex items-center gap-1 hover:underline"
                >
                  <span>Live on Supabase ({kbState.syncMeta.lastSyncedAt})</span>
                  <ExternalLink size={10} />
                </a>
              </div>
              <p className="font-mono-tech text-[11px] text-[#CBD5E1] truncate">
                Supabase Bucket: {bucketName} · 7 Categories ({totalRowsCount} active rows)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Sync Latest Codebase Data to Live Supabase Button */}
            <button
              type="button"
              onClick={handleSyncToSupabase}
              disabled={isSyncingSupabase}
              className="min-h-[40px] px-3.5 py-1.5 rounded-lg border border-[#38E69B]/55 bg-[#38E69B]/15 hover:bg-[#38E69B]/25 text-[#38E69B] font-mono-tech text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Push all 7 knowledge base categories directly to Supabase"
            >
              <RefreshCw size={14} className={isSyncingSupabase ? 'animate-spin' : ''} />
              <span>{isSyncingSupabase ? 'Syncing Supabase...' : 'Sync to Supabase'}</span>
            </button>

            <button
              type="button"
              onClick={handleLockAdmin}
              className="min-h-[40px] px-3 py-1.5 rounded-lg border border-[#FFBF47]/50 bg-[#FFBF47]/15 hover:bg-[#FFBF47]/25 text-[#FFBF47] font-mono-tech text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock size={14} />
              <span>Lock Admin</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playBack();
                onClose();
              }}
              className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-[#123F68] dark:bg-[#11264A] hover:bg-[#2563EB] text-white font-mono-tech text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Portfolio</span>
            </button>
          </div>
        </div>

        {/* STATUS BANNER IF SYNC SUCCEEDED OR FAILED */}
        {(syncStatusMsg || syncErrorMsg) && (
          <div
            className={`px-4 sm:px-6 py-2.5 text-xs font-mono-tech flex flex-wrap items-center justify-between gap-2 border-b ${
              syncErrorMsg
                ? 'bg-red-500/15 border-red-500/40 text-red-700 dark:text-red-300'
                : 'bg-[#38E69B]/15 border-[#38E69B]/40 text-[#0F5132] dark:text-[#38E69B]'
            }`}
          >
            <div className="flex items-center gap-2">
              {syncErrorMsg ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
              <span>{syncErrorMsg || syncStatusMsg}</span>
              {!syncErrorMsg && (
                <a
                  href={kbState.syncMeta.publicMasterJsonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-bold inline-flex items-center gap-1 ml-2"
                >
                  <span>View Supabase JSON</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setSyncErrorMsg(null);
                setSyncStatusMsg(null);
              }}
              className="opacity-75 hover:opacity-100 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* 7-TAB ARCHITECTURE NAVIGATION STRIP */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-[#C8B79D] dark:border-[#4191FF]/20 bg-[#F4E9D5] dark:bg-[#081229] shrink-0">
          <div
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2"
            role="tablist"
            aria-label="Portfolio_Knowledge_Base 7 Supabase Categories"
          >
            {PORTFOLIO_SHEETS_SCHEMA.map((tab) => {
              const isSelected = activeTab === tab.name;
              const rowCount = (kbState.data[tab.name] || []).length;
              return (
                <button
                  key={tab.name}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    soundManager.playNavigate();
                    setActiveTab(tab.name);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#092A4A] dark:bg-[#11264A] text-[#F4E9D5] dark:text-[#F5F7FF] border-[#061B30] dark:border-[#36C8FF] shadow-xs'
                      : 'bg-[#EADBC3]/60 dark:bg-[#0D1B38]/70 text-[#10283F] dark:text-[#AAB7D2] border-[#C8B79D] dark:border-[#4191FF]/20 hover:border-[#092A4A] dark:hover:border-[#36C8FF]/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`font-mono-tech text-[10px] font-bold ${
                        isSelected ? 'text-[#FFBF47]' : 'text-[#3578FF] dark:text-[#36C8FF]'
                      }`}
                    >
                      {tab.number}
                    </span>
                    <span className="font-mono-tech text-[10px] opacity-80 tabular-nums">
                      {rowCount} rows
                    </span>
                  </div>
                  <div className="font-display font-bold text-xs truncate">{tab.name}</div>
                  <div className="text-[10px] opacity-75 truncate mt-0.5">{tab.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SUB-TOOLBAR: ACTIVE TAB INFO, VIEW SWITCHER & SEARCH */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-[#C8B79D]/70 dark:border-[#4191FF]/20 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs font-bold text-[#3578FF] dark:text-[#36C8FF]">
                Category {activeTabSchema.number}: {activeTabSchema.name}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-xs font-mono-tech opacity-80">
                Columns: id, title, content, url, active
              </span>
            </div>
            <p className="text-xs opacity-80 truncate">{activeTabSchema.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Segmented View Mode Buttons */}
            <div className="inline-flex items-center p-1 rounded-xl bg-[#EADBC3] dark:bg-[#0D1B38] border border-[#C8B79D] dark:border-[#4191FF]/25">
              <button
                type="button"
                onClick={() => setViewMode('records')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'records'
                    ? 'bg-[#092A4A] dark:bg-[#3578FF] text-white'
                    : 'text-[#4B6173] dark:text-[#AAB7D2]'
                }`}
              >
                <Table size={13} />
                <span>Rows ({activeRecords.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('schema')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'schema'
                    ? 'bg-[#092A4A] dark:bg-[#3578FF] text-white'
                    : 'text-[#4B6173] dark:text-[#AAB7D2]'
                }`}
              >
                <BookOpen size={13} />
                <span>Schema &amp; Rules</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('supabase_service')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'supabase_service'
                    ? 'bg-[#092A4A] dark:bg-[#3578FF] text-white'
                    : 'text-[#4B6173] dark:text-[#AAB7D2]'
                }`}
              >
                <Code2 size={13} />
                <span>Supabase Service &amp; SQL</span>
              </button>
            </div>

            {viewMode === 'records' && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search
                    size={13}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none"
                  />
                  <input
                    type="search"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder={`Search ${activeTab}...`}
                    aria-label={`Search records in ${activeTab}`}
                    className="min-h-[36px] pl-7 pr-3 py-1 rounded-xl border border-[#C8B79D] dark:border-[#4191FF]/30 bg-white dark:bg-[#050B1D] text-xs font-mono-tech outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadTabCsv(activeTab)}
                  className="min-h-[36px] px-3 py-1 rounded-xl border border-[#38E69B]/50 bg-[#38E69B]/15 hover:bg-[#38E69B]/25 text-[#1B683B] dark:text-[#38E69B] text-xs font-mono-tech font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  title={`Download ${activeTab}.csv`}
                >
                  <Download size={13} />
                  <span>CSV</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MAIN SCROLLABLE WORKSPACE AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* VIEW 1: RECORDS TABLE */}
          {viewMode === 'records' && (
            <div className="rounded-xl border border-[#C8B79D] dark:border-[#4191FF]/25 overflow-x-auto bg-white dark:bg-[#081228]">
              <table className="w-full text-left border-collapse text-xs font-mono-tech">
                <thead>
                  <tr className="bg-[#EADBC3] dark:bg-[#11264A] border-b border-[#C8B79D] dark:border-[#4191FF]/30">
                    {activeTabSchema.columns.map((col) => (
                      <th
                        key={col.key}
                        className="py-2.5 px-3 font-bold whitespace-nowrap text-[#092A4A] dark:text-[#36C8FF]"
                        title={col.purpose}
                      >
                        <div>{col.key}</div>
                        <div className="text-[10px] font-normal opacity-75">{col.purpose}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C8B79D]/50 dark:divide-[#4191FF]/15">
                  {activeRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={activeTabSchema.columns.length}
                        className="py-8 px-4 text-center opacity-75"
                      >
                        No records found in {activeTabSchema.name}.
                      </td>
                    </tr>
                  ) : (
                    activeRecords.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-[#F4E9D5]/50 dark:hover:bg-[#0D1B38]/80 transition-colors align-top"
                      >
                        {activeTabSchema.columns.map((col) => {
                          const cellVal = row[col.key] || '';
                          return (
                            <td
                              key={col.key}
                              className={`py-2.5 px-3 leading-relaxed ${
                                col.key === 'content'
                                  ? 'min-w-[340px] max-w-[620px]'
                                  : col.key === 'id' || col.key === 'active'
                                  ? 'whitespace-nowrap font-bold'
                                  : 'max-w-[260px] break-words'
                              }`}
                            >
                              {col.key === 'url' &&
                              (cellVal.startsWith('http://') || cellVal.startsWith('https://')) ? (
                                <a
                                  href={cellVal}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#3578FF] dark:text-[#36C8FF] underline inline-flex items-center gap-1 break-all"
                                >
                                  <span>{cellVal}</span>
                                  <ExternalLink size={11} className="shrink-0" />
                                </a>
                              ) : col.key === 'active' ? (
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    String(cellVal).toUpperCase() !== 'FALSE'
                                      ? 'bg-[#38E69B]/20 text-[#1B683B] dark:text-[#38E69B]'
                                      : 'bg-red-500/20 text-red-400'
                                  }`}
                                >
                                  {cellVal || 'TRUE'}
                                </span>
                              ) : (
                                cellVal || <span className="opacity-35">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW 2: SUPABASE KNOWLEDGE BASE RULES & SCHEMA */}
          {viewMode === 'schema' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#C8B79D] dark:border-[#4191FF]/30 bg-white dark:bg-[#0D1B38] p-5">
                <h3 className="font-display font-bold text-base mb-1">
                  Category {activeTabSchema.number}: {activeTabSchema.name} — Column Specification
                </h3>
                <p className="text-xs opacity-80 mb-4">{activeTabSchema.description}</p>
                <div className="divide-y divide-[#C8B79D]/50 dark:divide-[#4191FF]/20 text-xs font-mono-tech">
                  {activeTabSchema.columns.map((col, idx) => (
                    <div key={col.key} className="py-2.5 flex items-center justify-between gap-4">
                      <span className="font-bold text-[#092A4A] dark:text-[#36C8FF]">
                        {String(idx + 1).padStart(2, '0')}. {col.key}
                      </span>
                      <span className="opacity-85 text-right">{col.purpose}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#C8B79D] dark:border-[#4191FF]/30 bg-[#EADBC3]/40 dark:bg-[#081228] p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base mb-2 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#38E69B]" />
                    <span>Supabase Knowledge Base Rules</span>
                  </h3>
                  <ul className="space-y-2.5 text-xs leading-relaxed font-mono-tech">
                    <li>
                      • <strong>7 Fixed Categories Only:</strong>{' '}
                      <code>Personal_Details</code>, <code>Work_Experience</code>,{' '}
                      <code>Technical_Skills</code>, <code>Projects</code>, <code>Articles</code>,{' '}
                      <code>Social_Links</code>, and <code>FAQs</code>.
                    </li>
                    <li>
                      • <strong>Stable IDs &amp; Verbatim Content:</strong> Every row has a unique,
                      stable <code>id</code> (never reused or changed) and a <code>content</code>{' '}
                      cell written as a complete, standalone fact used verbatim by the AI chatbot.
                    </li>
                    <li>
                      • <strong>Source Citations:</strong> <code>title</code> and <code>url</code>{' '}
                      are shown as the source citation in chatbot responses.
                    </li>
                    <li>
                      • <strong>Retiring Facts (No Row Deletion):</strong> Set{' '}
                      <code>active = FALSE</code> instead of deleting a row.
                    </li>
                    <li>
                      • <strong>Latest Projects First:</strong> <code>Projects</code> is ordered
                      newest-first with <code>PRJ008 (Jira Fixer)</code> at the top.
                    </li>
                  </ul>
                </div>

                <div className="mt-5 pt-4 border-t border-[#C8B79D] dark:border-[#4191FF]/20 text-xs font-mono-tech">
                  Supabase Bucket: <strong className="text-[#257336] dark:text-[#38E69B]">{bucketName}</strong>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: SUPABASE STORAGE, SQL SCHEMA & EXTERNAL CODEBASE SERVICE */}
          {viewMode === 'supabase_service' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Card: Live Supabase Endpoints & SQL Table Setup */}
              <div className="rounded-2xl border border-[#C8B79D] dark:border-[#4191FF]/30 bg-white dark:bg-[#0D1B38] p-5 space-y-4">
                <div>
                  <span className="font-mono-tech text-[11px] uppercase tracking-wider text-[#257336] dark:text-[#38E69B] font-bold">
                    1 · Live Supabase Storage &amp; PostgREST Endpoints
                  </span>
                  <h3 className="font-display font-bold text-base mt-0.5">
                    Connected to Supabase Cloud
                  </h3>
                  <p className="text-xs opacity-80 mt-1 leading-relaxed">
                    All 7 categories (<code>Personal_Details</code>, <code>Work_Experience</code>,{' '}
                    <code>Technical_Skills</code>, <code>Projects</code>, <code>Articles</code>,{' '}
                    <code>Social_Links</code>, <code>FAQs</code>) are stored directly in your
                    Supabase project and automatically synced on every build/merge.
                  </p>
                </div>

                {/* Live Supabase URLs for Active Category */}
                <div className="p-3.5 rounded-xl bg-[#EADBC3]/50 dark:bg-[#050B1D] border border-[#C8B79D] dark:border-[#4191FF]/25 space-y-2.5 text-xs font-mono-tech">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#3578FF] dark:text-[#36C8FF]">
                      Master 7-Tab JSON (Supabase):
                    </span>
                    <a
                      href={kbState.syncMeta.publicMasterJsonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#257336] dark:text-[#38E69B] underline inline-flex items-center gap-1"
                    >
                      <span>Open Live JSON</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                  <div className="text-[11px] break-all opacity-85">
                    {kbState.syncMeta.publicMasterJsonUrl}
                  </div>

                  <div className="pt-2 border-t border-[#C8B79D]/60 dark:border-[#4191FF]/20 flex items-center justify-between gap-2">
                    <span className="font-bold text-[#3578FF] dark:text-[#36C8FF]">
                      {activeTab} JSON / CSV in Supabase:
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={getSupabaseTabPublicUrl(activeTab, 'json')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[#36C8FF]"
                      >
                        {activeTab}.json
                      </a>
                      <span>·</span>
                      <a
                        href={getSupabaseTabPublicUrl(activeTab, 'csv')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[#38E69B]"
                      >
                        {activeTab}.csv
                      </a>
                    </div>
                  </div>
                </div>

                {/* SQL Schema Migration Block */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-xs font-bold">
                      Supabase PostgreSQL Table Schema (<code>supabase/schema.sql</code>)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopySnippet('supabase_sql_schema', supabaseSqlMigrationSnippet)
                      }
                      className="px-2.5 py-1 rounded bg-[#092A4A] text-white text-[11px] font-mono-tech inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === 'supabase_sql_schema' ? (
                        <>
                          <Check size={12} />
                          <span>Copied SQL</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy SQL</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="rounded-xl bg-[#071829] text-[#E2E8F0] p-3.5 font-mono-tech text-[11px] overflow-x-auto leading-relaxed border border-[#16385B]">
                    {supabaseSqlMigrationSnippet}
                  </pre>
                </div>
              </div>

              {/* Right Card: How to Read from Another Codebase as a Service */}
              <div className="rounded-2xl border border-[#C8B79D] dark:border-[#4191FF]/30 bg-white dark:bg-[#0D1B38] p-5 space-y-4">
                <div>
                  <span className="font-mono-tech text-[11px] uppercase tracking-wider text-[#3578FF] dark:text-[#36C8FF] font-bold">
                    2 · Connect Your External Codebase to Supabase
                  </span>
                  <h3 className="font-display font-bold text-base mt-0.5">
                    Read {MASTER_SPREADSHEET_TITLE} in Python or Node.js
                  </h3>
                  <p className="text-xs opacity-80 mt-1 leading-relaxed">
                    Configure <code>SUPABASE_URL</code> and <code>SUPABASE_PUBLISHABLE_KEY</code> in
                    your external service&apos;s environment variables to read all 7 categories or
                    query active rows.
                  </p>
                </div>

                {/* Python Snippet */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-xs font-bold">
                      Python Service (FastAPI / LangGraph / RAG Indexer)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopySnippet('python_supabase', pythonSupabaseServiceSnippet)
                      }
                      className="px-2.5 py-1 rounded bg-[#092A4A] text-white text-[11px] font-mono-tech inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === 'python_supabase' ? (
                        <>
                          <Check size={12} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy Python</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="rounded-xl bg-[#071829] text-[#E2E8F0] p-3.5 font-mono-tech text-[11px] overflow-x-auto leading-relaxed border border-[#16385B]">
                    {pythonSupabaseServiceSnippet}
                  </pre>
                </div>

                {/* Node.js / TypeScript Snippet */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-xs font-bold">
                      Node.js / TypeScript Service
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopySnippet('node_supabase', nodeSupabaseServiceSnippet)}
                      className="px-2.5 py-1 rounded bg-[#092A4A] text-white text-[11px] font-mono-tech inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === 'node_supabase' ? (
                        <>
                          <Check size={12} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy TS/JS</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="rounded-xl bg-[#071829] text-[#E2E8F0] p-3.5 font-mono-tech text-[11px] overflow-x-auto leading-relaxed border border-[#16385B]">
                    {nodeSupabaseServiceSnippet}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
