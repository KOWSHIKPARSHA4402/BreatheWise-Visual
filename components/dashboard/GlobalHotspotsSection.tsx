"use client";

import React, { useState, useEffect } from "react";
import { WORLD_CITIES, GlobeCityPin } from "@/components/globe/EarthGlobe3D";
import { Globe, ArrowUpRight, Thermometer, Wind, RefreshCw } from "lucide-react";
import { LocationData, CityComparisonItem } from "@/lib/types";

interface GlobalHotspotsSectionProps {
  onSelectCity?: (loc: LocationData) => void;
}

export default function GlobalHotspotsSection({ onSelectCity }: GlobalHotspotsSectionProps) {
  const [cities, setCities] = useState<GlobeCityPin[]>(WORLD_CITIES);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadLiveHotspots = async () => {
      setIsLoading(true);
      try {
        const locationsToQuery: LocationData[] = WORLD_CITIES.map((c) => ({
          name: c.name,
          country: c.country,
          latitude: c.lat,
          longitude: c.lng,
        }));

        const res = await fetch("/api/air-quality/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locations: locationsToQuery }),
        });

        if (!res.ok) return;

        const liveData: CityComparisonItem[] = await res.json();
        if (!isMounted || !Array.isArray(liveData)) return;

        setCities((prev) =>
          prev.map((orig) => {
            const match = liveData.find(
              (d) => d.location.name.toLowerCase() === orig.name.toLowerCase()
            );
            if (!match) return orig;

            return {
              ...orig,
              aqi: match.cpcbAQI,
              category: match.cpcbCategory,
              dominantPollutant: match.dominantPollutant,
              temp: match.weather?.temperature ?? orig.temp,
              humidity: match.weather?.relativeHumidity ?? orig.humidity,
              windSpeed: match.weather?.windSpeedKmH ?? orig.windSpeed,
            };
          })
        );
      } catch (err) {
        console.warn("Could not load live hotspots:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadLiveHotspots();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sort by AQI descending (most polluted first)
  const sortedCities = [...cities].sort((a, b) => b.aqi - a.aqi);

  return (
    <div className="space-y-4" aria-label="Global Pollution Hotspots">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-[#DCECE8] text-[#234B55] border border-[#A9D5C8] shadow-sm">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#234B55] tracking-tight">
              Global Air Quality Hotspot Comparison
            </h2>
            <p className="text-xs text-[#687D83]">
              Live multi-station comparison across major world metropolitan centers (CPCB NAQI Standard).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isLoading && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#6BAEAA]">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Syncing Live...</span>
            </div>
          )}
          <span className="text-xs font-mono text-[#687D83] px-3.5 py-1.5 rounded-full liquid-glass shadow-sm">
            Source: Copernicus CAMS &amp; Open-Meteo
          </span>
        </div>
      </div>

      {/* Cards Grid with Liquid Glass & Interactive Glowing Borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {sortedCities.slice(0, 10).map((city) => {
          let badgeColor = "bg-[#4A9E86]/15 text-[#234B55] border-[#4A9E86]/40";
          if (city.aqi > 400) badgeColor = "bg-[#8B263E]/20 text-[#8B263E] border-[#8B263E]/50 font-black";
          else if (city.aqi > 300) badgeColor = "bg-[#B85450]/20 text-[#611A17] border-[#B85450]/50 font-bold";
          else if (city.aqi > 200) badgeColor = "bg-[#E0937A]/20 text-[#753424] border-[#E0937A]/50 font-semibold";
          else if (city.aqi > 100) badgeColor = "bg-[#E9B978]/25 text-[#75460E] border-[#E9B978]/60 font-semibold";
          else if (city.aqi > 50) badgeColor = "bg-[#6BAEAA]/20 text-[#234B55] border-[#6BAEAA]/40";

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
              className="p-4 rounded-3xl liquid-glass glow-card cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{city.flag}</span>
                  <span className="font-bold text-sm text-[#234B55] group-hover:text-[#6BAEAA] transition-colors">
                    {city.name}
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#687D83] group-hover:text-[#6BAEAA] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#234B55]">{city.aqi}</span>
                  <span className="text-[10px] font-mono uppercase text-[#687D83]">AQI</span>
                </div>
                <span
                  className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}
                >
                  {city.category}
                </span>
              </div>

              <div className="pt-2 border-t border-[#DCECE8] flex items-center justify-between text-[11px] text-[#687D83] font-mono">
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-[#E9B978]" />
                  <span>{city.temp}°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-[#6BAEAA]" />
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
