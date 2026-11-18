"use client";

import React from "react";
import { X, Wind, Thermometer, Droplets, Activity, AlertTriangle } from "lucide-react";
import { AirQualityData } from "@/lib/types";
import { getCategoryTheme } from "@/lib/aqi-calculator";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AirQualityData;
}

export default function DetailsModal({ isOpen, onClose, data }: DetailsModalProps) {
  if (!isOpen) return null;

  const theme = getCategoryTheme(data.cpcbCategory);
  const pm25Val = data.pollutants.pm2_5.value;
  const whoRatio = (pm25Val / 15).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b1329] border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg"
              style={{ backgroundColor: theme.color }}
            >
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Detailed Pollution Risk Assessment
              </h3>
              <p className="text-xs text-slate-400">
                {data.location.name}, {data.location.country} · CPCB &amp; WHO Standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Severity Banner */}
        <div
          className="p-4 rounded-2xl border flex items-center justify-between gap-4"
          style={{
            backgroundColor: `${theme.color}15`,
            borderColor: `${theme.color}40`,
          }}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: theme.color }}
              >
                {data.cpcbCategory}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                NAQI Index: <strong className="text-white">{data.cpcbAQI}</strong>
              </span>
            </div>
            <p className="text-xs text-slate-200">
              {theme.healthImpact}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-white">{whoRatio}x</div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">WHO Guideline</div>
          </div>
        </div>

        {/* CPCB Scientific Calculation Formula */}
        <div className="p-4 rounded-2xl bg-[#101b38] border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <Wind className="w-3.5 h-3.5" />
            <span>Mathematical Breakpoint Methodology</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080e21] font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800">
            Ip = [ (I_hi - I_lo) / (BP_hi - BP_lo) ] * (Cp - BP_lo) + I_lo
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Calculated pursuant to the Central Pollution Control Board (CPCB) National Air Quality Index (NAQI) technical guidelines across 6 criteria pollutants. Dominant pollutant dictating current index: <strong className="text-white">{data.dominantPollutant}</strong>.
          </p>
        </div>

        {/* Atmospheric Ventilation Conditions */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Meteorological Ventilation Telemetry
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-[#0f1833] border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>Ambient Temp</span>
              </div>
              <div className="text-base font-bold text-white">
                {data.weather ? `${data.weather.temperature}°C` : "24°C"}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#0f1833] border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>Relative Humidity</span>
              </div>
              <div className="text-base font-bold text-white">
                {data.weather ? `${data.weather.relativeHumidity}%` : "55%"}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#0f1833] border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
                <Wind className="w-3.5 h-3.5 text-emerald-400" />
                <span>Wind Dispersion</span>
              </div>
              <div className="text-base font-bold text-white">
                {data.weather ? `${data.weather.windSpeedKmH} km/h` : "12 km/h"}
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Population Advisory */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>High-Risk Demographics Protocol</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li><strong>Pediatric &amp; Children:</strong> Restrict vigorous outdoor recess and sports activities.</li>
            <li><strong>Elderly &amp; Cardiac Patients:</strong> Stay indoors in filtered air environments; avoid rush-hour transit.</li>
            <li><strong>Asthma / COPD:</strong> Keep rescue inhalers accessible; operate true HEPA filtration indoors.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Close Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
