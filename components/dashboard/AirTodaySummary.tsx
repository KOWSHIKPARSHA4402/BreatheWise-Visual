"use client";

import React from "react";
import {
  Wind,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Eye,
  Sparkles,
} from "lucide-react";
import { AirQualityData } from "@/lib/types";
import InfoTooltip from "@/components/ui/InfoTooltip";

interface AirTodaySummaryProps {
  data: AirQualityData;
  onAskAi?: (prompt: string) => void;
}

export default function AirTodaySummary({ data, onAskAi }: AirTodaySummaryProps) {
  const aqi = data.cpcbAQI;
  const city = data.location.name;

  // Determine plain English status and advice
  let statusBadge = "Good";
  let statusColor = "bg-[#6BAEAA]/15 text-[#234B55] border-[#6BAEAA]/30";
  let statusIcon = ShieldCheck;
  let headline = "The air is fresh and safe for everyone today!";
  let plainMeaning =
    "Air quality is optimal. You can comfortably exercise outdoors, leave your home windows open for natural ventilation, and enjoy outdoor activities without any health concerns.";
  let impactNote = "Ideal for morning jogs, walking kids to school, and deep outdoor breathing.";

  if (aqi > 400) {
    statusBadge = "Severe (Hazardous)";
    statusColor = "bg-[#B85450]/15 text-[#B85450] border-[#B85450]/40";
    statusIcon = ShieldAlert;
    headline = "Emergency Alert: The air outdoors is heavily contaminated.";
    plainMeaning =
      "Breathing this air for a prolonged time poses a serious risk to even completely healthy people. Microscopic toxic particles enter deep into the lungs and blood vessels.";
    impactNote = "Seal all windows shut, keep bedroom HEPA purifiers running continuously, and wear a well-fitted certified N95 respirator if stepping outside.";
  } else if (aqi > 300) {
    statusBadge = "Very Poor";
    statusColor = "bg-[#D98E83]/20 text-[#9E3E37] border-[#D98E83]/50";
    statusIcon = AlertTriangle;
    headline = "The air is heavily polluted and unhealthy for anyone.";
    plainMeaning =
      "Fine soot, combustion gases, and dust particles have accumulated near ground level. People with asthma or heart conditions may experience sudden coughing or chest tightness.";
    impactNote = "Avoid all outdoor workouts, keep windows closed, and use high-grade air filtration indoors.";
  } else if (aqi > 200) {
    statusBadge = "Poor";
    statusColor = "bg-[#E9B978]/25 text-[#915B17] border-[#E9B978]/50";
    statusIcon = AlertTriangle;
    headline = "The air quality is poor — vulnerable individuals should take care.";
    plainMeaning =
      "There is enough particulate pollution in the air to cause eye irritation, throat dryness, and breathing discomfort, especially in children, elderly adults, and cyclists.";
    impactNote = "Reschedule vigorous runs to midday when sunlight breaks up the pollution layer, or exercise indoors.";
  } else if (aqi > 100) {
    statusBadge = "Moderately Polluted";
    statusColor = "bg-[#E9B978]/15 text-[#915B17] border-[#E9B978]/30";
    statusIcon = Wind;
    headline = "Acceptable for most, but sensitive groups may feel slight irritation.";
    plainMeaning =
      "General population is fine, but people with asthma or allergies might notice mild throat scratchiness or sinus pressure after prolonged outdoor activity.";
    impactNote = "Keep windows open during warm afternoon hours; sensitive individuals should carry inhalers.";
  } else if (aqi > 50) {
    statusBadge = "Satisfactory";
    statusColor = "bg-[#A9D5C8]/25 text-[#234B55] border-[#A9D5C8]/40";
    statusIcon = ShieldCheck;
    headline = "Generally good air quality with minor trace pollutants.";
    plainMeaning =
      "Air quality is satisfactory. Highly sensitive individuals may notice extremely mild irritation from dust, but overall health risks are minimal.";
    impactNote = "Great day for daily errands, park walks, and natural room ventilation.";
  }

  // Find dominant pollutant in plain English
  const pm25Val = data.pollutants.pm2_5.value ?? 0;
  const pm10Val = data.pollutants.pm10.value ?? 0;
  const no2Val = data.pollutants.no2.value ?? 0;

  let dominantName = "Fine Dust (PM2.5)";
  let dominantReason = "Microscopic soot from vehicle exhaust, power plants, and smoke.";
  let dominantAnalog = "30 times thinner than a single human hair, penetrates deep into lungs.";

  if (no2Val > 80 && no2Val > pm25Val) {
    dominantName = "Vehicle Exhaust Fumes (NO2)";
    dominantReason = "Toxic gas released directly from petrol and diesel car exhausts.";
    dominantAnalog = "Causes direct airway inflammation and acid-like throat burn.";
  } else if (pm10Val > 200 && pm10Val > pm25Val * 2) {
    dominantName = "Coarse Road & Construction Dust (PM10)";
    dominantReason = "Larger airborne particles from dry roads, digging, and wind-blown dirt.";
    dominantAnalog = "Filtered somewhat by your nose, but causes heavy eye and sinus stinging.";
  }

  const StatusIcon = statusIcon;

  return (
    <div className="w-full liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCECE8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#465A60] font-bold">
            <Sparkles className="w-4 h-4 text-[#6BAEAA]" />
            <span>Plain-English Air Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#234B55] mt-1 tracking-tight">
            What’s Happening With Your Air Today in {city}?
          </h2>
        </div>

        {/* CPCB Scale Pill */}
        <div className="flex items-center gap-2">
          <div className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 shadow-sm ${statusColor}`}>
            <StatusIcon className="w-5 h-5 shrink-0" />
            <div className="text-left">
              <span className="text-[11px] uppercase font-mono tracking-wider block opacity-85 font-bold">
                CPCB Standard
              </span>
              <span className="text-sm font-black">
                {statusBadge} · AQI {aqi}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Narrative Message */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1 & 2: Plain Meaning & Advice */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 sm:p-6 rounded-2xl bg-white/80 border border-[#DCECE8] space-y-2.5">
            <h3 className="text-lg sm:text-xl font-bold text-[#234B55] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#6BAEAA] shrink-0" />
              <span>{headline}</span>
            </h3>
            <p className="text-sm sm:text-base text-[#234B55] leading-relaxed font-normal">
              {plainMeaning}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#DCECE8]/50 border border-[#DCECE8] flex items-start gap-3.5">
            <Heart className="w-5 h-5 text-[#6BAEAA] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs sm:text-sm font-bold text-[#234B55] block">
                Everyday Recommendation for You:
              </span>
              <p className="text-xs sm:text-sm text-[#234B55]/95 leading-relaxed mt-1 font-medium">
                {impactNote}
              </p>
            </div>
          </div>
        </div>

        {/* Col 3: Primary Culprit Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/85 border border-[#DCECE8] flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-[#465A60] tracking-wider">
                Primary Contaminant
              </span>
              <InfoTooltip
                term={dominantName}
                explanation={dominantReason}
                analogy={dominantAnalog}
              />
            </div>

            <h4 className="text-base font-bold text-[#234B55]">
              {dominantName}
            </h4>

            <p className="text-xs sm:text-sm text-[#465A60] leading-relaxed">
              {dominantReason}
            </p>

            <div className="p-3 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] text-xs text-[#234B55]">
              <span className="font-bold">Analogy: </span>
              <span className="italic">{dominantAnalog}</span>
            </div>
          </div>

          {onAskAi && (
            <button
              type="button"
              onClick={() =>
                onAskAi(
                  `Explain in simple, beginner terms why the air in ${city} has an AQI of ${aqi} (${statusBadge}) today, and tell me step-by-step what I should do to protect my health.`
                )
              }
              className="w-full py-3 px-4 rounded-xl bg-[#234B55] hover:bg-[#1A373E] text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm glow-btn"
            >
              <Sparkles className="w-4 h-4 text-[#6BAEAA]" />
              <span>Ask AI Assistant to Explain</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
