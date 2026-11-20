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
    <div className="w-full h-[600px] flex flex-col items-center justify-center space-y-3 bg-[#081326] rounded-3xl">
      <div className="w-10 h-10 border-2 border-[#6BAEAA] border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono text-[#A9D5C8]">Initializing Planetary Earth Simulation...</span>
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
  onExplainCity?: (city: GlobeCityPin) => void;
}

export default function AirIndxHero({
  data,
  onSelectCityLocation,
  onOpenDetailsModal,
  onExplainCity,
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

  // Synchronize hero statistics whenever airQuality data updates
  useEffect(() => {
    if (!data) return;
    setSelectedCityPin((prev) => ({
      id: prev.id || `loc-${data.location.name.toLowerCase()}`,
      name: data.location.name,
      country: data.location.country,
      countryCode: data.location.countryCode || prev.countryCode || "LOC",
      flag: prev.name.toLowerCase() === data.location.name.toLowerCase() ? prev.flag : "📍",
      lat: data.location.latitude,
      lng: data.location.longitude,
      aqi: data.cpcbAQI,
      category: data.cpcbCategory,
      dominantPollutant: data.dominantPollutant,
      temp: data.weather?.temperature ?? prev.temp,
      humidity: data.weather?.relativeHumidity ?? prev.humidity,
      windSpeed: data.weather?.windSpeedKmH ?? prev.windSpeed,
      riskPercent: calculateRiskPercentage(data.cpcbAQI),
      weatherCondition: data.weather?.isSmogTrappingConditions ? "Winter Smog & Inversion" : "Atmospheric Telemetry Active",
    }));
  }, [data]);

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
    <div className="relative w-full rounded-3xl bg-[#081326] border border-[#1b354d] shadow-2xl overflow-hidden p-5 sm:p-7 lg:p-8">
      {/* Subtle background latitude/longitude lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #6BAEAA 1px, transparent 1px), linear-gradient(to bottom, #6BAEAA 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* ========================================================
            LEFT COLUMN: Air Quality Information
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
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0f2138] border border-[#22445e] text-slate-200">
                <span className="text-slate-400 font-normal">Local →</span>
                <span className="text-sm">{selectedCityPin.flag}</span>
                <span className="font-bold text-white">{selectedCityPin.countryCode}</span>
                <span className="text-slate-400 text-[11px]">({selectedCityPin.name})</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              CARD 1: Main Statistics Card (Liquid Glass)
             ======================================================== */}
          <div className="p-6 rounded-3xl liquid-glass-dark glow-card-dark relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Main Statistics
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#132c4a]/80 text-[#A9D5C8] border border-[#6BAEAA]/40 shadow-sm">
                Live Sensor Telemetry
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                AQI
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-5xl sm:text-6xl font-black text-white tracking-tight drop-shadow-sm">
                  {selectedCityPin.aqi}
                </span>
                <span
                  className={`text-xs font-bold uppercase px-3 py-1 rounded-full shadow-sm ${
                    selectedCityPin.aqi > 200
                      ? "bg-[#B85450]/25 text-[#D98E83] border border-[#B85450]/50"
                      : selectedCityPin.aqi > 150
                      ? "bg-[#E0937A]/25 text-[#E0937A] border border-[#E0937A]/50"
                      : selectedCityPin.aqi > 100
                      ? "bg-[#E9B978]/25 text-[#E9B978] border border-[#E9B978]/50"
                      : "bg-[#4A9E86]/25 text-[#A9D5C8] border border-[#4A9E86]/50"
                  }`}
                >
                  {selectedCityPin.category}
                </span>
              </div>
            </div>

            {/* Dominant Pollutant line */}
            <div className="mt-4 pt-3 border-t border-[#22445e]/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-slate-400">Dominant Pollutant</span>
                <span className="font-bold text-white">
                  {selectedCityPin.dominantPollutant}
                </span>
                <span className="text-slate-500">—</span>
                <span className="text-[#6BAEAA]">Wind</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedCityPin.windSpeed} km/h
              </span>
            </div>
          </div>

          {/* ========================================================
              CARD 2: Risk of Pollution Card (Liquid Glass)
             ======================================================== */}
          <div className="p-6 rounded-3xl liquid-glass-dark glow-card-dark relative overflow-hidden group">
            {/* Wavy Wind Breeze SVG Decorative Background */}
            <div className="pointer-events-none absolute right-2 bottom-2 w-32 h-20 opacity-20 text-[#6BAEAA]">
              <svg viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M 10 20 Q 40 10 70 20 T 110 15" strokeLinecap="round" />
                <path d="M 20 35 Q 50 25 80 35 T 105 32" strokeLinecap="round" />
                <path d="M 5 50 Q 35 40 65 50 T 115 45" strokeLinecap="round" />
              </svg>
            </div>

            {/* Header: Risk of Pollution + Soft Amber "Details" Button */}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-sm font-bold text-white">
                Risk of Pollution
              </span>
              <button
                onClick={onOpenDetailsModal}
                className="px-4 py-1.5 rounded-full bg-[#E9B978] hover:bg-[#F2CE9D] text-[#12272C] font-extrabold text-xs transition-all shadow-md glow-btn"
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
            <div className="mt-3 text-xs text-[#A9D5C8] leading-relaxed relative z-10 max-w-[280px]">
              {currentRisk > 50
                ? "High risk due to thermal inversion & winter smog"
                : currentRisk > 30
                ? "Moderate risk due to weather conditions"
                : "Low risk due to active coastal ventilation"}
            </div>
          </div>

          {/* ========================================================
              BOTTOM BAR: Share icons + Coordinates
             ======================================================== */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#22445e]/60 text-xs text-slate-400">
            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-300">Share</span>
              <button
                onClick={() => handleShare("fb")}
                className="w-7 h-7 rounded-xl bg-[#0f2138] border border-[#22445e] hover:bg-[#183654] hover:text-white flex items-center justify-center transition-colors text-slate-300 text-[11px] font-bold glow-btn"
                title="Share on Facebook"
              >
                f
              </button>
              <button
                onClick={() => handleShare("x")}
                className="w-7 h-7 rounded-xl bg-[#0f2138] border border-[#22445e] hover:bg-[#183654] hover:text-white flex items-center justify-center transition-colors text-slate-300 text-[11px] font-bold glow-btn"
                title="Share on X"
              >
                𝕏
              </button>
              <button
                onClick={() => handleShare("wa")}
                className="w-7 h-7 rounded-xl bg-[#0f2138] border border-[#22445e] hover:bg-[#183654] hover:text-white flex items-center justify-center transition-colors text-slate-300 text-[11px] font-bold glow-btn"
                title="Share on WhatsApp"
              >
                wa
              </button>
              <button
                onClick={() => handleShare("copy")}
                className="w-7 h-7 rounded-xl bg-[#0f2138] border border-[#22445e] hover:bg-[#183654] hover:text-white flex items-center justify-center transition-colors text-slate-300 text-[11px] glow-btn"
                title="Copy Link"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5 text-[#6BAEAA]" /> : <Share2 className="w-3.5 h-3.5" />}
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
              onExplainCity={onExplainCity}
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
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center p-1 rounded-full liquid-glass-dark border border-[#214b6d] shadow-2xl">
            <button
              onClick={() => setViewMode("globe")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all glow-btn ${
                viewMode === "globe"
                  ? "bg-[#234B55] text-white border border-[#6BAEAA]/60 shadow-[0_0_12px_rgba(107,174,170,0.4)]"
                  : "text-[#8A9EA4] hover:text-white"
              }`}
            >
              3D GLOBE
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all glow-btn ${
                viewMode === "map"
                  ? "bg-[#234B55] text-white border border-[#6BAEAA]/60 shadow-[0_0_12px_rgba(107,174,170,0.4)]"
                  : "text-[#8A9EA4] hover:text-white"
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
