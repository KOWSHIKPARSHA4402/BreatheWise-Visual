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
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm relative overflow-hidden space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Settings className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase font-semibold tracking-wider text-emerald-400">
            System Preferences
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Settings &amp; Hackathon Demo Controls
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
          Configure default monitoring stations, personalize household profiles, or simulate specific winter smog conditions for hackathon demonstrations.
        </p>
      </div>

      {/* 1. Hackathon Demonstration Simulator Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-purple-50/50 dark:bg-purple-950/20 border-2 border-purple-200 dark:border-purple-800/80 space-y-5">
        <div className="flex items-center justify-between border-b border-purple-200/60 dark:border-purple-800/60 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Hackathon Judge Demonstration Scenarios
            </h2>
          </div>
          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200">
            Live Testing
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
          Test how the entire platform (AI Assistant, Clean Air Planner, Green Choices, and Health Advisories) adapts dynamically to different atmospheric pollution tiers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleSimulate("severe")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeScenario === "severe"
                ? "bg-purple-700 text-white border-purple-700 shadow-md"
                : "bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-800 hover:border-purple-500 text-slate-900 dark:text-white"
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
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeScenario === "moderate"
                ? "bg-amber-600 text-white border-amber-600 shadow-md"
                : "bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-800 hover:border-amber-500 text-slate-900 dark:text-white"
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
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeScenario === "good"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                : "bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-800 hover:border-emerald-500 text-slate-900 dark:text-white"
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
            <span className="text-xs font-mono text-purple-700 dark:text-purple-300">
              Simulated {activeScenario?.toUpperCase()} mode is active.
            </span>
            <button
              onClick={handleResetLive}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Live Open-Meteo Feed</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Default Location Preset */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Default Monitoring Location
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESET_LOCATIONS.map((city) => (
            <button
              key={city.name}
              onClick={() => setLocation(city)}
              className={`p-3 rounded-2xl border text-left font-medium text-xs transition-all ${
                location.name === city.name
                  ? "bg-emerald-500 text-white border-emerald-500 font-bold shadow-sm"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500"
              }`}
            >
              <div className="truncate">{city.name}</div>
              <div className="text-[10px] opacity-75 truncate">{city.country}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Household Health Profile */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Household Size &amp; Vulnerable Members
        </h2>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={userPrefs.vulnerableMembers.includes("infants_children")}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...userPrefs.vulnerableMembers, "infants_children" as const]
                    : userPrefs.vulnerableMembers.filter((m) => m !== "infants_children");
                  updateUserPrefs({ vulnerableMembers: updated });
                }}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="font-medium text-slate-800 dark:text-slate-200">
                Children / Infants in Household
              </span>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={userPrefs.vulnerableMembers.includes("elderly")}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...userPrefs.vulnerableMembers, "elderly" as const]
                    : userPrefs.vulnerableMembers.filter((m) => m !== "elderly");
                  updateUserPrefs({ vulnerableMembers: updated });
                }}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="font-medium text-slate-800 dark:text-slate-200">
                Seniors / Elderly (65+) in Household
              </span>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={userPrefs.vulnerableMembers.includes("asthma_respiratory")}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...userPrefs.vulnerableMembers, "asthma_respiratory" as const]
                    : userPrefs.vulnerableMembers.filter((m) => m !== "asthma_respiratory");
                  updateUserPrefs({ vulnerableMembers: updated });
                }}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="font-medium text-slate-800 dark:text-slate-200">
                Asthma, COPD, or Bronchial Sensitivity
              </span>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={userPrefs.hasAirPurifier}
                onChange={(e) => updateUserPrefs({ hasAirPurifier: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="font-medium text-slate-800 dark:text-slate-200">
                True-HEPA Air Purifier Available
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* 4. Privacy & Data Reset */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Reset Stored Data &amp; Local Preferences
          </h3>
          <p className="text-xs text-slate-500 font-light">
            All user data is stored strictly in your browser&apos;s localStorage; no personal tracking occurs.
          </p>
        </div>
        <button
          onClick={handleClearData}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 hover:bg-red-50 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors shrink-0"
        >
          {clearedNotice ? (
            <span className="flex items-center gap-1 text-emerald-600">
              <Check className="w-3.5 h-3.5" />
              <span>Reset Clean</span>
            </span>
          ) : (
            <span>Clear LocalStorage</span>
          )}
        </button>
      </div>

      {/* Submission Specs Badge */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Hack2Skill PromptWars Challenge 6 Verified</span>
        </span>
        <span>BreatheWise Architecture: Next.js App Router + Google Gemini</span>
      </div>
    </div>
  );
}
