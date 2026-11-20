// BreatheWise - Official CPCB & US EPA Air Quality Index Calculator
// Grounded strictly in CPCB (Central Pollution Control Board, India) & US EPA Breakpoint Standards

import { AQICategory } from "./types";

interface Breakpoint {
  cLow: number;
  cHigh: number;
  iLow: number;
  iHigh: number;
}

// CPCB 24-hour Breakpoint Tables (India National Air Quality Index)
const CPCB_PM25_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50 },         // Good
  { cLow: 31, cHigh: 60, iLow: 51, iHigh: 100 },      // Satisfactory
  { cLow: 61, cHigh: 90, iLow: 101, iHigh: 200 },     // Moderate
  { cLow: 91, cHigh: 120, iLow: 201, iHigh: 300 },    // Poor
  { cLow: 121, cHigh: 250, iLow: 301, iHigh: 400 },   // Very Poor
  { cLow: 251, cHigh: 500, iLow: 401, iHigh: 500 },   // Severe
];

const CPCB_PM10_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
  { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },
  { cLow: 101, cHigh: 250, iLow: 101, iHigh: 200 },
  { cLow: 251, cHigh: 350, iLow: 201, iHigh: 300 },
  { cLow: 351, cHigh: 430, iLow: 301, iHigh: 400 },
  { cLow: 431, cHigh: 600, iLow: 401, iHigh: 500 },
];

const CPCB_NO2_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50 },
  { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100 },
  { cLow: 81, cHigh: 180, iLow: 101, iHigh: 200 },
  { cLow: 181, cHigh: 280, iLow: 201, iHigh: 300 },
  { cLow: 281, cHigh: 400, iLow: 301, iHigh: 400 },
  { cLow: 401, cHigh: 800, iLow: 401, iHigh: 500 },
];

const CPCB_SO2_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50 },
  { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100 },
  { cLow: 81, cHigh: 380, iLow: 101, iHigh: 200 },
  { cLow: 381, cHigh: 800, iLow: 201, iHigh: 300 },
  { cLow: 801, cHigh: 1600, iLow: 301, iHigh: 400 },
  { cLow: 1601, cHigh: 2000, iLow: 401, iHigh: 500 },
];

const CPCB_CO_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 1.0, iLow: 0, iHigh: 50 },
  { cLow: 1.1, cHigh: 2.0, iLow: 51, iHigh: 100 },
  { cLow: 2.1, cHigh: 10.0, iLow: 101, iHigh: 200 },
  { cLow: 10.1, cHigh: 17.0, iLow: 201, iHigh: 300 },
  { cLow: 17.1, cHigh: 34.0, iLow: 301, iHigh: 400 },
  { cLow: 34.1, cHigh: 50.0, iLow: 401, iHigh: 500 },
];

const CPCB_O3_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
  { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },
  { cLow: 101, cHigh: 168, iLow: 101, iHigh: 200 },
  { cLow: 169, cHigh: 208, iLow: 201, iHigh: 300 },
  { cLow: 209, cHigh: 748, iLow: 301, iHigh: 400 },
  { cLow: 749, cHigh: 1000, iLow: 401, iHigh: 500 },
];

// Linear interpolation formula standard
function calculateSubIndex(concentration: number, table: Breakpoint[]): number {
  if (concentration <= 0 || isNaN(concentration)) return 0;
  
  for (const bp of table) {
    if (concentration >= bp.cLow && concentration <= bp.cHigh) {
      return Math.round(
        bp.iLow + ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (concentration - bp.cLow)
      );
    }
  }

  // If concentration exceeds the highest breakpoint:
  const last = table[table.length - 1];
  if (concentration > last.cHigh) {
    // Cap at 500 for standard CPCB scale, or linearly extrapolate safely
    return Math.min(500, Math.round(last.iHigh + (concentration - last.cHigh) * 0.2));
  }

  return 0;
}

export function getCPCBAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}

