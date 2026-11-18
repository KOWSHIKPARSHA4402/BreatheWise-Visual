"use client";

import React from "react";
import Link from "next/link";
import { Bot, CalendarCheck2, Home, Calculator, ArrowRight } from "lucide-react";

export default function QuickActionBanner() {
  const actions = [
    {
      title: "AI Smog Assistant",
      desc: "Ask Gemini what precautions your family needs today.",
      href: "/assistant",
      icon: Bot,
      color: "from-emerald-500 to-teal-600",
      badge: "Gemini 1.5",
    },
    {
      title: "My Clean Air Plan",
      desc: "Personalized daily schedule matching your commute & home.",
      href: "/planner",
      icon: CalendarCheck2,
      color: "from-sky-500 to-blue-600",
      badge: "Actionable",
    },
    {
      title: "Indoor Air Centre",
      desc: "CADR calculator & evidence-based HEPA filtration guides.",
      href: "/indoor-air",
      icon: Home,
      color: "from-indigo-500 to-purple-600",
      badge: "HEPA Guide",
    },
    {
      title: "Impact Calculator",
      desc: "Calculate CO2 and tailpipe emissions saved by your choices.",
      href: "/calculator",
      icon: Calculator,
      color: "from-amber-500 to-orange-600",
      badge: "DEFRA Factors",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Intelligent Action Tools
        </h2>
        <p className="text-xs text-slate-500 font-light">
          Context-driven features to protect health and minimize urban pollution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${act.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {act.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {act.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                    {act.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-4">
                <span>Explore Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
