"use client";

import React, { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

interface InfoTooltipProps {
  term: string;
  explanation: string;
  analogy?: string;
  className?: string;
}

export default function InfoTooltip({
  term,
  explanation,
  analogy,
  className = "",
}: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ml-1 ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-[#687D83] hover:text-[#6BAEAA] transition-colors focus:outline-none focus:ring-1 focus:ring-[#6BAEAA] rounded-full p-0.5"
        aria-label={`Learn what ${term} means`}
        aria-expanded={isOpen}
      >
        <HelpCircle className="w-3.5 h-3.5 opacity-70 hover:opacity-100" />
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-2xl liquid-glass border border-white/80 shadow-xl text-left pointer-events-none animate-fadeIn"
        >
          <div className="flex items-center gap-1.5 pb-1 border-b border-[#DCECE8] mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6BAEAA]" />
            <h4 className="text-[11px] font-bold text-[#234B55] tracking-tight">{term}</h4>
          </div>
          <p className="text-[11px] leading-relaxed text-[#234B55]/90 font-normal">
            {explanation}
          </p>
          {analogy && (
            <div className="mt-1.5 pt-1.5 border-t border-[#DCECE8]/60 text-[10px] text-[#687D83] italic">
              <span className="font-semibold text-[#234B55] not-italic">Analogy: </span>
              {analogy}
            </div>
          )}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white/80" />
        </div>
      )}
    </div>
  );
}
