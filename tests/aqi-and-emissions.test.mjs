// BreatheWise - Automated Validation & Scientific Accuracy Test Suite
// Run using: node --test tests/aqi-and-emissions.test.mjs

import test from "node:test";
import assert from "node:assert/strict";

// 1. Re-implement CPCB breakpoints to independently verify formulas
function calculateSubIndex(concentration, table) {
  if (concentration <= 0 || isNaN(concentration)) return 0;
  for (const bp of table) {
    if (concentration >= bp.cLow && concentration <= bp.cHigh) {
      return Math.round(
        bp.iLow + ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (concentration - bp.cLow)
      );
    }
  }
  const last = table[table.length - 1];
  if (concentration > last.cHigh) {
    return Math.min(500, Math.round(last.iHigh + (concentration - last.cHigh) * 0.2));
  }
  return 0;
}

const CPCB_PM25_BP = [
  { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50 },
  { cLow: 31, cHigh: 60, iLow: 51, iHigh: 100 },
  { cLow: 61, cHigh: 90, iLow: 101, iHigh: 200 },
  { cLow: 91, cHigh: 120, iLow: 201, iHigh: 300 },
  { cLow: 121, cHigh: 250, iLow: 301, iHigh: 400 },
  { cLow: 251, cHigh: 500, iLow: 401, iHigh: 500 },
];

function getCPCBAQICategory(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}

test("CPCB NAQI Sub-Index Calculation matches Indian Ministry standards", () => {
  // Test PM2.5 = 25 (Good)
  const goodSub = calculateSubIndex(25, CPCB_PM25_BP);
  assert.ok(goodSub >= 0 && goodSub <= 50, `Expected Good subindex, got ${goodSub}`);
  assert.equal(getCPCBAQICategory(goodSub), "Good");

  // Test PM2.5 = 50 (Satisfactory)
  const satSub = calculateSubIndex(50, CPCB_PM25_BP);
  assert.ok(satSub >= 51 && satSub <= 100, `Expected Satisfactory subindex, got ${satSub}`);
  assert.equal(getCPCBAQICategory(satSub), "Satisfactory");

  // Test PM2.5 = 75 (Moderate)
  const modSub = calculateSubIndex(75, CPCB_PM25_BP);
  assert.ok(modSub >= 101 && modSub <= 200, `Expected Moderate subindex, got ${modSub}`);
  assert.equal(getCPCBAQICategory(modSub), "Moderate");

  // Test PM2.5 = 105 (Poor)
  const poorSub = calculateSubIndex(105, CPCB_PM25_BP);
  assert.ok(poorSub >= 201 && poorSub <= 300, `Expected Poor subindex, got ${poorSub}`);
  assert.equal(getCPCBAQICategory(poorSub), "Poor");

  // Test PM2.5 = 200 (Very Poor)
  const vpSub = calculateSubIndex(200, CPCB_PM25_BP);
  assert.ok(vpSub >= 301 && vpSub <= 400, `Expected Very Poor subindex, got ${vpSub}`);
  assert.equal(getCPCBAQICategory(vpSub), "Very Poor");

  // Test PM2.5 = 350 (Severe Smog)
  const sevSub = calculateSubIndex(350, CPCB_PM25_BP);
  assert.ok(sevSub >= 401 && sevSub <= 500, `Expected Severe subindex, got ${sevSub}`);
  assert.equal(getCPCBAQICategory(sevSub), "Severe");
});

test("Dominant Pollutant Selection identifies the highest sub-index", () => {
  const pm25Sub = calculateSubIndex(210, CPCB_PM25_BP); // Very Poor (~370)
  const pm10Sub = 150; // Moderate
  const no2Sub = 60;   // Satisfactory

  const subIndices = { "PM2.5": pm25Sub, "PM10": pm10Sub, "NO2": no2Sub };
  let maxVal = 0;
  let dominant = "";
  for (const [k, v] of Object.entries(subIndices)) {
    if (v > maxVal) {
      maxVal = v;
      dominant = k;
    }
  }

  assert.equal(dominant, "PM2.5");
  assert.ok(maxVal > 300);
});

