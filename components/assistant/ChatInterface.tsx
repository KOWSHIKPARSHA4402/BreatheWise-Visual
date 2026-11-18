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
  Trash2,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { useLocationContext } from "@/context/LocationContext";
import { ChatMessage, StructuredAIGuidance } from "@/lib/types";

const SUGGESTED_QUESTIONS = [
  "Is it safe to go outside right now?",
  "Should my children play outdoors today?",
  "What precautions should our family take today?",
  "How can I improve the air quality inside my home?",
  "What is the best time for outdoor exercise?",
  "What should we do when AQI is Severe (>400)?",
];

export default function ChatInterface() {
  const { airQuality, userPrefs, location } = useLocationContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isFallbackNotice, setIsFallbackNotice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with context welcome message
  useEffect(() => {
    if (messages.length === 0 && airQuality) {
      const welcome: ChatMessage = {
        id: "welcome",
        role: "assistant",
        content: `Hello! I am your BreatheWise AI Environmental Intelligence Assistant. I am continuously monitoring ambient air quality in **${location.name}**.\n\nCurrent CPCB AQI is **${airQuality.cpcbAQI} (${airQuality.cpcbCategory})** with PM2.5 at **${airQuality.pollutants.pm2_5.value} µg/m³**.\n\nHow can I help you or your family navigate today's air conditions?`,
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
    if (!query.trim() || !airQuality || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query.trim(),
          aqiContext: airQuality,
          userPrefs,
          history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat error status: ${res.status}`);
      }

      const data = await res.json();
      setIsFallbackNotice(data.isFallback);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.text,
        structured: data.structured,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Assistant query failed:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "I experienced a temporary network issue. Please ask again or check your connection.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Chat Top Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                BreatheWise AI Assistant
              </h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                Gemini 1.5 Grounded
              </span>
            </div>
            <p className="text-xs text-slate-500 font-light truncate max-w-[240px] sm:max-w-md">
              Grounded in {location.name} AQI: {airQuality?.cpcbAQI ?? "--"} ({airQuality?.cpcbCategory ?? "--"})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <button
              onClick={handleClearChat}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Chips Bar */}
      <div className="px-4 py-2.5 bg-slate-100/50 dark:bg-slate-950/30 border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          <span>Suggestions:</span>
        </span>
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 whitespace-nowrap transition-all shadow-sm shrink-0 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 sm:gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-2xl rounded-2xl p-4 sm:p-5 space-y-3 ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between text-[11px] opacity-70 pb-1 font-mono">
                <span>{msg.role === "user" ? "You" : "BreatheWise AI"}</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Structured Response Cards (5 sections) */}
              {msg.structured ? (
                <StructuredCard guidance={msg.structured} />
              ) : (
                <div className="text-sm font-light leading-relaxed whitespace-pre-line space-y-2">
                  {msg.content}
                </div>
              )}

              {/* Copy Action */}
              {msg.role === "assistant" && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[10px] font-mono">
                    Context: {location.name} CPCB AQI
                  </span>
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Guidance</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
              <span>Analyzing ambient PM2.5, meteorological inversion &amp; family context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about outdoor safety, morning runs, children's health, or HEPA filters..."
            disabled={isLoading}
            className="flex-1 px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-all shadow-md shadow-emerald-600/20"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-400" />
            <span>General educational guidance. Consult physicians for medical diagnoses.</span>
          </span>
          {isFallbackNotice && (
            <span className="font-mono text-emerald-600 dark:text-emerald-400 text-[10px]">
              Active: Scientific CPCB Guidance Engine
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function StructuredCard({ guidance }: { guidance: StructuredAIGuidance }) {
  return (
    <div className="space-y-4 text-xs">
      {/* 1. Current Situation */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
          <span>1. Current Situation</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-light">
          {guidance.currentSituation}
        </p>
      </div>

      {/* 2. What This Means */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase font-mono text-[10px] text-sky-600 dark:text-sky-400">
          <span>2. What This Means for Your Body</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-light">
          {guidance.whatThisMeans}
        </p>
      </div>

      {/* 3. Recommended Actions */}
      <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
        <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 uppercase font-mono text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>3. Recommended Actions</span>
        </div>
        <ul className="space-y-1.5">
          {guidance.recommendedActions.map((act, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{act}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Expected Benefits */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase font-mono text-[10px] text-teal-600 dark:text-teal-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>4. Expected Benefits</span>
        </div>
        <ul className="space-y-1">
          {guidance.expectedBenefits.map((ben, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
              <span className="text-teal-500 font-bold">•</span>
              <span>{ben}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 5. Important Precautions */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
        <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 uppercase font-mono text-[10px]">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>5. Important Precautions</span>
        </div>
        <ul className="space-y-1">
          {guidance.importantPrecautions.map((prec, i) => (
            <li key={i} className="flex items-start gap-2 text-amber-900 dark:text-amber-200 font-medium">
              <span className="text-amber-600 font-bold">!</span>
              <span>{prec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
