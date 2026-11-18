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
  Wind,
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
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-white dark:bg-slate-950 h-full p-5 flex flex-col justify-between shadow-2xl border-r border-slate-200 dark:border-slate-800 z-10 animate-in slide-in-from-left duration-200">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Wind className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">BreatheWise</span>
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-500 text-white font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-mono">
          Hack2Skill Challenge 6
        </div>
      </div>
    </div>
  );
}
