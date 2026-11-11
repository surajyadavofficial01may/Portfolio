import React, { useState, useEffect, useMemo } from 'react';
import {
  ExternalLink,
  Search,
  AlertTriangle,
  FileSpreadsheet,
  Sparkles,
  Table,
  BookOpen,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';
import {
  MASTER_SPREADSHEET_TITLE,
  PORTFOLIO_SHEETS_SCHEMA,
  PortfolioKnowledgeBaseData,
  SheetTabName,
  retrieveKnowledgeForQuery,
} from '../data/knowledgeBaseSchema';
import {
  SpreadsheetSyncMeta,
  getActiveKnowledgeBase,
  subscribeKnowledgeBase,
} from '../services/portfolioSheetsService';
import { soundManager } from '../utils/soundEffects';

interface KnowledgeBaseStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
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

  // Knowledge base state
  const [kbState, setKbState] = useState<{
    data: PortfolioKnowledgeBaseData;
    syncMeta: SpreadsheetSyncMeta | null;
  }>(() => getActiveKnowledgeBase());

  // RAG Sandbox state
  const [ragTestQuery, setRagTestQuery] = useState(
    'What is EVEE and which AI models has Suraj integrated?'
  );

  useEffect(() => {
    const unsubKB = subscribeKnowledgeBase(() => {
      const latest = getActiveKnowledgeBase();
      setKbState({ ...latest });
    });

    return () => {
      unsubKB();
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
              This knowledge base studio (<code className="text-[#36C8FF]">Portfolio_Knowledge_Base</code>) is hidden from public visitors. Enter the administrator password to view the 8-tab Google Sheets records, schema dictionary, and RAG retrieval preview.
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

  // STEP 2: UNLOCKED READ-ONLY SHEETS KB STUDIO (NO SIGN-IN OR MUTATION BAR)
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
                8-Tab Structured Knowledge Base &amp; RAG Source for Suraj&apos;s AI Assistant
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

        {/* SUB-TOOLBAR: ACTIVE TAB INFO, VIEW SWITCHER & SEARCH */}
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
                  Master Source: <strong className="text-[#257336] dark:text-[#38E69B]">{MASTER_SPREADSHEET_TITLE}</strong> (8-Tab Read-Only View)
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
      </div>
    </div>
  );
};
