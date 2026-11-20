"use client";

import React from "react";
import { AirQualityData } from "@/lib/types";
import { Clock, Database } from "lucide-react";

interface PollutantGridProps {
  data: AirQualityData;
}

export default function PollutantGrid({ data }: PollutantGridProps) {
  const { pollutants, metadata } = data;
  const observationTime = metadata.observationTimestamp
    ? metadata.observationTimestamp.includes("T")
      ? metadata.observationTimestamp.split("T")[1].slice(0, 5)
      : metadata.observationTimestamp
    : metadata.lastUpdated;

  const pollutantConfigs = [
    {
      symbol: "PM2.5",
      name: "Fine Particulate Matter",
      value: pollutants.pm2_5.value,
      unit: pollutants.pm2_5.unit,
      safeLimit: pollutants.pm2_5.safeLimitWHO || 15,
      subIndex: pollutants.pm2_5.subIndex ?? null,
      status: pollutants.pm2_5.status,
      desc: "Combustion soot and aerosols ≤ 2.5 µm that penetrate deep into lung alveoli and bloodstream.",
    },
    {
      symbol: "PM10",
      name: "Coarse Inhalable Dust",
      value: pollutants.pm10.value,
      unit: pollutants.pm10.unit,
      safeLimit: pollutants.pm10.safeLimitWHO || 45,
      subIndex: pollutants.pm10.subIndex ?? null,
      status: pollutants.pm10.status,
      desc: "Road dust, tire wear, and construction particles ≤ 10 µm causing upper respiratory tract irritation.",
    },
    {
      symbol: "NO2",
      name: "Nitrogen Dioxide",
      value: pollutants.no2.value,
      unit: pollutants.no2.unit,
      safeLimit: pollutants.no2.safeLimitWHO || 25,
      subIndex: pollutants.no2.subIndex ?? null,
      status: pollutants.no2.status,
      desc: "Pungent gas from high-temperature diesel vehicles triggering acute bronchial spasms.",
    },
    {
      symbol: "SO2",
      name: "Sulfur Dioxide",
      value: pollutants.so2.value,
      unit: pollutants.so2.unit,
      safeLimit: pollutants.so2.safeLimitWHO || 40,
      subIndex: pollutants.so2.subIndex ?? null,
      status: pollutants.so2.status,
      desc: "Industrial and thermal coal combustion byproduct causing throat burning and acid haze.",
    },
    {
      symbol: "CO",
      name: "Carbon Monoxide",
      value: pollutants.co.value,
      unit: pollutants.co.unit,
      safeLimit: pollutants.co.safeLimitWHO || 4,
      subIndex: pollutants.co.subIndex ?? null,
      status: pollutants.co.status,
      desc: "Colorless toxic gas from incomplete engine combustion reducing blood oxygen capacity.",
    },
    {
      symbol: "O3",
      name: "Ground-Level Ozone",
      value: pollutants.o3.value,
      unit: pollutants.o3.unit,
      safeLimit: pollutants.o3.safeLimitWHO || 100,
      subIndex: pollutants.o3.subIndex ?? null,
      status: pollutants.o3.status,
      desc: "Secondary photochemical oxidant formed when traffic exhaust reacts with sunlight.",
    },
  ];

  return (
    <div className="space-y-4" aria-label="Real-Time Pollutant Concentrations">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[#DCECE8]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#234B55] tracking-tight">
              Real-Time Atmospheric Pollutant Breakdown
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#DCECE8] text-[#234B55] border border-[#A9D5C8] font-bold">
              Observed Telemetry
            </span>
          </div>
          <p className="text-xs text-[#687D83] font-light">
            Continuous ground-level concentrations compared against CPCB National Standards and WHO Health Guidelines.
          </p>
        </div>

        {/* Source & Timestamp Tag */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto text-xs font-mono text-[#687D83]">
          <span className="flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-xl border border-[#DCECE8]">
            <Clock className="w-3.5 h-3.5 text-[#6BAEAA]" />
            <span>Observed: {observationTime}</span>
          </span>
          <span className="flex items-center gap-1 bg-white/70 px-2.5 py-1 rounded-xl border border-[#DCECE8]">
            <Database className="w-3.5 h-3.5 text-[#6BAEAA]" />
            <span>Copernicus CAMS</span>
          </span>
        </div>
      </div>

      {/* 6-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pollutantConfigs.map((item) => {
          const isUnavailable = item.value === null || item.status === "Unavailable";
          const isDanger = item.status === "Dangerous";
          const isElevated = item.status === "Elevated";

          // Calculate percentage relative to safe limit if value is available
          const percentRatio =
            item.value !== null && item.safeLimit
              ? Math.min(400, Math.round((item.value / item.safeLimit) * 100))
              : null;

          return (
            <div
              key={item.symbol}
              className={`p-5 rounded-3xl liquid-glass glow-card flex flex-col justify-between space-y-4 border ${
                isUnavailable
                  ? "border-[#DCECE8] opacity-80"
                  : isDanger
                  ? "border-[#B85450]/40 hover:border-[#B85450]"
                  : isElevated
                  ? "border-[#E9B978]/60 hover:border-[#E9B978]"
                  : "border-[#DCECE8] hover:border-[#6BAEAA]"
              }`}
            >
              <div className="space-y-3">
                {/* Header: Symbol & Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black font-mono text-[#234B55] tracking-wide">
                      {item.symbol}
                    </span>
                    <span className="text-[11px] text-[#687D83] font-light truncate max-w-[130px]">
                      {item.name}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                      isUnavailable
                        ? "bg-[#DCECE8] text-[#687D83] border-[#DCECE8]"
                        : isDanger
                        ? "bg-[#B85450]/15 text-[#611A17] border-[#B85450]/40"
                        : isElevated
                        ? "bg-[#E9B978]/25 text-[#75460E] border-[#E9B978]/50"
                        : "bg-[#4A9E86]/15 text-[#234B55] border-[#4A9E86]/40"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Primary Number Display */}
                <div className="flex items-baseline gap-2">
                  {isUnavailable ? (
                    <span className="text-2xl font-bold font-mono tracking-tight text-[#687D83]">
                      Unavailable
                    </span>
                  ) : (
                    <>
                      <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#234B55]">
                        {item.value}
                      </span>
                      <span className="text-xs font-mono text-[#687D83]">{item.unit}</span>
                    </>
                  )}
                </div>

                {/* Visual Ratio Progress Bar vs WHO Guideline */}
                {!isUnavailable && item.value !== null && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-[#687D83]">
                      <span>WHO 24h Threshold: {item.safeLimit} {item.unit}</span>
                      <span
                        className={
                          isDanger
                            ? "text-[#B85450] font-bold"
                            : isElevated
                            ? "text-[#D69F54] font-bold"
                            : "text-[#4A9E86] font-semibold"
                        }
                      >
                        {percentRatio}% of safe limit
                      </span>
                    </div>
                    <div className="w-full bg-[#DCECE8] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isDanger
                            ? "bg-[#B85450]"
                            : isElevated
                            ? "bg-[#E9B978]"
                            : "bg-[#4A9E86]"
                        }`}
                        style={{
                          width: `${Math.min(100, (item.value / (item.safeLimit * 2)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-[11px] text-[#687D83] font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Card Footer: CPCB Sub-Index or Unavailable note */}
              <div className="pt-2.5 border-t border-[#DCECE8] flex items-center justify-between text-[11px] font-mono text-[#687D83]">
                <span>CPCB Sub-Index:</span>
                <span className="font-bold text-[#234B55]">
                  {item.subIndex !== null ? item.subIndex : "N/A"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
