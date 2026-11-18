"use client";

import React from "react";
import { WORLD_CITIES } from "@/components/globe/EarthGlobe3D";
import { Globe, ArrowUpRight, Thermometer, Wind } from "lucide-react";
import { LocationData } from "@/lib/types";

interface GlobalHotspotsSectionProps {
  onSelectCity?: (loc: LocationData) => void;
}

export default function GlobalHotspotsSection({ onSelectCity }: GlobalHotspotsSectionProps) {
  // Sort by AQI descending (most polluted first)
  const sortedCities = [...WORLD_CITIES].sort((a, b) => b.aqi - a.aqi);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-cyan-400 border border-cyan-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Global Air Quality Hotspot Comparison
            </h2>
            <p className="text-xs text-slate-400">
              Live multi-station comparison across major world metropolitan centers
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-400 self-start sm:self-auto px-3 py-1 rounded-full bg-[#0d152a] border border-slate-800">
          Source: Copernicus CAMS &amp; Open-Meteo
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {sortedCities.slice(0, 10).map((city) => {
          let badgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
          if (city.aqi > 200) badgeColor = "bg-red-500/20 text-red-300 border-red-500/40";
          else if (city.aqi > 150) badgeColor = "bg-orange-500/20 text-orange-300 border-orange-500/40";
          else if (city.aqi > 100) badgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/40";
          else if (city.aqi > 50) badgeColor = "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";

          return (
            <div
              key={city.id}
              onClick={() => {
                if (onSelectCity) {
                  onSelectCity({
                    name: city.name,
                    country: city.country,
                    latitude: city.lat,
                    longitude: city.lng,
                  });
                }
              }}
              className="p-4 rounded-2xl bg-[#0c1427]/80 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-[#101b38] transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{city.flag}</span>
                  <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {city.name}
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">{city.aqi}</span>
                  <span className="text-[10px] font-mono uppercase text-slate-400">AQI</span>
                </div>
                <span
                  className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}
                >
                  {city.category}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-400" />
                  <span>{city.temp}°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-cyan-400" />
                  <span>{city.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
