"use client";

import React, { useState } from "react";
import { useLocationContext } from "@/context/LocationContext";
import ModeSelector from "@/components/dashboard/ModeSelector";
import DashboardSectionNav from "@/components/dashboard/DashboardSectionNav";
import AirTodaySummary from "@/components/dashboard/AirTodaySummary";
import WhatShouldIDoToday from "@/components/dashboard/WhatShouldIDoToday";
import SimpleTrendSummary from "@/components/dashboard/SimpleTrendSummary";
import AirIndxHero from "@/components/dashboard/AirIndxHero";
import GlobalHotspotsSection from "@/components/dashboard/GlobalHotspotsSection";
import CityComparisonSection from "@/components/dashboard/CityComparisonSection";
import SmartAlertsBanner from "@/components/dashboard/SmartAlertsBanner";
import PollutantGrid from "@/components/dashboard/PollutantGrid";
import TrendChart from "@/components/dashboard/TrendChart";
import VulnerableAdvisory from "@/components/dashboard/VulnerableAdvisory";
import QuickActionBanner from "@/components/dashboard/QuickActionBanner";
import ImpactCommunitySection from "@/components/dashboard/ImpactCommunitySection";
import DetailsModal from "@/components/dashboard/DetailsModal";
import ChatInterface from "@/components/assistant/ChatInterface";
import PollutionAroundUs from "@/components/education/PollutionAroundUs";
import PollutantExplainer from "@/components/education/PollutantExplainer";
import AqiExplainedSection from "@/components/education/AqiExplainedSection";
import WhyIsAirPollutedSection from "@/components/education/WhyIsAirPollutedSection";
import AirQualitySchool from "@/components/education/AirQualitySchool";
import { AlertCircle, Bot, X, ChevronDown, ChevronUp, Sliders, BarChart3 } from "lucide-react";
import { GlobeCityPin } from "@/components/globe/EarthGlobe3D";
import { LocationData } from "@/lib/types";

