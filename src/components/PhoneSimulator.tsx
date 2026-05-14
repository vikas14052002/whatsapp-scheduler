'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Phone, RotateCcw, ChevronLeft, MoreVertical, Wifi, Battery, Signal } from 'lucide-react';
import type { Workflow } from '@/lib/workflow/types';
import type { Service } from '@/types';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  quickReplies?: string[];
}

interface PhoneSimulatorProps {
  workflow: Workflow | null;
  services: Service[];
}

function formatBold(text: string): React.ReactNode {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <strong key={i} className="font-semibold">{part.slice(1, -1)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function PhoneSimulator({ workflow, services }: PhoneSimulatorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => 'sim-' + Math.random().toString(36).slice(2, 10));
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const addMessage = (text: string, isUser: boolean, quickReplies?: string[]) => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      text, isUser, timestamp: new Date(), quickReplies
    }]);
  };

  const simulateTyping = async (delay = 900) => {
    setIsTyping(true);
    await new Promise(r => setTimeout(r, delay));
    setIsTyping(false);
  };

  const sendToApi = async (text: string): Promise<{ reply: string; quickReplies?: string[] } | null> => {
    try {
      const res = await fetch('/api/workflow/simulate', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: sessionId }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch { return null; }
  };

  const handleSend = async (text?: string) => {
    const msg = text || inputText.trim();
    if (!msg) return;
    if (!text) setInputText('');

    addMessage(msg, true);
    await simulateTyping();

    const result = await sendToApi(msg);
    if (result?.reply) {
      addMessage(result.reply, false, result.quickReplies);
    } else {
      addMessage("Sorry, I didn't get that. Try *hi* to restart.", false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInputText('');
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const handleStart = async () => {
    handleReset();
    await simulateTyping(500);
    const result = await sendToApi('hi');
    if (result?.reply) {
      addMessage(result.reply, false, result.quickReplies);
    }
  };

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const isActive = workflow?.is_active ?? false;
  const botName = workflow?.name || 'Demo Bot';

  return (
    <div>
      {/* Label */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h3 className="text-sm font-semibold text-deep-ink font-headline">Live Preview</h3>
          <p className="text-xs text-deep-ink/40 font-body">Test your bot conversation</p>
        </div>
        <button onClick={handleStart} className="p-1.5 rounded-lg hover:bg-deep-ink/5 text-deep-ink/40 hover:text-saffron-glow transition-colors" title="Restart conversation">
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Phone Frame */}
      <div className="w-[300px] mx-auto">
        {/* Outer bezel */}
        <div className="bg-[#1a1a1a] rounded-[44px] p-[10px] shadow-2xl shadow-black/30">
          {/* Inner phone */}
          <div className="bg-black rounded-[36px] overflow-hidden">
            {/* Dynamic Island / Notch */}
            <div className="relative h-7 bg-black flex items-center justify-center z-10">
              <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-2 border border-white/5">
                <div className="w-2 h-2 rounded-full bg-[#1a3a5c]" />
                <div className="w-10 h-2.5 bg-[#0d1f2d] rounded-full" />
              </div>
              {/* Status bar items */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-[9px] text-white/80 font-medium font-body">9:41</span>
              </div>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Signal size={10} className="text-white/80" />
                <Wifi size={10} className="text-white/80" />
                <Battery size={12} className="text-white/80" />
              </div>
            </div>

            {/* Screen */}
            <div className="bg-[#EFEAE2] h-[520px] flex flex-col relative overflow-hidden">
              {/* WhatsApp Header */}
              <div className="bg-[#F0F2F5] px-3 py-2 flex items-center gap-2.5 border-b border-black/[0.06] shrink-0">
                <ChevronLeft size={18} className="text-[#54656F] shrink-0" />
                <div className="w-9 h-9 rounded-full bg-saffron-glow/15 flex items-center justify-center shrink-0">
                  <User size={15} className="text-saffron-glow" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#111B21] truncate font-body leading-tight">{botName}</p>
                  <p className="text-[10px] text-[#667781] font-body leading-tight">
                    {isTyping ? 'typing…' : isActive ? 'online' : 'offline'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Phone size={15} className="text-[#54656F]" />
                  <MoreVertical size={15} className="text-[#54656F]" />
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6">
                    <div className="w-14 h-14 rounded-full bg-saffron-glow/10 flex items-center justify-center mb-4">
                      <Send size={20} className="text-saffron-glow" />
                    </div>
                    <p className="text-xs text-deep-ink/35 font-body mb-4 leading-relaxed">
                      Click Start to begin a<br />test conversation
                    </p>
                    <button onClick={handleStart}
                      className="px-5 py-2 rounded-full bg-[#00A884] text-white text-xs font-body font-semibold hover:bg-[#008F72] active:scale-95 transition-all shadow-sm"
                    >
                      Start Chat
                    </button>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} mb-1`}>
                    <div className={`max-w-[80%] px-2.5 py-1.5 rounded-lg text-[13px] font-body leading-snug relative ${
                      msg.isUser
                        ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-sm'
                        : 'bg-white text-[#111B21] rounded-tl-sm shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                    }`}>
                      <div className="whitespace-pre-wrap">{formatBold(msg.text)}</div>
                      <div className={`flex items-center justify-end gap-0.5 mt-0.5 ${msg.isUser ? 'text-[#53BDEB]' : 'text-[#667781]'}`}>
                        <span className="text-[9px]">{formatTime(msg.timestamp)}</span>
                        {msg.isUser && (
                          <svg className="w-3 h-3" viewBox="0 0 16 15" fill="none">
                            <path d="M10.5 6.5L6.5 10.5L4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14.5 6.5L10.5 10.5L8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Quick Replies */}
                {messages[messages.length - 1]?.quickReplies && messages[messages.length - 1]?.quickReplies!.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5 pl-0.5">
                    {messages[messages.length - 1]!.quickReplies!.map((qr) => (
                      <button key={qr} onClick={() => handleSend(qr)}
                        className="px-3 py-1.5 rounded-full bg-white border border-[#00A884] text-[#00A884] text-[11px] font-body font-semibold hover:bg-[#00A884] hover:text-white active:scale-95 transition-all shadow-sm"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start mb-1">
                    <div className="bg-white px-3 py-2.5 rounded-lg rounded-tl-sm shadow-[0_1px_2px_rgba(0,0,0,0.06)] flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8696A0] animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8696A0] animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1s' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8696A0] animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1s' }} />
                    </div>
                  </div>
                )}

                <div ref={bottomRef} className="h-1" />
              </div>

              {/* Input Area */}
              <div className="bg-[#F0F2F5] px-2.5 py-2 flex items-end gap-1.5 shrink-0">
                <input ref={inputRef} type="text" value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Message"
                  className="flex-1 bg-white rounded-full px-4 py-2 text-[13px] font-body text-[#111B21] placeholder:text-[#667781] outline-none border-none min-h-[36px]"
                  disabled={isTyping}
                />
                <button onClick={() => handleSend()}
                  disabled={isTyping || !inputText.trim()}
                  className="w-9 h-9 rounded-full bg-[#00A884] flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#008F72] active:scale-90 transition-all shrink-0 mb-0"
                >
                  <Send size={15} className="ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
