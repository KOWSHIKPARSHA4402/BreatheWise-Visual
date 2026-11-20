// BreatheWise - Friendly General-Purpose AI Assistant Server Route
// Secure Gemini handling with server-side API key protection, multi-turn conversation memory & fallback engine

import { NextRequest, NextResponse } from "next/server";
import { askAirQualityAssistant } from "@/lib/gemini";
import { AirQualityData, UserLifestylePreferences } from "@/lib/types";
import { PRESET_LOCATIONS, generateDemoAirQuality } from "@/lib/open-meteo";

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }
    const { message, aqiContext, userPrefs, history } = (body || {}) as {
      message: string;
      aqiContext?: AirQualityData;
      userPrefs?: Partial<UserLifestylePreferences>;
      history?: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Query message is required and cannot be empty." },
        { status: 400 }
      );
    }

    // Provide default fallback environmental context if not supplied by client
    const resolvedAqiContext: AirQualityData =
      aqiContext && aqiContext.location && typeof aqiContext.cpcbAQI === "number"
        ? aqiContext
        : generateDemoAirQuality(PRESET_LOCATIONS[0]);

    const response = await askAirQualityAssistant(
      message.trim(),
      resolvedAqiContext,
      userPrefs,
      history || []
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API route error:", error);
    return NextResponse.json(
      { error: "Failed to process question. Please try again." },
      { status: 500 }
    );
  }
}
