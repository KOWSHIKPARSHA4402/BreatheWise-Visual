"use client";

import React, { useState } from "react";
import {
  Car,
  HardHat,
  Factory,
  Flame,
  Soup,
  Wheat,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface PollutionSource {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  whatProducesIt: string;
  pollutantsReleased: string[];
  airImpact: string;
  practicalSteps: string[];
  realWorldContext: string;
}

const SOURCES: PollutionSource[] = [
  {
    id: "traffic",
    title: "Traffic & Diesel Emissions",
    subtitle: "Tailpipes, brake pads, and tire friction",
    icon: Car,
    whatProducesIt:
      "Internal combustion engines burning diesel and petrol at high cylinder temperatures, heavy truck transport, stop-and-go city traffic, and friction from brakes and tires.",
    pollutantsReleased: ["PM2.5 (Soot)", "Nitrogen Dioxide (NO2)", "Carbon Monoxide (CO)", "Volatile Organic Compounds (VOCs)"],
    airImpact:
      "Concentrates near street level directly in the breathing zone of pedestrians, commuters, and school children. Reacts with sunlight during hot afternoons to produce toxic ground ozone.",
    practicalSteps: [
      "Set your vehicle AC to 'Cabin Recirculate' mode when stuck in heavy traffic to avoid inhaling exhaust from vehicles ahead.",
      "Wear a certified N95 respirator when walking along congested arterial roads or standing at bus stops.",
      "Avoid jogging or cycling on major roads during morning and evening rush hours (8 AM - 10 AM, 6 PM - 8 PM).",
    ],
    realWorldContext:
      "In urban centers like New Delhi, Jakarta, and Cairo, vehicular traffic often contributes 25% to 40% of localized surface PM2.5 and nearly 70% of ambient NO2.",
  },
  {
    id: "construction",
    title: "Construction & Demolition Dust",
    subtitle: "Unpaved shoulders, excavation, and building debris",
    icon: HardHat,
    whatProducesIt:
      "Excavation for building foundations, open cement handling, demolition of concrete structures, cutting tiles/stone, and heavy trucks kicking up dust from dry, unpaved road shoulders.",
    pollutantsReleased: ["PM10 (Coarse Dust)", "Silica Dust", "Settled Road Dust (Tire/Heavy Metals)"],
    airImpact:
      "Creates massive clouds of coarse airborne dust. Settles quickly on leaves and windows, but gets re-suspended by vehicle tires whenever the ground is dry, causing continuous eye and throat irritation.",
    practicalSteps: [
      "Keep home windows facing active construction sites closed and sealed with weatherstripping.",
      "Clean indoor floors with a damp microfiber mop rather than dry broom sweeping, which kicks dust back into the air.",
      "If living near a major construction corridor, choose an air purifier with a washable pre-filter mesh to trap coarse dust before it clogs the HEPA filter.",
    ],
    realWorldContext:
      "Road dust and construction debris represent the largest mass contributor to PM10 in fast-growing cities, often responsible for gritty eyes and allergic sneezing.",
  },
  {
    id: "factories",
    title: "Factory & Industrial Emissions",
    subtitle: "Thermal power plants, brick kilns, and refineries",
    icon: Factory,
    whatProducesIt:
      "Coal-fired power generation, oil refineries, metallurgical smelters, chemical manufacturing facilities, and traditional brick-baking kilns.",
    pollutantsReleased: ["Sulphur Dioxide (SO2)", "Nitrogen Oxides (NOx)", "PM2.5 (Fly Ash)", "Heavy Metals (Lead, Mercury)"],
    airImpact:
      "Tall industrial smokestacks release plumes that travel hundreds of kilometres downwind. In humid winter air, SO2 and NOx react with ammonia to form secondary sulfate and nitrate particles, causing regional acidic haze.",
    practicalSteps: [
      "Use indoor air purifiers equipped with activated carbon filter layers to adsorb industrial chemical odors and gaseous SO2.",
      "Stay indoors when weather forecasts show industrial plumes blowing towards your neighborhood due to prevailing wind shifts.",
      "Support municipal enforcement of flue-gas desulfurization (FGD) scrubbers and transition to clean renewable energy.",
    ],
    realWorldContext:
      "Secondary sulfates created from industrial coal burning can travel across entire state borders, blanketing rural and urban areas alike in thick winter haze.",
  },
  {
    id: "garbage",
    title: "Burning Garbage & Open Trash Fires",
    subtitle: "Plastic waste, leaf piles, and open dumpsites",
    icon: Flame,
    whatProducesIt:
      "Open smoldering of municipal plastic waste, paper, tires, fallen leaves, and spontaneous combustion inside landfills.",
    pollutantsReleased: ["PM2.5 (Dense Smoke)", "Carbon Monoxide (CO)", "Dioxins & Furans (Carcinogens)", "Hydrogen Chloride"],
    airImpact:
      "Because trash burns at low temperatures without sufficient oxygen, it produces extremely acrid, black smoke packed with cancer-causing organic toxins and thick soot right at street level.",
    practicalSteps: [
      "Never burn domestic waste or dry leaves. Compost organic matter and use municipal recycling.",
      "Immediately seal windows if acrid smoke from neighborhood trash burning is detected.",
      "Report illegal open burning to local environmental hotlines or municipal municipal reporting apps.",
    ],
    realWorldContext:
      "Burning 1 kg of plastics produces several hundred times more hazardous carcinogens (dioxins) than burning clean dry wood in a controlled furnace.",
  },
  {
    id: "cooking",
    title: "Cooking Smoke & Domestic Heating",
    subtitle: "High-heat frying, unventilated gas, and biomass stoves",
    icon: Soup,
    whatProducesIt:
      "Frying foods at high temperatures (oil smoke point), unvented gas cooktops, biomass chulhas (wood, dung cakes, kerosene) in poorly ventilated kitchens, and burning incense or mosquito coils.",
    pollutantsReleased: ["Ultrafine PM2.5", "Carbon Monoxide (CO)", "Formaldehyde & Acrolein", "Polycyclic Aromatic Hydrocarbons (PAHs)"],
    airImpact:
      "Indoor PM2.5 levels can skyrocket past 500 µg/m³ inside a kitchen within 10 minutes of hot oil frying or burning mosquito coils, exposing family members to higher particulate doses than outdoors.",
    practicalSteps: [
      "Always turn on the kitchen exhaust hood or open an exterior kitchen window BEFORE turning on the stove burner.",
      "Replace smoky mosquito coils with electric vaporizers or fine window mosquito netting.",
      "Switch from solid biomass cooking to clean LPG gas or electric induction cooktops.",
    ],
    realWorldContext:
      "Household air pollution from biomass cooking is one of the leading environmental causes of premature respiratory illness in developing nations.",
  },
  {
    id: "agriculture",
    title: "Agricultural Crop Stubble Burning",
    subtitle: "Seasonal post-harvest field clearing",
    icon: Wheat,
    whatProducesIt:
      "Farming practice where leftover paddy or wheat straw is torched in fields across northern India and Southeast Asia to quickly prepare the soil for winter wheat sowing.",
    pollutantsReleased: ["PM2.5 (Biomass Carbon)", "Carbon Monoxide (CO)", "Methane", "Volatile Organic Compounds"],
    airImpact:
      "Tens of thousands of simultaneous field fires release vast smoke plumes that get swept hundreds of kilometres across river basins (e.g. Indo-Gangetic Plain), combining with calm winter winds to form severe, persistent smog blankets.",
    practicalSteps: [
      "Track seasonal stubble burning peaks (October - November) on BreatheWise satellite maps and prepare clean air supplies.",
      "Equip living spaces and bedrooms with True HEPA air filtration before the agricultural burning season begins.",
      "Support government incentives for mechanical seeders (Happy Seeder) and biomass pelletization plants.",
    ],
    realWorldContext:
      "During peak harvest clearing in October/November, agricultural stubble smoke can account for up to 45% of the total PM2.5 in downstream cities like Delhi.",
  },
];

export default function PollutionAroundUs() {
  const [selectedSourceId, setSelectedSourceId] = useState<string>("traffic");
  const activeSource = SOURCES.find((s) => s.id === selectedSourceId) || SOURCES[0];
  const Icon = activeSource.icon;

  return (
    <div className="w-full liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCECE8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#465A60] font-bold">
            <Sparkles className="w-4 h-4 text-[#6BAEAA]" />
            <span>Real-World Environmental Literacy</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#234B55] tracking-tight mt-1">
            Pollution Around Us: Six Common Everyday Sources
          </h3>
        </div>

        {/* Clear Disclaimer Badge */}
        <div className="flex items-center gap-2 bg-[#DCECE8]/60 px-3.5 py-1.5 rounded-2xl border border-[#A9D5C8] text-xs text-[#234B55]">
          <Info className="w-4 h-4 text-[#234B55] shrink-0" />
          <span className="text-[11px] font-medium leading-tight">
            Educational Reference: City-specific causes are verified live via Copernicus CAMS atmospheric models.
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {SOURCES.map((source) => {
          const isSelected = source.id === selectedSourceId;
          const SourceIcon = source.icon;
          return (
            <button
              key={source.id}
              onClick={() => setSelectedSourceId(source.id)}
              className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between h-24 ${
                isSelected
                  ? "bg-white text-[#234B55] border-[#6BAEAA] shadow-md ring-2 ring-[#6BAEAA]/20 font-bold"
                  : "bg-white/60 text-[#465A60] border-[#DCECE8] hover:bg-white/90 hover:text-[#234B55]"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <SourceIcon className={`w-5 h-5 ${isSelected ? "text-[#6BAEAA]" : "text-[#465A60]"}`} />
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-[#DCECE8] text-[#234B55]">
                  Source
                </span>
              </div>
              <span className="text-xs font-bold leading-tight block">
                {source.title.split("&")[0].trim()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Source Card */}
      <div className="p-6 rounded-3xl bg-white/85 border border-[#DCECE8] shadow-sm space-y-6">
        {/* Source Title & Context */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCECE8]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#DCECE8]/70 text-[#234B55]">
              <Icon className="w-6 h-6 text-[#234B55]" />
            </div>
            <div>
              <h4 className="text-lg font-black text-[#234B55]">{activeSource.title}</h4>
              <p className="text-xs text-[#465A60] font-medium">{activeSource.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
            {activeSource.pollutantsReleased.map((pol) => (
              <span
                key={pol}
                className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#DCECE8] text-[#234B55] border border-[#A9D5C8]"
              >
                {pol}
              </span>
            ))}
          </div>
        </div>

        {/* 2-Column Content: What produces it & How it affects air */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-4 rounded-2xl bg-[#F4F8F6] border border-[#DCECE8] space-y-2">
            <span className="text-xs font-bold text-[#234B55] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#E9B978]" />
              <span>What Produces This Pollution?</span>
            </span>
            <p className="text-xs sm:text-sm text-[#234B55]/90 leading-relaxed font-normal">
              {activeSource.whatProducesIt}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4F8F6] border border-[#DCECE8] space-y-2">
            <span className="text-xs font-bold text-[#234B55] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#6BAEAA]" />
              <span>How It Affects Local Air Quality:</span>
            </span>
            <p className="text-xs sm:text-sm text-[#234B55]/90 leading-relaxed font-normal">
              {activeSource.airImpact}
            </p>
          </div>
        </div>

        {/* Practical Steps to Protect Yourself */}
        <div className="p-5 rounded-2xl bg-[#DCECE8]/35 border border-[#DCECE8] space-y-3">
          <span className="text-xs font-bold text-[#234B55] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#4A9E86]" />
            <span>Practical Steps to Reduce Your Personal Exposure:</span>
          </span>

          <ul className="space-y-2 text-xs sm:text-sm text-[#234B55]/95">
            {activeSource.practicalSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#4A9E86] shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Real World Fact / Context Note */}
        <div className="p-3.5 rounded-xl bg-white border border-[#DCECE8] text-xs text-[#465A60] flex items-center gap-2">
          <span className="font-bold text-[#234B55] shrink-0">Real-World Case:</span>
          <span className="italic">{activeSource.realWorldContext}</span>
        </div>
      </div>
    </div>
  );
}
