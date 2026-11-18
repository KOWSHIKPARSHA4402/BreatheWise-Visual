"use client";

import React from "react";
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
  ShieldAlert,
} from "lucide-react";
import { useLocationContext } from "@/context/LocationContext";
import { getCategoryTheme } from "@/lib/aqi-calculator";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AQI Deep Dive", href: "/details", icon: Activity },
  { name: "AI Assistant", href: "/assistant", icon: Bot, badge: "Gemini" },
  { name: "My Clean Air Plan", href: "/planner", icon: CalendarCheck2 },
  { name: "Indoor Air Quality", href: "/indoor-air", icon: Home },
  { name: "Green Choices", href: "/green-choices", icon: Sparkles },
  { name: "Impact Calculator", href: "/calculator", icon: Calculator },
  { name: "Community Action", href: "/community", icon: Users2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { airQuality, location } = useLocationContext();

  const theme = airQuality ? getCategoryTheme(airQuality.cpcbCategory) : null;

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shrink-0 justify-between">
      <div className="space-y-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 px-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>BreatheWise</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Urban Clean Air Platform
            </p>
          </div>
        </Link>

        {/* Live Location & AQI Pill */}
        {airQuality && (
          <div className={`p-3 rounded-2xl border ${theme?.borderColor} ${theme?.bgLight} transition-all`}>
            <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              <span className="truncate max-w-[130px] font-semibold text-slate-900 dark:text-white">
                {location.name}
              </span>
              <span className="text-[10px] font-mono uppercase text-slate-500">
                CPCB NAQI
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {airQuality.cpcbAQI}
                </span>
                <span className={`text-xs font-semibold ${theme?.textColor}`}>
                  {airQuality.cpcbCategory}
                </span>
              </div>
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: theme?.color }}
                title={`Air Quality: ${airQuality.cpcbCategory}`}
              />
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Smog Advisory */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        {airQuality && airQuality.cpcbAQI > 200 && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>Winter Smog Active</span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-tight">
              Wear an N95 mask outdoors. Avoid morning runs.
            </p>
          </div>
        )}

        <div className="px-2 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between font-mono">
          <span>Hack2Skill Challenge 6</span>
          <span className="text-emerald-700 dark:text-emerald-300 font-semibold">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
