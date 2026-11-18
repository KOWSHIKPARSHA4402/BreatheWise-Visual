"use client";

import React, { useState } from "react";
import {
  Activity,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  ArrowRight,
} from "lucide-react";
import { useLocationContext } from "@/context/LocationContext";
import { getCategoryTheme } from "@/lib/aqi-calculator";

export default function DetailsView() {
  const { airQuality, location } = useLocationContext();
  const [selectedPollutant, setSelectedPollutant] = useState<string>("pm2_5");

  if (!airQuality) return null;

  const theme = getCategoryTheme(airQuality.cpcbCategory);

  const pollutantDeepDive: Record<
    string,
    {
      name: string;
      fullName: string;
      formula: string;
      value: number;
      unit: string;
      subIndex: number;
      whoLimit: number;
      primarySources: string[];
      healthPathways: string[];
      mitigationAction: string;
    }
  > = {
    pm2_5: {
      name: "PM2.5",
      fullName: "Fine Particulate Matter",
      formula: "PM ≤ 2.5 µm",
      value: airQuality.pollutants.pm2_5.value,
      unit: "µg/m³",
      subIndex: airQuality.pollutants.pm2_5.subIndex || 0,
      whoLimit: 15,
      primarySources: [
        "Vehicular exhaust (especially diesel soot and direct-injection petrol)",
        "Biomass combustion and agricultural stubble burning in northern plains",
        "Coal-fired power generation and brick kiln emissions",
        "Secondary aerosol formation from atmospheric ammonia and SO2",
      ],
      healthPathways: [
        "Bypasses ciliated epithelial nasal filters and deposits directly in alveolar sacs",
        "Translocates across the alveolar-capillary barrier directly into blood circulation",
        "Triggers systemic endothelial inflammation, arterial plaque rupture, and stroke",
        "Decreases forced vital capacity (FVC) and exacerbates chronic pediatric asthma",
      ],
      mitigationAction: "Run True-HEPA (H13) air purifiers continuously indoors and seal exterior windows during morning inversions.",
    },
    pm10: {
      name: "PM10",
      fullName: "Coarse Inhalable Particulate Matter",
      formula: "PM ≤ 10 µm",
      value: airQuality.pollutants.pm10.value,
      unit: "µg/m³",
      subIndex: airQuality.pollutants.pm10.subIndex || 0,
      whoLimit: 45,
      primarySources: [
        "Road dust resuspension caused by vehicular movement",
        "Construction activities, unpaved shoulders, and aggregate crushing",
        "Tire and brake pad friction abrasion",
        "Windblown crustal agricultural soil dust",
      ],
      healthPathways: [
        "Deposits along upper pharyngeal and bronchial airways",
        "Causes reflex sneezing, throat tickling, mucosal hypersecretion, and coughing",
        "Exacerbates allergic rhinitis and chronic bronchitis in sensitive adults",
      ],
      mitigationAction: "Replace dry broom sweeping with damp microfiber mopping; install exterior doorway dust mats.",
    },
    no2: {
      name: "NO2",
      fullName: "Nitrogen Dioxide",
      formula: "NO₂",
      value: airQuality.pollutants.no2.value,
      unit: "µg/m³",
      subIndex: airQuality.pollutants.no2.subIndex || 0,
      whoLimit: 25,
      primarySources: [
        "High-temperature internal combustion engines (heavy trucks and diesel cars)",
        "Gas turbines, industrial boilers, and thermal power stations",
        "Domestic gas cooking stoves without ducted exhaust ventilation",
      ],
      healthPathways: [
        "Reacts with airway lining fluid to produce nitric acid, causing severe epithelial damage",
        "Increases airway hyper-responsiveness to allergens like pollen and dust mites",
        "Precursor to secondary PM2.5 nitrate particles and ground-level ozone",
      ],
      mitigationAction: "Turn on kitchen exhaust range hoods while cooking and avoid waiting beside idling vehicles on congested roads.",
    },
    so2: {
      name: "SO2",
      fullName: "Sulfur Dioxide",
      formula: "SO₂",
      value: airQuality.pollutants.so2.value,
      unit: "µg/m³",
      subIndex: airQuality.pollutants.so2.subIndex || 0,
      whoLimit: 40,
      primarySources: [
        "Combustion of sulfur-rich fuels in coal-fired thermal power plants",
        "Oil refineries, smelting operations, and chemical manufacturing",
        "Heavy marine bunker fuel and industrial furnaces",
      ],
      healthPathways: [
        "Triggers rapid reflex bronchoconstriction within minutes of inhalation",
        "Stimulates upper respiratory sensory nerves, causing severe chest tightness",
        "Precursor to atmospheric sulfuric acid aerosols and winter acid smog",
      ],
      mitigationAction: "Use activated carbon filter stages in indoor purifiers to adsorb gaseous acidic sulfur compounds.",
    },
    co: {
      name: "CO",
      fullName: "Carbon Monoxide",
      formula: "CO",
      value: airQuality.pollutants.co.value,
      unit: "mg/m³",
      subIndex: airQuality.pollutants.co.subIndex || 0,
      whoLimit: 4,
      primarySources: [
        "Incomplete combustion of carbon fuels in congested stop-and-go traffic",
        "Unvented indoor kerosene or wood space heaters during cold winter nights",
        "Indoor tobacco smoking and closed charcoal grills (angithi)",
      ],
      healthPathways: [
        "Binds to blood hemoglobin with 210x greater affinity than oxygen to form carboxyhemoglobin",
        "Starves cardiac muscle and cerebral cortex of vital oxygen delivery",
        "Induces dizziness, morning headaches, fatigue, and impaired cognitive reaction times",
      ],
      mitigationAction: "Never use unvented kerosene or wood heaters in closed bedrooms; maintain vehicle engine tuning.",
    },
    o3: {
      name: "O3",
      fullName: "Ground-Level Tropospheric Ozone",
      formula: "O₃",
      value: airQuality.pollutants.o3.value,
      unit: "µg/m³",
      subIndex: airQuality.pollutants.o3.subIndex || 0,
      whoLimit: 100,
      primarySources: [
        "Secondary photochemical reaction between vehicle NOx and volatile organic compounds (VOCs)",
        "Accelerated by intense sunlight and stagnant high-temperature afternoon air",
        "Direct emission from hazardous ionic/ozone air cleaners (strictly discouraged)",
      ],
      healthPathways: [
        "Aggressive biochemical oxidant that literally 'sunburns' lung alveolar tissue",
        "Damages pulmonary cell membranes, reducing total lung capacity",
        "Increases hospital emergency admissions for asthma and respiratory infections",
      ],
      mitigationAction: "Avoid strenuous outdoor exertion between 1:00 PM and 4:00 PM on hot sunny days; never use ionic cleaners.",
    },
  };

  const currentDetail = pollutantDeepDive[selectedPollutant] || pollutantDeepDive.pm2_5;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-sm relative overflow-hidden space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Activity className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase font-semibold tracking-wider text-emerald-400">
            Biomedical &amp; Meteorological Deep Dive
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Air Quality Analysis: {location.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
          Comprehensive scientific investigation into chemical constituents, biological entry pathways, and meteorological smog inversion conditions.
        </p>
      </div>

      {/* Weather & Meteorological Telemetry */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Ground-Level Meteorological Telemetry
            </h2>
            <p className="text-xs text-slate-500 font-light">
              Atmospheric parameters governing winter smog dispersion and diurnal pollution pooling.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Station: Open-Meteo Copernicus CAMS
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Thermometer className="w-4 h-4 text-amber-500" />
              <span>Ambient Temp</span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {airQuality.weather?.temperature ?? 20}°C
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Sensible heat</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>Relative Humidity</span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {airQuality.weather?.relativeHumidity ?? 65}%
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Moisture retention</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Wind className="w-4 h-4 text-teal-500" />
              <span>Wind Velocity</span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {airQuality.weather?.windSpeedKmH ?? 6} km/h
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {(airQuality.weather?.windSpeedKmH ?? 6) < 6 ? "Calm / Stagnant" : "Breezy"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Compass className="w-4 h-4 text-indigo-500" />
              <span>Wind Direction</span>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {airQuality.weather?.windDirection ?? 180}°
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Azimuth angle</span>
          </div>
        </div>

        {/* Smog Inversion Diagnosis */}
        <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${theme.bgLight} ${theme.borderColor}`}>
          <div className="font-bold font-mono uppercase text-[11px] flex items-center gap-1.5 text-slate-900 dark:text-white">
            <span>Atmospheric Dispersion Diagnosis:</span>
            <span className={theme.textColor}>
              {airQuality.weather?.isSmogTrappingConditions ? "Severe Winter Entrapment" : "Normal Dispersion"}
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-light">
            {airQuality.weather?.isSmogTrappingConditions
              ? "Current wind speed (< 6 km/h) combined with high relative humidity prevents vertical mixing. Cold ground air acts as a stagnant sink, trapping tailpipe soot and biomass smoke directly in the breathing zone."
              : "Surface wind speeds exceed 6 km/h, providing moderate horizontal transport and atmospheric ventilation across the metropolitan area."}
          </p>
        </div>
      </div>

      {/* Interactive Pollutant Selector & Biomedical Matrix */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Biomedical Pollutant Profiler
          </h2>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Select a pollutant below to inspect its chemical origin, human body impact, and prevention techniques.
          </p>
        </div>

        {/* Pollutant Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {Object.entries(pollutantDeepDive).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedPollutant(key)}
              className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                selectedPollutant === key
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>{item.name}</span> ({item.value} {item.unit})
            </button>
          ))}
        </div>

        {/* Detailed Selected Pollutant Card */}
        <div className="p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <div className="text-[11px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold">
                {currentDetail.formula} · {currentDetail.fullName}
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                {currentDetail.name}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">Concentration</span>
                <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {currentDetail.value} <span className="text-xs font-normal text-slate-500">{currentDetail.unit}</span>
                </span>
              </div>
              <div className="text-right pl-4 border-l border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">WHO 24h Limit</span>
                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {currentDetail.whoLimit} <span className="text-xs font-normal text-slate-500">{currentDetail.unit}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Origins */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span>Primary Urban Sources</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                {currentDetail.primarySources.map((src, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{src}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Health Impact Pathways */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                <span>Biological &amp; Organ Pathways</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                {currentDetail.healthPathways.map((path, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{path}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Recommendation */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-3 text-emerald-900 dark:text-emerald-200">
            <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Targeted Family Action:</strong> {currentDetail.mitigationAction}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
