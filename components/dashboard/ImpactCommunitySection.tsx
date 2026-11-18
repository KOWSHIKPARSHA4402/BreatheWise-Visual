"use client";

import React from "react";
import Link from "next/link";
import {
  Leaf,
  Trees,
  Award,
  Users2,
  Flame,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useLocationContext } from "@/context/LocationContext";

export default function ImpactCommunitySection() {
  const { planItems } = useLocationContext();

  const completedCount = planItems.filter((i) => i.isCompleted).length;
  const totalCount = planItems.length || 5;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Environmental Impact &amp; Community Vigilance</span>
        </h2>
        <p className="text-xs text-slate-400 font-light">
          Track collective emissions reductions and access municipal pollution reporting tools.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Environmental Impact Summary & Weekly Progress (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono uppercase font-bold text-white">
                  My Environmental Impact Summary
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                DEFRA Factors
              </span>
            </div>

            {/* Impact Metrics Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#131d33] border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Monthly CO₂e Saved
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                  58.9 <span className="text-xs font-normal text-slate-400">kg</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">From WFH &amp; Transit</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#131d33] border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Vehicle Km Avoided
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono text-sky-400">
                  346 <span className="text-xs font-normal text-slate-400">km</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Tailpipe exhaust cut</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#131d33] border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                  <Trees className="w-3 h-3 text-teal-400" />
                  <span>Tree Equivalent</span>
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono text-teal-300">
                  32.5 <span className="text-xs font-normal text-slate-400">trees</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Annual absorption</span>
              </div>
            </div>

            {/* Weekly Clean Air Plan Progress Bar */}
            <div className="p-4 rounded-2xl bg-[#131d33] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Weekly Clean Air Plan Progress</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {completedCount} of {totalCount} completed ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(10, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Earned 590 Clean Air Points</span>
            </span>
            <Link
              href="/calculator"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Detailed Impact Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Community Awareness & Civic Action Card (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-mono uppercase font-bold text-white">
                  Community Pollution Awareness
                </span>
              </div>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded-full border border-sky-800">
                Civic Action
              </span>
            </div>

            {/* Waste Burning Reporting Alert Box */}
            <div className="p-4 rounded-2xl bg-red-950/30 border border-red-900/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-300 font-mono">
                <Flame className="w-4 h-4 text-red-500 shrink-0" />
                <span>Report Illegal Garbage &amp; Leaf Burning</span>
              </div>
              <p className="text-[11px] text-slate-300 font-light leading-relaxed">
                Open burning releases dense polycyclic hydrocarbons into residential areas. Use the official <strong>CPCB Sameer App</strong> or municipal 311 lines to dispatch quick response teams with geotagged photos.
              </p>
            </div>

            {/* Mask Selection Quick Tip */}
            <div className="p-4 rounded-2xl bg-[#131d33] border border-slate-800 space-y-1 text-xs">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">
                N95 vs. Cloth Mask Notice
              </span>
              <p className="text-slate-300 font-light leading-relaxed text-[11px]">
                Cloth masks filter &lt; 15% of sub-micron particles. Always choose certified, well-sealed N95 or FFP2 respirators when AQI exceeds 200.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-slate-400">
              Community Action Hub
            </span>
            <Link
              href="/community"
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <span>Explore Awareness Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
