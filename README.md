# BreatheWise 🍃
### Planetary 3D Air Quality Intelligence & Winter Smog Navigator
**AI-Powered Environmental Platform Powered by Google Gemini & Copernicus CAMS**

[![Live Demo on Vercel](https://img.shields.io/badge/Live%20Demo-Vercel%20Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://breathewise-visual-git-main-kowshiks-projects-143ca58e.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/KOWSHIKPARSHA4402/BreatheWise-Visual)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash-4285F4?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)
[![CPCB NAQI](https://img.shields.io/badge/Standard-CPCB%20India%20NAQI-emerald)](https://cpcb.nic.in/)
[![Tests](https://img.shields.io/badge/Automated%20Tests-10%2F10%20Passing-brightgreen)](tests/aqi-and-emissions.test.mjs)

> 🌍 **LIVE PRODUCTION DEPLOYMENT:**  
> **👉 [https://breathewise-visual.vercel.app](https://breathewise-visual-git-main-kowshiks-projects-143ca58e.vercel.app/)**  
> *Click above to explore the live interactive 3D Earth globe, real-time CPCB telemetry, Clean Air School, and AI assistant directly in your browser without local installation.*

---

## 1. Executive Summary & Problem Statement

Every winter, millions of families in metropolitan regions across northern India (Delhi NCR, Punjab, Haryana, Uttar Pradesh), South Asia (Lahore, Dhaka), and industrial cities worldwide face a catastrophic public health crisis: **severe winter smog**.

Atmospheric thermal inversions trap microscopic particulate matter (**PM2.5** and **PM10**), nitrogen dioxide (**NO2**), sulfur dioxide (**SO2**), and carbon monoxide (**CO**) at breathing level. Most existing solutions are passive: they display a scary red number on a dashboard without providing context, practical family defense protocols, or personalized emissions mitigation.

**BreatheWise** solves this by answering three critical daily questions:
1. **How polluted is the air around my family right now?**
2. **What practical actions should we take today to minimize exposure?**
3. **What sustainable choices can we make to lower our own pollution footprint?**

---

## 2. Core Pillars & Capabilities

### A. Grounded Real-Time Air Quality Dashboard
- **Standardized CPCB NAQI & US EPA AQI:** Direct implementation of the official Indian Central Pollution Control Board (CPCB) linear interpolation sub-index formulas and EPA standards.
- **Full Chemical Breakdown:** Live concentrations for PM2.5, PM10, NO2, SO2, CO, and O3 compared against WHO 24-hour safe exposure limits.
- **Atmospheric Telemetry & Inversion Warning:** Senses low wind speed (&lt; 6 km/h) and high relative humidity (&gt; 60%) to alert users when a thermal inversion lid is trapping smog.
- **24-Hour & 7-Day Trend Modeling:** Interactive Recharts graphs illustrating diurnal winter smog peaks (morning rush-hour inversion spikes).

### B. Context-Aware GenAI Assistant (Google Gemini 1.5)
- Server-side integration with **Google Gemini 1.5 Flash** via `@google/generative-ai`.
- Dynamically injects live ambient AQI, current pollutant concentrations, diurnal inversion weather, commute mode, and family vulnerabilities (infants, seniors, asthma) into the model context.
- Strictly formats answers into 5 actionable sections:
  1. **Current Situation** (factual grounding)
  2. **What This Means** (biological impact)
  3. **Recommended Actions** (practical steps)
  4. **Expected Benefits** (quantified protection)
  5. **Important Precautions** (critical safety warnings)
- **Zero-Failure Fallback Engine:** If an API key is not configured or network rate limits are reached, the assistant automatically switches to its local scientific CPCB/WHO expert rule engine.

### C. My Clean Air Plan (Personalized Daily Planner)
- Customizes recommendations to the user's lifestyle: commute method (metro, bus, car, bike), work hours, vulnerable family members, and air purifier availability.
- Generates a **4-Phase Dynamic Schedule (Morning, Afternoon, Evening, Night)** tailored to the selected city's live air quality.
- Interactive checklist with persistent completion state and celebration animations (`canvas-confetti`).

### D. Indoor Air Quality Improvement Centre
- **Interactive CADR & Room Size Sizer:** Calculates required Clean Air Delivery Rate ($m^3/h$ and CFM) based on room dimensions ($L \times W \times H$) and target Air Changes per Hour (5 ACH for severe smog).
- **The 5 Science-Backed Indoor Pillars:**
  1. True-HEPA (H13/H14) Mechanical Filtration.
  2. Source Control (strictly eliminating incense, dhoop, smoking, unvented heating).
  3. Diurnal Ventilation Timing (avoiding early morning inversion; ventilating during afternoon solar warming).
  4. Wet Microfiber Mopping vs. Dry Sweeping (preventing particulate re-suspension).
  5. Kitchen Exhaust Chimneys & Clean Cooking.
- **Critical Safety Warning Banner:** Explicit warnings against hazardous ionic and ozone-generating air cleaners.

### E. AQI-Sensitive Green Choices
- Recommends sustainable lifestyle alternatives that adapt to the ambient AQI:
  - When AQI is **Severe (&gt;300)**: Outdoor cycling/walking is flagged as hazardous; enclosed electric metro transit and telecommuting are recommended.
  - When AQI is **Good (&lt;100)**: Active cycling and walking are actively encouraged.
- Details tailpipe CO2 offset, health impact, cost benefit, and practicality ratings.

### F. Defensible Environmental Impact Calculator
- Personal emissions calculator grounded in **DEFRA 2023 greenhouse gas conversion factors** and CPCB urban baselines:
  - Petrol Car: 0.170 kg CO2e/km
  - Diesel Car: 0.171 kg CO2e/km
  - Two-Wheeler: 0.103 kg CO2e/km
  - City Bus: 0.082 kg CO2e/passenger-km
  - Electric Metro: 0.035 kg CO2e/passenger-km
  - Mature Tree Annual Absorption: 21.77 kg CO2/year
- Computes daily, monthly, and annual CO2 savings, vehicle kilometers avoided, tree equivalents, and Clean Air Points.
- **Scientific Integrity Guarantee:** Clarifies that individual reductions lower personal carbon footprints and local road exhaust, but cannot be claimed to singlehandedly alter regional sensor AQI.

### G. Community Pollution Awareness & Smog Physics
- **Winter Smog Inversion Visual Explainer:** Illustrated physics of how cold air pooling under warm air traps toxic particulates.
- **Mask Selection Matrix:** Comparison of certified N95/FFP2 (≥95% sub-micron filtration) vs. Surgical (30-45%) vs. Cloth (&lt;15%).
- **Civic Reporting Guide:** Actionable steps to report illegal open garbage or leaf burning via municipal apps (such as the CPCB Sameer App).
- **Printable Clean Air Family Checklist:** One-click print/share summary.

### H. Hackathon Demonstration Simulator (Settings)
- Built-in one-click scenario simulator allowing hackathon judges to test the platform under:
  - **Severe Smog Episode (425 AQI)**
  - **Moderate Smog (145 AQI)**
  - **Clean Air Day (38 AQI)**
  - Instant toggle back to live Open-Meteo Copernicus CAMS feed.

---

## 3. Technology Stack & Architecture

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | Next.js 14.2 (App Router), React 18, TypeScript |
| **Styling & UI** | Tailwind CSS 3.4, Lucide React Icons, Canvas Confetti |
| **Data Visualization** | Recharts (AreaChart, BarChart, ResponsiveContainer) |
| **GenAI Service** | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| **Live Atmospheric Data** | Open-Meteo Air Quality & Copernicus Atmosphere Monitoring Service (CAMS) |
| **Geocoding & Location** | Open-Meteo Geocoding API + Browser Geolocation API |
| **Testing Engine** | Node.js Test Runner (`node:test`, `node:assert`) |
| **Deployment Target** | Vercel (Production-optimized, zero server leaks) |

### System Data Flow Diagram

```
[ User Browser / Device ]
       │
       ├──► Geolocation / City Search ──► /api/geocoding ──► Open-Meteo Geocoding
       │
       ├──► Live Telemetry Request ─────► /api/air-quality ─► Open-Meteo CAMS Model
       │                                       │
       │                                       ▼
       │                            [ CPCB NAQI Engine ]
       │                            (PM2.5, PM10, NO2, SO2, CO, O3)
       │
       └──► GenAI Context Query ────────► /api/chat
                                               │
                                ┌──────────────┴──────────────┐
                                ▼                             ▼
                    [ Google Gemini 1.5 ]        [ CPCB / WHO Fallback ]
                    (Server-side API key)        (Zero-failure engine)
                                │                             │
                                └──────────────┬──────────────┘
                                               │
                                               ▼
                              [ Structured 5-Part Guidance ]
                              1. Current Situation
                              2. What This Means
                              3. Recommended Actions
                              4. Expected Benefits
                              5. Important Precautions
```

---

## 4. Scientific Standards & Calculation Formulas

### A. CPCB National Air Quality Index (NAQI) Formula
$$\text{Sub-Index } I = I_{low} + \frac{I_{high} - I_{low}}{C_{high} - C_{low}} \times (C - C_{low})$$
$$\text{Overall CPCB AQI} = \max(I_{\text{PM2.5}}, I_{\text{PM10}}, I_{\text{NO2}}, I_{\text{SO2}}, I_{\text{CO}}, I_{\text{O3}})$$

### B. Clean Air Delivery Rate (CADR) Formula
$$\text{Room Volume } (m^3) = \text{Length } (m) \times \text{Width } (m) \times \text{Height } (m)$$
$$\text{Required CADR } (m^3/h) = \text{Room Volume} \times \text{Target Air Changes per Hour (ACH = 5)}$$
$$\text{Required CADR (CFM)} = \frac{\text{Required CADR } (m^3/h)}{1.699}$$

### C. Personal Emissions Savings Formula
$$\text{Weekly Saved } \text{CO}_2 \text{ (kg)} = (\text{Commute Distance } \times 2) \times \text{Telecommute Days} \times \text{Vehicle Factor}$$

---

## 5. Getting Started & Installation

### Prerequisites
- Node.js version 18.17+ or 20+ (tested on Node v25).
- npm or yarn.
- Git.

### 1. Clone the Repository
```bash
git clone https://github.com/KOWSHIKPARSHA4402/BreatheWise-Visual.git
cd BreatheWise-Visual
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory (refer to `.env.example`):
```env
# Optional: Add your Google Gemini API key for dynamic LLM chat:
GEMINI_API_KEY=your_gemini_api_key_here

NEXT_PUBLIC_APP_URL=http://localhost:3000
```
> *Note:* BreatheWise is fully functional even without an API key! If `GEMINI_API_KEY` is not provided, the system automatically uses its built-in rule-based scientific guidance engine.

### 4. Run Development Server
```bash
npm run dev
```
- **Local Dev:** Open [http://localhost:3000](http://localhost:3000) in your browser.
- **🌐 Live Cloud Deployment:** Anyone can access the production platform directly on Vercel at:  
  👉 **[https://breathewise-visual.vercel.app](https://breathewise-visual-git-main-kowshiks-projects-143ca58e.vercel.app/)**

### 5. Run Automated Tests
```bash
npm test
```

### 6. Production Build & Lint
```bash
npm run lint
npm run build
```

---

## 6. Verification & Test Suite

The automated test suite (`tests/aqi-and-emissions.test.mjs`) validates:
- [x] **CPCB Sub-Index Calculation:** Verifies exact linear interpolation at all breakpoint tiers (Good, Satisfactory, Moderate, Poor, Very Poor, Severe).
- [x] **Dominant Pollutant Selection:** Verifies maximum sub-index logic.
- [x] **DEFRA Emissions Calculations:** Verifies commute distance, vehicle factors, and annual tree absorption.
- [x] **CADR Purifier Sizing:** Verifies cubic volume and airflow rate conversions.
- [x] **GenAI Assistant Structure:** Verifies all 5 mandatory sections, N95 respirator mandates during severe smog, and warnings against ozone generators.

---

## 7. Hackathon Submission Package

### Project Title
**BreatheWise – AI-Powered Urban Air Quality Assistant & Winter Smog Navigator**

### Selected Track
**Hack2Skill PromptWars Challenge 6: Urban Air Quality & Winter Smog**

### Where GenAI Is Used
1. **Dynamic Prompt Ingestion (`/api/chat`):** Grounded injection of live CPCB AQI, particulate concentrations, meteorological thermal inversions, commute habits, and vulnerable family members.
2. **Contextual Action Synthesis:** Translating complex atmospheric numbers into clear, personalized 5-part family directives (Situation, Impact, Actions, Benefits, Precautions).
3. **Diurnal Schedule Generation (`/planner`):** Generating phase-specific outdoor vs. indoor daily plans matching atmospheric inversion curves.

### 3-Minute Hackathon Demo Script
1. **Introduction (0:00 - 0:30):** Open the landing page. Explain the winter smog crisis in northern plains and how BreatheWise answers the 3 core questions.
2. **Live Dashboard & Inversion Alert (0:30 - 1:15):** Switch to New Delhi. Point out the live CPCB AQI (342 Very Poor), PM2.5 multiples vs. WHO safe limits, and the winter inversion weather banner.
3. **AI Assistant Demo (1:15 - 2:00):** Ask: *"Should my children play outdoors today?"* Show the Gemini-generated structured response with alveolar impact, recess cancellation, and N95 advice.
4. **Clean Air Plan & Indoor Centre (2:00 - 2:30):** Open *My Clean Air Plan*, demonstrate checking off actions and confetti. Open *Indoor Air Centre* and calculate CADR for a 5x4m bedroom.
5. **Impact Calculator & Scenario Testing (2:30 - 3:00):** Adjust commute distance and telecommuting days to show monthly CO2 saved. Go to *Settings* and click *Simulate Severe Smog (425 AQI)* to showcase real-time adaptive response.

### Suggested LinkedIn Post
```text
🌿 Excited to unveil BreatheWise — an AI-powered Planetary Air Quality Platform & Winter Smog Navigator!

Every winter, millions of families battle severe winter smog and toxic PM2.5 without personalized guidance. 

BreatheWise combines real-time Copernicus atmospheric telemetry with Google Gemini GenAI to provide:
✅ Interactive 3D Earth planetary simulation with CPCB Indian NAQI & US EPA standards
✅ Context-aware 5-part family health guidance & AI Smog Assistant
✅ Dynamic daily clean air schedules & True-HEPA CADR sizing
✅ Defensible tailpipe emissions calculations backed by DEFRA factors
✅ Comprehensive Clean Air School with 8 interactive lessons & quizzes

🚀 Live Demo: https://breathewise-visual.vercel.app
🔗 GitHub: https://github.com/KOWSHIKPARSHA4402/BreatheWise-Visual

#AI #Nextjs #GenAI #Gemini #CleanAir #Hackathon #Sustainability #Web3D
```

---

## 8. License & Repository Compliance
- **Repository Size:** < 1 MB (strictly complies with the hackathon rule: < 10 MB).
- **Branch:** Single `main` branch.
- **Public Visibility:** Designed for immediate open-source evaluation.
- **License:** MIT License. Built with integrity for public health.
