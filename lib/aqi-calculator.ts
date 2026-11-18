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
        color: "#10b981",
        textColor: "text-emerald-700 dark:text-emerald-300",
        bgLight: "bg-emerald-50 dark:bg-emerald-950/40",
        borderColor: "border-emerald-300 dark:border-emerald-700/60",
        badgeBg: "bg-emerald-500 text-white",
        glow: "shadow-[0_0_24px_rgba(16,185,129,0.3)]",
        summary: "Air quality is considered satisfactory, and air pollution poses little or no risk.",
        healthImpact: "Minimal impact. Safe for all outdoor activities and exercise.",
      };
    case "Satisfactory":
      return {
        name: "Satisfactory",
        color: "#84cc16",
        textColor: "text-lime-700 dark:text-lime-300",
        bgLight: "bg-lime-50 dark:bg-lime-950/40",
        borderColor: "border-lime-300 dark:border-lime-700/60",
        badgeBg: "bg-lime-600 text-white",
        glow: "shadow-[0_0_24px_rgba(132,204,22,0.3)]",
        summary: "Minor breathing discomfort to sensitive individuals.",
        healthImpact: "Acceptable air quality. Unusually sensitive people should consider reducing prolonged outdoor exertion.",
      };
    case "Moderate":
      return {
        name: "Moderate",
        color: "#f59e0b",
        textColor: "text-amber-700 dark:text-amber-300",
        bgLight: "bg-amber-50 dark:bg-amber-950/40",
        borderColor: "border-amber-300 dark:border-amber-700/60",
        badgeBg: "bg-amber-500 text-white",
        glow: "shadow-[0_0_24px_rgba(245,158,11,0.3)]",
        summary: "Breathing discomfort to people with lungs, asthma and heart diseases.",
        healthImpact: "Children, seniors, and individuals with respiratory conditions should limit prolonged outdoor physical activity.",
      };
    case "Poor":
      return {
        name: "Poor",
        color: "#f97316",
        textColor: "text-orange-700 dark:text-orange-300",
        bgLight: "bg-orange-50 dark:bg-orange-950/40",
        borderColor: "border-orange-300 dark:border-orange-700/60",
        badgeBg: "bg-orange-500 text-white",
        glow: "shadow-[0_0_24px_rgba(249,115,22,0.3)]",
        summary: "Breathing discomfort to most people on prolonged exposure.",
        healthImpact: "Active children, adults, and people with respiratory disease should avoid prolonged outdoor exertion.",
      };
    case "Very Poor":
      return {
        name: "Very Poor",
        color: "#ef4444",
        textColor: "text-red-700 dark:text-red-300",
        bgLight: "bg-red-50 dark:bg-red-950/40",
        borderColor: "border-red-300 dark:border-red-700/60",
        badgeBg: "bg-red-500 text-white",
        glow: "shadow-[0_0_24px_rgba(239,68,68,0.35)]",
        summary: "Respiratory illness on prolonged exposure. Significant winter smog hazard.",
        healthImpact: "Everyone should wear N95/FFP2 masks outdoors and run indoor HEPA filtration. Avoid early morning outdoor walks.",
      };
    case "Severe":
    default:
      return {
        name: "Severe",
        color: "#7e22ce",
        textColor: "text-purple-700 dark:text-purple-300",
        bgLight: "bg-purple-50 dark:bg-purple-950/40",
        borderColor: "border-purple-300 dark:border-purple-700/60",
        badgeBg: "bg-purple-700 text-white",
        glow: "shadow-[0_0_28px_rgba(126,34,206,0.4)]",
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
