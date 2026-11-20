"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Globe2,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  BarChart3,
} from "lucide-react";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: Compass },
  { id: "globe", label: "Globe", icon: Globe2 },
  { id: "actions", label: "What Should I Do?", icon: CheckCircle2 },
  { id: "learn", label: "Learn About Air", icon: BookOpen },
  { id: "school", label: "Air School", icon: GraduationCap },
  { id: "advanced", label: "Advanced Data", icon: BarChart3 },
];

export default function DashboardSectionNav() {
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <nav
      aria-label="Dashboard quick navigation"
      className="sticky top-[68px] z-30 w-full py-2 px-1 backdrop-blur-xl bg-white/70 border-y border-[#DCECE8] shadow-[0_4px_16px_rgba(35,75,85,0.04)]"
    >
      <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar px-2 sm:px-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollTo(sec.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap glow-btn ${
                  isActive
                    ? "bg-[#234B55] text-white shadow-sm ring-1 ring-[#6BAEAA]/50"
                    : "text-[#465A60] hover:text-[#234B55] hover:bg-[#DCECE8]/60"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#A9D5C8]" : "text-[#6BAEAA]"}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        <span className="hidden lg:inline text-[11px] font-mono font-medium text-[#465A60] tracking-wide">
          Quick Jump
        </span>
      </div>
    </nav>
  );
}
