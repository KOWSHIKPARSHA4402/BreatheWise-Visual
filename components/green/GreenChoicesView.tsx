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
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white border border-emerald-800/60 shadow-sm relative overflow-hidden space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase font-semibold tracking-wider text-emerald-300">
            AQI-Sensitive Sustainability
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Green Choices &amp; Sustainable Alternatives
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/80 font-light max-w-2xl leading-relaxed">
          Practical lifestyle shifts that lower your urban carbon footprint while intelligently protecting your family&apos;s lungs based on real-time ambient AQI in <span className="font-semibold text-white">{location.name}</span>.
        </p>
      </div>

      {/* Real-time Dynamic Advisory Banner */}
      {isSevere ? (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs flex items-center gap-3 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Severe Smog Override:</strong> Under current ambient conditions ({airQuality?.cpcbAQI} AQI), outdoor walking and cycling are flagged as high respiratory risk. Prioritize electric enclosed metro transit or telecommuting until dispersion improves.
          </span>
        </div>
      ) : isGoodOrSatisfactory ? (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs flex items-center gap-3 text-emerald-900 dark:text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
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
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
                isUnsuitableNow
                  ? "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 opacity-70"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50"
              }`}
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {choice.category}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: choice.practicalityRating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-500" />
                    ))}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {choice.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                  {choice.description}
                </p>

                {/* AQI Sensitivity Alert */}
                {isUnsuitableNow && (
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-medium">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                    <span>Postpone: Inhaling deep air during Severe smog causes alveolar damage.</span>
                  </div>
                )}

                {/* Action Specification */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                    Practical Recommendation
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-light">
                    {choice.recommendedAction}
                  </p>
                </div>

                {/* Impacts Breakdown */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                    <span className="text-slate-500">Tailpipe Offset:</span>
                    <span className="font-semibold text-right max-w-[170px]">{choice.tailpipeImpact}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span className="text-slate-500">Health Impact:</span>
                    <span className="font-light text-right max-w-[170px]">{choice.healthImpact}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Cost: <span className="font-semibold text-slate-800 dark:text-slate-200">{choice.costImpact}</span></span>
                <span className="text-emerald-600 font-semibold">{choice.badgeText}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
