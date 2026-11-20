// BreatheWise - Core Type Definitions

export type AQICategory = "Good" | "Satisfactory" | "Moderate" | "Poor" | "Very Poor" | "Severe";
export type AQIScale = "CPCB" | "US_EPA";

export interface LocationData {
  id?: string | number;
  name: string;
  country: string;
  countryCode?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  isCurrentLocation?: boolean;
}

export interface PollutantMeasurement {
  value: number | null;
  unit: string;
  safeLimitWHO?: number;
  status: "Safe" | "Elevated" | "Dangerous" | "Unavailable";
  subIndex?: number | null;
  observationTime?: string;
  isObserved?: boolean;
}

export interface HistoricalDataPoint {
  time: string;
  formattedTime?: string;
  cpcbAQI: number;
  usAQI: number;
  pm2_5: number | null;
  pm10: number | null;
  no2?: number | null;
  so2?: number | null;
  co?: number | null;
  o3?: number | null;
}

export interface HistoricalSummary {
  past24h: HistoricalDataPoint[];
  past7d: Array<{
    date: string;
    dayName: string;
    avgAqi: number;
    minAqi: number;
    maxAqi: number;
    category: AQICategory;
    dominantPollutant: string;
  }>;
  past30d?: Array<{
    date: string;
    avgAqi: number;
    minAqi: number;
    maxAqi: number;
    category: AQICategory;
  }>;
  change24h: {
    previousAqi: number;
    currentAqi: number;
    deltaAqi: number;
    percentChange: number;
    direction: "improving" | "deteriorating" | "stable";
  };
  dailyMin: {
    time: string;
    aqi: number;
  };
  dailyMax: {
    time: string;
    aqi: number;
  };
  highPollutionDaysCount7d: number;
}

export interface ForecastIntelligence {
  hourly: Array<{
    time: string;
    formattedTime?: string;
    pm2_5: number;
    pm10: number;
    cpcbAQI: number;
    usAQI: number;
    category: AQICategory;
  }>;
  next24hSummary: {
    expectedPeakTime: string;
    expectedPeakAqi: number;
    expectedPeakCategory: AQICategory;
    lowestTime: string;
    lowestAqi: number;
    lowestCategory: AQICategory;
    pm25Delta: number;
    pm10Delta: number;
  };
  bestOutdoorWindow: {
    startTime: string;
    endTime: string;
    avgAqi: number;
    category: AQICategory;
    reason: string;
  };
  worstOutdoorWindow: {
    startTime: string;
    endTime: string;
    avgAqi: number;
    category: AQICategory;
    reason: string;
  };
  healthAdvice24h: string[];
}

export interface SmartAlert {
  id: string;
  type: "severe_smog" | "very_poor" | "high_pm25" | "sudden_spike" | "temperature_inversion" | "forecast_deterioration";
  severity: "emergency" | "warning" | "advisory";
  title: string;
  message: string;
  triggerValue: string;
  recommendation: string;
  timestamp: string;
}

export interface CityComparisonItem {
  location: LocationData;
  cpcbAQI: number;
  cpcbCategory: AQICategory;
  usAQI: number;
  dominantPollutant: string;
  pollutants: {
    pm2_5: PollutantMeasurement;
    pm10: PollutantMeasurement;
    no2: PollutantMeasurement;
    so2: PollutantMeasurement;
    co: PollutantMeasurement;
    o3: PollutantMeasurement;
  };
  weather?: {
    temperature: number;
    relativeHumidity: number;
    windSpeedKmH: number;
  };
  lastUpdated: string;
  source: string;
  past24hSparkline?: number[];
}

export interface AirQualityData {
  location: LocationData;
  cpcbAQI: number;
  cpcbCategory: AQICategory;
  usAQI: number;
  usCategory: string;
  dominantPollutant: string;
  pollutants: {
    pm2_5: PollutantMeasurement;
    pm10: PollutantMeasurement;
    no2: PollutantMeasurement;
    so2: PollutantMeasurement;
    co: PollutantMeasurement;
    o3: PollutantMeasurement;
  };
  weather?: {
    temperature: number;
    relativeHumidity: number;
    windSpeedKmH: number;
    windDirection: number;
    isSmogTrappingConditions: boolean; // Calm wind < 5 km/h + high humidity traps winter smog
  };
  hourlyForecast: Array<{
    time: string;
    pm2_5: number;
    pm10: number;
    cpcbAQI: number;
    usAQI: number;
  }>;
  dailyForecast: Array<{
    date: string;
    dayName: string;
    avgAqi: number;
    maxAqi: number;
    category: AQICategory;
    dominantPollutant: string;
  }>;
  historical?: HistoricalSummary;
  forecastIntelligence?: ForecastIntelligence;
  alerts?: SmartAlert[];
  metadata: {
    dataProvider: string;
    stationName?: string;
    isModelledData: boolean;
    lastUpdated: string;
    observationTimestamp?: string;
    cpcbStandardCitation: string;
  };
}

export interface UserLifestylePreferences {
  commuteMode: "metro_train" | "electric_bus" | "petrol_car" | "diesel_car" | "motorcycle" | "bicycle_walk" | "remote_wfh";
  workSchedule: "standard_9_to_5" | "early_morning" | "night_shift" | "flexible";
  outdoorExercise: "morning" | "evening" | "gym_indoor" | "none";
  cookingHabit: "lpg_gas" | "electric_induction" | "biomass_wood" | "unvented";
  householdSize: number;
  vulnerableMembers: Array<"infants_children" | "elderly" | "asthma_respiratory" | "pregnant" | "none">;
  hasAirPurifier: boolean;
  hasKitchenExhaust: boolean;
}

export interface DailyPlanItem {
  id: string;
  phase: "Morning" | "Afternoon" | "Evening" | "Night";
  title: string;
  description: string;
  category: "Health & Protection" | "Commute & Travel" | "Indoor Air" | "Green Habit";
  priority: "High" | "Medium" | "Low";
  isCompleted: boolean;
  healthBenefit: string;
  aqiContextNote: string;
}

export interface StructuredAIGuidance {
  currentSituation: string;
  whatThisMeans: string;
  recommendedActions: string[];
  expectedBenefits: string[];
  importantPrecautions: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  structured?: StructuredAIGuidance;
  timestamp: string;
}

export interface EmissionsInput {
  commuteDistanceKm: number;
  currentVehicle: "petrol_car" | "diesel_car" | "motorcycle" | "hybrid_car" | "electric_car" | "city_bus" | "metro";
  telecommuteDaysPerWeek: number;
  transitTripsPerWeek: number;
  savedErrandTripsPerWeek: number;
  energyActions: {
    ledLighting: boolean;
    solarPanels: boolean;
    efficientHeating: boolean;
    airDryingClothes: boolean;
  };
}

export interface EmissionsResult {
  co2SavedKgDaily: number;
  co2SavedKgMonthly: number;
  co2SavedKgAnnual: number;
  vehicleKmAvoidedMonthly: number;
  treesEquivalentAnnual: number;
  cleanAirPoints: number;
  emissionsFactorUsed: string;
}

export interface IndoorPillarGuide {
  id: string;
  category: "Air Purification" | "Source Control" | "Ventilation Timing" | "Cleaning Strategy" | "Kitchen & Cooking";
  title: string;
  problem: string;
  recommendedAction: string;
  whyItHelps: string;
  expectedBenefit: string;
  estimatedCost: "$" | "$$" | "$$$" | "Free / Habitual";
  hazardWarning?: string;
  dos: string[];
  donts: string[];
}
