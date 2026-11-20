"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  Terminal,
  X,
} from "lucide-react";
import { useLocationContext } from "@/context/LocationContext";
import { ChatMessage, StructuredAIGuidance } from "@/lib/types";

const SUGGESTED_QUESTIONS = [
  "Explain Python loops with examples",
  "How do loops work in Java?",
  "Is it safe to go outside in my city right now?",
  "Write a TypeScript debounce function",
  "What is the difference between PM2.5 and PM10?",
  "Explain quantum computing in simple terms",
  "How do I size a HEPA purifier for my room?",
  "What should we do when AQI exceeds 300?",
];

interface ChatInterfaceProps {
  isEmbedded?: boolean;
  onClose?: () => void;
  initialPrompt?: string;
}

export default function ChatInterface({ isEmbedded, onClose, initialPrompt }: ChatInterfaceProps = {}) {
  const { airQuality, userPrefs, location } = useLocationContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState(initialPrompt || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialPrompt) {
      setInputQuery(initialPrompt);
    }
  }, [initialPrompt]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isFallbackNotice, setIsFallbackNotice] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize with friendly welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const aqiSnippet = airQuality
        ? `\n\nI am also connected to live environmental telemetry in **${location.name}** (Current CPCB AQI: **${airQuality.cpcbAQI} ${airQuality.cpcbCategory}**, PM2.5: **${airQuality.pollutants.pm2_5.value} µg/m³**).`
        : "";

      const welcome: ChatMessage = {
        id: "welcome",
        role: "assistant",
        content: `Hello! I am **BreatheWise AI**, your friendly, general-purpose intelligence assistant.${aqiSnippet}\n\nYou can ask me anything—from **programming** (Python, Java, C++, TypeScript), **mathematics**, and **science**, to everyday problem-solving, writing, and **personalized clean-air guidance**.\n\nWhat would you like to explore or solve today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([welcome]);
    }
  }, [airQuality, location.name, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    if (!textToSend) setInputQuery("");
    setIsLoading(true);
    setLastFailedQuery(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query.trim(),
          aqiContext: airQuality,
          userPrefs,
          history: newHistory.slice(-8).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server returned non-JSON response (status ${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data?.error || `Server responded with status ${res.status}`);
      }

      setIsFallbackNotice(Boolean(data.isFallback));

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.text,
        structured: data.structured,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Temporary communication issue with the assistant server.";
      console.error("Assistant query failed:", err);
      setLastFailedQuery(query.trim());
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `⚠️ **Request Notice**\n\n${errMsg}\n\nPlease click **Retry** below to resend your question.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    // Find last user query
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      // Remove last assistant message
      setMessages((prev) => prev.slice(0, prev.length - 1));
      handleSendMessage(lastUser.content);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setLastFailedQuery(null);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col ${isEmbedded ? "h-full" : "h-[calc(100vh-140px)] min-h-[620px]"} liquid-glass rounded-3xl border border-[#DCECE8] shadow-sm overflow-hidden text-[#234B55]`}>
      {/* Liquid Glass Top Header */}
      <div className="p-4 sm:p-5 border-b border-[#DCECE8]/80 flex items-center justify-between gap-4 bg-white/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#234B55] to-[#6BAEAA] flex items-center justify-center text-white shadow-md shadow-[#234B55]/15 ring-2 ring-white/60">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-[#234B55]">
                BreatheWise AI Assistant
              </h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#DCECE8] text-[#234B55] border border-[#A9D5C8] font-bold">
                General-Purpose + Gemini Grounded
              </span>
            </div>
            <p className="text-xs text-[#687D83] font-light truncate max-w-[240px] sm:max-w-md">
              Coding · Math · General Knowledge · {location.name} AQI: {airQuality?.cpcbAQI ?? "--"}
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewConversation}
            className="px-3 py-1.5 rounded-xl border border-[#DCECE8] hover:border-[#6BAEAA] bg-white/80 text-xs font-semibold text-[#234B55] flex items-center gap-1.5 glow-btn shadow-sm"
            title="Start fresh conversation"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#6BAEAA]" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-[#DCECE8] hover:border-[#6BAEAA] bg-white/80 text-[#234B55] hover:bg-[#DCECE8]/60 transition-colors"
              title="Close Assistant"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Questions Pill Row */}
      <div className="px-4 py-2.5 bg-[#F4F8F6]/80 border-b border-[#DCECE8]/60 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-mono text-[#687D83] shrink-0 flex items-center gap-1 font-semibold">
          <Sparkles className="w-3 h-3 text-[#6BAEAA]" />
          <span>Try asking:</span>
        </span>
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="px-3 py-1 rounded-full bg-white/85 border border-[#DCECE8] text-xs text-[#234B55] hover:border-[#6BAEAA] hover:text-[#234B55] whitespace-nowrap transition-all shadow-sm shrink-0 disabled:opacity-50 glow-btn"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg, index) => {
          const isAssistant = msg.role === "assistant";
          const isLatestAssistant = isAssistant && index === messages.length - 1;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-xl bg-[#234B55] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm ring-1 ring-white/60">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[90%] sm:max-w-2xl rounded-3xl p-4 sm:p-5 space-y-3 transition-all ${
                  msg.role === "user"
                    ? "bg-[#234B55] text-white shadow-md rounded-tr-sm border border-[#2D5E6B]"
                    : "liquid-glass glow-card rounded-tl-sm text-[#234B55]"
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between text-[11px] opacity-70 pb-1 font-mono">
                  <span>{msg.role === "user" ? "You" : "BreatheWise AI"}</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Structured 5-point card if available */}
                {msg.structured ? (
                  <StructuredCard guidance={msg.structured} />
                ) : (
                  <MarkdownRenderer content={msg.content} isUser={msg.role === "user"} />
                )}

                {/* Assistant Message Actions: Copy & Regenerate */}
                {isAssistant && (
                  <div className="pt-2 border-t border-[#DCECE8]/70 flex items-center justify-between text-xs text-[#687D83]">
                    <span className="text-[10px] font-mono">
                      {isFallbackNotice ? "Scientific Local Engine" : "Google Gemini 1.5"}
                    </span>

                    <div className="flex items-center gap-3">
                      {isLatestAssistant && !isLoading && (
                        <button
                          onClick={handleRegenerate}
                          className="flex items-center gap-1 hover:text-[#234B55] transition-colors font-medium text-[11px]"
                          title="Regenerate this response"
                        >
                          <RotateCcw className="w-3 h-3 text-[#6BAEAA]" />
                          <span>Regenerate</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="flex items-center gap-1 hover:text-[#234B55] transition-colors font-medium text-[11px]"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#4A9E86]" />
                            <span className="text-[#4A9E86]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-[#6BAEAA] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm ring-1 ring-white/60">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Retry prompt on error */}
        {lastFailedQuery && !isLoading && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => handleSendMessage(lastFailedQuery)}
              className="px-4 py-2 rounded-2xl bg-white border border-[#D98E83] text-[#B85450] hover:bg-[#D98E83]/10 text-xs font-semibold flex items-center gap-1.5 shadow-sm glow-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry last question: &quot;{lastFailedQuery.slice(0, 30)}...&quot;</span>
            </button>
          </div>
        )}

        {/* Thinking Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-[#234B55] text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl liquid-glass text-xs font-mono text-[#234B55] flex items-center gap-2.5 shadow-sm border border-[#6BAEAA]/40">
              <Sparkles className="w-4 h-4 text-[#6BAEAA] animate-spin" />
              <span>BreatheWise AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Liquid Glass Input Area with Glowing Borders */}
      <div className="p-4 border-t border-[#DCECE8]/80 bg-white/70 backdrop-blur-md space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything: Python, Java, math, science, or today's air quality in your city..."
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-2xl bg-white/90 border border-[#DCECE8] text-[#234B55] placeholder:text-[#687D83] text-sm focus:outline-none focus:border-[#6BAEAA] focus:ring-2 focus:ring-[#6BAEAA]/30 shadow-sm glow-input resize-none max-h-32 min-h-[48px]"
            />
          </div>

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-3.5 rounded-2xl bg-[#234B55] hover:bg-[#1E414A] text-white disabled:opacity-40 transition-all shadow-md hover:shadow-lg glow-btn shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-[#687D83] px-1 font-mono">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-[#6BAEAA]" />
            <span>Shift + Enter for new line. General knowledge &amp; real-time grounded telemetry.</span>
          </span>
          {isFallbackNotice && (
            <span className="text-[#234B55] font-semibold">
              Mode: Scientific Offline Fallback
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Rich Markdown and Code Blocks Renderer with Copy Code functionality
function MarkdownRenderer({ content, isUser }: { content: string; isUser: boolean }) {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Split by code blocks: ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts: Array<{ type: "text" | "code"; lang?: string; content: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: "code", lang: match[1] || "code", content: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", content: content.slice(lastIndex) });
  }

  return (
    <div className={`space-y-3 text-sm leading-relaxed ${isUser ? "text-white" : "text-[#234B55]"}`}>
      {parts.map((part, pIdx) => {
        if (part.type === "code") {
          return (
            <div
              key={pIdx}
              className="rounded-2xl overflow-hidden border border-[#2D5E6B]/40 bg-[#081326] text-[#F4F8F6] my-3 shadow-lg"
            >
              <div className="px-4 py-2 bg-[#102035] border-b border-[#2D5E6B]/40 flex items-center justify-between text-xs font-mono text-[#A9D5C8]">
                <span className="flex items-center gap-1.5 font-bold uppercase text-[11px]">
                  <Terminal className="w-3.5 h-3.5 text-[#6BAEAA]" />
                  <span>{part.lang}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(part.content, pIdx)}
                  className="flex items-center gap-1 text-[11px] text-[#A9D5C8] hover:text-white transition-colors"
                >
                  {copiedCodeIndex === pIdx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#4A9E86]" />
                      <span className="text-[#4A9E86]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-[#DCECE8]">
                <code>{part.content.trim()}</code>
              </pre>
            </div>
          );
        }

        // Render formatted text lines
        return (
          <div key={pIdx} className="space-y-2">
            {part.content.split("\n\n").map((para, paraIdx) => {
              if (para.startsWith("### ")) {
                return (
                  <h3 key={paraIdx} className="text-base font-bold text-[#234B55] mt-2 mb-1">
                    {para.replace("### ", "")}
                  </h3>
                );
              }
              if (para.startsWith("#### ")) {
                return (
                  <h4 key={paraIdx} className="text-sm font-bold text-[#234B55] mt-1.5 mb-1">
                    {para.replace("#### ", "")}
                  </h4>
                );
              }

              // Check for bullet lists
              const lines = para.split("\n");
              const isList = lines.every((l) => l.trim().startsWith("- ") || l.trim().startsWith("* ") || l.trim().match(/^\d+\.\s/));

              if (isList) {
                return (
                  <ul key={paraIdx} className="space-y-1 my-1.5 pl-2">
                    {lines.map((li, liIdx) => (
                      <li key={liIdx} className="flex items-start gap-2">
                        <span className="text-[#6BAEAA] font-bold mt-0.5">•</span>
                        <span>{formatInlineMarkdown(li.replace(/^[-*•\d.]+\s*/, ""))}</span>
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={paraIdx} className="font-light">
                  {formatInlineMarkdown(para)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// Inline helper for bold, inline code, and highlights
function formatInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-[#234B55]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded-lg bg-[#DCECE8]/70 text-[#234B55] font-mono text-[11px] border border-[#A9D5C8]/50"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function StructuredCard({ guidance }: { guidance: StructuredAIGuidance }) {
  return (
    <div className="space-y-4 text-xs">
      {/* 1. Current Situation */}
      <div className="p-3.5 rounded-2xl liquid-glass border border-[#DCECE8] space-y-1">
        <div className="font-bold text-[#234B55] flex items-center gap-1.5 uppercase font-mono text-[10px]">
          <span>1. Current Situation</span>
        </div>
        <p className="text-[#234B55] leading-relaxed font-light">
          {guidance.currentSituation}
        </p>
      </div>

      {/* 2. What This Means */}
      <div className="p-3.5 rounded-2xl liquid-glass border border-[#DCECE8] space-y-1">
        <div className="font-bold text-[#6BAEAA] flex items-center gap-1.5 uppercase font-mono text-[10px]">
          <span>2. What This Means for Your Body</span>
        </div>
        <p className="text-[#234B55] leading-relaxed font-light">
          {guidance.whatThisMeans}
        </p>
      </div>

      {/* 3. Recommended Actions */}
      <div className="p-3.5 rounded-2xl bg-[#DCECE8]/60 border border-[#A9D5C8] space-y-2 text-[#234B55]">
        <div className="font-bold text-[#234B55] flex items-center gap-1.5 uppercase font-mono text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#234B55]" />
          <span>3. Recommended Actions</span>
        </div>
        <ul className="space-y-1.5">
          {guidance.recommendedActions.map((act, i) => (
            <li key={i} className="flex items-start gap-2 text-[#234B55]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4A9E86] shrink-0 mt-0.5" />
              <span>{act}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Expected Benefits */}
      <div className="p-3.5 rounded-2xl liquid-glass border border-[#DCECE8] space-y-2">
        <div className="font-bold text-[#4A9E86] flex items-center gap-1.5 uppercase font-mono text-[10px]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>4. Expected Benefits</span>
        </div>
        <ul className="space-y-1">
          {guidance.expectedBenefits.map((ben, i) => (
            <li key={i} className="flex items-start gap-2 text-[#687D83]">
              <span className="text-[#4A9E86] font-bold">•</span>
              <span>{ben}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 5. Important Precautions */}
      <div className="p-3.5 rounded-2xl bg-[#E9B978]/15 border border-[#E9B978]/50 space-y-2 text-[#75460E]">
        <div className="font-bold text-[#75460E] flex items-center gap-1.5 uppercase font-mono text-[10px]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#E9B978]" />
          <span>5. Important Precautions</span>
        </div>
        <ul className="space-y-1">
          {guidance.importantPrecautions.map((prec, i) => (
            <li key={i} className="flex items-start gap-2 font-medium">
              <span className="text-[#E9B978] font-bold">!</span>
              <span>{prec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
