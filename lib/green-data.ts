// BreatheWise - Green Choices Data with Real-Time AQI Sensitivity

export interface GreenChoice {
  id: string;
  title: string;
  category: "Commute & Transit" | "Errands & Shopping" | "Heating & Winter Habits" | "Household Energy" | "Community Action";
  description: string;
  aqiCondition: "any" | "good_moderate_only" | "severe_emergency";
  recommendedAction: string;
  tailpipeImpact: string;
  healthImpact: string;
  costImpact: "Lowers Costs" | "Neutral" | "Small Investment" | "Free / Habitual";
  practicalityRating: number; // 1 to 5 stars
  badgeText: string;
}

export const GREEN_CHOICES: GreenChoice[] = [
  {
    id: "metro-rail-transit",
    title: "Switch to Electric Metro & Rapid Rail",
    category: "Commute & Transit",
    description: "Replaces solo vehicle driving on congested corridors with zero-tailpipe electric urban rail.",
    aqiCondition: "any",
    recommendedAction: "Use metro rail systems for daily work commutes. Underground and elevated rail cabins are typically enclosed and experience far lower direct tailpipe soot than street-level traffic jams.",
    tailpipeImpact: "Saves ~135g of CO2e per passenger-kilometer compared to solo petrol cars.",
    healthImpact: "Avoids inhaling concentrated street-level black carbon emissions from vehicle exhaust pipes.",
    costImpact: "Lowers Costs",
    practicalityRating: 5,
    badgeText: "High Impact Commute",
  },
  {
    id: "trip-chaining",
    title: "Trip Chaining (Consolidated Errand Planning)",
    category: "Errands & Shopping",
    description: "Combines multiple single-destination errands (groceries, pharmacy, bank, dry cleaning) into one planned circuit.",
    aqiCondition: "any",
    recommendedAction: "Plan errands for a single dedicated evening or weekend trip rather than making multiple spontaneous cold-start vehicle trips throughout the week.",
    tailpipeImpact: "Cuts errand fuel burn and cold-engine start emissions by up to 40%.",
    healthImpact: "Reduces overall time spent on congested roadways and parking lots.",
    costImpact: "Lowers Costs",
    practicalityRating: 5,
    badgeText: "Zero-Cost Habit",
  },
  {
    id: "anti-idling",
    title: "Zero-Idling at Traffic Lights & School Drop-Offs",
    category: "Commute & Transit",
    description: "Turning off vehicle combustion engines when stopped for more than 10-15 seconds at signals, railway crossings, or pickup zones.",
    aqiCondition: "any",
    recommendedAction: "Turn off your engine while waiting for school dismissals or prolonged red signals. An idling car produces twice the toxic emissions of a car in motion.",
    tailpipeImpact: "Conserves approximately 1.5–2.0 liters of fuel per hour of idling avoided.",
    healthImpact: "Prevents high concentrations of carbon monoxide and raw hydrocarbons from pooling at children's breathing height outside school gates.",
    costImpact: "Lowers Costs",
    practicalityRating: 5,
    badgeText: "Child Protection",
  },
  {
    id: "clean-heating-alternatives",
    title: "Electric Radiant Heating vs. Wood/Kerosene",
    category: "Heating & Winter Habits",
    description: "Eliminating indoor solid biomass, wood stoves, or unvented kerosene heaters during cold winter nights.",
    aqiCondition: "any",
    recommendedAction: "Use electric oil-filled radiators, ceramic PTC heaters, or heat pumps. Never burn waste, plastic, or damp firewood for roadside warmth.",
    tailpipeImpact: "Eliminates heavy carcinogenic polycyclic aromatic hydrocarbons (PAHs) and soot plumes.",
    healthImpact: "Dramatically reduces acute carbon monoxide poisoning risks and nocturnal asthma attacks.",
    costImpact: "Neutral",
    practicalityRating: 4,
    badgeText: "Winter Health Essential",
  },
  {
    id: "active-cycling-good-days",
    title: "Active Cycling & Walking (Clean Air Days Only)",
    category: "Commute & Transit",
    description: "Zero-emission active transit for short neighborhood trips under 3 km when air quality is genuinely safe.",
    aqiCondition: "good_moderate_only",
    recommendedAction: "When BreatheWise shows AQI in the Good (0-50) or Satisfactory (51-100) range, walk or bicycle for local errands instead of taking a car or motorcycle.",
    tailpipeImpact: "100% elimination of combustion emissions for the trip.",
    healthImpact: "High cardiovascular benefit—ONLY when ambient AQI is verified clean.",
    costImpact: "Lowers Costs",
    practicalityRating: 4,
    badgeText: "Safe AQI Only",
  },
  {
    id: "telecommuting-severe-smog",
    title: "Strategic Remote Work (WFH) on Severe Smog Days",
    category: "Commute & Transit",
    description: "Coordinating with employers to work from home when regional winter smog reaches 'Very Poor' or 'Severe' (>300 AQI).",
    aqiCondition: "severe_emergency",
    recommendedAction: "Request or schedule remote work during declared emergency smog periods to avoid peak-hour highway congestion and protect vulnerable family members.",
    tailpipeImpact: "Saves entire round-trip vehicle emissions (5–20 kg CO2 per employee).",
    healthImpact: "Avoids 1–2 hours of toxic smog inhalation during temperature inversion peaks.",
    costImpact: "Lowers Costs",
    practicalityRating: 4,
    badgeText: "Emergency Smog Protocol",
  },
  {
    id: "community-burning-vigilance",
    title: "Zero Waste Burning & Municipal Reporting",
    category: "Community Action",
    description: "Reporting illegal municipal solid waste, leaf, and plastic burning in your neighborhood.",
    aqiCondition: "any",
    recommendedAction: "Use official municipal helpline apps (such as CPCB's Sameer App in India or municipal hotlines) to report open waste fires with geo-tagged photos immediately.",
    tailpipeImpact: "Prevents toxic dioxin, furan, and dense PM2.5 smoke plumes from engulfing residential neighborhoods.",
    healthImpact: "Protects thousands of neighboring residents from toxic chemical smoke.",
    costImpact: "Free / Habitual",
    practicalityRating: 5,
    badgeText: "Civic Leadership",
  },
];
