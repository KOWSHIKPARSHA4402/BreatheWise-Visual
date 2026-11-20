"use client";

import React from "react";
import {
  Sun,
  Moon,
  Clock,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { AirQualityData } from "@/lib/types";

interface SimpleTrendSummaryProps {
  data: AirQualityData;
  onExploreAdvanced?: () => void;
}

export default function SimpleTrendSummary({ data, onExploreAdvanced }: SimpleTrendSummaryProps) {
  const forecast = data.forecastIntelligence;
  const bestWindow = forecast?.bestOutdoorWindow;
  const summary = forecast?.next24hSummary;

  // Simple daylight milestones
  const milestones = [
    { time: "Morning (7 AM - 10 AM)", label: "Caution", status: "caution", note: "Cool air traps morning traffic fumes" },
    { time: "Midday (11 AM - 1 PM)", label: "Improving", status: "good", note: "Solar heat begins lifting ground smog" },
    {
      time: "Afternoon (1 PM - 4 PM)",
      label: "Best Air",
      status: "best",
      note: bestWindow ? `Optimal window: ${bestWindow.startTime} – ${bestWindow.endTime}` : "Cleanest hours for walks",
    },
    { time: "Evening (5 PM - 8 PM)", label: "Worsening", status: "warning", note: "Rush hour traffic emissions peak" },
    { time: "Night (8 PM - Midnight)", label: "Poor / Stagnant", status: "danger", note: "Cooling air seals smoke at ground level" },
  ];

  return (
    <div className="w-full liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCECE8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#465A60] font-bold">
            <Clock className="w-4 h-4 text-[#6BAEAA]" />
            <span>Simplified Forecast Outlook</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#234B55] tracking-tight mt-1">
            When Will Your Air Be Cleanest Today?
          </h3>
        </div>

        {summary && (
          <div className="flex items-center gap-2 bg-white/80 px-3.5 py-1.5 rounded-full border border-[#DCECE8] text-xs font-bold text-[#234B55]">
            {summary.expectedPeakAqi > 200 ? (
              <TrendingUp className="w-4 h-4 text-[#B85450]" />
            ) : (
              <TrendingDown className="w-4 h-4 text-[#4A9E86]" />
            )}
            <span>
              Expected Peak: AQI {summary.expectedPeakAqi} around {summary.expectedPeakTime}
            </span>
          </div>
        )}
      </div>

      {/* Two Highlight Cards: Best Window vs Worst Smog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Best Window Card */}
        <div className="p-5 rounded-2xl bg-white/80 border border-[#A9D5C8] shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#4A9E86]/15 text-[#4A9E86] shrink-0">
            <Sun className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase font-bold text-[#4A9E86]">
              Cleanest Outdoor Window
            </span>
            <h4 className="text-lg font-black text-[#234B55]">
              {bestWindow ? `${bestWindow.startTime} – ${bestWindow.endTime}` : "1:00 PM – 4:00 PM"}
            </h4>
            <p className="text-xs text-[#234B55]/90 leading-relaxed font-normal">
              {bestWindow?.reason ||
                "Sunlight warms the ground and wind speeds pick up, allowing trapped surface pollutants to disperse into the upper sky. This is your best time for errands and outdoor walks."}
            </p>
          </div>
        </div>

        {/* Night Smog Risk Card */}
        <div className="p-5 rounded-2xl bg-white/80 border border-[#E9B978]/60 shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#E9B978]/20 text-[#915B17] shrink-0">
            <Moon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase font-bold text-[#915B17]">
              Evening &amp; Night Inversion Alert
            </span>
            <h4 className="text-lg font-black text-[#234B55]">
              Tonight after 8:00 PM
            </h4>
            <p className="text-xs text-[#234B55]/90 leading-relaxed font-normal">
              As temperatures drop after sunset, cold air settles close to the ground, trapping smoke and diesel soot beneath a temperature inversion. Avoid late-night runs and keep windows sealed.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Diurnal Progression Timeline */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase font-bold text-[#465A60] tracking-wide block">
          Today&apos;s Air Rhythm Throughout the Day
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {milestones.map((m) => {
            const isBest = m.status === "best";
            const isGood = m.status === "good";
            const isCaution = m.status === "caution";
            const isWarning = m.status === "warning";

            const badgeBg = isBest
              ? "bg-[#4A9E86] text-white"
              : isGood
              ? "bg-[#6BAEAA] text-white"
              : isCaution
              ? "bg-[#E9B978] text-[#1A373E]"
              : isWarning
              ? "bg-[#E0937A] text-white"
              : "bg-[#B85450] text-white";

            return (
              <div
                key={m.time}
                className="p-3.5 rounded-2xl bg-white/70 border border-[#DCECE8] flex flex-col justify-between space-y-2 hover:bg-white transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#234B55]">{m.time.split(" ")[0]}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeBg}`}>
                    {m.label}
                  </span>
                </div>
                <p className="text-[11px] text-[#465A60] leading-snug">
                  {m.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Strip with Action to Explore Advanced Data */}
      <div className="pt-3 border-t border-[#DCECE8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#465A60]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#6BAEAA]" />
          <span>Estimated from verified Copernicus CAMS &amp; Open-Meteo atmospheric telemetry.</span>
        </div>

        {onExploreAdvanced && (
          <button
            type="button"
            onClick={onExploreAdvanced}
            className="text-xs font-bold text-[#234B55] hover:text-[#6BAEAA] flex items-center gap-1 transition-colors"
          >
            <span>Explore Full Technical Charts &amp; History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
