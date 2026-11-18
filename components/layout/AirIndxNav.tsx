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
} from "lucide-react";
import { useLocationContext } from "@/context/LocationContext";
import { PRESET_LOCATIONS } from "@/lib/open-meteo";
import { LocationData } from "@/lib/types";

export default function AirIndxNav({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const pathname = usePathname();
  const { location, setLocation } = useLocationContext();

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
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#060a16]/90 backdrop-blur-md px-6 sm:px-8 py-3.5 transition-all">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          {/* ========================================================
              LEFT NAVIGATION LINKS (Matches IMAGE 1)
             ======================================================== */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-medium text-slate-300">
            <Link
              href="/dashboard"
              className={`transition-colors hover:text-white ${
                pathname === "/dashboard" ? "text-white font-semibold" : "text-slate-400"
              }`}
            >
              Air Quality
            </Link>
            <Link
              href="/details"
              className={`transition-colors hover:text-white ${
                pathname === "/details" ? "text-white font-semibold" : "text-slate-400"
              }`}
            >
              Air Monitors
            </Link>
            <Link
              href="/community"
              className={`transition-colors hover:text-white ${
                pathname === "/community" ? "text-white font-semibold" : "text-slate-400"
              }`}
            >
              Discover
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Toggle Navigation"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* ========================================================
              CENTRE BRAND LOGO (Matches IMAGE 1)
             ======================================================== */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            {/* Glowing 4-point Star Emblem (Matching IMAGE 1) */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
              </svg>
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              BreatheWise
            </span>
          </Link>

          {/* ========================================================
              RIGHT NAVIGATION & "GET STARTED" BUTTON (Matches IMAGE 1)
             ======================================================== */}
          <div className="flex items-center space-x-6 text-xs font-medium">
            <nav className="hidden lg:flex items-center space-x-6 text-slate-400">
              <Link
                href="/indoor-air"
                className="hover:text-white transition-colors"
              >
                Indoor Air
              </Link>
              <Link
                href="/calculator"
                className="hover:text-white transition-colors"
              >
                Technology
              </Link>
            </nav>

            {/* Quick City Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10172e] border border-slate-700/80 hover:border-cyan-400/60 text-slate-300 text-xs transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-white truncate max-w-[100px]">
                {location.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {/* High-Contrast White Pill Button "Get Started" (Matches IMAGE 1) */}
            <Link
              href="/assistant"
              className="px-5 py-2 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-all shadow-md active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Global City Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0c1428] border border-slate-700/90 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Select City or Coordinates</h3>
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search global city (e.g. Jakarta, Delhi, London)..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#14203d] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1">
              <div className="text-[11px] font-mono uppercase text-slate-500 px-2 py-1">
                {isSearching ? "Searching global stations..." : "Popular World Metros"}
              </div>
              {searchResults.map((item, idx) => (
                <button
                  key={`${item.name}-${idx}`}
                  onClick={() => handleSelectCity(item)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-[#162447] transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold text-white">{item.name}</span>
                    <span className="text-xs text-slate-400">· {item.country}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
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
