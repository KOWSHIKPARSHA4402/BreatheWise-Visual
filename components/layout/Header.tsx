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
    <header className="sticky top-0 z-40 w-full border-b border-[#DCECE8] bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-[0_1px_3px_rgba(35,75,85,0.03)]">
      {/* Left: Mobile Toggle + Location Selector + Search Trigger */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-[#687D83] hover:text-[#234B55] hover:bg-[#DCECE8]/60 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        )}

        {/* Location selector button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] hover:border-[#6BAEAA] text-xs sm:text-sm font-medium text-[#234B55] transition-all group shadow-sm"
          title="Change location"
        >
          <MapPin className="w-4 h-4 text-[#6BAEAA] group-hover:scale-110 transition-transform" />
          <span className="font-bold text-[#234B55] truncate max-w-[140px] sm:max-w-[200px]">
            {location.name}
          </span>
          <span className="text-[#687D83] hidden sm:inline">
            · {location.country}
          </span>
          <span className="ml-1 px-1.5 py-0.5 rounded bg-[#DCECE8] text-[10px] text-[#234B55] font-mono hidden md:inline">
            Change
          </span>
        </button>

        {demoMode && (
          <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#E9B978]/20 text-[#75460E] font-semibold border border-[#E9B978]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E9B978] animate-pulse" />
            <span>Simulated Scenario</span>
          </span>
        )}
      </div>

      {/* Center: Search input button shortcut */}
      <div className="hidden lg:flex items-center flex-1 max-w-sm mx-4">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] text-xs text-[#687D83] hover:text-[#234B55] hover:border-[#A9D5C8] transition-all shadow-sm"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#687D83]" />
            <span>Search city or coordinates...</span>
          </span>
          <kbd className="text-[10px] font-mono bg-[#DCECE8] px-1.5 py-0.5 rounded text-[#234B55]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Refresh button + AQI pill + User Profile access */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => refreshAirQuality()}
          disabled={isLoading}
          className="p-2 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] text-[#687D83] hover:text-[#234B55] hover:border-[#A9D5C8] transition-all disabled:opacity-50"
          title="Refresh live environmental telemetry"
          aria-label="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#6BAEAA]" : ""}`} />
        </button>

        {/* Current AQI Category Badge */}
        {airQuality && (
          <div className="flex items-center gap-2 pl-2 border-l border-[#DCECE8]">
            <div className="text-right hidden sm:block">
              <div className="text-[9px] font-mono uppercase text-[#687D83]">CPCB NAQI</div>
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
          className="p-2 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] text-[#687D83] hover:text-[#234B55] hover:border-[#A9D5C8] transition-all ml-1 shadow-sm"
          title="User Preferences & Demo Controls"
        >
          <User className="w-4 h-4 text-[#234B55]" />
        </Link>
      </div>

      {/* City Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-[#234B55]/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#DCECE8] overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#234B55]">
            {/* Search Input Bar */}
            <div className="p-4 border-b border-[#DCECE8] flex items-center gap-3 bg-[#F4F8F6]">
              <Search className="w-5 h-5 text-[#6BAEAA] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city (e.g. New Delhi, Mumbai, Lahore, London)..."
                className="flex-1 bg-transparent border-none text-[#234B55] placeholder:text-[#687D83] text-sm focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 text-[#687D83] hover:text-[#234B55]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-xs font-mono text-[#687D83] hover:text-[#234B55] px-2 py-1 rounded-lg bg-[#DCECE8]"
              >
                Esc
              </button>
            </div>

            {/* Geolocation Button */}
            <div className="p-3 bg-white border-b border-[#DCECE8]">
              <button
                onClick={handleUseCurrentLocation}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] hover:border-[#6BAEAA] text-xs font-semibold text-[#234B55] transition-colors shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5 text-[#6BAEAA]" />
                <span>Use Current Browser Geolocation</span>
              </button>
              {geoError && (
                <div className="mt-2 text-[11px] text-[#75460E] bg-[#E9B978]/20 p-2 rounded-lg flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 shrink-0 text-[#E9B978]" />
                  <span>{geoError}</span>
                </div>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#687D83] font-semibold">
                {searchQuery ? "Matching Results" : "Major Urban Smog Monitoring Locations"}
              </div>

              {isSearching ? (
                <div className="p-6 text-center text-xs text-[#687D83] font-mono">
                  Searching Open-Meteo Geocoding Database...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#687D83]">
                  No locations found matching &quot;{searchQuery}&quot;.
                </div>
              ) : (
                searchResults.map((city, idx) => (
                  <button
                    key={`${city.name}-${city.country}-${idx}`}
                    onClick={() => handleSelectCity(city)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#DCECE8]/50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#DCECE8] text-[#234B55] group-hover:scale-110 transition-transform">
                        <MapPin className="w-4 h-4 text-[#6BAEAA]" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#234B55]">
                          {city.name}
                        </div>
                        <div className="text-xs text-[#687D83]">
                          {city.admin1 ? `${city.admin1}, ` : ""}
                          {city.country}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-[#687D83]">
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
