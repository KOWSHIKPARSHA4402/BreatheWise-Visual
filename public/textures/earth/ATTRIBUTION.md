# Earth Texture Assets & Attribution

The 3D Earth visualizations in BreatheWise utilize high-resolution public-domain satellite imagery and scientific cartography.

## 1. NASA Visible Earth & Blue Marble
- **Source**: NASA Goddard Space Flight Center / Visible Earth (`https://visibleearth.nasa.gov/`)
- **Assets**:
  - `earth-blue-marble.jpg`: True-color daylight composite generated from NASA Terra and Aqua MODIS satellite data.
  - `earth-day.jpg`: High-resolution satellite daytime equirectangular projection.
  - `earth-night.jpg`: Earth at Night ("Black Marble") composite captured by the Suomi NPP VIIRS Day/Night band, showing nocturnal anthropogenic city light emission.
  - `earth-topology.png` & `earth-normal.jpg`: Topographic elevation and normal bump data derived from the Shuttle Radar Topography Mission (SRTM) and USGS GTOPO30 elevation datasets.
- **License**: Public Domain (NASA Open Data Policy - Free for educational, scientific, and public use).

## 2. Atmospheric Cloud Formations
- **Source**: Three.js Open Source Project / NASA Satellite Cloud Mosaics (`https://threejs.org/examples/textures/planets/`)
- **Asset**: `earth-clouds.png` (Transparent equirectangular atmospheric cloud layer)
- **License**: MIT License / Public Domain NASA Cloud Composite.

## 3. Local Offline Hosting
All textures are bundled locally within the `public/textures/earth/` directory of the application repository. This guarantees:
- Zero dependency on third-party CDNs or external image hosts.
- Fast, predictable cache times and instant WebGL texture upload.
- Full offline operation support.
- Zero network flakiness or cross-origin (CORS) security issues.
