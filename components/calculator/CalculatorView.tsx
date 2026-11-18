"use client";

import React, { useState } from "react";
import {
  Calculator,
  Leaf,
  Trees,
  Award,
  Info,
  Car,
  Fuel,
  HelpCircle,
} from "lucide-react";
import {
  calculateEmissionsSavings,
  VEHICLE_EMISSION_FACTORS,
} from "@/lib/emissions-calculator";
import { EmissionsInput } from "@/lib/types";

export default function CalculatorView() {
  const [input, setInput] = useState<EmissionsInput>({
    commuteDistanceKm: 15,
    currentVehicle: "petrol_car",
    telecommuteDaysPerWeek: 2,
    transitTripsPerWeek: 4,
    savedErrandTripsPerWeek: 2,
    energyActions: {
      ledLighting: true,
      solarPanels: false,
      efficientHeating: true,
      airDryingClothes: true,
    },
  });

  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

  const results = calculateEmissionsSavings(input);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white border border-teal-800 shadow-sm relative overflow-hidden space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
            <Calculator className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase font-semibold tracking-wider text-teal-300">
            Defensible Environmental Accounting
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          My Environmental Impact Calculator
        </h1>
        <p className="text-xs sm:text-sm text-teal-100/80 font-light max-w-2xl leading-relaxed">
          Quantify how your commuting adjustments, trip-chaining, and household energy habits prevent tailpipe soot and atmospheric CO2 using verified government emissions factors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Inputs Form (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Your Commuting &amp; Habit Profile
            </h2>
            <button
              onClick={() => setShowMethodologyModal(true)}
              className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>View Factors &amp; Sources</span>
            </button>
          </div>

          <div className="space-y-5">
            {/* 1. Distance & Vehicle Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5" />
                  <span>One-Way Commute (km)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="150"
                  value={input.commuteDistanceKm}
                  onChange={(e) =>
                    setInput({ ...input, commuteDistanceKm: Math.max(1, parseFloat(e.target.value) || 1) })
                  }
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5" />
                  <span>Baseline Vehicle</span>
                </label>
                <select
                  value={input.currentVehicle}
                  onChange={(e) =>
                    setInput({ ...input, currentVehicle: e.target.value as EmissionsInput["currentVehicle"] })
                  }
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-medium"
                >
                  {Object.entries(VEHICLE_EMISSION_FACTORS).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Telecommuting Days */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Remote Work / WFH Days per Week:
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {input.telecommuteDaysPerWeek} Days/wk
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="7"
                value={input.telecommuteDaysPerWeek}
                onChange={(e) =>
                  setInput({ ...input, telecommuteDaysPerWeek: parseInt(e.target.value) })
                }
                className="w-full accent-emerald-600"
              />
            </div>

            {/* 3. Transit Trips */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Shifting Car Trips to Metro/Bus:
                </span>
                <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                  {input.transitTripsPerWeek} Trips/wk
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                value={input.transitTripsPerWeek}
                onChange={(e) =>
                  setInput({ ...input, transitTripsPerWeek: parseInt(e.target.value) })
                }
                className="w-full accent-teal-600"
              />
            </div>

            {/* 4. Errand Trips Chained */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Combined Errand Trips (Trip-Chaining):
                </span>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                  {input.savedErrandTripsPerWeek} Trips avoided/wk
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={input.savedErrandTripsPerWeek}
                onChange={(e) =>
                  setInput({ ...input, savedErrandTripsPerWeek: parseInt(e.target.value) })
                }
                className="w-full accent-sky-600"
              />
            </div>

            {/* 5. Energy Actions Checkboxes */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-mono uppercase font-bold text-slate-600 dark:text-slate-400 block">
                Domestic Energy Actions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={input.energyActions.ledLighting}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        energyActions: { ...input.energyActions, ledLighting: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>100% LED Lighting</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={input.energyActions.efficientHeating}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        energyActions: { ...input.energyActions, efficientHeating: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Radiant Oil/Heat Pump Heat</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={input.energyActions.airDryingClothes}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        energyActions: { ...input.energyActions, airDryingClothes: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Air-Drying Laundry</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={input.energyActions.solarPanels}
                    onChange={(e) =>
                      setInput({
                        ...input,
                        energyActions: { ...input.energyActions, solarPanels: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Rooftop Solar Installed</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results & Equivalents (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <Leaf className="w-4 h-4" />
                <span>Verified Impact</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">DEFRA 2023</span>
            </div>

            {/* Master CO2 Metric */}
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-400">
                {results.co2SavedKgMonthly} <span className="text-lg font-normal text-white">kg CO₂e</span>
              </div>
              <p className="text-xs text-slate-400">
                Estimated emissions prevented every month
              </p>
            </div>

            {/* Secondary Equivalents Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <Car className="w-3.5 h-3.5" />
                  <span>Km Avoided</span>
                </div>
                <div className="text-xl font-bold font-mono text-white">
                  {results.vehicleKmAvoidedMonthly} km
                </div>
                <span className="text-[10px] text-slate-400 font-mono">per month</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-1 text-emerald-400 text-xs">
                  <Trees className="w-3.5 h-3.5" />
                  <span>Tree Equivalent</span>
                </div>
                <div className="text-xl font-bold font-mono text-emerald-300">
                  {results.treesEquivalentAnnual} Trees
                </div>
                <span className="text-[10px] text-slate-400 font-mono">absorbing CO₂/yr</span>
              </div>
            </div>

            {/* Gamification Clean Air Points */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-emerald-300 font-bold">
                    Clean Air Points
                  </div>
                  <div className="text-xl font-black font-mono text-white">
                    +{results.cleanAirPoints} pts
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-300/80 uppercase">Level: Eco Guard</span>
            </div>

            {/* Scientific Integrity Note */}
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-1">
              <div className="flex items-center gap-1 font-semibold text-slate-300">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Scientific Integrity Disclaimer</span>
              </div>
              <p className="font-light">
                Reductions calculate your personal footprint and decrease localized road-level exhaust. Individual choices cannot be claimed to singlehandedly lower regional sensor AQI without municipal-scale collective action.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Modal */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Emissions Factors &amp; Methodology
              </h3>
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light max-h-80 overflow-y-auto">
              <p>
                BreatheWise utilizes published emission baselines from the UK Department for Environment, Food &amp; Rural Affairs (DEFRA 2023 GHG Conversion Factors) and the Central Pollution Control Board (CPCB) Comprehensive Air Assessment guidelines:
              </p>
              <ul className="space-y-1 font-mono text-[11px] bg-slate-50 dark:bg-slate-950 p-3 rounded-xl">
                <li>• Average Petrol Car: 0.170 kg CO₂e / km</li>
                <li>• Average Diesel Car: 0.171 kg CO₂e / km</li>
                <li>• Two-Wheeler / Motorcycle: 0.103 kg CO₂e / km</li>
                <li>• City Bus (average occupancy): 0.082 kg CO₂e / passenger-km</li>
                <li>• Electric Metro / Rail: 0.035 kg CO₂e / passenger-km</li>
                <li>• Active Walking/Cycling: 0.000 kg CO₂e / km</li>
                <li>• Mature Tree CO₂ Absorption: 21.77 kg CO₂ / year (Arbor Day / US EPA standard)</li>
              </ul>
              <p>
                Telecommuting savings are computed as roundtrip distance multiplied by the baseline vehicle factor. Shifting to transit credits the net difference between personal vehicle burn and grid mass transit.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
