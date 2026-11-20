"use client";

import React, { useState } from "react";
import {
  Settings,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useLocationContext } from "@/context/LocationContext";
import { PRESET_LOCATIONS } from "@/lib/open-meteo";

export default function SettingsView() {
  const {
    location,
    setLocation,
    demoMode,
    setDemoMode,
    simulateAqiScenario,
    refreshAirQuality,
    userPrefs,
    updateUserPrefs,
  } = useLocationContext();

  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleSimulate = (scenario: "severe" | "moderate" | "good") => {
    setActiveScenario(scenario);
    setDemoMode(true);
    simulateAqiScenario(scenario);
  };

  const handleResetLive = () => {
    setActiveScenario(null);
    setDemoMode(false);
    refreshAirQuality();
  };

  const handleClearData = () => {
    try {
      localStorage.clear();
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3000);
    } catch (e) {
      console.warn("Storage clear error:", e);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass-dark glow-card-dark text-white relative overflow-hidden space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#6BAEAA]/20 text-[#A9D5C8]">
            <Settings className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase font-semibold tracking-wider text-[#A9D5C8]">
            System Preferences
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Settings &amp; Hackathon Demo Controls
        </h1>
        <p className="text-xs sm:text-sm text-[#DCECE8]/90 font-light leading-relaxed">
          Configure default monitoring stations, personalize household profiles, or simulate specific winter smog conditions for hackathon demonstrations.
        </p>
      </div>

      {/* 1. Hackathon Demonstration Simulator Card */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass glow-card space-y-5">
        <div className="flex items-center justify-between border-b border-[#DCECE8] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#6BAEAA]" />
            <h2 className="text-base font-bold text-[#234B55]">
              Hackathon Judge Demonstration Scenarios
            </h2>
          </div>
          <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#DCECE8] text-[#234B55]">
            Live Testing
          </span>
        </div>

        <p className="text-xs text-[#687D83] font-light leading-relaxed">
          Test how the entire platform (AI Assistant, Clean Air Planner, Green Choices, and Health Advisories) adapts dynamically to different atmospheric pollution tiers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleSimulate("severe")}
            className={`p-4 rounded-2xl border text-left transition-all glow-btn ${
              activeScenario === "severe"
                ? "bg-[#B85450] text-white border-[#B85450] shadow-md glow-selected"
                : "bg-white/70 border-[#DCECE8] hover:border-[#B85450] text-[#234B55]"
            }`}
          >
            <div className="text-[10px] font-mono uppercase font-bold opacity-80">Scenario 1</div>
            <div className="text-sm font-bold mt-1">Severe Smog (425 AQI)</div>
            <p className="text-[11px] opacity-75 mt-1">
              Tests emergency protocols, N95 mandates, and window sealing.
            </p>
          </button>

          <button
            onClick={() => handleSimulate("moderate")}
            className={`p-4 rounded-2xl border text-left transition-all glow-btn ${
              activeScenario === "moderate"
                ? "bg-[#E9B978] text-[#234B55] border-[#E9B978] font-bold shadow-md glow-selected"
                : "bg-white/70 border-[#DCECE8] hover:border-[#E9B978] text-[#234B55]"
            }`}
          >
            <div className="text-[10px] font-mono uppercase font-bold opacity-80">Scenario 2</div>
            <div className="text-sm font-bold mt-1">Moderate Haze (145 AQI)</div>
            <p className="text-[11px] opacity-75 mt-1">
              Tests sensitive group caution and afternoon ventilation timing.
            </p>
          </button>

          <button
            onClick={() => handleSimulate("good")}
            className={`p-4 rounded-2xl border text-left transition-all glow-btn ${
              activeScenario === "good"
                ? "bg-[#4A9E86] text-white border-[#4A9E86] shadow-md glow-selected"
                : "bg-white/70 border-[#DCECE8] hover:border-[#4A9E86] text-[#234B55]"
            }`}
          >
            <div className="text-[10px] font-mono uppercase font-bold opacity-80">Scenario 3</div>
            <div className="text-sm font-bold mt-1">Clean Air Day (38 AQI)</div>
            <p className="text-[11px] opacity-75 mt-1">
              Tests active outdoor cycling &amp; full cross-ventilation permissions.
            </p>
          </button>
        </div>

        {demoMode && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-[#234B55] font-semibold">
              Simulated {activeScenario?.toUpperCase()} mode is active.
            </span>
            <button
              onClick={handleResetLive}
              className="px-3 py-1.5 rounded-xl bg-white/70 border border-[#DCECE8] text-xs font-semibold text-[#234B55] hover:bg-[#DCECE8] flex items-center gap-1.5 shadow-sm glow-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Live Open-Meteo Feed</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Default Location Preset */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass glow-card space-y-4">
        <h2 className="text-base font-bold text-[#234B55]">
          Default Monitoring Location
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESET_LOCATIONS.map((city) => (
            <button
              key={city.name}
              onClick={() => setLocation(city)}
              className={`p-3 rounded-2xl border text-left font-medium text-xs transition-all glow-btn ${
                location.name === city.name
                  ? "bg-[#234B55] text-white border-[#234B55] font-bold shadow-sm glow-selected"
                  : "bg-white/60 border-[#DCECE8] text-[#234B55] hover:border-[#6BAEAA]"
              }`}
            >
              <div className="truncate">{city.name}</div>
              <div className="text-[10px] opacity-75 truncate">{city.country}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Household Health Profile */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass glow-card space-y-4">
        <h2 className="text-base font-bold text-[#234B55]">
          Household Size &amp; Vulnerable Members
        </h2>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#DCECE8] hover:bg-[#F4F8F6] cursor-pointer text-[#234B55]">
              <input
                type="checkbox"
                checked={userPrefs.vulnerableMembers.includes("infants_children")}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...userPrefs.vulnerableMembers, "infants_children" as const]
                    : userPrefs.vulnerableMembers.filter((m) => m !== "infants_children");
                  updateUserPrefs({ vulnerableMembers: updated });
                }}
                className="w-4 h-4 accent-[#234B55] rounded"
              />
              <span className="font-medium">
                Children / Infants in Household
              </span>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#DCECE8] hover:bg-[#F4F8F6] cursor-pointer text-[#234B55]">
              <input
                type="checkbox"
                checked={userPrefs.vulnerableMembers.includes("elderly")}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...userPrefs.vulnerableMembers, "elderly" as const]
                    : userPrefs.vulnerableMembers.filter((m) => m !== "elderly");
                  updateUserPrefs({ vulnerableMembers: updated });
                }}
                className="w-4 h-4 accent-[#234B55] rounded"
              />
              <span className="font-medium">
                Seniors / Elderly (65+) in Household
              </span>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#DCECE8] hover:bg-[#F4F8F6] cursor-pointer text-[#234B55]">
              <input
                type="checkbox"
                checked={userPrefs.vulnerableMembers.includes("asthma_respiratory")}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...userPrefs.vulnerableMembers, "asthma_respiratory" as const]
                    : userPrefs.vulnerableMembers.filter((m) => m !== "asthma_respiratory");
                  updateUserPrefs({ vulnerableMembers: updated });
                }}
                className="w-4 h-4 accent-[#234B55] rounded"
              />
              <span className="font-medium">
                Asthma, COPD, or Bronchial Sensitivity
              </span>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#DCECE8] hover:bg-[#F4F8F6] cursor-pointer text-[#234B55]">
              <input
                type="checkbox"
                checked={userPrefs.hasAirPurifier}
                onChange={(e) => updateUserPrefs({ hasAirPurifier: e.target.checked })}
                className="w-4 h-4 accent-[#234B55] rounded"
              />
              <span className="font-medium">
                True-HEPA Air Purifier Available
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* 4. Privacy & Data Reset */}
      <div className="p-6 rounded-3xl bg-[#F4F8F6] border border-[#DCECE8] flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-[#234B55] text-sm">
            Reset Stored Data &amp; Local Preferences
          </h3>
          <p className="text-xs text-[#687D83] font-light">
            All user data is stored strictly in your browser&apos;s localStorage; no personal tracking occurs.
          </p>
        </div>
        <button
          onClick={handleClearData}
          className="px-4 py-2 rounded-xl bg-white border border-[#D98E83]/60 hover:bg-[#D98E83]/10 text-xs font-semibold text-[#B85450] transition-colors shrink-0"
        >
          {clearedNotice ? (
            <span className="flex items-center gap-1 text-[#4A9E86]">
              <Check className="w-3.5 h-3.5" />
              <span>Reset Clean</span>
            </span>
          ) : (
            <span>Clear LocalStorage</span>
          )}
        </button>
      </div>

      {/* Submission Specs Badge */}
      <div className="p-4 rounded-2xl bg-white border border-[#DCECE8] text-xs font-mono text-[#687D83] flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[#234B55] font-bold">
          <ShieldCheck className="w-4 h-4 text-[#4A9E86]" />
          <span>Hack2Skill PromptWars Challenge 6 Verified</span>
        </span>
        <span>BreatheWise Architecture: Next.js App Router + Google Gemini</span>
      </div>
    </div>
  );
}
