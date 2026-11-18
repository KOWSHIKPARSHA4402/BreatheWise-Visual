// BreatheWise - Open-Meteo Air Quality & Geocoding Integration
// Real-time Copernicus CAMS Atmospheric & Weather Provider

import { AirQualityData, LocationData } from "./types";
import { computeCPCBAQI } from "./aqi-calculator";

export const PRESET_LOCATIONS: LocationData[] = [
  { name: "New Delhi", country: "India", admin1: "Delhi", latitude: 28.6139, longitude: 77.2090 },
  { name: "Mumbai", country: "India", admin1: "Maharashtra", latitude: 19.0760, longitude: 72.8777 },
  { name: "Kolkata", country: "India", admin1: "West Bengal", latitude: 22.5726, longitude: 88.3639 },
  { name: "Bengaluru", country: "India", admin1: "Karnataka", latitude: 12.9716, longitude: 77.5946 },
  { name: "Lahore", country: "Pakistan", admin1: "Punjab", latitude: 31.5204, longitude: 74.3587 },
  { name: "London", country: "United Kingdom", admin1: "England", latitude: 51.5074, longitude: -0.1278 },
  { name: "New York", country: "United States", admin1: "New York", latitude: 40.7128, longitude: -74.0060 },
];

export async function searchCities(query: string): Promise<LocationData[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=6&language=en&format=json`;

    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`Geocoding failed with status: ${res.status}`);

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((r: { id: number; name: string; country: string; admin1?: string; latitude: number; longitude: number; timezone?: string }) => ({
      id: r.id,
      name: r.name,
      country: r.country,
      admin1: r.admin1,
      latitude: r.latitude,
      longitude: r.longitude,
      timezone: r.timezone,
    }));
  } catch (err) {
    console.warn("Geocoding API network issue, falling back to preset matches:", err);
    return PRESET_LOCATIONS.filter((loc) =>
      loc.name.toLowerCase().includes(query.toLowerCase()) ||
      loc.country.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export async function fetchLiveAirQuality(
  location: LocationData
): Promise<AirQualityData> {
  const { latitude, longitude } = location;

  try {
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi,european_aqi&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi&timezone=auto&forecast_days=7`;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&timezone=auto`;

    const [aqiRes, weatherRes] = await Promise.all([
      fetch(aqiUrl, { headers: { Accept: "application/json" } }),
      fetch(weatherUrl, { headers: { Accept: "application/json" } }),
    ]);

    if (!aqiRes.ok) throw new Error(`Air Quality API error: ${aqiRes.status}`);

    const aqiJson = await aqiRes.json();
    const weatherJson = weatherRes.ok ? await weatherRes.json() : null;

    const currentAqi = aqiJson.current || {};
    const pm25Val = currentAqi.pm2_5 ?? 35;
    const pm10Val = currentAqi.pm10 ?? 65;
    const no2Val = currentAqi.nitrogen_dioxide ?? 28;
    const so2Val = currentAqi.sulphur_dioxide ?? 12;
    // Open-Meteo reports CO in µg/m³; CPCB uses mg/m³ (1 mg/m³ = 1000 µg/m³)
    const coRawUg = currentAqi.carbon_monoxide ?? 450;
    const coValMg = Number((coRawUg / 1000).toFixed(2));
    const o3Val = currentAqi.ozone ?? 38;

    const cpcbCalc = computeCPCBAQI({
      pm2_5: pm25Val,
      pm10: pm10Val,
      no2: no2Val,
      so2: so2Val,
      co: coValMg,
      o3: o3Val,
    });

    // Weather extraction
    const currentW = weatherJson?.current || {};
    const temp = currentW.temperature_2m ?? 22;
    const humidity = currentW.relative_humidity_2m ?? 65;
    const windSpeed = currentW.wind_speed_10m ?? 8;
    const windDirection = currentW.wind_direction_10m ?? 180;
    const isSmogTrappingConditions = windSpeed < 6 && humidity > 60;

    // Hourly Forecast (24 hours)
    const hourlyTimes: string[] = aqiJson.hourly?.time || [];
    const hourlyPm25: number[] = aqiJson.hourly?.pm2_5 || [];
    const hourlyPm10: number[] = aqiJson.hourly?.pm10 || [];
    const hourlyUsAqi: number[] = aqiJson.hourly?.us_aqi || [];

    const hourlyForecast = hourlyTimes.slice(0, 24).map((t, idx) => {
      const p25 = hourlyPm25[idx] ?? pm25Val;
      const p10 = hourlyPm10[idx] ?? pm10Val;
      const cpcb = computeCPCBAQI({ pm2_5: p25, pm10: p10 }).overallAQI;
      return {
        time: t,
        pm2_5: Math.round(p25),
        pm10: Math.round(p10),
        cpcbAQI: cpcb,
        usAQI: Math.round(hourlyUsAqi[idx] ?? cpcb),
      };
    });

    // Daily Forecast (7 days aggregation)
    const dailyForecast = [0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
      const sliceStart = dayOffset * 24;
      const sliceEnd = sliceStart + 24;
      const daySlice = hourlyPm25.slice(sliceStart, sliceEnd);
      const avgPm25 = daySlice.length
        ? daySlice.reduce((a, b) => a + b, 0) / daySlice.length
        : pm25Val;
      const dayDate = new Date();
      dayDate.setDate(dayDate.getDate() + dayOffset);

      const dayCalc = computeCPCBAQI({ pm2_5: avgPm25 });
      return {
        date: dayDate.toISOString().split("T")[0],
        dayName: dayOffset === 0 ? "Today" : dayDate.toLocaleDateString("en-US", { weekday: "short" }),
        avgAqi: dayCalc.overallAQI,
        maxAqi: Math.round(dayCalc.overallAQI * 1.2),
        category: dayCalc.category,
        dominantPollutant: "PM2.5",
      };
    });

    return {
      location,
      cpcbAQI: cpcbCalc.overallAQI,
      cpcbCategory: cpcbCalc.category,
      usAQI: Math.round(currentAqi.us_aqi ?? cpcbCalc.overallAQI),
      usCategory: cpcbCalc.category,
      dominantPollutant: cpcbCalc.dominantPollutant,
      pollutants: {
        pm2_5: {
          value: Math.round(pm25Val),
          unit: "µg/m³",
          safeLimitWHO: 15,
          status: pm25Val > 60 ? "Dangerous" : pm25Val > 15 ? "Elevated" : "Safe",
          subIndex: cpcbCalc.subIndices.pm2_5,
        },
        pm10: {
          value: Math.round(pm10Val),
          unit: "µg/m³",
          safeLimitWHO: 45,
          status: pm10Val > 100 ? "Dangerous" : pm10Val > 45 ? "Elevated" : "Safe",
          subIndex: cpcbCalc.subIndices.pm10,
        },
        no2: {
          value: Math.round(no2Val),
          unit: "µg/m³",
          safeLimitWHO: 25,
          status: no2Val > 80 ? "Dangerous" : no2Val > 25 ? "Elevated" : "Safe",
          subIndex: cpcbCalc.subIndices.no2,
        },
        so2: {
          value: Math.round(so2Val),
          unit: "µg/m³",
          safeLimitWHO: 40,
          status: so2Val > 80 ? "Dangerous" : so2Val > 40 ? "Elevated" : "Safe",
          subIndex: cpcbCalc.subIndices.so2,
        },
        co: {
          value: coValMg,
          unit: "mg/m³",
          safeLimitWHO: 4,
          status: coValMg > 10 ? "Dangerous" : coValMg > 4 ? "Elevated" : "Safe",
          subIndex: cpcbCalc.subIndices.co,
        },
        o3: {
          value: Math.round(o3Val),
          unit: "µg/m³",
          safeLimitWHO: 100,
          status: o3Val > 100 ? "Dangerous" : o3Val > 50 ? "Elevated" : "Safe",
          subIndex: cpcbCalc.subIndices.o3,
        },
      },
      weather: {
        temperature: Math.round(temp),
        relativeHumidity: Math.round(humidity),
        windSpeedKmH: Math.round(windSpeed),
        windDirection: Math.round(windDirection),
        isSmogTrappingConditions,
      },
      hourlyForecast,
      dailyForecast,
      metadata: {
        dataProvider: "Open-Meteo Air Quality & Copernicus CAMS Global",
        isModelledData: true,
        lastUpdated: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        cpcbStandardCitation: "CPCB National Air Quality Index (NAQI) Standard Breakpoints (India MoEFCC)",
      },
    };
  } catch (error) {
    console.error("Failed fetching live AQI from Open-Meteo:", error);
    // Return reliable, documented realistic demo data
    return generateDemoAirQuality(location);
  }
}

export function generateDemoAirQuality(location: LocationData): AirQualityData {
  const isDelhiOrLahore = ["delhi", "lahore"].some((c) =>
    location.name.toLowerCase().includes(c)
  );
  const baseAQI = isDelhiOrLahore ? 342 : 118;
  const cpcbCalc = computeCPCBAQI({
    pm2_5: isDelhiOrLahore ? 195 : 45,
    pm10: isDelhiOrLahore ? 280 : 85,
    no2: isDelhiOrLahore ? 68 : 32,
    so2: isDelhiOrLahore ? 22 : 12,
    co: isDelhiOrLahore ? 2.8 : 0.9,
    o3: 45,
  });

  return {
    location,
    cpcbAQI: cpcbCalc.overallAQI,
    cpcbCategory: cpcbCalc.category,
    usAQI: baseAQI + 10,
    usCategory: cpcbCalc.category,
    dominantPollutant: cpcbCalc.dominantPollutant,
    pollutants: {
      pm2_5: { value: isDelhiOrLahore ? 195 : 45, unit: "µg/m³", safeLimitWHO: 15, status: isDelhiOrLahore ? "Dangerous" : "Elevated", subIndex: cpcbCalc.subIndices.pm2_5 },
      pm10: { value: isDelhiOrLahore ? 280 : 85, unit: "µg/m³", safeLimitWHO: 45, status: isDelhiOrLahore ? "Dangerous" : "Elevated", subIndex: cpcbCalc.subIndices.pm10 },
      no2: { value: isDelhiOrLahore ? 68 : 32, unit: "µg/m³", safeLimitWHO: 25, status: "Elevated", subIndex: cpcbCalc.subIndices.no2 },
      so2: { value: isDelhiOrLahore ? 22 : 12, unit: "µg/m³", safeLimitWHO: 40, status: "Safe", subIndex: cpcbCalc.subIndices.so2 },
      co: { value: isDelhiOrLahore ? 2.8 : 0.9, unit: "mg/m³", safeLimitWHO: 4, status: "Safe", subIndex: cpcbCalc.subIndices.co },
      o3: { value: 45, unit: "µg/m³", safeLimitWHO: 100, status: "Safe", subIndex: cpcbCalc.subIndices.o3 },
    },
    weather: {
      temperature: 18,
      relativeHumidity: 78,
      windSpeedKmH: 4,
      windDirection: 310,
      isSmogTrappingConditions: true,
    },
    hourlyForecast: Array.from({ length: 24 }).map((_, i) => ({
      time: `${String(i).padStart(2, "0")}:00`,
      pm2_5: Math.round(isDelhiOrLahore ? 180 + Math.sin(i / 3) * 50 : 40 + Math.sin(i / 3) * 15),
      pm10: Math.round(isDelhiOrLahore ? 260 + Math.sin(i / 3) * 60 : 75 + Math.sin(i / 3) * 20),
      cpcbAQI: Math.round(baseAQI + Math.sin(i / 3) * 40),
      usAQI: Math.round(baseAQI + 12 + Math.sin(i / 3) * 40),
    })),
    dailyForecast: ["Today", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => ({
      date: new Date(Date.now() + idx * 86400000).toISOString().split("T")[0],
      dayName: day,
      avgAqi: Math.round(baseAQI + (idx % 2 === 0 ? -15 : 20)),
      maxAqi: Math.round(baseAQI + 45),
      category: cpcbCalc.category,
      dominantPollutant: "PM2.5",
    })),
    metadata: {
      dataProvider: "BreatheWise Offline / Demo Environmental Service",
      isModelledData: true,
      lastUpdated: new Date().toLocaleTimeString(),
      cpcbStandardCitation: "CPCB National Air Quality Index (NAQI) Standard Breakpoints",
    },
  };
}
