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
  const pm25Val = data.pollutants.pm2_5.value ?? 0;
  const whoRatio = (pm25Val / 15).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#234B55]/35 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl liquid-glass glow-card shadow-2xl p-6 sm:p-8 space-y-6 text-[#234B55]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DCECE8]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: theme.color }}
            >
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#234B55]">
                Detailed Pollution Risk Assessment
              </h3>
              <p className="text-xs text-[#687D83]">
                {data.location.name}, {data.location.country} · CPCB &amp; WHO Standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#687D83] hover:text-[#234B55] hover:bg-[#DCECE8]/60 transition-colors glow-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Severity Banner */}
        <div
          className="p-4 rounded-2xl border flex items-center justify-between gap-4 glow-card"
          style={{
            backgroundColor: `${theme.color}15`,
            borderColor: `${theme.color}50`,
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
              <span className="text-xs text-[#234B55] font-medium">
                NAQI Index: <strong className="text-[#234B55]">{data.cpcbAQI}</strong>
              </span>
            </div>
            <p className="text-xs text-[#687D83]">
              {theme.healthImpact}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black text-[#234B55]">{whoRatio}x</div>
            <div className="text-[10px] text-[#687D83] uppercase font-mono font-semibold">WHO Limit</div>
          </div>
        </div>

        {/* CPCB Scientific Calculation Formula */}
        <div className="p-4 rounded-2xl liquid-glass glow-card space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#234B55] uppercase tracking-wider">
            <Wind className="w-3.5 h-3.5 text-[#6BAEAA]" />
            <span>Mathematical Breakpoint Methodology</span>
          </div>
          <div className="p-3 rounded-xl bg-white/70 font-mono text-xs text-[#234B55] overflow-x-auto border border-[#DCECE8]">
            Ip = [ (I_hi - I_lo) / (BP_hi - BP_lo) ] * (Cp - BP_lo) + I_lo
          </div>
          <p className="text-[11px] text-[#687D83] leading-relaxed">
            Calculated pursuant to the Central Pollution Control Board (CPCB) National Air Quality Index (NAQI) technical guidelines across 6 criteria pollutants. Dominant pollutant dictating current index: <strong className="text-[#234B55]">{data.dominantPollutant}</strong>.
          </p>
        </div>

        {/* Atmospheric Ventilation Conditions */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold text-[#687D83] uppercase tracking-wider">
            Meteorological Ventilation Telemetry
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl liquid-glass glow-card text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] text-[#687D83] mb-1">
                <Thermometer className="w-3.5 h-3.5 text-[#E9B978]" />
                <span>Ambient Temp</span>
              </div>
              <div className="text-base font-bold text-[#234B55]">
                {data.weather ? `${data.weather.temperature}°C` : "24°C"}
              </div>
            </div>

            <div className="p-3 rounded-2xl liquid-glass glow-card text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] text-[#687D83] mb-1">
                <Droplets className="w-3.5 h-3.5 text-[#6BAEAA]" />
                <span>Relative Humidity</span>
              </div>
              <div className="text-base font-bold text-[#234B55]">
                {data.weather ? `${data.weather.relativeHumidity}%` : "55%"}
              </div>
            </div>

            <div className="p-3 rounded-2xl liquid-glass glow-card text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] text-[#687D83] mb-1">
                <Wind className="w-3.5 h-3.5 text-[#4A9E86]" />
                <span>Wind Dispersion</span>
              </div>
              <div className="text-base font-bold text-[#234B55]">
                {data.weather ? `${data.weather.windSpeedKmH} km/h` : "12 km/h"}
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Population Advisory */}
        <div className="p-4 rounded-2xl bg-[#E9B978]/15 border border-[#E9B978]/40 space-y-2 text-[#75460E] glow-card">
          <div className="flex items-center gap-2 text-xs font-bold text-[#75460E]">
            <AlertTriangle className="w-4 h-4 text-[#E9B978]" />
            <span>High-Risk Demographics Protocol</span>
          </div>
          <ul className="text-xs space-y-1.5 list-disc list-inside text-[#75460E]/90">
            <li><strong>Pediatric &amp; Children:</strong> Restrict vigorous outdoor recess and sports activities.</li>
            <li><strong>Elderly &amp; Cardiac Patients:</strong> Stay indoors in filtered air environments; avoid rush-hour transit.</li>
            <li><strong>Asthma / COPD:</strong> Keep rescue inhalers accessible; operate true HEPA filtration indoors.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#234B55] hover:bg-[#1E414A] text-white font-bold text-xs transition-colors shadow-sm glow-btn"
          >
            Close Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
