"use client";

import React, { useState } from "react";
import { WORLD_CITIES, GlobeCityPin } from "./EarthGlobe3D";
import { ExternalLink, Search } from "lucide-react";

interface IqAirMapProps {
  selectedCity?: GlobeCityPin;
  onSelectCity?: (city: GlobeCityPin) => void;
  onViewDetails?: () => void;
}

export default function IqAirMap({
  selectedCity = WORLD_CITIES[1],
  onSelectCity,
  onViewDetails,
}: IqAirMapProps) {
  const [activeCity, setActiveCity] = useState<GlobeCityPin>(selectedCity);
  const [search, setSearch] = useState("");

  const filteredCities = WORLD_CITIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (c: GlobeCityPin) => {
    setActiveCity(c);
    if (onSelectCity) onSelectCity(c);
  };

  return (
    <div className="relative w-full h-[580px] sm:h-[640px] lg:h-[700px] rounded-3xl bg-[#081326] border border-[#1b354d] overflow-hidden flex flex-col glow-card-dark">
      {/* Top Map Toolbar */}
      <div className="p-4 border-b border-[#1b354d]/80 bg-[#0b1a30]/85 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#6BAEAA] animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A9D5C8]">
            Global Air Quality Stations Map
          </span>
        </div>

        {/* Search */}
        <div className="relative w-48 sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stations..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0f2138]/80 border border-[#22445e] text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#6BAEAA] glow-input"
          />
        </div>
      </div>

      {/* 2D Interactive World Map Container */}
      <div className="relative flex-1 bg-[#060e1d] overflow-hidden flex items-center justify-center p-4">
        {/* World Map SVG Vector Background */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full object-contain opacity-35 filter drop-shadow"
          aria-label="World Map"
        >
          {/* Subtle Latitude & Longitude grid */}
          <line x1="0" y1="250" x2="1000" y2="250" stroke="#1b354d" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="500" y1="0" x2="500" y2="500" stroke="#1b354d" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Continents rough paths */}
          {/* North America */}
          <path d="M 120 70 L 220 70 L 300 130 L 250 200 L 190 260 L 140 220 L 90 140 Z" fill="#11223b" />
          {/* South America */}
          <path d="M 260 270 L 350 290 L 340 390 L 290 460 L 260 380 Z" fill="#11223b" />
          {/* Eurasia */}
          <path d="M 450 60 L 850 70 L 900 190 L 780 260 L 640 230 L 520 200 L 440 130 Z" fill="#11223b" />
          {/* Africa */}
          <path d="M 460 200 L 580 200 L 610 320 L 550 420 L 480 380 L 440 260 Z" fill="#11223b" />
          {/* Australia */}
          <path d="M 780 340 L 890 330 L 900 420 L 810 430 Z" fill="#11223b" />
        </svg>

        {/* Station Markers on Map */}
        {filteredCities.map((city) => {
          // Equirectangular projection coordinates
          const leftPercent = ((city.lng + 180) / 360) * 100;
          const topPercent = ((90 - city.lat) / 180) * 100;

          const isSelected = city.id === activeCity.id;

          let badgeColor = "bg-[#4A9E86] text-white";
          if (city.aqi > 200) badgeColor = "bg-[#B85450] text-white";
          else if (city.aqi > 150) badgeColor = "bg-[#E0937A] text-white";
          else if (city.aqi > 100) badgeColor = "bg-[#E9B978] text-[#12272C]";
          else if (city.aqi > 50) badgeColor = "bg-[#6BAEAA] text-[#12272C]";

          return (
            <button
              key={city.id}
              onClick={() => handleSelect(city)}
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all transform ${
                isSelected ? "scale-125 z-30" : "scale-100 z-10 hover:scale-110"
              }`}
            >
              <div
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-lg border border-white/20 ${badgeColor} ${
                  isSelected ? "ring-2 ring-[#E9B978] shadow-[0_0_12px_rgba(233,185,120,0.6)]" : ""
                }`}
              >
                <span>{city.name}</span>
                <span className="opacity-90">({city.aqi})</span>
              </div>
            </button>
          );
        })}

        {/* Selected City Tooltip on 2D map */}
        <div className="absolute bottom-6 left-6 z-20 max-w-sm w-full p-4 rounded-2xl liquid-glass-dark glow-card-dark shadow-2xl text-white">
          <div className="flex items-center justify-between pb-2 border-b border-[#234B55]/60">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeCity.flag}</span>
              <div>
                <h4 className="font-bold text-sm text-white">
                  {activeCity.name}, {activeCity.country}
                </h4>
                <div className="text-[10px] text-slate-400 font-mono">
                  Station: Global CAMS Sensor · {activeCity.weatherCondition}
                </div>
              </div>
            </div>
            <button
              onClick={onViewDetails}
              className="text-xs text-[#E9B978] hover:text-[#F2CE9D] font-medium flex items-center gap-1 glow-btn px-2 py-1 rounded-lg"
            >
              <span>Inspect</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-1 text-center">
            <div className="p-2 rounded-xl bg-[#0f2138]/70 border border-[#1b354d]/80 glow-card-dark">
              <div className="text-[10px] text-slate-400 uppercase">AQI</div>
              <div className="text-lg font-black text-[#E9B978]">{activeCity.aqi}</div>
              <div className="text-[9px] text-slate-300 truncate">{activeCity.category}</div>
            </div>
            <div className="p-2 rounded-xl bg-[#0f2138]/70 border border-[#1b354d]/80 glow-card-dark">
              <div className="text-[10px] text-slate-400 uppercase">Temp / Hum</div>
              <div className="text-xs font-bold text-slate-200 mt-1">
                {activeCity.temp}°C / {activeCity.humidity}%
              </div>
              <div className="text-[9px] text-slate-400">Atmospheric</div>
            </div>
            <div className="p-2 rounded-xl bg-[#0f2138]/70 border border-[#1b354d]/80 glow-card-dark">
              <div className="text-[10px] text-slate-400 uppercase">Wind</div>
              <div className="text-xs font-bold text-slate-200 mt-1">
                {activeCity.windSpeed} km/h
              </div>
              <div className="text-[9px] text-[#A9D5C8]">Ventilation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