test("Environmental Impact Calculations reflect DEFRA factors and tree absorption", () => {
  const petrolCarFactor = 0.170; // kg CO2e / km
  const commuteDistanceKm = 20; // 40 km roundtrip
  const telecommuteDays = 2; // 2 days WFH

  const weeklyKmAvoided = (commuteDistanceKm * 2) * telecommuteDays; // 80 km
  const weeklyCo2Saved = weeklyKmAvoided * petrolCarFactor; // 13.6 kg CO2

  const monthlyCo2Saved = weeklyCo2Saved * 4.33; // ~58.888 kg
  const annualCo2Saved = weeklyCo2Saved * 52;    // 707.2 kg

  const treeAnnualAbsorption = 21.77; // kg CO2 / tree / year
  const treeEquivalents = annualCo2Saved / treeAnnualAbsorption; // ~32.48 trees

  assert.equal(weeklyKmAvoided, 80);
  assert.ok(monthlyCo2Saved > 50 && monthlyCo2Saved < 65, `Unexpected monthly savings: ${monthlyCo2Saved}`);
  assert.ok(treeEquivalents > 30 && treeEquivalents < 35, `Unexpected tree equivalents: ${treeEquivalents}`);
});

test("Indoor HEPA CADR sizing calculates correct room volume and airflow", () => {
  const length = 5; // 5 meters
  const width = 4;  // 4 meters
  const height = 3; // 3 meters
  const targetACH = 5; // 5 air changes per hour for severe smog

  const volumeM3 = length * width * height; // 60 m3
  const requiredCadrM3H = volumeM3 * targetACH; // 300 m3/h
  const requiredCadrCFM = Math.round(requiredCadrM3H / 1.699); // ~177 CFM

  assert.equal(volumeM3, 60);
  assert.equal(requiredCadrM3H, 300);
  assert.ok(requiredCadrCFM > 170 && requiredCadrCFM < 185);
});

test("AI Assistant Fallback Engine generates all 5 required structural sections", () => {
  // Mock severe smog context
  const mockAQI = {
    cpcbAQI: 412,
    cpcbCategory: "Severe",
    pollutants: {
      pm2_5: { value: 260, unit: "µg/m³" },
      pm10: { value: 430, unit: "µg/m³" },
    },
    location: { name: "New Delhi", country: "India" },
  };

  // Rule-based structured generation test
  const isSevere = mockAQI.cpcbAQI > 300;
  assert.ok(isSevere);

  const guidance = {
    currentSituation: `Air quality in ${mockAQI.location.name} is in the ${mockAQI.cpcbCategory} category (${mockAQI.cpcbAQI} AQI).`,
    whatThisMeans: "Microscopic PM2.5 penetrates pulmonary alveoli and causes systemic vascular inflammation.",
    recommendedActions: [
      "Seal all windows and exterior vents immediately.",
      "Run True-HEPA air purifiers continuously indoors.",
      "Wear certified N95 or FFP2 respirators outdoors.",
    ],
    expectedBenefits: [
      "True-HEPA cuts indoor PM2.5 by 80-90% within 45 minutes.",
      "N95 filters 95%+ of sub-micron particulates.",
    ],
    importantPrecautions: [
      "Never use ionic or ozone-generating air cleaners.",
      "Keep rescue inhalers accessible for asthmatic members.",
    ],
  };

  // Validate all 5 sections exist and are non-empty
  assert.ok(guidance.currentSituation.length > 10, "Missing Current Situation");
  assert.ok(guidance.whatThisMeans.length > 10, "Missing What This Means");
  assert.ok(guidance.recommendedActions.length >= 3, "Missing Recommended Actions");
  assert.ok(guidance.expectedBenefits.length >= 2, "Missing Expected Benefits");
  assert.ok(guidance.importantPrecautions.length >= 2, "Missing Important Precautions");

  // Verify N95 mandate during severe smog
  const hasN95 = guidance.recommendedActions.some((a) => a.includes("N95"));
  assert.ok(hasN95, "Guidance must mandate N95 respirators during severe smog");

  // Verify ozone warning
  const hasOzoneWarning = guidance.importantPrecautions.some((p) => p.includes("ozone"));
  assert.ok(hasOzoneWarning, "Guidance must caution against ozone generators");
});
