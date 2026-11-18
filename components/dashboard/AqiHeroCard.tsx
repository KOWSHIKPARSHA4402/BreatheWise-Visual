"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, CloudFog, Info, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AirQualityData } from "@/lib/types";
import { getCategoryTheme } from "@/lib/aqi-calculator";

interface AqiHeroCardProps {
  data: AirQualityData;
}

export default function AqiHeroCard({ data }: AqiHeroCardProps) {
  const theme = getCategoryTheme(data.cpcbCategory);
  const isSevere = data.cpcbAQI > 300;
  const pm25Multiple = (data.pollutants.pm2_5.value / 15).toFixed(1);

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border ${theme.borderColor} ${theme.bgLight} relative overflow-hidden transition-all shadow-sm`}>
      {/* Decorative ambient background blur */}
      <div
        className="absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: theme.color }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Side: Score & Category */}
        <div className="space-y-4 max-w-xl">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm font-mono tracking-wide flex items-center gap-1.5"
              style={{ backgroundColor: theme.color }}
            >
              {isSevere ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>CPCB {data.cpcbCategory.toUpperCase()}</span>
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              US AQI: {data.usAQI}
            </span>

            {data.weather?.isSmogTrappingConditions && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 flex items-center gap-1.5">
                <CloudFog className="w-3.5 h-3.5 animate-pulse" />
                <span>Winter Inversion Active</span>
              </span>
            )}
          </div>

          {/* Large AQI Counter & Summary */}
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {data.cpcbAQI}
              </span>
              <div className="space-y-0.5">
                <div className="text-xs font-mono uppercase text-slate-500 font-semibold">
                  National AQI
                </div>
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Primary: <span className="font-bold text-slate-900 dark:text-white">{data.dominantPollutant}</span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 leading-snug">
              {theme.summary}
            </p>
          </div>

          {/* Health Impact Note */}
          <p className="text-sm text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            {theme.healthImpact} PM2.5 is currently at <span className="font-mono font-semibold text-slate-900 dark:text-white">{data.pollutants.pm2_5.value} µg/m³</span> ({pm25Multiple}x the WHO 24h safe limit).
          </p>

          {/* Fast Link to AI Guidance */}
          <div className="pt-1">
            <Link
              href="/assistant"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline underline-offset-4 group"
            >
              <span>Ask AI what your family should do right now</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Side: Quick Atmospheric & Source Box */}
        <div className="w-full lg:w-72 p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm space-y-3 text-xs shrink-0">
          <div className="flex items-center justify-between text-slate-500 font-mono text-[11px] uppercase border-b border-slate-100 dark:border-slate-800 pb-2">
            <span>Atmospheric Telemetry</span>
            <Info className="w-3.5 h-3.5" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
            <div>
              <span className="text-slate-600 dark:text-slate-400 block text-[10px] uppercase font-mono">Temperature</span>
              <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{data.weather?.temperature ?? 20}°C</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400 block text-[10px] uppercase font-mono">Humidity</span>
              <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{data.weather?.relativeHumidity ?? 65}%</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400 block text-[10px] uppercase font-mono">Wind Speed</span>
              <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{data.weather?.windSpeedKmH ?? 6} km/h</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400 block text-[10px] uppercase font-mono">Dispersion</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {data.weather?.isSmogTrappingConditions ? "Low / Stagnant" : "Moderate"}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
            Data Source: <span className="font-medium text-slate-600 dark:text-slate-400">{data.metadata.dataProvider}</span> · Updated: {data.metadata.lastUpdated}
          </div>
        </div>
      </div>
    </div>
  );
}
