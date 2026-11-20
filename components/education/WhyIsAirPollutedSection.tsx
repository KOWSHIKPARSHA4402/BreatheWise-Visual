"use client";

import React from "react";
import {
  CloudFog,
  Wind,
  Layers,
  Truck,
} from "lucide-react";

export default function WhyIsAirPollutedSection() {
  return (
    <div className="w-full liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCECE8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#465A60] font-bold">
            <CloudFog className="w-4 h-4 text-[#6BAEAA]" />
            <span>Atmospheric Physics Made Simple</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#234B55] tracking-tight mt-1">
            Why Is My Air Polluted?
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#465A60] max-w-sm sm:text-right font-medium">
          Pollution isn’t just about how much smoke is produced — it’s also about how weather traps it right where you breathe.
        </p>
      </div>

      {/* Atmospheric Traps Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-[#234B55] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#6BAEAA]" />
          <span>The Weather Traps: Why Winter Air Turns into Toxic Soup</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Inversion Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/85 border border-[#DCECE8] shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#DCECE8]/70 text-[#234B55]">
                <Layers className="w-4 h-4 text-[#234B55]" />
              </div>
              <h5 className="text-sm font-bold text-[#234B55]">Temperature Inversions</h5>
            </div>
            <p className="text-xs sm:text-sm text-[#234B55]/95 leading-relaxed">
              Normally, warm air rises into the sky, carrying pollution away like a chimney. In winter, the ground cools down fast at night, placing cold air beneath a warm atmospheric layer. This creates a giant <strong>&quot;lid&quot;</strong> that traps all tailpipe and burning smoke right at ground level.
            </p>
            <div className="p-3 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] text-xs text-[#465A60] italic">
              <strong>Analogy:</strong> Like putting a tight glass lid over a smoking cooking pot.
            </div>
          </div>

          {/* Calm Wind Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/85 border border-[#DCECE8] shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#DCECE8]/70 text-[#234B55]">
                <Wind className="w-4 h-4 text-[#234B55]" />
              </div>
              <h5 className="text-sm font-bold text-[#234B55]">Calm Zero-Wind Stagnation</h5>
            </div>
            <p className="text-xs sm:text-sm text-[#234B55]/95 leading-relaxed">
              When wind speeds drop below 5 km/h, the air comes to a dead stop. Exhaust from millions of cars and power plants doesn&apos;t blow away — it sits stationary over cities, accumulating hour by hour into concentrated poisonous smog.
            </p>
            <div className="p-3 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] text-xs text-[#465A60] italic">
              <strong>Analogy:</strong> Like a room with no open doors or fan running while someone is frying food.
            </div>
          </div>

          {/* Moisture & Fog Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/85 border border-[#DCECE8] shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-[#DCECE8]/70 text-[#234B55]">
                <CloudFog className="w-4 h-4 text-[#234B55]" />
              </div>
              <h5 className="text-sm font-bold text-[#234B55]">Fog Moisture + Smoke = Smog</h5>
            </div>
            <p className="text-xs sm:text-sm text-[#234B55]/95 leading-relaxed">
              Winter mornings bring dense moisture droplets (fog). When microscopic soot and acidic gases (SO2 and NO2) dissolve into these water droplets, chemical reactions speed up, creating acidic winter smog that burns eyes and throats.
            </p>
            <div className="p-3 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] text-xs text-[#465A60] italic">
              <strong>Analogy:</strong> Smoke + Fog = Smog. Droplets act like sponges soaking up toxic chemicals.
            </div>
          </div>
        </div>
      </div>

      {/* Main Ground Sources */}
      <div className="pt-2 border-t border-[#DCECE8] space-y-3">
        <h4 className="text-base font-bold text-[#234B55] flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#6BAEAA]" />
          <span>The Four Major Regional Emission Sources</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-white/75 border border-[#DCECE8] space-y-1.5">
            <span className="text-xs font-mono uppercase font-bold text-[#465A60]">Source 1</span>
            <h5 className="text-sm font-bold text-[#234B55]">Vehicles &amp; Diesel Traffic</h5>
            <p className="text-xs text-[#465A60] leading-relaxed">
              Black carbon soot, NOx, and tire rubber dust from heavy trucks, idling cars, and 2-wheelers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/75 border border-[#DCECE8] space-y-1.5">
            <span className="text-xs font-mono uppercase font-bold text-[#465A60]">Source 2</span>
            <h5 className="text-sm font-bold text-[#234B55]">Road Dust &amp; Construction</h5>
            <p className="text-xs text-[#465A60] leading-relaxed">
              Unpaved road shoulders and building digging kick up massive clouds of coarse PM10 dust.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/75 border border-[#DCECE8] space-y-1.5">
            <span className="text-xs font-mono uppercase font-bold text-[#465A60]">Source 3</span>
            <h5 className="text-sm font-bold text-[#234B55]">Biomass &amp; Stubble Burning</h5>
            <p className="text-xs text-[#465A60] leading-relaxed">
              Post-harvest paddy field stubble fires and domestic wood/coal heating in freezing weather.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/75 border border-[#DCECE8] space-y-1.5">
            <span className="text-xs font-mono uppercase font-bold text-[#465A60]">Source 4</span>
            <h5 className="text-sm font-bold text-[#234B55]">Industry &amp; Power Stations</h5>
            <p className="text-xs text-[#465A60] leading-relaxed">
              Coal-fired thermal electricity generation, brick kilns, metal smelters, and chemical manufacturing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
