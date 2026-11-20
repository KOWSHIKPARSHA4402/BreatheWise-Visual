"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Plus, Minus, RotateCcw, Info, ExternalLink, Wind, Droplets, Thermometer, Search, Globe2, Sparkles } from "lucide-react";
import { LocationData, AirQualityData, CityComparisonItem } from "@/lib/types";
import { searchCities } from "@/lib/open-meteo";

// Worldwide air quality hotspot pins
export interface GlobeCityPin {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  lat: number;
  lng: number;
  aqi: number;
  category: "Good" | "Satisfactory" | "Moderate" | "Poor" | "Very Poor" | "Severe";
  dominantPollutant: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  riskPercent: number;
  weatherCondition: string;
}

export const WORLD_CITIES: GlobeCityPin[] = [
  {
    id: "delhi",
    name: "New Delhi",
    country: "India",
    countryCode: "IND",
    flag: "🇮🇳",
    lat: 28.6139,
    lng: 77.209,
    aqi: 174,
    category: "Moderate",
    dominantPollutant: "PM2.5",
    temp: 23,
    humidity: 62,
    windSpeed: 8.4,
    riskPercent: 48,
    weatherCondition: "Winter Smog & Inversion",
  },
  {
    id: "jakarta",
    name: "Jakarta",
    country: "Indonesia",
    countryCode: "IDN",
    flag: "🇮🇩",
    lat: -6.2088,
    lng: 106.8456,
    aqi: 78,
    category: "Satisfactory",
    dominantPollutant: "PM2.5",
    temp: 34,
    humidity: 56,
    windSpeed: 13.2,
    riskPercent: 35,
    weatherCondition: "Tropical haze & vehicular flow",
  },
  {
    id: "beijing",
    name: "Beijing",
    country: "China",
    countryCode: "CHN",
    flag: "🇨🇳",
    lat: 39.9042,
    lng: 116.4074,
    aqi: 155,
    category: "Moderate",
    dominantPollutant: "PM10",
    temp: 11,
    humidity: 45,
    windSpeed: 15.0,
    riskPercent: 42,
    weatherCondition: "Dust transport & stagnant boundary",
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    countryCode: "ARE",
    flag: "🇦🇪",
    lat: 25.2048,
    lng: 55.2708,
    aqi: 112,
    category: "Moderate",
    dominantPollutant: "PM10",
    temp: 31,
    humidity: 48,
    windSpeed: 18.5,
    riskPercent: 30,
    weatherCondition: "Desert particulate suspension",
  },
  {
    id: "cairo",
    name: "Cairo",
    country: "Egypt",
    countryCode: "EGY",
    flag: "🇪🇬",
    lat: 30.0444,
    lng: 31.2357,
    aqi: 132,
    category: "Moderate",
    dominantPollutant: "PM2.5",
    temp: 26,
    humidity: 52,
    windSpeed: 11.0,
    riskPercent: 38,
    weatherCondition: "Urban emission & Saharan haze",
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    countryCode: "GBR",
    flag: "🇬🇧",
    lat: 51.5074,
    lng: -0.1278,
    aqi: 32,
    category: "Good",
    dominantPollutant: "NO2",
    temp: 14,
    humidity: 78,
    windSpeed: 16.2,
    riskPercent: 12,
    weatherCondition: "Maritime dispersion & westerly winds",
  },
  {
    id: "newyork",
    name: "New York",
    country: "United States",
    countryCode: "USA",
    flag: "🇺🇸",
    lat: 40.7128,
    lng: -74.006,
    aqi: 45,
    category: "Good",
    dominantPollutant: "O3",
    temp: 18,
    humidity: 58,
    windSpeed: 14.5,
    riskPercent: 15,
    weatherCondition: "Coastal ventilation",
  },
  {
    id: "johannesburg",
    name: "Johannesburg",
    country: "South Africa",
    countryCode: "ZAF",
    flag: "🇿🇦",
    lat: -26.2041,
    lng: 28.0473,
    aqi: 90,
    category: "Satisfactory",
    dominantPollutant: "PM2.5",
    temp: 22,
    humidity: 50,
    windSpeed: 12.0,
    riskPercent: 25,
    weatherCondition: "Highveld boundary layer",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    countryCode: "JPN",
    flag: "🇯🇵",
    lat: 35.6762,
    lng: 139.6503,
    aqi: 35,
    category: "Good",
    dominantPollutant: "PM2.5",
    temp: 19,
    humidity: 60,
    windSpeed: 10.5,
    riskPercent: 10,
    weatherCondition: "Pacific maritime clearance",
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    countryCode: "AUS",
    flag: "🇦🇺",
    lat: -33.8688,
    lng: 151.2093,
    aqi: 24,
    category: "Good",
    dominantPollutant: "O3",
    temp: 24,
    humidity: 64,
    windSpeed: 17.0,
    riskPercent: 8,
    weatherCondition: "Clean ocean breeze",
  },
];

