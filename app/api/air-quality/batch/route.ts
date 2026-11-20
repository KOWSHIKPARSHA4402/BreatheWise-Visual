// BreatheWise - Multi-Location Batch Air Quality Intelligence API Route
// Efficient single-query retrieval with in-memory caching and Copernicus CAMS grounding

import { NextRequest, NextResponse } from "next/server";
import { fetchBatchAirQuality, PRESET_LOCATIONS } from "@/lib/open-meteo";
import { LocationData, CityComparisonItem } from "@/lib/types";

// In-memory cache for batch queries (10 minute TTL)
const batchCache = new Map<string, { data: CityComparisonItem[]; expiresAt: number }>();
const BATCH_CACHE_TTL_MS = 10 * 60 * 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const citiesParam = searchParams.get("cities");

  let locationsToFetch: LocationData[] = PRESET_LOCATIONS;

  if (citiesParam) {
    try {
      const parsed = JSON.parse(citiesParam);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const valid = parsed.filter(
          (l) => typeof l?.latitude === "number" && typeof l?.longitude === "number"
        );
        if (valid.length > 0) {
          locationsToFetch = valid;
        }
      }
    } catch {
      locationsToFetch = PRESET_LOCATIONS;
    }
  }

  const cacheKey = locationsToFetch
    .map((l) => `${(l.latitude ?? 0).toFixed(2)},${(l.longitude ?? 0).toFixed(2)}`)
    .sort()
    .join("|");
  const cached = batchCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data, {
      headers: {
        "X-Cache": "HIT",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
      },
    });
  }

  try {
    const data = await fetchBatchAirQuality(locationsToFetch);
    batchCache.set(cacheKey, { data, expiresAt: Date.now() + BATCH_CACHE_TTL_MS });

    return NextResponse.json(data, {
      headers: {
        "X-Cache": "MISS",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
      },
    });
  } catch (err) {
    console.error("Batch air quality API failed:", err);
    return NextResponse.json(
      { error: "Failed to load batch air quality telemetry" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const rawLocations = body?.locations;
    const locations: LocationData[] = Array.isArray(rawLocations)
      ? rawLocations.filter((l: LocationData) => typeof l?.latitude === "number" && typeof l?.longitude === "number")
      : PRESET_LOCATIONS;

    if (!locations.length) {
      return NextResponse.json({ error: "locations array with valid coordinates is required" }, { status: 400 });
    }

    const cacheKey = locations
      .map((l) => `${(l.latitude ?? 0).toFixed(2)},${(l.longitude ?? 0).toFixed(2)}`)
      .sort()
      .join("|");
    const cached = batchCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json(cached.data, {
        headers: { "X-Cache": "HIT" },
      });
    }

    const data = await fetchBatchAirQuality(locations);
    batchCache.set(cacheKey, { data, expiresAt: Date.now() + BATCH_CACHE_TTL_MS });

    return NextResponse.json(data, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (err) {
    console.error("Batch POST API failed:", err);
    return NextResponse.json(
      { error: "Failed to process batch air quality request" },
      { status: 500 }
    );
  }
}
