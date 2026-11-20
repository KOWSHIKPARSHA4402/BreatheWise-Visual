// BreatheWise - Smart Pollution Alert Engine
// Grounded strictly in actual retrieved CPCB telemetry, meteorological conditions, and forecast models

import { AirQualityData, SmartAlert } from "./types";

export function generateSmartAlerts(data: AirQualityData): SmartAlert[] {
  const alerts: SmartAlert[] = [];
  const { cpcbAQI, pollutants, weather, historical, forecastIntelligence, location, metadata } = data;
  const nowStr = metadata.lastUpdated || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // 1. Severe Smog Alert (CPCB AQI > 400)
  if (cpcbAQI >= 401) {
    alerts.push({
      id: `alert-severe-${location.name}`,
      type: "severe_smog",
      severity: "emergency",
      title: "Severe Smog Emergency (CPCB AQI > 400)",
      message: `Severe toxic winter smog entrapment detected across ${location.name}. Ambient air affects healthy people and seriously impacts those with existing respiratory conditions.`,
      triggerValue: `CPCB NAQI ${cpcbAQI} (Severe)`,
      recommendation: "Seal all windows and exterior vents immediately. Run indoor true-HEPA air purification continuously. Strictly avoid outdoor physical exertion.",
      timestamp: nowStr,
    });
  }
  // 2. Very Poor Alert (CPCB AQI 301 - 400)
  else if (cpcbAQI >= 301) {
    alerts.push({
      id: `alert-very-poor-${location.name}`,
      type: "very_poor",
      severity: "warning",
      title: "Very Poor Air Quality Warning",
      message: `Prolonged exposure triggers respiratory illness. Fine particulate matter is severely elevated in ${location.name}.`,
      triggerValue: `CPCB NAQI ${cpcbAQI} (Very Poor)`,
      recommendation: "Wear a certified, well-fitted N95/FFP2 respirator for any unavoidable commute. Keep asthmatic inhalers close at hand.",
      timestamp: nowStr,
    });
  }

  // 3. High PM2.5 Particulate Alert (> 60 µg/m³, which is 4x WHO daily limit)
  const pm25Val = pollutants.pm2_5.value;
  if (pm25Val !== null && pm25Val > 60) {
    const timesWho = (pm25Val / 15).toFixed(1);
    alerts.push({
      id: `alert-pm25-${location.name}`,
      type: "high_pm25",
      severity: pm25Val > 120 ? "emergency" : "warning",
      title: `Critical PM2.5 Infiltration Risk (${timesWho}x WHO Limit)`,
      message: `Fine combustion particles (PM2.5) are measured at ${pm25Val} µg/m³. Sub-micron particles penetrate directly into pulmonary alveoli and the bloodstream.`,
      triggerValue: `${pm25Val} µg/m³ PM2.5`,
      recommendation: "Ensure indoor rooms are sealed and air cleaners with mechanical HEPA filters are running to purge fine aerosol deposition.",
      timestamp: nowStr,
    });
  }

  // 4. Sudden AQI Deterioration (Significant jump over 24h history)
  if (
    historical?.change24h &&
    historical.change24h.percentChange >= 20 &&
    historical.change24h.deltaAqi >= 25
  ) {
    alerts.push({
      id: `alert-deterioration-${location.name}`,
      type: "sudden_spike",
      severity: "warning",
      title: `Rapid AQI Deterioration (+${Math.round(historical.change24h.percentChange)}% in 24h)`,
      message: `Air pollution in ${location.name} deteriorated sharply by +${historical.change24h.deltaAqi} AQI points compared to 24 hours ago.`,
      triggerValue: `+${historical.change24h.deltaAqi} pts (${historical.change24h.previousAqi} → ${historical.change24h.currentAqi})`,
      recommendation: "Shift all outdoor physical workouts indoors; boundary layer inversion is concentrating ground emissions.",
      timestamp: nowStr,
    });
  }

  // 5. Atmospheric Thermal Inversion Alert
  if (weather?.isSmogTrappingConditions) {
    alerts.push({
      id: `alert-inversion-${location.name}`,
      type: "temperature_inversion",
      severity: "advisory",
      title: "Meteorological Smog Inversion Layer Active",
      message: `Calm surface winds (${weather.windSpeedKmH} km/h) combined with high atmospheric humidity (${weather.relativeHumidity}%) prevent vertical convective mixing.`,
      triggerValue: `Wind: ${weather.windSpeedKmH} km/h, Humidity: ${weather.relativeHumidity}%`,
      recommendation: "Avoid early morning natural cross-ventilation as stagnant toxic particulates accumulate at ground level.",
      timestamp: nowStr,
    });
  }

  // 6. Unhealthy Forecast Peak Spike
  if (
    forecastIntelligence?.next24hSummary &&
    forecastIntelligence.next24hSummary.expectedPeakAqi > 250 &&
    forecastIntelligence.next24hSummary.expectedPeakAqi > cpcbAQI + 30
  ) {
    alerts.push({
      id: `alert-forecast-spike-${location.name}`,
      type: "forecast_deterioration",
      severity: "advisory",
      title: `Forecasted Smog Spike around ${forecastIntelligence.next24hSummary.expectedPeakTime}`,
      message: `Atmospheric simulation models project AQI will peak at ${forecastIntelligence.next24hSummary.expectedPeakAqi} (${forecastIntelligence.next24hSummary.expectedPeakCategory}). Recommended clean air window is ${forecastIntelligence.bestOutdoorWindow.startTime} – ${forecastIntelligence.bestOutdoorWindow.endTime}.`,
      triggerValue: `Projected Peak: AQI ${forecastIntelligence.next24hSummary.expectedPeakAqi}`,
      recommendation: "Schedule essential outdoor errands during the recommended midday dispersion window.",
      timestamp: nowStr,
    });
  }

  // Deduplicate by alert type
  const seenTypes = new Set<string>();
  const uniqueAlerts: SmartAlert[] = [];
  for (const a of alerts) {
    if (!seenTypes.has(a.type)) {
      seenTypes.add(a.type);
      uniqueAlerts.push(a);
    }
  }

  return uniqueAlerts;
}
