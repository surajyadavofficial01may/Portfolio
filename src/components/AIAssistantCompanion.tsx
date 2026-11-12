import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Minimize2, Maximize2, MessageSquare, ExternalLink } from 'lucide-react';
import { ChatMessage, ChatHistoryTurn, ChatSourceCitation } from '../types';
import { soundManager } from '../utils/soundEffects';

interface ChatAskSuccessPayload {
  success: true;
  answer: string;
  sources?: ChatSourceCitation[];
  debug?: Record<string, unknown> | null;
}

interface ChatAskErrorDetail {
  field: string;
  message: string;
}

interface ChatAskErrorPayload {
  success: false;
  error: string;
  details?: ChatAskErrorDetail[];
}

type ChatAskPayload = ChatAskSuccessPayload | ChatAskErrorPayload;

/* ------------------------------------------------------------------ */
/* Constants & helpers                                                 */
/* ------------------------------------------------------------------ */

const CHAT_ENDPOINT = '/api/v1/chat/ask';
const WELCOME_TEXT =
  "Hi! I'm Suraj's AI assistant. Ask me about Jira Fixer, EVEE, VAssureAI, or his skills!";
const KB_UNAVAILABLE_TEXT = 'That information is not available in the portfolio knowledge base.';

const MAX_QUESTION_CHARS = 1000;
const MAX_HISTORY_CONTENT_CHARS = 2000;
/** Matches the server-side cap so we never send turns that would be dropped anyway. */
const MAX_HISTORY_TURNS = 10;
/** Server retries for up to ~75 s (Render cold start); give it a little extra. */
const REQUEST_TIMEOUT_MS = 90_000;
/** After this long, tell the visitor the RAG service is probably waking up. */
const SLOW_NOTICE_MS = 6_000;

const createWelcomeMessage = (): ChatMessage => ({
  id: 'msg-0',
  sender: 'bot',
  text: WELCOME_TEXT,
  timestamp: 'NOW',
});

const nowTime = (): string =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

let messageCounter = 0;
const makeId = (prefix: string): string => `${prefix}-${Date.now()}-${++messageCounter}`;

/** Only the delta-seconds form is used by our API; ignore anything else. */
function parseRetryAfter(header: string | null): number | null {
  if (!header) return null;
  const n = Number(header);
  return Number.isFinite(n) && n > 0 ? Math.ceil(n) : null;
}

async function readJsonBody(res: Response): Promise<ChatAskPayload | null> {
  const type = (res.headers.get('content-type') ?? '').toLowerCase();
  if (!type.includes('json')) {
    // Typical cause in dev: the dev server has no proxy for /api and returns index.html or a 404 page.
    console.error(
      `[AIAssistantCompanion] Expected JSON from ${CHAT_ENDPOINT} but got "${type || 'unknown'}" (HTTP ${res.status}). ` +
        'Check that the Express route is mounted and that your dev server proxies /api to it.'
    );
    return null;
  }
  try {
    return (await res.json()) as ChatAskPayload;
  } catch {
    return null;
  }
}

function buildErrorText(
  status: number,
  payload: ChatAskPayload | null,
  retryAfter: number | null
): string {
  const apiError =
    payload && payload.success === false && payload.error ? payload.error : undefined;

  if (status === 422 || status === 400) {
    const details =
      payload && payload.success === false && Array.isArray(payload.details)
        ? payload.details.map((d) => `${d.field}: ${d.message}`).join('; ')
        : '';
    const base = apiError || 'Your question could not be processed.';
    return details ? `${base} (${details})` : base;
  }
  if (status === 429) {
    return `Too many questions right now. Please wait ${retryAfter ? `${retryAfter}s` : 'a moment'} and try again.`;
  }
  if (status >= 500) {
    return `The assistant is temporarily unavailable (the knowledge service may be waking up). Please try again ${
      retryAfter ? `in about ${retryAfter}s` : 'shortly'
    }.`;
  }
  return apiError || 'Unable to process your question right now.';
}

/**
 * Renders inline Markdown bold (`**text**`) and `[n]` source citations mapped to `sources[n - 1]`.
 */
