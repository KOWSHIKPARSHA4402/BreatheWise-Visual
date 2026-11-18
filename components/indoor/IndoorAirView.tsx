"use client";

import React, { useState } from "react";
import {
  Home,
  AlertTriangle,
  Wind,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { INDOOR_PILLARS, calculateRequiredCADR } from "@/lib/indoor-data";

export default function IndoorAirView() {
  const [length, setLength] = useState<number>(5);
  const [width, setWidth] = useState<number>(4);
  const [height, setHeight] = useState<number>(2.7);
  const [ach, setAch] = useState<number>(5); // 5 Air Changes per Hour for high protection

  const cadrResults = calculateRequiredCADR(length, width, height, ach);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 text-white border border-slate-800 shadow-sm relative overflow-hidden space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Home className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase font-semibold tracking-wider text-indigo-300">
            Residential Protection Hub
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Indoor Air Quality Improvement Centre
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
          Families spend 80% to 90% of their day indoors during severe winter smog episodes. Learn evidence-based techniques to convert your home into a certified clean-air sanctuary.
        </p>
      </div>

      {/* Critical Hazard Alert: No Ozone / Ionic Cleaners */}
      <div className="p-5 rounded-3xl bg-red-50 dark:bg-red-950/30 border-2 border-red-300 dark:border-red-800/80 space-y-2">
        <div className="flex items-center gap-2.5 font-bold text-red-800 dark:text-red-300 text-sm sm:text-base">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>CRITICAL HAZARD WARNING: Avoid Ozone &amp; Ionic Air Cleaners</span>
        </div>
        <p className="text-xs text-red-700 dark:text-red-300 font-light leading-relaxed">
          Never purchase air purifiers labeled as &quot;ozone generators&quot;, &quot;ionizers&quot;, &quot;plasma generators&quot;, or &quot;electrostatic precipitation&quot;. Ground-level ozone is an aggressive lung irritant that damages mucosal tissue, triggers severe asthma attacks, and reacts with indoor terpenes to create secondary toxic formaldehyde. Insist exclusively on mechanical <strong>True-HEPA (H13/H14)</strong> filtration.
        </p>
      </div>

      {/* Interactive CADR & Room Size Calculator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Interactive Purifier Sizing &amp; CADR Calculator
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Determine the exact Clean Air Delivery Rate (CADR) required for your living room or bedroom.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            Target: 5 Air Changes/Hr
          </span>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase font-bold text-slate-600 dark:text-slate-400">
              Length (Meters)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              step="0.5"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value) || 1)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase font-bold text-slate-600 dark:text-slate-400">
              Width (Meters)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              step="0.5"
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value) || 1)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase font-bold text-slate-600 dark:text-slate-400">
              Ceiling Height (Meters)
            </label>
            <input
              type="number"
              min="2"
              max="6"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 2.7)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase font-bold text-slate-600 dark:text-slate-400">
              Air Changes (ACH)
            </label>
            <select
              value={ach}
              onChange={(e) => setAch(parseInt(e.target.value) || 5)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white"
            >
              <option value="3">3 ACH (Mild Pollution)</option>
              <option value="4">4 ACH (Moderate Smog)</option>
              <option value="5">5 ACH (Severe Smog / Recommended)</option>
              <option value="6">6 ACH (High-Risk Asthma Patient)</option>
            </select>
          </div>
        </div>

        {/* Calculation Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 dark:text-emerald-300">
              Room Air Volume
            </span>
            <div className="text-2xl font-black font-mono text-emerald-900 dark:text-emerald-100">
              {cadrResults.volumeM3} m³
            </div>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 font-mono">
              ({cadrResults.volumeCuFt} cubic feet)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-teal-800 dark:text-teal-300">
              Required CADR Rating
            </span>
            <div className="text-2xl font-black font-mono text-teal-900 dark:text-teal-100">
              {cadrResults.requiredCadrM3H} m³/h
            </div>
            <p className="text-[11px] text-teal-700/80 dark:text-teal-300/80 font-mono">
              ({cadrResults.requiredCadrCFM} CFM)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-600 dark:text-slate-400">
              Purifier Sizing Class
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
              {cadrResults.recommendedPurifierClass}
            </div>
            <p className="text-[11px] text-slate-500 font-light">
              Look for this minimum CADR on product labels.
            </p>
          </div>
        </div>
      </div>

      {/* 5 Scientific Clean Air Pillars */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            The 5 Science-Backed Indoor Air Pillars
          </h2>
          <p className="text-xs text-slate-500 font-light">
            Comprehensive residential mitigation strategies approved by environmental health agencies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {INDOOR_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {pillar.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Cost: {pillar.estimatedCost}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {pillar.title}
                </h3>

                {/* Problem Statement */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs space-y-1">
                  <span className="font-mono font-bold text-slate-500 uppercase text-[10px]">
                    The Indoor Hazard
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 font-light">
                    {pillar.problem}
                  </p>
                </div>

                {/* Action & Why */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Recommended Action:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                      {pillar.recommendedAction}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block">
                      Expected Health Benefit:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                      {pillar.expectedBenefit}
                    </p>
                  </div>
                </div>

                {/* Do's and Don'ts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-1.5">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Best Practices</span>
                    </span>
                    <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px] font-light">
                      {pillar.dos.slice(0, 2).map((d, idx) => (
                        <li key={idx} className="leading-tight">• {d}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 space-y-1.5">
                    <span className="font-bold text-red-800 dark:text-red-300 flex items-center gap-1 text-[11px]">
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      <span>Avoid Strictly</span>
                    </span>
                    <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px] font-light">
                      {pillar.donts.map((d, idx) => (
                        <li key={idx} className="leading-tight">• {d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Mechanism: {pillar.whyItHelps.slice(0, 90)}...</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
