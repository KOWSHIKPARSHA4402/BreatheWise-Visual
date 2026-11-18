"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Share2,
  Check,
} from "lucide-react";
import { AirQualityData, LocationData } from "@/lib/types";
import { GlobeCityPin, WORLD_CITIES } from "@/components/globe/EarthGlobe3D";

// Dynamically import Three.js 3D Globe with ssr: false to prevent hydration mismatch
const EarthGlobe3D = dynamic(() => import("@/components/globe/EarthGlobe3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex flex-col items-center justify-center space-y-3 bg-[#070d1e] rounded-3xl">
      <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono text-cyan-300">Initializing 3D Planetary Simulation...</span>
    </div>
  ),
});

const IqAirMap = dynamic(() => import("@/components/globe/IqAirMap"), {
  ssr: false,
});

interface AirIndxHeroProps {
  data: AirQualityData;
  onSelectCityLocation?: (loc: LocationData) => void;
  onOpenDetailsModal?: () => void;
}

export default function AirIndxHero({
  data,
  onSelectCityLocation,
  onOpenDetailsModal,
}: AirIndxHeroProps) {
  const [viewMode, setViewMode] = useState<"globe" | "map">("globe");
  const [selectedCityPin, setSelectedCityPin] = useState<GlobeCityPin>(() => {
    // Try to match current active location to a world city
    const matched = WORLD_CITIES.find(
      (c) => c.name.toLowerCase() === data.location.name.toLowerCase()
    );
    if (matched) return matched;
    // Or initialize with Jakarta to match IMAGE 1
    return WORLD_CITIES[1];
  });

  const [copiedShare, setCopiedShare] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState("25/07/2026 10:11");

  // Keep live time formatted
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number) => (n < 10 ? "0" + n : n);
      const day = pad(now.getDate());
      const month = pad(now.getMonth() + 1);
      const year = now.getFullYear();
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      setCurrentTimeStr(`${day}/${month}/${year} ${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate dynamic pollution risk percentage
  const calculateRiskPercentage = (aqi: number) => {
    if (aqi <= 50) return Math.min(15, Math.max(5, Math.round((aqi / 50) * 15)));
    if (aqi <= 100) return Math.round(15 + ((aqi - 50) / 50) * 20); // 15-35%
    if (aqi <= 200) return Math.round(35 + ((aqi - 100) / 100) * 30); // 35-65%
    if (aqi <= 300) return Math.round(65 + ((aqi - 200) / 100) * 20); // 65-85%
    return Math.min(99, Math.round(85 + ((aqi - 300) / 200) * 14)); // 85-99%
  };

  const currentAqi = selectedCityPin.aqi;
  const currentRisk = calculateRiskPercentage(currentAqi);

  const handleCitySelect = (pin: GlobeCityPin) => {
    setSelectedCityPin(pin);
    if (onSelectCityLocation) {
      onSelectCityLocation({
        name: pin.name,
        country: pin.country,
        latitude: pin.lat,
        longitude: pin.lng,
      });
    }
  };

  const handleShare = (network: string) => {
    const shareText = `Current Air Quality in ${selectedCityPin.name}: AQI ${selectedCityPin.aqi} (${selectedCityPin.category}). Check your clean air routine on BreatheWise!`;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "https://breathewise.app";

    if (network === "copy") {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
      return;
    }

    let url = "";
    if (network === "x") {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (network === "fb") {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    } else if (network === "wa") {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    }

    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative w-full rounded-3xl bg-[#060a16] border border-slate-800/80 shadow-2xl overflow-hidden p-5 sm:p-7 lg:p-8">
      {/* Subtle background latitude/longitude lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* ========================================================
            LEFT COLUMN: Air Quality Information (Matches IMAGE 1)
           ======================================================== */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Header: Air Quality Index */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white flex items-baseline">
              <span>Air Quality</span>
              <span className="font-light text-slate-400 ml-2.5">Index</span>
            </h1>

            {/* Date, Time & Country Flag badge */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 font-mono">
              <span className="text-slate-300 font-medium">{currentTimeStr}</span>
              <span className="text-slate-600">|</span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#11192e] border border-slate-700/80 text-slate-200">
                <span className="text-slate-400 font-normal">Local →</span>
                <span className="text-sm">{selectedCityPin.flag}</span>
                <span className="font-bold text-white">{selectedCityPin.countryCode}</span>
                <span className="text-slate-400 text-[11px]">({selectedCityPin.name})</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              CARD 1: Main Statistics Card (Matches IMAGE 1)
             ======================================================== */}
          <div className="p-6 rounded-2xl bg-[#0c1427]/90 border border-slate-800/80 shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Main Statistics
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-800/90 text-cyan-400 border border-cyan-500/20">
                Live Sensor Telemetry
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                AQI
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                  {selectedCityPin.aqi}
                </span>
                <span
                  className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                    selectedCityPin.aqi > 200
                      ? "bg-red-500/20 text-red-300 border border-red-500/40"
                      : selectedCityPin.aqi > 150
                      ? "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                      : selectedCityPin.aqi > 100
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  {selectedCityPin.category}
                </span>
              </div>
            </div>

            {/* Dominant Pollutant line */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-slate-400">Dominant Pollutant</span>
                <span className="font-bold text-white">
                  {selectedCityPin.dominantPollutant}
                </span>
                <span className="text-slate-500">—</span>
                <span className="text-cyan-400">Wind</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedCityPin.windSpeed} km/h
              </span>
            </div>
          </div>

          {/* ========================================================
              CARD 2: Risk of Pollution Card (Matches IMAGE 1)
             ======================================================== */}
          <div className="p-6 rounded-2xl bg-[#101b3b]/95 border border-indigo-900/60 shadow-xl backdrop-blur-md relative overflow-hidden group">
            {/* Wavy Wind Breeze SVG Decorative Background */}
            <div className="pointer-events-none absolute right-2 bottom-2 w-32 h-20 opacity-20 text-cyan-400">
              <svg viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M 10 20 Q 40 10 70 20 T 110 15" strokeLinecap="round" />
                <path d="M 20 35 Q 50 25 80 35 T 105 32" strokeLinecap="round" />
                <path d="M 5 50 Q 35 40 65 50 T 115 45" strokeLinecap="round" />
              </svg>
            </div>

            {/* Header: Risk of Pollution + Bright Yellow "Details" Button */}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-sm font-bold text-white">
                Risk of Pollution
              </span>
              <button
                onClick={onOpenDetailsModal}
                className="px-4 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-amber-400/20 active:scale-95"
              >
                Details
              </button>
            </div>

            {/* Big Risk Value */}
            <div className="mt-3 relative z-10">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                Risk
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-0.5">
                {currentRisk}%
              </div>
            </div>

            {/* Weather-related pollution condition note */}
            <div className="mt-3 text-xs text-indigo-200/90 leading-relaxed relative z-10 max-w-[280px]">
              {currentRisk > 50
                ? "High risk due to thermal inversion & winter smog"
                : currentRisk > 30
                ? "Moderate risk due to weather conditions"
                : "Low risk due to active coastal ventilation"}
            </div>
          </div>

          {/* ========================================================
              BOTTOM BAR: Share icons + Coordinates (Matches IMAGE 1)
             ======================================================== */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-300">Share</span>
              <button
                onClick={() => handleShare("fb")}
                className="w-7 h-7 rounded-lg bg-[#11192e] hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors text-slate-300 text-[11px] font-bold"
                title="Share on Facebook"
              >
                f
              </button>
              <button
                onClick={() => handleShare("x")}
                className="w-7 h-7 rounded-lg bg-[#11192e] hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors text-slate-300 text-[11px] font-bold"
                title="Share on X"
              >
                𝕏
              </button>
              <button
                onClick={() => handleShare("wa")}
                className="w-7 h-7 rounded-lg bg-[#11192e] hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-slate-300 text-[11px] font-bold"
                title="Share on WhatsApp"
              >
                wa
              </button>
              <button
                onClick={() => handleShare("copy")}
                className="w-7 h-7 rounded-lg bg-[#11192e] hover:bg-cyan-600 hover:text-white flex items-center justify-center transition-colors text-slate-300 text-[11px]"
                title="Copy Link"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Coordinates Display */}
            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span>
                X: <strong className="text-slate-200">{selectedCityPin.lat.toFixed(3)}</strong>
              </span>
              <span>
                Y: <strong className="text-slate-200">{selectedCityPin.lng.toFixed(3)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: Interactive 3D Earth Globe Centrepiece
           ======================================================== */}
        <div className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[580px] lg:min-h-[700px]">
          {/* Main Display: 3D Globe or 2D IQ Air Map */}
          {viewMode === "globe" ? (
            <EarthGlobe3D
              selectedCity={selectedCityPin}
              onSelectCity={handleCitySelect}
              activeLocation={data.location}
              airQuality={data}
              onViewDetails={onOpenDetailsModal}
            />
          ) : (
            <IqAirMap
              selectedCity={selectedCityPin}
              onSelectCity={handleCitySelect}
              onViewDetails={onOpenDetailsModal}
            />
          )}

          {/* ========================================================
              BOTTOM CENTRE SWITCHER PILL: [ 3D GLOBE ] [ IQ AIR MAP ]
             ======================================================== */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center p-1 rounded-full bg-[#0a1226]/90 border border-slate-700/80 shadow-2xl backdrop-blur-md">
            <button
              onClick={() => setViewMode("globe")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === "globe"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              3D GLOBE
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                viewMode === "map"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              IQ AIR MAP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
