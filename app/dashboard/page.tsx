"use client";

import React from "react";
import { useLocationContext } from "@/context/LocationContext";
import AqiHeroCard from "@/components/dashboard/AqiHeroCard";
import PollutantGrid from "@/components/dashboard/PollutantGrid";
import TrendChart from "@/components/dashboard/TrendChart";
import QuickActionBanner from "@/components/dashboard/QuickActionBanner";
import ImpactCommunitySection from "@/components/dashboard/ImpactCommunitySection";
import VulnerableAdvisory from "@/components/dashboard/VulnerableAdvisory";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const { airQuality, isLoading, error, refreshAirQuality } = useLocationContext();

  if (isLoading && !airQuality) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
        <div className="text-sm font-mono text-slate-400">
          Fetching live atmospheric telemetry from Open-Meteo &amp; Copernicus CAMS...
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
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16">
      {/* ========================================================
          FIRST SECTION:
          - Welcome message, selected city and current date
          - Current AQI overview & Large visual AQI gauge
          - Pollution severity badge, health advisory, last updated
         ======================================================== */}
      <section aria-label="Current Air Quality Overview">
        <AqiHeroCard data={airQuality} />
      </section>

      {/* ========================================================
          SECOND SECTION:
          - Responsive grid containing 6 pollutant cards:
            PM2.5, PM10, NO2, SO2, CO, O3
         ======================================================== */}
      <section aria-label="Key Pollutant Concentrations">
        <PollutantGrid data={airQuality} />
      </section>

      {/* ========================================================
          THIRD SECTION:
          - Air quality trend chart
          - 24-hour pollution forecast
          - Weather and atmospheric conditions
          - Wind speed, humidity and temperature
         ======================================================== */}
      <section aria-label="Pollution Forecast and Atmospheric Conditions">
        <TrendChart data={airQuality} />
      </section>

      {/* Vulnerable Groups Health Advisory */}
      <section aria-label="Vulnerable Population Clinical Advisories">
        <VulnerableAdvisory data={airQuality} />
      </section>

      {/* ========================================================
          FOURTH SECTION:
          - Action cards for:
            1. Ask the AI Assistant
            2. Generate My Clean Air Plan
            3. Improve Indoor Air Quality
            4. Explore Green Choices
         ======================================================== */}
      <section aria-label="Intelligent Action Center">
        <QuickActionBanner />
      </section>

      {/* ========================================================
          FIFTH SECTION:
          - Environmental impact summary
          - Weekly progress
          - Community awareness section
         ======================================================== */}
      <section aria-label="Environmental Impact and Community Awareness">
        <ImpactCommunitySection />
      </section>
    </div>
  );
}
