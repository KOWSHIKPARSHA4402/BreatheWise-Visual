"use client";

import React, { useState } from "react";
import { SmartAlert } from "@/lib/types";
import { AlertTriangle, AlertOctagon, Info, X, ShieldAlert, ArrowRight } from "lucide-react";

interface SmartAlertsBannerProps {
  alerts?: SmartAlert[];
  onTakeAction?: () => void;
}

export default function SmartAlertsBanner({ alerts, onTakeAction }: SmartAlertsBannerProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  if (!alerts || !alerts.length) return null;

  const activeAlerts = alerts.filter((a) => !dismissedIds.has(a.id));
  if (!activeAlerts.length) return null;

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  return (
    <div className="space-y-3" aria-label="Live Atmospheric Alerts">
      {activeAlerts.map((alert) => {
        const isEmergency = alert.severity === "emergency";
        const isWarning = alert.severity === "warning";

        let cardBorder = "border-[#6BAEAA]/50";
        let cardBg = "bg-white/80";
        let glowClass = "shadow-[0_4px_20px_rgba(107,174,170,0.15)]";
        let iconColor = "text-[#6BAEAA]";
        let badgeBg = "bg-[#DCECE8] text-[#234B55] border-[#A9D5C8]";
        let IconComp = Info;

        if (isEmergency) {
          cardBorder = "border-[#B85450]/60";
          cardBg = "bg-gradient-to-r from-[#B85450]/15 via-[#F4F8F6] to-white/90";
          glowClass = "shadow-[0_4px_24px_rgba(184,84,80,0.22)] ring-1 ring-[#B85450]/30";
          iconColor = "text-[#B85450]";
          badgeBg = "bg-[#B85450] text-white border-[#B85450]";
          IconComp = AlertOctagon;
        } else if (isWarning) {
          cardBorder = "border-[#E9B978]/60";
          cardBg = "bg-gradient-to-r from-[#E9B978]/15 via-[#F4F8F6] to-white/90";
          glowClass = "shadow-[0_4px_20px_rgba(233,185,120,0.18)] ring-1 ring-[#E9B978]/30";
          iconColor = "text-[#E9B978]";
          badgeBg = "bg-[#E9B978] text-[#234B55] font-bold border-[#F2CE9D]";
          IconComp = AlertTriangle;
        }

        return (
          <div
            key={alert.id}
            className={`p-4 sm:p-5 rounded-3xl ${cardBg} border ${cardBorder} ${glowClass} backdrop-blur-xl transition-all duration-300 relative group animate-fadeIn`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-2xl ${
                    isEmergency
                      ? "bg-[#B85450]/20 text-[#B85450]"
                      : isWarning
                      ? "bg-[#E9B978]/25 text-[#75460E]"
                      : "bg-[#DCECE8] text-[#234B55]"
                  } shrink-0 mt-0.5 shadow-sm`}
                >
                  <IconComp className={`w-5 h-5 ${iconColor}`} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${badgeBg}`}
                    >
                      {alert.severity}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[#234B55] tracking-tight">
                      {alert.title}
                    </h3>
                    <span className="text-[11px] font-mono text-[#687D83] hidden sm:inline">
                      · {alert.timestamp}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#48626A] font-light leading-relaxed">
                    {alert.message}
                  </p>

                  {/* Recommendation pill */}
                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#234B55] font-medium bg-white/70 px-3 py-1.5 rounded-xl border border-[#DCECE8] shadow-sm">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#6BAEAA] shrink-0" />
                      <span>{alert.recommendation}</span>
                    </div>

                    {onTakeAction && (
                      <button
                        onClick={onTakeAction}
                        className="text-xs font-bold text-[#234B55] hover:text-[#6BAEAA] flex items-center gap-1 transition-colors self-start sm:self-auto px-2 py-1"
                      >
                        <span>Protection Routine</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => handleDismiss(alert.id)}
                className="text-[#687D83] hover:text-[#234B55] p-1.5 rounded-xl hover:bg-white/60 transition-colors self-start sm:self-auto shrink-0"
                title="Dismiss alert"
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