interface EarthGlobe3DProps {
  selectedCity?: GlobeCityPin;
  onSelectCity?: (city: GlobeCityPin) => void;
  activeLocation?: LocationData;
  airQuality?: AirQualityData | null;
  onViewDetails?: () => void;
  onExplainCity?: (city: GlobeCityPin) => void;
}

export default function EarthGlobe3D({
  selectedCity,
  onSelectCity,
  activeLocation,
  airQuality,
  onViewDetails,
  onExplainCity,
}: EarthGlobe3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [citiesList, setCitiesList] = useState<GlobeCityPin[]>(WORLD_CITIES);
  const citiesRef = useRef<GlobeCityPin[]>(WORLD_CITIES);
  const [internalSelectedCity, setInternalSelectedCity] = useState<GlobeCityPin>(
    selectedCity || WORLD_CITIES[1] // Default to Jakarta
  );
  const [hoveredCity, setHoveredCity] = useState<GlobeCityPin | null>(null);
  const [projectedPins, setProjectedPins] = useState<
    { city: GlobeCityPin; x: number; y: number; visible: boolean }[]
  >([]);
  const [webGlAvailable, setWebGlAvailable] = useState<boolean>(true);

  // Search state for globe
  const [globeSearchQuery, setGlobeSearchQuery] = useState("");
  const [globeSearchResults, setGlobeSearchResults] = useState<LocationData[]>([]);
  const [isGlobeSearching, setIsGlobeSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync citiesRef when citiesList changes
  useEffect(() => {
    citiesRef.current = citiesList;
  }, [citiesList]);

  // Fetch live batch telemetry on mount to update pins with real-time CPCB measurements
  useEffect(() => {
    let isMounted = true;
    const fetchLivePins = async () => {
      try {
        const locationsToQuery: LocationData[] = WORLD_CITIES.map((c) => ({
          name: c.name,
          country: c.country,
          latitude: c.lat,
          longitude: c.lng,
        }));

        const res = await fetch("/api/air-quality/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locations: locationsToQuery }),
        });

        if (!res.ok) return;
        const liveItems: CityComparisonItem[] = await res.json();
        if (!isMounted || !Array.isArray(liveItems)) return;

        setCitiesList((prev) =>
          prev.map((orig) => {
            const match = liveItems.find(
              (d) => d.location.name.toLowerCase() === orig.name.toLowerCase()
            );
            if (!match) return orig;

            return {
              ...orig,
              aqi: match.cpcbAQI,
              category: match.cpcbCategory,
              dominantPollutant: match.dominantPollutant,
              temp: match.weather?.temperature ?? orig.temp,
              humidity: match.weather?.relativeHumidity ?? orig.humidity,
              windSpeed: match.weather?.windSpeedKmH ?? orig.windSpeed,
            };
          })
        );
      } catch (err) {
        console.warn("Could not sync live globe pins:", err);
      }
    };

    fetchLivePins();
    return () => {
      isMounted = false;
    };
  }, []);

  // Search Cities on Globe handler
  useEffect(() => {
    if (!globeSearchQuery.trim() || globeSearchQuery.length < 2) {
      setGlobeSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsGlobeSearching(true);
      try {
        const results = await searchCities(globeSearchQuery);
        setGlobeSearchResults(results);
        setIsSearchOpen(true);
      } catch (err) {
        console.warn("Globe city search failed:", err);
      } finally {
        setIsGlobeSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [globeSearchQuery]);

  // Three.js instances stored in refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.2, y: -1.8 });
  const isDraggingRef = useRef<boolean>(false);
  const autoRotateRef = useRef<boolean>(true);
  const zoomLevelRef = useRef<number>(8.0);
  const animFrameIdRef = useRef<number | null>(null);

  // Synchronize internal state when prop changes
  useEffect(() => {
    if (selectedCity) {
      setInternalSelectedCity(selectedCity);
    } else if (activeLocation && airQuality) {
      const matchedCity = WORLD_CITIES.find(
        (c) => c.name.toLowerCase() === activeLocation.name.toLowerCase()
      );
      if (matchedCity) {
        setInternalSelectedCity(matchedCity);
      }
    }
  }, [selectedCity, activeLocation, airQuality]);

  // Rotate globe to face selected city
  const rotateToCity = useCallback((city: GlobeCityPin) => {
    const phi = (city.lat * Math.PI) / 180;
    const theta = (city.lng * Math.PI) / 180;

    targetRotationRef.current = {
      x: phi * 0.7,
      y: -theta - Math.PI / 2,
    };
    autoRotateRef.current = false;
    setTimeout(() => {
      autoRotateRef.current = true;
    }, 8000);
  }, []);

  const handleCitySelect = (city: GlobeCityPin) => {
    setInternalSelectedCity(city);
    rotateToCity(city);
    if (onSelectCity) {
      onSelectCity(city);
    }
  };

  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    const newZoom = THREE.MathUtils.clamp(zoomLevelRef.current + delta, 5.5, 12.0);
    zoomLevelRef.current = newZoom;
    cameraRef.current.position.z = newZoom;
  };

  const handleResetRotation = () => {
    if (internalSelectedCity) {
      rotateToCity(internalSelectedCity);
    } else {
      targetRotationRef.current = { x: 0.2, y: -1.8 };
    }
    zoomLevelRef.current = 8.0;
    if (cameraRef.current) cameraRef.current.position.z = 8.0;
  };

  // Setup WebGL Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGlAvailable(false);
        return;
      }
    } catch {
      setWebGlAvailable(false);
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      autoRotateRef.current = false;
    }

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = zoomLevelRef.current;
    cameraRef.current = camera;

    // WebGL Renderer with optimized settings
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      rendererRef.current = renderer;
    } catch {
      setWebGlAvailable(false);
      return;
    }

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Parent group for rotating everything together
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // Initial orientation: tilt towards Eurasia / Southeast Asia
    globeGroup.rotation.x = targetRotationRef.current.x;
    globeGroup.rotation.y = targetRotationRef.current.y;

    const earthRadius = 3.2;

    // ==========================================
    // 1. High-Resolution NASA Textures Loading
    // ==========================================
    const textureLoader = new THREE.TextureLoader();

    // Day Texture
    const dayTexture = textureLoader.load("/textures/earth/earth-blue-marble.jpg");
    dayTexture.colorSpace = THREE.SRGBColorSpace;
    dayTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

    // Night Texture (City Lights)
    const nightTexture = textureLoader.load("/textures/earth/earth-night.jpg");
    nightTexture.colorSpace = THREE.SRGBColorSpace;
    nightTexture.anisotropy = 4;

    // Normal Map (Mountain & Terrain Details)
    const normalTexture = textureLoader.load("/textures/earth/earth-normal.jpg");
    normalTexture.colorSpace = THREE.NoColorSpace;

    // Specular Map (Ocean Reflection Mask)
    const specularTexture = textureLoader.load("/textures/earth/earth-specular.jpg");
    specularTexture.colorSpace = THREE.NoColorSpace;

    // Clouds Texture
    const cloudsTexture = textureLoader.load("/textures/earth/earth-clouds.png");
    cloudsTexture.colorSpace = THREE.SRGBColorSpace;

    // Sun Direction in World Space (Angled from upper-left to match celestial sunlight)
    const sunDirection = new THREE.Vector3(-1.0, 0.45, 0.85).normalize();

    // ==========================================
    // 2. Realistic Earth Surface Custom Shader
    // ==========================================
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uDayMap: { value: dayTexture },
        uNightMap: { value: nightTexture },
        uNormalMap: { value: normalTexture },
        uSpecularMap: { value: specularTexture },
        uSunDirection: { value: sunDirection },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        uniform sampler2D uDayMap;
        uniform sampler2D uNightMap;
        uniform sampler2D uNormalMap;
        uniform sampler2D uSpecularMap;
        uniform vec3 uSunDirection;

        void main() {
          vec4 dayColor = texture2D(uDayMap, vUv);
          vec4 nightColor = texture2D(uNightMap, vUv);
          vec4 normalMapVal = texture2D(uNormalMap, vUv);
          float specMask = texture2D(uSpecularMap, vUv).r;

          // Surface normal perturbation from normal map
          vec3 geomNormal = normalize(vNormal);
          vec3 mapNormal = normalize(normalMapVal.xyz * 2.0 - 1.0);
          vec3 finalNormal = normalize(mix(geomNormal, geomNormal + mapNormal * 0.35, 0.5));

          // Sunlight calculation
          float sunDot = dot(finalNormal, uSunDirection);

          // Smooth day/night terminator transition
          float dayFactor = smoothstep(-0.15, 0.22, sunDot);

          // View vector for specular & Fresnel
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          // Ocean specular highlight on day side
          vec3 halfVec = normalize(uSunDirection + viewDir);
          float specAngle = max(dot(finalNormal, halfVec), 0.0);
          float specular = pow(specAngle, 32.0) * specMask * dayFactor * 0.65;
          vec3 specColor = vec3(0.92, 0.96, 1.0) * specular;

          // Day surface lighting (ambient + directional)
          vec3 dayAmbient = vec3(0.08, 0.11, 0.15);
          float diffuse = max(sunDot, 0.0);
          vec3 dayLit = dayColor.rgb * (dayAmbient + vec3(1.12) * diffuse) + specColor;

          // Night side: subtle space ambient + authentic NASA warm city lights
          vec3 nightAmbient = dayColor.rgb * vec3(0.03, 0.04, 0.07);
          vec3 cityLights = nightColor.rgb * vec3(1.3, 1.15, 0.9) * 1.4 * (1.0 - dayFactor);

          // Subtle atmospheric limb brightening (Fresnel on edge)
          float fresnel = 1.0 - max(dot(geomNormal, viewDir), 0.0);
          float limbGlow = pow(fresnel, 3.8) * max(dot(geomNormal, uSunDirection), 0.0) * 0.4;
          vec3 atmosphereLimb = vec3(0.35, 0.68, 0.98) * limbGlow;

          // Blend day & night
          vec3 finalColor = mix(nightAmbient + cityLights, dayLit, dayFactor) + atmosphereLimb;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const earthMesh = new THREE.Mesh(earthGeometry, earthShaderMaterial);
    globeGroup.add(earthMesh);

    // ==========================================
    // 3. Separate Transparent Cloud Sphere Layer
    // ==========================================
    const cloudsRadius = earthRadius * 1.012;
    const cloudsGeometry = new THREE.SphereGeometry(cloudsRadius, 64, 64);
    const cloudsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uCloudsMap: { value: cloudsTexture },
        uSunDirection: { value: sunDirection },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        uniform sampler2D uCloudsMap;
        uniform vec3 uSunDirection;

        void main() {
          vec4 cloudSample = texture2D(uCloudsMap, vUv);
          float cloudDensity = cloudSample.r;

          // Illumination on clouds
          vec3 norm = normalize(vNormal);
          float sunDot = dot(norm, uSunDirection);
          float dayFactor = smoothstep(-0.15, 0.25, sunDot);

          // Clouds are softly sunlit on day side, faintly dimmed on night side
          vec3 cloudLit = mix(vec3(0.08, 0.1, 0.14), vec3(1.0, 1.0, 1.0), dayFactor);

          // Controlled cloud opacity to preserve continents underneath
          float opacity = cloudDensity * mix(0.15, 0.42, dayFactor);

          gl_FragColor = vec4(cloudLit, opacity);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    cloudsMeshRef.current = cloudsMesh;
    globeGroup.add(cloudsMesh);

    // ==========================================
    // 4. Atmospheric Blue Scattering Halo
    // ==========================================
    const atmosphereGeometry = new THREE.SphereGeometry(earthRadius * 1.12, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          // Subtle celestial Rayleigh scattering
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
          // Soft cyan-blue atmosphere rim
          gl_FragColor = vec4(0.24, 0.62, 0.94, 1.0) * intensity * 0.75;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });

    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Subtle Inner Atmosphere Rim on Globe Surface
    const innerRimGeometry = new THREE.SphereGeometry(earthRadius * 1.018, 64, 64);
    const innerRimMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.4);
          gl_FragColor = vec4(0.3, 0.72, 0.98, 0.35) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
    });
    const innerRimMesh = new THREE.Mesh(innerRimGeometry, innerRimMaterial);
    globeGroup.add(innerRimMesh);

    // ==========================================
    // 5. 3D City Markers (Pins & Clean Rings)
    // ==========================================
    const cityPinsGroup = new THREE.Group();
    globeGroup.add(cityPinsGroup);

    WORLD_CITIES.forEach((city) => {
      const phi = (90 - city.lat) * (Math.PI / 180);
      const theta = (city.lng + 180) * (Math.PI / 180);

      const x = -(earthRadius * Math.sin(phi) * Math.cos(theta));
      const z = earthRadius * Math.sin(phi) * Math.sin(theta);
      const y = earthRadius * Math.cos(phi);

      // Distinguishable AQI color palette against satellite surface
      let pinColorHex = 0x4a9e86; // Good (Seafoam/Teal)
      if (city.aqi > 200) pinColorHex = 0xb85450; // Severe / Very Poor (Coral Red)
      else if (city.aqi > 150) pinColorHex = 0xe0937a; // Poor (Warm Coral)
      else if (city.aqi > 100) pinColorHex = 0xe9b978; // Moderate (Soft Amber)
      else if (city.aqi > 50) pinColorHex = 0x6baeaa; // Satisfactory (Ocean Teal)

      // Small sphere at the pin location
      const pinSphereGeo = new THREE.SphereGeometry(0.045, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: pinColorHex });
      const pinMesh = new THREE.Mesh(pinSphereGeo, pinMat);
      pinMesh.position.set(x, y, z);
      cityPinsGroup.add(pinMesh);

      // Clean ground ring
      const ringGeo = new THREE.RingGeometry(0.07, 0.11, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: pinColorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(x * 1.002, y * 1.002, z * 1.002);
      ringMesh.lookAt(x * 2, y * 2, z * 2);
      cityPinsGroup.add(ringMesh);
    });

    // ==========================================
    // 6. Lighting Setup
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0x1a264a, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.7);
    sunLight.position.set(sunDirection.x * 20, sunDirection.y * 20, sunDirection.z * 20);
    scene.add(sunLight);

    // Soft backlight for celestial rim definition
    const backRimLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    backRimLight.position.set(10, -8, -12);
    scene.add(backRimLight);

    // ==========================================
    // 7. Mouse Drag & Touch Orbit Controls
    // ==========================================
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      isDraggingRef.current = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      autoRotateRef.current = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x = THREE.MathUtils.clamp(
        targetRotationRef.current.x + deltaY * 0.005,
        -Math.PI / 2.5,
        Math.PI / 2.5
      );

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
      isDraggingRef.current = false;
      setTimeout(() => {
        if (!isDraggingRef.current && !prefersReducedMotion) {
          autoRotateRef.current = true;
        }
      }, 6000);
    };

    // Touch support for mobile devices
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
        autoRotateRef.current = false;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;

      targetRotationRef.current.y += deltaX * 0.006;
      targetRotationRef.current.x = THREE.MathUtils.clamp(
        targetRotationRef.current.x + deltaY * 0.006,
        -Math.PI / 2.5,
        Math.PI / 2.5
      );

      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
      setTimeout(() => {
        if (!prefersReducedMotion) {
          autoRotateRef.current = true;
        }
      }, 6000);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    domElement.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // ==========================================
    // 8. Animation & Pin Screen Projection Loop
    // ==========================================
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Auto-rotation when idle
      if (autoRotateRef.current && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.001;
      }

      // Independent cloud rotation for atmospheric realism
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += 0.00035;
      }

      // Smooth damping interpolation
      globeGroup.rotation.y += (targetRotationRef.current.y - globeGroup.rotation.y) * 0.08;
      globeGroup.rotation.x += (targetRotationRef.current.x - globeGroup.rotation.x) * 0.08;

      // Project 3D city positions to 2D screen coordinates
      const newProjectedPins = citiesRef.current.map((city) => {
        const phi = (90 - city.lat) * (Math.PI / 180);
        const theta = (city.lng + 180) * (Math.PI / 180);

        tempVec.set(
          -(earthRadius * Math.sin(phi) * Math.cos(theta)),
          earthRadius * Math.cos(phi),
          earthRadius * Math.sin(phi) * Math.sin(theta)
        );

        // Apply globe orientation
        tempVec.applyEuler(globeGroup.rotation);

        // Facing camera check
        const isFacingCamera = tempVec.z > -0.2;

        // Project to 2D
        tempVec.project(camera);

        const screenX = ((tempVec.x + 1) * width) / 2;
        const screenY = ((-tempVec.y + 1) * height) / 2;

        return {
          city,
          x: screenX,
          y: screenY,
          visible: isFacingCamera,
        };
      });

      setProjectedPins(newProjectedPins);
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup & Resource Disposal
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domElement.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      // Dispose geometries, materials and textures
      earthGeometry.dispose();
      earthShaderMaterial.dispose();
      cloudsGeometry.dispose();
      cloudsMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      innerRimGeometry.dispose();
      innerRimMaterial.dispose();
      dayTexture.dispose();
      nightTexture.dispose();
      normalTexture.dispose();
      specularTexture.dispose();
      cloudsTexture.dispose();
      renderer.dispose();
    };
  }, []);

  // Find projected coordinate of active selected city
  const activePinProjection = projectedPins.find(
    (p) => p.city.id === internalSelectedCity.id
  );

  return (
    <div className="relative w-full h-[580px] sm:h-[640px] lg:h-[700px] flex items-center justify-center overflow-hidden select-none">
      {/* Subtle Atmospheric Cosmic Vignette in Deep Ocean Blue */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(14, 30, 60, 0.5) 0%, rgba(6, 13, 30, 0.98) 100%)",
        }}
      />

      {/* Gentle Celestial Sun Flare (Subtle, non-neon) */}
      <div
        className="pointer-events-none absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full opacity-35 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.8) 0%, rgba(107,174,170,0.3) 35%, rgba(35,75,85,0.1) 60%, rgba(0,0,0,0) 80%)",
        }}
      />

      {/* WebGL 3D Canvas or Fallback */}
      {webGlAvailable ? (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4 p-8 text-center text-slate-300">
          <div className="w-16 h-16 rounded-full bg-[#101F3B] border border-[#234B55] flex items-center justify-center text-[#6BAEAA]">
            <Thermometer className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">Interactive 3D Earth Simulation</h3>
          <p className="text-xs text-[#8A9EA4] max-w-sm">
            WebGL is not accelerated in your current browser configuration. Switch to IQ Air Map mode to view live station telemetry.
          </p>
        </div>
      )}

      {/* Top Left: Search City On Globe */}
      <div className="absolute top-5 left-5 z-30 w-60 sm:w-72">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#6BAEAA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={globeSearchQuery}
            onChange={(e) => setGlobeSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search city on Earth..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full liquid-glass-dark border border-[#234B55] hover:border-[#6BAEAA] focus:border-[#6BAEAA] text-xs text-white placeholder:text-slate-400 outline-none transition-all shadow-lg glow-btn"
          />
          {isGlobeSearching && (
            <div className="w-3 h-3 border-2 border-[#6BAEAA] border-t-transparent rounded-full animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Dropdown Results */}
        {isSearchOpen && globeSearchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl liquid-glass-dark border border-[#234B55] p-2 space-y-1 max-h-56 overflow-y-auto no-scrollbar shadow-2xl backdrop-blur-2xl">
            {globeSearchResults.map((r) => (
              <button
                key={`${r.name}-${r.latitude}-${r.longitude}`}
                onClick={async () => {
                  const newPin: GlobeCityPin = {
                    id: `pin-${r.name.toLowerCase()}-${Date.now()}`,
                    name: r.name,
                    country: r.country,
                    countryCode: r.countryCode || "LOC",
                    flag: "📍",
                    lat: r.latitude,
                    lng: r.longitude,
                    aqi: 75,
                    category: "Satisfactory",
                    dominantPollutant: "PM2.5",
                    temp: 22,
                    humidity: 50,
                    windSpeed: 10,
                    riskPercent: 25,
                    weatherCondition: "Live Copernicus Telemetry",
                  };

                  try {
                    const res = await fetch(
                      `/api/air-quality?lat=${r.latitude}&lon=${r.longitude}&name=${encodeURIComponent(
                        r.name
                      )}&country=${encodeURIComponent(r.country)}`
                    );
                    if (res.ok) {
                      const d = await res.json();
                      newPin.aqi = d.cpcbAQI;
                      newPin.category = d.cpcbCategory;
                      newPin.dominantPollutant = d.dominantPollutant;
                      newPin.temp = d.weather?.temperature ?? 22;
                      newPin.humidity = d.weather?.relativeHumidity ?? 50;
                      newPin.windSpeed = d.weather?.windSpeedKmH ?? 10;
                    }
                  } catch (e) {
                    console.warn("Live AQI fetch for searched pin:", e);
                  }

                  setCitiesList((prev) => [...prev, newPin]);
                  citiesRef.current = [...citiesRef.current, newPin];
                  handleCitySelect(newPin);
                  setGlobeSearchQuery("");
                  setIsSearchOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-xl text-xs hover:bg-[#1a3848] text-slate-100 flex items-center justify-between transition-colors"
              >
                <span className="font-medium truncate">{r.name}, {r.country}</span>
                <span className="text-[10px] font-mono text-[#6BAEAA]">Select</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Top Right: Standard Badge */}
      <div className="absolute top-5 right-5 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-dark border border-[#234B55] text-[10px] font-mono text-slate-300 shadow-lg">
        <Globe2 className="w-3.5 h-3.5 text-[#6BAEAA]" />
        <span>CPCB NAQI (India MoEFCC) Standard</span>
      </div>

      {/* ========================================================
          Interactive 2D Projected City AQI Badges on the Globe
         ======================================================== */}
      <div className="pointer-events-none absolute inset-0">
        {projectedPins.map(({ city, x, y, visible }) => {
          if (!visible) return null;
          const isSelected = city.id === internalSelectedCity.id;
          const isHovered = hoveredCity?.id === city.id;

          // Severity colors matching CPCB standard palette
          let badgeBg = "bg-[#4A9E86] text-white border-[#A9D5C8]";
          if (city.aqi > 400) {
            badgeBg = "bg-[#8B263E] border-[#A83852] text-white shadow-lg shadow-[#8B263E]/40";
          } else if (city.aqi > 300) {
            badgeBg = "bg-[#B85450] border-[#D98E83] text-white shadow-lg shadow-[#B85450]/30";
          } else if (city.aqi > 200) {
            badgeBg = "bg-[#E0937A] border-[#E6ABA1] text-white shadow-lg shadow-[#E0937A]/30";
          } else if (city.aqi > 100) {
            badgeBg = "bg-[#E9B978] border-[#F2CE9D] text-[#1A373E] font-extrabold shadow-lg shadow-[#E9B978]/30";
          } else if (city.aqi > 50) {
            badgeBg = "bg-[#6BAEAA] border-[#A9D5C8] text-[#12272C] font-extrabold shadow-lg shadow-[#6BAEAA]/25";
          } else {
            badgeBg = "bg-[#4A9E86] border-[#A9D5C8] text-white shadow-lg shadow-[#4A9E86]/25";
          }

          if (isSelected) {
            badgeBg = "bg-[#E9B978] border-white text-[#12272C] font-black shadow-2xl shadow-[#E9B978]/60 ring-4 ring-[#E9B978]/40";
          }

          return (
            <button
              key={city.id}
              onClick={() => handleCitySelect(city)}
              onMouseEnter={() => setHoveredCity(city)}
              onMouseLeave={() => setHoveredCity(null)}
              className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-200 border ${
                isSelected
                  ? "w-12 h-12 text-sm z-30 scale-110"
                  : isHovered
                  ? "w-9 h-9 text-xs z-20 scale-125"
                  : "w-8 h-8 text-[11px] z-10 opacity-95 hover:opacity-100"
              } ${badgeBg}`}
              style={{
                left: `${x}px`,
                top: `${y}px`,
              }}
              title={`${city.name}, ${city.country} - AQI: ${city.aqi} (${city.category})`}
            >
              <span>{city.aqi}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          Active Selected City Floating Tooltip Card
         ======================================================== */}
      {activePinProjection && activePinProjection.visible && (
        <div
          className="pointer-events-auto absolute z-40 transition-all duration-300 transform -translate-x-1/2 -translate-y-full mb-4"
          style={{
            left: `${activePinProjection.x}px`,
            top: `${activePinProjection.y - 14}px`,
          }}
        >
          {/* Card Body with Liquid Glass & Subtle Teal Glow */}
          <div className="relative w-64 sm:w-72 p-3 sm:p-3.5 rounded-2xl liquid-glass-dark glow-card-dark border border-[#6BAEAA]/50 shadow-2xl backdrop-blur-xl text-left text-white animate-fadeIn">
            {/* Pointer triangle */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#0e1e30]" />

            {/* Header */}
            <div className="flex items-center justify-between gap-1 pb-2 border-b border-[#234B55]/70 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <span className="p-0.5 rounded-full bg-[#E9B978]/20 text-[#E9B978]">
                  <Info className="w-3 h-3" />
                </span>
                <span className="font-semibold text-slate-100 truncate">
                  {internalSelectedCity.name}, {internalSelectedCity.country}
                </span>
              </div>
              <button
                onClick={onViewDetails}
                className="text-[10px] text-[#E9B978] hover:text-[#F2CE9D] font-medium flex items-center gap-0.5 transition-colors shrink-0 glow-btn"
              >
                <span>Details</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Middle */}
            <div className="flex items-center gap-2.5 py-2">
              <div
                className={`px-2 py-1 rounded-lg text-xs font-black shadow-sm flex flex-col items-center shrink-0 ${
                  internalSelectedCity.aqi > 400
                    ? "bg-[#8B263E] text-white"
                    : internalSelectedCity.aqi > 300
                    ? "bg-[#B85450] text-white"
                    : internalSelectedCity.aqi > 200
                    ? "bg-[#E0937A] text-white"
                    : internalSelectedCity.aqi > 100
                    ? "bg-[#E9B978] text-[#12272C]"
                    : internalSelectedCity.aqi > 50
                    ? "bg-[#6BAEAA] text-[#12272C]"
                    : "bg-[#4A9E86] text-white"
                }`}
              >
                <span>{internalSelectedCity.aqi}</span>
                <span className="text-[8px] uppercase tracking-tighter opacity-85">AQI</span>
              </div>
              <div className="text-xs font-medium text-slate-200 leading-tight">
                {internalSelectedCity.aqi > 400
                  ? "Severe Smog: Hazardous to all. Stay indoors."
                  : internalSelectedCity.aqi > 300
                  ? "Very Poor: High particulate risk. Seal windows."
                  : internalSelectedCity.aqi > 200
                  ? "Poor: Unhealthy for vulnerable lungs & children."
                  : internalSelectedCity.aqi > 100
                  ? "Moderate: Sensitive groups may experience irritation."
                  : internalSelectedCity.aqi > 50
                  ? "Satisfactory: Acceptable for general public."
                  : "Good: Clean air safe for all outdoor activities."}
              </div>
            </div>

            {/* Explain This City Action */}
            {onExplainCity && (
              <div className="pb-2">
                <button
                  type="button"
                  onClick={() => onExplainCity(internalSelectedCity)}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-[#6BAEAA]/20 hover:bg-[#6BAEAA]/30 border border-[#6BAEAA]/40 text-[#A9D5C8] text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 glow-btn"
                >
                  <Sparkles className="w-3 h-3 text-[#E9B978]" />
                  <span>Explain this city with AI</span>
                </button>
              </div>
            )}

            {/* Bottom Row */}
            <div className="flex items-center justify-between pt-2 border-t border-[#234B55]/70 text-[11px] text-slate-300 font-mono">
              <div className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-[#E9B978]" />
                <span>{internalSelectedCity.temp}°C</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-[#6BAEAA]" />
                <span>{internalSelectedCity.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3 text-[#A9D5C8]" />
                <span>{internalSelectedCity.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          Bottom Right: Zoom Controls [ + ] [ - ] & Reset with Glow
         ======================================================== */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 text-xs font-medium text-slate-300">
        <span className="text-slate-400 text-xs hidden sm:inline">Zoom</span>
        <button
          onClick={() => handleZoom(-1.0)}
          className="w-8 h-8 rounded-full liquid-glass-dark border border-[#234B55] hover:border-[#6BAEAA] text-white flex items-center justify-center transition-all shadow-md glow-btn"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(1.0)}
          className="w-8 h-8 rounded-full liquid-glass-dark border border-[#234B55] hover:border-[#6BAEAA] text-white flex items-center justify-center transition-all shadow-md glow-btn"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetRotation}
          className="w-8 h-8 rounded-full liquid-glass-dark border border-[#234B55] hover:border-[#6BAEAA] text-white flex items-center justify-center transition-all shadow-md glow-btn"
          title="Reset Globe View"
          aria-label="Reset Globe View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* NASA Attribution Badge */}
      <div className="absolute bottom-6 left-6 z-20 hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0c1833]/80 border border-[#234B55]/70 text-[10px] font-mono text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-[#6BAEAA]" />
        <span>NASA Visible Earth / Blue Marble</span>
      </div>
    </div>
  );
}
