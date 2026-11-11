import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  RefreshCw,
  Plus,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Sparkles,
  LogOut,
  Table,
  BookOpen,
  ShieldCheck,
  Send,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  MASTER_SPREADSHEET_TITLE,
  PORTFOLIO_SHEETS_SCHEMA,
  DEFAULT_PORTFOLIO_KNOWLEDGE_BASE,
  PortfolioKnowledgeBaseData,
  SheetTabName,
  SheetRecord,
  retrieveKnowledgeForQuery,
} from '../data/knowledgeBaseSchema';
import {
  initAuth,
  googleSignIn,
  getAccessToken,
  getCurrentUser,
  logout,
} from '../services/googleSheetsAuth';
import {
  DriveSpreadsheetFile,
  SpreadsheetSyncMeta,
  getActiveKnowledgeBase,
  subscribeKnowledgeBase,
  listDriveSpreadsheets,
  loadSpreadsheetFromGoogleSheets,
  createAndSeedMasterSpreadsheet,
  syncFullKnowledgeBaseToSpreadsheet,
} from '../services/portfolioSheetsService';
import { soundManager } from '../utils/soundEffects';

interface KnowledgeBaseStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PendingMutation {
  type: 'create_master' | 'sync_all';
  title: string;
  description: string;
  details: string[];
  onConfirm: () => Promise<void>;
}

const ADMIN_PASSCODE = 'Suraj123';

