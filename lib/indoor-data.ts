// BreatheWise - Indoor Air Quality Center Data & Scientific Guidelines
// Evidence-based residential air quality interventions

import { IndoorPillarGuide } from "./types";

export const INDOOR_PILLARS: IndoorPillarGuide[] = [
  {
    id: "hepa-purification",
    category: "Air Purification",
    title: "True HEPA (H13/H14) Mechanical Filtration",
    problem: "Winter smog particles (PM2.5 and PM0.1) penetrate microscopic door and window gaps, accumulating inside living rooms and bedrooms to toxic levels.",
    recommendedAction: "Operate a certified True-HEPA air purifier sized for your room volume, running on auto or medium speed continuously during winter smog months.",
    whyItHelps: "True HEPA (High-Efficiency Particulate Air) filters physically capture 99.97% of airborne particles down to 0.3 microns and diffusion captures particles even smaller (down to 0.01 microns).",
    expectedBenefit: "Reduces indoor PM2.5 concentrations by 75% to 90% within 45 minutes of operation in a closed room.",
    estimatedCost: "$$",
    hazardWarning: "CRITICAL SAFETY WARNING: Avoid air cleaners advertised as 'ionic', 'ozone generators', or 'bipolar ionization'. Ozone is a dangerous pulmonary toxicant that triggers asthma and permanent lung tissue damage.",
    dos: [
      "Choose purifiers with an H13 or H14 medical-grade HEPA filter and activated carbon stage.",
      "Match the Clean Air Delivery Rate (CADR) to achieve at least 4 to 5 Air Changes per Hour (ACH).",
      "Position the purifier at least 1.5 feet away from walls in the breathing zone of the room.",
      "Vacuum the mesh pre-filter every 2-3 weeks to prolong the primary HEPA filter life.",
    ],
    donts: [
      "Never purchase ozone-generating or ionic electrostatic precipitator purifiers.",
      "Don't turn off the purifier when leaving for short errands; continuous operation maintains particle-free air.",
    ],
  },
  {
    id: "source-control",
    category: "Source Control",
    title: "Indoor Combustion & Scent Elimination",
    problem: "Burning incense (agarbatti), mosquito coils, scented paraffin candles, and indoor tobacco produces dense plumes of ultrafine soot, benzene, and formaldehyde inside the home.",
    recommendedAction: "Strictly eliminate all open burning, incense sticks, dhoop, and mosquito repellents. Switch to electric mosquito vaporizers or physical window mesh.",
    whyItHelps: "One burning incense stick generates as much PM2.5 as several burning cigarettes, concentrating dangerous polycyclic aromatic hydrocarbons (PAHs) in unventilated rooms.",
    expectedBenefit: "Immediately eliminates the single largest domestic source of indoor toxic particulates and chemical volatile organic compounds (VOCs).",
    estimatedCost: "Free / Habitual",
    dos: [
      "Use stainless steel mosquito mesh screens on windows instead of burning coils.",
      "Switch to unscented beeswax candles or LED ambient lighting.",
      "Ensure all family members and visitors smoke exclusively outdoors away from entrance doors.",
    ],
    donts: [
      "Never burn incense or dhoop in closed air-conditioned or air-purified rooms.",
      "Avoid unvented kerosene or wood room heaters during winter nights.",
    ],
  },
  {
    id: "ventilation-timing",
    category: "Ventilation Timing",
    title: "Diurnal Inversion Timing & Window Sealing",
    problem: "Early morning winter air (6:00 AM – 9:00 AM) suffers from ground-level thermal inversions: cold dense air traps vehicle exhaust and biomass smoke directly outside your windows.",
    recommendedAction: "Keep all exterior doors and windows strictly sealed overnight and through morning hours. Open windows briefly for 15-20 minutes only between 1:00 PM and 3:30 PM if regional AQI drops below 150.",
    whyItHelps: "Afternoon solar radiation warms the earth's surface, breaking the atmospheric inversion lid and allowing trapped smog to disperse vertically into the troposphere.",
    expectedBenefit: "Prevents high-concentration morning smog spikes from entering the living quarters while ensuring sufficient fresh oxygen replenishment in the afternoon.",
    estimatedCost: "$",
    dos: [
      "Install self-adhesive EPDM weatherstripping foam tape on outer door and window jambs.",
      "Check the BreatheWise live hourly AQI before cracking open any window.",
      "Run your HEPA air purifier on high speed for 20 minutes immediately after closing windows.",
    ],
    donts: [
      "Never open windows for 'fresh morning air' during severe winter smog episodes.",
      "Don't leave windows open unattended during windy dusty afternoons.",
    ],
  },
  {
    id: "wet-cleaning",
    category: "Cleaning Strategy",
    title: "Wet Dusting & Damp Mopping vs. Dry Sweeping",
    problem: "Traditional dry brooms (jharoo) and feather dusters fragment settled toxic particles and re-suspend them directly into the breathing zone for hours.",
    recommendedAction: "Replace dry sweeping with damp microfiber flat mopping. Wipe tables, electronics, and countertops with damp cloths rinsed in plain water.",
    whyItHelps: "Damp microfiber cloths trap particles through surface tension and electrostatic attraction, permanently removing heavy metals and lead-laden road dust.",
    expectedBenefit: "Prevents a 300% surge in airborne PM10 particles that routinely occurs after dry broom sweeping.",
    estimatedCost: "$",
    dos: [
      "Use a two-bucket damp mopping method with washable microfiber mop heads.",
      "Wipe window sills and ceiling fans with damp cloths once a week.",
      "Place heavy-duty coir entrance mats outside all doorways to capture exterior shoe dirt.",
    ],
    donts: [
      "Never use dry brooms or dry feather dusters inside during smog season.",
      "Avoid vacuum cleaners that do not feature sealed HEPA exhaust filtration.",
    ],
  },
  {
    id: "kitchen-exhaust",
    category: "Kitchen & Cooking",
    title: "High-Efficiency Kitchen Range Hoods & Clean Cooking",
    problem: "High-heat cooking, oil frying (tadka/deep frying), and gas combustion generate immense spikes of PM2.5, carbon monoxide (CO), and nitrogen dioxide (NO2).",
    recommendedAction: "Turn on the kitchen exhaust hood or chimney 2 minutes before igniting burners and keep it running for 5 minutes after cooking finishes. Keep kitchen doors closed to living areas.",
    whyItHelps: "A ducted exhaust fan creates negative pressure in the kitchen, venting combustion byproducts directly outdoors before they diffuse through the family's bedrooms.",
    expectedBenefit: "Reduces cooking-related indoor PM2.5 concentrations by up to 85% and eliminates indoor NO2 gas buildup.",
    estimatedCost: "$$",
    dos: [
      "Always cover pots and pans with lids while boiling or simmering.",
      "Switch to magnetic induction cooktops where feasible, eliminating gas combustion emissions.",
      "Clean chimney baffle grease filters monthly with warm soapy water to maintain suction power.",
    ],
    donts: [
      "Never cook without turning on the exhaust fan or opening the isolated kitchen window.",
      "Avoid charring food or high-smoke oil cooking during poor air quality days.",
    ],
  },
];

