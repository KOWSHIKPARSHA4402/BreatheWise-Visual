"use client";

import React from "react";
import {
  Activity,
  Wind,
  Shield,
  Airplay,
  Baby,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { AirQualityData } from "@/lib/types";

interface WhatShouldIDoTodayProps {
  data: AirQualityData;
}

export default function WhatShouldIDoToday({ data }: WhatShouldIDoTodayProps) {
  const aqi = data.cpcbAQI;

  const isSevere = aqi > 300;
  const isPoor = aqi > 200;
  const isModerate = aqi > 100;

  // Actions breakdown
  const actions = [
    {
      title: "Outdoor Exercise",
      icon: Activity,
      status: isSevere
        ? "Dangerous: Avoid All Outdoor Workouts"
        : isPoor
        ? "Caution: Switch to Indoor Exercise"
        : isModerate
        ? "Moderate: Avoid Heavy Morning Runs"
        : "Safe: Enjoy Running & Walking",
      statusType: isSevere ? "danger" : isPoor ? "warning" : isModerate ? "caution" : "safe",
      guidance: isSevere
        ? "Heavy breathing outside forces millions of toxic soot particles deep into your bronchi. Exercise strictly indoors with air filters on."
        : isPoor
        ? "Cold morning air holds trapped pollutants. If you must exercise outdoors, do light brisk walking between 1 PM and 4 PM only."
        : isModerate
        ? "Vulnerable individuals or people with asthma should keep runs short or switch to yoga/gym indoors."
        : "Air quality is wonderful! Perfect day for a long jog, outdoor cycling, or a football match.",
      timeAdvice: isSevere ? "Stay indoors all day" : "Best window: 1:00 PM – 4:00 PM",
    },
    {
      title: "Home Window Ventilation",
      icon: Wind,
      status: isSevere
        ? "Keep Windows Strictly Sealed"
        : isPoor
        ? "Brief 15-Minute Flush at Midday Only"
        : isModerate
        ? "Open Midday for Cross-Ventilation"
        : "Open Windows Freely",
      statusType: isSevere ? "danger" : isPoor ? "warning" : isModerate ? "caution" : "safe",
      guidance: isSevere
        ? "Outdoor air is far dirtier than indoor air. Keep all windows and doors closed. Use wet towels under doorway gaps if drafts enter."
        : isPoor
        ? "Morning and night smog is dense. Open windows only for 10-15 minutes around 2:00 PM when solar heat disperses ground smog."
        : isModerate
        ? "Crack opposite windows open between 12 PM and 4 PM to flush out stale indoor carbon dioxide without letting excessive dust in."
        : "Let fresh, natural oxygen flow through your home! Open cross-ventilating windows throughout the morning.",
      timeAdvice: isSevere ? "Windows 100% closed" : "Safe window: 1:30 PM – 3:30 PM",
    },
    {
      title: "Mask & Commute Protection",
      icon: Shield,
      status: isSevere
        ? "Certified N95 Required Outdoors"
        : isPoor
        ? "N95 Strongly Advised in Traffic"
        : isModerate
        ? "Recommended for Bike Commuters"
        : "No Mask Needed",
      statusType: isSevere ? "danger" : isPoor ? "warning" : isModerate ? "caution" : "safe",
      guidance: isSevere
        ? "Cloth masks and surgical paper masks offer ZERO protection against PM2.5 particles. Wear a snugly fitted N95 or FFP2 respirator."
        : isPoor
        ? "Walking along busy roads or standing at bus stops exposes you to diesel fumes. Put on an N95 mask before leaving home."
        : isModerate
        ? "Cyclists and two-wheeler riders should wear a light pollution mask against road kick-up dust and vehicle exhaust."
        : "Air is clean! Breathe naturally and enjoy the outdoors without face coverings.",
      timeAdvice: isSevere ? "Wear anytime you step outdoors" : "During morning & evening rush",
    },
    {
      title: "Indoor Air Purifier",
      icon: Airplay,
      status: isSevere
        ? "Run Continuous High/Turbo Mode"
        : isPoor
        ? "Medium Fan Speed / Auto Mode"
        : isModerate
        ? "Sleep / Low Mode in Bedrooms"
        : "Optional / Eco Mode",
      statusType: isSevere ? "danger" : isPoor ? "warning" : isModerate ? "caution" : "safe",
      guidance: isSevere
        ? "Keep bedroom and living room HEPA filters running 24/7. Check that the pre-filter mesh is vacuumed clean of heavy dust."
        : isPoor
        ? "Run your purifier on Medium speed in bedrooms 1 hour before sleeping to guarantee restorative, cough-free rest."
        : isModerate
        ? "Run on Auto mode; the sensor will ramp up if you cook or sweep indoors."
        : "Purifier can rest or stay on silent eco-mode to save electricity.",
      timeAdvice: isSevere ? "24 Hours Continuous" : "Turn on 1 hour before bedtime",
    },
    {
      title: "Protecting Children & Seniors",
      icon: Baby,
      status: isSevere
        ? "Keep Indoors & Monitor Symptoms"
        : isPoor
        ? "Avoid Outdoor Playgrounds"
        : isModerate
        ? "Limit Prolonged Strenuous Play"
        : "Healthy for Outdoor Play",
      statusType: isSevere ? "danger" : isPoor ? "warning" : isModerate ? "caution" : "safe",
      guidance: isSevere
        ? "Children breathe twice as fast as adults and inhale twice as many toxins per kg of weight. Keep schools and playrooms strictly indoors."
        : isPoor
        ? "Keep elderly family members and toddlers indoors during early morning and late evening smog peaks. Keep inhalers accessible."
        : isModerate
        ? "Kids can play outside, but encourage drinking extra water and avoid play near high-traffic intersections."
        : "Great conditions for kids to play in the park, ride bicycles, and get active outdoors!",
      timeAdvice: isSevere ? "Zero outdoor exposure" : "Playtime safe between 12 PM - 4 PM",
    },
  ];

  return (
    <div className="w-full liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCECE8]">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#465A60] font-bold">
            Actionable Health Routine
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#234B55] tracking-tight mt-1">
            What Should I Do Today?
          </h3>
        </div>
        <div className="text-xs text-[#465A60] flex items-center gap-1.5 font-mono font-medium">
          <Clock className="w-4 h-4 text-[#6BAEAA]" />
          <span>Real-time adaptive advice</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {actions.map((act) => {
          const Icon = act.icon;
          const isDanger = act.statusType === "danger";
          const isWarning = act.statusType === "warning";
          const isCaution = act.statusType === "caution";

          const badgeBg = isDanger
            ? "bg-[#B85450]/15 text-[#B85450] border-[#B85450]/30"
            : isWarning
            ? "bg-[#D98E83]/20 text-[#9E3E37] border-[#D98E83]/40"
            : isCaution
            ? "bg-[#E9B978]/20 text-[#915B17] border-[#E9B978]/40"
            : "bg-[#6BAEAA]/15 text-[#234B55] border-[#6BAEAA]/30";

          const StatusIcon = isDanger ? XCircle : isWarning || isCaution ? AlertTriangle : CheckCircle2;

          return (
            <div
              key={act.title}
              className="p-5 sm:p-6 rounded-2xl bg-white/85 border border-[#DCECE8] shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-[#DCECE8]/70 text-[#234B55]">
                      <Icon className="w-5 h-5 text-[#234B55]" />
                    </div>
                    <span className="text-base font-bold text-[#234B55]">{act.title}</span>
                  </div>
                </div>

                <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs sm:text-sm font-bold ${badgeBg}`}>
                  <StatusIcon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{act.status}</span>
                </div>

                <p className="text-xs sm:text-sm text-[#234B55] leading-relaxed font-normal">
                  {act.guidance}
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#DCECE8]/70 flex items-center justify-between text-xs text-[#465A60]">
                <span className="font-semibold text-[#234B55]">Recommendation:</span>
                <span className="font-mono text-[#234B55] font-bold">{act.timeAdvice}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
