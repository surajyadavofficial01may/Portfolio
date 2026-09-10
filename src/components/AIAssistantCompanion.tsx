import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, X, Minimize2, Maximize2, RotateCcw } from 'lucide-react';
import { ChatMessage } from '../types';
import { soundManager } from '../utils/soundEffects';

export const AIAssistantCompanion: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blinkState, setBlinkState] = useState(false);
  const [mouthMood, setMouthMood] = useState<'happy' | 'talking' | 'idle'>('idle');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'bot',
      text: "Hi! I'm your AI assistant. Ask me anything about my work, projects, skills or availability!",
      timestamp: 'NOW',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  // Robot blinking & facial expression animation loop
  useEffect(() => {
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
    setInputVal('');
    setIsLoading(true);
    setMouthMood('talking');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
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
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: "Suraj is a software engineer specializing in scalable full-stack applications with React, Node.js, and Python. Feel free to explore the console or ask about his skills!",
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
    'What are his strongest skills?',
    'Tell me about his projects',
    'Is Suraj open for hire?',
    'What tech stack does he use?',
  ];

  return (
    <div 
      className="fixed bottom-4 right-4 z-40 select-none flex flex-col items-end"
      id="companion-ai-container"
    >
      {/* Robot Companion Head Device (sitting on top-right of terminal, matching photo!) */}
      <div className="flex items-end justify-end mb-[-6px] z-20 mr-3">
        <div className="flex flex-col items-center">
          {/* Metallic Antenna with glowing tip */}
          <div className="w-1 h-3.5 bg-[#8E795E] rounded-t-full relative flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3DA66B] -top-2 absolute shadow-xs animate-pulse" />
          </div>

          {/* Robot Head Body */}
          <div className="w-14 h-11 bg-[#D6C2A5] rounded-lg border-2 border-[#BCA689] shadow-sm flex items-center justify-center p-1 relative">
            {/* Robot CRT Face */}
            <div className="w-full h-full bg-[#071829] rounded-sm border border-[#16385B] flex flex-col items-center justify-center relative overflow-hidden">
              {/* Scanline */}
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
                  <div className="w-2.5 h-0.5 bg-[#5FD182] rounded-full animate-pulse" />
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

      {/* Main Terminal Chat Window (Horizontal ratio matching photo) */}
      <div 
        className={`w-[320px] sm:w-[355px] bg-[#D6C2A5] rounded-2xl border-3 border-[#C8B69A] shadow-[0_16px_32px_rgba(20,30,40,0.22)] flex flex-col overflow-hidden transition-all duration-200 p-2 sm:p-2.5 ${
          isMinimized ? 'h-14' : 'h-[240px] sm:h-[260px]'
        }`}
        style={{
          boxShadow: `
            0 16px 32px rgba(35, 25, 15, 0.22),
            0 3px 8px rgba(35, 25, 15, 0.12),
            inset 0 2px 4px #F5E8D4,
            inset 0 -3px 5px #A68F71
          `
        }}
      >
        {/* Dark CRT Screen Container */}
        <div className="w-full h-full bg-[#071829] rounded-xl border border-[#16385B] flex flex-col overflow-hidden p-2.5 relative shadow-inner">
          {/* Top Bar: AI ASSISTANT • ONLINE */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#16385B]/60 mb-2">
            <div className="flex items-center gap-1.5 font-mono-tech text-[11px] font-bold">
              <span className="text-[#F4E9D5] dark:text-[#0A0A0F] tracking-wider">AI ASSISTANT</span>
              <span className="text-[#4B6173] dark:text-[#94A3B8]">•</span>
              <div className="flex items-center gap-1 text-[#5FD182]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5FD182] animate-pulse" />
                <span className="tracking-wide text-[10px]">ONLINE</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#4B6173] dark:text-[#94A3B8]">
              <button
                onClick={() => setIsMinimized((prev) => !prev)}
                className="hover:text-[#F4E9D5] dark:text-[#0A0A0F] transition-colors p-0.5 cursor-pointer"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2 text-xs font-mono-tech">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[92%] px-2.5 py-1.5 rounded-lg leading-relaxed text-[11px] sm:text-xs ${
                        m.sender === 'user'
                          ? 'bg-[#123F68] dark:bg-[#2563EB] text-[#F4E9D5] dark:text-[#0A0A0F] rounded-br-none border border-[#10283F]'
                          : 'bg-[#0B253D] text-[#EADBC3] rounded-bl-none border border-[#16385B]'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-tech text-[#5FD182] bg-[#0B253D] p-1.5 rounded border border-[#16385B] w-fit">
                    <span className="w-1 h-1 rounded-full bg-[#5FD182] animate-bounce" />
                    <span className="w-1 h-1 rounded-full bg-[#5FD182] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 rounded-full bg-[#5FD182] animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[10px] ml-1">Thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Question Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-1.5 pt-2 border-t border-[#16385B]/50"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 bg-[#051321] text-[#F4E9D5] dark:text-[#0A0A0F] font-mono-tech text-[11px] px-2.5 py-1.5 rounded-md border border-[#16385B] placeholder-[#4B6173] focus:outline-none focus:border-[#5FD182]"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isLoading}
                  className="w-7 h-7 rounded-md bg-[#123F68] dark:bg-[#2563EB] hover:bg-[#5FD182] text-[#F4E9D5] dark:text-[#0A0A0F] hover:text-[#071829] disabled:opacity-40 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                >
                  <Send size={12} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
