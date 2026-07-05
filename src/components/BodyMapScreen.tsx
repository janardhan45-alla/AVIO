import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, EmergencyCategory } from "../types";
import {
  ArrowLeft,
  AlertTriangle,
  Stethoscope,
  Activity,
  Heart,
  PhoneCall,
  Flame,
  ShieldAlert
} from "lucide-react";

interface BodyMapScreenProps {
  profile: UserProfile;
  onBack: () => void;
  onSelectCategory: (category: EmergencyCategory) => void;
  onCallAmbulance: () => void;
}

type BodyZone = "HEAD" | "CHEST" | "ABDOMEN" | "ARMS" | "LEGS";

export default function BodyMapScreen({
  profile,
  onBack,
  onSelectCategory,
  onCallAmbulance
}: BodyMapScreenProps) {
  const [selectedZone, setSelectedZone] = useState<BodyZone>("CHEST");
  const lang = profile.preferredLanguage;

  // Bilingual Symptoms Database
  const zoneDetails = {
    HEAD: {
      titleEn: "Head & Neck",
      titleTel: "తల & మెడ",
      causesEn: "Seizures / Fits, Head Trauma, Neck fracture, Concussion, Stroke.",
      causesTel: "మూర్ఛ / ఫిట్స్, తలకు గాయం, మెడ ఫ్రాక్చర్, పక్షవాతం.",
      redFlagsEn: "Loss of consciousness, foaming at the mouth, stiff neck, dilated unequal pupils, sudden extreme slurred speech.",
      redFlagsTel: "స్పృహ కోల్పోవడం, నోట్లో నురుగు రావడం, మెడ బిగుసుకుపోవడం, తీవ్రమైన తలనొప్పి, మాట తడబడటం.",
      specialistEn: "Neurologist, Neurosurgeon, Emergency Critical Care Physician.",
      specialistTel: "న్యూరాలజిస్ట్, న్యూరోసర్జన్, ఎమర్జెన్సీ క్రిటికల్ కేర్ డాక్టర్.",
      routes: [
        { labelEn: "Launch Seizure Protocol", labelTel: "మూర్ఛ ప్రథమ చికిత్స ప్రారంభించు", category: "SEIZURE" as EmergencyCategory }
      ],
      escalateImmediate: true
    },
    CHEST: {
      titleEn: "Chest",
      titleTel: "ఛాతీ (Chest)",
      causesEn: "Cardiac Arrest, Choking, Severe Drowning asphyxiation, Chemical inhalation.",
      causesTel: "గుండెపోటు, ఊపిరాడకపోవడం, నీటిలో మునిగి గాలి అందకపోవడం.",
      redFlagsEn: "Crushing squeezing pain spreading to left arm/jaw, total absence of pulse, bluish lips or nails (hypoxia).",
      redFlagsTel: "ఎడమ చేయి/దవడకు వ్యాపించే తీవ్ర ఛాతీ నొప్పి, పల్స్ లేకపోవడం, పెదవులు లేదా గోర్లు నీలంగా మారడం.",
      specialistEn: "Cardiologist, Pulmonologist, Emergency Specialist.",
      specialistTel: "కార్డియాలజిస్ట్, పల్మనాలజిస్ట్, అత్యవసర చికిత్స నిపుణుడు.",
      routes: [
        { labelEn: "Launch Heart Attack Protocol", labelTel: "గుండెపోటు చికిత్స ప్రారంభించు", category: "HEART_ATTACK" as EmergencyCategory },
        { labelEn: "Launch Drowning / CPR Protocol", labelTel: "మునిగిపోవడం / CPR ప్రారంభించు", category: "DROWNING" as EmergencyCategory }
      ],
      escalateImmediate: true
    },
    ABDOMEN: {
      titleEn: "Abdomen",
      titleTel: "పొట్ట భాగం (Abdomen)",
      causesEn: "Internal bleeding, severe poisoning / chemical ingestion, appendix rupture.",
      causesTel: "అంతర్గత రక్తస్రావం, విషం/రసాయనాలు తాగడం, అపెండిక్స్ పగలడం.",
      redFlagsEn: "Abdomen feels rigid or hard like wood, vomiting active blood, sudden severe stabbing abdominal cramps.",
      redFlagsTel: "పొట్ట భాగం గట్టిగా రాయిలా మారడం, రక్తం కక్కడం, తీవ్రమైన కడుపు నొప్పి.",
      specialistEn: "Gastroenterologist, General Trauma Surgeon.",
      specialistTel: "గ్యాస్ట్రోఎంటరాలజిస్ట్, జనరల్ ట్రామా సర్జన్.",
      routes: [], // High immediate risk of internal poisoning or hemorrhage, directs to CALL 108
      escalateImmediate: true
    },
    ARMS: {
      titleEn: "Arms & Hands",
      titleTel: "చేతులు (Arms)",
      causesEn: "Severe lacerations (Bleeding), High voltage electrical burns, Snakebite on hands, Fractures.",
      causesTel: "తీవ్రమైన గాయం (రక్తస్రావం), కరెంట్ షాక్ కాలిన గాయాలు, చేతిపై పాము కాటు.",
      redFlagsEn: "Active spurting blood (arterial cut), bone visible through flesh, severe rapid swelling after snakebite, entry-point electrical burns.",
      redFlagsTel: "గాయం నుండి రక్తం చిమ్మడం, ఎముక బయటకు కనిపించడం, కరెంట్ షాక్ తగిలిన గుర్తులు.",
      specialistEn: "Orthopedic Surgeon, Vascular Surgeon, Burn Specialist.",
      specialistTel: "ఆర్థోపెడిక్ సర్జన్, వాస్కులర్ సర్జన్, కాలిన గాయాల నిపుణుడు.",
      routes: [
        { labelEn: "Bleeding First-Aid", labelTel: "రక్తస్రావం ప్రథమ చికిత్స", category: "BLEEDING" as EmergencyCategory },
        { labelEn: "Snakebite Protocol", labelTel: "పాము కాటు ప్రథమ చికిత్స", category: "SNAKEBITE" as EmergencyCategory },
        { labelEn: "Electric Shock Protocol", labelTel: "విద్యుత్ షాక్ చికిత్స", category: "ELECTRIC_SHOCK" as EmergencyCategory }
      ],
      escalateImmediate: false
    },
    LEGS: {
      titleEn: "Legs & Feet",
      titleTel: "కాళ్ళు (Legs)",
      causesEn: "Ground snakebites, deep compound cuts, heavy bleeding, high-voltage grounding shock.",
      causesTel: "నేలపై పాము కాట్లు, లోతైన గాయాలు, రక్తస్రావం, కరెంట్ షాక్.",
      redFlagsEn: "Rapidly spreading swelling and dark discoloration, failure to detect pulse in foot, bone protrusion, heavy blood pool.",
      redFlagsTel: "వేగంగా వ్యాపించే వాపు మరియు చర్మం నల్లబడటం, పాదంలో పల్స్ అందకపోవడం, భారీగా రక్తం కారడం.",
      specialistEn: "Orthopedic Surgeon, Vascular Specialist.",
      specialistTel: "ఆర్థోపెడిక్ సర్జన్, వాస్కులర్ నిపుణుడు.",
      routes: [
        { labelEn: "Snakebite Protocol", labelTel: "పాము కాటు ప్రథమ చికిత్స", category: "SNAKEBITE" as EmergencyCategory },
        { labelEn: "Bleeding First-Aid", labelTel: "రక్తస్రావం ప్రథమ చికిత్స", category: "BLEEDING" as EmergencyCategory },
        { labelEn: "Electric Shock Protocol", labelTel: "విద్యుత్ షాక్ చికిత్స", category: "ELECTRIC_SHOCK" as EmergencyCategory }
      ],
      escalateImmediate: false
    }
  };

  const currentDetails = zoneDetails[selectedZone];

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <button
          type="button"
          id="bodymap-back-btn"
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-rose-600 font-semibold text-xs cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "English" ? "Back to Dashboard" : "డాష్‌బోర్డ్‌కి తిరిగి వెళ్లు"}
        </button>
        <span className="text-xs font-mono font-bold text-slate-400 uppercase">
          Anatomical Triage
        </span>
      </div>

      {/* Screen Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold font-sans">
            {lang === "English" ? "Interactive Human Body Map" : "శరీర మ్యాప్ ట్రియాజ్"}
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {lang === "English"
              ? "Tap localized zones on the silhouette to diagnose symptoms and trigger targeted protocols."
              : "అత్యవసర సూచనల కోసం అవయవాలపై నొక్కండి."}
          </p>
        </div>
        <div className="w-9 h-9 bg-rose-500/10 text-rose-400 rounded-lg flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: INTERACTIVE SVG SILHOUETTE */}
        <div className="md:col-span-5 bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[360px] relative shadow-inner">
          <span className="absolute top-3 left-3 text-[9px] font-mono font-bold text-slate-400 uppercase">
            {lang === "English" ? "Interactive Canvas" : "ఇంటరాక్టివ్ కాన్వాస్"}
          </span>

          {/* Fully custom vector human body silhouette */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 400"
            className="w-full max-w-[200px] h-auto drop-shadow-md"
            id="vector-silhouette-svg"
          >
            {/* BACKGROUND BASE SILHOUETTE (Gray) */}
            <g fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5">
              {/* Head */}
              <circle cx="100" cy="45" r="22" />
              {/* Neck */}
              <rect x="94" y="66" width="12" height="12" rx="2" />
              {/* Torso */}
              <path d="M72,78 L128,78 C134,78 136,88 136,98 L130,210 C130,216 124,222 118,222 L82,222 C76,222 70,216 70,210 L64,98 C64,88 66,78 72,78 Z" />
              {/* Left Arm */}
              <path d="M60,82 L38,150 C35,160 25,170 30,180 C35,190 45,185 46,175 L62,110 Z" />
              {/* Right Arm */}
              <path d="M140,82 L162,150 C165,160 175,170 170,180 C165,190 155,185 154,175 L138,110 Z" />
              {/* Left Leg */}
              <path d="M74,222 L64,370 C63,380 75,385 82,385 C89,385 86,375 88,360 L94,222 Z" />
              {/* Right Leg */}
              <path d="M126,222 L136,370 C137,380 125,385 118,385 C111,385 114,375 112,360 L106,222 Z" />
            </g>

            {/* INTERACTIVE TAP HOTSPOTS (Colored on selection) */}
            
            {/* 1. HEAD/NECK HOTSPOT */}
            <g
              onClick={() => setSelectedZone("HEAD")}
              className="cursor-pointer group"
              id="hotspot-head"
            >
              <circle
                cx="100"
                cy="45"
                r="24"
                fill={selectedZone === "HEAD" ? "rgba(239, 68, 68, 0.25)" : "transparent"}
                stroke={selectedZone === "HEAD" ? "#EF4444" : "transparent"}
                strokeWidth="2.5"
                className="transition-all duration-200 group-hover:fill-red-500/10 group-hover:stroke-red-500/50"
              />
              <circle cx="100" cy="45" r="6" fill={selectedZone === "HEAD" ? "#EF4444" : "#94A3B8"} className="animate-pulse" />
              {/* Neck connector */}
              <rect
                x="92"
                y="64"
                width="16"
                height="10"
                fill={selectedZone === "HEAD" ? "rgba(239, 68, 68, 0.25)" : "transparent"}
              />
            </g>

            {/* 2. CHEST HOTSPOT */}
            <g
              onClick={() => setSelectedZone("CHEST")}
              className="cursor-pointer group"
              id="hotspot-chest"
            >
              <path
                d="M71,84 L129,84 C132,84 133,90 133,100 L130,145 L70,145 L67,100 C67,90 68,84 71,84 Z"
                fill={selectedZone === "CHEST" ? "rgba(239, 68, 68, 0.25)" : "transparent"}
                stroke={selectedZone === "CHEST" ? "#EF4444" : "transparent"}
                strokeWidth="2.5"
                className="transition-all duration-200 group-hover:fill-red-500/10 group-hover:stroke-red-500/50"
              />
              <circle cx="100" cy="115" r="6" fill={selectedZone === "CHEST" ? "#EF4444" : "#94A3B8"} className="animate-pulse" />
            </g>

            {/* 3. ABDOMEN HOTSPOT */}
            <g
              onClick={() => setSelectedZone("ABDOMEN")}
              className="cursor-pointer group"
              id="hotspot-abdomen"
            >
              <path
                d="M70,148 L130,148 L126,218 C126,220 120,221 118,221 L82,221 C80,221 74,220 74,218 Z"
                fill={selectedZone === "ABDOMEN" ? "rgba(239, 68, 68, 0.25)" : "transparent"}
                stroke={selectedZone === "ABDOMEN" ? "#EF4444" : "transparent"}
                strokeWidth="2.5"
                className="transition-all duration-200 group-hover:fill-red-500/10 group-hover:stroke-red-500/50"
              />
              <circle cx="100" cy="180" r="6" fill={selectedZone === "ABDOMEN" ? "#EF4444" : "#94A3B8"} className="animate-pulse" />
            </g>

            {/* 4. ARMS HOTSPOT */}
            <g
              onClick={() => setSelectedZone("ARMS")}
              className="cursor-pointer group"
              id="hotspot-arms"
            >
              {/* Left Arm overlay */}
              <path
                d="M58,82 L34,152 C31,162 21,172 26,182 C31,192 41,187 42,177 L59,106 Z"
                fill={selectedZone === "ARMS" ? "rgba(239, 68, 68, 0.25)" : "transparent"}
                stroke={selectedZone === "ARMS" ? "#EF4444" : "transparent"}
                strokeWidth="2"
                className="transition-all duration-200 group-hover:fill-red-500/10"
              />
              {/* Right Arm overlay */}
              <path
                d="M142,82 L166,152 C169,162 179,172 174,182 C169,192 159,187 158,177 L141,106 Z"
                fill={selectedZone === "ARMS" ? "rgba(239, 68, 68, 0.25)" : "transparent"}
                stroke={selectedZone === "ARMS" ? "#EF4444" : "transparent"}
                strokeWidth="2"
                className="transition-all duration-200 group-hover:fill-red-500/10"
              />
              <circle cx="36" cy="148" r="5" fill={selectedZone === "ARMS" ? "#EF4444" : "#94A3B8"} className="animate-pulse" />
              <circle cx="164" cy="148" r="5" fill={selectedZone === "ARMS" ? "#EF4444" : "#94A3B8"} className="animate-pulse" />
            </g>

            {/* 5. LEGS HOTSPOT */}
            <g
              onClick={() => setSelectedZone("LEGS")}
              className="cursor-pointer group"
              id="hotspot-legs"
            >
              {/* Left Leg overlay */}
              <path
                d="M74,222 L61,372 C60,382 72,387 79,387 C86,387 83,377 85,362 L94,222 Z"
                fill={selectedZone === "LEGS" ? "rgba(239, 68, 68, 0.25)" : "transparent"}
                stroke={selectedZone === "LEGS" ? "#EF4444" : "transparent"}
                strokeWidth="2.5"
                className="transition-all duration-200 group-hover:fill-red-500/10"
              />
              {/* Right Leg overlay */}
              <path
                d="M126,222 L139,372 C140,382 128,387 121,387 C114,387 117,377 115,362 L106,222 Z"
                fill={selectedZone === "LEGS" ? "rgba(239, 68, 68, 0.25)" : "transparent"}
                stroke={selectedZone === "LEGS" ? "#EF4444" : "transparent"}
                strokeWidth="2.5"
                className="transition-all duration-200 group-hover:fill-red-500/10"
              />
              <circle cx="75" cy="300" r="5" fill={selectedZone === "LEGS" ? "#EF4444" : "#94A3B8"} className="animate-pulse" />
              <circle cx="125" cy="300" r="5" fill={selectedZone === "LEGS" ? "#EF4444" : "#94A3B8"} className="animate-pulse" />
            </g>
          </svg>

          <p className="text-[10px] text-slate-500 font-bold mt-4 tracking-wider">
            {lang === "English" ? "TAP REGION TO DIAGNOSE" : "పరిశీలించడానికి ఒక భాగం నొక్కండి"}
          </p>
        </div>

        {/* RIGHT COLUMN: DIAGNOSTIC CARD */}
        <div className="md:col-span-7 space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedZone}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6 shadow-sm"
              id="diagnostic-result-card"
            >
              {/* Title & Zone Tag */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {lang === "English" ? "Selected Zone" : "ఎంచుకున్న ప్రాంతం"}
                  </span>
                  <h3 className="text-xl font-bold font-sans mt-1 text-slate-900 leading-none">
                    {lang === "English" ? currentDetails.titleEn : currentDetails.titleTel}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  {selectedZone === "HEAD" && <Stethoscope className="w-5 h-5 text-purple-600" />}
                  {selectedZone === "CHEST" && <Heart className="w-5 h-5 text-red-600 animate-pulse" />}
                  {selectedZone === "ABDOMEN" && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                  {selectedZone === "ARMS" && <Flame className="w-5 h-5 text-orange-600" />}
                  {selectedZone === "LEGS" && <ShieldAlert className="w-5 h-5 text-emerald-600" />}
                </div>
              </div>

              {/* Causes & Symptoms Grid */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                {/* Likely Causes */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {lang === "English" ? "Likely Causes / Traumas" : "సంభావ్య కారణాలు / గాయాలు"}
                  </span>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed" id="causes-paragraph">
                    {lang === "English" ? currentDetails.causesEn : currentDetails.causesTel}
                  </p>
                </div>

                {/* Red Flag Warning */}
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-red-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      {lang === "English" ? "Red-Flag Danger Signs" : "డేంజర్ సిగ్నల్స్ (ప్రమాద సూచనలు)"}
                    </span>
                  </div>
                  <p className="text-xs text-red-950 font-semibold leading-relaxed" id="red-flags-paragraph">
                    {lang === "English" ? currentDetails.redFlagsEn : currentDetails.redFlagsTel}
                  </p>
                </div>

                {/* Recommended Specialist */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {lang === "English" ? "Recommended Clinical Specialist" : "సంప్రదించాల్సిన వైద్య నిపుణులు"}
                  </span>
                  <p className="text-xs text-slate-700 italic flex items-center gap-1.5" id="specialist-paragraph">
                    <Stethoscope className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{lang === "English" ? currentDetails.specialistEn : currentDetails.specialistTel}</span>
                  </p>
                </div>
              </div>

              {/* ACTION ROUTING BUTTONS */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {lang === "English" ? "Immediate Recommended Actions" : "సిఫార్సు చేయబడిన తక్షణ చర్యలు"}
                </span>

                {/* Protocol Routes */}
                {currentDetails.routes.map((route, idx) => (
                  <button
                    key={idx}
                    type="button"
                    id={`route-action-${route.category}`}
                    onClick={() => onSelectCategory(route.category)}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-between shadow-sm transition cursor-pointer"
                  >
                    <span>{lang === "English" ? route.labelEn : route.labelTel}</span>
                    <span>→</span>
                  </button>
                ))}

                {/* Escalation call route */}
                {currentDetails.escalateImmediate && (
                  <button
                    type="button"
                    id="route-call-108-btn"
                    onClick={onCallAmbulance}
                    className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 shadow-md animate-pulse cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 shrink-0" />
                    <span>
                      {lang === "English"
                        ? "IMMEDIATE DANGER: CALL 108 AMBULANCE NOW"
                        : "తక్షణ ప్రమాదం: వెంటనే 108 కి కాల్ చేయండి"}
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
