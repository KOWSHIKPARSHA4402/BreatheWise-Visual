"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Search,
  Navigation,
  RefreshCw,
  SlidersHorizontal,
  X,
  AlertTriangle,
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
    }, 300);

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
        try {
          // Reverse geocode via Open-Meteo or fall back gracefully
          const loc: LocationData = {
            name: "Current Location",
            country: "Local Area",
            latitude: Number(latitude.toFixed(4)),
            longitude: Number(longitude.toFixed(4)),
            isCurrentLocation: true,
          };
          setLocation(loc);
          setIsSearchOpen(false);
        } catch {
          setGeoError("Failed to resolve city name for your coordinates.");
        }
      },
      (err) => {
        console.warn("Geolocation denied or unavailable:", err);
        setGeoError("Location access was denied. You can select a city manually.");
      },
      { timeout: 8000 }
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu + Current Location Display */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            aria-label="Open Navigation Menu"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        )}

        {/* Location selector button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 group"
        >
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-[200px]">
            {location.name}
          </span>
          <span className="text-slate-600 dark:text-slate-400 hidden sm:inline">
            · {location.country}
          </span>
          <Search className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 ml-1" />
        </button>

        {demoMode && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-semibold border border-purple-300 dark:border-purple-800">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Demo Mode Active
          </span>
        )}
      </div>

      {/* Right: Refresh & Current AQI Summary Pill */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => refreshAirQuality()}
          disabled={isLoading}
          className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors disabled:opacity-50"
          title="Refresh live environmental data"
          aria-label="Refresh live data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-emerald-500" : ""}`} />
        </button>

        {airQuality && (
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-mono uppercase text-slate-600 dark:text-slate-400">
                CPCB Standard
              </div>
              <div className={`text-xs font-bold ${theme?.textColor}`}>
                {airQuality.cpcbCategory}
              </div>
            </div>
            <div
              className="px-2.5 py-1 rounded-xl font-mono font-black text-sm text-white shadow-sm flex items-center gap-1.5"
              style={{ backgroundColor: theme?.color }}
            >
              <span>{airQuality.cpcbAQI}</span>
              <span className="text-[10px] opacity-80 uppercase">AQI</span>
            </div>
          </div>
        )}
      </div>

      {/* City Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city (e.g., Delhi, Mumbai, London, New York)..."
                className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 text-sm focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Esc
              </button>
            </div>

            {/* Geolocation Button */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={handleUseCurrentLocation}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition-colors shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Use Current Browser Location</span>
              </button>
              {geoError && (
                <div className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{geoError}</span>
                </div>
              )}
            </div>

            {/* City Results List */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {searchQuery ? "Search Results" : "Major Urban Smog Monitoring Locations"}
              </div>

              {isSearching ? (
                <div className="p-6 text-center text-xs text-slate-600 dark:text-slate-400 font-mono">
                  Searching Open-Meteo Geocoding Database...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-600 dark:text-slate-400">
                  No cities found matching &quot;{searchQuery}&quot;. Try typing a different city name.
                </div>
              ) : (
                searchResults.map((city, idx) => (
                  <button
                    key={`${city.name}-${city.country}-${idx}`}
                    onClick={() => handleSelectCity(city)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {city.name}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {city.admin1 ? `${city.admin1}, ` : ""}
                          {city.country}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
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