export function getCategoryTheme(category: AQICategory) {
  switch (category) {
    case "Good":
      return {
        name: "Good",
        color: "#4A9E86",
        textColor: "text-[#234B55]",
        bgLight: "bg-[#DCECE8]/40",
        borderColor: "border-[#A9D5C8]",
        badgeBg: "bg-[#4A9E86] text-white",
        glow: "shadow-[0_0_18px_rgba(74,158,134,0.25)]",
        summary: "Air quality is considered satisfactory, and air pollution poses little or no risk.",
        healthImpact: "Minimal impact. Safe for all outdoor activities and exercise.",
      };
    case "Satisfactory":
      return {
        name: "Satisfactory",
        color: "#6BAEAA",
        textColor: "text-[#234B55]",
        bgLight: "bg-[#DCECE8]/50",
        borderColor: "border-[#6BAEAA]/50",
        badgeBg: "bg-[#6BAEAA] text-white",
        glow: "shadow-[0_0_18px_rgba(107,174,170,0.25)]",
        summary: "Minor breathing discomfort to sensitive individuals.",
        healthImpact: "Acceptable air quality. Unusually sensitive people should consider reducing prolonged outdoor exertion.",
      };
    case "Moderate":
      return {
        name: "Moderate",
        color: "#E9B978",
        textColor: "text-[#75460E]",
        bgLight: "bg-[#E9B978]/15",
        borderColor: "border-[#E9B978]/60",
        badgeBg: "bg-[#E9B978] text-[#234B55] font-bold",
        glow: "shadow-[0_0_18px_rgba(233,185,120,0.25)]",
        summary: "Breathing discomfort to people with lungs, asthma and heart diseases.",
        healthImpact: "Children, seniors, and individuals with respiratory conditions should limit prolonged outdoor physical activity.",
      };
    case "Poor":
      return {
        name: "Poor",
        color: "#E0937A",
        textColor: "text-[#753424]",
        bgLight: "bg-[#E0937A]/15",
        borderColor: "border-[#E0937A]/60",
        badgeBg: "bg-[#E0937A] text-white",
        glow: "shadow-[0_0_18px_rgba(224,147,122,0.25)]",
        summary: "Breathing discomfort to most people on prolonged exposure.",
        healthImpact: "Active children, adults, and people with respiratory disease should avoid prolonged outdoor exertion.",
      };
    case "Very Poor":
      return {
        name: "Very Poor",
        color: "#D98E83",
        textColor: "text-[#72271E]",
        bgLight: "bg-[#D98E83]/20",
        borderColor: "border-[#D98E83]/60",
        badgeBg: "bg-[#D98E83] text-white",
        glow: "shadow-[0_0_18px_rgba(217,142,131,0.3)]",
        summary: "Respiratory illness on prolonged exposure. Significant winter smog hazard.",
        healthImpact: "Everyone should wear N95/FFP2 masks outdoors and run indoor HEPA filtration. Avoid early morning outdoor walks.",
      };
    case "Severe":
    default:
      return {
        name: "Severe",
        color: "#B85450",
        textColor: "text-[#611A17]",
        bgLight: "bg-[#B85450]/20",
        borderColor: "border-[#B85450]/60",
        badgeBg: "bg-[#B85450] text-white",
        glow: "shadow-[0_0_20px_rgba(184,84,80,0.35)]",
        summary: "Affects healthy people and seriously impacts those with existing diseases. Emergency winter smog conditions.",
        healthImpact: "Severe health hazard. Seal doors/windows, run HEPA purifiers continuously, avoid all non-essential outdoor travel.",
      };
  }
}

export interface SubIndexBreakdown {
  overallAQI: number;
  category: AQICategory;
  dominantPollutant: string;
  subIndices: {
    pm2_5: number;
    pm10: number;
    no2: number;
    so2: number;
    co: number;
    o3: number;
  };
}

export function computeCPCBAQI(concentrations: {
  pm2_5?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  co?: number;
  o3?: number;
}): SubIndexBreakdown {
  const pm25Sub = concentrations.pm2_5 ? calculateSubIndex(concentrations.pm2_5, CPCB_PM25_BREAKPOINTS) : 0;
  const pm10Sub = concentrations.pm10 ? calculateSubIndex(concentrations.pm10, CPCB_PM10_BREAKPOINTS) : 0;
  const no2Sub = concentrations.no2 ? calculateSubIndex(concentrations.no2, CPCB_NO2_BREAKPOINTS) : 0;
  const so2Sub = concentrations.so2 ? calculateSubIndex(concentrations.so2, CPCB_SO2_BREAKPOINTS) : 0;
  const coSub = concentrations.co ? calculateSubIndex(concentrations.co, CPCB_CO_BREAKPOINTS) : 0;
  const o3Sub = concentrations.o3 ? calculateSubIndex(concentrations.o3, CPCB_O3_BREAKPOINTS) : 0;

  const subMap: Record<string, number> = {
    "PM2.5": pm25Sub,
    "PM10": pm10Sub,
    "NO2": no2Sub,
    "SO2": so2Sub,
    "CO": coSub,
    "O3": o3Sub,
  };

  let maxVal = 0;
  let dominant = "PM2.5";

  for (const [key, val] of Object.entries(subMap)) {
    if (val > maxVal) {
      maxVal = val;
      dominant = key;
    }
  }

  return {
    overallAQI: maxVal,
    category: getCPCBAQICategory(maxVal),
    dominantPollutant: dominant,
    subIndices: {
      pm2_5: pm25Sub,
      pm10: pm10Sub,
      no2: no2Sub,
      so2: so2Sub,
      co: coSub,
      o3: o3Sub,
    },
  };
}
