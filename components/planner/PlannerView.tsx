"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  CalendarCheck2,
  CheckCircle2,
  Circle,
  SlidersHorizontal,
  ShieldCheck,
  RotateCcw,
  Clock,
} from "lucide-react";
import { useLocationContext } from "@/context/LocationContext";
import { UserLifestylePreferences } from "@/lib/types";

export default function PlannerView() {
  const { planItems, togglePlanItem, resetPlanItems, userPrefs, updateUserPrefs, airQuality, location } = useLocationContext();
  const [showPrefsModal, setShowPrefsModal] = useState(false);

  const completedCount = planItems.filter((i) => i.isCompleted).length;
  const progressPercent = planItems.length ? Math.round((completedCount / planItems.length) * 100) : 0;

  const handleToggle = (id: string) => {
    togglePlanItem(id);
    const item = planItems.find((i) => i.id === id);
    if (item && !item.isCompleted && progressPercent >= 75) {
      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10b981", "#06b6d4", "#3b82f6"],
      });
    }
  };

  const phases: Array<"Morning" | "Afternoon" | "Evening" | "Night"> = [
    "Morning",
    "Afternoon",
    "Evening",
    "Night",
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass-dark glow-card-dark text-white relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#6BAEAA]/25 text-[#A9D5C8]">
              <CalendarCheck2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase font-semibold tracking-wider text-[#A9D5C8]">
              Personalized Smog Navigation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Clean Air Plan
          </h1>
          <p className="text-xs sm:text-sm text-[#DCECE8] font-light leading-relaxed">
            Tailored to your daily routine in <span className="font-semibold text-white">{location.name}</span> (Current AQI: {airQuality?.cpcbAQI ?? "--"}). Check off recommendations to reduce personal particulate exposure.
          </p>
        </div>

        {/* Progress & Prefs Trigger */}
        <div className="z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          {/* Progress Card */}
          <div className="p-4 rounded-2xl liquid-glass-dark glow-card-dark text-center space-y-1">
            <div className="text-3xl font-black font-mono">{progressPercent}%</div>
            <div className="text-[11px] font-mono text-[#DCECE8]">
              {completedCount} of {planItems.length} Actions Completed
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-[#6BAEAA] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setShowPrefsModal(true)}
            className="px-4 py-3 rounded-2xl bg-white text-[#234B55] font-bold text-xs hover:bg-[#F4F8F6] transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0 glow-btn"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#234B55]" />
            <span>Edit Lifestyle Profile</span>
          </button>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between text-xs text-[#687D83] px-1 font-mono">
        <span>Dynamic 4-Phase Itinerary</span>
        <button
          onClick={resetPlanItems}
          className="flex items-center gap-1 hover:text-[#234B55] transition-colors glow-btn px-2.5 py-1 rounded-lg"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Checkmarks</span>
        </button>
      </div>

      {/* 4 Phases Timeline Grid */}
      <div className="space-y-6">
        {phases.map((phase) => {
          const phaseItems = planItems.filter((i) => i.phase === phase);
          if (phaseItems.length === 0) return null;

          return (
            <div
              key={phase}
              className="p-5 sm:p-6 rounded-3xl liquid-glass glow-card space-y-4"
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#DCECE8]">
                <Clock className="w-4 h-4 text-[#6BAEAA]" />
                <h2 className="text-base font-bold text-[#234B55]">
                  {phase} Protocol
                </h2>
                <span className="text-[11px] font-mono text-[#687D83]">
                  ({phaseItems.length} recommendations)
                </span>
              </div>

              <div className="space-y-3">
                {phaseItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggle(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 glow-card ${
                      item.isCompleted
                        ? "bg-[#DCECE8]/40 border-[#A9D5C8] opacity-80"
                        : "liquid-glass hover:border-[#6BAEAA]"
                    }`}
                  >
                    <button
                      className="mt-0.5 text-[#234B55] shrink-0"
                      aria-label={item.isCompleted ? "Mark incomplete" : "Mark completed"}
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-[#4A9E86] fill-[#DCECE8]" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#687D83]" />
                      )}
                    </button>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            item.isCompleted
                              ? "line-through text-[#687D83]"
                              : "text-[#234B55]"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#DCECE8]/70 text-[#234B55] font-semibold border border-[#A9D5C8]">
                          {item.category}
                        </span>
                        {item.priority === "High" && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#B85450]/15 text-[#611A17] border border-[#B85450]/30 font-bold">
                            High Priority
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#687D83] font-light leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-2 text-[11px] font-mono text-[#234B55] flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#6BAEAA]" />
                        <span>Benefit: {item.healthBenefit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lifestyle Preferences Modal */}
      {showPrefsModal && (
        <div className="fixed inset-0 z-50 bg-[#234B55]/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl liquid-glass glow-card rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-[#234B55]">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCECE8]">
              <div>
                <h3 className="text-lg font-bold text-[#234B55]">
                  Lifestyle &amp; Household Profile
                </h3>
                <p className="text-xs text-[#687D83]">
                  Updates your daily clean air recommendations dynamically.
                </p>
              </div>
              <button
                onClick={() => setShowPrefsModal(false)}
                className="text-xs font-semibold text-[#687D83] hover:text-[#234B55] px-2.5 py-1.5 rounded-lg bg-[#DCECE8]/60 transition-colors glow-btn"
              >
                Close
              </button>
            </div>

            {/* Commute Mode */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase font-bold text-[#234B55]">
                Primary Commute Method
              </label>
              <select
                value={userPrefs.commuteMode}
                onChange={(e) =>
                  updateUserPrefs({
                    commuteMode: e.target.value as UserLifestylePreferences["commuteMode"],
                  })
                }
                className="w-full p-3 rounded-xl bg-white/70 border border-[#DCECE8] text-sm text-[#234B55] focus:outline-none focus:border-[#6BAEAA] glow-input"
              >
                <option value="metro_train">Electric Metro / Subway Train</option>
                <option value="electric_bus">City Bus / Electric Transit</option>
                <option value="petrol_car">Petrol Passenger Car</option>
                <option value="diesel_car">Diesel Vehicle / SUV</option>
                <option value="motorcycle">Two-Wheeler / Motorcycle</option>
                <option value="bicycle_walk">Active Bicycling / Walking</option>
                <option value="remote_wfh">Remote Work (WFH / Telecommute)</option>
              </select>
            </div>

            {/* Vulnerable Members */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase font-bold text-[#234B55]">
                Household Vulnerability (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: "infants_children", label: "Infants / Children" },
                  { id: "elderly", label: "Elderly Seniors (65+)" },
                  { id: "asthma_respiratory", label: "Asthma / Respiratory Conditions" },
                  { id: "pregnant", label: "Pregnant Household Member" },
                ].map((item) => {
                  const isSelected = userPrefs.vulnerableMembers.includes(
                    item.id as UserLifestylePreferences["vulnerableMembers"][number]
                  );
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        const next = isSelected
                          ? userPrefs.vulnerableMembers.filter((m) => m !== item.id)
                          : [...userPrefs.vulnerableMembers, item.id as UserLifestylePreferences["vulnerableMembers"][number]];
                        updateUserPrefs({ vulnerableMembers: next });
                      }}
                      className={`p-3 rounded-xl border text-left font-medium transition-all glow-btn ${
                        isSelected
                          ? "bg-[#DCECE8] border-[#A9D5C8] text-[#234B55] font-bold glow-selected"
                          : "bg-white/60 border-[#DCECE8] text-[#687D83]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Appliance Checks */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-[#DCECE8] bg-white/60 hover:bg-[#DCECE8]/30 cursor-pointer glow-card">
                <input
                  type="checkbox"
                  checked={userPrefs.hasAirPurifier}
                  onChange={(e) => updateUserPrefs({ hasAirPurifier: e.target.checked })}
                  className="w-4 h-4 text-[#234B55] rounded"
                />
                <span className="text-xs font-medium text-[#234B55]">
                  I have a True-HEPA air purifier in my home
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-[#DCECE8] bg-white/60 hover:bg-[#DCECE8]/30 cursor-pointer glow-card">
                <input
                  type="checkbox"
                  checked={userPrefs.hasKitchenExhaust}
                  onChange={(e) => updateUserPrefs({ hasKitchenExhaust: e.target.checked })}
                  className="w-4 h-4 text-[#234B55] rounded"
                />
                <span className="text-xs font-medium text-[#234B55]">
                  Kitchen has an operational chimney or ducted exhaust fan
                </span>
              </label>
            </div>

            <button
              onClick={() => setShowPrefsModal(false)}
              className="w-full py-3.5 rounded-2xl bg-[#234B55] hover:bg-[#1E414A] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm glow-btn"
            >
              Apply &amp; Refresh Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
