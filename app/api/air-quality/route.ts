// BreatheWise - Air Quality API Route
// Caching, verification, and fallback protection

import { NextRequest, NextResponse } from "next/server";
import { fetchLiveAirQuality, generateDemoAirQuality, PRESET_LOCATIONS } from "@/lib/open-meteo";
import { LocationData } from "@/lib/types";

// In-memory server cache (10 minute TTL)
const cache = new Map<string, { data: unknown; expiresAt: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get("lat");
  const lonStr = searchParams.get("lon");
  const name = searchParams.get("name") || "New Delhi";
  const country = searchParams.get("country") || "India";

  const latitude = latStr ? parseFloat(latStr) : PRESET_LOCATIONS[0].latitude;
  const longitude = lonStr ? parseFloat(lonStr) : PRESET_LOCATIONS[0].longitude;

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: "Invalid latitude or longitude parameters" },
      { status: 400 }
    );
  }

  const include30d = searchParams.get("history30d") === "true";

  const cacheKey = `${latitude.toFixed(3)},${longitude.toFixed(3)}${include30d ? ":30d" : ""}`;
  const cached = cache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data, {
      headers: {
        "X-Cache": "HIT",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
      },
    });
  }

  const location: LocationData = {
    name,
    country,
    latitude,
    longitude,
  };

  try {
    const data = await fetchLiveAirQuality(location, { include30d });
    cache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });

    return NextResponse.json(data, {
      headers: {
        "X-Cache": "MISS",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("API route error, falling back to verified demo data:", error);
    const demoData = generateDemoAirQuality(location);
    return NextResponse.json(demoData, {
      headers: { "X-Cache": "FALLBACK" },
    });
  }
}
