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

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Air Quality Projections &amp; Trends
          </h2>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Diurnal winter smog curves modeled from Open-Meteo Copernicus CAMS forecasts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("hourly")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === "hourly"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            24-Hour Trend
          </button>
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTab === "daily"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            7-Day Forecast
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        {!mounted ? (
          <div className="h-full flex items-center justify-center text-xs font-mono text-slate-400">
            Initializing telemetry chart...
          </div>
        ) : activeTab === "hourly" ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, "auto"]} />
              <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Moderate (100)", fill: "#f59e0b", fontSize: 10 }} />
              <ReferenceLine y={300} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Very Poor (300)", fill: "#ef4444", fontSize: 10 }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const val = Number(payload[0].value);
                    const cat = getCPCBAQICategory(val);
                    const theme = getCategoryTheme(cat);
                    return (
                      <div className="p-3 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-xl text-xs space-y-1">
                        <div className="font-mono text-slate-400">{label} Hours</div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-base">{val} AQI</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.color }}>
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
              <Area type="monotone" dataKey="aqi" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#aqiGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    const theme = getCategoryTheme(d.category);
                    return (
                      <div className="p-3 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-xl text-xs space-y-1">
                        <div className="font-semibold">{label}</div>
                        <div className="flex items-center gap-2 font-mono">
                          <span>Avg AQI: {d.avgAqi}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.color }}>
                            {d.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">Peak Projected: {d.maxAqi} AQI</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="avgAqi" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Good/Satisfactory (0-100)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Moderate (101-200)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Very Poor/Severe (300+)</span>
          </span>
        </div>
        <span>Observation Standard: CPCB 24-hr NAQI</span>
      </div>
    </div>
  );
}
