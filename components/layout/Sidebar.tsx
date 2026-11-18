"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Bot,
  CalendarCheck2,
  Home,
  Sparkles,
  Calculator,
  Users2,
  Settings,
  Wind,
  ChevronsLeft,
  ChevronsRight,
  ShieldAlert,
} from "lucide-react";
import { useLocationContext } from "@/context/LocationContext";
import { getCategoryTheme } from "@/lib/aqi-calculator";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Air Quality", href: "/details", icon: Activity },
  { name: "AI Assistant", href: "/assistant", icon: Bot, badge: "Gemini" },
  { name: "My Clean Air Plan", href: "/planner", icon: CalendarCheck2 },
  { name: "Indoor Air Quality", href: "/indoor-air", icon: Home },
  { name: "Green Choices", href: "/green-choices", icon: Sparkles },
  { name: "Environmental Impact", href: "/calculator", icon: Calculator },
  { name: "Community", href: "/community", icon: Users2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ isCollapsed: controlledCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { airQuality, location } = useLocationContext();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed((prev) => !prev));

  // Sync with local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("breathewise_sidebar_collapsed");
      if (saved !== null) {
        setInternalCollapsed(saved === "true");
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggle = () => {
    const next = !isCollapsed;
    toggleCollapse();
    try {
      localStorage.setItem("breathewise_sidebar_collapsed", String(next));
    } catch {
      // ignore
    }
  };

  const theme = airQuality ? getCategoryTheme(airQuality.cpcbCategory) : null;

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-slate-800 bg-[#0d1424] text-slate-300 transition-all duration-300 ease-in-out shrink-0 select-none z-30 ${
        isCollapsed ? "w-20 p-3" : "w-64 p-4"
      }`}
    >
      {/* Top Header: Logo & Collapse Button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-200">
              <div className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>BreatheWise</span>
                <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Urban Smog Platform</p>
            </div>
          )}
        </Link>

        <button
          onClick={handleToggle}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Real-time Location Mini-Card (when expanded) */}
      {!isCollapsed && airQuality && (
        <div className="mb-4 p-3 rounded-xl bg-[#131d31] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="truncate max-w-[120px] font-semibold text-slate-200">{location.name}</span>
            <span>{airQuality.cpcbCategory}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black font-mono text-white">{airQuality.cpcbAQI}</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">AQI</span>
            </div>
            <div
              className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm"
              style={{ backgroundColor: theme?.color }}
            />
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center rounded-xl text-xs font-semibold transition-all group ${
                isCollapsed ? "justify-center p-3" : "justify-between px-3.5 py-2.5"
              } ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? "text-emerald-400 scale-110" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                    isActive
                      ? "bg-emerald-400/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Smog Warning Alert (when severe and expanded) */}
      {!isCollapsed && airQuality && airQuality.cpcbAQI > 250 && (
        <div className="mt-3 p-3 rounded-xl bg-purple-950/40 border border-purple-800/50 text-[11px] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-purple-300 font-mono uppercase text-[10px]">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Severe Smog Alert</span>
          </div>
          <p className="text-purple-200/80 leading-tight font-light">
            N95 mask recommended. Keep windows sealed.
          </p>
        </div>
      )}

      {/* Bottom Metadata */}
      <div className={`pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono mt-3 ${isCollapsed ? "text-center" : "flex justify-between items-center px-1"}`}>
        {!isCollapsed && <span>Hack2Skill Ch 6</span>}
        <span className="text-emerald-400 font-bold">v1.1</span>
      </div>
    </aside>
  );
}
