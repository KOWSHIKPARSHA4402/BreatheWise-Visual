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
      color: isPoor ? "border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
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
      color: isPoor ? "border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
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
      color: isPoor ? "border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
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
      color: isPoor ? "border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Vulnerable Population Health Advisories
        </h2>
        <p className="text-xs text-slate-500 font-light">
          Contextual medical precautions based on current CPCB National AQI {data.cpcbAQI} ({data.cpcbCategory}).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {advisories.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.group}
              className={`p-5 rounded-2xl border transition-all ${item.color} space-y-3 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {item.group}
                </h3>

                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] font-mono text-slate-500">
                Action: {isPoor ? "Protective Mitigation" : "Normal Routine"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
