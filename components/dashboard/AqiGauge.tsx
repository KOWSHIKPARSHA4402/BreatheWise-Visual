"use client";

import React from "react";
import { getCategoryTheme } from "@/lib/aqi-calculator";
import { AQICategory } from "@/lib/types";

interface AqiGaugeProps {
  aqi: number;
  category: AQICategory;
  dominantPollutant: string;
}

export default function AqiGauge({ aqi, category, dominantPollutant }: AqiGaugeProps) {
  const theme = getCategoryTheme(category);

  // Gauge angle calculation (240 degree sweep: from -120 deg to +120 deg)
  const clampedAqi = Math.min(500, Math.max(0, aqi));
  const fraction = clampedAqi / 500;
  
  // Circumference for r=78: 2 * PI * 78 = 490.08
  // Total 240-degree arc length: (240 / 360) * 490.08 = 326.72
  const r = 78;
  const totalArc = (240 / 360) * 2 * Math.PI * r;
  const strokeDashoffset = totalArc * (1 - fraction);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* SVG Radial Gauge */}
      <div className="relative w-52 h-44 sm:w-60 sm:h-48 flex items-center justify-center">
        <svg viewBox="0 0 200 170" className="w-full h-full transform -rotate-90">
          <defs>
            <linearGradient id="gaugeTrackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="20%" stopColor="#84cc16" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="60%" stopColor="#f97316" />
              <stop offset="80%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>

            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={theme.color} floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Background Track (Muted) */}
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="14"
            strokeDasharray={`${totalArc} 500`}
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(150 100 100)"
          />

          {/* Active Colored Progress Arc */}
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="url(#gaugeTrackGradient)"
            strokeWidth="14"
            strokeDasharray={`${totalArc} 500`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
            transform="rotate(150 100 100)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Numbers & Badge */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6 text-center select-none pointer-events-none">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
            CPCB NAQI
          </span>
          <span
            className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white transition-all"
            style={{ textShadow: `0 0 20px ${theme.color}40` }}
          >
            {aqi}
          </span>
          <span
            className="mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wide text-white uppercase shadow-sm"
            style={{ backgroundColor: theme.color }}
          >
            {category}
          </span>
          <span className="text-[10px] text-slate-400 font-mono mt-1">
            Primary: <strong className="text-slate-200">{dominantPollutant}</strong>
          </span>
        </div>
      </div>

      {/* Breakpoint legend underneath */}
      <div className="w-full max-w-[220px] flex items-center justify-between text-[9px] font-mono text-slate-500 mt-1 px-1">
        <span className="text-emerald-400 font-semibold">0 Good</span>
        <span className="text-amber-400 font-semibold">100 Mod</span>
        <span className="text-orange-400 font-semibold">200 Poor</span>
        <span className="text-purple-400 font-semibold">400+ Sev</span>
      </div>
    </div>
  );
}
