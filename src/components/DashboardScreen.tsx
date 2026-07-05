import React from "react";
import { motion } from "motion/react";
import { UserProfile, EmergencyCategory } from "../types";
import {
  Mic,
  PhoneCall,
  User,
  ShieldCheck,
  ShieldAlert,
  Wifi,
  WifiOff,
  Flame,
  Zap,
  Droplets,
  Waves,
  Brain,
  ShieldAlert as SnakeIcon,
  MapPin,
  Camera,
  Activity,
  HeartPulse
} from "lucide-react";

interface DashboardScreenProps {
  profile: UserProfile;
  isOnline: boolean;
  onToggleOnline: () => void;
  onSelectCategory: (category: EmergencyCategory) => void;
  onOpenMic: () => void;
  onOpenBodyMap: () => void;
  onOpenScanner: () => void;
  onOpenProfile: () => void;
  onCallAmbulance: () => void;
}

export default function DashboardScreen({
  profile,
  isOnline,
  onToggleOnline,
  onSelectCategory,
  onOpenMic,
  onOpenBodyMap,
  onOpenScanner,
  onOpenProfile,
  onCallAmbulance
}: DashboardScreenProps) {
  const lang = profile.preferredLanguage;

  const contactsConfigured = profile.emergencyContact1.trim().length > 0;

  // Emergency Card definition
  const cards = [
    {
      category: "HEART_ATTACK" as EmergencyCategory,
      titleEng: "Heart Attack",
      titleTel: "గుండెపోటు",
      descEng: "Chest pain, call 108, half-sit, CPR",
      descTel: "ఛాతీ నొప్పి, 108 కి కాల్ చేయండి, CPR",
      icon: HeartPulse,
      color: "from-rose-500 to-red-600",
      border: "border-rose-100"
    },
    {
      category: "SNAKEBITE" as EmergencyCategory,
      titleEng: "Snakebite",
      titleTel: "పాము కాటు",
      descEng: "Bite, venom, swelling, immobilization",
      descTel: "విషం, వాపు, కదలకుండా ఉంచడం",
      icon: SnakeIcon,
      color: "from-emerald-500 to-teal-600",
      border: "border-emerald-100"
    },
    {
      category: "BLEEDING" as EmergencyCategory,
      titleEng: "Severe Bleeding",
      titleTel: "తీవ్ర రక్తస్రావం",
      descEng: "Cuts, wounds, heavy blood flow, pressure",
      descTel: "గాయాలు, రక్తస్రావం, గట్టిగా ఒత్తడం",
      icon: Droplets,
      color: "from-red-500 to-rose-600",
      border: "border-red-100"
    },
    {
      category: "SEIZURE" as EmergencyCategory,
      titleEng: "Seizure / Fits",
      titleTel: "మూర్ఛ / ఫిట్స్",
      descEng: "Convulsions, recovery position, cushioning",
      descTel: "వణుకు, రికవరీ పొజిషన్, తల కింద దిండు",
      icon: Brain,
      color: "from-purple-500 to-indigo-600",
      border: "border-purple-100"
    },
    {
      category: "DROWNING" as EmergencyCategory,
      titleEng: "Drowning",
      titleTel: "నీటిలో మునిగడం",
      descEng: "Rescue, responsiveness, immediate CPR",
      descTel: "సురక్షితంగా రక్షించడం, తక్షణ CPR",
      icon: Waves,
      color: "from-blue-500 to-sky-600",
      border: "border-blue-100"
    },
    {
      category: "ELECTRIC_SHOCK" as EmergencyCategory,
      titleEng: "Electric Shock",
      titleTel: "విద్యుత్ షాక్",
      descEng: "Isolate power, safety first, breathing check",
      descTel: "స్విచ్ ఆఫ్, కర్రతో నెట్టడం, శ్వాస పరీక్ష",
      icon: Zap,
      color: "from-yellow-500 to-amber-500",
      border: "border-yellow-100"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Network & Simulation Control Bar (Bento Header) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-gray-100 rounded-[20px] shadow-sm">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-600 animate-pulse" />
          <span className="text-xs font-bold text-[#001D3D] tracking-wider uppercase font-sans">
            AIVO Emergency Panel • ఆపదలో సహాయం
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Online/Offline Simulator Switch */}
          <button
            type="button"
            id="network-toggle"
            onClick={onToggleOnline}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-2 border transition select-none cursor-pointer ${
              isOnline
                ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                : "bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-orange-500"}`} />
            <span>
              {isOnline
                ? (lang === "English" ? "SIMULATING: ONLINE" : "సిమ్యులేషన్: ఆన్‌లైన్")
                : (lang === "English" ? "SIMULATING: OFFLINE" : "సిమ్యులేషన్: ఆఫ్‌లైన్")}
            </span>
          </button>

          {/* Edit Profile Quick Launch */}
          <button
            type="button"
            id="edit-profile-btn"
            onClick={onOpenProfile}
            className="p-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-slate-600 transition cursor-pointer bg-white"
            title={lang === "English" ? "Edit Medical Profile" : "ప్రొఫైల్ సవరించండి"}
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dynamic Connection Status Alert Banner */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 bg-orange-50 border border-orange-100 rounded-[24px] flex items-start gap-3"
          id="offline-status-banner"
        >
          <WifiOff className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wider">
              {lang === "English" ? "Offline Safety Backup Mode Active" : "ఆఫ్‌లైన్ భద్రతా బ్యాకప్ మోడ్ సక్రియంగా ఉంది"}
            </h4>
            <p className="text-xs text-orange-800 leading-relaxed">
              {lang === "English"
                ? "No internet connection detected. Voice reporting is restricted to offline local keyword matching (English & Telugu), but all 6 first-aid emergency protocols are fully pre-loaded and 100% functional."
                : "ఇంటర్నెట్ కనెక్షన్ లేదు. వాయిస్ రిపోర్టింగ్ స్థానిక కీవర్డ్ గుర్తింపుకు పరిమితం చేయబడింది, కానీ మొత్తం 6 అత్యవసర ప్రథమ చికిత్స ప్రొటోకాల్‌లు పూర్తిగా అందుబాటులో ఉన్నాయి."}
            </p>
          </div>
        </motion.div>
      )}

      {/* Bento Layout Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Left Column: Voice Intake (Cell 1) and Profile/Contact (Cell 2) */}
        <div className="md:col-span-5 flex flex-col gap-5">
          {/* VOICE INTAKE */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onOpenMic}
            id="voice-mic-trigger"
            className="flex-1 min-h-[260px] bg-[#E0F2FE] rounded-[40px] flex flex-col items-center justify-center p-6 text-center border-4 border-white shadow-lg cursor-pointer hover:bg-[#bae6fd] transition-all"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner mb-4 relative group">
              <span className="absolute inset-0 rounded-full bg-blue-100 opacity-0 group-hover:opacity-40 animate-ping transition-opacity" />
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </div>
            <h2 className="text-xl font-bold text-[#0369a1]">
              {lang === "English" ? "Tap to Speak" : "మాట్లాడటానికి నొక్కండి"}
            </h2>
            <p className="text-[#0369a1] font-semibold text-xs opacity-80 mt-1">
              {lang === "English" ? "Describe your emergency" : "మీ అత్యవసర పరిస్థితిని వివరించండి"}
            </p>
            <p className="mt-3 text-[10px] font-bold bg-[#bae6fd] text-[#0369a1] px-3 py-1 rounded-full uppercase tracking-wider">
              {lang === "English" ? '"Someone is bleeding" / "రక్తం వస్తోంది"' : '"రక్తం వస్తోంది" / "Someone is bleeding"'}
            </p>
          </motion.div>

          {/* Profile / Contact Status Card */}
          <div className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[160px] relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {lang === "English" ? "Emergency Contact" : "అత్యవసర కాంటాక్ట్"}
                </p>
                <h4 className="text-lg font-bold text-slate-800 mt-1">
                  {contactsConfigured ? profile.fullName : (lang === "English" ? "No Medical Profile" : "ప్రొఫైల్ సెట్ చేయబడలేదు")}
                </h4>
                <p className="text-xs font-semibold text-slate-500 font-mono mt-0.5">
                  {contactsConfigured ? `${profile.emergencyContact1} (Primary)` : (lang === "English" ? "Setup required to enable dispatch" : "సహాయాన్ని పంపడానికి సెట్ చేయండి")}
                </p>
              </div>
              <div 
                onClick={onOpenProfile}
                className={`p-2 rounded-full cursor-pointer transition ${contactsConfigured ? "bg-green-100 hover:bg-green-200" : "bg-red-100 hover:bg-red-200 animate-pulse"}`}
              >
                {contactsConfigured ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="px-2 py-0.5 bg-gray-100 text-slate-600 rounded text-[9px] font-bold uppercase tracking-wider">
                {profile.bloodGroup ? `${profile.bloodGroup} BLOOD` : "No Blood Group"}
              </span>
              {profile.chronicConditions?.slice(0, 2).map((condition, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-gray-100 text-slate-600 rounded text-[9px] font-bold uppercase tracking-wider truncate max-w-[120px]">
                  {condition}
                </span>
              ))}
              {!contactsConfigured && (
                <span onClick={onOpenProfile} className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[9px] font-bold uppercase cursor-pointer hover:bg-red-100">
                  {lang === "English" ? "Configure" : "సెట్ చేయి"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: 6 Critical Emergency Protocols Grid (Cells 3-8) */}
        <div className="md:col-span-7">
          <div className="bg-white rounded-[32px] p-5 md:p-6 border border-gray-100 shadow-sm h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#001D3D]" />
                {lang === "English" ? "6 Critical Emergencies" : "6 అత్యవసర ప్రొటోకాల్స్"}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cards.map((card) => {
                  const isCritical = card.category === "HEART_ATTACK" || card.category === "SNAKEBITE" || card.category === "BLEEDING";
                  const emojiMap: Record<string, string> = {
                    HEART_ATTACK: "❤️",
                    SNAKEBITE: "🐍",
                    BLEEDING: "🩸",
                    ELECTRIC_SHOCK: "⚡",
                    DROWNING: "🏊",
                    SEIZURE: "🧠",
                  };
                  const emoji = emojiMap[card.category] || "🚑";

                  return (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={card.category}
                      id={`card-protocol-${card.category}`}
                      onClick={() => onSelectCategory(card.category)}
                      className={`rounded-[32px] p-5 flex items-center gap-4 border cursor-pointer transition-all ${
                        isCritical
                          ? "bg-[#FEE2E2] border-[#FECACA] hover:bg-[#fed2d2]"
                          : "bg-white border-gray-100 shadow-sm hover:bg-gray-50"
                      }`}
                    >
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-100/50 shrink-0">
                        {emoji}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-base font-bold truncate ${isCritical ? "text-[#991B1B]" : "text-slate-800"}`}>
                          {lang === "English" ? card.titleEng : card.titleTel}
                        </h4>
                        <p className={`text-xs font-medium truncate ${isCritical ? "text-[#991B1B] opacity-70" : "text-slate-400"}`}>
                          {lang === "English" ? card.titleTel : card.titleEng}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 text-[10px] text-slate-400 text-center font-mono uppercase tracking-widest border-t border-slate-50 pt-3">
              Offline First-Aid Assistance Active • ఆఫ్‌లైన్ లో పనిచేస్తుంది
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        {/* Call 108 Ambulance Action (Cell 9) */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onCallAmbulance}
          id="ambulance-call-trigger"
          className="flex-1 bg-[#E11D48] text-white rounded-[24px] flex items-center justify-center p-5 shadow-xl cursor-pointer active:scale-95 transition-transform"
        >
          <div className="mr-5 bg-white rounded-full p-2.5 flex items-center justify-center shadow-md shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#E11D48" stroke="#E11D48" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div className="text-left leading-tight">
            <h2 className="text-2xl font-black tracking-wide">
              {lang === "English" ? "CALL 108 AMBULANCE" : "అంబులెన్స్ కాల్ చేయండి"}
            </h2>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider mt-0.5">
              {lang === "English" ? "FREE GOVT. EMERGENCY SERVICE" : "ఉచిత ప్రభుత్వ అత్యవసర సేవ (108)"}
            </p>
          </div>
        </motion.div>

        {/* Medication Scanner Action (Cell 10) */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenScanner}
          id="med-scanner-nav-btn"
          className="sm:w-32 bg-white rounded-[24px] py-4 px-2 flex flex-col items-center justify-center border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 text-slate-700 hover:text-[#001D3D] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-1.5 text-gray-600"><rect width="12" height="20" x="6" y="2" rx="2"/><path d="M9 17h6"/><path d="M10 6h4"/><path d="M12 10v4"/><path d="M10 12h4"/></svg>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            {lang === "English" ? "Meds Scan" : "మందుల స్కాన్"}
          </span>
        </motion.div>

        {/* Body Map Action (Cell 11) */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenBodyMap}
          id="body-map-nav-btn"
          className="sm:w-32 bg-white rounded-[24px] py-4 px-2 flex flex-col items-center justify-center border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 text-slate-700 hover:text-[#001D3D] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-1.5 text-gray-600"><path d="M9 2v2"/><path d="M15 2v2"/><path d="M8 22v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/><path d="M18 13V8a6 6 0 0 0-12 0v5"/><path d="M4 13h16"/><path d="M12 16v-4"/></svg>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            {lang === "English" ? "Body Map" : "బాడీ మ్యాప్"}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
