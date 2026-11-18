// BreatheWise - Google Gemini GenAI Assistant Integration
// Server-Side Context Injection, Prompt Engineering & Fallback Rule Engine

import { GoogleGenerativeAI } from "@google/generative-ai";
import { AirQualityData, StructuredAIGuidance, UserLifestylePreferences } from "./types";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function askAirQualityAssistant(
  userQuery: string,
  aqiContext: AirQualityData,
  userPrefs?: Partial<UserLifestylePreferences>,
  chatHistory: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<{ text: string; structured: StructuredAIGuidance; isFallback: boolean }> {
  // If API key is present, invoke Google Gemini 1.5 Flash (or Pro)
  if (genAI && apiKey.trim().length > 10) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.3, // factual, disciplined recommendations
          maxOutputTokens: 1200,
        },
      });

      const systemPrompt = `You are BreatheWise, an expert urban air quality intelligence assistant and environmental physician advisor.
You are helping families navigate severe winter smog and urban air pollution.

CURRENT LIVE ENVIRONMENTAL CONTEXT:
- Location: ${aqiContext.location.name}, ${aqiContext.location.country}
- CPCB Indian AQI: ${aqiContext.cpcbAQI} (${aqiContext.cpcbCategory})
- US EPA AQI: ${aqiContext.usAQI}
- Dominant Pollutant: ${aqiContext.dominantPollutant}
- PM2.5: ${aqiContext.pollutants.pm2_5.value} µg/m³ (WHO 24h Safe Limit: 15 µg/m³)
- PM10: ${aqiContext.pollutants.pm10.value} µg/m³ (WHO Safe Limit: 45 µg/m³)
- Weather: ${aqiContext.weather?.temperature ?? 20}°C, Humidity: ${aqiContext.weather?.relativeHumidity ?? 60}%, Wind: ${aqiContext.weather?.windSpeedKmH ?? 5} km/h
- Winter Smog Inversion: ${aqiContext.weather?.isSmogTrappingConditions ? "YES - Calm winds and high humidity are trapping pollutants near ground level" : "Normal dispersion"}

USER LIFESTYLE CONTEXT:
- Commute: ${userPrefs?.commuteMode || "Standard urban commute"}
- Vulnerable Household Members: ${userPrefs?.vulnerableMembers?.join(", ") || "General public"}
- Has HEPA Air Purifier: ${userPrefs?.hasAirPurifier ? "Yes" : "No / Unspecified"}

RESPONSE FORMAT REQUIREMENT:
You MUST respond with a concise, empathetic overview followed strictly by JSON block or clear markdown formatted with these 5 EXACT sections:
1. Current Situation
2. What This Means
3. Recommended Actions (bullet points)
4. Expected Benefits (bullet points)
5. Important Precautions (bullet points)

SAFETY RULES:
- Never fabricate AQI numbers or medical statistics.
- Provide general public health guidance, not personal medical diagnoses.
- Emphasize N95/FFP2 masks over surgical/cloth masks when AQI is Poor, Very Poor, or Severe.
- Explain diurnal smog patterns (e.g. why morning exercise should be shifted to afternoon during winter inversions).`;

      const historyContext = chatHistory.length
        ? `\n\nRECENT CHAT HISTORY:\n${chatHistory.map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.content.slice(0, 200)}`).join("\n")}`
        : "";

      const prompt = `${systemPrompt}${historyContext}\n\nUser Question: "${userQuery}"`;
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const parsed = parseStructuredGuidance(responseText, aqiContext);
      return {
        text: responseText,
        structured: parsed,
        isFallback: false,
      };
    } catch (err) {
      console.warn("Gemini API call failed, invoking intelligent local rule engine:", err);
      // Fall through to fallback engine
    }
  }

  // Resilient Local Environmental Intelligence Fallback Engine
  const fallback = generateIntelligentFallback(userQuery, aqiContext, userPrefs);
  return {
    text: formatFallbackAsMarkdown(fallback),
    structured: fallback,
    isFallback: true,
  };
}

function parseStructuredGuidance(rawText: string, aqi: AirQualityData): StructuredAIGuidance {
  const getSection = (headingRegex: RegExp, nextHeadingRegex: RegExp): string => {
    const match = rawText.match(headingRegex);
    if (!match || match.index === undefined) return "";
    const start = match.index + match[0].length;
    const rest = rawText.slice(start);
    const nextMatch = rest.match(nextHeadingRegex);
    const end = nextMatch && nextMatch.index !== undefined ? nextMatch.index : rest.length;
    return rest.slice(0, end).trim();
  };

  const sit = getSection(/1\.\s*Current Situation|###\s*Current Situation/i, /2\.\s*What This Means|###\s*What This Means/i);
  const means = getSection(/2\.\s*What This Means|###\s*What This Means/i, /3\.\s*Recommended Actions|###\s*Recommended Actions/i);
  const act = getSection(/3\.\s*Recommended Actions|###\s*Recommended Actions/i, /4\.\s*Expected Benefits|###\s*Expected Benefits/i);
  const ben = getSection(/4\.\s*Expected Benefits|###\s*Expected Benefits/i, /5\.\s*Important Precautions|###\s*Important Precautions/i);
  const prec = getSection(/5\.\s*Important Precautions|###\s*Important Precautions/i, /$/i);

  const toBullets = (str: string): string[] =>
    str
      .split("\n")
      .map((l) => l.replace(/^[-*•\d.]+\s*/, "").trim())
      .filter((l) => l.length > 5);

  if (sit && means) {
    return {
      currentSituation: sit,
      whatThisMeans: means,
      recommendedActions: toBullets(act).length ? toBullets(act) : ["Wear a well-fitted N95 mask outdoors.", "Keep windows sealed during peak smog hours."],
      expectedBenefits: toBullets(ben).length ? toBullets(ben) : ["Significantly reduced inhalable particle load.", "Decreased acute airway inflammation."],
      importantPrecautions: toBullets(prec).length ? toBullets(prec) : ["Never exercise strenuously outdoors under current smog levels."],
    };
  }

  return generateIntelligentFallback("General Guidance", aqi);
}

export function generateIntelligentFallback(
  query: string,
  aqiContext: AirQualityData,
  userPrefs?: Partial<UserLifestylePreferences>
): StructuredAIGuidance {
  const { cpcbAQI, cpcbCategory, pollutants, location, weather } = aqiContext;
  const pm25 = pollutants.pm2_5.value;
  const isSevereOrVeryPoor = cpcbAQI > 300;
  const hasKidsOrElderly = userPrefs?.vulnerableMembers?.some((m) => m === "infants_children" || m === "elderly");
  const hasAsthma = userPrefs?.vulnerableMembers?.includes("asthma_respiratory");

  if (isSevereOrVeryPoor) {
    return {
      currentSituation: `Air quality in ${location.name} is currently in the ${cpcbCategory.toUpperCase()} category with a CPCB AQI of ${cpcbAQI}. The primary pollutant is PM2.5 at ${pm25} µg/m³, which is ${(pm25 / 15).toFixed(1)} times higher than the WHO 24-hour safe threshold (15 µg/m³). Atmospheric conditions (${weather?.temperature ?? 18}°C, calm winds) indicate severe ground-level winter smog entrapment.`,
      whatThisMeans: `Microscopic particulate matter (PM2.5) bypasses upper nasal defenses, penetrates deep into pulmonary alveoli, and enters the bloodstream. Under these smog conditions, even brief unprotected outdoor exposure causes throat irritation, burning eyes, and respiratory stress. ${hasKidsOrElderly || hasAsthma ? "Vulnerable household members (children, seniors, and asthmatic individuals) are at acute risk of bronchospasms and reduced lung capacity." : "Prolonged exposure affects even healthy adults."}`,
      recommendedActions: [
        "Seal all windows and exterior vents immediately; do not perform morning cross-ventilation.",
        "Run an indoor true-HEPA air purifier continuously in bedrooms and main living spaces.",
        "Wear a certified, well-fitted N95 or FFP2 respirator for any unavoidable outdoor movement (cloth and surgical masks offer negligible sub-micron PM2.5 protection).",
        "Postpone all outdoor jogging, cycling, and sports activities; switch to indoor yoga or light stretching.",
        "Use kitchen exhaust range hoods while cooking and strictly avoid incense, mosquito coils, or indoor frying.",
      ],
      expectedBenefits: [
        "A true-HEPA filter running in a sealed room reduces indoor PM2.5 concentrations by up to 80-90% within 45 minutes.",
        "Wearing a tightly fitted N95 mask filters at least 95% of airborne particulates down to 0.3 microns, preventing alveolar deposition.",
        "Avoiding early morning outdoor exertion prevents hyperventilation that would otherwise draw 5x higher volumes of toxic winter smog deep into the lungs.",
      ],
      importantPrecautions: [
        "Never use ionic or ozone-generating air cleaners; ozone is a severe lung irritant that exacerbates asthma.",
        "Keep prescribed inhalers and bronchodilators within arm's reach if anyone in the home has asthma or COPD.",
        "Seek immediate medical attention if someone experiences persistent chest tightness, severe wheezing, or shortness of breath.",
      ],
    };
  }

  if (cpcbAQI > 100) {
    return {
      currentSituation: `Air quality in ${location.name} is in the ${cpcbCategory} category (CPCB AQI: ${cpcbAQI}), with PM2.5 at ${pm25} µg/m³ (WHO safe threshold: 15 µg/m³). Conditions are elevated and warrant precautionary adjustments.`,
      whatThisMeans: `Air quality is acceptable for healthy individuals during normal daily routines, but sensitive groups (infants, elderly, and individuals with respiratory conditions) may experience mild coughing, throat irritation, or shortness of breath during prolonged outdoor exertion.`,
      recommendedActions: [
        "Shift outdoor exercise to the afternoon hours (1:00 PM – 4:00 PM) when solar radiation has broken morning temperature inversion layers.",
        "Sensitive individuals should wear an N95 mask when commuting along heavy traffic corridors.",
        "Wet-mop indoor floors with a damp microfiber cloth instead of dry broom sweeping to avoid re-suspending settled dust.",
        "Prefer metro rail or electric buses for daily commuting to reduce personal exposure to vehicular exhaust.",
      ],
      expectedBenefits: [
        "Timing outdoor movement with afternoon dispersion cuts particulate exposure by 30-50% compared to early morning smog.",
        "Wet cleaning keeps settled toxic particulates out of the breathing zone.",
        "Using public transit reduces individual carbon emissions by 60-80% compared to solo car driving.",
      ],
      importantPrecautions: [
        "Monitor children during school sports; recommend moving activities indoors if outdoor haze intensifies.",
        "Ensure air purifier pre-filters and HEPA cartridges are cleaned/replaced according to manufacturer schedules.",
      ],
    };
  }

  return {
    currentSituation: `Air quality in ${location.name} is in the ${cpcbCategory} category (CPCB AQI: ${cpcbAQI}). PM2.5 is at ${pm25} µg/m³, which meets national ambient standards.`,
    whatThisMeans: `Air pollution poses little or no risk to human health today. Outdoor air is clean and suitable for all age groups and physical activities.`,
    recommendedActions: [
      "Open windows and thoroughly ventilate the home to purge indoor volatile organic compounds (VOCs) and stale CO2.",
      "Enjoy outdoor walking, jogging, and recreational sports freely.",
      "Consider walking or cycling for short neighborhood errands to maintain clean air in your community.",
    ],
    expectedBenefits: [
      "Fresh air ventilation reduces indoor humidity, mold spores, and household carbon dioxide buildup.",
      "Active commuting supports cardiovascular health while generating zero tailpipe emissions.",
    ],
    importantPrecautions: [
      "Continue basic household clean-air habits: use kitchen exhaust while cooking and avoid burning garden waste.",
    ],
  };
}

function formatFallbackAsMarkdown(g: StructuredAIGuidance): string {
  return `### 1. Current Situation
${g.currentSituation}

### 2. What This Means
${g.whatThisMeans}

### 3. Recommended Actions
${g.recommendedActions.map((a) => `- ${a}`).join("\n")}

### 4. Expected Benefits
${g.expectedBenefits.map((b) => `- ${b}`).join("\n")}

### 5. Important Precautions
${g.importantPrecautions.map((p) => `- ${p}`).join("\n")}`;
}
