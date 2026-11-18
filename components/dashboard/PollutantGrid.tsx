"use client";

import React from "react";
import { AirQualityData } from "@/lib/types";

interface PollutantGridProps {
  data: AirQualityData;
}

export default function PollutantGrid({ data }: PollutantGridProps) {
  const { pollutants } = data;

  const pollutantConfigs = [
    {
      symbol: "PM2.5",
      name: "Fine Particulate Matter",
      value: pollutants.pm2_5.value,
      unit: pollutants.pm2_5.unit,
      safeLimit: pollutants.pm2_5.safeLimitWHO || 15,
      subIndex: pollutants.pm2_5.subIndex ?? 0,
      status: pollutants.pm2_5.status,
      desc: "Combustion soot and aerosols ≤ 2.5 µm that penetrate deep into lung alveoli and bloodstream.",
    },
    {
      symbol: "PM10",
      name: "Coarse Inhalable Dust",
      value: pollutants.pm10.value,
      unit: pollutants.pm10.unit,
      safeLimit: pollutants.pm10.safeLimitWHO || 45,
      subIndex: pollutants.pm10.subIndex ?? 0,
      status: pollutants.pm10.status,
      desc: "Road dust, tire wear, and construction particles ≤ 10 µm causing upper respiratory tract irritation.",
    },
    {
      symbol: "NO2",
      name: "Nitrogen Dioxide",
      value: pollutants.no2.value,
      unit: pollutants.no2.unit,
      safeLimit: pollutants.no2.safeLimitWHO || 25,
      subIndex: pollutants.no2.subIndex ?? 0,
      status: pollutants.no2.status,
      desc: "Pungent gas from high-temperature diesel vehicles triggering acute bronchial spasms.",
    },
    {
      symbol: "SO2",
      name: "Sulfur Dioxide",
      value: pollutants.so2.value,
      unit: pollutants.so2.unit,
      safeLimit: pollutants.so2.safeLimitWHO || 40,
      subIndex: pollutants.so2.subIndex ?? 0,
      status: pollutants.so2.status,
      desc: "Industrial and thermal coal combustion byproduct causing throat burning and acid haze.",
    },
    {
      symbol: "CO",
      name: "Carbon Monoxide",
      value: pollutants.co.value,
      unit: pollutants.co.unit,
      safeLimit: pollutants.co.safeLimitWHO || 4,
      subIndex: pollutants.co.subIndex ?? 0,
      status: pollutants.co.status,
      desc: "Colorless toxic gas from incomplete engine combustion reducing blood oxygen capacity.",
    },
    {
      symbol: "O3",
      name: "Ground-Level Ozone",
      value: pollutants.o3.value,
      unit: pollutants.o3.unit,
      safeLimit: pollutants.o3.safeLimitWHO || 100,
      subIndex: pollutants.o3.subIndex ?? 0,
      status: pollutants.o3.status,
      desc: "Secondary photochemical oxidant formed when traffic exhaust reacts with sunlight.",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Key Pollutant Concentrations</span>
            <span className="text-xs font-mono text-slate-400 font-normal">
              (6 Critical Parameters)
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-light">
            Continuous atmospheric concentrations compared against CPCB standards and WHO guidelines.
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Units: µg/m³ (CO: mg/m³)
        </span>
      </div>

      {/* 6-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pollutantConfigs.map((item) => {
          const isDanger = item.status === "Dangerous";
          const isElevated = item.status === "Elevated";

          // Calculate percentage relative to safe limit
          const percentRatio = Math.min(300, Math.round((item.value / item.safeLimit) * 100));

          return (
            <div
              key={item.symbol}
              className={`p-5 rounded-3xl bg-[#0f172a] border transition-all flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-700 ${
                isDanger
                  ? "border-red-900/60 hover:border-red-600/70"
                  : isElevated
                  ? "border-amber-900/60 hover:border-amber-600/70"
                  : "border-slate-800 hover:border-emerald-600/60"
              }`}
            >
              <div className="space-y-3">
                {/* Header: Symbol & Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black font-mono text-white tracking-wide">
                      {item.symbol}
                    </span>
                    <span className="text-[11px] text-slate-400 font-light truncate max-w-[130px]">
                      {item.name}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                      isDanger
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : isElevated
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Primary Number Display */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                    {item.value}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{item.unit}</span>
                </div>

                {/* Visual Ratio Progress Bar vs WHO Guideline */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>WHO 24h Threshold: {item.safeLimit} {item.unit}</span>
                    <span className={isDanger ? "text-red-400 font-bold" : isElevated ? "text-amber-400 font-bold" : "text-emerald-400"}>
                      {percentRatio}% of limit
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isDanger
                          ? "bg-red-500"
                          : isElevated
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(100, (item.value / (item.safeLimit * 2)) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Card Footer: CPCB Sub-Index */}
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>CPCB Sub-Index:</span>
                <span className="font-bold text-slate-300">{item.subIndex}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
