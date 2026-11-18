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
      key: "pm2_5",
      name: "PM2.5 (Fine Particles)",
      symbol: "PM2.5",
      value: pollutants.pm2_5.value,
      unit: pollutants.pm2_5.unit,
      safeLimit: pollutants.pm2_5.safeLimitWHO,
      subIndex: pollutants.pm2_5.subIndex,
      status: pollutants.pm2_5.status,
      desc: "Microscopic soot particles ≤ 2.5 µm that penetrate deep into lung alveoli and bloodstream.",
      sources: "Vehicle exhaust, biomass burning, coal power, industrial emissions",
    },
    {
      key: "pm10",
      name: "PM10 (Coarse Particles)",
      symbol: "PM10",
      value: pollutants.pm10.value,
      unit: pollutants.pm10.unit,
      safeLimit: pollutants.pm10.safeLimitWHO,
      subIndex: pollutants.pm10.subIndex,
      status: pollutants.pm10.status,
      desc: "Inhalable dust, pollen, and road grit ≤ 10 µm causing upper respiratory tract irritation.",
      sources: "Road dust, construction sites, tire wear, mechanical abrasion",
    },
    {
      key: "no2",
      name: "Nitrogen Dioxide",
      symbol: "NO2",
      value: pollutants.no2.value,
      unit: pollutants.no2.unit,
      safeLimit: pollutants.no2.safeLimitWHO,
      subIndex: pollutants.no2.subIndex,
      status: pollutants.no2.status,
      desc: "Toxic pungent reddish-brown gas that causes severe bronchial inflammation and asthma.",
      sources: "High-temperature vehicle engines, diesel trucks, gas power plants",
    },
    {
      key: "so2",
      name: "Sulfur Dioxide",
      symbol: "SO2",
      value: pollutants.so2.value,
      unit: pollutants.so2.unit,
      safeLimit: pollutants.so2.safeLimitWHO,
      subIndex: pollutants.so2.subIndex,
      status: pollutants.so2.status,
      desc: "Choking gas causing reflex airway constriction, burning eyes, and acid rain.",
      sources: "Thermal coal plants, oil refineries, heavy industrial boilers",
    },
    {
      key: "co",
      name: "Carbon Monoxide",
      symbol: "CO",
      value: pollutants.co.value,
      unit: pollutants.co.unit,
      safeLimit: pollutants.co.safeLimitWHO,
      subIndex: pollutants.co.subIndex,
      status: pollutants.co.status,
      desc: "Colorless, odorless gas binding to hemoglobin and starving vital organs of oxygen.",
      sources: "Incomplete fuel combustion, idling traffic, unvented heaters",
    },
    {
      key: "o3",
      name: "Ground-Level Ozone",
      symbol: "O3",
      value: pollutants.o3.value,
      unit: pollutants.o3.unit,
      safeLimit: pollutants.o3.safeLimitWHO,
      subIndex: pollutants.o3.subIndex,
      status: pollutants.o3.status,
      desc: "Secondary photochemical pollutant formed when sunlight reacts with NOx and VOCs.",
      sources: "Formed on sunny afternoons from traffic exhaust and solvent fumes",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Key Pollutant Concentrations
          </h2>
          <p className="text-xs text-slate-500 font-light">
            Measured against CPCB sub-index standards and WHO 24-hour health guidelines.
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Standard Units: µg/m³ (CO: mg/m³)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pollutantConfigs.map((item) => {
          const isDanger = item.status === "Dangerous";
          const isElevated = item.status === "Elevated";

          return (
            <div
              key={item.key}
              className={`p-5 rounded-2xl border transition-all ${
                isDanger
                  ? "bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/40"
                  : isElevated
                  ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {item.symbol}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                    isDanger
                      ? "bg-red-500 text-white"
                      : isElevated
                      ? "bg-amber-500 text-white"
                      : "bg-emerald-500 text-white"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Value & Unit */}
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                  {item.value}
                </span>
                <span className="text-xs font-mono text-slate-500">{item.unit}</span>
              </div>

              {/* Sub-Index & WHO safe limit */}
              <div className="text-xs font-mono text-slate-500 space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span>CPCB Sub-Index:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.subIndex ?? "N/A"}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>WHO Safe Limit:</span>
                  <span>{item.safeLimit} {item.unit}</span>
                </div>
              </div>

              {/* Description & Sources */}
              <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 font-light leading-snug">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