function renderFormattedSegment(
  text: string,
  sources: ChatSourceCitation[] | undefined,
  keyPrefix: string
): React.ReactNode[] {
  // Split by [n] citations and **bold** markers
  const tokens = text.split(/(\[\d+\]|\*\*[^*]+\*\*)/g);
  return tokens.map((token, idx) => {
    const citeMatch = /^\[(\d+)\]$/.exec(token);
    if (citeMatch && sources) {
      const sourceIdx = Number(citeMatch[1]) - 1;
      const citedSource = sources[sourceIdx];
      if (citedSource) {
        return citedSource.url ? (
          <a
            key={`${keyPrefix}-cite-${idx}`}
            href={citedSource.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${citedSource.category}: ${citedSource.title}`}
            className="inline-flex items-center px-1 mx-0.5 rounded bg-[#123F68] text-[#5FD182] hover:underline font-bold text-[10px]"
          >
            {token}
          </a>
        ) : (
          <span
            key={`${keyPrefix}-cite-${idx}`}
            title={`${citedSource.category}: ${citedSource.title}`}
            className="inline-flex items-center px-1 mx-0.5 rounded bg-[#123F68] text-[#5FD182] font-bold text-[10px]"
          >
            {token}
          </span>
        );
      }
    }

    const boldMatch = /^\*\*([^*]+)\*\*$/.exec(token);
    if (boldMatch) {
      return (
        <strong key={`${keyPrefix}-bold-${idx}`} className="text-[#F4E9D5] font-bold">
          {boldMatch[1]}
        </strong>
      );
    }

    return <React.Fragment key={`${keyPrefix}-txt-${idx}`}>{token}</React.Fragment>;
  });
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export const AIAssistantCompanion: React.FC = () => {
  // Default to compact floating launcher on mobile/tablets (<1280px) so it never covers hero/console CTAs
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1280;
    }
    return false;
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [blinkState, setBlinkState] = useState(false);
  const [mouthMood, setMouthMood] = useState<'happy' | 'talking' | 'idle'>('idle');

  const [messages, setMessages] = useState<ChatMessage[]>([createWelcomeMessage()]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const inFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moodTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Ids of failed user turns and error replies: kept on screen but never sent back as history. */
  const excludedIdsRef = useRef<Set<string>>(new Set());

  // Track mount state; cancel any in-flight request and timers on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort('unmount');
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
      if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
    };
  }, []);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Robot blinking & facial expression animation loop (respecting reduced motion)
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let blinkTimeout: ReturnType<typeof setTimeout> | undefined;
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      blinkTimeout = setTimeout(() => setBlinkState(false), 220);
    }, 3600);
    return () => {
      clearInterval(blinkInterval);
      if (blinkTimeout) clearTimeout(blinkTimeout);
    };
  }, []);

  /**
   * Builds the `history` array (oldest first, max 10 turns, each content 1-2000 chars,
   * roles strictly "user" or "assistant") for POST /api/v1/chat/ask.
   * The welcome message and failed exchanges (error replies + the question that caused them)
   * are excluded so the model never sees "service unavailable" text as its own answer.
   */
  const buildConversationHistory = (priorMessages: ChatMessage[]): ChatHistoryTurn[] => {
    return priorMessages
      .filter(
        (m) =>
          m.id !== 'msg-0' && !excludedIdsRef.current.has(m.id) && m.text.trim().length > 0
      )
      .map((m): ChatHistoryTurn => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text.trim().slice(0, MAX_HISTORY_CONTENT_CHARS),
      }))
      .slice(-MAX_HISTORY_TURNS);
  };

  const handleReset = () => {
    soundManager.playSelect();
    abortRef.current?.abort('reset');
    abortRef.current = null;
    inFlightRef.current = false;
    excludedIdsRef.current.clear();
    if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    setIsLoading(false);
    setIsSlow(false);
    setMouthMood('idle');
    setMessages([createWelcomeMessage()]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = (textToSend || inputVal).trim();
    // Ref guard (not just state) so a double-click / double-Enter can't fire two requests
    if (!rawText || inFlightRef.current) return;
    inFlightRef.current = true;

    // Enforce /api/v1/chat/ask question limit of 1-1000 characters
    const question = rawText.slice(0, MAX_QUESTION_CHARS);
    const history = buildConversationHistory(messages);

    soundManager.playSelect();
    const userMsg: ChatMessage = {
      id: makeId('user'),
      sender: 'user',
      text: question,
      timestamp: nowTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) {
      setInputVal('');
    }
    setIsLoading(true);
    setIsSlow(false);
    setMouthMood('talking');
    if (moodTimerRef.current) clearTimeout(moodTimerRef.current);

    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort('timeout'), REQUEST_TIMEOUT_MS);
    slowTimerRef.current = setTimeout(() => {
      if (mountedRef.current) setIsSlow(true);
    }, SLOW_NOTICE_MS);

    // Aborted by Reset/unmount (not by our own timeout): drop the result silently
    const wasCancelled = () => controller.signal.aborted && controller.signal.reason !== 'timeout';

    const failWith = (text: string) => {
      const errorBotMsg: ChatMessage = {
        id: makeId('bot'),
        sender: 'bot',
        text,
        timestamp: nowTime(),
      };
      excludedIdsRef.current.add(userMsg.id);
      excludedIdsRef.current.add(errorBotMsg.id);
      setMessages((prev) => [...prev, errorBotMsg]);
    };

    try {
      // Always call our Express proxy route `/api/v1/chat/ask` which forwards server-to-server
      // to `https://rag-as-service.onrender.com/api/v1/chat/ask` without browser CORS restrictions
      const res = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          question,
          history,
        }),
        signal: controller.signal,
      });

      const retryAfter = parseRetryAfter(res.headers.get('Retry-After'));
      const data = await readJsonBody(res);
      if (wasCancelled()) return;
      soundManager.playNavigate();

      if (res.ok && data && data.success === true) {
        const botMsg: ChatMessage = {
          id: makeId('bot'),
          sender: 'bot',
          text:
            typeof data.answer === 'string' && data.answer.trim()
              ? data.answer
              : KB_UNAVAILABLE_TEXT,
          // Keep the exact order/length: the answer's [n] markers map to sources[n - 1]
          sources: Array.isArray(data.sources) ? data.sources : [],
          timestamp: nowTime(),
        };
        setMessages((prev) => [...prev, botMsg]);
        return;
      }

      // A 2xx with an unusable body (e.g. HTML from a misconfigured proxy) counts as a bad gateway
      failWith(buildErrorText(res.ok ? 502 : res.status, data, retryAfter));
    } catch (err) {
      if (wasCancelled()) return;
      const timedOut = controller.signal.aborted;
      console.error('[AIAssistantCompanion] Chat request failed:', err);
      failWith(
        timedOut
          ? 'The assistant took too long to respond. Please try again in a moment.'
          : 'A dependency is unavailable; please try again shortly.'
      );
    } finally {
      clearTimeout(timeoutId);
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
      // Only release the lock if Reset hasn't already replaced/cleared this request
      if (abortRef.current === controller) {
        abortRef.current = null;
        inFlightRef.current = false;
      }
      if (mountedRef.current && !wasCancelled()) {
        setIsLoading(false);
        setIsSlow(false);
        setMouthMood('happy');
        moodTimerRef.current = setTimeout(() => {
          if (mountedRef.current) setMouthMood('idle');
        }, 2500);
      }
    }
  };

  const samplePrompts = [
    'What projects are in the portfolio?',
    'What are the tech stack where he worked?',
    'What is Jira Fixer?',
    'What is EVEE?',
    'Open for hire?',
  ];

  // Compact Floating Launcher (when closed/minimized)
  if (!isOpen) {
    return (
      <div
        className="fixed bottom-[74px] lg:bottom-4 right-3 sm:right-4 z-50 select-none"
        id="companion-ai-launcher-wrapper"
      >
        <button
          type="button"
          id="companion-ai-launcher-btn"
          onClick={() => {
            soundManager.playSelect();
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open AI Assistant Chat"
          className="group flex items-center justify-center sm:justify-start gap-0 sm:gap-2.5 min-w-[48px] min-h-[48px] p-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-[#D6C2A5] border-2 border-[#092A4A] dark:border-[#3B82F6] shadow-[0_8px_24px_rgba(0,0,0,0.28)] hover:scale-[1.03] active:scale-95 transition-transform cursor-pointer relative"
        >
          {/* Metallic Antenna on Phone Mode */}
          <span className="sm:hidden absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-2.5 bg-[#8E795E] rounded-t-full flex items-center justify-center pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[#3DA66B] -top-1.5 absolute shadow-xs" />
          </span>

          {/* Robot CRT Face */}
          <span className="w-10 h-8 sm:w-8 sm:h-7 bg-[#071829] rounded-md border border-[#16385B] flex flex-col items-center justify-center relative overflow-hidden shrink-0">
            <span className="flex items-center gap-1.5">
              {blinkState ? (
                <>
                  <span className="w-2 h-0.5 bg-[#5FD182]" />
                  <span className="w-2 h-0.5 bg-[#5FD182]" />
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 bg-[#5FD182] rounded-xs shadow-[0_0_3px_#5FD182]" />
                  <span className="w-1.5 h-1.5 bg-[#5FD182] rounded-xs shadow-[0_0_3px_#5FD182]" />
                </>
              )}
            </span>
            <span className="w-2.5 h-0.5 bg-[#5FD182] mt-1 rounded-full" />
          </span>

          {/* Text hidden on phone mode, shown on sm+ */}
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-mono-tech font-bold text-[11px] text-[#092A4A] leading-tight flex items-center gap-1">
              <span>AI COMPANION</span>
              <MessageSquare size={11} className="text-[#257336]" />
            </span>
            <span className="font-mono-tech text-[9.5px] text-[#4A3B2B] leading-tight">
              Ask about Suraj
            </span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-x-2.5 bottom-[72px] sm:inset-x-auto sm:right-4 lg:bottom-4 z-[58] select-none flex flex-col items-end max-w-[calc(100vw-20px)]"
      id="companion-ai-container"
    >
      {/* Robot Companion Head Device */}
      <div className="flex items-end justify-end mb-[-6px] z-20 mr-3">
        <div className="flex flex-col items-center">
          {/* Metallic Antenna */}
          <div className="w-1 h-3 bg-[#8E795E] rounded-t-full relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#3DA66B] -top-1.5 absolute shadow-xs" />
          </div>

          {/* Robot Head Body */}
          <div className="w-13 h-10 bg-[#D6C2A5] rounded-lg border-2 border-[#BCA689] shadow-sm flex items-center justify-center p-1 relative">
            {/* Robot CRT Face */}
            <div className="w-full h-full bg-[#071829] rounded-sm border border-[#16385B] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />

              {/* Pixel Robot Eyes */}
              <div className="flex items-center gap-2 z-10">
                {blinkState ? (
                  <>
                    <div className="w-2.5 h-0.5 bg-[#5FD182]" />
                    <div className="w-2.5 h-0.5 bg-[#5FD182]" />
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-[#5FD182] rounded-xs shadow-[0_0_3px_#5FD182] flex items-center justify-center">
                      <div className="w-0.5 h-0.5 bg-[#071829]" />
                    </div>
                    <div className="w-2 h-2 bg-[#5FD182] rounded-xs shadow-[0_0_3px_#5FD182] flex items-center justify-center">
                      <div className="w-0.5 h-0.5 bg-[#071829]" />
                    </div>
                  </>
                )}
              </div>

              {/* Robot Mouth */}
              <div className="mt-0.5 z-10">
                {mouthMood === 'talking' ? (
                  <div className="w-2.5 h-1 bg-[#5FD182] rounded-full" />
                ) : mouthMood === 'happy' ? (
                  <div className="w-3 h-0.5 border-b-2 border-[#5FD182] rounded-b-full" />
                ) : (
                  <div className="w-2 h-0.5 bg-[#5FD182]/80" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Terminal Chat Window (Responsive width & height on mobile and desktop) */}
      <div
        className={`w-full sm:w-[355px] bg-[#D6C2A5] rounded-2xl border-3 border-[#C8B69A] flex flex-col overflow-hidden transition-all duration-200 p-2 sm:p-2.5 shadow-[0_16px_32px_rgba(20,25,35,0.32),0_3px_8px_rgba(20,25,35,0.16),inset_0_2px_4px_#F5E8D4,inset_0_-3px_5px_#A68F71] ${
          isMinimized ? 'h-16' : 'h-[min(65dvh,350px)] sm:h-[325px]'
        }`}
      >
        {/* Dark CRT Screen Container (Always dark CRT background, so text inside is always light!) */}
        <div className="w-full h-full bg-[#071829] rounded-xl border border-[#16385B] flex flex-col overflow-hidden p-2.5 relative shadow-inner">
          {/* Top Bar: RAG SERVICE • /api/v1/chat/ask */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#16385B]/60 mb-1.5 shrink-0">
            <div className="flex items-center gap-1.5 font-mono-tech text-[10.5px] font-bold min-w-0">
              <span className="text-[#F4E9D5] tracking-wider truncate">RAG CHATBOT</span>
              <span className="text-[#6EB5F7]" aria-hidden="true">•</span>
              <span className="text-[#5FD182] tracking-wide text-[9.5px] shrink-0">
                /api/v1/chat/ask
              </span>
            </div>

            <div className="flex items-center gap-1 text-[#94A3B8] shrink-0">
              {messages.length > 1 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-1.5 py-0.5 text-[9.5px] font-mono-tech text-[#6EB5F7] hover:text-[#F4E9D5] hover:bg-[#16385B]/60 rounded border border-[#16385B] transition-colors cursor-pointer"
                  title="Clear follow-up history turns"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                aria-label={isMinimized ? 'Expand AI Assistant' : 'Minimize AI Assistant'}
                onClick={() => {
                  if (typeof window !== 'undefined' && window.innerWidth < 640) {
                    setIsOpen(false);
                  } else {
                    setIsMinimized((prev) => !prev);
                  }
                }}
                className="w-8 h-8 flex items-center justify-center hover:text-[#F4E9D5] hover:bg-[#16385B]/50 rounded transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button
                type="button"
                id="close-ai-chat-btn"
                aria-label="Close AI Assistant"
                onClick={() => {
                  soundManager.playBack();
                  setIsOpen(false);
                }}
                className="w-8 h-8 flex items-center justify-center hover:text-[#F4E9D5] hover:bg-[#C85C57]/80 rounded transition-colors cursor-pointer"
                title="Close chat"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Starter Prompts */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 mb-1 scrollbar-hide shrink-0">
                {samplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isLoading}
                    className="shrink-0 px-2 py-1 rounded bg-[#0B253D] hover:bg-[#123F68] text-[#6EB5F7] border border-[#16385B] font-mono-tech text-[10px] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Messages Area */}
              <div
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                className="flex-1 overflow-y-auto pr-1 space-y-2 text-xs font-mono-tech min-h-0"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[92%] px-2.5 py-1.5 rounded-lg leading-relaxed text-[11.5px] break-words [overflow-wrap:anywhere] ${
                        m.sender === 'user'
                          ? 'bg-[#123F68] text-[#F4E9D5] rounded-br-none border border-[#2563EB]/40'
                          : 'bg-[#0B253D] text-[#EADBC3] rounded-bl-none border border-[#16385B]'
                      }`}
                    >
                      <p className="whitespace-pre-line">
                        {renderFormattedSegment(m.text, m.sources, m.id)}
                      </p>

                      {/* Cited Knowledge Base Sources ([n] -> sources[n-1]) */}
                      {m.sender === 'bot' && m.sources && m.sources.length > 0 && (
                        <div className="mt-2 pt-1.5 border-t border-[#16385B] space-y-1">
                          <div className="text-[9.5px] text-[#6EB5F7] font-bold uppercase tracking-wider">
                            Cited Sources ({m.sources.length})
                          </div>
                          {m.sources.map((src, idx) => (
                            <div
                              key={`${src.category}-${src.title}-${idx}`}
                              className="text-[10px] text-[#94A3B8] flex items-start gap-1 leading-snug"
                            >
                              <span className="text-[#5FD182] font-bold shrink-0">
                                [{idx + 1}]
                              </span>
                              <div className="min-w-0 flex-1">
                                <span className="text-[#CBD5E1] font-semibold">
                                  {src.category}:
                                </span>{' '}
                                {src.url ? (
                                  <a
                                    href={src.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#6EB5F7] hover:underline inline-flex items-center gap-0.5 break-all"
                                  >
                                    <span>{src.title || src.url}</span>
                                    <ExternalLink size={9} className="shrink-0" />
                                  </a>
                                ) : (
                                  <span>{src.title}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-tech text-[#5FD182] bg-[#0B253D] p-1.5 rounded border border-[#16385B] w-fit max-w-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5FD182] animate-bounce shrink-0" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5FD182] animate-bounce shrink-0 [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5FD182] animate-bounce shrink-0 [animation-delay:0.4s]" />
                    <span className="text-[10px] ml-1 min-w-0">
                      {isSlow
                        ? 'Waking up the RAG service (first reply can take up to a minute)...'
                        : 'Asking RAG service...'}
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Question Input Bar (text-base on mobile prevents iOS Safari zoom!) */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-1.5 pt-2 mt-1 border-t border-[#16385B]/60 shrink-0"
              >
                <label htmlFor="ai-chat-input" className="sr-only">
                  Ask AI Assistant a question
                </label>
                <input
                  id="ai-chat-input"
                  type="text"
                  maxLength={MAX_QUESTION_CHARS}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask portfolio KB (1–1000 chars)..."
                  className="flex-1 min-w-0 min-h-[40px] bg-[#051321] text-[#F4E9D5] font-mono-tech text-base sm:text-xs px-2.5 py-1.5 rounded-lg border border-[#16385B] placeholder-[#64748B] focus:outline-none focus:border-[#5FD182]"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={!inputVal.trim() || isLoading}
                  className="w-10 h-10 rounded-lg bg-[#123F68] hover:bg-[#5FD182] text-[#F4E9D5] hover:text-[#071829] disabled:opacity-40 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};