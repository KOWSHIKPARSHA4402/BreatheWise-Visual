"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  CloudFog,
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
} from "lucide-react";
import { AirQualityData } from "@/lib/types";
import { getCategoryTheme } from "@/lib/aqi-calculator";
import AqiGauge from "./AqiGauge";

interface AqiHeroCardProps {
  data: AirQualityData;
}

export default function AqiHeroCard({ data }: AqiHeroCardProps) {
  const theme = getCategoryTheme(data.cpcbCategory);
  const isSevere = data.cpcbAQI > 300;
  const isPoor = data.cpcbAQI > 200;

  // Format current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pm25Ratio = (data.pollutants.pm2_5.value / 15).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Welcome & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase font-bold text-emerald-400 tracking-wider">
              Environmental Intelligence Dashboard
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Air Quality in {data.location.name}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentDate}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{data.location.latitude.toFixed(2)}°N, {data.location.longitude.toFixed(2)}°E</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Updated {data.metadata.lastUpdated}</span>
            </span>
          </div>
        </div>

        {/* CPCB Scale vs US AQI toggle pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto p-1.5 rounded-2xl bg-[#111c33] border border-slate-800 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
            CPCB NAQI: {data.cpcbAQI}
          </span>
          <span className="px-2.5 py-1 text-slate-400">
            US AQI: {data.usAQI}
          </span>
        </div>
      </div>

      {/* Hero Overview Container: Radial Gauge + Health Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Large Visual Radial AQI Gauge (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0f172a] border border-slate-800/90 shadow-xl flex flex-col justify-between items-center relative overflow-hidden group">
          <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
              Air Quality Index
            </span>
            <span
              className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full text-white shadow-sm"
              style={{ backgroundColor: theme.color }}
            >
              {data.cpcbCategory}
            </span>
          </div>

          {/* SVG Radial Gauge */}
          <AqiGauge
            aqi={data.cpcbAQI}
            category={data.cpcbCategory}
            dominantPollutant={data.dominantPollutant}
          />

          {/* Bottom Telemetry Mini-pill */}
          <div className="w-full pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>PM2.5: <strong className="text-white">{data.pollutants.pm2_5.value} µg/m³</strong> ({pm25Ratio}x WHO limit)</span>
            <span className="text-emerald-400 font-semibold">{data.metadata.isModelledData ? "CAMS Model" : "Measured"}</span>
          </div>
        </div>

        {/* Right: Health Advisory & Inversion Warning Card (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-[#0f172a] border border-slate-800/90 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <span className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                {isPoor ? <ShieldAlert className="w-4 h-4 text-amber-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                <span>Health Advisory &amp; Family Defense</span>
              </span>

              {data.weather?.isSmogTrappingConditions && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1">
                  <CloudFog className="w-3 h-3 text-purple-400 animate-pulse" />
                  <span>Thermal Inversion Active</span>
                </span>
              )}
            </div>

            {/* Severity Diagnosis */}
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {isSevere
                  ? "Emergency Winter Smog Alert — Dangerous Outdoor Levels"
                  : isPoor
                  ? "Unhealthy Smog Levels — High Respiratory Caution"
                  : "Satisfactory Air — Normal Daily Activities Safe"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {theme.healthImpact}
              </p>
            </div>

            {/* Immediate Action Recommendations */}
            <div className="p-4 rounded-2xl bg-[#131d33] border border-slate-800 text-xs space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400 block">
                Immediate Precautions for {data.location.name}
              </span>
              <ul className="space-y-1.5 text-slate-300 font-light">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>
                    {isSevere
                      ? "Seal all exterior windows and doors; run HEPA air purifiers continuously indoors."
                      : "Avoid early morning jogs; schedule outdoor activity for sunny afternoon hours."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>
                    {isSevere
                      ? "Wear certified N95 or FFP2 respirators outdoors. Cloth masks fail to block sub-micron PM2.5."
                      : "Keep children indoors during high-traffic commute rush hours."}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick CTA to AI Assistant */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-400">
              Personalized for your commute &amp; family
            </span>
            <Link
              href="/assistant"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
            >
              <span>Ask AI Smog Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
