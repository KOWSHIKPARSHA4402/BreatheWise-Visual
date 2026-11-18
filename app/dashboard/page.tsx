"use client";

import React from "react";
import { useLocationContext } from "@/context/LocationContext";
import AqiHeroCard from "@/components/dashboard/AqiHeroCard";
import PollutantGrid from "@/components/dashboard/PollutantGrid";
import TrendChart from "@/components/dashboard/TrendChart";
import VulnerableAdvisory from "@/components/dashboard/VulnerableAdvisory";
import QuickActionBanner from "@/components/dashboard/QuickActionBanner";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const { airQuality, isLoading, error, refreshAirQuality } = useLocationContext();

  if (isLoading && !airQuality) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
        <div className="text-sm font-mono text-slate-500">
          Fetching live atmospheric telemetry from Open-Meteo &amp; Copernicus CAMS...
        </div>
      </div>
    );
  }

  if (!airQuality) {
    return (
      <div className="p-8 rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Unable to Load Air Quality Telemetry</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {error || "Could not retrieve atmospheric data for this coordinate. Please verify your connection or select another city."}
        </p>
        <button
          onClick={() => refreshAirQuality()}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Hero Card */}
      <AqiHeroCard data={airQuality} />

      {/* 2. Quick Action Navigation Shortcuts */}
      <QuickActionBanner />

      {/* 3. Detailed Pollutant Breakdown Grid */}
      <PollutantGrid data={airQuality} />

      {/* 4. 24-hr & 7-day Atmospheric Trend Graphs */}
      <TrendChart data={airQuality} />

      {/* 5. Vulnerable Groups Health Advisory */}
      <VulnerableAdvisory data={airQuality} />
    </div>
  );
}
