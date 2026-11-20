"use client";

import React from "react";
import Link from "next/link";
import {
  Wind,
  Bot,
  CalendarCheck2,
  Home,
  Calculator,
  ArrowRight,
  Sparkles,
  Activity,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { PRESET_LOCATIONS } from "@/lib/open-meteo";

export default function LandingPage() {
  const features = [
    {
      title: "Grounded Live Environmental Telemetry",
      desc: "Real-time PM2.5, PM10, NO2, SO2, CO, and O3 measurements mapped strictly to Indian CPCB NAQI and US EPA breakpoints.",
      icon: Activity,
      badge: "CPCB Standard",
    },
    {
      title: "Context-Aware GenAI Assistant",
      desc: "Powered by Google Gemini. Injects live ambient pollutants, temperature inversions, and family vulnerability into structured guidance.",
      icon: Bot,
      badge: "Gemini 1.5",
    },
    {
      title: "Personalized Daily Clean Air Plan",
      desc: "Dynamic 4-phase daily itinerary matching your commute, work hours, and children's outdoor schedules to mitigate particulate exposure.",
      icon: CalendarCheck2,
      badge: "Custom Plan",
    },
    {
      title: "Indoor Air Quality Improvement Centre",
      desc: "Interactive HEPA CADR calculator, diurnal ventilation timing, and strict warnings against hazardous ozone/ionic air cleaners.",
      icon: Home,
      badge: "CADR Sizing",
    },
    {
      title: "AQI-Sensitive Green Choices",
      desc: "Sustainable lifestyle alternatives that adapt to current smog levels—ensuring safe transit on clear days and emergency protocols during smog.",
      icon: Sparkles,
      badge: "Adaptive",
    },
    {
      title: "Defensible Environmental Accounting",
      desc: "Transparent tailpipe CO2 reduction calculations powered by official DEFRA GHG conversion factors.",
      icon: Calculator,
      badge: "DEFRA 2023",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F8F6] text-[#234B55] flex flex-col justify-between selection:bg-[#6BAEAA] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/60 bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#234B55] to-[#6BAEAA] flex items-center justify-center text-white shadow-md shadow-[#234B55]/15 glow-btn">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight flex items-center gap-1.5 text-[#234B55]">
              <span>BreatheWise</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#DCECE8] text-[#234B55] font-semibold">
                AI
              </span>
            </div>
            <p className="text-xs text-[#687D83] font-medium">Urban Air Quality Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-semibold text-[#687D83] hover:text-[#234B55] transition-colors glow-btn"
          >
            Live Dashboard
          </Link>
          <Link
            href="/assistant"
            className="px-4 py-2.5 rounded-xl bg-[#234B55] hover:bg-[#1E414A] text-white text-xs font-bold transition-all shadow-md shadow-[#234B55]/20 flex items-center gap-1.5 glow-btn"
          >
            <span>Launch Assistant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Hackathon Challenge Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-[#A9D5C8] text-xs font-mono font-semibold text-[#234B55] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#4A9E86] animate-pulse" />
            <span>Hack2Skill PromptWars Challenge 6: Urban Winter Smog Navigation</span>
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#234B55] leading-[1.15]">
            Intelligent Protection from{" "}
            <span className="bg-gradient-to-r from-[#234B55] via-[#6BAEAA] to-[#2D5E6B] bg-clip-text text-transparent">
              Severe Winter Smog
            </span>
          </h1>

          <p className="text-base sm:text-xl text-[#687D83] font-light max-w-2xl mx-auto leading-relaxed">
            BreatheWise combines real-time Copernicus environmental telemetry with Google Gemini GenAI to guide families through hazardous urban air pollution.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#234B55] hover:bg-[#1E414A] text-white font-bold text-sm shadow-xl shadow-[#234B55]/20 flex items-center justify-center gap-2 transition-all hover:scale-105 glow-btn"
            >
              <span>Explore Live Air Quality</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/assistant"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl liquid-glass text-[#234B55] border border-[#DCECE8] font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all glow-btn"
            >
              <Bot className="w-4 h-4 text-[#6BAEAA]" />
              <span>Ask AI Smog Assistant</span>
            </Link>
          </div>

          {/* Preset Hotspot Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#687D83]">
            <span className="font-mono text-[11px] uppercase">Monitored Hotspots:</span>
            {PRESET_LOCATIONS.map((loc) => (
              <Link
                key={loc.name}
                href="/dashboard"
                className="px-2.5 py-1 rounded-lg liquid-glass border border-[#DCECE8] text-[#234B55] hover:border-[#6BAEAA] transition-colors font-medium glow-btn"
              >
                {loc.name}
              </Link>
            ))}
          </div>
        </div>

        {/* 3 Core Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl liquid-glass glow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DCECE8] text-[#234B55] flex items-center justify-center font-bold font-mono">
              01
            </div>
            <h3 className="text-lg font-bold text-[#234B55]">
              How polluted is my air right now?
            </h3>
            <p className="text-xs text-[#687D83] font-light leading-relaxed">
              Live CPCB National AQI, PM2.5, PM10, meteorological thermal inversions, and 24-hour diurnal peak curves from Copernicus CAMS.
            </p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass glow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DCECE8] text-[#234B55] flex items-center justify-center font-bold font-mono">
              02
            </div>
            <h3 className="text-lg font-bold text-[#234B55]">
              What should my family do today?
            </h3>
            <p className="text-xs text-[#687D83] font-light leading-relaxed">
              Personalized 4-phase daily plans, True-HEPA purifier room sizing, N95 masking timing, and school recess cautions for children.
            </p>
          </div>

          <div className="p-6 rounded-3xl liquid-glass glow-card space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DCECE8] text-[#234B55] flex items-center justify-center font-bold font-mono">
              03
            </div>
            <h3 className="text-lg font-bold text-[#234B55]">
              How can I reduce emissions?
            </h3>
            <p className="text-xs text-[#687D83] font-light leading-relaxed">
              AQI-sensitive green choices, anti-idling practices, and a DEFRA-backed emissions calculator showing verified monthly CO2 savings.
            </p>
          </div>
        </div>

        {/* Feature Matrix Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase text-[#6BAEAA] font-bold tracking-wider">
              Comprehensive Platform Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#234B55]">
              Engineered for Real-World Environmental Navigation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-3xl liquid-glass glow-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-[#DCECE8]/60 text-[#234B55]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-[#F4F8F6] border border-[#DCECE8] text-[#234B55]">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#234B55]">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-[#687D83] font-light leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Severe Smog Protocol Callout */}
        <div className="p-8 rounded-3xl liquid-glass-dark glow-card-dark text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#E9B978] font-bold">
              <AlertTriangle className="w-4 h-4 text-[#E9B978]" />
              <span>Winter Smog Inversion Protocol</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              When Regional AQI Exceeds 300 (Severe Smog)
            </h3>
            <p className="text-xs text-[#DCECE8]/90 font-light leading-relaxed">
              BreatheWise automatically adapts recommendations to emergency defense: window sealing, continuous bedroom HEPA filtration, and strict avoidance of early morning outdoor hyperventilation.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-6 py-3.5 rounded-2xl bg-white text-[#234B55] font-bold text-xs hover:bg-[#F4F8F6] transition-colors shadow-lg flex items-center gap-2 shrink-0 glow-btn"
          >
            <span>Open Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#DCECE8] liquid-glass py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#687D83]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#234B55]">BreatheWise</span>
            <span>· Hack2Skill PromptWars Challenge 6</span>
          </div>
          <div className="flex items-center gap-4 text-[#687D83] font-mono">
            <span>Next.js 14 App Router</span>
            <span>Google Gemini GenAI</span>
            <span>Copernicus CAMS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
