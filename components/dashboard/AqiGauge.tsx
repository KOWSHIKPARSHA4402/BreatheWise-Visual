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
              <stop offset="0%" stopColor="#4A9E86" />
              <stop offset="25%" stopColor="#6BAEAA" />
              <stop offset="50%" stopColor="#E9B978" />
              <stop offset="75%" stopColor="#D98E83" />
              <stop offset="100%" stopColor="#B85450" />
            </linearGradient>

            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={theme.color} floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background Track (Muted) */}
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="rgba(104, 125, 131, 0.15)"
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
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#687D83] font-semibold">
            CPCB NAQI
          </span>
          <span
            className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-[#234B55] transition-all"
          >
            {aqi}
          </span>
          <span
            className="mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wide text-white uppercase shadow-sm"
            style={{ backgroundColor: theme.color }}
          >
            {category}
          </span>
          <span className="text-[10px] text-[#687D83] font-mono mt-1">
            Primary: <strong className="text-[#234B55]">{dominantPollutant}</strong>
          </span>
        </div>
      </div>

      {/* Breakpoint legend underneath */}
      <div className="w-full max-w-[220px] flex items-center justify-between text-[9px] font-mono text-[#687D83] mt-1 px-1">
        <span className="text-[#4A9E86] font-semibold">0 Good</span>
        <span className="text-[#E9B978] font-semibold">100 Mod</span>
        <span className="text-[#D98E83] font-semibold">200 Poor</span>
        <span className="text-[#B85450] font-semibold">400+ Sev</span>
      </div>
    </div>
  );
}
