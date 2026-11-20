"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  CheckCircle2,
  Award,
  ChevronRight,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  X,
  Lightbulb,
} from "lucide-react";
import { useLocationContext } from "@/context/LocationContext";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface SchoolLesson {
  id: string;
  number: number;
  title: string;
  tagline: string;
  category: string;
  readTime: string;
  intro: string;
  overview: string;
  relatableExample: string;
  takeaways: string[];
  quiz: QuizQuestion;
}

const LESSONS: SchoolLesson[] = [
  {
    id: "lesson-1",
    number: 1,
    title: "Air Quality 101: What Are You Actually Breathing?",
    tagline: "The invisible ocean of gases and particles surrounding us every second.",
    category: "Atmospheric Basics",
    readTime: "2 min",
    intro:
      "Every single day, you inhale roughly 11,000 litres of air — that is equivalent to filling thousands of party balloons inside your chest! You cannot survive more than 3 minutes without breathing.",
    overview:
      "Pure clean air is made of 78% Nitrogen gas, 21% Oxygen gas, and about 0.9% Argon. Toxic air pollution represents less than 0.1% of the total air volume, but because you breathe such a vast quantity of air every day, even microscopic trace concentrations of toxic particulates (PM2.5, PM10) and reactive combustion gases (NO2, SO2, CO, O3) rapidly accumulate inside your lungs and cardiovascular system.",
    relatableExample:
      "Think of clean air like a glass of crystal-clear drinking water. You wouldn't drink a glass of water if someone dropped just a few microscopic drops of motor oil or soot into it. Even though it is 99.9% water, those tiny drops make it toxic. That is exactly what happens with urban air pollution.",
    takeaways: [
      "An average adult inhales approximately 11,000 litres of air every 24 hours.",
      "Clean air is primarily Nitrogen (78%) and Oxygen (21%).",
      "Pollution is mostly invisible to the naked eye, but toxic even in tiny microgram quantities.",
    ],
    quiz: {
      question: "Approximately how much air does an average adult inhale every day?",
      options: ["100 litres", "11,000 litres", "50,000 litres", "500 litres"],
      correctIndex: 1,
      explanation:
        "Correct! We inhale around 11,000 litres of air daily. Because of this massive volume, even tiny concentrations of toxic particles can add up quickly inside our lungs and blood.",
    },
  },
  {
    id: "lesson-2",
    number: 2,
    title: "The AQI Decoded: How the 0–500 Score Works",
    tagline: "The universal health thermometer for outdoor atmospheric quality.",
    category: "Understanding AQI",
    readTime: "3 min",
    intro:
      "Chemical reports measure pollutants in microscopic units like 'micrograms per cubic metre' (µg/m³). To save lives, governments created the Air Quality Index (AQI) to turn complex chemistry into a single 0 to 500 number.",
    overview:
      "Crucially, AQI is NEVER an average of all chemicals! The official Indian CPCB calculation uses the 'Highest Sub-Index Rule': each pollutant is scored independently, and the worst single pollutant sets the overall grade. If five gases are pristine green, but PM2.5 is at hazardous levels (e.g. 420), the overall AQI is graded at 420 (Severe). Your lungs are only as safe as the dirtiest pollutant you inhale.",
    relatableExample:
      "Imagine an allergy test: if you are allergic to peanuts, eating a dish with 99% healthy vegetables and just one crushed peanut will still trigger a severe allergic reaction. The healthy vegetables don't 'cancel out' the allergen. Similarly, clean gases cannot cancel out toxic PM2.5 soot.",
    takeaways: [
      "AQI is a 0 to 500 scale calibrated into 6 health tiers.",
      "AQI is NOT an average — the worst single pollutant determines the overall score.",
      "CPCB NAQI (India) uses specific particulate boundaries tailored for tropical urban environments.",
    ],
    quiz: {
      question: "If PM10 is Good (AQI 40) but PM2.5 is Severe (AQI 380), what is the overall AQI?",
      options: ["210 (the average)", "40 (the best one)", "380 (the worst one)", "0"],
      correctIndex: 2,
      explanation:
        "Spot on! The worst pollutant always sets the overall AQI grade. Your respiratory system is exposed to the highest active toxin, not a diluted average.",
    },
  },
  {
    id: "lesson-3",
    number: 3,
    title: "The Invisible Menace: PM2.5 vs PM10",
    tagline: "Why microscopic size makes all the difference to your cardiovascular health.",
    category: "Pollutant Science",
    readTime: "3 min",
    intro:
      "The most dangerous enemy is the one you cannot see. Particulate Matter (PM) is measured in micrometres (µm). A single human hair is about 70 micrometres wide.",
    overview:
      "PM10 is coarse dust (under 10 µm) — think of pollen, road dust, and construction grit. Your nose hairs, mucus membranes, and upper throat trap most PM10, causing coughs and sneezes. PM2.5, however, is under 2.5 µm — over 30 times thinner than a human hair! It slips right past your body's physical defenses, travels into the deepest alveoli in your lungs, and crosses directly into your bloodstream, causing cardiovascular inflammation, blood clotting, and heart strain.",
    relatableExample:
      "Imagine throwing pebbles at a chain-link tennis court fence — they bounce off (like PM10 caught in your nose). But imagine blowing fine talcum powder or smoke at the same fence — it passes straight through without resistance. PM2.5 is so tiny it treats your lungs like an open gateway.",
    takeaways: [
      "A human hair is 70 µm wide; PM10 is 10 µm, and PM2.5 is only 2.5 µm.",
      "PM10 is coarse dust trapped in your nose and throat.",
      "PM2.5 crosses the lung alveolar membrane directly into red blood vessels.",
    ],
    quiz: {
      question: "Why is PM2.5 considered significantly more hazardous than PM10?",
      options: [
        "It is heavier and falls to the ground quickly",
        "It crosses the lung alveolar membrane directly into the bloodstream",
        "It has a bright fluorescent color that blinds people",
        "It only exists in remote mountain areas",
      ],
      correctIndex: 1,
      explanation:
        "Exactly! Because PM2.5 is microscopic (over 30x thinner than a hair), it bypasses nasal filters and passes directly into the bloodstream, where it causes vascular inflammation and heart strain.",
    },
  },
  {
    id: "lesson-4",
    number: 4,
    title: "Winter Temperature Inversions: The Smog Lid Explained",
    tagline: "Why North Indian winter air turns into thick, unbreathable toxic soup.",
    category: "Weather & Physics",
    readTime: "3 min",
    intro:
      "Have you ever wondered why winter air in Delhi, Lahore, and across northern plains smells like burning soot every morning, even when pollution sources haven't doubled?",
    overview:
      "Normally, air near the ground is warmed by the Earth and rises into the upper atmosphere, carrying vehicle exhaust and smoke away like an invisible chimney. In winter, nights are long, clear, and cold. The ground cools down rapidly, chilling the air right above it, while a warmer air layer remains higher up. This warmer layer acts like a giant glass lid, trapping all vehicle emissions, wood smoke, and dust within the lowest 100 metres where we live and breathe.",
    relatableExample:
      "Imagine cooking soup in a pot without a lid — steam and aromas drift freely upward into the kitchen. Now put a tight transparent glass lid onto the boiling pot — steam and condensed droplets are completely trapped beneath it. That lid is a temperature inversion over a city.",
    takeaways: [
      "In summer, warm ground air naturally lifts pollution away into the sky.",
      "In winter, cold ground air gets trapped beneath a warm air lid (temperature inversion).",
      "Inversions are strongest in the early morning (6 AM – 9 AM) and break up around midday with solar heating.",
    ],
    quiz: {
      question: "When are winter temperature inversions usually at their thickest and most dangerous?",
      options: [
        "Midday at 2:00 PM when the sun is brightest",
        "Early morning between 6:00 AM and 9:00 AM",
        "Late afternoon at 4:00 PM",
        "Only during rainy monsoons",
      ],
      correctIndex: 1,
      explanation:
        "Right! Overnight ground cooling makes the early morning inversion layer most compact. This is why morning jogs in winter smog are especially dangerous.",
    },
  },
  {
    id: "lesson-5",
    number: 5,
    title: "Masks & Filters: What Works (N95) vs What Fails (Cloth)",
    tagline: "The science of personal respiratory defense during severe pollution.",
    category: "Personal Protection",
    readTime: "2 min",
    intro:
      "During smoggy days, millions of people wear cloth bandanas or surgical paper masks. Scientific testing reveals that most of them are breathing pure unfiltered smog.",
    overview:
      "A cloth handkerchief or bandana has woven gaps between 100 to 200 micrometres wide. Trying to stop a 2.5 µm particle with a cloth mask is like trying to catch mosquitos with a soccer goal net! Surgical paper masks leak around the loose edges. Only certified N95, FFP2, or KN95 respirators use electrostatically charged meltblown microfiber webs that physically capture over 95% of ultra-fine particles. An airtight facial seal is non-negotiable.",
    relatableExample:
      "Think of a cloth mask as a chain-link gate and PM2.5 particles as sand flies — they fly right through the gaps. An N95 respirator is like a dense, electrostatically sticky cobweb that traps tiny particles the moment they get near.",
    takeaways: [
      "Cloth masks and surgical masks filter less than 15% of PM2.5 particles.",
      "Certified N95/FFP2 respirators filter at least 95% of airborne particulates.",
      "A snug, airtight seal around your nose and chin is essential for the mask to work.",
    ],
    quiz: {
      question: "Which mask provides certified 95%+ filtration against PM2.5 smog?",
      options: ["Cloth handkerchief", "Certified N95 / FFP2 respirator", "Single-ply surgical paper mask", "Silk scarf"],
      correctIndex: 1,
      explanation:
        "Correct! Certified N95 respirators use electrostatically charged fibers that trap ultra-fine particulates that easily slip through standard cloth weaves.",
    },
  },
  {
    id: "lesson-6",
    number: 6,
    title: "Indoor Air vs Outdoor Air: The Hidden Home Pollution",
    tagline: "Why the air inside your living room can sometimes be dirtier than outside.",
    category: "Indoor Health",
    readTime: "3 min",
    intro:
      "Most people think they are 100% safe once they step inside their home and close the front door. Yet urban humans spend over 85% of their lives indoors, breathing trapped domestic chemicals.",
    overview:
      "Inside modern homes, high-heat oil frying, unventilated gas stoves, dry broom sweeping (which re-suspends settled lead and tire-wear dust), burning mosquito coils, and lighting incense (agarbatti) can create PM2.5 spikes exceeding 500 µg/m³ inside a closed room! Using kitchen exhaust hoods, switching to damp microfiber mopping, and running True HEPA purifiers keep indoor air clean.",
    relatableExample:
      "Burning one traditional mosquito coil inside a closed bedroom releases the same particulate mass as smoking roughly 75 to 100 cigarettes! Always ventilate or switch to electric vaporizers.",
    takeaways: [
      "Cooking fumes, incense, and mosquito coils cause massive indoor PM2.5 spikes.",
      "Dry sweeping with a broom kicks settled dust back into your breathing zone.",
      "Use damp mopping and True HEPA filtration to maintain clean indoor air.",
    ],
    quiz: {
      question: "Which cleaning method prevents re-suspending settled toxic dust into your home air?",
      options: ["Dry broom sweeping", "Damp microfiber mopping", "Using an open feather duster", "Blowing air with a fan"],
      correctIndex: 1,
      explanation:
        "Spot on! Damp mopping traps dust particles on the wet cloth instead of kicking them back into the air where your family breathes them.",
    },
  },
  {
    id: "lesson-7",
    number: 7,
    title: "Protecting Vulnerable Lungs: Children, Seniors & Asthma",
    tagline: "Why children inhale twice as much pollution per kilogram of body weight.",
    category: "Clinical Care",
    readTime: "3 min",
    intro:
      "Air pollution does not affect everyone equally. An active playing child breathes in double the toxic particulate mass per kilogram of body weight compared to an adult.",
    overview:
      "Children are not just miniature adults. Their respiratory rate is nearly double an adult's, and over 80% of their tiny lung alveoli develop after birth up until age 8. Chronic smog exposure during childhood leads to permanent lung capacity deficits and childhood asthma. In elderly individuals and adults with hypertension, inhaling fine particulates causes immediate arterial vasoconstriction, multiplying the risk of heart attacks and strokes.",
    relatableExample:
      "Imagine pouring water into two sponges: a mature, thick kitchen sponge vs a brand-new delicate porous sponge that is still growing. The delicate sponge gets clogged and deformed much faster. Children's growing lungs need extra protection.",
    takeaways: [
      "Children breathe faster and inhale twice as many pollutants per kg of weight.",
      "Developing lungs can suffer irreversible volume reduction from chronic smog exposure.",
      "Vulnerable individuals should avoid outdoor morning recess and exercise during High/Severe AQI.",
    ],
    quiz: {
      question: "Why are young children especially vulnerable to outdoor air pollution?",
      options: [
        "They breathe more air per kilogram of body weight and have developing lungs",
        "They have fewer white blood cells than adults",
        "They only breathe through their mouths",
        "They are immune to smog",
      ],
      correctIndex: 0,
      explanation:
        "Correct! Higher respiratory rates, developing alveoli, and proximity to ground exhaust make children uniquely vulnerable to air pollution.",
    },
  },
  {
    id: "lesson-8",
    number: 8,
    title: "Daily Clean Air Champions: Simple Habits That Cut Exposure",
    tagline: "Practical lifestyle adjustments to minimize both your exposure and your footprint.",
    category: "Lifestyle Habits",
    readTime: "2 min",
    intro:
      "You do not have to feel powerless against smog. By adopting smart daily routines, you can slash your family's personal pollution intake by up to 75%.",
    overview:
      "Five simple habits make all the difference: (1) Check BreatheWise before planning morning walks; (2) Open windows only during the warm afternoon solar window (1 PM – 4 PM); (3) Commute via electric metro train or bus rather than congested traffic lanes; (4) Set vehicle air conditioning to 'Cabin Recirculate'; and (5) Keep bedroom purifiers running on quiet mode overnight for restorative sleep.",
    relatableExample:
      "Think of clean air habits like wearing sunscreen at the beach. You don't have to stay home in a dark room all day — you just apply protection and time your exposure smartly to avoid the worst burn.",
    takeaways: [
      "Timing matters: shift outdoor activities to warm sunny afternoon hours.",
      "Use vehicle AC recirculate mode to block diesel exhaust in traffic.",
      "Consistent small habits cut daily particulate inhalation by over 70%.",
    ],
    quiz: {
      question: "Which car AC setting blocks exhaust fumes from entering the vehicle cabin in traffic?",
      options: ["Fresh Air Intake", "Cabin Recirculate Mode", "Max Defrost", "AC Off with windows down"],
      correctIndex: 1,
      explanation:
        "Awesome! Cabin Recirculate mode closes the exterior intake flap, preventing direct inhalation of toxic diesel exhaust from the vehicle ahead.",
    },
  },
];

