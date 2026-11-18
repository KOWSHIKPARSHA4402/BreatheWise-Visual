"use client";

import React, { useState } from "react";
import { useLocationContext } from "@/context/LocationContext";
import AirIndxHero from "@/components/dashboard/AirIndxHero";
import GlobalHotspotsSection from "@/components/dashboard/GlobalHotspotsSection";
import PollutantGrid from "@/components/dashboard/PollutantGrid";
import TrendChart from "@/components/dashboard/TrendChart";
import VulnerableAdvisory from "@/components/dashboard/VulnerableAdvisory";
import QuickActionBanner from "@/components/dashboard/QuickActionBanner";
import ImpactCommunitySection from "@/components/dashboard/ImpactCommunitySection";
import DetailsModal from "@/components/dashboard/DetailsModal";
import { AlertCircle } from "lucide-react";
import { LocationData } from "@/lib/types";

export default function DashboardPage() {
  const { airQuality, isLoading, error, refreshAirQuality, setLocation } = useLocationContext();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  if (isLoading && !airQuality) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="text-xs font-mono text-cyan-300">
          Streaming planetary air quality telemetry from Open-Meteo &amp; Copernicus CAMS...
        </div>
      </div>
    );
  }

  if (!airQuality) {
    return (
      <div className="p-8 rounded-3xl bg-red-950/20 border border-red-900/40 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Unable to Load Air Quality Telemetry</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          {error || "Could not retrieve atmospheric data for this coordinate. Please verify your connection or select another city."}
        </p>
        <button
          onClick={() => refreshAirQuality()}
          className="px-5 py-2.5 rounded-full bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleSelectCityLocation = (loc: LocationData) => {
    setLocation(loc);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* ========================================================
          HERO CENTREPIECE SECTION (MATCHES IMAGE 1 - AirIndx)
          - Left: Air Quality Index, Date/Time, Local flag, Main Statistics Card, Risk of Pollution Card, Share & Coordinates
          - Right: Massive Interactive 3D Earth Globe (Three.js WebGL) with city AQI pins, active tooltip card, zoom & 3D Globe / IQ Air Map toggle
         ======================================================== */}
      <section aria-label="3D Planetary Air Quality Hero">
        <AirIndxHero
          data={airQuality}
          onSelectCityLocation={handleSelectCityLocation}
          onOpenDetailsModal={() => setIsDetailsModalOpen(true)}
        />
      </section>

      {/* ========================================================
          SECTION 1: Global Air Quality Overview & Hotspot Comparison
         ======================================================== */}
      <section aria-label="Global Air Quality Hotspots">
        <GlobalHotspotsSection onSelectCity={handleSelectCityLocation} />
      </section>

      {/* ========================================================
          SECTION 2: Key Pollutant Breakdown (PM2.5, PM10, NO2, SO2, CO, O3)
         ======================================================== */}
      <section aria-label="Key Pollutant Concentrations">
        <PollutantGrid data={airQuality} />
      </section>

      {/* ========================================================
          SECTION 3: 24-Hour & 7-Day Air Quality Trend Charts
         ======================================================== */}
      <section aria-label="Pollution Forecast and Atmospheric Conditions">
        <TrendChart data={airQuality} />
      </section>

      {/* ========================================================
          SECTION 4: Vulnerable Population Clinical Advisories
         ======================================================== */}
      <section aria-label="Vulnerable Population Clinical Advisories">
        <VulnerableAdvisory data={airQuality} />
      </section>

      {/* ========================================================
          SECTION 5: Intelligent Quick Action Banner
          (Ask AI, Clean Air Plan, Indoor CADR, Green Choices)
         ======================================================== */}
      <section aria-label="Intelligent Action Center">
        <QuickActionBanner />
      </section>

      {/* ========================================================
          SECTION 6: Environmental Impact & Community Awareness
         ======================================================== */}
      <section aria-label="Environmental Impact and Community Awareness">
        <ImpactCommunitySection />
      </section>

      {/* Detailed Assessment Modal (Triggered by Hero Details Button) */}
      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        data={airQuality}
      />
    </div>
  );
}
