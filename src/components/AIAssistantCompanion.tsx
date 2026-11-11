import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Minimize2, Maximize2, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../types';
import { soundManager } from '../utils/soundEffects';
import { retrieveKnowledgeForQuery } from '../data/knowledgeBaseSchema';
import { getActiveKnowledgeBase } from '../services/supabaseKnowledgeBaseService';

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
  const [blinkState, setBlinkState] = useState(false);
  const [mouthMood, setMouthMood] = useState<'happy' | 'talking' | 'idle'>('idle');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'bot',
      text: "Hi! I'm Suraj's AI assistant. Ask me about Jira Fixer, EVEE, VAssureAI, or his skills!",
      timestamp: 'NOW',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Robot blinking & facial expression animation loop (respecting reduced motion)
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 220);
    }, 3600);
    return () => clearInterval(blinkInterval);
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isLoading) return;

    soundManager.playSelect();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) {
      setInputVal('');
    }
    setIsLoading(true);
    setMouthMood('talking');

    try {
      const { data: activeKB } = getActiveKnowledgeBase();
      const ragContext = retrieveKnowledgeForQuery(text, activeKB, 6);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, ragContext }),
      });
      const data = await res.json();
      soundManager.playNavigate();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || "I'm ready to answer any questions about Suraj's engineering projects!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Suraj is a software engineer specializing in scalable full-stack applications with React, Node.js, and Python. Feel free to explore the console or ask about his skills!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setMouthMood('happy');
      setTimeout(() => setMouthMood('idle'), 2500);
    }
  };

  const samplePrompts = [
    'What is Jira Fixer?',
    'What is EVEE?',
    'VAssureAI role?',
    'AI models used?',
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
        className={`w-full sm:w-[355px] bg-[#D6C2A5] rounded-2xl border-3 border-[#C8B69A] flex flex-col overflow-hidden transition-all duration-200 p-2 sm:p-2.5 ${
          isMinimized ? 'h-16' : 'h-[min(65dvh,340px)] sm:h-[310px]'
        }`}
        style={{
          boxShadow: `
            0 16px 32px rgba(20, 25, 35, 0.32),
            0 3px 8px rgba(20, 25, 35, 0.16),
            inset 0 2px 4px #F5E8D4,
            inset 0 -3px 5px #A68F71
          `,
        }}
      >
        {/* Dark CRT Screen Container (Always dark CRT background, so text inside is always light!) */}
        <div className="w-full h-full bg-[#071829] rounded-xl border border-[#16385B] flex flex-col overflow-hidden p-2.5 relative shadow-inner">
          {/* Top Bar: AI ASSISTANT • ONLINE */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#16385B]/60 mb-1.5 shrink-0">
            <div className="flex items-center gap-1.5 font-mono-tech text-[11px] font-bold min-w-0">
              <span className="text-[#F4E9D5] tracking-wider truncate">AI ASSISTANT</span>
              <span className="text-[#6EB5F7]" aria-hidden="true">•</span>
              <span className="text-[#5FD182] tracking-wide text-[10px] shrink-0">ONLINE</span>
            </div>

            <div className="flex items-center gap-1 text-[#94A3B8] shrink-0">
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
                    className="shrink-0 px-2 py-1 rounded bg-[#0B253D] hover:bg-[#123F68] text-[#6EB5F7] border border-[#16385B] font-mono-tech text-[10px] transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2 text-xs font-mono-tech min-h-0">
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
                      <p className="whitespace-pre-line">{m.text}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-tech text-[#5FD182] bg-[#0B253D] p-1.5 rounded border border-[#16385B] w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5FD182] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5FD182] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5FD182] animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[10px] ml-1">Thinking...</span>
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
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask about Suraj..."
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