/**
 * Custom SVG Scientific Illustration for each lesson
 */
function LessonDiagram({ lessonNumber }: { lessonNumber: number }) {
  if (lessonNumber === 1) {
    // Lesson 1: Atmospheric Composition & Daily 11,000L Lung Inhalation
    return (
      <div className="p-4 rounded-2xl bg-white border border-[#DCECE8] space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#234B55]">
          <span>Scientific Diagram: What Clean Air is Made Of</span>
          <span className="font-mono text-[#6BAEAA]">11,000 Litres / Day</span>
        </div>

        {/* Segmented Bar */}
        <div className="w-full h-8 rounded-xl overflow-hidden flex shadow-inner border border-[#DCECE8]">
          <div style={{ width: "78%" }} className="bg-[#234B55] flex items-center justify-center text-white text-[11px] font-bold">
            Nitrogen (78%)
          </div>
          <div style={{ width: "21%" }} className="bg-[#6BAEAA] flex items-center justify-center text-white text-[11px] font-bold">
            O2 (21%)
          </div>
          <div style={{ width: "1%" }} className="bg-[#E9B978] flex items-center justify-center" title="Trace gases & pollution (0.1%)">
            *
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs text-[#465A60]">
          <div className="p-2 rounded-xl bg-[#F4F8F6]">
            <span className="font-bold text-[#234B55] block">Nitrogen (N2)</span>
            <span>78% Inert Base</span>
          </div>
          <div className="p-2 rounded-xl bg-[#F4F8F6]">
            <span className="font-bold text-[#6BAEAA] block">Oxygen (O2)</span>
            <span>21% Vital Fuel</span>
          </div>
          <div className="p-2 rounded-xl bg-[#F4F8F6]">
            <span className="font-bold text-[#E9B978] block">Pollutants</span>
            <span>&lt;0.1% Micrograms</span>
          </div>
        </div>
      </div>
    );
  }

  if (lessonNumber === 2) {
    // Lesson 2: Worst Pollutant Rule vs False Average
    return (
      <div className="p-4 rounded-2xl bg-white border border-[#DCECE8] space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#234B55]">
          <span>Scientific Diagram: The Highest Sub-Index Rule</span>
          <span className="font-mono text-[#B85450] font-black">Not An Average!</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] space-y-1.5 opacity-60">
            <span className="text-[11px] font-mono uppercase font-bold text-[#B85450] line-through block">
              False Assumption: Mathematical Average
            </span>
            <div className="text-xs space-y-0.5 text-[#465A60]">
              <div>Ozone: 30 (Good)</div>
              <div>SO2: 25 (Good)</div>
              <div>NO2: 45 (Good)</div>
              <div>PM2.5: 420 (Severe)</div>
            </div>
            <div className="pt-1 border-t border-[#DCECE8] text-xs font-bold text-[#465A60]">
              Average = (30+25+45+420)/4 = 130 ❌ <span className="text-[10px] italic">Misleading!</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#6BAEAA]/15 border border-[#6BAEAA] space-y-1.5">
            <span className="text-[11px] font-mono uppercase font-bold text-[#234B55] block">
              Official CPCB Standard: Worst Sub-Index
            </span>
            <div className="text-xs space-y-0.5 text-[#234B55]">
              <div>Ozone: 30</div>
              <div>SO2: 25</div>
              <div>NO2: 45</div>
              <div className="font-bold text-[#B85450]">PM2.5: 420 (Severe Peak)</div>
            </div>
            <div className="pt-1 border-t border-[#6BAEAA]/40 text-xs font-black text-[#B85450]">
              Overall AQI = 420 Severe ✅ <span className="text-[10px] text-[#234B55] font-normal">Protects your lungs!</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (lessonNumber === 3) {
    // Lesson 3: Scale Comparison: Human Hair vs PM10 vs PM2.5
    return (
      <div className="p-4 rounded-2xl bg-white border border-[#DCECE8] space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#234B55]">
          <span>Scientific Scale: Human Hair vs PM10 vs PM2.5</span>
          <span className="font-mono text-[#6BAEAA]">Scale in Micrometres (µm)</span>
        </div>

        {/* Visual Scale SVG Diagram */}
        <div className="relative p-4 rounded-2xl bg-[#F4F8F6] border border-[#DCECE8] flex flex-col md:flex-row items-center justify-around gap-4 text-center">
          {/* Human Hair */}
          <div className="flex flex-col items-center space-y-1">
            <div className="w-20 h-20 rounded-full bg-[#687D83]/20 border-2 border-[#234B55] flex items-center justify-center text-[#234B55] font-black text-xs">
              70 µm
            </div>
            <span className="text-xs font-bold text-[#234B55]">Human Hair</span>
            <span className="text-[10px] text-[#465A60]">Base Reference</span>
          </div>

          <div className="text-lg text-[#6BAEAA] font-bold">➔</div>

          {/* PM10 */}
          <div className="flex flex-col items-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-[#E9B978]/40 border-2 border-[#915B17] flex items-center justify-center text-[#915B17] font-black text-[10px]">
              10 µm
            </div>
            <span className="text-xs font-bold text-[#915B17]">PM10 Dust</span>
            <span className="text-[10px] text-[#465A60]">Caught in nose</span>
          </div>

          <div className="text-lg text-[#6BAEAA] font-bold">➔</div>

          {/* PM2.5 */}
          <div className="flex flex-col items-center space-y-1">
            <div className="w-4 h-4 rounded-full bg-[#B85450] animate-ping" />
            <div className="w-4 h-4 rounded-full bg-[#B85450] -mt-4 border border-white" />
            <span className="text-xs font-black text-[#B85450]">PM2.5 (2.5 µm)</span>
            <span className="text-[10px] text-[#B85450] font-bold">Crosses into Blood!</span>
          </div>
        </div>

        <p className="text-[11px] text-[#465A60] text-center italic">
          Over 28 particles of PM2.5 can fit across the width of a single strand of human hair.
        </p>
      </div>
    );
  }

  if (lessonNumber === 4) {
    // Lesson 4: Winter Temperature Inversion
    return (
      <div className="p-4 rounded-2xl bg-white border border-[#DCECE8] space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#234B55]">
          <span>Scientific Diagram: How Inversion Creates the Smog Lid</span>
          <span className="font-mono text-[#E9B978] font-bold">Thermal Stratification</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Normal Day */}
          <div className="p-3.5 rounded-xl bg-[#DCECE8]/50 border border-[#DCECE8] space-y-2">
            <span className="font-bold text-[#234B55] block">Normal Daytime: Clean Chimney</span>
            <div className="space-y-1 text-[#465A60]">
              <div className="p-1 rounded bg-white text-center text-[11px]">Cool Upper Air (Free Dispersion) ☁️</div>
              <div className="text-center text-xs">↑ Warm Smoke Rises Naturally ↑</div>
              <div className="p-1 rounded bg-[#6BAEAA]/20 text-center text-[11px] font-bold text-[#234B55]">Sun-Warmed Ground</div>
            </div>
            <p className="text-[10px] text-[#465A60] leading-tight">Pollution rises away and disperses cleanly.</p>
          </div>

          {/* Winter Inversion */}
          <div className="p-3.5 rounded-xl bg-[#B85450]/10 border border-[#B85450]/30 space-y-2">
            <span className="font-bold text-[#B85450] block">Winter Inversion: The Smog Lid</span>
            <div className="space-y-1 text-[#234B55]">
              <div className="p-1.5 rounded bg-[#E9B978]/30 text-center text-[11px] font-black text-[#915B17]">
                🔥 WARM AIR INVERSION LID (100m) 🔥
              </div>
              <div className="p-1 rounded bg-[#B85450]/20 text-center text-[11px] font-bold text-[#B85450]">
                Trapped Vehicle Smoke &amp; Soot 🚗🏭
              </div>
              <div className="p-1 rounded bg-blue-100 text-center text-[11px] text-blue-900 font-bold">
                Freezing Cold Ground Air
              </div>
            </div>
            <p className="text-[10px] text-[#B85450] font-semibold leading-tight">Warm layer traps all pollution at street level.</p>
          </div>
        </div>
      </div>
    );
  }

  if (lessonNumber === 5) {
    // Lesson 5: N95 vs Cloth Mask Microscopic Mesh
    return (
      <div className="p-4 rounded-2xl bg-white border border-[#DCECE8] space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#234B55]">
          <span>Scientific Diagram: Filter Fiber Mesh Comparison</span>
          <span className="font-mono text-[#4A9E86] font-bold">Microscopic Pore Size</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#B85450]">Cloth &amp; Surgical Masks</span>
              <X className="w-4 h-4 text-[#B85450]" />
            </div>
            <p className="text-[11px] text-[#465A60] leading-relaxed">
              Weave gaps are <strong>100 to 200 µm wide</strong>. Microscopic PM2.5 particles (2.5 µm) pass freely straight through the holes and loose edge gaps.
            </p>
            <div className="text-[10px] font-bold text-[#B85450]">Filtration efficiency: &lt;15% against PM2.5</div>
          </div>

          <div className="p-3 rounded-xl bg-[#6BAEAA]/15 border border-[#6BAEAA] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#234B55]">Certified N95 / FFP2 Respirator</span>
              <Check className="w-4 h-4 text-[#4A9E86]" />
            </div>
            <p className="text-[11px] text-[#234B55]/90 leading-relaxed">
              Electrostatically charged meltblown polymer fibers create a sticky 3D matrix. Particles are pulled in and trapped by electrostatic attraction.
            </p>
            <div className="text-[10px] font-black text-[#4A9E86]">Filtration efficiency: &gt;95% of fine particles</div>
          </div>
        </div>
      </div>
    );
  }

  if (lessonNumber === 6) {
    // Lesson 6: Indoor Air Cutaway
    return (
      <div className="p-4 rounded-2xl bg-white border border-[#DCECE8] space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#234B55]">
          <span>Scientific Diagram: Indoor Domestic Emission Hotspots</span>
          <span className="font-mono text-[#E9B978] font-bold">PM2.5 Concentrations</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-[#B85450]/15 border border-[#B85450]/30 space-y-1">
            <span className="font-black text-[#B85450] block">450+ µg/m³</span>
            <span className="text-[10px] font-bold text-[#234B55]">Hot Oil Frying</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#B85450]/15 border border-[#B85450]/30 space-y-1">
            <span className="font-black text-[#B85450] block">350+ µg/m³</span>
            <span className="text-[10px] font-bold text-[#234B55]">Incense / Agarbatti</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#E9B978]/25 border border-[#E9B978]/50 space-y-1">
            <span className="font-black text-[#915B17] block">180+ µg/m³</span>
            <span className="text-[10px] font-bold text-[#234B55]">Dry Broom Sweeping</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#4A9E86]/15 border border-[#4A9E86]/40 space-y-1">
            <span className="font-black text-[#4A9E86] block">10–15 µg/m³</span>
            <span className="text-[10px] font-bold text-[#234B55]">True HEPA Purifier</span>
          </div>
        </div>
      </div>
    );
  }

  if (lessonNumber === 7) {
    // Lesson 7: Child vs Adult Breathing Volume
    return (
      <div className="p-4 rounded-2xl bg-white border border-[#DCECE8] space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#234B55]">
          <span>Scientific Diagram: Pediatric Vulnerability Factors</span>
          <span className="font-mono text-[#B85450] font-bold">Double Exposure Rate</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#234B55]">
          <div className="p-3 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] space-y-1 text-center">
            <span className="text-base font-black text-[#B85450] block">2x Faster</span>
            <span className="font-bold block">Breathing Rate</span>
            <span className="text-[10px] text-[#465A60]">20–30 breaths/min vs 12–16 in adults</span>
          </div>
          <div className="p-3 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] space-y-1 text-center">
            <span className="text-base font-black text-[#B85450] block">80% Postnatal</span>
            <span className="font-bold block">Alveoli Growth</span>
            <span className="text-[10px] text-[#465A60]">Lungs multiply alveoli until age 8</span>
          </div>
          <div className="p-3 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] space-y-1 text-center">
            <span className="text-base font-black text-[#B85450] block">Double Dose</span>
            <span className="font-bold block">Particulate Intake</span>
            <span className="text-[10px] text-[#465A60]">Per kilogram of total body weight</span>
          </div>
        </div>
      </div>
    );
  }

  // Lesson 8: 24-Hour Diurnal Exposure Shield
  return (
    <div className="p-4 rounded-2xl bg-white border border-[#DCECE8] space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-[#234B55]">
        <span>Scientific Diagram: The 24-Hour Diurnal Shield</span>
        <span className="font-mono text-[#4A9E86] font-bold">Exposure Cut by 75%</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] space-y-0.5">
          <span className="text-[10px] font-mono uppercase font-bold text-[#465A60]">7 AM – 9 AM</span>
          <span className="font-bold text-[#234B55] block">Seal Windows</span>
          <span className="text-[10px] text-[#465A60]">Inversion peak; N95 in transit</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#6BAEAA]/15 border border-[#6BAEAA]/40 space-y-0.5">
          <span className="text-[10px] font-mono uppercase font-bold text-[#6BAEAA]">1 PM – 4 PM</span>
          <span className="font-bold text-[#234B55] block">Ventilate Home</span>
          <span className="text-[10px] text-[#465A60]">Solar window cleans air</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#F4F8F6] border border-[#DCECE8] space-y-0.5">
          <span className="text-[10px] font-mono uppercase font-bold text-[#465A60]">6 PM – 8 PM</span>
          <span className="font-bold text-[#234B55] block">Damp Mopping</span>
          <span className="text-[10px] text-[#465A60]">Avoid dry broom sweeping</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#234B55] text-white rounded-xl space-y-0.5">
          <span className="text-[10px] font-mono uppercase font-bold text-[#A9D5C8]">10 PM – 6 AM</span>
          <span className="font-bold block">Bedroom HEPA</span>
          <span className="text-[10px] text-[#DCECE8]">Quiet restorative REM sleep</span>
        </div>
      </div>
    </div>
  );
}

export default function AirQualitySchool() {
  const { schoolProgress, markLessonComplete } = useLocationContext();
  const [selectedLessonId, setSelectedLessonId] = useState<string>("lesson-1");
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const activeLesson = LESSONS.find((l) => l.id === selectedLessonId) || LESSONS[0];

  const completedCount = LESSONS.filter((l) => schoolProgress[l.id]).length;
  const progressPercent = Math.round((completedCount / LESSONS.length) * 100);

  const handleSelectLesson = (id: string) => {
    setSelectedLessonId(id);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleAnswerQuiz = (index: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswer(index);
  };

  const handleSubmitQuiz = () => {
    if (selectedQuizAnswer === null) return;
    setQuizSubmitted(true);
    if (selectedQuizAnswer === activeLesson.quiz.correctIndex) {
      markLessonComplete(activeLesson.id);
    }
  };

  const handleNextLesson = () => {
    const currentIndex = LESSONS.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex < LESSONS.length - 1) {
      handleSelectLesson(LESSONS[currentIndex + 1].id);
    }
  };

  return (
    <div className="w-full liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md space-y-6">
      {/* Academy Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCECE8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#465A60] font-bold">
            <GraduationCap className="w-4 h-4 text-[#6BAEAA]" />
            <span>Interactive Clean Air Academy</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#234B55] tracking-tight mt-1">
            Air Quality School: 8 Interactive Visual Lessons
          </h3>
        </div>

        {/* Progress Display */}
        <div className="flex items-center gap-3 bg-white/85 px-4 py-2.5 rounded-2xl border border-[#DCECE8] shadow-sm">
          <Award className="w-5 h-5 text-[#6BAEAA]" />
          <div>
            <div className="flex items-center justify-between gap-4 text-xs font-bold text-[#234B55]">
              <span>Academy Progress</span>
              <span className="font-mono text-[#6BAEAA] font-black">{completedCount} / {LESSONS.length} Complete</span>
            </div>
            <div className="w-36 h-2 bg-[#DCECE8] rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-[#6BAEAA] to-[#234B55] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Classroom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Lesson Directory (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#465A60] block px-1">
            Curriculum Lessons
          </span>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {LESSONS.map((lesson) => {
              const isSelected = lesson.id === activeLesson.id;
              const isCompleted = schoolProgress[lesson.id];

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson.id)}
                  className={`w-full p-3.5 rounded-2xl text-left transition-all border flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-white text-[#234B55] border-[#6BAEAA] shadow-md ring-2 ring-[#6BAEAA]/20 font-bold"
                      : "bg-white/60 text-[#465A60] border-[#DCECE8] hover:bg-white/90 hover:text-[#234B55]"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        isCompleted
                          ? "bg-[#6BAEAA] text-white"
                          : isSelected
                          ? "bg-[#234B55] text-white"
                          : "bg-[#DCECE8] text-[#234B55]"
                      }`}
                    >
                      {isCompleted ? "✓" : lesson.number}
                    </span>
                    <div className="truncate">
                      <span className="text-xs sm:text-sm font-bold block truncate text-[#234B55]">
                        {lesson.title.split(":")[1]?.trim() || lesson.title}
                      </span>
                      <span className="text-[11px] text-[#465A60] font-mono">
                        {lesson.category} · {lesson.readTime}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#465A60] shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Lesson Content, Diagram & Interactive Quiz (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white/85 border border-[#DCECE8] shadow-sm space-y-6">
          {/* Lesson Header */}
          <div className="space-y-2 pb-4 border-b border-[#DCECE8]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-[#6BAEAA] bg-[#6BAEAA]/15 px-3 py-1 rounded-full border border-[#6BAEAA]/30">
                Lesson {activeLesson.number} of {LESSONS.length} · {activeLesson.category}
              </span>
              {schoolProgress[activeLesson.id] && (
                <span className="flex items-center gap-1.5 text-xs text-[#234B55] font-bold bg-[#4A9E86]/15 px-3 py-1 rounded-full border border-[#4A9E86]/30">
                  <CheckCircle2 className="w-4 h-4 text-[#4A9E86]" />
                  <span>Mastered</span>
                </span>
              )}
            </div>

            <h4 className="text-lg sm:text-2xl font-black text-[#234B55] tracking-tight">
              {activeLesson.title}
            </h4>

            <p className="text-xs sm:text-sm text-[#465A60] italic">
              {activeLesson.tagline}
            </p>
          </div>

          {/* Lesson Intro Banner */}
          <div className="p-4 rounded-2xl bg-[#DCECE8]/40 border border-[#DCECE8] text-xs sm:text-sm text-[#234B55] leading-relaxed font-medium">
            {activeLesson.intro}
          </div>

          {/* Scientific Illustration / Diagram for This Lesson */}
          <LessonDiagram lessonNumber={activeLesson.number} />

          {/* Simple Explanation */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-[#234B55] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6BAEAA]" />
              <span>Simple Science Explanation:</span>
            </h5>
            <p className="text-xs sm:text-sm text-[#234B55]/95 leading-relaxed">
              {activeLesson.overview}
            </p>
          </div>

          {/* Relatable Everyday Example */}
          <div className="p-4 rounded-2xl bg-[#F4F8F6] border border-[#DCECE8] space-y-1.5">
            <span className="text-xs font-bold text-[#234B55] flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#E9B978]" />
              <span>Relatable Everyday Analogy:</span>
            </span>
            <p className="text-xs sm:text-sm text-[#234B55]/90 leading-relaxed italic">
              &quot;{activeLesson.relatableExample}&quot;
            </p>
          </div>

          {/* Key Takeaways */}
          <div className="p-4 rounded-2xl bg-white border border-[#DCECE8] space-y-2">
            <span className="text-xs font-bold text-[#234B55] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#4A9E86]" />
              <span>Important Points to Remember:</span>
            </span>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#234B55]/90">
              {activeLesson.takeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6BAEAA] mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Knowledge Check Quiz */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#DCECE8]/45 border border-[#DCECE8] space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-[#234B55] text-white">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#234B55]">
                Quick Knowledge Check: Test What You Learned
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-[#234B55]">
              {activeLesson.quiz.question}
            </p>

            <div className="space-y-2">
              {activeLesson.quiz.options.map((option, idx) => {
                const isSelected = selectedQuizAnswer === idx;
                const isCorrect = idx === activeLesson.quiz.correctIndex;
                let btnStyle = "bg-white text-[#234B55] border-[#DCECE8] hover:bg-white/95";

                if (quizSubmitted) {
                  if (isCorrect) {
                    btnStyle = "bg-[#4A9E86]/20 text-[#234B55] border-[#4A9E86] font-bold";
                  } else if (isSelected) {
                    btnStyle = "bg-[#B85450]/20 text-[#B85450] border-[#B85450]/40";
                  } else {
                    btnStyle = "bg-white/60 text-[#465A60] border-[#DCECE8] opacity-60";
                  }
                } else if (isSelected) {
                  btnStyle = "bg-white text-[#234B55] border-[#6BAEAA] ring-2 ring-[#6BAEAA]/40 font-bold";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAnswerQuiz(idx)}
                    disabled={quizSubmitted}
                    className={`w-full p-3.5 rounded-xl text-left text-xs sm:text-sm transition-all border flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {quizSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-[#4A9E86] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quiz Feedback */}
            {quizSubmitted && (
              <div
                className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed animate-fadeIn ${
                  selectedQuizAnswer === activeLesson.quiz.correctIndex
                    ? "bg-[#4A9E86]/15 border-[#4A9E86]/40 text-[#234B55]"
                    : "bg-[#E9B978]/25 border-[#E9B978]/50 text-[#915B17]"
                }`}
              >
                {activeLesson.quiz.explanation}
              </div>
            )}

            {/* Quiz Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              {!quizSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={selectedQuizAnswer === null}
                  className="px-6 py-2.5 rounded-xl bg-[#234B55] hover:bg-[#1A373E] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 shadow-sm glow-btn"
                >
                  Check My Answer
                </button>
              ) : (
                <div className="flex items-center gap-3 w-full justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedQuizAnswer(null);
                    }}
                    className="flex items-center gap-1.5 text-xs sm:text-sm text-[#465A60] hover:text-[#234B55] font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>

                  {activeLesson.number < LESSONS.length && (
                    <button
                      type="button"
                      onClick={handleNextLesson}
                      className="px-5 py-2.5 rounded-xl bg-[#234B55] hover:bg-[#1A373E] text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm glow-btn"
                    >
                      <span>Next Lesson</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
