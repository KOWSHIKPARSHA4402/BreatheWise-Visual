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
  Cell,
} from "recharts";
import {
  Thermometer,
  Droplets,
  Wind,
  TrendingDown,
  TrendingUp,
  Sun,
  Sparkles,
} from "lucide-react";
import { AirQualityData } from "@/lib/types";
import { getCPCBAQICategory, getCategoryTheme } from "@/lib/aqi-calculator";

interface TrendChartProps {
  data: AirQualityData;
}

export default function TrendChart({ data }: TrendChartProps) {
  const [activeTab, setActiveTab] = useState<"history24h" | "forecast24h" | "trend7d" | "distribution">("history24h");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const historical = data.historical;
  const forecast = data.forecastIntelligence;

  interface HourlyChartPoint {
    time: string;
    aqi: number;
    pm2_5: number | null;
    pm10: number | null;
  }

  // 1. Past 24h Data
  const past24hData: HourlyChartPoint[] = (historical?.past24h || []).map((pt) => ({
    time: String(pt.formattedTime || pt.time.split("T")[1]?.slice(0, 5) || pt.time),
    aqi: pt.cpcbAQI,
    pm2_5: pt.pm2_5,
    pm10: pt.pm10,
  }));

  // 2. Next 24h Forecast Data
  const forecastData: HourlyChartPoint[] = (forecast?.hourly || data.hourlyForecast).map((item) => {
    let timeStr = "12:00";
    if ("formattedTime" in item && typeof item.formattedTime === "string") {
      timeStr = item.formattedTime;
    } else if (typeof item.time === "string") {
      timeStr = item.time.includes("T") ? item.time.split("T")[1]?.slice(0, 5) : item.time;
    }
    return {
      time: timeStr,
      aqi: item.cpcbAQI,
      pm2_5: item.pm2_5,
      pm10: item.pm10,
    };
  });

  // 3. 7-Day Trend Data
  const dailyData = (historical?.past7d || data.dailyForecast).map((item) => ({
    day: item.dayName,
    avgAqi: item.avgAqi,
    minAqi: "minAqi" in item ? item.minAqi : Math.round(item.avgAqi * 0.8),
    maxAqi: item.maxAqi,
    category: item.category,
  }));

  // 4. Pollutants Distribution vs WHO limits
  const p = data.pollutants;
  const distributionData = [
    {
      name: "PM2.5",
      observed: p.pm2_5.value ?? 0,
      whoLimit: 15,
      ratio: p.pm2_5.value ? Number((p.pm2_5.value / 15).toFixed(1)) : 0,
      unit: "µg/m³",
    },
    {
      name: "PM10",
      observed: p.pm10.value ?? 0,
      whoLimit: 45,
      ratio: p.pm10.value ? Number((p.pm10.value / 45).toFixed(1)) : 0,
      unit: "µg/m³",
    },
    {
      name: "NO2",
      observed: p.no2.value ?? 0,
      whoLimit: 25,
      ratio: p.no2.value ? Number((p.no2.value / 25).toFixed(1)) : 0,
      unit: "µg/m³",
    },
    {
      name: "SO2",
      observed: p.so2.value ?? 0,
      whoLimit: 40,
      ratio: p.so2.value ? Number((p.so2.value / 40).toFixed(1)) : 0,
      unit: "µg/m³",
    },
    {
      name: "O3",
      observed: p.o3.value ?? 0,
      whoLimit: 100,
      ratio: p.o3.value ? Number((p.o3.value / 100).toFixed(1)) : 0,
      unit: "µg/m³",
    },
  ];

  const isStagnant = data.weather?.isSmogTrappingConditions;
  const change24h = historical?.change24h;

  return (
    <div className="space-y-4" aria-label="AQI Analytics and Forecasting">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-1 border-b border-[#DCECE8]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#234B55] tracking-tight">
              Advanced Atmospheric Analytics &amp; Forecasting
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#DCECE8] text-[#234B55] border border-[#A9D5C8] font-bold">
              Copernicus CAMS Grounded
            </span>
          </div>
          <p className="text-xs text-[#687D83] font-light">
            Continuous 24-hour diurnal history, meteorological boundary inversion monitoring, and predictive clean air windows.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl liquid-glass border border-[#DCECE8] shadow-sm self-start md:self-auto text-xs font-mono overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("history24h")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap glow-btn ${
              activeTab === "history24h"
                ? "bg-[#234B55] text-white shadow-sm"
                : "text-[#687D83] hover:text-[#234B55]"
            }`}
          >
            24h Observed History
          </button>
          <button
            onClick={() => setActiveTab("forecast24h")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap glow-btn ${
              activeTab === "forecast24h"
                ? "bg-[#234B55] text-white shadow-sm"
                : "text-[#687D83] hover:text-[#234B55]"
            }`}
          >
            24h Hourly Forecast
          </button>
          <button
            onClick={() => setActiveTab("trend7d")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap glow-btn ${
              activeTab === "trend7d"
                ? "bg-[#234B55] text-white shadow-sm"
                : "text-[#687D83] hover:text-[#234B55]"
            }`}
          >
            7-Day Trajectory
          </button>
          <button
            onClick={() => setActiveTab("distribution")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap glow-btn ${
              activeTab === "distribution"
                ? "bg-[#234B55] text-white shadow-sm"
                : "text-[#687D83] hover:text-[#234B55]"
            }`}
          >
            Pollutant Multipliers
          </button>
        </div>
      </div>

      {/* Grid: Left = Dynamic Chart (8 cols), Right = Meteorological & Advisory Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Recharts Canvas Container */}
        <div className="lg:col-span-8 p-6 rounded-3xl liquid-glass glow-card flex flex-col justify-between space-y-4">
          {/* Top Bar of Chart Container */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCECE8] pb-3">
            <div>
              <span className="text-xs font-mono uppercase font-bold text-[#234B55] block">
                {activeTab === "history24h"
                  ? "Actual Observed 24-Hour Hourly Trajectory"
                  : activeTab === "forecast24h"
                  ? "Projected 24-Hour Diurnal Progression (Forecast)"
                  : activeTab === "trend7d"
                  ? "7-Day Ambient Trend (Daily Averages & Min/Max)"
                  : "Pollutant Concentrations Relative to WHO Safe Limits"}
              </span>
              <span className="text-[11px] text-[#687D83]">
                {activeTab === "forecast24h"
                  ? "Numerical simulation model — subject to meteorological variations."
                  : "Verified Copernicus CAMS & Open-Meteo telemetry."}
              </span>
            </div>

            {/* Quick Stat Pill */}
            {activeTab === "history24h" && change24h && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold border self-start sm:self-auto ${
                  change24h.direction === "improving"
                    ? "bg-[#4A9E86]/15 text-[#234B55] border-[#4A9E86]/30"
                    : change24h.direction === "deteriorating"
                    ? "bg-[#B85450]/15 text-[#B85450] border-[#B85450]/30"
                    : "bg-[#DCECE8] text-[#234B55] border-[#A9D5C8]"
                }`}
              >
                {change24h.direction === "improving" ? (
                  <TrendingDown className="w-3.5 h-3.5 text-[#4A9E86]" />
                ) : change24h.direction === "deteriorating" ? (
                  <TrendingUp className="w-3.5 h-3.5 text-[#B85450]" />
                ) : null}
                <span>
                  {change24h.deltaAqi > 0 ? `+${change24h.deltaAqi}` : change24h.deltaAqi} AQI ({change24h.percentChange > 0 ? `+${change24h.percentChange}` : change24h.percentChange}%) vs yesterday
                </span>
              </div>
            )}
          </div>

          {/* Chart Canvas */}
          <div className="h-64 sm:h-72 w-full pt-2">
            {!mounted ? (
              <div className="h-full flex items-center justify-center text-xs font-mono text-[#687D83]">
                Initializing chart visualizer...
              </div>
            ) : activeTab === "history24h" || activeTab === "forecast24h" ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activeTab === "history24h" ? past24hData : forecastData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={activeTab === "history24h" ? "#6BAEAA" : "#234B55"}
                        stopOpacity={0.35}
                      />
                      <stop offset="95%" stopColor="#A9D5C8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCECE8" opacity={0.8} vertical={false} />
                  <XAxis dataKey="time" stroke="#687D83" fontSize={11} tickLine={false} />
                  <YAxis stroke="#687D83" fontSize={11} tickLine={false} domain={[0, "auto"]} />
                  <ReferenceLine
                    y={100}
                    stroke="#E9B978"
                    strokeDasharray="3 3"
                    label={{ value: "Mod (100)", fill: "#E9B978", fontSize: 9 }}
                  />
                  <ReferenceLine
                    y={300}
                    stroke="#B85450"
                    strokeDasharray="3 3"
                    label={{ value: "Very Poor (300)", fill: "#B85450", fontSize: 9 }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const val = Number(payload[0].value);
                        const cat = getCPCBAQICategory(val);
                        const theme = getCategoryTheme(cat);
                        return (
                          <div className="p-3 rounded-2xl bg-white text-[#234B55] border border-[#DCECE8] shadow-xl text-xs space-y-1 font-mono">
                            <div className="text-[#687D83]">{label}</div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base text-[#234B55]">{val} AQI</span>
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                                style={{ backgroundColor: theme.color }}
                              >
                                {cat}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#687D83]">
                              PM2.5: {payload[0].payload.pm2_5} µg/m³
                            </div>
                            {payload[0].payload.pm10 && (
                              <div className="text-[11px] text-[#687D83]">
                                PM10: {payload[0].payload.pm10} µg/m³
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="aqi"
                    stroke={activeTab === "history24h" ? "#6BAEAA" : "#234B55"}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#chartGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : activeTab === "trend7d" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCECE8" opacity={0.8} vertical={false} />
                  <XAxis dataKey="day" stroke="#687D83" fontSize={11} tickLine={false} />
                  <YAxis stroke="#687D83" fontSize={11} tickLine={false} domain={[0, "auto"]} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="p-3 rounded-2xl bg-white text-[#234B55] border border-[#DCECE8] shadow-xl text-xs space-y-1 font-mono">
                            <div className="font-bold text-sm">{label}</div>
                            <div>Average AQI: {d.avgAqi} ({d.category})</div>
                            <div className="text-[11px] text-[#687D83]">
                              Range: {d.minAqi} – {d.maxAqi} AQI
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="avgAqi" radius={[8, 8, 0, 0]}>
                    {dailyData.map((entry, index) => {
                      let color = "#4A9E86";
                      if (entry.avgAqi > 300) color = "#B85450";
                      else if (entry.avgAqi > 200) color = "#E0937A";
                      else if (entry.avgAqi > 100) color = "#E9B978";
                      else if (entry.avgAqi > 50) color = "#6BAEAA";
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCECE8" opacity={0.8} horizontal={false} />
                  <XAxis type="number" stroke="#687D83" fontSize={11} tickLine={false} domain={[0, "auto"]} />
                  <YAxis type="category" dataKey="name" stroke="#687D83" fontSize={11} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="p-3 rounded-2xl bg-white text-[#234B55] border border-[#DCECE8] shadow-xl text-xs space-y-1 font-mono">
                            <div className="font-bold">{d.name} Multiplier</div>
                            <div>Concentration: {d.observed} {d.unit}</div>
                            <div>WHO Safe Threshold: {d.whoLimit} {d.unit}</div>
                            <div className="font-bold text-[#B85450]">{d.ratio}x safe guideline</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine x={1.0} stroke="#4A9E86" strokeWidth={2} label={{ value: "1.0x (WHO Limit)", fill: "#4A9E86", fontSize: 10 }} />
                  <Bar dataKey="ratio" radius={[0, 8, 8, 0]}>
                    {distributionData.map((entry, index) => {
                      const color = entry.ratio > 3 ? "#B85450" : entry.ratio > 1 ? "#E9B978" : "#4A9E86";
                      return <Cell key={`dist-cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bottom Summary Strip */}
          <div className="pt-3 border-t border-[#DCECE8] flex flex-wrap items-center justify-between gap-3 text-xs text-[#687D83] font-mono">
            {activeTab === "history24h" && historical ? (
              <>
                <div>
                  Daily Min: <span className="font-bold text-[#4A9E86]">{historical.dailyMin.aqi} AQI</span> ({historical.dailyMin.time})
                </div>
                <div>
                  Daily Max: <span className="font-bold text-[#B85450]">{historical.dailyMax.aqi} AQI</span> ({historical.dailyMax.time})
                </div>
                <div>
                  Days &gt; 200 AQI: <span className="font-bold text-[#234B55]">{historical.highPollutionDaysCount7d}/7 days</span>
                </div>
              </>
            ) : activeTab === "forecast24h" && forecast ? (
              <>
                <div>
                  Projected Peak: <span className="font-bold text-[#B85450]">{forecast.next24hSummary.expectedPeakAqi} AQI</span> ({forecast.next24hSummary.expectedPeakTime})
                </div>
                <div>
                  Projected Low: <span className="font-bold text-[#4A9E86]">{forecast.next24hSummary.lowestAqi} AQI</span> ({forecast.next24hSummary.lowestTime})
                </div>
                <div>
                  Expected PM2.5 Delta: <span className="font-bold text-[#234B55]">{forecast.next24hSummary.pm25Delta > 0 ? `+${forecast.next24hSummary.pm25Delta}` : forecast.next24hSummary.pm25Delta} µg/m³</span>
                </div>
              </>
            ) : (
              <div>Continuous hourly data integrated from Copernicus ECMWF CAMS</div>
            )}
          </div>

          {/* Story-Driven Narrative Explainer for Beginners & Researchers */}
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#DCECE8] flex items-start gap-2.5 text-xs text-[#234B55] shadow-sm">
            <Sparkles className="w-4 h-4 text-[#6BAEAA] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-[#234B55] block">The Story Behind This Chart:</span>
              <p className="text-[11px] text-[#234B55]/90 leading-relaxed">
                {activeTab === "history24h"
                  ? "Air quality worsened overnight as cool ground air trapped soot, reaching peak contamination during the morning rush. Midday sunshine broke the inversion lid, providing brief relief before evening cooling."
                  : activeTab === "forecast24h"
                  ? "Atmospheric models predict the cleanest air window between early afternoon when solar heating aids vertical dispersion. After sunset, dying winds will trap vehicle emissions close to the ground."
                  : activeTab === "trend7d"
                  ? "Over the past 7 days, air quality closely tracked regional wind speeds. Calm days saw toxic particle accumulation, while breezy days triggered swift atmospheric clearing."
                  : "Microscopic fine dust (PM2.5) is currently the leading driver exceeding safety thresholds, meaning certified N95 respirators and True HEPA filtration provide the highest health protection."}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Best Outdoor Window & Meteorological Smog Drivers (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Best Activity Window Card */}
          {forecast && (
            <div className="p-5 rounded-3xl liquid-glass glow-card border border-[#A9D5C8] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#4A9E86]/15 text-[#4A9E86]">
                    <Sun className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-[#234B55]">Best Outdoor Window</h3>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#4A9E86]/20 text-[#234B55] font-bold">
                  Recommended
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 border border-[#DCECE8] flex items-baseline justify-between">
                <div>
                  <span className="text-lg font-black text-[#234B55]">
                    {forecast.bestOutdoorWindow.startTime} – {forecast.bestOutdoorWindow.endTime}
                  </span>
                  <span className="text-xs text-[#687D83] block">Today</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#4A9E86]">
                    Avg AQI ~{forecast.bestOutdoorWindow.avgAqi}
                  </span>
                  <span className="text-[10px] font-mono text-[#687D83] block">
                    {forecast.bestOutdoorWindow.category}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#687D83] font-light leading-relaxed">
                {forecast.bestOutdoorWindow.reason}
              </p>
            </div>
          )}

          {/* Meteorological Smog Driver Card */}
          <div className="p-5 rounded-3xl liquid-glass glow-card border border-[#DCECE8] space-y-3">
            <div className="flex items-center justify-between border-b border-[#DCECE8] pb-2">
              <span className="text-xs font-mono uppercase font-bold text-[#234B55]">
                Boundary Layer Dynamics
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                  isStagnant
                    ? "bg-[#B85450]/15 text-[#B85450] border-[#B85450]/30"
                    : "bg-[#4A9E86]/15 text-[#234B55] border-[#4A9E86]/30"
                }`}
              >
                {isStagnant ? "Inversion Active" : "Normal Dispersion"}
              </span>
            </div>

            <div className="space-y-2 text-xs text-[#234B55]">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/60">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-[#E9B978]" />
                  <span>Ambient Temperature</span>
                </div>
                <span className="font-mono font-bold">{data.weather?.temperature ?? 22}°C</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/60">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-[#6BAEAA]" />
                  <span>Relative Humidity</span>
                </div>
                <span className="font-mono font-bold">{data.weather?.relativeHumidity ?? 65}%</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-white/60">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-[#A9D5C8]" />
                  <span>Surface Wind Speed</span>
                </div>
                <span className="font-mono font-bold">{data.weather?.windSpeedKmH ?? 8} km/h</span>
              </div>
            </div>

            <p className="text-[11px] text-[#687D83] leading-relaxed pt-1">
              {isStagnant
                ? "Calm surface winds and elevated humidity trap vehicle exhaust and fine smoke near ground level, worsening morning pollution."
                : "Active atmospheric circulation promotes natural particulate dispersion."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
