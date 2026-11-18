// BreatheWise - AI Assistant Server Route
// Secure Gemini handling with server-side API key protection and fallback engine

import { NextRequest, NextResponse } from "next/server";
import { askAirQualityAssistant } from "@/lib/gemini";
import { AirQualityData, UserLifestylePreferences } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, aqiContext, userPrefs, history } = body as {
      message: string;
      aqiContext: AirQualityData;
      userPrefs?: Partial<UserLifestylePreferences>;
      history?: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Query message is required and cannot be empty." },
        { status: 400 }
      );
    }

    if (!aqiContext || !aqiContext.location || typeof aqiContext.cpcbAQI !== "number") {
      return NextResponse.json(
        { error: "Valid aqiContext is required for environmental grounding." },
        { status: 400 }
      );
    }

    const response = await askAirQualityAssistant(
      message.trim(),
      aqiContext,
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
