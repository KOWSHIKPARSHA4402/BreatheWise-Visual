"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  Navigation,
  RefreshCw,
  SlidersHorizontal,
  X,
  AlertTriangle,
  User,
} from "lucide-react";
import { useLocationContext } from "@/context/LocationContext";
import { PRESET_LOCATIONS } from "@/lib/open-meteo";
import { LocationData } from "@/lib/types";
import { getCategoryTheme } from "@/lib/aqi-calculator";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { location, setLocation, airQuality, isLoading, refreshAirQuality, demoMode } = useLocationContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const theme = airQuality ? getCategoryTheme(airQuality.cpcbCategory) : null;

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults(PRESET_LOCATIONS);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/geocoding?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.warn("Geocoding failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const handleSelectCity = (loc: LocationData) => {
    setLocation(loc);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleUseCurrentLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc: LocationData = {
          name: "Current Location",
          country: "Local Coordinates",
          latitude: Number(latitude.toFixed(4)),
          longitude: Number(longitude.toFixed(4)),
          isCurrentLocation: true,
        };
        setLocation(loc);
        setIsSearchOpen(false);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setGeoError("Location access denied. Please select city manually.");
      },
      { timeout: 8000 }
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0a0f1d]/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle + Location Selector + Search Trigger */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        )}

        {/* Location selector button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131d31] border border-slate-700/80 hover:border-emerald-500/60 text-xs sm:text-sm font-medium text-slate-200 transition-all group shadow-sm"
          title="Change location"
        >
          <MapPin className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-white truncate max-w-[140px] sm:max-w-[200px]">
            {location.name}
          </span>
          <span className="text-slate-400 hidden sm:inline">
            · {location.country}
          </span>
          <span className="ml-1 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono hidden md:inline">
            Change
          </span>
        </button>

        {demoMode && (
          <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 font-semibold border border-purple-800">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>Simulated Scenario</span>
          </span>
        )}
      </div>

      {/* Center: Search input button shortcut */}
      <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#131d31]/80 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search city or coordinates...</span>
          </span>
          <kbd className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Refresh button + AQI pill + User Profile access */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => refreshAirQuality()}
          disabled={isLoading}
          className="p-2 rounded-xl bg-[#131d31] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all disabled:opacity-50"
          title="Refresh live environmental telemetry"
          aria-label="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
        </button>

        {/* Current AQI Category Badge */}
        {airQuality && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-[9px] font-mono uppercase text-slate-400">CPCB NAQI</div>
              <div className={`text-xs font-bold ${theme?.textColor}`}>
                {airQuality.cpcbCategory}
              </div>
            </div>
            <div
              className="px-2.5 py-1 rounded-xl font-mono font-black text-xs sm:text-sm text-white shadow-sm flex items-center gap-1.5"
              style={{ backgroundColor: theme?.color }}
            >
              <span>{airQuality.cpcbAQI}</span>
              <span className="text-[9px] opacity-80 uppercase">AQI</span>
            </div>
          </div>
        )}

        {/* Settings / User Profile Avatar */}
        <Link
          href="/settings"
          className="p-2 rounded-xl bg-[#131d31] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all ml-1"
          title="User Preferences & Demo Controls"
        >
          <User className="w-4 h-4 text-slate-300" />
        </Link>
      </div>

      {/* City Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-lg bg-[#0e172a] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-[#111c33]">
              <Search className="w-5 h-5 text-emerald-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city (e.g. New Delhi, Mumbai, Lahore, London)..."
                className="flex-1 bg-transparent border-none text-white placeholder:text-slate-400 text-sm focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
              >
                Esc
              </button>
            </div>

            {/* Geolocation Button */}
            <div className="p-3 bg-[#0c1426] border-b border-slate-800/80">
              <button
                onClick={handleUseCurrentLocation}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#131d31] border border-slate-700 hover:border-emerald-500 text-xs font-semibold text-emerald-400 transition-colors shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Use Current Browser Geolocation</span>
              </button>
              {geoError && (
                <div className="mt-2 text-[11px] text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{geoError}</span>
                </div>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {searchQuery ? "Matching Results" : "Major Urban Smog Monitoring Locations"}
              </div>

              {isSearching ? (
                <div className="p-6 text-center text-xs text-slate-400 font-mono">
                  Searching Open-Meteo Geocoding Database...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No locations found matching &quot;{searchQuery}&quot;.
                </div>
              ) : (
                searchResults.map((city, idx) => (
                  <button
                    key={`${city.name}-${city.country}-${idx}`}
                    onClick={() => handleSelectCity(city)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#15223c] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 group-hover:scale-110 transition-transform">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {city.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {city.admin1 ? `${city.admin1}, ` : ""}
                          {city.country}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
