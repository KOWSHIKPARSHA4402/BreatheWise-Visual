"use client";

import React, { useState, useEffect } from "react";
import {
  LocationData,
  CityComparisonItem,
  AQICategory,
} from "@/lib/types";
import { PRESET_LOCATIONS, searchCities } from "@/lib/open-meteo";
import {
  GitCompare,
  Plus,
  X,
  Search,
  TrendingDown,
  Clock,
  Database,
  Building2,
} from "lucide-react";
import { getCPCBAQICategory } from "@/lib/aqi-calculator";

interface CityComparisonSectionProps {
  currentLocation: LocationData;
  onSelectCity?: (loc: LocationData) => void;
}

export default function CityComparisonSection({
  currentLocation,
  onSelectCity,
}: CityComparisonSectionProps) {
  // Cities selected for comparison (at least 2)
  const [comparedCities, setComparedCities] = useState<LocationData[]>([
    currentLocation,
    PRESET_LOCATIONS[5], // London
    PRESET_LOCATIONS[7], // Beijing
  ]);

  const [comparisonData, setComparisonData] = useState<CityComparisonItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // AQI Standard display toggle ("CPCB" | "US_EPA")
  const [activeStandard, setActiveStandard] = useState<"CPCB" | "US_EPA">("CPCB");

  // Keep comparedCities in sync when currentLocation changes
  useEffect(() => {
    setComparedCities((prev) => {
      const exists = prev.some(
        (c) => c.name.toLowerCase() === currentLocation.name.toLowerCase()
      );
      if (!exists) {
        return [currentLocation, ...prev.slice(0, 2)];
      }
      return prev;
    });
  }, [currentLocation]);

  // Fetch batch comparison data whenever comparedCities changes
  useEffect(() => {
    let isMounted = true;
    const fetchComparison = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/air-quality/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locations: comparedCities }),
        });

        if (!res.ok) throw new Error(`Batch API error: ${res.status}`);

        const data: CityComparisonItem[] = await res.json();
        if (isMounted) {
          setComparisonData(data);
        }
      } catch (err) {
        console.error("Comparison fetch failed:", err);
        if (isMounted) {
          setError("Failed to fetch comparative air quality data. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchComparison();
    return () => {
      isMounted = false;
    };
  }, [comparedCities]);

  // Handle Search Input
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(searchQuery);
        setSearchResults(results);
        setIsDropdownOpen(true);
      } catch (err) {
        console.warn("City search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddCity = (city: LocationData) => {
    const exists = comparedCities.some(
      (c) => c.name.toLowerCase() === city.name.toLowerCase()
    );
    if (!exists) {
      if (comparedCities.length >= 4) {
        // Replace the last one if reached limit of 4
        setComparedCities([...comparedCities.slice(0, 3), city]);
      } else {
        setComparedCities([...comparedCities, city]);
      }
    }
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  const handleRemoveCity = (cityName: string) => {
    if (comparedCities.length <= 2) {
      alert("You need at least 2 cities to maintain a side-by-side comparison.");
      return;
    }
    setComparedCities(comparedCities.filter((c) => c.name !== cityName));
  };

  // Comparative winner calculations
  const sortedByPm25 = [...comparisonData].sort((a, b) => {
    const pA = a.pollutants.pm2_5.value ?? 999;
    const pB = b.pollutants.pm2_5.value ?? 999;
    return pA - pB;
  });

  const cleanestCity = sortedByPm25[0];
  const mostPollutedCity = sortedByPm25[sortedByPm25.length - 1];

  let pmRatio = 1;
  if (
    cleanestCity &&
    mostPollutedCity &&
    cleanestCity.pollutants.pm2_5.value &&
    mostPollutedCity.pollutants.pm2_5.value &&
    cleanestCity.pollutants.pm2_5.value > 0
  ) {
    pmRatio = Number(
      (mostPollutedCity.pollutants.pm2_5.value / cleanestCity.pollutants.pm2_5.value).toFixed(1)
    );
  }

  return (
    <div className="space-y-6" aria-label="Cross-City Air Quality Intelligence">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCECE8] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#DCECE8] text-[#234B55] border border-[#A9D5C8] shadow-sm">
            <GitCompare className="w-5 h-5 text-[#234B55]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#234B55] tracking-tight">
                Live Multi-City Air Quality Comparison
              </h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#DCECE8] text-[#234B55] border border-[#A9D5C8] font-bold">
                Live Grounded
              </span>
            </div>
            <p className="text-xs text-[#687D83] font-light">
              Compare actual atmospheric concentrations, particulate loads, and health ratings across global cities side-by-side.
            </p>
          </div>
        </div>

        {/* Standard Selector Switch */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-mono text-[#687D83] font-semibold">Standard:</span>
          <div className="flex items-center p-1 rounded-2xl liquid-glass border border-[#DCECE8] shadow-sm text-xs font-mono">
            <button
              onClick={() => setActiveStandard("CPCB")}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                activeStandard === "CPCB"
                  ? "bg-[#234B55] text-white shadow-sm"
                  : "text-[#687D83] hover:text-[#234B55]"
              }`}
              title="Central Pollution Control Board (India MoEFCC) standard breakpoints"
            >
              CPCB NAQI (India)
            </button>
            <button
              onClick={() => setActiveStandard("US_EPA")}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                activeStandard === "US_EPA"
                  ? "bg-[#234B55] text-white shadow-sm"
                  : "text-[#687D83] hover:text-[#234B55]"
              }`}
              title="United States Environmental Protection Agency AQI scale"
            >
              US EPA AQI
            </button>
          </div>
        </div>
      </div>

      {/* Add City Bar & Quick Chips */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input with dropdown */}
        <div className="relative w-full max-w-md">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#6BAEAA] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city to add (e.g. Paris, Tokyo, Mumbai)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl liquid-glass border border-[#DCECE8] focus:border-[#6BAEAA] focus:ring-2 focus:ring-[#6BAEAA]/20 text-xs sm:text-sm text-[#234B55] placeholder:text-[#687D83] outline-none transition-all shadow-sm"
            />
            {isSearching && (
              <div className="w-4 h-4 border-2 border-[#6BAEAA] border-t-transparent rounded-full animate-spin absolute right-3" />
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl liquid-glass border border-[#DCECE8] shadow-2xl p-2 space-y-1 bg-white/95 backdrop-blur-xl animate-fadeIn">
              <div className="text-[10px] font-mono uppercase text-[#687D83] px-3 py-1 font-bold">
                Select City to Compare
              </div>
              {searchResults.map((city) => (
                <button
                  key={`${city.name}-${city.latitude}-${city.longitude}`}
                  onClick={() => handleAddCity(city)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#DCECE8]/70 flex items-center justify-between transition-colors text-[#234B55]"
                >
                  <span className="font-semibold">
                    {city.name}, {city.country} {city.admin1 ? `(${city.admin1})` : ""}
                  </span>
                  <Plus className="w-3.5 h-3.5 text-[#6BAEAA]" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Preset City Shortcut Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-mono text-[#687D83] shrink-0 font-medium">
            Quick Add:
          </span>
          {PRESET_LOCATIONS.slice(0, 7).map((loc) => {
            const isSelected = comparedCities.some((c) => c.name === loc.name);
            return (
              <button
                key={loc.name}
                onClick={() => handleAddCity(loc)}
                disabled={isSelected}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 border ${
                  isSelected
                    ? "bg-[#DCECE8] text-[#234B55] border-[#A9D5C8] opacity-60 cursor-default"
                    : "liquid-glass border-[#DCECE8] text-[#234B55] hover:border-[#6BAEAA] hover:text-[#234B55] glow-btn"
                }`}
              >
                {loc.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparative Ratio Callout Banner */}
      {cleanestCity && mostPollutedCity && cleanlyComputed(cleanestCity, mostPollutedCity) && (
        <div className="p-4 sm:p-5 rounded-3xl liquid-glass border border-[#6BAEAA]/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#4A9E86]/15 text-[#234B55] border border-[#4A9E86]/30">
              <TrendingDown className="w-5 h-5 text-[#4A9E86]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#234B55]">
                {cleanestCity.location.name} has {pmRatio > 1 ? `${pmRatio}x cleaner` : "cleaner"} respirable air than {mostPollutedCity.location.name}
              </h4>
              <p className="text-xs text-[#687D83] font-light">
                PM2.5 exposure in {mostPollutedCity.location.name} is currently {mostPollutedCity.pollutants.pm2_5.value} µg/m³ vs {cleanestCity.pollutants.pm2_5.value} µg/m³ in {cleanestCity.location.name}.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono text-[#234B55] bg-white/70 px-3 py-1.5 rounded-xl border border-[#DCECE8]">
            <Clock className="w-3.5 h-3.5 text-[#6BAEAA]" />
            <span>Telemetry updated within 60 mins</span>
          </div>
        </div>
      )}

      {/* Comparative Cards Grid */}
      {isLoading && !comparisonData.length ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-3 liquid-glass rounded-3xl border border-[#DCECE8]">
          <div className="w-8 h-8 border-2 border-[#6BAEAA] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-[#687D83]">
            Retrieving real-time atmospheric measurements for compared cities...
          </span>
        </div>
      ) : error ? (
        <div className="p-6 rounded-3xl bg-[#B85450]/10 border border-[#B85450]/30 text-center text-xs text-[#B85450]">
          {error}
        </div>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(comparisonData.length, 4)} gap-4 lg:gap-6`}>
          {comparisonData.map((item) => {
            const displayAQI = activeStandard === "CPCB" ? item.cpcbAQI : item.usAQI;
            const category: AQICategory = getCPCBAQICategory(displayAQI);

            let badgeBg = "bg-[#4A9E86] text-white";
            let cardBorder = "border-[#DCECE8]";
            if (displayAQI > 300) {
              badgeBg = "bg-[#B85450] text-white";
              cardBorder = "border-[#B85450]/40";
            } else if (displayAQI > 200) {
              badgeBg = "bg-[#E0937A] text-white";
              cardBorder = "border-[#E0937A]/40";
            } else if (displayAQI > 100) {
              badgeBg = "bg-[#E9B978] text-[#234B55] font-bold";
              cardBorder = "border-[#E9B978]/40";
            } else if (displayAQI > 50) {
              badgeBg = "bg-[#6BAEAA] text-white";
              cardBorder = "border-[#6BAEAA]/40";
            }

            return (
              <div
                key={item.location.name}
                className={`p-5 rounded-3xl liquid-glass glow-card border ${cardBorder} flex flex-col justify-between space-y-4 relative group`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#6BAEAA]" />
                      <h3 className="font-bold text-base text-[#234B55] tracking-tight">
                        {item.location.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#687D83]">
                      {item.location.country} {item.location.admin1 ? `· ${item.location.admin1}` : ""}
                    </p>
                  </div>

                  {comparedCities.length > 2 && (
                    <button
                      onClick={() => handleRemoveCity(item.location.name)}
                      className="p-1.5 rounded-xl text-[#687D83] hover:text-[#B85450] hover:bg-white/80 transition-colors"
                      title="Remove from comparison"
                      aria-label="Remove city"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* AQI Stat Box */}
                <div className="p-4 rounded-2xl bg-white/70 border border-[#DCECE8] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#687D83] block">
                      {activeStandard === "CPCB" ? "CPCB NAQI Index" : "US EPA AQI Index"}
                    </span>
                    <span className="text-3xl font-black text-[#234B55]">{displayAQI}</span>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${badgeBg}`}>
                      {category}
                    </span>
                    <span className="text-[10px] font-mono text-[#687D83] block mt-1">
                      Dominant: {item.dominantPollutant}
                    </span>
                  </div>
                </div>

                {/* Pollutants Breakdown Table */}
                <div className="space-y-2 pt-1 border-t border-[#DCECE8]">
                  <div className="text-[11px] font-mono uppercase text-[#687D83] font-bold flex justify-between">
                    <span>Pollutant</span>
                    <span>Observation</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#234B55]">
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/50">
                      <span className="font-semibold">PM2.5 (Fine Soot)</span>
                      <span className="font-mono font-bold">
                        {item.pollutants.pm2_5.value !== null ? `${item.pollutants.pm2_5.value} µg/m³` : "Unavailable"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/50">
                      <span className="font-semibold">PM10 (Coarse Dust)</span>
                      <span className="font-mono font-bold">
                        {item.pollutants.pm10.value !== null ? `${item.pollutants.pm10.value} µg/m³` : "Unavailable"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/50">
                      <span className="font-semibold">NO2 (Diesel Exhaust)</span>
                      <span className="font-mono font-bold">
                        {item.pollutants.no2.value !== null ? `${item.pollutants.no2.value} µg/m³` : "Unavailable"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/50">
                      <span className="font-semibold">CO (Carbon Monoxide)</span>
                      <span className="font-mono font-bold">
                        {item.pollutants.co.value !== null ? `${item.pollutants.co.value} mg/m³` : "Unavailable"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/50">
                      <span className="font-semibold">O3 (Ozone)</span>
                      <span className="font-mono font-bold">
                        {item.pollutants.o3.value !== null ? `${item.pollutants.o3.value} µg/m³` : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer: Attribution & Select Action */}
                <div className="pt-2 border-t border-[#DCECE8] flex items-center justify-between text-[11px] text-[#687D83]">
                  <div className="flex items-center gap-1 font-mono">
                    <Database className="w-3 h-3 text-[#6BAEAA]" />
                    <span>CAMS Global</span>
                  </div>

                  {onSelectCity && (
                    <button
                      onClick={() => onSelectCity(item.location)}
                      className="text-xs font-bold text-[#234B55] hover:text-[#6BAEAA] transition-colors glow-btn"
                    >
                      Make Active
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function cleanlyComputed(a: CityComparisonItem, b: CityComparisonItem) {
  return a.location.name !== b.location.name && a.pollutants.pm2_5.value !== null && b.pollutants.pm2_5.value !== null;
}
