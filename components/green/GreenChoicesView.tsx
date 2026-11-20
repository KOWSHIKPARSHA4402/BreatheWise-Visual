"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ShieldAlert,
  Star,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { GREEN_CHOICES } from "@/lib/green-data";
import { useLocationContext } from "@/context/LocationContext";

export default function GreenChoicesView() {
  const { airQuality, location } = useLocationContext();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const isSevere = (airQuality?.cpcbAQI ?? 0) > 300;
  const isGoodOrSatisfactory = (airQuality?.cpcbAQI ?? 0) <= 100;

  const categories = [
    "All",
    "Commute & Transit",
    "Errands & Shopping",
    "Heating & Winter Habits",
    "Community Action",
  ];

  const filteredChoices = GREEN_CHOICES.filter(
    (c) => selectedCategory === "All" || c.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass-dark glow-card-dark text-white relative overflow-hidden space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#6BAEAA]/20 text-[#A9D5C8]">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase font-semibold tracking-wider text-[#A9D5C8]">
            AQI-Sensitive Sustainability
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Green Choices &amp; Sustainable Alternatives
        </h1>
        <p className="text-xs sm:text-sm text-[#DCECE8]/90 font-light max-w-2xl leading-relaxed">
          Practical lifestyle shifts that lower your urban carbon footprint while intelligently protecting your family&apos;s lungs based on real-time ambient AQI in <span className="font-semibold text-white">{location.name}</span>.
        </p>
      </div>

      {/* Real-time Dynamic Advisory Banner */}
      {isSevere ? (
        <div className="p-4 rounded-2xl bg-[#D98E83]/15 border border-[#D98E83]/30 text-xs flex items-center gap-3 text-[#8F3E37] glow-card">
          <AlertTriangle className="w-5 h-5 text-[#B85450] shrink-0" />
          <span>
            <strong>Severe Smog Override:</strong> Under current ambient conditions ({airQuality?.cpcbAQI} AQI), outdoor walking and cycling are flagged as high respiratory risk. Prioritize electric enclosed metro transit or telecommuting until dispersion improves.
          </span>
        </div>
      ) : isGoodOrSatisfactory ? (
        <div className="p-4 rounded-2xl bg-[#DCECE8] border border-[#A9D5C8] text-xs flex items-center gap-3 text-[#234B55] glow-card">
          <CheckCircle2 className="w-5 h-5 text-[#4A9E86] shrink-0" />
          <span>
            <strong>Clean Air Window:</strong> Current AQI in {location.name} is satisfactory ({airQuality?.cpcbAQI} AQI). Active cycling and walking are highly recommended for short errands today!
          </span>
        </div>
      ) : null}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all glow-btn ${
              selectedCategory === cat
                ? "bg-[#234B55] text-white shadow-sm glow-selected"
                : "bg-white/70 border border-[#DCECE8] text-[#687D83] hover:text-[#234B55] hover:border-[#6BAEAA]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredChoices.map((choice) => {
          // Check if this choice is unsuitable right now
          const isUnsuitableNow = choice.aqiCondition === "good_moderate_only" && isSevere;

          return (
            <div
              key={choice.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 glow-card ${
                isUnsuitableNow
                  ? "bg-[#F4F8F6]/60 border-[#DCECE8] opacity-75"
                  : "liquid-glass hover:border-[#6BAEAA]"
              }`}
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-[#DCECE8]/60 text-[#234B55]">
                    {choice.category}
                  </span>
                  <div className="flex items-center gap-0.5 text-[#E9B978]">
                    {Array.from({ length: choice.practicalityRating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#E9B978]" />
                    ))}
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#234B55] leading-snug">
                  {choice.title}
                </h3>

                <p className="text-xs text-[#687D83] font-light leading-relaxed">
                  {choice.description}
                </p>

                {/* AQI Sensitivity Alert */}
                {isUnsuitableNow && (
                  <div className="p-2.5 rounded-xl bg-[#E9B978]/15 border border-[#E9B978]/30 text-[11px] text-[#8B6429] flex items-center gap-1.5 font-medium glow-card">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-[#E9B978]" />
                    <span>Postpone: Inhaling deep air during Severe smog causes alveolar damage.</span>
                  </div>
                )}

                {/* Action Specification */}
                <div className="p-3 rounded-xl liquid-glass glow-card text-xs space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#687D83]">
                    Practical Recommendation
                  </span>
                  <p className="text-[#234B55] leading-relaxed font-light">
                    {choice.recommendedAction}
                  </p>
                </div>

                {/* Impacts Breakdown */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-[#4A9E86]">
                    <span className="text-[#687D83]">Tailpipe Offset:</span>
                    <span className="font-semibold text-right max-w-[170px]">{choice.tailpipeImpact}</span>
                  </div>
                  <div className="flex justify-between text-[#234B55]">
                    <span className="text-[#687D83]">Health Impact:</span>
                    <span className="font-light text-right max-w-[170px]">{choice.healthImpact}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#DCECE8] flex items-center justify-between text-xs font-mono text-[#687D83]">
                <span>Cost: <span className="font-semibold text-[#234B55]">{choice.costImpact}</span></span>
                <span className="text-[#4A9E86] font-semibold">{choice.badgeText}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
