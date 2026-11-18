"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Plus, Minus, RotateCcw, Info, ExternalLink, Wind, Droplets, Thermometer } from "lucide-react";
import { LocationData, AirQualityData } from "@/lib/types";

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
}

export default function EarthGlobe3D({
  selectedCity,
  onSelectCity,
  activeLocation,
  airQuality,
  onViewDetails,
}: EarthGlobe3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [internalSelectedCity, setInternalSelectedCity] = useState<GlobeCityPin>(
    selectedCity || WORLD_CITIES[1] // Default to Jakarta / matching reference image
  );
  const [hoveredCity, setHoveredCity] = useState<GlobeCityPin | null>(null);
  const [projectedPins, setProjectedPins] = useState<
    { city: GlobeCityPin; x: number; y: number; visible: boolean }[]
  >([]);

  // Three.js instances stored in refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
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
      // Create city pin from active location
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
    // Lat / Lng to Euler rotation
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

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = zoomLevelRef.current;
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Parent group for rotating everything together
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // Initial orientation: tilt towards Eurasia / Southeast Asia
    globeGroup.rotation.x = targetRotationRef.current.x;
    globeGroup.rotation.y = targetRotationRef.current.y;

    // ==========================================
    // 1. Procedural Night Earth Canvas Texture
    // ==========================================
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Deep oceanic midnight gradient
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
      oceanGrad.addColorStop(0, "#030816");
      oceanGrad.addColorStop(0.5, "#060f26");
      oceanGrad.addColorStop(1, "#030816");
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, 2048, 1024);

      // Subtle longitude & latitude coordinate grid
      ctx.strokeStyle = "rgba(30, 58, 110, 0.22)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= 2048; x += 128) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1024);
        ctx.stroke();
      }
      for (let y = 0; y <= 1024; y += 128) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(2048, y);
        ctx.stroke();
      }

      // Draw Landmasses (vector styled continents)
      ctx.fillStyle = "#0c1b38";
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.lineWidth = 1.5;

      const drawContinent = (points: [number, number][]) => {
        ctx.beginPath();
        const startX = ((points[0][1] + 180) / 360) * 2048;
        const startY = ((90 - points[0][0]) / 180) * 1024;
        ctx.moveTo(startX, startY);

        for (let i = 1; i < points.length; i++) {
          const px = ((points[i][1] + 180) / 360) * 2048;
          const py = ((90 - points[i][0]) / 180) * 1024;
          ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      };

      // Eurasia
      drawContinent([
        [70, 30], [72, 70], [68, 120], [62, 160], [50, 140],
        [38, 122], [22, 114], [10, 105], [12, 80], [25, 65],
        [30, 48], [42, 28], [55, 10], [60, 20], [70, 30],
      ]);

      // Africa
      drawContinent([
        [35, -5], [37, 10], [30, 32], [12, 44], [-5, 40],
        [-25, 32], [-35, 20], [-34, 18], [-10, 12], [5, 2],
        [15, -16], [32, -10], [35, -5],
      ]);

      // North America
      drawContinent([
        [70, -160], [68, -130], [58, -95], [52, -60], [45, -65],
        [30, -80], [25, -80], [18, -98], [25, -110], [38, -122],
        [50, -125], [60, -140], [70, -160],
      ]);

      // South America
      drawContinent([
        [10, -75], [5, -52], [-10, -36], [-25, -48], [-45, -65],
        [-55, -68], [-40, -72], [-18, -75], [-5, -80], [10, -75],
      ]);

      // Australia
      drawContinent([
        [-12, 130], [-15, 145], [-25, 152], [-38, 145], [-35, 115],
        [-22, 114], [-15, 125], [-12, 130],
      ]);

      // Southeast Asia Islands / Indonesia archipelago
      drawContinent([[5, 100], [2, 104], [-6, 106], [-8, 114], [-6, 110], [5, 100]]);
      drawContinent([[-2, 110], [-4, 118], [-8, 120], [-5, 112], [-2, 110]]);

      // ==========================================
      // Add Glowing City Night Lights (Golden Nodes)
      // ==========================================
      const addCityLightCluster = (lat: number, lng: number, count: number, radius: number) => {
        const cx = ((lng + 180) / 360) * 2048;
        const cy = ((90 - lat) / 180) * 1024;

        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.pow(Math.random(), 0.7) * radius;
          const px = cx + Math.cos(angle) * dist;
          const py = cy + Math.sin(angle) * dist;

          const brightness = Math.random();
          ctx.beginPath();
          ctx.arc(px, py, 1.2 + Math.random() * 1.8, 0, Math.PI * 2);
          if (brightness > 0.6) {
            ctx.fillStyle = "rgba(254, 240, 138, 0.95)"; // bright golden yellow
          } else if (brightness > 0.3) {
            ctx.fillStyle = "rgba(245, 158, 11, 0.85)"; // warm amber
          } else {
            ctx.fillStyle = "rgba(234, 88, 12, 0.7)"; // deep orange
          }
          ctx.fill();
        }
      };

      // Dense night light clusters matching real Earth night maps
      addCityLightCluster(28.6, 77.2, 50, 28);   // Northern India / Delhi corridor
      addCityLightCluster(19.0, 72.8, 40, 20);   // Western India / Mumbai
      addCityLightCluster(13.0, 80.2, 30, 15);   // Southern India
      addCityLightCluster(-6.2, 106.8, 45, 22);  // Java / Jakarta
      addCityLightCluster(31.2, 121.5, 55, 30);  // Yangtze Delta / Shanghai
      addCityLightCluster(22.3, 114.1, 40, 20);  // Pearl River Delta / Hong Kong
      addCityLightCluster(35.6, 139.6, 50, 25);  // Tokyo / Kanto Plain
      addCityLightCluster(25.2, 55.2, 35, 18);   // Dubai / UAE coast
      addCityLightCluster(51.5, -0.1, 45, 25);   // London / UK
      addCityLightCluster(48.8, 2.3, 40, 22);    // Paris
      addCityLightCluster(40.7, -74.0, 50, 30);  // NY / Boston corridor
      addCityLightCluster(34.0, -118.2, 40, 25); // California
      addCityLightCluster(30.0, 31.2, 35, 20);   // Nile Delta / Cairo
      addCityLightCluster(-26.2, 28.0, 30, 18);  // Johannesburg
    }

    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.anisotropy = 8;

    // Earth Sphere Geometry
    const earthRadius = 3.2;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpScale: 0.05,
      specular: new THREE.Color(0x0a1e4a),
      shininess: 15,
      emissive: new THREE.Color(0x020713),
    });

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMeshRef.current = earthMesh;
    globeGroup.add(earthMesh);

    // ==========================================
    // 2. Atmospheric Cyan / Electric Blue Glow Halo
    // ==========================================
    const atmosphereGeometry = new THREE.SphereGeometry(earthRadius * 1.055, 64, 64);
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
          // Fresnel rim lighting
          float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.6);
          gl_FragColor = vec4(0.0, 0.85, 1.0, 1.0) * intensity * 1.4;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });

    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Subtle Inner Atmosphere Rim
    const innerRimGeometry = new THREE.SphereGeometry(earthRadius * 1.008, 64, 64);
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
          float intensity = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.2);
          gl_FragColor = vec4(0.2, 0.6, 1.0, 0.4) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
    });
    const innerRimMesh = new THREE.Mesh(innerRimGeometry, innerRimMaterial);
    globeGroup.add(innerRimMesh);

    // ==========================================
    // 3. 3D City Markers (Pins & Glowing Rings)
    // ==========================================
    const cityPinsGroup = new THREE.Group();
    globeGroup.add(cityPinsGroup);

    WORLD_CITIES.forEach((city) => {
      const phi = (90 - city.lat) * (Math.PI / 180);
      const theta = (city.lng + 180) * (Math.PI / 180);

      const x = -(earthRadius * Math.sin(phi) * Math.cos(theta));
      const z = earthRadius * Math.sin(phi) * Math.sin(theta);
      const y = earthRadius * Math.cos(phi);

      // Color based on AQI
      let pinColorHex = 0x10b981; // good
      if (city.aqi > 200) pinColorHex = 0xef4444; // severe / very poor
      else if (city.aqi > 150) pinColorHex = 0xf97316; // poor
      else if (city.aqi > 100) pinColorHex = 0xeab308; // moderate
      else if (city.aqi > 50) pinColorHex = 0x84cc16; // satisfactory

      // Small glowing sphere at the pin base
      const pinSphereGeo = new THREE.SphereGeometry(0.05, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: pinColorHex,
      });
      const pinMesh = new THREE.Mesh(pinSphereGeo, pinMat);
      pinMesh.position.set(x, y, z);
      cityPinsGroup.add(pinMesh);

      // Glowing outer ring on surface
      const ringGeo = new THREE.RingGeometry(0.08, 0.12, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: pinColorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(x * 1.002, y * 1.002, z * 1.002);
      ringMesh.lookAt(x * 2, y * 2, z * 2);
      cityPinsGroup.add(ringMesh);
    });

    // ==========================================
    // 4. Lighting Setup
    // ==========================================
    // Ambient light - deep space tint
    const ambientLight = new THREE.AmbientLight(0x1a264a, 0.8);
    scene.add(ambientLight);

    // Directional Sun Light (bursting from upper-left to match IMAGE 1)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(-15, 12, 10);
    scene.add(sunLight);

    // Subtle blue rim backlight
    const backRimLight = new THREE.DirectionalLight(0x00d4ff, 1.2);
    backRimLight.position.set(12, -8, -10);
    scene.add(backRimLight);

    // ==========================================
    // 5. Mouse Drag Orbit Controls
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
      // Resume slow auto-rotation after 6 seconds of inactivity
      setTimeout(() => {
        if (!isDraggingRef.current) {
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
        autoRotateRef.current = true;
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
    // 6. Animation & Pin Screen Projection Loop
    // ==========================================
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Auto-rotation when idle
      if (autoRotateRef.current && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.0012;
      }

      // Smooth damping interpolation
      globeGroup.rotation.y += (targetRotationRef.current.y - globeGroup.rotation.y) * 0.08;
      globeGroup.rotation.x += (targetRotationRef.current.x - globeGroup.rotation.x) * 0.08;

      // Project 3D city positions to 2D screen coordinates for badges
      const newProjectedPins = WORLD_CITIES.map((city) => {
        const phi = (90 - city.lat) * (Math.PI / 180);
        const theta = (city.lng + 180) * (Math.PI / 180);

        // Position on globe
        tempVec.set(
          -(earthRadius * Math.sin(phi) * Math.cos(theta)),
          earthRadius * Math.cos(phi),
          earthRadius * Math.sin(phi) * Math.sin(theta)
        );

        // Apply globe orientation
        tempVec.applyEuler(globeGroup.rotation);

        // Calculate visibility: if pointing towards camera (positive z from center)
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

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domElement.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
    };
  }, []);

  // Find projected coordinate of active selected city
  const activePinProjection = projectedPins.find(
    (p) => p.city.id === internalSelectedCity.id
  );

  return (
    <div className="relative w-full h-[580px] sm:h-[640px] lg:h-[700px] flex items-center justify-center overflow-hidden select-none">
      {/* ========================================================
          Solar Lens Flare burst overlay at top-left (Matches IMAGE 1)
         ======================================================== */}
      <div
        className="pointer-events-none absolute -top-12 -left-12 w-[380px] h-[380px] rounded-full opacity-60 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9) 0%, rgba(56,189,248,0.4) 30%, rgba(99,102,241,0.15) 60%, rgba(0,0,0,0) 80%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-10 left-10 w-[500px] h-[1px] opacity-40 rotate-[35deg]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
        }}
      />

      {/* Background Starfield / Cosmic Ambient Gradients */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 60% 50%, rgba(14, 30, 70, 0.45) 0%, rgba(4, 9, 22, 0.95) 100%)",
        }}
      />

      {/* WebGL 3D Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* ========================================================
          Interactive 2D Projected City AQI Badges on the Globe
         ======================================================== */}
      <div className="pointer-events-none absolute inset-0">
        {projectedPins.map(({ city, x, y, visible }) => {
          if (!visible) return null;
          const isSelected = city.id === internalSelectedCity.id;
          const isHovered = hoveredCity?.id === city.id;

          // Color classification
          let badgeBg = "bg-slate-800/80 border-slate-700 text-slate-200";
          if (city.aqi > 200) badgeBg = "bg-red-600/90 border-red-400 text-white shadow-lg shadow-red-500/30";
          else if (city.aqi > 150) badgeBg = "bg-orange-500/90 border-orange-400 text-white shadow-lg shadow-orange-500/30";
          else if (city.aqi > 100) badgeBg = "bg-amber-500/90 border-amber-300 text-slate-900 font-extrabold shadow-lg shadow-amber-500/30";
          else if (city.aqi > 50) badgeBg = "bg-yellow-400/90 border-yellow-300 text-slate-900 font-extrabold shadow-lg shadow-yellow-400/20";
          else badgeBg = "bg-emerald-500/80 border-emerald-400 text-white shadow-lg shadow-emerald-500/20";

          // If selected, make it a large prominent yellow circle matching IMAGE 1 (circle 78)
          if (isSelected) {
            badgeBg = "bg-amber-400 border-amber-200 text-slate-950 font-black shadow-2xl shadow-amber-400/50";
          }

          return (
            <button
              key={city.id}
              onClick={() => handleCitySelect(city)}
              onMouseEnter={() => setHoveredCity(city)}
              onMouseLeave={() => setHoveredCity(null)}
              className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-200 border ${
                isSelected
                  ? "w-12 h-12 text-sm z-30 ring-4 ring-amber-400/30 scale-110"
                  : isHovered
                  ? "w-9 h-9 text-xs z-20 scale-125"
                  : "w-8 h-8 text-[11px] z-10 opacity-90 hover:opacity-100"
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
          Active Selected City Floating Tooltip Card (Matches IMAGE 1)
         ======================================================== */}
      {activePinProjection && activePinProjection.visible && (
        <div
          className="pointer-events-auto absolute z-40 transition-all duration-300 transform -translate-x-1/2 -translate-y-full mb-4"
          style={{
            left: `${activePinProjection.x}px`,
            top: `${activePinProjection.y - 14}px`,
          }}
        >
          {/* Card Body */}
          <div className="relative w-64 sm:w-72 p-3 sm:p-3.5 rounded-2xl bg-[#141b34]/95 border border-indigo-500/30 shadow-2xl backdrop-blur-xl text-left text-white animate-fadeIn">
            {/* Pointer triangle pointing down to active badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#141b34]" />

            {/* Header: [i] Jakarta, Indonesia Air Quality + Details */}
            <div className="flex items-center justify-between gap-1 pb-2 border-b border-slate-700/60 text-xs">
              <div className="flex items-center gap-1.5 truncate">
                <span className="p-0.5 rounded-full bg-red-500/20 text-red-400">
                  <Info className="w-3 h-3" />
                </span>
                <span className="font-semibold text-slate-200 truncate">
                  {internalSelectedCity.name}, {internalSelectedCity.country}
                </span>
              </div>
              <button
                onClick={onViewDetails}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-0.5 transition-colors shrink-0"
              >
                <span>Details</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Middle: [137 AQI] Unhealthy for sensitive people */}
            <div className="flex items-center gap-2.5 py-2">
              <div className="px-2 py-1 rounded-lg bg-orange-500/90 text-white font-extrabold text-xs shadow-sm flex flex-col items-center">
                <span>{internalSelectedCity.aqi}</span>
                <span className="text-[8px] uppercase tracking-tighter opacity-80">AQI</span>
              </div>
              <div className="text-xs font-medium text-slate-200 leading-tight">
                {internalSelectedCity.aqi > 150
                  ? "Unhealthy for sensitive people"
                  : internalSelectedCity.aqi > 100
                  ? "Moderate health risk for vulnerable"
                  : internalSelectedCity.aqi > 50
                  ? "Acceptable air quality for most"
                  : "Clean air safe for all activities"}
              </div>
            </div>

            {/* Bottom Row: Temp, Humidity, Wind speed */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 font-mono">
              <div className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-amber-400" />
                <span>{internalSelectedCity.temp}°C</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-400" />
                <span>{internalSelectedCity.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3 text-emerald-400" />
                <span>{internalSelectedCity.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          Bottom Right: Zoom Controls [ + ] [ - ] & Reset
         ======================================================== */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 text-xs font-medium text-slate-300">
        <span className="text-slate-400 text-xs hidden sm:inline">Zoom</span>
        <button
          onClick={() => handleZoom(-1.0)}
          className="w-8 h-8 rounded-full bg-[#131d38]/90 border border-slate-700 hover:border-cyan-400 text-white flex items-center justify-center hover:bg-slate-800 transition-all shadow-md active:scale-95"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(1.0)}
          className="w-8 h-8 rounded-full bg-[#131d38]/90 border border-slate-700 hover:border-cyan-400 text-white flex items-center justify-center hover:bg-slate-800 transition-all shadow-md active:scale-95"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetRotation}
          className="w-8 h-8 rounded-full bg-[#131d38]/90 border border-slate-700 hover:border-cyan-400 text-white flex items-center justify-center hover:bg-slate-800 transition-all shadow-md active:scale-95"
          title="Reset Globe View"
          aria-label="Reset Globe View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
