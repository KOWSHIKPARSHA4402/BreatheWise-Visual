"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  CalendarCheck2,
  Sparkles,
  Calculator,
  Home,
  Users2,
  Activity,
  Settings,
  X,
} from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] bg-[#0c1428] h-full p-6 flex flex-col justify-between shadow-2xl border-r border-slate-800 z-10 animate-in slide-in-from-left duration-200 text-white">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
                </svg>
              </div>
              <span className="font-bold text-white text-base tracking-tight">BreatheWise</span>
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600/20 text-cyan-400 border border-cyan-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
          CPCB NAQI &amp; Copernicus CAMS Telemetry
        </div>
      </div>
    </div>
  );
}
