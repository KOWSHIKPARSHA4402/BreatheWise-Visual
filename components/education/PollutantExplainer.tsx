"use client";

import React, { useState } from "react";
import {
  Sparkles,
  HelpCircle,
  Shield,
  Activity,
  Flame,
  Car,
  Factory,
  Sun,
} from "lucide-react";

interface PollutantInfo {
  id: string;
  code: string;
  name: string;
  plainName: string;
  metaphor: string;
  source: string;
  healthImpact: string;
  safeLimitCPCB: string;
  safeLimitWHO: string;
  protectionTip: string;
  icon: React.ElementType;
}

const POLLUTANTS: PollutantInfo[] = [
  {
    id: "pm25",
    code: "PM2.5",
    name: "Fine Particulate Matter",
    plainName: "Microscopic Fine Dust & Soot",
    metaphor: "30 times thinner than a strand of human hair. So tiny it slips past your nose hair and lungs straight into your bloodstream.",
    source: "Vehicle exhaust (especially diesel), coal power plants, crop residue burning, and winter biomass heating.",
    healthImpact: "Triggers heart attacks, strokes, irreversible lung scarring, chronic bronchitis, and asthmatic attacks.",
    safeLimitCPCB: "60 µg/m³ (24h standard)",
    safeLimitWHO: "15 µg/m³ (24h guideline)",
    protectionTip: "Cloth masks fail against PM2.5. Only certified N95 respirators or true HEPA filters capture these ultra-fine particles.",
    icon: Activity,
  },
  {
    id: "pm10",
    code: "PM10",
    name: "Coarse Particulate Matter",
    plainName: "Inhalable Dust & Debris",
    metaphor: "About one-fifth the thickness of human hair. Large enough to cause visible haze and gritty throat irritation.",
    source: "Road dust kicked up by vehicles, unpaved shoulders, construction digging, demolition debris, and pollen.",
    healthImpact: "Severe throat burning, persistent dry cough, sinus congestion, itchy watery eyes, and aggravation of asthma.",
    safeLimitCPCB: "100 µg/m³ (24h standard)",
    safeLimitWHO: "45 µg/m³ (24h guideline)",
    protectionTip: "Wipe home floors with a damp microfiber mop rather than dry sweeping, which re-suspends settled PM10 dust.",
    icon: Shield,
  },
  {
    id: "no2",
    code: "NO2",
    name: "Nitrogen Dioxide",
    plainName: "Traffic Exhaust Combustion Gas",
    metaphor: "A harsh reddish-brown gas that smells like bleach and burns wet lung tissues upon contact.",
    source: "High-temperature fuel combustion in diesel trucks, cars, buses, power plants, and gas stoves.",
    healthImpact: "Inflames airway lining, cuts lung resistance to respiratory infections, and triggers sudden pediatric asthma flare-ups.",
    safeLimitCPCB: "80 µg/m³ (24h standard)",
    safeLimitWHO: "25 µg/m³ (24h guideline)",
    protectionTip: "Always switch car AC to 'Internal Air Recirculation' when stuck in heavy traffic to avoid sucking in exhaust from the car ahead.",
    icon: Car,
  },
  {
    id: "so2",
    code: "SO2",
    name: "Sulphur Dioxide",
    plainName: "Industrial Coal & Smelting Gas",
    metaphor: "Has the sharp, choking smell of a freshly struck match. In moisture, it turns into acidic droplets.",
    source: "Burning of sulphur-rich coal in thermal power plants, oil refineries, and industrial smelters.",
    healthImpact: "Constricts bronchial tubes, provokes painful coughing fits, eye irritation, and contributes to acid rain formation.",
    safeLimitCPCB: "80 µg/m³ (24h standard)",
    safeLimitWHO: "40 µg/m³ (24h guideline)",
    protectionTip: "Activated carbon filter layers inside home air purifiers help absorb acidic SO2 gas molecules.",
    icon: Factory,
  },
  {
    id: "co",
    code: "CO",
    name: "Carbon Monoxide",
    plainName: "Silent Incomplete Burning Gas",
    metaphor: "The invisible, odorless gas that tricks your red blood cells by binding 200 times tighter than oxygen.",
    source: "Incomplete combustion in idling vehicle engines, malfunctioning water geysers, kerosene heaters, and unventilated charcoal fires.",
    healthImpact: "Starves the brain and heart of vital oxygen, causing dull headaches, dizzy spells, nausea, and at high doses, unconsciousness.",
    safeLimitCPCB: "4.0 mg/m³ (1h standard)",
    safeLimitWHO: "4.0 mg/m³ (24h guideline)",
    protectionTip: "Never leave a car running in an enclosed garage or burn an open charcoal heater inside a bedroom without cross-ventilation.",
    icon: Flame,
  },
  {
    id: "o3",
    code: "O3",
    name: "Ground-Level Ozone",
    plainName: "Summer Photochemical Smog Gas",
    metaphor: "A harsh reactive gas that acts like a 'sunburn inside your lungs' when inhaled during hot, sunny afternoons.",
    source: "Not emitted directly. Formed when bright sunlight and high temperatures bake vehicle gases (NOx) and solvent fumes (VOCs).",
    healthImpact: "Reduces total lung capacity, causes chest pain and shortness of breath, and severely aggravates emphysema.",
    safeLimitCPCB: "100 µg/m³ (8h standard)",
    safeLimitWHO: "100 µg/m³ (8h guideline)",
    protectionTip: "Ozone peaks during bright sunny afternoons (1 PM – 5 PM). Shift strenuous outdoor activities to early morning or late dusk.",
    icon: Sun,
  },
];

