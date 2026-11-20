"use client";

import React from "react";
import {
  Thermometer,
  Layers,
  Scale,
} from "lucide-react";

const CPCB_TIERS = [
  {
    range: "0 – 50",
    name: "Good",
    color: "#6BAEAA",
    bgColor: "bg-[#6BAEAA]/15",
    textColor: "text-[#234B55]",
    borderColor: "border-[#6BAEAA]/30",
    meaning: "Minimal health impact. Clean, crisp air safe for all outdoor activities and natural cross-ventilation.",
  },
  {
    range: "51 – 100",
    name: "Satisfactory",
    color: "#A9D5C8",
    bgColor: "bg-[#A9D5C8]/20",
    textColor: "text-[#234B55]",
    borderColor: "border-[#A9D5C8]/40",
    meaning: "Minor breathing discomfort to sensitive people. Generally safe for daily life.",
  },
  {
    range: "101 – 200",
    name: "Moderately Polluted",
    color: "#E9B978",
    bgColor: "bg-[#E9B978]/20",
    textColor: "text-[#915B17]",
    borderColor: "border-[#E9B978]/40",
    meaning: "Breathing discomfort to people with asthma, heart disease, children, and elderly.",
  },
  {
    range: "201 – 300",
    name: "Poor",
    color: "#E9B978",
    bgColor: "bg-[#E9B978]/30",
    textColor: "text-[#834E0F]",
    borderColor: "border-[#E9B978]/60",
    meaning: "Breathing discomfort to most people on prolonged outdoor exposure. Avoid heavy outdoor jogging.",
  },
  {
    range: "301 – 400",
    name: "Very Poor",
    color: "#D98E83",
    bgColor: "bg-[#D98E83]/20",
    textColor: "text-[#9E3E37]",
    borderColor: "border-[#D98E83]/50",
    meaning: "Triggers respiratory illness on prolonged exposure. Wear N95 outdoors, run home air purifiers.",
  },
  {
    range: "401 – 500",
    name: "Severe",
    color: "#B85450",
    bgColor: "bg-[#B85450]/20",
    textColor: "text-[#B85450]",
    borderColor: "border-[#B85450]/50",
    meaning: "Hazardous emergency. Affects healthy people and seriously impacts vulnerable individuals. Stay indoors.",
  },
];

export default function AqiExplainedSection() {
  return (
    <div className="w-full liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCECE8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#465A60] font-bold">
            <Thermometer className="w-4 h-4 text-[#6BAEAA]" />
            <span>Air Quality Index 101</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#234B55] tracking-tight mt-1">
            AQI Explained Like I’m New
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#465A60] max-w-sm sm:text-right font-medium">
          Think of AQI as a 0 to 500 health thermometer for the atmosphere. The higher the score, the more dangerous the air.
        </p>
      </div>

      {/* Explanatory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 sm:p-6 rounded-2xl bg-white/85 border border-[#DCECE8] space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#DCECE8]/70 text-[#234B55]">
              <Layers className="w-5 h-5 text-[#234B55]" />
            </div>
            <h4 className="text-base font-bold text-[#234B55]">
              Rule 1: The Worst Pollutant Sets the Score
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-[#234B55]/95 leading-relaxed">
            People often think AQI is an average of all chemicals. It is <strong>NOT</strong> an average! If 5 gases are clean, but fine dust (PM2.5) is at emergency levels, the final AQI is graded at the emergency level. In environmental science, your lungs are only as safe as the dirtiest pollutant you inhale.
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white/85 border border-[#DCECE8] space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#DCECE8]/70 text-[#234B55]">
              <Scale className="w-5 h-5 text-[#234B55]" />
            </div>
            <h4 className="text-base font-bold text-[#234B55]">
              Rule 2: Why CPCB NAQI and US EPA Differ
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-[#234B55]/95 leading-relaxed">
            India uses the official <strong>CPCB National Air Quality Index (NAQI)</strong> with 6 categories calibrated to Indian ambient conditions. US EPA uses different mathematical piecewise breakpoints. BreatheWise clearly labels the CPCB standard so you never mix up readings!
          </p>
        </div>
      </div>

      {/* CPCB Scale Visual Spectrum */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#465A60]">
            Official Indian CPCB National AQI Scale (0 – 500)
          </span>
          <span className="text-xs text-[#234B55] font-bold">Standard Reference</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {CPCB_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`p-4 sm:p-5 rounded-2xl border ${tier.bgColor} ${tier.borderColor} flex flex-col justify-between space-y-2.5 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-black ${tier.textColor}`}>
                  {tier.name}
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/90 border border-white text-[#234B55] shadow-sm">
                  AQI {tier.range}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#234B55] leading-relaxed">
                {tier.meaning}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
