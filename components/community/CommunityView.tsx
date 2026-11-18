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
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white border border-emerald-800 shadow-sm relative overflow-hidden space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
            <Users2 className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase font-semibold tracking-wider text-emerald-300">
            Civic Vigilance &amp; Public Education
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Community Pollution Awareness &amp; Smog Science
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/80 font-light max-w-2xl leading-relaxed">
          Clean air is a public health necessity. Understand the physics of winter smog, select certified protective gear, and report illegal open burning violations to municipal authorities.
        </p>
      </div>

      {/* 1. Winter Smog Inversion Science Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-[11px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold">
            Atmospheric Physics
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Why Does Winter Smog Get Trapped Near the Ground?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-light leading-relaxed">
            <p>
              In normal summer conditions, warm air near the ground naturally rises into the cooler upper atmosphere, carrying vehicle exhaust and particulate pollution high into the sky where winds blow it away.
            </p>
            <p>
              During <strong>winter nights and mornings</strong>, the earth cools down rapidly. A layer of cold, dense air pools right above the city streets, with a layer of warmer air sitting immediately on top of it.
            </p>
            <p className="font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              This thermal inversion acts like an airtight glass lid over the entire metropolitan region. When combined with calm winds (&lt; 6 km/h), every puff of diesel exhaust, biomass smoke, and dust is trapped right at human breathing height.
            </p>
          </div>

          {/* Visual Inversion Schematic */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 via-purple-500/20 to-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-300">
              Warm Air Layer (Inversion Lid — Stagnant Barrier)
            </div>
            <div className="h-0.5 bg-amber-400/50 w-3/4 mx-auto" />
            <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-800/60 text-purple-200 text-xs space-y-1">
              <div className="font-bold font-mono">Trapped Ground Layer (Dense Smog)</div>
              <p className="text-[11px] text-purple-300/80">
                PM2.5 Soot + Diesel NOx + High Humidity + Low Wind
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Ground Level / Residential Breathing Zone (0 - 50 meters)
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mask Selection & Efficacy Matrix */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-[11px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold">
            Respiratory Defense
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            The Truth About Masks: N95 vs. Surgical vs. Cloth
          </h2>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Laboratory filtration efficiency for sub-micron winter smog particulates (0.3 µm).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* N95 / FFP2 */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border-2 border-emerald-400 dark:border-emerald-700 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-emerald-800 dark:text-emerald-300">
                  Certified Gold Standard
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                N95 / FFP2 / KN95
              </h3>
              <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                ≥ 95% <span className="text-xs font-normal text-slate-600 dark:text-slate-400">Filtration</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                Made of electrostatically charged melt-blown nonwoven fibers. Tight nose clip and facial seal ensure air is forced through the filter rather than around the edges.
              </p>
            </div>
            <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
              Verdict: Mandatory during Poor, Very Poor &amp; Severe smog.
            </div>
          </div>

          {/* Surgical Mask */}
          <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-amber-800 dark:text-amber-300">
                  Inadequate for Smog
                </span>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                3-Ply Surgical Mask
              </h3>
              <div className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
                30%–45% <span className="text-xs font-normal text-slate-600 dark:text-slate-400">Filtration</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                Designed to stop outgoing fluid splashes, not incoming sub-micron particulates. Massive side leaks allow unfiltered smog to enter freely with every inhalation.
              </p>
            </div>
            <div className="pt-2 border-t border-amber-200 dark:border-amber-800 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
              Verdict: Negligible protection against toxic PM2.5.
            </div>
          </div>

          {/* Cloth Mask */}
          <div className="p-5 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-red-800 dark:text-red-300">
                  Zero Particulate Defense
                </span>
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Cloth / Cotton Bandana
              </h3>
              <div className="text-3xl font-black font-mono text-red-600 dark:text-red-400">
                &lt; 15% <span className="text-xs font-normal text-slate-600 dark:text-slate-400">Filtration</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">
                Woven cloth fiber pores are roughly 100 to 200 microns wide—hundreds of times larger than PM2.5 particles. Provides only a false sense of security.
              </p>
            </div>
            <div className="pt-2 border-t border-red-200 dark:border-red-800 text-[11px] font-semibold text-red-800 dark:text-red-300">
              Verdict: Completely ineffective against winter smog.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Reporting Illegal Waste Burning */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              Report Illegal Open Waste Burning
            </h2>
            <p className="text-xs text-slate-400 font-light">
              Municipal compliance channels to report fires and industrial violations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-light">
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-1.5">
            <div className="font-bold text-white font-mono text-sm">
              1. CPCB Sameer App
            </div>
            <p className="text-slate-300 leading-relaxed">
              Official Indian Central Pollution Control Board mobile app. Allows residents to submit geo-tagged, time-stamped photographs of open leaf or garbage fires.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-1.5">
            <div className="font-bold text-white font-mono text-sm">
              2. Municipal 311 / Helplines
            </div>
            <p className="text-slate-300 leading-relaxed">
              Call your local municipal corporation or non-emergency civic hotline (e.g., Delhi Green Delhi App, BMC helpline) to dispatch rapid-response teams.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-1.5">
            <div className="font-bold text-white font-mono text-sm">
              3. Community Vigilance
            </div>
            <p className="text-slate-300 leading-relaxed">
              Educate neighborhood security guards and residential associations (RWAs) to replace waste fires with electric oil heaters or heavy winter clothing.
            </p>
          </div>
        </div>
      </div>

      {/* Printable Clean Air Family Checklist */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
            Clean Air Family Action Checklist
          </h3>
          <p className="text-xs text-slate-500 font-light">
            Print or share this 1-page emergency winter smog protocol for your home, school, or residential society.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintChecklist}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Checklist</span>
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? "Link Copied!" : "Share BreatheWise"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
