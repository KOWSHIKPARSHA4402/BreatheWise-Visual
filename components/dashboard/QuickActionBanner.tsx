"use client";

import React from "react";
import Link from "next/link";
import {
  Bot,
  CalendarCheck2,
  Home,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function QuickActionBanner() {
  const actions = [
    {
      title: "Ask the AI Assistant",
      desc: "Get location-aware medical guidance, school recess advice, and outdoor safety protocols powered by Gemini.",
      href: "/assistant",
      icon: Bot,
      color: "from-emerald-500 to-teal-600",
      accentBg: "hover:border-emerald-500/60",
      badge: "Gemini 1.5 Grounded",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      title: "Generate My Clean Air Plan",
      desc: "Create an adaptive 4-phase daily schedule matched to your commute method, work hours, and children's routines.",
      href: "/planner",
      icon: CalendarCheck2,
      color: "from-sky-500 to-blue-600",
      accentBg: "hover:border-sky-500/60",
      badge: "Adaptive Schedule",
      badgeClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    },
    {
      title: "Improve Indoor Air Quality",
      desc: "Calculate required True-HEPA CADR for your bedroom and learn scientific techniques for diurnal ventilation.",
      href: "/indoor-air",
      icon: Home,
      color: "from-indigo-500 to-purple-600",
      accentBg: "hover:border-indigo-500/60",
      badge: "CADR Calculator",
      badgeClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    },
    {
      title: "Explore Green Choices",
      desc: "Discover sustainable transit alternatives that adapt automatically based on whether ambient smog is safe or severe.",
      href: "/green-choices",
      icon: Sparkles,
      color: "from-teal-500 to-emerald-600",
      accentBg: "hover:border-teal-500/60",
      badge: "AQI-Sensitive",
      badgeClass: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Intelligent Action Center</span>
        </h2>
        <p className="text-xs text-slate-400 font-light">
          Contextual tools to protect your family&apos;s respiratory health and reduce urban emissions.
        </p>
      </div>

      {/* 4 Attractive Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className={`p-6 rounded-3xl bg-[#0f172a] border border-slate-800 transition-all flex flex-col justify-between space-y-4 shadow-sm group hover:-translate-y-1 hover:shadow-xl ${act.accentBg}`}
            >
              <div className="space-y-3">
                {/* Header Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${act.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${act.badgeClass}`}
                  >
                    {act.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors leading-snug">
                    {act.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400 font-light leading-relaxed">
                    {act.desc}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