export default function PollutantExplainer() {
  const [selectedId, setSelectedId] = useState<string>("pm25");
  const activePollutant = POLLUTANTS.find((p) => p.id === selectedId) || POLLUTANTS[0];
  const Icon = activePollutant.icon;

  return (
    <div className="w-full liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCECE8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#687D83] font-bold">
            <Sparkles className="w-4 h-4 text-[#6BAEAA]" />
            <span>Environmental Science Demystified</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#234B55] tracking-tight mt-1">
            Understand What’s in Your Air
          </h3>
        </div>
        <p className="text-xs text-[#687D83] max-w-sm sm:text-right">
          Six major pollutants determine your daily air quality score. Click on any pollutant below to see what it is in plain everyday English.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {POLLUTANTS.map((pollutant) => {
          const isSelected = pollutant.id === selectedId;
          const TabIcon = pollutant.icon;
          return (
            <button
              key={pollutant.id}
              onClick={() => setSelectedId(pollutant.id)}
              className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between h-22 ${
                isSelected
                  ? "bg-white text-[#234B55] border-[#6BAEAA] shadow-md ring-2 ring-[#6BAEAA]/20 font-bold"
                  : "bg-white/60 text-[#465A60] border-[#DCECE8] hover:bg-white/90 hover:text-[#234B55]"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs sm:text-sm font-mono font-black">{pollutant.code}</span>
                <TabIcon className={`w-4 h-4 ${isSelected ? "text-[#6BAEAA]" : "text-[#465A60]"}`} />
              </div>
              <span className="text-xs font-bold truncate block opacity-95">
                {pollutant.plainName.split(" ")[0]} {pollutant.plainName.split(" ")[1]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white/85 border border-[#DCECE8] shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Core Identity & Analogy */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#DCECE8]/70 text-[#234B55]">
              <Icon className="w-6 h-6 text-[#234B55]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg sm:text-xl font-black text-[#234B55]">{activePollutant.code}</h4>
                <span className="text-xs sm:text-sm text-[#465A60] font-medium">({activePollutant.name})</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#6BAEAA]">{activePollutant.plainName}</p>
            </div>
          </div>

          {/* Everyday Analogy Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F8F6] border border-[#DCECE8] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#234B55]">
              <HelpCircle className="w-4 h-4 text-[#6BAEAA]" />
              <span>How To Picture It in Everyday Life:</span>
            </div>
            <p className="text-xs sm:text-sm text-[#234B55] leading-relaxed italic font-normal">
              &quot;{activePollutant.metaphor}&quot;
            </p>
          </div>

          {/* Source & Health */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#DCECE8] space-y-1.5">
              <span className="text-xs font-mono uppercase font-bold text-[#465A60] tracking-wider block">
                Where Does It Come From?
              </span>
              <p className="text-xs sm:text-sm text-[#234B55]/95 leading-relaxed">
                {activePollutant.source}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#DCECE8] space-y-1.5">
              <span className="text-xs font-mono uppercase font-bold text-[#465A60] tracking-wider block">
                Health Impact on Your Body
              </span>
              <p className="text-xs sm:text-sm text-[#234B55]/95 leading-relaxed">
                {activePollutant.healthImpact}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Thresholds & Practical Protection */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#DCECE8]/35 border border-[#DCECE8] space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase font-bold text-[#465A60] tracking-wider block">
              Official Safe Limits
            </span>
            <div className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-[#DCECE8]">
              <span className="text-[#465A60] font-medium">CPCB (India National):</span>
              <span className="font-mono font-bold text-[#234B55]">{activePollutant.safeLimitCPCB}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-[#DCECE8]">
              <span className="text-[#465A60] font-medium">WHO Global Guideline:</span>
              <span className="font-mono font-bold text-[#6BAEAA]">{activePollutant.safeLimitWHO}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#DCECE8] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#234B55]">
              <Shield className="w-4 h-4 text-[#6BAEAA]" />
              <span>How To Protect Yourself:</span>
            </div>
            <p className="text-xs sm:text-sm text-[#234B55]/95 leading-relaxed">
              {activePollutant.protectionTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
