"use client";

import React from "react";
import { Baby, HeartPulse, ShieldAlert, Bike } from "lucide-react";
import { AirQualityData } from "@/lib/types";

interface VulnerableAdvisoryProps {
  data: AirQualityData;
}

export default function VulnerableAdvisory({ data }: VulnerableAdvisoryProps) {
  const isSevere = data.cpcbAQI > 300;
  const isPoor = data.cpcbAQI > 200;

  const advisories = [
    {
      group: "Infants & Children",
      icon: Baby,
      badge: isPoor ? "Urgent Caution" : "Standard Care",
      desc: isSevere
        ? "Children breathe at double the adult respiratory rate relative to body weight. Cancel outdoor recess and sports; keep indoor air purified."
        : isPoor
        ? "Limit prolonged outdoor physical games. Keep bedroom windows shut during early morning inversion hours."
        : "Safe for regular outdoor playtime, school sports, and park visits.",
      color: isSevere
        ? "border-[#B85450]/40 bg-[#B85450]/10"
        : isPoor
        ? "border-[#E9B978]/60 bg-[#E9B978]/10"
        : "border-[#DCECE8] bg-white",
      badgeColor: isSevere
        ? "bg-[#B85450]/20 text-[#611A17] border border-[#B85450]/40"
        : isPoor
        ? "bg-[#E9B978]/30 text-[#75460E] border border-[#E9B978]/60"
        : "bg-[#DCECE8] text-[#234B55] border border-[#A9D5C8]",
    },
    {
      group: "Elderly & Seniors (65+)",
      icon: HeartPulse,
      badge: isPoor ? "High Risk" : "Normal Risk",
      desc: isSevere
        ? "High PM2.5 levels trigger systemic vascular inflammation and acute hypertensive spikes. Strictly avoid early morning walks; remain indoors with HEPA air."
        : isPoor
        ? "Postpone morning walks to sunny afternoon hours (1 PM - 4 PM) when atmospheric dispersion is peak."
        : "Healthy outdoor activities and walking are encouraged.",
      color: isSevere
        ? "border-[#B85450]/40 bg-[#B85450]/10"
        : isPoor
        ? "border-[#E0937A]/60 bg-[#E0937A]/10"
        : "border-[#DCECE8] bg-white",
      badgeColor: isSevere
        ? "bg-[#B85450]/20 text-[#611A17] border border-[#B85450]/40"
        : isPoor
        ? "bg-[#E0937A]/25 text-[#753424] border border-[#E0937A]/50"
        : "bg-[#DCECE8] text-[#234B55] border border-[#A9D5C8]",
    },
    {
      group: "Asthma & Respiratory Patients",
      icon: ShieldAlert,
      badge: isPoor ? "Severe Vulnerability" : "Monitor Symptoms",
      desc: isSevere
        ? "Acute bronchospasm danger. Keep rescue inhalers (albuterol/salbutamol) within arm's reach. Do not open windows. Use N95 mask if stepping outside."
        : isPoor
        ? "Wear an N95 mask if walking along major traffic arteries. Take preventative inhaler doses as prescribed."
        : "Airway irritation risk is low. Maintain regular maintenance medication.",
      color: isSevere
        ? "border-[#B85450]/40 bg-[#B85450]/10"
        : isPoor
        ? "border-[#D98E83]/60 bg-[#D98E83]/15"
        : "border-[#DCECE8] bg-white",
      badgeColor: isSevere
        ? "bg-[#B85450]/20 text-[#611A17] border border-[#B85450]/40"
        : isPoor
        ? "bg-[#D98E83]/25 text-[#72271E] border border-[#D98E83]/50"
        : "bg-[#DCECE8] text-[#234B55] border border-[#A9D5C8]",
    },
    {
      group: "Daily Commuters & Outdoor Workers",
      icon: Bike,
      badge: isPoor ? "Respiratory Strain" : "Standard Exposure",
      desc: isSevere
        ? "Cloth and surgical masks do not filter sub-micron PM2.5. A certified N95 or FFP2 respirator with tight seal is mandatory on roads and transit stops."
        : isPoor
        ? "Wear an N95 mask on two-wheelers and bus stops. Switch vehicle AC to air recirculation mode."
        : "Open cabin ventilation and cycling commutes are safe today.",
      color: isSevere
        ? "border-[#B85450]/40 bg-[#B85450]/10"
        : isPoor
        ? "border-[#E9B978]/60 bg-[#E9B978]/10"
        : "border-[#DCECE8] bg-white",
      badgeColor: isSevere
        ? "bg-[#B85450]/20 text-[#611A17] border border-[#B85450]/40"
        : isPoor
        ? "bg-[#E9B978]/30 text-[#75460E] border border-[#E9B978]/60"
        : "bg-[#DCECE8] text-[#234B55] border border-[#A9D5C8]",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-[#234B55] tracking-tight">
          Vulnerable Population Health Advisories
        </h2>
        <p className="text-xs text-[#687D83] font-light">
          Contextual medical precautions based on current CPCB National AQI {data.cpcbAQI} ({data.cpcbCategory}).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {advisories.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.group}
              className={`p-5 rounded-3xl liquid-glass glow-card space-y-3 flex flex-col justify-between ${
                isSevere
                  ? "border-[#B85450]/40"
                  : isPoor
                  ? "border-[#E9B978]/60"
                  : "border-[#DCECE8]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2.5 rounded-2xl bg-[#DCECE8] text-[#234B55] shadow-sm">
                    <Icon className="w-4 h-4 text-[#234B55]" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#234B55]">
                  {item.group}
                </h3>

                <p className="mt-2 text-xs text-[#687D83] font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-[#DCECE8] text-[11px] font-mono text-[#687D83]">
                {data.cpcbAQI > 300 ? "Emergency Protocol" : "Recommended Guideline"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
