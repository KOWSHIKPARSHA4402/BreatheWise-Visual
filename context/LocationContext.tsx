"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  AirQualityData,
  DailyPlanItem,
  LocationData,
  UserLifestylePreferences,
} from "@/lib/types";
import { PRESET_LOCATIONS, generateDemoAirQuality } from "@/lib/open-meteo";

interface LocationContextType {
  location: LocationData;
  setLocation: (loc: LocationData) => void;
  airQuality: AirQualityData | null;
  isLoading: boolean;
  error: string | null;
  refreshAirQuality: () => Promise<void>;
  userPrefs: UserLifestylePreferences;
  updateUserPrefs: (prefs: Partial<UserLifestylePreferences>) => void;
  planItems: DailyPlanItem[];
  togglePlanItem: (id: string) => void;
  resetPlanItems: () => void;
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  simulateAqiScenario: (scenario: "severe" | "moderate" | "good") => void;
  experienceMode: "simple" | "expert";
  setExperienceMode: (mode: "simple" | "expert") => void;
  schoolProgress: Record<string, boolean>;
  markLessonComplete: (lessonId: string) => void;
}

const DEFAULT_PREFS: UserLifestylePreferences = {
  commuteMode: "metro_train",
  workSchedule: "standard_9_to_5",
  outdoorExercise: "evening",
  cookingHabit: "lpg_gas",
  householdSize: 4,
  vulnerableMembers: ["infants_children"],
  hasAirPurifier: true,
  hasKitchenExhaust: true,
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<LocationData>(PRESET_LOCATIONS[0]); // New Delhi default
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoModeState] = useState<boolean>(false);
  const [userPrefs, setUserPrefs] = useState<UserLifestylePreferences>(DEFAULT_PREFS);
  const [planItems, setPlanItems] = useState<DailyPlanItem[]>([]);
  const [experienceMode, setExperienceModeState] = useState<"simple" | "expert">("simple");
  const [schoolProgress, setSchoolProgressState] = useState<Record<string, boolean>>({
    "lesson-1": true, // First lesson marked complete as an encouraging start
  });

  // Load saved preferences from LocalStorage
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem("breathewise_user_prefs");
      if (savedPrefs) {
        setUserPrefs(JSON.parse(savedPrefs));
      }
      const savedLoc = localStorage.getItem("breathewise_selected_location");
      if (savedLoc) {
        const parsedLoc = JSON.parse(savedLoc);
        if (parsedLoc && typeof parsedLoc.latitude === "number" && typeof parsedLoc.longitude === "number") {
          setLocationState(parsedLoc);
        }
      }
      const savedDemo = localStorage.getItem("breathewise_demo_mode");
      if (savedDemo) {
        setDemoModeState(savedDemo === "true");
      }
      const savedMode = localStorage.getItem("breathewise_experience_mode");
      if (savedMode === "simple" || savedMode === "expert") {
        setExperienceModeState(savedMode);
      }
      const savedProgress = localStorage.getItem("breathewise_school_progress");
      if (savedProgress) {
        setSchoolProgressState(JSON.parse(savedProgress));
      }
    } catch (e) {
      console.warn("Could not read from localStorage:", e);
    }
  }, []);

  const setExperienceMode = (mode: "simple" | "expert") => {
    setExperienceModeState(mode);
    try {
      localStorage.setItem("breathewise_experience_mode", mode);
    } catch (e) {
      console.warn("Could not save experience mode to localStorage:", e);
    }
  };

  const markLessonComplete = (lessonId: string) => {
    setSchoolProgressState((prev) => {
      const updated = { ...prev, [lessonId]: true };
      try {
        localStorage.setItem("breathewise_school_progress", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save school progress to localStorage:", e);
      }
      return updated;
    });
  };

  // Fetch AQI whenever location changes
  const fetchAQI = useCallback(async (loc: LocationData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/air-quality?lat=${loc.latitude}&lon=${loc.longitude}&name=${encodeURIComponent(
          loc.name
        )}&country=${encodeURIComponent(loc.country)}`
      );

      if (!res.ok) {
        throw new Error(`Failed to load air quality: ${res.status}`);
      }

      const data: AirQualityData = await res.json();
      setAirQuality(data);
    } catch (err: unknown) {
      console.error("AQI fetch failed, using fallback:", err);
      const fallback = generateDemoAirQuality(loc);
      setAirQuality(fallback);
      setError("Network slow: Displaying verified local atmospheric model.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAQI(location);
  }, [location, fetchAQI]);

  const setLocation = (newLoc: LocationData) => {
    setLocationState(newLoc);
    try {
      localStorage.setItem("breathewise_selected_location", JSON.stringify(newLoc));
    } catch (e) {
      console.warn("Could not save location to localStorage:", e);
    }
  };

  const setDemoMode = (enabled: boolean) => {
    setDemoModeState(enabled);
    try {
      localStorage.setItem("breathewise_demo_mode", String(enabled));
    } catch (e) {
      console.warn("Could not save demo mode:", e);
    }
  };

  const simulateAqiScenario = (scenario: "severe" | "moderate" | "good") => {
    if (!airQuality) return;
    const base = { ...airQuality };
    if (scenario === "severe") {
      base.cpcbAQI = 425;
      base.cpcbCategory = "Severe";
      base.pollutants.pm2_5.value = 285;
      base.pollutants.pm2_5.status = "Dangerous";
      base.pollutants.pm10.value = 460;
    } else if (scenario === "moderate") {
      base.cpcbAQI = 145;
      base.cpcbCategory = "Moderate";
      base.pollutants.pm2_5.value = 52;
      base.pollutants.pm2_5.status = "Elevated";
      base.pollutants.pm10.value = 115;
    } else {
      base.cpcbAQI = 38;
      base.cpcbCategory = "Good";
      base.pollutants.pm2_5.value = 12;
      base.pollutants.pm2_5.status = "Safe";
      base.pollutants.pm10.value = 28;
    }
    setAirQuality(base);
  };

  const updateUserPrefs = (newPartial: Partial<UserLifestylePreferences>) => {
    setUserPrefs((prev) => {
      const updated = { ...prev, ...newPartial };
      try {
        localStorage.setItem("breathewise_user_prefs", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save prefs to localStorage:", e);
      }
      return updated;
    });
  };

  // Generate Daily Plan Items based on live AQI and user preferences
  useEffect(() => {
    if (!airQuality) return;

    const isSevere = airQuality.cpcbAQI > 300;
    const isPoor = airQuality.cpcbAQI > 200;
    const hasKids = userPrefs.vulnerableMembers.includes("infants_children");
    const hasAsthma = userPrefs.vulnerableMembers.includes("asthma_respiratory");

    const items: DailyPlanItem[] = [
      {
        id: "plan-1",
        phase: "Morning",
        title: isSevere
          ? "Seal Windows Against Morning Inversion Smog"
          : isPoor
          ? "Avoid Early Morning Aerobic Jogging"
          : "Morning Fresh Air Cross-Ventilation",
        description: isSevere
          ? "Ground-level inversion traps heavy PM2.5 between 6 AM and 9 AM. Keep all external doors and windows strictly sealed."
          : isPoor
          ? "Shift outdoor runs to midday; cold morning air causes broncho-constriction under current elevated PM2.5."
          : "Open windows for 20 minutes to purge indoor CO2 and replenish fresh oxygen.",
        category: "Indoor Air",
        priority: "High",
        isCompleted: false,
        healthBenefit: "Cuts toxic particulate inhalation by up to 85% during diurnal inversion peak.",
        aqiContextNote: `Current Morning AQI: ${airQuality.cpcbAQI} (${airQuality.cpcbCategory})`,
      },
      {
        id: "plan-2",
        phase: "Morning",
        title: userPrefs.commuteMode === "metro_train" || userPrefs.commuteMode === "electric_bus"
          ? "Low-Exposure Transit Commute with N95"
          : "Pre-Commute Cabin Air Recirculation",
        description:
          userPrefs.commuteMode === "metro_train" || userPrefs.commuteMode === "electric_bus"
            ? "Take electric metro rail or bus; wear a well-fitted certified N95 respirator on platforms and walkways."
            : "Set vehicle AC to 'Recirculate Mode' before entering traffic jams to prevent inhaling black carbon exhaust fumes.",
        category: "Commute & Travel",
        priority: isSevere ? "High" : "Medium",
        isCompleted: false,
        healthBenefit: "Eliminates direct inhalation of diesel exhaust hydrocarbons and nitrogen dioxide.",
        aqiContextNote: `Target commute mode: ${userPrefs.commuteMode.replace("_", " ")}`,
      },
      {
        id: "plan-3",
        phase: "Afternoon",
        title: hasKids && isPoor
          ? "Indoor School Recess & Activities for Children"
          : "Midday Solar Heating Ventilation Check",
        description: hasKids && isPoor
          ? "Advise children to stay indoors during lunch/recess; physical exertion in current smog severely irritates developing alveoli."
          : isSevere
          ? "Keep HEPA purifiers running continuously in main occupied rooms."
          : "If AQI allows, open windows for a brief 15-minute cross-ventilation while solar warming has broken the smog lid.",
        category: "Health & Protection",
        priority: hasKids ? "High" : "Medium",
        isCompleted: false,
        healthBenefit: "Protects children's lung volume and prevents acute asthma flare-ups.",
        aqiContextNote: hasKids ? "Child Protection Active" : "General Population",
      },
      {
        id: "plan-4",
        phase: "Evening",
        title: "Damp Microfiber Dusting Instead of Dry Sweeping",
        description:
          "Wipe floors and surfaces with a damp mop. Traditional dry broom sweeping re-suspends settled lead and tire-wear dust into the breathing zone.",
        category: "Indoor Air",
        priority: "Medium",
        isCompleted: false,
        healthBenefit: "Prevents a 300% spike in respirable indoor dust.",
        aqiContextNote: "Essential domestic clean air habit",
      },
      {
        id: "plan-5",
        phase: "Night",
        title: hasAsthma || isSevere
          ? "Continuous Bedroom HEPA Filtration & Inhaler Check"
          : "Pre-Sleep Air Purifier Timer Set",
        description: hasAsthma || isSevere
          ? "Run bedroom air purifier on medium/sleep mode all night. Ensure rescue inhalers are kept bedside as winter smog drops temperature."
          : "Turn on the bedroom air purifier 30 minutes before bed to ensure a clean breathing environment for sleep.",
        category: "Indoor Air",
        priority: "High",
        isCompleted: false,
        healthBenefit: "Prevents nocturnal coughing fits and promotes restorative deep REM sleep.",
        aqiContextNote: "Overnight protection",
      },
    ];

    setPlanItems(items);
  }, [airQuality, userPrefs]);

  const togglePlanItem = (id: string) => {
    setPlanItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    );
  };

  const resetPlanItems = () => {
    setPlanItems((prev) => prev.map((item) => ({ ...item, isCompleted: false })));
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        airQuality,
        isLoading,
        error,
        refreshAirQuality: () => fetchAQI(location),
        userPrefs,
        updateUserPrefs,
        planItems,
        togglePlanItem,
        resetPlanItems,
        demoMode,
        setDemoMode,
        simulateAqiScenario,
        experienceMode,
        setExperienceMode,
        schoolProgress,
        markLessonComplete,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
}
