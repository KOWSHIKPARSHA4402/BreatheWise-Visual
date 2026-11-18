"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  Thermometer,
  Droplets,
  Wind,
  Compass,
  CloudFog,
} from "lucide-react";
import { AirQualityData } from "@/lib/types";
import { getCPCBAQICategory, getCategoryTheme } from "@/lib/aqi-calculator";

interface TrendChartProps {
  data: AirQualityData;
}

export default function TrendChart({ data }: TrendChartProps) {
  const [activeTab, setActiveTab] = useState<"hourly" | "daily">("hourly");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hourlyData = data.hourlyForecast.map((item) => ({
    time: item.time.includes("T") ? item.time.split("T")[1]?.slice(0, 5) : item.time,
    aqi: item.cpcbAQI,
    pm2_5: item.pm2_5,
  }));

  const dailyData = data.dailyForecast.map((item) => ({
    day: item.dayName,
    avgAqi: item.avgAqi,
    maxAqi: item.maxAqi,
    category: item.category,
  }));

  const isStagnant = data.weather?.isSmogTrappingConditions;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Pollution Forecast &amp; Atmospheric Conditions</span>
          </h2>
          <p className="text-xs text-slate-400 font-light">
            24-hour diurnal curve and local meteorological dynamics driving ground-level smog entrapment.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-[#0f172a] border border-slate-800 self-start sm:self-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab("hourly")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeTab === "hourly"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            24-Hour Forecast
          </button>
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeTab === "daily"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            7-Day Outlook
          </button>
        </div>
      </div>

      {/* Grid: Left = Chart (7 cols), Right = Weather Conditions Panel (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Recharts Canvas Container */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-xs font-mono uppercase font-bold text-slate-400">
              {activeTab === "hourly" ? "Projected Hourly AQI Progression" : "7-Day Ambient Trajectory"}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Model: Copernicus CAMS
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            {!mounted ? (
              <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500">
                Initializing chart visualizer...
              </div>
            ) : activeTab === "hourly" ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, "auto"]} />
                  <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Mod (100)", fill: "#f59e0b", fontSize: 9 }} />
                  <ReferenceLine y={300} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Very Poor (300)", fill: "#ef4444", fontSize: 9 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const val = Number(payload[0].value);
                        const cat = getCPCBAQICategory(val);
                        const theme = getCategoryTheme(cat);
                        return (
                          <div className="p-3 rounded-2xl bg-[#090d16] text-white border border-slate-700 shadow-2xl text-xs space-y-1 font-mono">
                            <div className="text-slate-400">{label} Hours</div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base text-white">{val} AQI</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: theme.color }}>
                                {cat}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-300">
                              PM2.5: {payload[0].payload.pm2_5} µg/m³
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="aqi" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#chartGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        const theme = getCategoryTheme(d.category);
                        return (
                          <div className="p-3 rounded-2xl bg-[#090d16] text-white border border-slate-700 shadow-2xl text-xs space-y-1 font-mono">
                            <div className="font-bold text-white">{label}</div>
                            <div className="flex items-center gap-2">
                              <span>Average: {d.avgAqi} AQI</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: theme.color }}>
                                {d.category}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400">Peak Projected: {d.maxAqi} AQI</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="avgAqi" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Notice: Peaks typically occur during 6:00 AM – 9:00 AM winter inversion.</span>
            <span className="text-emerald-400 font-semibold">24-hr CPCB Standard</span>
          </div>
        </div>

        {/* Right: Weather & Atmospheric Telemetry Panel */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#0f172a] border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-slate-400">
              Atmospheric Conditions
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              Live Station
            </span>
          </div>

          {/* 4 Meteorological Metric Boxes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#131d33] border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>Temperature</span>
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {data.weather?.temperature ?? 20}°C
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Sensible surface</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#131d33] border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>Humidity</span>
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {data.weather?.relativeHumidity ?? 65}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Vapor condensation</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#131d33] border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                <span>Wind Speed</span>
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {data.weather?.windSpeedKmH ?? 5} <span className="text-xs font-normal text-slate-400">km/h</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {(data.weather?.windSpeedKmH ?? 5) < 6 ? "Calm & Stagnant" : "Breezy"}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#131d33] border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>Wind Azimuth</span>
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {data.weather?.windDirection ?? 180}°
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Compass angle</span>
            </div>
          </div>

          {/* Thermal Inversion Diagnosis Card */}
          <div className="p-4 rounded-2xl bg-[#131d33] border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold font-mono text-white">
              <CloudFog className="w-4 h-4 text-purple-400" />
              <span>Smog Inversion Status:</span>
              <span className={isStagnant ? "text-purple-400" : "text-emerald-400"}>
                {isStagnant ? "Trapped / Active" : "Dispersing"}
              </span>
            </div>
            <p className="text-slate-400 font-light leading-relaxed text-[11px]">
              {isStagnant
                ? "Calm surface wind (< 6 km/h) and high humidity act as an atmospheric lid, keeping heavy vehicle exhaust and smoke particles trapped at ground level."
                : "Wind velocity is sufficient to disperse ground-level emissions into the upper atmosphere."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
