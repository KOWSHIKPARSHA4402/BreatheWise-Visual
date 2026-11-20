"use client";

import React, { useState } from "react";
import {
  Users2,
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  Download,
  Share2,
} from "lucide-react";

export default function CommunityView() {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "BreatheWise - Urban Clean Air & Smog Navigator",
        text: "Check out BreatheWise to navigate winter smog and protect your family from toxic urban air pollution.",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrintChecklist = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass-dark glow-card-dark text-white relative overflow-hidden space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#6BAEAA]/20 text-[#A9D5C8]">
            <Users2 className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase font-semibold tracking-wider text-[#A9D5C8]">
            Civic Vigilance &amp; Public Education
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Community Pollution Awareness &amp; Smog Science
        </h1>
        <p className="text-xs sm:text-sm text-[#DCECE8]/90 font-light max-w-2xl leading-relaxed">
          Clean air is a public health necessity. Understand the physics of winter smog, select certified protective gear, and report illegal open burning violations to municipal authorities.
        </p>
      </div>

      {/* 1. Winter Smog Inversion Science Card */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass glow-card space-y-5">
        <div className="border-b border-[#DCECE8] pb-3">
          <span className="text-[11px] font-mono uppercase text-[#6BAEAA] font-bold">
            Atmospheric Physics
          </span>
          <h2 className="text-xl font-bold text-[#234B55] mt-0.5">
            Why Does Winter Smog Get Trapped Near the Ground?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-3 text-xs sm:text-sm text-[#687D83] font-light leading-relaxed">
            <p>
              In normal summer conditions, warm air near the ground naturally rises into the cooler upper atmosphere, carrying vehicle exhaust and particulate pollution high into the sky where winds blow it away.
            </p>
            <p>
              During <strong>winter nights and mornings</strong>, the earth cools down rapidly. A layer of cold, dense air pools right above the city streets, with a layer of warmer air sitting immediately on top of it.
            </p>
            <p className="font-medium text-[#234B55] liquid-glass p-3.5 rounded-2xl glow-card">
              This thermal inversion acts like an airtight glass lid over the entire metropolitan region. When combined with calm winds (&lt; 6 km/h), every puff of diesel exhaust, biomass smoke, and dust is trapped right at human breathing height.
            </p>
          </div>

          {/* Visual Inversion Schematic */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#E9B978]/15 via-[#6BAEAA]/15 to-[#234B55]/20 border border-[#DCECE8] text-center space-y-4 glow-card">
            <div className="text-xs font-mono font-bold text-[#8B6429]">
              Warm Air Layer (Inversion Lid — Stagnant Barrier)
            </div>
            <div className="h-0.5 bg-[#E9B978]/50 w-3/4 mx-auto" />
            <div className="p-4 rounded-xl bg-[#234B55] border border-[#2D5E6B] text-[#DCECE8] text-xs space-y-1 glow-card-dark">
              <div className="font-bold font-mono text-white">Trapped Ground Layer (Dense Smog)</div>
              <p className="text-[11px] text-[#A9D5C8]">
                PM2.5 Soot + Diesel NOx + High Humidity + Low Wind
              </p>
            </div>
            <div className="text-[11px] font-mono text-[#687D83]">
              Ground Level / Residential Breathing Zone (0 - 50 meters)
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mask Selection & Efficacy Matrix */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass glow-card space-y-6">
        <div className="border-b border-[#DCECE8] pb-3">
          <span className="text-[11px] font-mono uppercase text-[#6BAEAA] font-bold">
            Respiratory Defense
          </span>
          <h2 className="text-xl font-bold text-[#234B55] mt-0.5">
            The Truth About Masks: N95 vs. Surgical vs. Cloth
          </h2>
          <p className="text-xs text-[#687D83] font-light mt-0.5">
            Laboratory filtration efficiency for sub-micron winter smog particulates (0.3 µm).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* N95 / FFP2 */}
          <div className="p-5 rounded-2xl bg-[#DCECE8]/40 border-2 border-[#6BAEAA] space-y-3 flex flex-col justify-between glow-card">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-[#234B55]">
                  Certified Gold Standard
                </span>
                <CheckCircle2 className="w-5 h-5 text-[#4A9E86]" />
              </div>
              <h3 className="text-lg font-bold text-[#234B55]">
                N95 / FFP2 / KN95
              </h3>
              <div className="text-3xl font-black font-mono text-[#4A9E86]">
                ≥ 95% <span className="text-xs font-normal text-[#687D83]">Filtration</span>
              </div>
              <p className="text-xs text-[#687D83] font-light leading-relaxed">
                Made of electrostatically charged melt-blown nonwoven fibers. Tight nose clip and facial seal ensure air is forced through the filter rather than around the edges.
              </p>
            </div>
            <div className="pt-2 border-t border-[#A9D5C8]/60 text-[11px] font-semibold text-[#234B55]">
              Verdict: Mandatory during Poor, Very Poor &amp; Severe smog.
            </div>
          </div>

          {/* Surgical Mask */}
          <div className="p-5 rounded-2xl bg-[#E9B978]/10 border border-[#E9B978]/40 space-y-3 flex flex-col justify-between glow-card">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-[#8B6429]">
                  Inadequate for Smog
                </span>
                <AlertTriangle className="w-5 h-5 text-[#E9B978]" />
              </div>
              <h3 className="text-lg font-bold text-[#234B55]">
                3-Ply Surgical Mask
              </h3>
              <div className="text-3xl font-black font-mono text-[#8B6429]">
                30%–45% <span className="text-xs font-normal text-[#687D83]">Filtration</span>
              </div>
              <p className="text-xs text-[#687D83] font-light leading-relaxed">
                Designed to stop outgoing fluid splashes, not incoming sub-micron particulates. Massive side leaks allow unfiltered smog to enter freely with every inhalation.
              </p>
            </div>
            <div className="pt-2 border-t border-[#E9B978]/30 text-[11px] font-semibold text-[#8B6429]">
              Verdict: Negligible protection against toxic PM2.5.
            </div>
          </div>

          {/* Cloth Mask */}
          <div className="p-5 rounded-2xl bg-[#D98E83]/10 border border-[#D98E83]/40 space-y-3 flex flex-col justify-between glow-card">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-[#8F3E37]">
                  Zero Particulate Defense
                </span>
                <XCircle className="w-5 h-5 text-[#B85450]" />
              </div>
              <h3 className="text-lg font-bold text-[#234B55]">
                Cloth / Cotton Bandana
              </h3>
              <div className="text-3xl font-black font-mono text-[#B85450]">
                &lt; 15% <span className="text-xs font-normal text-[#687D83]">Filtration</span>
              </div>
              <p className="text-xs text-[#687D83] font-light leading-relaxed">
                Woven cloth fiber pores are roughly 100 to 200 microns wide—hundreds of times larger than PM2.5 particles. Provides only a false sense of security.
              </p>
            </div>
            <div className="pt-2 border-t border-[#D98E83]/30 text-[11px] font-semibold text-[#8F3E37]">
              Verdict: Completely ineffective against winter smog.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Reporting Illegal Waste Burning */}
      <div className="p-6 sm:p-8 rounded-3xl liquid-glass-dark glow-card-dark text-white space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#D98E83]/20 text-[#D98E83]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              Report Illegal Open Waste Burning
            </h2>
            <p className="text-xs text-[#DCECE8]/80 font-light">
              Municipal compliance channels to report fires and industrial violations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-light">
          <div className="p-4 rounded-2xl bg-[#234B55]/70 border border-[#2D5E6B]/40 space-y-1.5">
            <div className="font-bold text-white font-mono text-sm">
              1. CPCB Sameer App
            </div>
            <p className="text-[#DCECE8]/90 leading-relaxed">
              Official Indian Central Pollution Control Board mobile app. Allows residents to submit geo-tagged, time-stamped photographs of open leaf or garbage fires.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#234B55]/70 border border-[#2D5E6B]/40 space-y-1.5">
            <div className="font-bold text-white font-mono text-sm">
              2. Municipal 311 / Helplines
            </div>
            <p className="text-[#DCECE8]/90 leading-relaxed">
              Call your local municipal corporation or non-emergency civic hotline (e.g., Delhi Green Delhi App, BMC helpline) to dispatch rapid-response teams.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#234B55]/70 border border-[#2D5E6B]/40 space-y-1.5">
            <div className="font-bold text-white font-mono text-sm">
              3. Community Vigilance
            </div>
            <p className="text-[#DCECE8]/90 leading-relaxed">
              Educate neighborhood security guards and residential associations (RWAs) to replace waste fires with electric oil heaters or heavy winter clothing.
            </p>
          </div>
        </div>
      </div>

      {/* Printable Clean Air Family Checklist */}
      <div className="p-6 rounded-3xl bg-white border border-[#DCECE8] shadow-sm card-elevation flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-[#234B55] text-sm sm:text-base">
            Clean Air Family Action Checklist
          </h3>
          <p className="text-xs text-[#687D83] font-light">
            Print or share this 1-page emergency winter smog protocol for your home, school, or residential society.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintChecklist}
            className="px-4 py-2 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] hover:border-[#6BAEAA] text-xs font-semibold text-[#234B55] flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Checklist</span>
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-[#234B55] hover:bg-[#1E414A] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? "Link Copied!" : "Share BreatheWise"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
