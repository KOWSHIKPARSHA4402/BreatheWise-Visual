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
        <h2 className="text-xl font-bold text-[#234B55] tracking-tight flex items-center gap-2">
          <span>Environmental Impact &amp; Community Vigilance</span>
        </h2>
        <p className="text-xs text-[#687D83] font-light">
          Track collective emissions reductions and access municipal pollution reporting tools.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Environmental Impact Summary & Weekly Progress (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl liquid-glass glow-card flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCECE8] pb-3">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#6BAEAA]" />
                <span className="text-xs font-mono uppercase font-bold text-[#234B55]">
                  My Environmental Impact Summary
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#234B55] bg-[#DCECE8]/70 px-2 py-0.5 rounded-full border border-[#A9D5C8]">
                DEFRA Factors
              </span>
            </div>

            {/* Impact Metrics Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl liquid-glass glow-card space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#687D83] block">
                  Monthly CO₂e Saved
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono text-[#234B55]">
                  58.9 <span className="text-xs font-normal text-[#687D83]">kg</span>
                </div>
                <span className="text-[10px] text-[#687D83] font-mono">From WFH &amp; Transit</span>
              </div>

              <div className="p-3.5 rounded-2xl liquid-glass glow-card space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#687D83] block">
                  Vehicle Km Avoided
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono text-[#6BAEAA]">
                  346 <span className="text-xs font-normal text-[#687D83]">km</span>
                </div>
                <span className="text-[10px] text-[#687D83] font-mono">Tailpipe cut</span>
              </div>

              <div className="p-3.5 rounded-2xl liquid-glass glow-card space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#687D83] flex items-center gap-1">
                  <Trees className="w-3 h-3 text-[#4A9E86]" />
                  <span>Tree Equivalent</span>
                </span>
                <div className="text-xl sm:text-2xl font-black font-mono text-[#4A9E86]">
                  32.5 <span className="text-xs font-normal text-[#687D83]">trees</span>
                </div>
                <span className="text-[10px] text-[#687D83] font-mono">Annual absorption</span>
              </div>
            </div>

            {/* Weekly Clean Air Plan Progress Bar */}
            <div className="p-4 rounded-2xl liquid-glass glow-card space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#234B55] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#6BAEAA]" />
                  <span>Weekly Clean Air Plan Progress</span>
                </span>
                <span className="font-mono font-bold text-[#234B55]">
                  {completedCount} of {totalCount} completed ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-[#DCECE8] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#234B55] to-[#6BAEAA] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(10, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#DCECE8] flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-[#687D83] flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#E9B978]" />
              <span>Earned 590 Clean Air Points</span>
            </span>
            <Link
              href="/calculator"
              className="text-xs font-bold text-[#234B55] hover:text-[#6BAEAA] flex items-center gap-1 transition-colors group"
            >
              <span>Detailed Impact Calculator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column: Community Awareness & Civic Action Card (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl liquid-glass glow-card flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCECE8] pb-3">
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-[#6BAEAA]" />
                <span className="text-xs font-mono uppercase font-bold text-[#234B55]">
                  Community Pollution Awareness
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#234B55] bg-[#DCECE8]/70 px-2 py-0.5 rounded-full border border-[#A9D5C8]">
                Civic Action
              </span>
            </div>

            {/* Waste Burning Reporting Alert Box */}
            <div className="p-4 rounded-2xl bg-[#B85450]/10 border border-[#B85450]/30 space-y-2 glow-card">
              <div className="flex items-center gap-2 text-xs font-bold text-[#B85450] font-mono">
                <Flame className="w-4 h-4 text-[#B85450] shrink-0" />
                <span>Report Illegal Garbage &amp; Leaf Burning</span>
              </div>
              <p className="text-[11px] text-[#72271E] font-light leading-relaxed">
                Open burning releases dense polycyclic hydrocarbons into residential areas. Use the official <strong>CPCB Sameer App</strong> or municipal 311 lines to dispatch quick response teams with geotagged photos.
              </p>
            </div>

            {/* Mask Selection Quick Tip */}
            <div className="p-4 rounded-2xl liquid-glass glow-card space-y-1 text-xs">
              <span className="font-mono text-[10px] uppercase font-bold text-[#687D83] block">
                N95 vs. Cloth Mask Notice
              </span>
              <p className="text-[#687D83] font-light leading-relaxed text-[11px]">
                Cloth masks filter &lt; 15% of sub-micron particles. Always choose certified, well-sealed N95 or FFP2 respirators when AQI exceeds 200.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#DCECE8] flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-[#687D83]">
              Community Action Hub
            </span>
            <Link
              href="/community"
              className="text-xs font-bold text-[#234B55] hover:text-[#6BAEAA] flex items-center gap-1 transition-colors group"
            >
              <span>Explore Awareness Hub</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
