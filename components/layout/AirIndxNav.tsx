"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useLocationContext } from "@/context/LocationContext";
import { PRESET_LOCATIONS } from "@/lib/open-meteo";
import { LocationData } from "@/lib/types";

export default function AirIndxNav({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const pathname = usePathname();
  const { location, setLocation, experienceMode, setExperienceMode } = useLocationContext();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationData[]>(PRESET_LOCATIONS);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults(PRESET_LOCATIONS);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/geocoding?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.warn("Geocoding failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const handleSelectCity = (loc: LocationData) => {
    setLocation(loc);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/60 bg-white/75 backdrop-blur-xl backdrop-saturate-150 px-6 sm:px-8 py-3.5 transition-all shadow-[0_4px_24px_rgba(35,75,85,0.05)]">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          {/* ========================================================
              LEFT NAVIGATION LINKS
             ======================================================== */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-medium">
            <Link
              href="/dashboard"
              className={`transition-all py-1 ${
                pathname === "/dashboard"
                  ? "text-[#234B55] font-bold border-b-2 border-[#6BAEAA] shadow-[0_2px_8px_rgba(107,174,170,0.35)]"
                  : "text-[#687D83] hover:text-[#234B55] hover:border-b-2 hover:border-[#6BAEAA]/40"
              }`}
            >
              Air Quality
            </Link>
            <Link
              href="/details"
              className={`transition-all py-1 ${
                pathname === "/details"
                  ? "text-[#234B55] font-bold border-b-2 border-[#6BAEAA] shadow-[0_2px_8px_rgba(107,174,170,0.35)]"
                  : "text-[#687D83] hover:text-[#234B55] hover:border-b-2 hover:border-[#6BAEAA]/40"
              }`}
            >
              Air Monitors
            </Link>
            <Link
              href="/community"
              className={`transition-all py-1 ${
                pathname === "/community"
                  ? "text-[#234B55] font-bold border-b-2 border-[#6BAEAA] shadow-[0_2px_8px_rgba(107,174,170,0.35)]"
                  : "text-[#687D83] hover:text-[#234B55] hover:border-b-2 hover:border-[#6BAEAA]/40"
              }`}
            >
              Discover
            </Link>
            <Link
              href="/dashboard#school"
              className="text-[#687D83] hover:text-[#234B55] transition-all py-1 hover:border-b-2 hover:border-[#6BAEAA]/40 flex items-center gap-1"
            >
              <span>School</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#6BAEAA]/20 text-[#234B55] font-bold">8 Lessons</span>
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-1.5 rounded-xl text-[#687D83] hover:text-[#234B55] hover:bg-[#DCECE8]/60 transition-colors glow-btn"
                aria-label="Toggle Navigation"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* ========================================================
              CENTRE BRAND LOGO
             ======================================================== */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#234B55] to-[#6BAEAA] flex items-center justify-center shadow-md shadow-[#234B55]/15 ring-2 ring-white/60 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
              </svg>
            </div>
            <span className="text-base sm:text-lg font-black tracking-tight text-[#234B55] group-hover:text-[#6BAEAA] transition-colors">
              BreatheWise
            </span>
          </Link>

          {/* ========================================================
              RIGHT NAVIGATION & "GET STARTED" BUTTON
             ======================================================== */}
          <div className="flex items-center space-x-6 text-xs font-medium">
            <nav className="hidden lg:flex items-center space-x-6 text-[#687D83]">
              <Link
                href="/indoor-air"
                className={`transition-all py-1 ${
                  pathname === "/indoor-air"
                    ? "text-[#234B55] font-bold border-b-2 border-[#6BAEAA] shadow-[0_2px_8px_rgba(107,174,170,0.35)]"
                    : "hover:text-[#234B55] hover:border-b-2 hover:border-[#6BAEAA]/40"
                }`}
              >
                Indoor Air
              </Link>
              <Link
                href="/calculator"
                className={`transition-all py-1 ${
                  pathname === "/calculator"
                    ? "text-[#234B55] font-bold border-b-2 border-[#6BAEAA] shadow-[0_2px_8px_rgba(107,174,170,0.35)]"
                    : "hover:text-[#234B55] hover:border-b-2 hover:border-[#6BAEAA]/40"
                }`}
              >
                Technology
              </Link>
            </nav>

            {/* Quick City Trigger with Liquid Glass & Glow */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full liquid-glass glow-btn text-[#234B55] text-xs font-semibold shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-[#6BAEAA]" />
              <span className="truncate max-w-[110px]">
                {location.name}
              </span>
              <ChevronDown className="w-3 h-3 text-[#687D83]" />
            </button>

            {/* Quick Experience Mode Pill */}
            <button
              onClick={() => setExperienceMode(experienceMode === "simple" ? "expert" : "simple")}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DCECE8]/60 hover:bg-[#DCECE8] text-[#234B55] text-xs font-semibold transition-all border border-[#A9D5C8]/50 glow-btn"
              title={`Currently in ${experienceMode === "simple" ? "Simple" : "Expert"} Mode. Click to switch.`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#6BAEAA]" />
              <span className="capitalize">{experienceMode}</span>
            </button>

            {/* Deep Teal Pill Button "Get Started" with Glow */}
            <Link
              href="/assistant"
              className="px-5 py-2 rounded-full bg-[#234B55] text-white font-bold text-xs hover:bg-[#1A373E] transition-all shadow-md glow-btn"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Global City Search Modal with Liquid Glass */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#234B55]/30 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl liquid-glass glow-card p-6 space-y-4 text-[#234B55] shadow-2xl border border-white/80">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCECE8]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#6BAEAA]" />
                <h3 className="text-sm font-bold text-[#234B55]">Select City or Coordinates</h3>
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg text-[#687D83] hover:text-[#234B55] hover:bg-[#DCECE8]/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-[#687D83] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search global city (e.g. Jakarta, Delhi, London)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 border border-[#DCECE8] text-sm text-[#234B55] placeholder-[#687D83] focus:outline-none glow-input shadow-sm"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
              <div className="text-[11px] font-mono uppercase text-[#687D83] px-2 py-1 font-semibold">
                {isSearching ? "Searching global stations..." : "Popular World Metros"}
              </div>
              {searchResults.map((item, idx) => (
                <button
                  key={`${item.name}-${idx}`}
                  onClick={() => handleSelectCity(item)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left hover:bg-white/80 transition-all group glow-card border border-transparent hover:border-[#DCECE8]"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#6BAEAA] group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold text-[#234B55]">{item.name}</span>
                    <span className="text-xs text-[#687D83]">· {item.country}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#687D83]">
                    {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
