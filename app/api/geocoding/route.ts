// BreatheWise - Geocoding API Route

import { NextRequest, NextResponse } from "next/server";
import { searchCities, PRESET_LOCATIONS } from "@/lib/open-meteo";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json(PRESET_LOCATIONS);
  }

  try {
    const results = await searchCities(q);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Geocoding route error:", error);
    return NextResponse.json(PRESET_LOCATIONS);
  }
}
