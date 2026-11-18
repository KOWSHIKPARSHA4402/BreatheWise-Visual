// BreatheWise - Scientifically Defensible Environmental Impact Calculator
// Sources: DEFRA 2023 GHG Conversion Factors & India MoRTH/CPCB Urban Emissions Baselines

import { EmissionsInput, EmissionsResult } from "./types";

export const VEHICLE_EMISSION_FACTORS: Record<string, { factorKgPerKm: number; label: string }> = {
  petrol_car: { factorKgPerKm: 0.170, label: "Petrol Car (Average 1.4-2.0L)" },
  diesel_car: { factorKgPerKm: 0.171, label: "Diesel Car (Average)" },
  motorcycle: { factorKgPerKm: 0.103, label: "Two-Wheeler / Motorbike" },
  hybrid_car: { factorKgPerKm: 0.105, label: "Hybrid Vehicle" },
  electric_car: { factorKgPerKm: 0.053, label: "Electric Vehicle (Average Grid Mix)" },
  city_bus: { factorKgPerKm: 0.082, label: "City Bus (Per Passenger-km)" },
  metro: { factorKgPerKm: 0.035, label: "Electric Metro / Urban Rail" },
};

// Tree absorption constant: 1 mature tree absorbs ~21.77 kg CO2/year (Arbor Day / US EPA)
export const CO2_KG_PER_TREE_ANNUAL = 21.77;

export function calculateEmissionsSavings(input: EmissionsInput): EmissionsResult {
  const roundTripKm = Math.max(0, input.commuteDistanceKm * 2);
  const baselineVehicle = VEHICLE_EMISSION_FACTORS[input.currentVehicle] || VEHICLE_EMISSION_FACTORS.petrol_car;
  const baselineFactor = baselineVehicle.factorKgPerKm;

  // 1. Savings from Telecommuting / Remote Days
  const telecommuteDays = Math.min(7, Math.max(0, input.telecommuteDaysPerWeek));
  const weeklyWfhKm = roundTripKm * telecommuteDays;
  const weeklyWfhCo2Kg = weeklyWfhKm * baselineFactor;

  // 2. Savings from Switching Car/Bike to Public Transit (Metro/Bus)
  const transitTrips = Math.min(14, Math.max(0, input.transitTripsPerWeek)); // each trip is one-way
  const avgTransitFactor = 0.058; // Average of Bus (0.082) & Metro (0.035)
  const weeklyTransitKm = input.commuteDistanceKm * transitTrips;
  const weeklyTransitCo2Kg = weeklyTransitKm * Math.max(0, baselineFactor - avgTransitFactor);

  // 3. Saved Errand Trips (combining trips / walking)
  const errandTrips = Math.min(10, Math.max(0, input.savedErrandTripsPerWeek));
  const weeklyErrandKm = errandTrips * 4; // average 4km roundtrip errand
  const weeklyErrandCo2Kg = weeklyErrandKm * baselineFactor;

  // 4. Household Energy Actions (Weekly CO2 reductions)
  let weeklyEnergyCo2Kg = 0;
  if (input.energyActions.ledLighting) weeklyEnergyCo2Kg += 1.8;      // Replacing incandescent with LEDs
  if (input.energyActions.efficientHeating) weeklyEnergyCo2Kg += 3.5; // Lowering thermostat/clean heating
  if (input.energyActions.airDryingClothes) weeklyEnergyCo2Kg += 2.4; // Air-drying clothes instead of tumble dryer
  if (input.energyActions.solarPanels) weeklyEnergyCo2Kg += 8.5;      // Rooftop solar offset

  const totalWeeklyCo2Kg = weeklyWfhCo2Kg + weeklyTransitCo2Kg + weeklyErrandCo2Kg + weeklyEnergyCo2Kg;
  const totalWeeklyKm = weeklyWfhKm + weeklyTransitKm + weeklyErrandKm;

  const dailyCo2Kg = Number((totalWeeklyCo2Kg / 7).toFixed(2));
  const monthlyCo2Kg = Number((totalWeeklyCo2Kg * 4.33).toFixed(1));
  const annualCo2Kg = Number((totalWeeklyCo2Kg * 52).toFixed(1));
  const monthlyKmAvoided = Math.round(totalWeeklyKm * 4.33);
  const treesEquivalent = Number((annualCo2Kg / CO2_KG_PER_TREE_ANNUAL).toFixed(1));

  // Clean Air Gamification Points (10 points per kg CO2 saved)
  const cleanAirPoints = Math.round(monthlyCo2Kg * 10);

  return {
    co2SavedKgDaily: dailyCo2Kg,
    co2SavedKgMonthly: monthlyCo2Kg,
    co2SavedKgAnnual: annualCo2Kg,
    vehicleKmAvoidedMonthly: monthlyKmAvoided,
    treesEquivalentAnnual: treesEquivalent,
    cleanAirPoints,
    emissionsFactorUsed: `${baselineVehicle.label} (${baselineFactor} kg CO2e/km)`,
  };
}
