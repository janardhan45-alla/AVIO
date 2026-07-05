import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, EmergencyCategory, SEEDED_PROTOCOLS } from "./types";
import OnboardingScreen from "./components/OnboardingScreen";
import DashboardScreen from "./components/DashboardScreen";
import ProtocolScreen from "./components/ProtocolScreen";
import BodyMapScreen from "./components/BodyMapScreen";
import MedicationScannerScreen from "./components/MedicationScannerScreen";
import VoiceReporterModal from "./components/VoiceReporterModal";
import {
  Heart,
  Phone,
  Settings,
  Shield,
  Wifi,
  WifiOff,
  User,
  AlertOctagon,
  Clock,
  Battery,
  Signal,
  Smartphone
} from "lucide-react";

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState<"DASHBOARD" | "ONBOARDING" | "PROTOCOL" | "BODY_MAP" | "SCANNER">("ONBOARDING");
  const [activeCategory, setActiveCategory] = useState<EmergencyCategory | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isCalling108, setIsCalling108] = useState(false);
  const [timeStr, setTimeStr] = useState("11:54");

  // Load profile from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("aivo_user_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UserProfile;
        setProfile(parsed);
        setActiveView("DASHBOARD");
      } catch (e) {
        console.error("Error loading profile:", e);
        setActiveView("ONBOARDING");
      }
    } else {
      setActiveView("ONBOARDING");
    }

    // Standard online connectivity listener
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Dynamic clock inside simulated Android status bar
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTimeStr(`${hours}:${minutes} ${ampm}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 15000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleSaveProfile = (newProfile: UserProfile) => {
    localStorage.setItem("aivo_user_profile", JSON.stringify(newProfile));
    setProfile(newProfile);
    setActiveView("DASHBOARD");
  };

  const handleToggleOnline = () => {
    setIsOnline((prev) => !prev);
  };

  const handleSelectCategory = (category: EmergencyCategory) => {
    setActiveCategory(category);
    setIsVoiceModalOpen(false);
    setActiveView("PROTOCOL");
  };

  const handleCallAmbulance = () => {
    setIsCalling108(true);
  };

  // Find the selected protocol from our offline database
  const currentProtocol = SEEDED_PROTOCOLS.find((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#001D3D]/10 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-x-hidden font-sans">
      {/* HIGH FIDELITY SMARTPHONE/TABLET SIMULATOR FRAME */}
      <div className="w-full max-w-md md:max-w-5xl bg-slate-950 text-slate-900 sm:rounded-[40px] shadow-2xl overflow-hidden border-[6px] border-slate-800 min-h-screen md:min-h-[768px] flex flex-col relative transition-all duration-300">
        
        {/* Android Notch Speaker and Camera */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 h-5 w-40 bg-slate-950 rounded-b-2xl z-50">
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-800 rounded-full" />
          <div className="absolute top-1 right-8 w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800" />
        </div>

        {/* SIMULATED STATUS BAR */}
        <div className="bg-[#001D3D] text-white px-5 pt-3 pb-1 flex justify-between items-center text-[10px] font-semibold tracking-wider select-none shrink-0 z-40">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-white/60" />
            <span className="font-mono">{timeStr}</span>
          </div>

          {/* Dynamic notch separator padding for mobile */}
          <div className="hidden sm:block w-24 h-1" />

          <div className="flex items-center gap-2">
            {/* Real or Simulated connection status */}
            {isOnline ? (
              <Wifi className="w-3 h-3 text-emerald-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-orange-400" />
            )}
            <Signal className="w-3 h-3 text-white/80" />
            <div className="flex items-center gap-0.5">
              <span className="font-mono text-[9px] text-white/60">92%</span>
              <Battery className="w-3.5 h-3.5 text-white/80" />
            </div>
          </div>
        </div>

        {/* APPLICATION MAIN HEADER / BAR */}
        <header className="bg-[#F7F9FB] border-b border-gray-200/60 px-5 py-4 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => profile && setActiveView("DASHBOARD")}>
            <div className="w-8 h-8 bg-[#001D3D] rounded-xl flex items-center justify-center text-white shadow-md">
              <Heart className="w-4 h-4 text-white fill-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-black font-display tracking-tight text-[#001D3D]">
                AIVO
              </h1>
              <span className="block text-[8px] font-bold text-[#001D3D]/60 uppercase tracking-widest font-sans">
                Emergency Assistant • ఆపదలో సహాయం
              </span>
            </div>
          </div>

          {profile && (
            <div className="flex items-center gap-3">
              {/* Language toggle flag label */}
              <div
                onClick={() => {
                  const updated: UserProfile = {
                    ...profile,
                    preferredLanguage: profile.preferredLanguage === "English" ? "Telugu" : "English"
                  };
                  handleSaveProfile(updated);
                }}
                className="bg-[#001D3D] text-white hover:bg-[#002d5d] text-[10px] font-bold px-3 py-1.5 rounded-full cursor-pointer select-none transition flex items-center shadow-sm"
              >
                <span className={profile.preferredLanguage === "English" ? "" : "opacity-60"}>EN</span>
                <span className="opacity-40 mx-1">|</span>
                <span className={profile.preferredLanguage === "Telugu" ? "" : "opacity-60"}>తెలుగు</span>
              </div>

              {/* Profile Config Trigger */}
              <button
                type="button"
                id="header-profile-btn"
                onClick={() => {
                  setActiveView("ONBOARDING");
                }}
                className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-full text-[#001D3D] shadow-sm transition cursor-pointer flex items-center justify-center"
                title="Edit Profile"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          )}
        </header>

        {/* PRIMARY VIEW CONTENT HUB */}
        <main className="flex-1 bg-[#F7F9FB] p-5 overflow-y-auto relative flex flex-col justify-between" id="app-viewport">
          <AnimatePresence mode="wait">
            {activeView === "ONBOARDING" && (
              <OnboardingScreen
                initialProfile={profile}
                onSave={handleSaveProfile}
                isEditMode={!!profile}
                onCancel={profile ? () => setActiveView("DASHBOARD") : undefined}
              />
            )}

            {activeView === "DASHBOARD" && profile && (
              <DashboardScreen
                profile={profile}
                isOnline={isOnline}
                onToggleOnline={handleToggleOnline}
                onSelectCategory={handleSelectCategory}
                onOpenMic={() => setIsVoiceModalOpen(true)}
                onOpenBodyMap={() => setActiveView("BODY_MAP")}
                onOpenScanner={() => setActiveView("SCANNER")}
                onOpenProfile={() => setActiveView("ONBOARDING")}
                onCallAmbulance={handleCallAmbulance}
              />
            )}

            {activeView === "PROTOCOL" && profile && currentProtocol && (
              <ProtocolScreen
                protocol={currentProtocol}
                language={profile.preferredLanguage}
                onBack={() => {
                  setActiveCategory(null);
                  setActiveView("DASHBOARD");
                }}
                onCallAmbulance={handleCallAmbulance}
              />
            )}

            {activeView === "BODY_MAP" && profile && (
              <BodyMapScreen
                profile={profile}
                onBack={() => setActiveView("DASHBOARD")}
                onSelectCategory={handleSelectCategory}
                onCallAmbulance={handleCallAmbulance}
              />
            )}

            {activeView === "SCANNER" && profile && (
              <MedicationScannerScreen
                profile={profile}
                onBack={() => setActiveView("DASHBOARD")}
              />
            )}
          </AnimatePresence>
        </main>

        {/* LOWER SMARTPHONE NAVIGATION OR SYSTEM BACK BUTTON */}
        <footer className="bg-slate-950 py-3 flex justify-around items-center shrink-0 z-30 select-none border-t border-slate-900 text-slate-400">
          <div className="w-3.5 h-3.5 border-2 border-slate-500 rounded-sm cursor-pointer hover:border-white transition"
               title="Recent apps" />
          <div className="w-4 h-4 border-2 border-slate-500 rounded-full cursor-pointer hover:border-white transition"
               onClick={() => profile && setActiveView("DASHBOARD")}
               title="Home Screen" />
          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-slate-500 cursor-pointer hover:border-r-white transition"
               onClick={() => {
                 if (activeView === "PROTOCOL" || activeView === "BODY_MAP" || activeView === "SCANNER") {
                   setActiveView("DASHBOARD");
                 } else if (activeView === "ONBOARDING" && profile) {
                   setActiveView("DASHBOARD");
                 }
               }}
               title="System Back" />
        </footer>

        {/* OVERLAYS & MODALS */}

        {/* 1. Voice Reporter Overlay */}
        <AnimatePresence>
          {isVoiceModalOpen && profile && (
            <VoiceReporterModal
              profile={profile}
              isOnline={isOnline}
              onClose={() => setIsVoiceModalOpen(false)}
              onProtocolResolved={handleSelectCategory}
            />
          )}
        </AnimatePresence>

        {/* 2. Call 108 Emergency Dialing Screen */}
        <AnimatePresence>
          {isCalling108 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-950 text-white flex flex-col justify-between p-6 z-50 text-center"
              id="emergency-call-overlay"
            >
              {/* Call Header */}
              <div className="space-y-1 mt-6">
                <span className="text-[10px] uppercase font-mono tracking-widest text-red-300 font-bold bg-red-900/40 px-3 py-1 rounded-full border border-red-800/30 inline-block">
                  {profile?.preferredLanguage === "English" ? "Initiating Emergency Hot Call" : "అత్యవసర హాట్ కాల్ ప్రారంభించబడింది"}
                </span>
                <h3 className="text-3xl font-black font-display text-white mt-3 animate-pulse">
                  DIALING 108
                </h3>
                <p className="text-xs text-red-200">
                  {profile?.preferredLanguage === "English" ? "Ambulance dispatcher, India" : "అంబులెన్స్ సర్వీస్, భారతదేశం"}
                </p>
              </div>

              {/* Siren Visualizer */}
              <div className="flex flex-col items-center justify-center space-y-6 flex-1">
                <div className="relative flex items-center justify-center">
                  {/* Glowing rings */}
                  <div className="absolute w-36 h-36 bg-red-500 rounded-full opacity-10 animate-ping" />
                  <div className="absolute w-28 h-28 bg-red-500 rounded-full opacity-20 animate-ping delay-300" />
                  
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-500/50 relative">
                    <Phone className="w-8 h-8 text-white fill-white animate-bounce" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="block text-xs font-bold text-red-200 uppercase tracking-widest">
                    {profile?.preferredLanguage === "English" ? "SIMULATING CALL..." : "కాల్ కలపబడుతోంది..."}
                  </span>
                  <span className="block text-[10px] text-red-300 max-w-xs mx-auto">
                    {profile?.preferredLanguage === "English"
                      ? "Government dispatch line (Free service)"
                      : "ఉచిత ప్రభుత్వ అత్యవసర సేవ"}
                  </span>
                </div>
              </div>

              {/* Clinical Telemetry Packet */}
              {profile && (
                <div className="bg-red-900/30 border border-red-800/40 rounded-2xl p-4 text-left space-y-2 mb-4">
                  <div className="flex items-center gap-1.5 text-red-300">
                    <Shield className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      {profile.preferredLanguage === "English" ? "Transmitting Medical Profile Packet" : "వైద్య వివరాలు పంపబడుతున్నాయి"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-red-100">
                    <div>
                      <span className="block text-[9px] text-red-300 uppercase">Patient:</span>
                      <span className="font-bold">{profile.fullName} ({profile.ageYears}y)</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-red-300 uppercase">Blood Group:</span>
                      <span className="font-bold">{profile.bloodGroup}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-[9px] text-red-300 uppercase">Allergies / Conditions:</span>
                      <span className="font-bold truncate block">
                        {[...profile.knownAllergies, ...profile.chronicConditions].join(", ") || "None reported"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* End Call button */}
              <button
                type="button"
                id="cancel-call-108-btn"
                onClick={() => setIsCalling108(false)}
                className="w-full py-3 bg-white hover:bg-slate-100 text-red-900 font-bold text-sm rounded-xl shadow-md cursor-pointer transition mb-6"
              >
                {profile?.preferredLanguage === "English" ? "Cancel Call" : "కాల్ రద్దు చేయి"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
