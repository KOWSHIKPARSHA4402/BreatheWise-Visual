"use client";

import React from "react";
import { Sparkles, Sliders, Info } from "lucide-react";
import { useLocationContext } from "@/context/LocationContext";

export default function ModeSelector() {
  const { experienceMode, setExperienceMode } = useLocationContext();

  return (
    <div className="w-full liquid-glass rounded-2xl p-2 sm:p-2.5 border border-white/70 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Label and Explainer */}
      <div className="flex items-center gap-2.5 px-2">
        <div className="p-2 rounded-xl bg-[#6BAEAA]/20 text-[#234B55]">
          <Info className="w-4 h-4 text-[#234B55]" />
        </div>
        <div>
          <span className="text-xs sm:text-sm font-bold text-[#234B55] block">
            Experience Level
          </span>
          <span className="text-xs text-[#465A60] font-medium">
            {experienceMode === "simple"
              ? "Simple Mode: Clear everyday language, practical health advice, zero jargon."
              : "Expert Mode: In-depth telemetry, chemical thresholds, and multi-day trajectory analytics."}
          </span>
        </div>
      </div>

      {/* Pill Toggle */}
      <div className="flex items-center bg-[#DCECE8]/70 p-1.5 rounded-xl w-full sm:w-auto self-stretch sm:self-auto justify-center border border-[#A9D5C8]/50">
        <button
          type="button"
          onClick={() => setExperienceMode("simple")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all glow-btn ${
            experienceMode === "simple"
              ? "bg-white text-[#234B55] shadow-md border border-white/90 ring-1 ring-[#6BAEAA]/40"
              : "text-[#465A60] hover:text-[#234B55]"
          }`}
          aria-pressed={experienceMode === "simple"}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#6BAEAA]" />
          <span>Simple Mode</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCECE8] text-[#234B55] ml-1 font-bold">
            Default
          </span>
        </button>

        <button
          type="button"
          onClick={() => setExperienceMode("expert")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all glow-btn ${
            experienceMode === "expert"
              ? "bg-white text-[#234B55] shadow-md border border-white/90 ring-1 ring-[#6BAEAA]/40"
              : "text-[#465A60] hover:text-[#234B55]"
          }`}
          aria-pressed={experienceMode === "expert"}
        >
          <Sliders className="w-3.5 h-3.5 text-[#234B55]" />
          <span>Expert Mode</span>
        </button>
      </div>
    </div>
  );
}