// Clean Air Delivery Rate (CADR) Calculator Utility
export function calculateRequiredCADR(
  roomLengthM: number,
  roomWidthM: number,
  ceilingHeightM: number = 2.7,
  targetACH: number = 5
): {
  volumeM3: number;
  volumeCuFt: number;
  requiredCadrM3H: number;
  requiredCadrCFM: number;
  recommendedPurifierClass: string;
} {
  const length = Math.max(1, roomLengthM);
  const width = Math.max(1, roomWidthM);
  const height = Math.max(2, ceilingHeightM);

  const volumeM3 = Number((length * width * height).toFixed(1));
  const volumeCuFt = Math.round(volumeM3 * 35.3147);
  const requiredCadrM3H = Math.round(volumeM3 * targetACH);
  const requiredCadrCFM = Math.round(requiredCadrM3H / 1.699);

  let recommendedPurifierClass = "Compact Bedroom (CADR 150-250 m³/h)";
  if (requiredCadrM3H > 450) {
    recommendedPurifierClass = "Extra-Large Open Living Area / Commercial (CADR 500+ m³/h)";
  } else if (requiredCadrM3H > 300) {
    recommendedPurifierClass = "Master Bedroom / Standard Living Room (CADR 300-450 m³/h)";
  }

  return {
    volumeM3,
    volumeCuFt,
    requiredCadrM3H,
    requiredCadrCFM,
    recommendedPurifierClass,
  };
}