export const KnowledgeBaseStudioModal: React.FC<KnowledgeBaseStudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Password Gate State for /admin
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Sheets KB Studio State
  const [activeTab, setActiveTab] = useState<SheetTabName>('Knowledge_Base');
  const [viewMode, setViewMode] = useState<'records' | 'schema' | 'rag_tester'>('records');
  const [searchFilter, setSearchFilter] = useState('');

  // Google Workspace Auth state
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Knowledge base & Google Sheets sync state
  const [kbState, setKbState] = useState<{
    data: PortfolioKnowledgeBaseData;
    syncMeta: SpreadsheetSyncMeta | null;
  }>(() => getActiveKnowledgeBase());

  const [driveFiles, setDriveFiles] = useState<DriveSpreadsheetFile[]>([]);
  const [selectedSpreadsheetId, setSelectedSpreadsheetId] = useState<string>('');
  const [isBusy, setIsBusy] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Mandatory User Confirmation Dialog state for mutating Google Sheets operations
  const [pendingMutation, setPendingMutation] = useState<PendingMutation | null>(null);

  // RAG Sandbox state
  const [ragTestQuery, setRagTestQuery] = useState(
    'What is EVEE and which AI models has Suraj integrated?'
  );

  useEffect(() => {
    const unsubKB = subscribeKnowledgeBase(() => {
      const latest = getActiveKnowledgeBase();
      setKbState({ ...latest });
      if (latest.syncMeta?.spreadsheetId) {
        setSelectedSpreadsheetId(latest.syncMeta.spreadsheetId);
      }
    });

    const unsubAuth = initAuth(
      (authedUser) => {
        setUser(authedUser);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );

    return () => {
      unsubKB();
      unsubAuth();
    };
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSCODE) {
      soundManager.playSelect();
      setIsUnlocked(true);
      setPasswordError('');
      setPasswordInput('');
    } else {
      soundManager.playBack();
      setPasswordError('Invalid admin password. Please enter the authorized passcode.');
    }
  };

  const handleLockAdmin = () => {
    soundManager.playBack();
    setIsUnlocked(false);
    setPasswordInput('');
    setPasswordError('');
  };

  // Discover existing spreadsheets in Google Drive once authenticated
  const refreshDriveFiles = async (tokenToUse?: string) => {
    const token = tokenToUse || (await getAccessToken());
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    setIsBusy(true);
    try {
      const files = await listDriveSpreadsheets(token);
      setDriveFiles(files);
      const masterFile = files.find(
        (f) => f.name.toLowerCase() === MASTER_SPREADSHEET_TITLE.toLowerCase()
      );
      if (masterFile) {
        setSelectedSpreadsheetId(masterFile.id);
        const loaded = await loadSpreadsheetFromGoogleSheets(token, masterFile.id);
        setStatusBanner({
          type: 'success',
          message: `Connected & loaded "${loaded.meta.spreadsheetTitle}" (${loaded.meta.availableTabs.length} tabs) from Google Drive.`,
        });
      } else if (files.length > 0 && !selectedSpreadsheetId) {
        setSelectedSpreadsheetId(files[0].id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to list Google Drive spreadsheets.';
      setStatusBanner({ type: 'error', message: msg });
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    setStatusBanner(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
        await refreshDriveFiles(result.accessToken);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google Sign-In was cancelled or failed.';
      setStatusBanner({ type: 'error', message: msg });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logout();
    setUser(null);
    setNeedsAuth(true);
    setDriveFiles([]);
    setStatusBanner({
      type: 'info',
      message: 'Signed out of Google Workspace. Using local default Knowledge Base records.',
    });
  };

  const handleLoadSelectedSheet = async () => {
    if (!selectedSpreadsheetId) return;
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }
    setIsBusy(true);
    setStatusBanner(null);
    try {
      const loaded = await loadSpreadsheetFromGoogleSheets(token, selectedSpreadsheetId);
      setStatusBanner({
        type: 'success',
        message: `Loaded latest records from "${loaded.meta.spreadsheetTitle}" at ${loaded.meta.lastSyncedAt}.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to read spreadsheet.';
      setStatusBanner({ type: 'error', message: msg });
    } finally {
      setIsBusy(false);
    }
  };

  // Prompt user confirmation before creating & seeding Portfolio_Knowledge_Base in Google Drive
  const requestCreateMasterSpreadsheet = () => {
    const totalRows = Object.values(DEFAULT_PORTFOLIO_KNOWLEDGE_BASE).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
    setPendingMutation({
      type: 'create_master',
      title: `Create "${MASTER_SPREADSHEET_TITLE}" in Google Drive?`,
      description:
        'This will create a new Google Spreadsheet in your Google Drive and populate all 8 recommended tabs with headers and Suraj Yadav’s structured knowledge base records.',
      details: [
        `Spreadsheet Title: ${MASTER_SPREADSHEET_TITLE}`,
        `Tabs Created (8): ${PORTFOLIO_SHEETS_SCHEMA.map((t) => t.name).join(', ')}`,
        `Total Initial Knowledge Records to Write: ${totalRows} rows`,
      ],
      onConfirm: async () => {
        const token = await getAccessToken();
        if (!token) {
          setNeedsAuth(true);
          return;
        }
        setIsBusy(true);
        setStatusBanner(null);
        try {
          const created = await createAndSeedMasterSpreadsheet(
            token,
            DEFAULT_PORTFOLIO_KNOWLEDGE_BASE
          );
          const files = await listDriveSpreadsheets(token);
          setDriveFiles(files);
          setSelectedSpreadsheetId(created.meta.spreadsheetId);
          setStatusBanner({
            type: 'success',
            message: `Created & seeded "${created.meta.spreadsheetTitle}" with all 8 tabs in your Google Drive!`,
          });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Failed to create spreadsheet.';
          setStatusBanner({ type: 'error', message: msg });
        } finally {
          setIsBusy(false);
        }
      },
    });
  };

  // Prompt user confirmation before overwriting/syncing all 8 tabs to the selected spreadsheet
  const requestSyncAllToSpreadsheet = () => {
    if (!selectedSpreadsheetId) return;
    const targetFile = driveFiles.find((f) => f.id === selectedSpreadsheetId);
    const totalRows = (Object.values(kbState.data) as SheetRecord[][]).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
    setPendingMutation({
      type: 'sync_all',
      title: `Update "${targetFile?.name || MASTER_SPREADSHEET_TITLE}" in Google Sheets?`,
      description:
        'This will ensure all 8 knowledge base tabs exist and update their headers and rows in your selected Google Spreadsheet.',
      details: [
        `Target Spreadsheet: ${targetFile?.name || selectedSpreadsheetId}`,
        `Affected Tabs (8): ${PORTFOLIO_SHEETS_SCHEMA.map((t) => t.name).join(', ')}`,
        `Total Rows to Write: ${totalRows} rows`,
      ],
      onConfirm: async () => {
        const token = await getAccessToken();
        if (!token) {
          setNeedsAuth(true);
          return;
        }
        setIsBusy(true);
        setStatusBanner(null);
        try {
          const meta = await syncFullKnowledgeBaseToSpreadsheet(
            token,
            selectedSpreadsheetId,
            kbState.data
          );
          setStatusBanner({
            type: 'success',
            message: `Synchronized all 8 tabs to "${meta.spreadsheetTitle}" at ${meta.lastSyncedAt}.`,
          });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Failed to sync spreadsheet.';
          setStatusBanner({ type: 'error', message: msg });
        } finally {
          setIsBusy(false);
        }
      },
    });
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

  const ragPreviewOutput = useMemo(
    () => retrieveKnowledgeForQuery(ragTestQuery, kbState.data, 5),
    [ragTestQuery, kbState.data]
  );

  if (!isOpen) return null;

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
            SYS://ADMIN_GATEWAY · /admin
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
                  Sheets KB Admin Access
                </h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-mono-tech text-[#AAB7D2] leading-relaxed">
              This knowledge base studio (<code className="text-[#36C8FF]">Portfolio_Knowledge_Base</code>) is hidden from public visitors. Enter the administrator password to view the 8-tab Google Sheets records, schema dictionary, and RAG sync controls.
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
                className="w-full min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#36C8FF] to-[#3578FF] hover:opacity-95 text-[#050B1D] font-display font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <ShieldCheck size={17} />
                <span>Unlock Sheets KB Studio</span>
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

  // STEP 2: UNLOCKED SHEETS KB STUDIO (NO ADD DATA / ADD ROW OPTION)
  return (
    <div className="min-h-screen w-full bg-[#050B1D] text-[#10283F] dark:text-[#F5F7FF] flex flex-col">
      <div className="w-full flex-1 bg-[#F4E9D5] dark:bg-[#0B1430] flex flex-col overflow-hidden relative">
        {/* TOP ADMIN STUDIO HEADER */}
        <div className="bg-[#092A4A] dark:bg-[#081026] text-[#F4E9D5] dark:text-[#F5F7FF] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#061B30] dark:border-[#36C8FF]/25 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#38E69B]/15 border border-[#38E69B]/40 flex items-center justify-center text-[#38E69B] shrink-0">
              <FileSpreadsheet size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-sm sm:text-lg truncate">
                  {MASTER_SPREADSHEET_TITLE}
                </h1>
                <span className="px-2 py-0.5 rounded bg-[#38E69B]/20 text-[#38E69B] font-mono-tech text-[10px] font-bold">
                  /admin · UNLOCKED
                </span>
                <span className="font-mono-tech text-[10px] text-[#38E69B] hidden md:inline">
                  Google Spreadsheet · Stored in Google Drive · Master Source
                </span>
              </div>
              <p className="font-mono-tech text-[11px] text-[#CBD5E1] truncate">
                8-Tab Structured Knowledge Base &amp; Live RAG Sync for Suraj&apos;s AI Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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

        {/* GOOGLE WORKSPACE AUTHENTICATION & DRIVE CONNECTION BAR */}
        <div className="px-4 sm:px-6 py-3 bg-[#EADBC3]/75 dark:bg-[#0D1B38] border-b border-[#C8B79D] dark:border-[#4191FF]/25 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0">
          {needsAuth ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3">
              <div className="text-xs font-mono-tech text-[#10283F] dark:text-[#AAB7D2]">
                <strong className="text-[#092A4A] dark:text-[#F5F7FF]">
                  Connect Google Drive &amp; Google Sheets:
                </strong>{' '}
                Sign in to create, read, or sync your{' '}
                <code className="font-bold">Portfolio_Knowledge_Base</code> spreadsheet in Google
                Drive.
              </div>

              {/* Official "Sign in with Google" Material Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSigningIn}
                className="gsi-material-button self-start sm:self-auto inline-flex items-center gap-3 px-4 py-2 min-h-[42px] rounded-full bg-white hover:bg-slate-50 text-[#1F1F1F] border border-[#747775] shadow-xs font-sans text-sm font-medium transition-all cursor-pointer shrink-0 disabled:opacity-60"
              >
                <div className="w-5 h-5 shrink-0">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-full h-full block"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                </div>
                <span className="gsi-material-button-contents whitespace-nowrap">
                  {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
                </span>
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between w-full gap-3">
              {/* Connected User & Drive Spreadsheet Selector */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-mono-tech text-[#257336] dark:text-[#38E69B] font-semibold">
                  Connected: {user?.email || user?.displayName || 'Google Workspace'}
                </span>

                <select
                  aria-label="Select Google Drive Spreadsheet"
                  value={selectedSpreadsheetId}
                  onChange={(e) => setSelectedSpreadsheetId(e.target.value)}
                  className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#C8B79D] dark:border-[#4191FF]/40 bg-[#F4E9D5] dark:bg-[#050B1D] text-xs font-mono-tech"
                >
                  <option value="">
                    {driveFiles.length === 0
                      ? 'No spreadsheets found yet — Create Master Sheet'
                      : '-- Select Drive Spreadsheet --'}
                  </option>
                  {driveFiles.map((file) => (
                    <option key={file.id} value={file.id}>
                      {file.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleLoadSelectedSheet}
                  disabled={!selectedSpreadsheetId || isBusy}
                  className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#092A4A] dark:bg-[#3578FF] text-white text-xs font-mono-tech font-semibold inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={13} className={isBusy ? 'animate-spin' : ''} />
                  <span>Load Sheet</span>
                </button>
              </div>

              {/* Create Master / Sync / Open in Sheets / Logout Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={requestCreateMasterSpreadsheet}
                  disabled={isBusy}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#257336] dark:bg-[#38E69B] text-white dark:text-[#050B1D] text-xs font-mono-tech font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Plus size={14} />
                  <span>Create &amp; Seed Master Sheet</span>
                </button>

                {selectedSpreadsheetId && (
                  <button
                    type="button"
                    onClick={requestSyncAllToSpreadsheet}
                    disabled={isBusy}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#092A4A] dark:border-[#36C8FF]/50 text-xs font-mono-tech font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Database size={13} />
                    <span>Sync All 8 Tabs</span>
                  </button>
                )}

                {kbState.syncMeta?.spreadsheetUrl && (
                  <a
                    href={kbState.syncMeta.spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#092A4A]/40 dark:border-[#4191FF]/40 text-xs font-mono-tech inline-flex items-center gap-1.5 hover:underline"
                  >
                    <span>Open in Sheets</span>
                    <ExternalLink size={12} />
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleGoogleLogout}
                  title="Sign out of Google"
                  className="min-h-[38px] px-2.5 py-1.5 rounded-lg border border-[#C85C57]/50 text-[#C85C57] text-xs font-mono-tech inline-flex items-center gap-1 cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* STATUS BANNER */}
        {statusBanner && (
          <div
            className={`px-4 sm:px-6 py-2 text-xs font-mono-tech flex items-center justify-between gap-2 shrink-0 ${
              statusBanner.type === 'success'
                ? 'bg-[#38E69B]/15 text-[#1E6330] dark:text-[#38E69B] border-b border-[#38E69B]/30'
                : statusBanner.type === 'error'
                ? 'bg-red-500/15 text-red-700 dark:text-red-300 border-b border-red-500/30'
                : 'bg-blue-500/15 text-blue-800 dark:text-[#36C8FF] border-b border-blue-500/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusBanner.type === 'success' ? (
                <CheckCircle2 size={14} className="shrink-0" />
              ) : (
                <AlertTriangle size={14} className="shrink-0" />
              )}
              <span>{statusBanner.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 8-TAB ARCHITECTURE NAVIGATION STRIP */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-[#C8B79D] dark:border-[#4191FF]/20 bg-[#F4E9D5] dark:bg-[#081229] shrink-0">
          <div
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2"
            role="tablist"
            aria-label="Portfolio_Knowledge_Base 8 Sheet Tabs"
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

        {/* SUB-TOOLBAR: ACTIVE TAB INFO, VIEW SWITCHER & SEARCH (NO ADD DATA BUTTON) */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-[#C8B79D]/70 dark:border-[#4191FF]/20 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs font-bold text-[#3578FF] dark:text-[#36C8FF]">
                Sheet {activeTabSchema.number}: {activeTabSchema.name}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-xs font-mono-tech opacity-80">
                {activeTabSchema.columns.length} columns
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
                <span>Records ({activeRecords.length})</span>
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
                <span>Column Schema</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('rag_tester')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'rag_tester'
                    ? 'bg-[#092A4A] dark:bg-[#3578FF] text-white'
                    : 'text-[#4B6173] dark:text-[#AAB7D2]'
                }`}
              >
                <Sparkles size={13} />
                <span>RAG Tester</span>
              </button>
            </div>

            {viewMode === 'records' && (
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
                    activeRecords.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="hover:bg-[#F4E9D5]/50 dark:hover:bg-[#0D1B38]/80 transition-colors align-top"
                      >
                        {activeTabSchema.columns.map((col) => {
                          const cellVal = row[col.key] || '';
                          return (
                            <td
                              key={col.key}
                              className="py-2.5 px-3 max-w-[300px] break-words leading-relaxed"
                            >
                              {cellVal.startsWith('http://') || cellVal.startsWith('https://') ? (
                                <a
                                  href={cellVal}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#3578FF] dark:text-[#36C8FF] underline inline-flex items-center gap-1 break-all"
                                >
                                  <span>{cellVal}</span>
                                  <ExternalLink size={11} className="shrink-0" />
                                </a>
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

          {/* VIEW 2: RECOMMENDED COLUMN SCHEMA SPECIFICATION */}
          {viewMode === 'schema' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#C8B79D] dark:border-[#4191FF]/30 bg-white dark:bg-[#0D1B38] p-5">
                <h3 className="font-display font-bold text-base mb-1">
                  Sheet {activeTabSchema.number}: {activeTabSchema.name} — Column Dictionary
                </h3>
                <p className="text-xs opacity-80 mb-4">{activeTabSchema.description}</p>
                <div className="divide-y divide-[#C8B79D]/50 dark:divide-[#4191FF]/20 text-xs font-mono-tech">
                  {activeTabSchema.columns.map((col, idx) => (
                    <div key={col.key} className="py-2 flex items-center justify-between gap-4">
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
                    <span>RAG &amp; Visibility Best Practices</span>
                  </h3>
                  <ul className="space-y-2.5 text-xs leading-relaxed font-mono-tech">
                    <li>
                      • <strong>Conversational Content:</strong> Write complete, natural-language
                      sentences in <code>detailed_bio</code>, <code>description</code>, and{' '}
                      <code>Knowledge_Base.content</code> rather than isolated keyword lists.
                    </li>
                    <li>
                      • <strong>Content Visibility Gate:</strong> Rows with{' '}
                      <code>content_visibility = private</code> are automatically excluded from AI
                      Chatbot RAG context retrieval.
                    </li>
                    <li>
                      • <strong>Cross-Sheet Traceability:</strong> Use <code>related_ids</code>,{' '}
                      <code>source_sheet</code>, and <code>source_id</code> in{' '}
                      <code>Knowledge_Base</code> (`KB001`+) to link back to `PRJ001`, `SK001`, and
                      `EXP001`.
                    </li>
                  </ul>
                </div>

                <div className="mt-5 pt-4 border-t border-[#C8B79D] dark:border-[#4191FF]/20 text-xs font-mono-tech">
                  Connected Status:{' '}
                  {kbState.syncMeta ? (
                    <span className="text-[#257336] dark:text-[#38E69B] font-bold">
                      Synced with {kbState.syncMeta.spreadsheetTitle} ({kbState.syncMeta.lastSyncedAt})
                    </span>
                  ) : (
                    <span>Ready to connect to Google Drive / Sheets</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: INTERACTIVE RAG RETRIEVAL TESTER */}
          {viewMode === 'rag_tester' && (
            <div className="rounded-2xl border border-[#C8B79D] dark:border-[#4191FF]/30 bg-white dark:bg-[#0D1B38] p-5 space-y-4">
              <div>
                <h3 className="font-display font-bold text-base mb-1">
                  Live RAG Knowledge Retrieval Preview
                </h3>
                <p className="text-xs opacity-80">
                  Type any visitor question below to inspect the exact top-ranked records retrieved
                  from your 8 sheets (`Knowledge_Base`, `Chatbot_FAQ`, `Projects`, `Tech_Knowledge`,
                  `Work_Experience`, `Articles`, `Personal_Details`) and passed to the AI Assistant.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={ragTestQuery}
                  onChange={(e) => setRagTestQuery(e.target.value)}
                  placeholder="Ask e.g. What is EVEE? or What was your contribution to VAssureAI?"
                  className="flex-1 min-h-[42px] px-3.5 py-2 rounded-xl border border-[#C8B79D] dark:border-[#4191FF]/35 bg-[#F4E9D5]/40 dark:bg-[#050B1D] text-xs sm:text-sm font-mono-tech"
                />
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'What is EVEE?',
                    'What was your contribution to VAssureAI?',
                    'Which AI models have you integrated?',
                    'Tell me about Suraj',
                  ].map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => setRagTestQuery(sample)}
                      className="px-2.5 py-1.5 rounded-lg border border-[#C8B79D] dark:border-[#4191FF]/30 text-[11px] font-mono-tech hover:border-[#36C8FF] cursor-pointer"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-[#071829] text-[#E2E8F0] p-4 font-mono-tech text-xs whitespace-pre-wrap leading-relaxed border border-[#16385B]">
                {ragPreviewOutput}
              </div>
            </div>
          )}
        </div>

        {/* MANDATORY CONFIRMATION DIALOG FOR MUTATING / DESTRUCTIVE GOOGLE SHEETS OPERATIONS */}
        {pendingMutation && (
          <div
            className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-mutation-title"
          >
            <div className="w-full max-w-md rounded-2xl border-2 border-[#FFBF47] bg-[#0B1430] text-[#F5F7FF] p-6 shadow-2xl space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFBF47]/15 border border-[#FFBF47]/40 flex items-center justify-center text-[#FFBF47] shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 id="confirm-mutation-title" className="font-display font-bold text-base">
                    {pendingMutation.title}
                  </h3>
                  <p className="text-xs text-[#AAB7D2] mt-1 leading-relaxed">
                    {pendingMutation.description}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-[#050B1D] border border-[#4191FF]/25 p-3.5 space-y-1.5 text-xs font-mono-tech text-[#36C8FF]">
                {pendingMutation.details.map((line, i) => (
                  <div key={i}>• {line}</div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingMutation(null)}
                  className="min-h-[40px] px-4 py-2 rounded-xl border border-[#4191FF]/35 text-xs font-semibold text-[#AAB7D2] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const action = pendingMutation.onConfirm;
                    setPendingMutation(null);
                    await action();
                  }}
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-[#38E69B] hover:bg-[#2AD189] text-[#050B1D] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={13} />
                  <span>Confirm &amp; Write to Google Sheets</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