export default function DashboardPage() {
  const { airQuality, isLoading, error, refreshAirQuality, setLocation, experienceMode } = useLocationContext();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [initialAiPrompt, setInitialAiPrompt] = useState<string | undefined>(undefined);
  const [showAdvancedDataInSimpleMode, setShowAdvancedDataInSimpleMode] = useState(false);

  const handleAskAi = (prompt: string) => {
    setInitialAiPrompt(prompt);
    setIsAiDrawerOpen(true);
  };

  const handleExplainCity = (city: GlobeCityPin) => {
    handleAskAi(
      `Please explain in simple everyday language what the air quality in ${city.name}, ${city.country} is like with an AQI of ${city.aqi} (${city.category}), and what precautions residents or travelers there should take.`
    );
  };

  const scrollToAdvanced = () => {
    setShowAdvancedDataInSimpleMode(true);
    setTimeout(() => {
      const el = document.getElementById("advanced");
      if (el) {
        const yOffset = -90;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  };

  if (isLoading && !airQuality) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#6BAEAA] border-t-transparent rounded-full animate-spin" />
        <div className="text-xs font-mono text-[#234B55]">
          Streaming planetary air quality telemetry from Open-Meteo &amp; Copernicus CAMS...
        </div>
      </div>
    );
  }

  if (!airQuality) {
    return (
      <div className="p-8 rounded-3xl bg-[#B85450]/10 border border-[#B85450]/30 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-[#B85450] mx-auto" />
        <h2 className="text-lg font-bold text-[#234B55]">Unable to Load Air Quality Telemetry</h2>
        <p className="text-xs text-[#687D83] max-w-md mx-auto">
          {error || "Could not retrieve atmospheric data for this coordinate. Please verify your connection or select another city."}
        </p>
        <button
          onClick={() => refreshAirQuality()}
          className="px-5 py-2.5 rounded-full bg-[#234B55] text-white text-xs font-bold hover:bg-[#1E414A] transition-colors shadow-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleSelectCityLocation = (loc: LocationData) => {
    setLocation(loc);
  };

  return (
    <div className="space-y-10 pb-24">
      {/* 1. Elegant Experience Mode Selector (Simple Mode vs Expert Mode) */}
      <section aria-label="Experience Mode Selector">
        <ModeSelector />
      </section>

      {/* 1B. Quick Dashboard Section Navigation Shortcuts */}
      <DashboardSectionNav />

      {/* 2. Live Smart Atmospheric & Clinical Alerts */}
      {airQuality?.alerts && airQuality.alerts.length > 0 && (
        <section aria-label="Smart Pollution Alerts">
          <SmartAlertsBanner
            alerts={airQuality.alerts}
            onTakeAction={() => setIsDetailsModalOpen(true)}
          />
        </section>
      )}

      {/* 3. Section: Overview */}
      <section id="overview" aria-label="What is Happening With Your Air Today" className="scroll-mt-24">
        <AirTodaySummary data={airQuality} onAskAi={handleAskAi} />
      </section>

      {/* 4. Section: Globe */}
      <section id="globe" aria-label="3D Planetary Air Quality Hero" className="scroll-mt-24">
        <AirIndxHero
          data={airQuality}
          onSelectCityLocation={handleSelectCityLocation}
          onOpenDetailsModal={() => setIsDetailsModalOpen(true)}
          onExplainCity={handleExplainCity}
        />
      </section>

      {/* 5. Section: What Should I Do Today? */}
      <section id="actions" aria-label="What Should I Do Today Action Steps" className="scroll-mt-24 space-y-8">
        <WhatShouldIDoToday data={airQuality} />
        {/* In Simple Mode, show Simplified Diurnal Trend Outlook */}
        {experienceMode === "simple" && (
          <SimpleTrendSummary data={airQuality} onExploreAdvanced={scrollToAdvanced} />
        )}
      </section>

      {/* If Expert Mode, render Full Technical Telemetry Right After Hero/Actions */}
      {experienceMode === "expert" && (
        <section id="advanced" aria-label="Advanced Atmospheric Analytics and Telemetry" className="scroll-mt-24 space-y-8">
          <div className="p-4 sm:p-5 rounded-3xl bg-[#234B55] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-[#6BAEAA]/25 text-[#A9D5C8]">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold">Expert Mode: Live Planetary Telemetry Active</h3>
                <p className="text-xs text-[#DCECE8]/90">
                  Detailed particulate chemistry, diurnal boundary inversions, and multi-day predictive models.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono uppercase px-3 py-1 rounded-full bg-white/15 text-white font-bold border border-white/20">
              Scientific Precision
            </span>
          </div>

          <TrendChart data={airQuality} />
          <PollutantGrid data={airQuality} />
          <CityComparisonSection currentLocation={airQuality.location} onSelectCity={handleSelectCityLocation} />
          <GlobalHotspotsSection onSelectCity={handleSelectCityLocation} />
          <VulnerableAdvisory data={airQuality} />
        </section>
      )}

      {/* 6. Section: Learn About Air Pollution & Real-World Sources */}
      <section id="learn" aria-label="Learn About Air Pollution" className="scroll-mt-24 space-y-8">
        <PollutionAroundUs />
        <PollutantExplainer />
        <AqiExplainedSection />
        <WhyIsAirPollutedSection />
      </section>

      {/* 7. Section: Air Quality School (Interactive 8-Lesson Visual Academy) */}
      <section id="school" aria-label="Air Quality School" className="scroll-mt-24">
        <AirQualitySchool />
      </section>

      {/* If Simple Mode, render Advanced Telemetry inside an Expandable / Accessible Container */}
      {experienceMode === "simple" && (
        <section id="advanced" aria-label="Advanced Atmospheric Analytics and Telemetry" className="scroll-mt-24 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl liquid-glass border border-white/80 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#DCECE8]/70 text-[#234B55]">
                  <BarChart3 className="w-6 h-6 text-[#234B55]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#234B55]">
                    Explore Advanced Environmental Data
                  </h3>
                  <p className="text-xs text-[#465A60]">
                    In-depth multi-pollutant telemetry, 24-hour observation curves, and cross-city comparisons.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAdvancedDataInSimpleMode(!showAdvancedDataInSimpleMode)}
                className="px-5 py-2.5 rounded-2xl bg-[#234B55] hover:bg-[#1E414A] text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm glow-btn shrink-0"
              >
                <span>{showAdvancedDataInSimpleMode ? "Hide Advanced Data" : "Show Full Technical Data"}</span>
                {showAdvancedDataInSimpleMode ? (
                  <ChevronUp className="w-4 h-4 text-[#A9D5C8]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#A9D5C8]" />
                )}
              </button>
            </div>

            {showAdvancedDataInSimpleMode && (
              <div className="space-y-8 pt-4 border-t border-[#DCECE8] animate-fadeIn">
                <TrendChart data={airQuality} />
                <PollutantGrid data={airQuality} />
                <CityComparisonSection currentLocation={airQuality.location} onSelectCity={handleSelectCityLocation} />
                <GlobalHotspotsSection onSelectCity={handleSelectCityLocation} />
                <VulnerableAdvisory data={airQuality} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* 8. Intelligent Action Center Banner */}
      <section aria-label="Intelligent Action Center">
        <QuickActionBanner onOpenAssistant={() => setIsAiDrawerOpen(true)} />
      </section>

      {/* 9. Environmental Impact & Community Awareness */}
      <section aria-label="Environmental Impact and Community Awareness">
        <ImpactCommunitySection />
      </section>

      {/* Detailed Assessment Modal (Triggered by Hero Details Button) */}
      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        data={airQuality}
      />

      {/* Floating AI Assistant Trigger Pill */}
      <button
        onClick={() => setIsAiDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-[#234B55] hover:bg-[#1E414A] text-white shadow-2xl flex items-center gap-2.5 glow-btn border border-[#6BAEAA]/50 group"
        aria-label="Open AI Assistant"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#4A9E86] animate-pulse" />
        <Bot className="w-5 h-5 text-[#A9D5C8] group-hover:scale-110 transition-transform" />
        <span className="font-bold text-xs tracking-tight">Ask Clean Air AI</span>
      </button>

      {/* Interactive Slide-Over AI Assistant Drawer on Dashboard */}
      {isAiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#234B55]/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl h-full bg-[#F4F8F6] border-l border-[#DCECE8] shadow-2xl flex flex-col p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCECE8]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#234B55] text-white flex items-center justify-center shadow-sm">
                  <Bot className="w-5 h-5 text-[#A9D5C8]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#234B55]">BreatheWise AI Clean Air Educator</h3>
                  <p className="text-[11px] text-[#687D83]">
                    Beginner-Friendly Explanations, Live Telemetry &amp; General Knowledge
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAiDrawerOpen(false);
                  setInitialAiPrompt(undefined);
                }}
                className="p-2 rounded-xl text-[#687D83] hover:text-[#234B55] hover:bg-[#DCECE8]/60 transition-colors glow-btn"
                aria-label="Close assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden pt-3">
              <ChatInterface
                isEmbedded
                initialPrompt={initialAiPrompt}
                onClose={() => {
                  setIsAiDrawerOpen(false);
                  setInitialAiPrompt(undefined);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
