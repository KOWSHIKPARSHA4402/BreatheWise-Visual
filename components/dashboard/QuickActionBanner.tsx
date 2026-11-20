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

interface QuickActionBannerProps {
  onOpenAssistant?: () => void;
}

export default function QuickActionBanner({ onOpenAssistant }: QuickActionBannerProps) {
  const actions = [
    {
      title: "Ask the AI Assistant",
      desc: "Get location-aware medical guidance, school recess advice, and outdoor safety protocols powered by Gemini.",
      href: "/assistant",
      onClick: onOpenAssistant,
      icon: Bot,
      color: "from-[#234B55] to-[#6BAEAA]",
      badge: "Gemini 1.5 Grounded",
      badgeClass: "bg-[#DCECE8] text-[#234B55] border-[#A9D5C8]",
    },
    {
      title: "Generate My Clean Air Plan",
      desc: "Create an adaptive 4-phase daily schedule matched to your commute method, work hours, and children's routines.",
      href: "/planner",
      icon: CalendarCheck2,
      color: "from-[#6BAEAA] to-[#A9D5C8]",
      badge: "Adaptive Schedule",
      badgeClass: "bg-[#DCECE8] text-[#234B55] border-[#A9D5C8]",
    },
    {
      title: "Improve Indoor Air Quality",
      desc: "Calculate required True-HEPA CADR for your bedroom and learn scientific techniques for diurnal ventilation.",
      href: "/indoor-air",
      icon: Home,
      color: "from-[#234B55] to-[#79BFAE]",
      badge: "CADR Calculator",
      badgeClass: "bg-[#DCECE8] text-[#234B55] border-[#A9D5C8]",
    },
    {
      title: "Explore Green Choices",
      desc: "Discover sustainable transit alternatives that adapt automatically based on whether ambient smog is safe or severe.",
      href: "/green-choices",
      icon: Sparkles,
      color: "from-[#E9B978] to-[#6BAEAA]",
      badge: "AQI-Sensitive",
      badgeClass: "bg-[#DCECE8] text-[#234B55] border-[#A9D5C8]",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-[#234B55] tracking-tight flex items-center gap-2">
          <span>Intelligent Action Center</span>
        </h2>
        <p className="text-xs text-[#687D83] font-light">
          Contextual tools to protect your family&apos;s respiratory health and reduce urban emissions.
        </p>
      </div>

      {/* 4 Attractive Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          const content = (
            <div className="p-6 rounded-3xl liquid-glass glow-card flex flex-col justify-between space-y-4 group h-full cursor-pointer">
              <div className="space-y-3">
                {/* Header Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${act.color} text-white flex items-center justify-center shadow-md shadow-[#234B55]/15 ring-2 ring-white/70 group-hover:scale-105 transition-transform`}
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
                  <h3 className="font-bold text-base text-[#234B55] group-hover:text-[#6BAEAA] transition-colors leading-snug">
                    {act.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#687D83] font-light leading-relaxed">
                    {act.desc}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-[#DCECE8] flex items-center justify-between text-xs font-bold text-[#234B55] group-hover:text-[#6BAEAA] transition-colors">
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );

          if (act.onClick) {
            return (
              <div
                key={act.title}
                onClick={act.onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    act.onClick?.();
                  }
                }}
              >
                {content}
              </div>
            );
          }

          return (
            <Link key={act.title} href={act.href}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
