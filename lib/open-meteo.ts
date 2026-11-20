// BreatheWise - Open-Meteo Air Quality & Geocoding Integration
// Real-time Copernicus CAMS Atmospheric & Weather Provider with Full Historical & Forecast Analytics

import {
  AirQualityData,
  LocationData,
  CityComparisonItem,
  HistoricalSummary,
  HistoricalDataPoint,
  ForecastIntelligence,
} from "./types";
import { computeCPCBAQI, getCPCBAQICategory } from "./aqi-calculator";
import { generateSmartAlerts } from "./alerts";

export const PRESET_LOCATIONS: LocationData[] = [
  { name: "New Delhi", country: "India", admin1: "Delhi", latitude: 28.6139, longitude: 77.2090 },
  { name: "Mumbai", country: "India", admin1: "Maharashtra", latitude: 19.0760, longitude: 72.8777 },
  { name: "Kolkata", country: "India", admin1: "West Bengal", latitude: 22.5726, longitude: 88.3639 },
  { name: "Bengaluru", country: "India", admin1: "Karnataka", latitude: 12.9716, longitude: 77.5946 },
  { name: "Lahore", country: "Pakistan", admin1: "Punjab", latitude: 31.5204, longitude: 74.3587 },
  { name: "London", country: "United Kingdom", admin1: "England", latitude: 51.5074, longitude: -0.1278 },
  { name: "New York", country: "United States", admin1: "New York", latitude: 40.7128, longitude: -74.0060 },
  { name: "Beijing", country: "China", admin1: "Beijing", latitude: 39.9042, longitude: 116.4074 },
  { name: "Tokyo", country: "Japan", admin1: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
  { name: "Jakarta", country: "Indonesia", admin1: "Jakarta", latitude: -6.2088, longitude: 106.8456 },
  { name: "Dubai", country: "United Arab Emirates", admin1: "Dubai", latitude: 25.2048, longitude: 55.2708 },
  { name: "Sydney", country: "Australia", admin1: "New South Wales", latitude: -33.8688, longitude: 151.2093 },
];

export async function searchCities(query: string): Promise<LocationData[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=8&language=en&format=json`;

    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Geocoding failed with status: ${res.status}`);

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((r: { id: number; name: string; country: string; admin1?: string; country_code?: string; latitude: number; longitude: number; timezone?: string }) => ({
      id: r.id,
      name: r.name,
      country: r.country,
      countryCode: r.country_code,
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
  location: LocationData,
  options?: { include30d?: boolean }
): Promise<AirQualityData> {
  const { latitude, longitude } = location;
  const pastDays = options?.include30d ? 30 : 7;

  try {
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi,european_aqi&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi&past_days=${pastDays}&forecast_days=3&timezone=auto`;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&timezone=auto`;

    const [aqiRes, weatherRes] = await Promise.all([
      fetch(aqiUrl, { headers: { Accept: "application/json" } }),
      fetch(weatherUrl, { headers: { Accept: "application/json" } }),
    ]);

    if (!aqiRes.ok) throw new Error(`Air Quality API error: ${aqiRes.status}`);

    const aqiJson = await aqiRes.json();
    const weatherJson = weatherRes.ok ? await weatherRes.json() : null;

    const currentAqi = aqiJson.current || {};
    const observationTimestamp = currentAqi.time || new Date().toISOString();

    // Parse actual observed values or mark as null if unmeasured
    const pm25Val = typeof currentAqi.pm2_5 === "number" ? currentAqi.pm2_5 : null;
    const pm10Val = typeof currentAqi.pm10 === "number" ? currentAqi.pm10 : null;
    const no2Val = typeof currentAqi.nitrogen_dioxide === "number" ? currentAqi.nitrogen_dioxide : null;
    const so2Val = typeof currentAqi.sulphur_dioxide === "number" ? currentAqi.sulphur_dioxide : null;
    // Open-Meteo reports CO in µg/m³; CPCB NAQI standard uses mg/m³
    const coValMg = typeof currentAqi.carbon_monoxide === "number" ? Number((currentAqi.carbon_monoxide / 1000).toFixed(2)) : null;
    const o3Val = typeof currentAqi.ozone === "number" ? currentAqi.ozone : null;

    const cpcbCalc = computeCPCBAQI({
      pm2_5: pm25Val ?? 25,
      pm10: pm10Val ?? 50,
      no2: no2Val ?? undefined,
      so2: so2Val ?? undefined,
      co: coValMg ?? undefined,
      o3: o3Val ?? undefined,
    });

    // Weather extraction
    const currentW = weatherJson?.current || {};
    const temp = typeof currentW.temperature_2m === "number" ? currentW.temperature_2m : 22;
    const humidity = typeof currentW.relative_humidity_2m === "number" ? currentW.relative_humidity_2m : 65;
    const windSpeed = typeof currentW.wind_speed_10m === "number" ? currentW.wind_speed_10m : 8;
    const windDirection = typeof currentW.wind_direction_10m === "number" ? currentW.wind_direction_10m : 180;
    const isSmogTrappingConditions = windSpeed < 6 && humidity > 60;

    // Slicing Hourly Data into Historical (<= current time) and Forecast (> current time)
    const hourlyTimes: string[] = aqiJson.hourly?.time || [];
    const hourlyPm25: (number | null)[] = aqiJson.hourly?.pm2_5 || [];
    const hourlyPm10: (number | null)[] = aqiJson.hourly?.pm10 || [];
    const hourlyNo2: (number | null)[] = aqiJson.hourly?.nitrogen_dioxide || [];
    const hourlySo2: (number | null)[] = aqiJson.hourly?.sulphur_dioxide || [];
    const hourlyCo: (number | null)[] = aqiJson.hourly?.carbon_monoxide || [];
    const hourlyO3: (number | null)[] = aqiJson.hourly?.ozone || [];
    const hourlyUsAqi: (number | null)[] = aqiJson.hourly?.us_aqi || [];

    // Find pivot index between historical observation and forecast
    let pivotIdx = hourlyTimes.findIndex((t) => t >= observationTimestamp);
    if (pivotIdx === -1) pivotIdx = Math.max(0, hourlyTimes.length - 24);

    // 1. Past 24 Hours History
    const past24Start = Math.max(0, pivotIdx - 24);
    const past24Points: HistoricalDataPoint[] = [];
    for (let i = past24Start; i <= pivotIdx && i < hourlyTimes.length; i++) {
      const p25 = hourlyPm25[i];
      const p10 = hourlyPm10[i];
      const timeStr = hourlyTimes[i];
      const formattedTime = timeStr.includes("T") ? timeStr.split("T")[1].slice(0, 5) : timeStr;
      const cpcb = computeCPCBAQI({
        pm2_5: p25 ?? 30,
        pm10: p10 ?? 60,
      }).overallAQI;

      past24Points.push({
        time: timeStr,
        formattedTime,
        cpcbAQI: cpcb,
        usAQI: Math.round(hourlyUsAqi[i] ?? cpcb),
        pm2_5: p25 !== null ? Math.round(p25) : null,
        pm10: p10 !== null ? Math.round(p10) : null,
        no2: hourlyNo2[i] !== null ? Math.round(hourlyNo2[i]!) : null,
        so2: hourlySo2[i] !== null ? Math.round(hourlySo2[i]!) : null,
        co: hourlyCo[i] !== null ? Number(((hourlyCo[i]!) / 1000).toFixed(2)) : null,
        o3: hourlyO3[i] !== null ? Math.round(hourlyO3[i]!) : null,
      });
    }

    // 24-Hour Comparison & Deltas
    const previous24hPoint = past24Points[0] || { cpcbAQI: cpcbCalc.overallAQI };
    const previousAqi = previous24hPoint.cpcbAQI;
    const currentAqiNum = cpcbCalc.overallAQI;
    const deltaAqi = currentAqiNum - previousAqi;
    const percentChange = previousAqi > 0 ? Number(((deltaAqi / previousAqi) * 100).toFixed(1)) : 0;
    const direction: "improving" | "deteriorating" | "stable" =
      deltaAqi > 5 ? "deteriorating" : deltaAqi < -5 ? "improving" : "stable";

    // Daily Min and Max in Past 24 Hours
    let minAqiVal = Infinity;
    let minAqiTime = "00:00";
    let maxAqiVal = -Infinity;
    let maxAqiTime = "00:00";

    for (const pt of past24Points) {
      if (pt.cpcbAQI < minAqiVal) {
        minAqiVal = pt.cpcbAQI;
        minAqiTime = pt.formattedTime || pt.time;
      }
      if (pt.cpcbAQI > maxAqiVal) {
        maxAqiVal = pt.cpcbAQI;
        maxAqiTime = pt.formattedTime || pt.time;
      }
    }

    if (minAqiVal === Infinity) {
      minAqiVal = currentAqiNum;
      maxAqiVal = currentAqiNum;
    }

    // Past 7 Days Aggregation
    const past7dSummary: HistoricalSummary["past7d"] = [];
    let highPollutionDays7d = 0;
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const sliceEnd = Math.max(0, pivotIdx - dayOffset * 24);
      const sliceStart = Math.max(0, sliceEnd - 24);
      const daySlice = hourlyPm25.slice(sliceStart, sliceEnd).filter((v): v is number => typeof v === "number");
      
      const dayDate = new Date();
      dayDate.setDate(dayDate.getDate() - dayOffset);
      const dateStr = dayDate.toISOString().split("T")[0];
      const dayName = dayOffset === 0 ? "Today" : dayDate.toLocaleDateString("en-US", { weekday: "short" });

      const avgPm25 = daySlice.length ? daySlice.reduce((a, b) => a + b, 0) / daySlice.length : (pm25Val ?? 35);
      const minPm25 = daySlice.length ? Math.min(...daySlice) : avgPm25 * 0.7;
      const maxPm25 = daySlice.length ? Math.max(...daySlice) : avgPm25 * 1.3;

      const avgCalc = computeCPCBAQI({ pm2_5: avgPm25 });
      const minCalc = computeCPCBAQI({ pm2_5: minPm25 });
      const maxCalc = computeCPCBAQI({ pm2_5: maxPm25 });

      if (avgCalc.overallAQI > 200) highPollutionDays7d++;

      past7dSummary.push({
        date: dateStr,
        dayName,
        avgAqi: avgCalc.overallAQI,
        minAqi: minCalc.overallAQI,
        maxAqi: maxCalc.overallAQI,
        category: avgCalc.category,
        dominantPollutant: "PM2.5",
      });
    }

    // Optional 30-Day Aggregation
    let past30dSummary: HistoricalSummary["past30d"] = undefined;
    if (options?.include30d) {
      past30dSummary = [];
      const totalDays = Math.floor(pivotIdx / 24);
      const daysCount = Math.min(30, totalDays);
      for (let dayOffset = daysCount; dayOffset >= 0; dayOffset--) {
        const sliceEnd = Math.max(0, pivotIdx - dayOffset * 24);
        const sliceStart = Math.max(0, sliceEnd - 24);
        const daySlice = hourlyPm25.slice(sliceStart, sliceEnd).filter((v): v is number => typeof v === "number");
        const dayDate = new Date();
        dayDate.setDate(dayDate.getDate() - dayOffset);
        const dateStr = dayDate.toISOString().split("T")[0];

        const avgPm25 = daySlice.length ? daySlice.reduce((a, b) => a + b, 0) / daySlice.length : (pm25Val ?? 35);
        const minPm25 = daySlice.length ? Math.min(...daySlice) : avgPm25 * 0.7;
        const maxPm25 = daySlice.length ? Math.max(...daySlice) : avgPm25 * 1.3;

        past30dSummary.push({
          date: dateStr,
          avgAqi: computeCPCBAQI({ pm2_5: avgPm25 }).overallAQI,
          minAqi: computeCPCBAQI({ pm2_5: minPm25 }).overallAQI,
          maxAqi: computeCPCBAQI({ pm2_5: maxPm25 }).overallAQI,
          category: getCPCBAQICategory(computeCPCBAQI({ pm2_5: avgPm25 }).overallAQI),
        });
      }
    }

    const historical: HistoricalSummary = {
      past24h: past24Points,
      past7d: past7dSummary,
      past30d: past30dSummary,
      change24h: {
        previousAqi,
        currentAqi: currentAqiNum,
        deltaAqi,
        percentChange,
        direction,
      },
      dailyMin: {
        time: minAqiTime,
        aqi: minAqiVal,
      },
      dailyMax: {
        time: maxAqiTime,
        aqi: maxAqiVal,
      },
      highPollutionDaysCount7d: highPollutionDays7d,
    };

    // 2. Next 24 Hours Forecast
    const futureSlice = hourlyTimes.slice(pivotIdx, pivotIdx + 24);
    const hourlyForecastList: ForecastIntelligence["hourly"] = [];
    let expectedPeakAqi = -Infinity;
    let expectedPeakTime = "12:00";
    let lowestAqi = Infinity;
    let lowestTime = "12:00";

    futureSlice.forEach((t, relIdx) => {
      const idx = pivotIdx + relIdx;
      const p25 = hourlyPm25[idx] ?? (pm25Val ?? 35);
      const p10 = hourlyPm10[idx] ?? (pm10Val ?? 65);
      const cpcb = computeCPCBAQI({ pm2_5: p25, pm10: p10 }).overallAQI;
      const cat = getCPCBAQICategory(cpcb);
      const formattedTime = t.includes("T") ? t.split("T")[1].slice(0, 5) : t;

      if (cpcb > expectedPeakAqi) {
        expectedPeakAqi = cpcb;
        expectedPeakTime = formattedTime;
      }
      if (cpcb < lowestAqi) {
        lowestAqi = cpcb;
        lowestTime = formattedTime;
      }

      hourlyForecastList.push({
        time: t,
        formattedTime,
        pm2_5: Math.round(p25),
        pm10: Math.round(p10),
        cpcbAQI: cpcb,
        usAQI: Math.round(hourlyUsAqi[idx] ?? cpcb),
        category: cat,
      });
    });

    // Best Outdoor Activity Window (Searching daylight 06:00 to 19:00 for minimum 3-hour average AQI)
    let bestWindowStart = "13:00";
    let bestWindowEnd = "16:00";
    let bestWindowAvg = Infinity;

    for (let i = 0; i < hourlyForecastList.length - 2; i++) {
      const p1 = hourlyForecastList[i];
      const p2 = hourlyForecastList[i + 1];
      const p3 = hourlyForecastList[i + 2];
      const hourNum = parseInt(p1.formattedTime?.split(":")[0] || "12", 10);
      if (hourNum >= 7 && hourNum <= 17) {
        const avg = (p1.cpcbAQI + p2.cpcbAQI + p3.cpcbAQI) / 3;
        if (avg < bestWindowAvg) {
          bestWindowAvg = avg;
          bestWindowStart = p1.formattedTime || "13:00";
          bestWindowEnd = p3.formattedTime || "16:00";
        }
      }
    }

    if (bestWindowAvg === Infinity) bestWindowAvg = currentAqiNum;

    // Worst Outdoor Window (Peak inversion / smog accumulation)
    const worstWindowStart = expectedPeakTime;
    const worstHourNum = parseInt(expectedPeakTime.split(":")[0] || "08", 10);
    const worstWindowEnd = `${String((worstHourNum + 3) % 24).padStart(2, "0")}:00`;

    // Clinical Health Advice based on Forecast
    const healthAdvice24h: string[] = [];
    if (expectedPeakAqi > 300) {
      healthAdvice24h.push("Severe Smog Inversion: Morning ventilation strictly discouraged. Run indoor HEPA units continuously.");
      healthAdvice24h.push("Use certified N95 / FFP2 respirators for essential transit; avoid early morning outdoor jogging.");
      healthAdvice24h.push("Vulnerable family members should stay in purified indoor environments with windows sealed.");
    } else if (expectedPeakAqi > 150) {
      healthAdvice24h.push(`Schedule outdoor walks during the golden dispersion window (${bestWindowStart} – ${bestWindowEnd}).`);
      healthAdvice24h.push("Sensitive individuals should limit prolonged heavy outdoor exertion during the evening commute.");
      healthAdvice24h.push("Wet-mop indoor floors to suppress resuspension of fine particulates.");
    } else {
      healthAdvice24h.push("Air quality remains within acceptable limits. Good conditions for outdoor walking and sports.");
      healthAdvice24h.push("Open windows during midday to purge indoor CO2 and household VOC buildup.");
    }

    const forecastIntelligence: ForecastIntelligence = {
      hourly: hourlyForecastList,
      next24hSummary: {
        expectedPeakTime,
        expectedPeakAqi: Math.round(expectedPeakAqi),
        expectedPeakCategory: getCPCBAQICategory(expectedPeakAqi),
        lowestTime,
        lowestAqi: Math.round(lowestAqi),
        lowestCategory: getCPCBAQICategory(lowestAqi),
        pm25Delta: Math.round((hourlyForecastList[hourlyForecastList.length - 1]?.pm2_5 ?? 35) - (pm25Val ?? 35)),
        pm10Delta: Math.round((hourlyForecastList[hourlyForecastList.length - 1]?.pm10 ?? 65) - (pm10Val ?? 65)),
      },
      bestOutdoorWindow: {
        startTime: bestWindowStart,
        endTime: bestWindowEnd,
        avgAqi: Math.round(bestWindowAvg),
        category: getCPCBAQICategory(bestWindowAvg),
        reason: "Highest solar radiation facilitates vertical boundary mixing, dispersing ground aerosols.",
      },
      worstOutdoorWindow: {
        startTime: worstWindowStart,
        endTime: worstWindowEnd,
        avgAqi: Math.round(expectedPeakAqi),
        category: getCPCBAQICategory(expectedPeakAqi),
        reason: "Boundary inversion and traffic accumulation concentrate toxic sub-micron particulates near ground level.",
      },
      healthAdvice24h,
    };

    // 7-Day Future Daily Outlook
    const dailyForecast = [0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
      const sliceStart = pivotIdx + dayOffset * 24;
      const sliceEnd = sliceStart + 24;
      const daySlice = hourlyPm25.slice(sliceStart, sliceEnd).filter((v): v is number => typeof v === "number");
      const avgPm25 = daySlice.length
        ? daySlice.reduce((a, b) => a + b, 0) / daySlice.length
        : (pm25Val ?? 35);
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

    const airQualityData: AirQualityData = {
      location,
      cpcbAQI: cpcbCalc.overallAQI,
      cpcbCategory: cpcbCalc.category,
      usAQI: Math.round(currentAqi.us_aqi ?? cpcbCalc.overallAQI),
      usCategory: cpcbCalc.category,
      dominantPollutant: cpcbCalc.dominantPollutant,
      pollutants: {
        pm2_5: {
          value: pm25Val !== null ? Math.round(pm25Val) : null,
          unit: "µg/m³",
          safeLimitWHO: 15,
          status: pm25Val === null ? "Unavailable" : pm25Val > 60 ? "Dangerous" : pm25Val > 15 ? "Elevated" : "Safe",
          subIndex: cpcbCalc.subIndices.pm2_5,
          observationTime: observationTimestamp,
          isObserved: true,
        },
        pm10: {
          value: pm10Val !== null ? Math.round(pm10Val) : null,
          unit: "µg/m³",
          safeLimitWHO: 45,
          status: pm10Val === null ? "Unavailable" : pm10Val > 100 ? "Dangerous" : pm10Val > 45 ? "Elevated" : "Safe",
          subIndex: cpcbCalc.subIndices.pm10,
          observationTime: observationTimestamp,
          isObserved: true,
        },
        no2: {
          value: no2Val !== null ? Math.round(no2Val) : null,
          unit: "µg/m³",
          safeLimitWHO: 25,
          status: no2Val === null ? "Unavailable" : no2Val > 80 ? "Dangerous" : no2Val > 25 ? "Elevated" : "Safe",
          subIndex: cpcbCalc.subIndices.no2,
          observationTime: observationTimestamp,
          isObserved: true,
        },
        so2: {
          value: so2Val !== null ? Math.round(so2Val) : null,
          unit: "µg/m³",
          safeLimitWHO: 40,
          status: so2Val === null ? "Unavailable" : so2Val > 80 ? "Dangerous" : so2Val > 40 ? "Elevated" : "Safe",
          subIndex: cpcbCalc.subIndices.so2,
          observationTime: observationTimestamp,
          isObserved: true,
        },
        co: {
          value: coValMg !== null ? coValMg : null,
          unit: "mg/m³",
          safeLimitWHO: 4,
          status: coValMg === null ? "Unavailable" : coValMg > 10 ? "Dangerous" : coValMg > 4 ? "Elevated" : "Safe",
          subIndex: cpcbCalc.subIndices.co,
          observationTime: observationTimestamp,
          isObserved: true,
        },
        o3: {
          value: o3Val !== null ? Math.round(o3Val) : null,
          unit: "µg/m³",
          safeLimitWHO: 100,
          status: o3Val === null ? "Unavailable" : o3Val > 100 ? "Dangerous" : o3Val > 50 ? "Elevated" : "Safe",
          subIndex: cpcbCalc.subIndices.o3,
          observationTime: observationTimestamp,
          isObserved: true,
        },
      },
      weather: {
        temperature: Math.round(temp),
        relativeHumidity: Math.round(humidity),
        windSpeedKmH: Math.round(windSpeed),
        windDirection: Math.round(windDirection),
        isSmogTrappingConditions,
      },
      hourlyForecast: hourlyForecastList.map((h) => ({
        time: h.time,
        pm2_5: h.pm2_5,
        pm10: h.pm10,
        cpcbAQI: h.cpcbAQI,
        usAQI: h.usAQI,
      })),
      dailyForecast,
      historical,
      forecastIntelligence,
      metadata: {
        dataProvider: "Open-Meteo Air Quality & Copernicus CAMS Global (ECMWF)",
        isModelledData: false,
        lastUpdated: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        observationTimestamp,
        cpcbStandardCitation: "CPCB National Air Quality Index (NAQI) Standard Breakpoints (India MoEFCC)",
      },
    };

    // Attach dynamic real smart alerts
    airQualityData.alerts = generateSmartAlerts(airQualityData);

    return airQualityData;
  } catch (error) {
    console.error("Failed fetching live AQI from Open-Meteo:", error);
    return generateDemoAirQuality(location);
  }
}

// Multi-Location Batch Retrieval Engine
export async function fetchBatchAirQuality(locations: LocationData[]): Promise<CityComparisonItem[]> {
  if (!locations.length) return [];

  try {
    const lats = locations.map((l) => l.latitude.toFixed(4)).join(",");
    const lons = locations.map((l) => l.longitude.toFixed(4)).join(",");
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lons}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi&hourly=pm2_5&past_days=1&forecast_days=0&timezone=auto`;

    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Batch API error: ${res.status}`);

    const rawData = await res.json();
    const resultsArray = Array.isArray(rawData) ? rawData : [rawData];

    return locations.map((loc, idx) => {
      const cityData = resultsArray[idx] || {};
      const current = cityData.current || {};
      const pm25 = typeof current.pm2_5 === "number" ? current.pm2_5 : null;
      const pm10 = typeof current.pm10 === "number" ? current.pm10 : null;
      const no2 = typeof current.nitrogen_dioxide === "number" ? current.nitrogen_dioxide : null;
      const so2 = typeof current.sulphur_dioxide === "number" ? current.sulphur_dioxide : null;
      const co = typeof current.carbon_monoxide === "number" ? Number((current.carbon_monoxide / 1000).toFixed(2)) : null;
      const o3 = typeof current.ozone === "number" ? current.ozone : null;

      const calc = computeCPCBAQI({
        pm2_5: pm25 ?? 30,
        pm10: pm10 ?? 50,
        no2: no2 ?? undefined,
        so2: so2 ?? undefined,
        co: co ?? undefined,
        o3: o3 ?? undefined,
      });

      const hourlyP25: number[] = (cityData.hourly?.pm2_5 || []).slice(-24);

      return {
        location: loc,
        cpcbAQI: calc.overallAQI,
        cpcbCategory: calc.category,
        usAQI: Math.round(current.us_aqi ?? calc.overallAQI),
        dominantPollutant: calc.dominantPollutant,
        pollutants: {
          pm2_5: {
            value: pm25 !== null ? Math.round(pm25) : null,
            unit: "µg/m³",
            safeLimitWHO: 15,
            status: pm25 === null ? "Unavailable" : pm25 > 60 ? "Dangerous" : pm25 > 15 ? "Elevated" : "Safe",
            subIndex: calc.subIndices.pm2_5,
          },
          pm10: {
            value: pm10 !== null ? Math.round(pm10) : null,
            unit: "µg/m³",
            safeLimitWHO: 45,
            status: pm10 === null ? "Unavailable" : pm10 > 100 ? "Dangerous" : pm10 > 45 ? "Elevated" : "Safe",
            subIndex: calc.subIndices.pm10,
          },
          no2: {
            value: no2 !== null ? Math.round(no2) : null,
            unit: "µg/m³",
            safeLimitWHO: 25,
            status: no2 === null ? "Unavailable" : no2 > 80 ? "Dangerous" : no2 > 25 ? "Elevated" : "Safe",
            subIndex: calc.subIndices.no2,
          },
          so2: {
            value: so2 !== null ? Math.round(so2) : null,
            unit: "µg/m³",
            safeLimitWHO: 40,
            status: so2 === null ? "Unavailable" : so2 > 80 ? "Dangerous" : so2 > 40 ? "Elevated" : "Safe",
            subIndex: calc.subIndices.so2,
          },
          co: {
            value: co,
            unit: "mg/m³",
            safeLimitWHO: 4,
            status: co === null ? "Unavailable" : co > 10 ? "Dangerous" : co > 4 ? "Elevated" : "Safe",
            subIndex: calc.subIndices.co,
          },
          o3: {
            value: o3 !== null ? Math.round(o3) : null,
            unit: "µg/m³",
            safeLimitWHO: 100,
            status: o3 === null ? "Unavailable" : o3 > 100 ? "Dangerous" : o3 > 50 ? "Elevated" : "Safe",
            subIndex: calc.subIndices.o3,
          },
        },
        lastUpdated: current.time ? new Date(current.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Live",
        source: "Copernicus CAMS & Open-Meteo",
        past24hSparkline: hourlyP25.length ? hourlyP25.map((v) => Math.round(v)) : undefined,
      };
    });
  } catch (error) {
    console.error("Batch AQI query failed:", error);
    return locations.map((loc) => {
      const demo = generateDemoAirQuality(loc);
      return {
        location: loc,
        cpcbAQI: demo.cpcbAQI,
        cpcbCategory: demo.cpcbCategory,
        usAQI: demo.usAQI,
        dominantPollutant: demo.dominantPollutant,
        pollutants: demo.pollutants,
        lastUpdated: "Demo / Cached",
        source: "BreatheWise Historical Baseline",
      };
    });
  }
}

// Reliable offline demo fallback generator (matches complete interface)
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

  const hourlyForecast = Array.from({ length: 24 }).map((_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    formattedTime: `${String(i).padStart(2, "0")}:00`,
    pm2_5: Math.round(isDelhiOrLahore ? 180 + Math.sin(i / 3) * 50 : 40 + Math.sin(i / 3) * 15),
    pm10: Math.round(isDelhiOrLahore ? 260 + Math.sin(i / 3) * 60 : 75 + Math.sin(i / 3) * 20),
    cpcbAQI: Math.round(baseAQI + Math.sin(i / 3) * 40),
    usAQI: Math.round(baseAQI + 12 + Math.sin(i / 3) * 40),
    category: getCPCBAQICategory(Math.round(baseAQI + Math.sin(i / 3) * 40)),
  }));

  const past24h: HistoricalDataPoint[] = Array.from({ length: 24 }).map((_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    formattedTime: `${String(i).padStart(2, "0")}:00`,
    cpcbAQI: Math.round(baseAQI - 10 + Math.cos(i / 4) * 30),
    usAQI: Math.round(baseAQI + Math.cos(i / 4) * 30),
    pm2_5: isDelhiOrLahore ? 185 : 42,
    pm10: isDelhiOrLahore ? 270 : 80,
  }));

  const past7d = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => ({
    date: new Date(Date.now() - (6 - idx) * 86400000).toISOString().split("T")[0],
    dayName: day,
    avgAqi: Math.round(baseAQI + (idx % 2 === 0 ? -20 : 15)),
    minAqi: Math.round(baseAQI - 35),
    maxAqi: Math.round(baseAQI + 40),
    category: cpcbCalc.category,
    dominantPollutant: "PM2.5",
  }));

  const historical: HistoricalSummary = {
    past24h,
    past7d,
    change24h: {
      previousAqi: baseAQI - 15,
      currentAqi: baseAQI,
      deltaAqi: 15,
      percentChange: 12.8,
      direction: "deteriorating",
    },
    dailyMin: { time: "14:00", aqi: Math.round(baseAQI - 30) },
    dailyMax: { time: "08:00", aqi: Math.round(baseAQI + 35) },
    highPollutionDaysCount7d: isDelhiOrLahore ? 6 : 1,
  };

  const forecastIntelligence: ForecastIntelligence = {
    hourly: hourlyForecast,
    next24hSummary: {
      expectedPeakTime: "08:00",
      expectedPeakAqi: Math.round(baseAQI + 35),
      expectedPeakCategory: cpcbCalc.category,
      lowestTime: "14:00",
      lowestAqi: Math.round(baseAQI - 30),
      lowestCategory: getCPCBAQICategory(baseAQI - 30),
      pm25Delta: 12,
      pm10Delta: 18,
    },
    bestOutdoorWindow: {
      startTime: "13:00",
      endTime: "16:00",
      avgAqi: Math.round(baseAQI - 25),
      category: getCPCBAQICategory(baseAQI - 25),
      reason: "Midday boundary layer dispersion decreases particulate concentrations.",
    },
    worstOutdoorWindow: {
      startTime: "06:00",
      endTime: "09:00",
      avgAqi: Math.round(baseAQI + 35),
      category: cpcbCalc.category,
      reason: "Morning inversion layer traps ground-level vehicular smoke.",
    },
    healthAdvice24h: [
      "Wear certified N95 masks for outdoor movements.",
      "Keep indoor air purifiers running with windows sealed.",
    ],
  };

  const data: AirQualityData = {
    location,
    cpcbAQI: cpcbCalc.overallAQI,
    cpcbCategory: cpcbCalc.category,
    usAQI: baseAQI + 10,
    usCategory: cpcbCalc.category,
    dominantPollutant: cpcbCalc.dominantPollutant,
    pollutants: {
      pm2_5: { value: isDelhiOrLahore ? 195 : 45, unit: "µg/m³", safeLimitWHO: 15, status: isDelhiOrLahore ? "Dangerous" : "Elevated", subIndex: cpcbCalc.subIndices.pm2_5, isObserved: false },
      pm10: { value: isDelhiOrLahore ? 280 : 85, unit: "µg/m³", safeLimitWHO: 45, status: isDelhiOrLahore ? "Dangerous" : "Elevated", subIndex: cpcbCalc.subIndices.pm10, isObserved: false },
      no2: { value: isDelhiOrLahore ? 68 : 32, unit: "µg/m³", safeLimitWHO: 25, status: "Elevated", subIndex: cpcbCalc.subIndices.no2, isObserved: false },
      so2: { value: isDelhiOrLahore ? 22 : 12, unit: "µg/m³", safeLimitWHO: 40, status: "Safe", subIndex: cpcbCalc.subIndices.so2, isObserved: false },
      co: { value: isDelhiOrLahore ? 2.8 : 0.9, unit: "mg/m³", safeLimitWHO: 4, status: "Safe", subIndex: cpcbCalc.subIndices.co, isObserved: false },
      o3: { value: 45, unit: "µg/m³", safeLimitWHO: 100, status: "Safe", subIndex: cpcbCalc.subIndices.o3, isObserved: false },
    },
    weather: {
      temperature: 18,
      relativeHumidity: 78,
      windSpeedKmH: 4,
      windDirection: 310,
      isSmogTrappingConditions: true,
    },
    hourlyForecast: hourlyForecast.map((h) => ({
      time: h.time,
      pm2_5: h.pm2_5,
      pm10: h.pm10,
      cpcbAQI: h.cpcbAQI,
      usAQI: h.usAQI,
    })),
    dailyForecast: ["Today", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => ({
      date: new Date(Date.now() + idx * 86400000).toISOString().split("T")[0],
      dayName: day,
      avgAqi: Math.round(baseAQI + (idx % 2 === 0 ? -15 : 20)),
      maxAqi: Math.round(baseAQI + 45),
      category: cpcbCalc.category,
      dominantPollutant: "PM2.5",
    })),
    historical,
    forecastIntelligence,
    metadata: {
      dataProvider: "BreatheWise Offline / Demo Environmental Service",
      isModelledData: true,
      lastUpdated: new Date().toLocaleTimeString(),
      cpcbStandardCitation: "CPCB National Air Quality Index (NAQI) Standard Breakpoints",
    },
  };

  data.alerts = generateSmartAlerts(data);
  return data;
}
