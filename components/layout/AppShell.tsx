"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import AirIndxNav from "./AirIndxNav";
import MobileNav from "./MobileNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  // If on landing page "/", render full-page landing
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F8F6] text-[#234B55] font-sans antialiased">
      {/* Sleek Horizontal Navigation Bar */}
      <AirIndxNav onMenuToggle={() => setIsNavDrawerOpen(true)} />

      {/* Slide-out Navigation Drawer for Full Feature Exploration */}
      <MobileNav
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
      />

      {/* Main Content Area - Full-Width Environmental Dashboard */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-10">
        {children}
      </main>

      {/* Subtle Environmental Footer */}
      <footer className="w-full border-t border-[#DCECE8] bg-white py-6 px-6 text-center text-xs text-[#687D83] font-mono">
        <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6BAEAA] animate-pulse" />
            <span className="font-semibold text-[#234B55]">BreatheWise Environmental Intelligence Platform</span>
          </div>
          <div>
            Powered by Copernicus CAMS, Open-Meteo &amp; Google Gemini GenAI
          </div>
        </div>
      </footer>
    </div>
  );
}
