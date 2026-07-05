import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { OfflineProtocol, Language } from "../types";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  MapPin,
  PhoneCall,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  AlertOctagon,
  Sparkles,
  AlertTriangle
} from "lucide-react";

interface ProtocolScreenProps {
  protocol: OfflineProtocol;
  language: Language;
  onBack: () => void;
  onCallAmbulance: () => void;
}

export default function ProtocolScreen({
  protocol,
  language,
  onBack,
  onCallAmbulance
}: ProtocolScreenProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSpeechText, setActiveSpeechText] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Advanced Telugu TTS status and warning controls
  const [currentLanguage, setCurrentLanguage] = useState<Language>(language);
  const [teluguTtsStatus, setTeluguTtsStatus] = useState<"checking" | "supported" | "missing_data" | "not_supported">("checking");
  const [hasShownTtsDialog, setHasShownTtsDialog] = useState<boolean>(false);
  const [showTtsWarningModal, setShowTtsWarningModal] = useState<boolean>(false);
  const [showMockIntentModal, setShowMockIntentModal] = useState<boolean>(false);

  const steps = currentLanguage === "English" ? protocol.englishSteps : protocol.teluguSteps;
  const dos = currentLanguage === "English" ? protocol.doListEnglish : protocol.doListTelugu;
  const donts = currentLanguage === "English" ? protocol.dontListEnglish : protocol.dontListTelugu;

  // Track if we are currently synthesizing speech
  const speechTimeoutRef = useRef<any>(null);

  // Emulate Android TextToSpeech constants
  const LANG_AVAILABLE = 0;
  const LANG_MISSING_DATA = -1;
  const LANG_NOT_SUPPORTED = -2;

  const emulateSetLanguage = (langCode: string): number => {
    if (!window.speechSynthesis) {
      return LANG_NOT_SUPPORTED;
    }
    const voices = window.speechSynthesis.getVoices();
    if (langCode === "te-IN") {
      const hasTe = voices.some((v) => v.lang.startsWith("te") || v.name.includes("Telugu") || v.name.includes("India"));
      return hasTe ? LANG_AVAILABLE : LANG_MISSING_DATA;
    }
    return LANG_AVAILABLE;
  };

  const checkTeluguTtsSupport = () => {
    if (!window.speechSynthesis) {
      setTeluguTtsStatus("not_supported");
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    const hasTeVoice = voices.some(
      (v) => v.lang.startsWith("te") || v.name.includes("Telugu") || v.name.includes("India")
    );
    if (hasTeVoice) {
      setTeluguTtsStatus("supported");
    } else {
      if (voices.length > 0) {
        setTeluguTtsStatus("missing_data");
      } else {
        setTeluguTtsStatus("checking");
      }
    }
  };

  // Check language support initially and whenever language switches
  useEffect(() => {
    checkTeluguTtsSupport();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = checkTeluguTtsSupport;
    }
  }, [currentLanguage]);

  useEffect(() => {
    // Before reading the step, verify setLanguage result against missing and unsupported constants
    if (currentLanguage === "Telugu") {
      const checkResult = emulateSetLanguage("te-IN");
      if (checkResult === LANG_MISSING_DATA) {
        if (!hasShownTtsDialog) {
          setShowTtsWarningModal(true);
          setHasShownTtsDialog(true);
        }
      } else if (checkResult === LANG_NOT_SUPPORTED) {
        showToast("Telugu text-to-speech is not supported on this device.");
      }
    }
  }, [currentLanguage, teluguTtsStatus]);

  // Read out the initial step on mount and when language overrides change
  useEffect(() => {
    setCurrentStepIndex(0);
    speakStep(0, false);

    return () => {
      cancelSpeech();
    };
  }, [protocol, currentLanguage]);

  const cancelSpeech = () => {
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setActiveSpeechText("");
  };

  const speakText = (text: string, onEndCallback?: () => void) => {
    if (isMuted || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage === "English" ? "en-IN" : "te-IN";

    // Set voice appropriate for language
    const voices = window.speechSynthesis.getVoices();
    if (currentLanguage === "Telugu") {
      const teluguVoice = voices.find(
        (v) => v.lang.startsWith("te") || v.name.includes("Telugu") || v.name.includes("India")
      );
      if (teluguVoice) {
        utterance.voice = teluguVoice;
      } else {
        // Fallback to English voice if Telugu voice is missing
        const englishVoice = voices.find((v) => v.lang.startsWith("en-IN") || v.lang.startsWith("en-"));
        if (englishVoice) utterance.voice = englishVoice;
      }
    } else {
      const englishVoice = voices.find((v) => v.lang.startsWith("en-IN") || v.lang.startsWith("en-"));
      if (englishVoice) utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setActiveSpeechText(text);
    };

    utterance.onend = () => {
      setActiveSpeechText("");
      if (onEndCallback) {
        onEndCallback();
      }
    };

    utterance.onerror = (e) => {
      console.warn("TTS Synthesis blocked or unavailable:", e);
      setActiveSpeechText("");
      if (e.error === "not-allowed") {
        showToast(
          currentLanguage === "English"
            ? "Speech blocked by browser sandbox. Open in a new tab for voice instructions!"
            : "బ్రౌజర్ ద్వారా వాయిస్ నిలిపివేయబడింది. వాయిస్ గైడెన్స్ కోసం కొత్త ట్యాబ్‌లో తెరవండి!"
        );
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Speaks a given step. If "isAdvance" is true, it prepends the spoken confirmation.
  const speakStep = (stepIdx: number, isAdvance: boolean = false) => {
    cancelSpeech();

    if (isMuted) return;

    // Check if voice data missing before reading Telugu
    if (currentLanguage === "Telugu" && teluguTtsStatus === "missing_data") {
      // Speak in English as a fallback
      const stepText = protocol.englishSteps[stepIdx];
      const stepNumberLabel = stepIdx + 1;
      let confirmationSpeech = "";
      if (isAdvance) {
        confirmationSpeech = `Great, you completed Step ${stepIdx}. Now, `;
      }
      const stepIntro = `Step ${stepNumberLabel}. `;
      const fullSpeechText = `${confirmationSpeech}${stepIntro}${stepText}`;
      speechTimeoutRef.current = setTimeout(() => {
        speakText(fullSpeechText);
      }, 150);
      return;
    }

    const stepText = steps[stepIdx];
    const stepNumberLabel = stepIdx + 1;

    let confirmationSpeech = "";
    if (isAdvance) {
      if (currentLanguage === "English") {
        confirmationSpeech = `Great, you completed Step ${stepIdx}. Now, `;
      } else {
        confirmationSpeech = `చాలా బాగుంది, మీరు దశ ${stepIdx} విజయవంతంగా పూర్తి చేసారు. ఇప్పుడు, `;
      }
    }

    const stepIntro = currentLanguage === "English" 
      ? `Step ${stepNumberLabel}. ` 
      : `దశ ${stepNumberLabel}. `;

    const fullSpeechText = `${confirmationSpeech}${stepIntro}${stepText}`;

    // Small delay to allow react state changes to clear
    speechTimeoutRef.current = setTimeout(() => {
      speakText(fullSpeechText);
    }, 150);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      // Advance triggers the completion confirmation of the PRIOR step (currentStepIndex + 1 visually)
      speakStep(nextIdx, true);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      speakStep(prevIdx, false);
    }
  };

  const handleRepeat = () => {
    if (currentLanguage === "Telugu" && teluguTtsStatus === "missing_data") {
      setShowTtsWarningModal(true);
    }
    speakStep(currentStepIndex, false);
  };

  const handleToggleMute = () => {
    if (!isMuted) {
      cancelSpeech();
      setIsMuted(true);
      showToast(currentLanguage === "English" ? "Voice guidance muted" : "వాయిస్ గైడెన్స్ నిలిపివేయబడింది");
    } else {
      setIsMuted(false);
      // Re-trigger checks if trying to listen and missing
      if (currentLanguage === "Telugu" && teluguTtsStatus === "missing_data") {
        setShowTtsWarningModal(true);
      }
      // Unmuting will immediately read out the current step
      const stepText = steps[currentStepIndex];
      const stepNumberLabel = currentStepIndex + 1;
      const fullSpeechText = currentLanguage === "English" ? `Step ${stepNumberLabel}. ${stepText}` : `దశ ${stepNumberLabel}. ${stepText}`;
      speakText(fullSpeechText);
      showToast(currentLanguage === "English" ? "Voice guidance active" : "వాయిస్ గైడెన్స్ ప్రారంభించబడింది");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleFindHospital = () => {
    const query = "hospital";
    const geoUri = `geo:0,0?q=${encodeURIComponent(query)}`;
    const mapsWebUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

    showToast(language === "English" ? "Searching nearest hospitals..." : "సమీప ఆసుపత్రుల కోసం శోధిస్తోంది...");

    try {
      // In web apps, opening geo: directly is ideal for mobile, but window.open web query is bulletproof
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = geoUri;
      } else {
        window.open(mapsWebUrl, "_blank");
      }
    } catch (err) {
      console.error(err);
      // Fallback that will never crash the app
      window.open(mapsWebUrl, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Protocol Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
        <button
          type="button"
          id="protocol-back-btn"
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-rose-600 font-semibold text-xs cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentLanguage === "English" ? "Back to Home" : "హోమ్‌కి తిరిగి వెళ్లు"}
        </button>

        {currentLanguage === "Telugu" && teluguTtsStatus === "missing_data" && (
          <div
            onClick={() => setShowTtsWarningModal(true)}
            className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-medium px-2.5 py-1.5 rounded-full cursor-pointer hover:bg-amber-100 transition animate-pulse"
            id="tts-warning-indicator"
            title="Tap to see instructions"
          >
            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Voice missing - English active</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Language Toggle Button */}
          <button
            type="button"
            id="protocol-lang-toggle"
            onClick={() => {
              const nextLang = currentLanguage === "English" ? "Telugu" : "English";
              setCurrentLanguage(nextLang);
              showToast(nextLang === "English" ? "Language: English" : "భాష: తెలుగు");
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer select-none"
          >
            {currentLanguage === "English" ? "English" : "తెలుగు"}
          </button>

          {/* Mute/Unmute audio button */}
          <button
            type="button"
            id="protocol-mute-toggle"
            onClick={handleToggleMute}
            className={`p-2 rounded-xl border transition cursor-pointer flex items-center justify-center ${
              isMuted
                ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Protocol Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-rose-950 rounded-2xl text-white flex items-center justify-between shadow-md">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-rose-300 font-bold bg-rose-950/50 px-2.5 py-1 rounded-full border border-rose-900/30">
            {currentLanguage === "English" ? "Active First-Aid Guide" : "క్రియాశీల ప్రథమ చికిత్స గైడ్"}
          </span>
          <h2 className="text-xl font-bold font-sans mt-2 tracking-tight">
            {currentLanguage === "English" ? protocol.titleEnglish : protocol.titleTelugu}
          </h2>
        </div>
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-rose-400">
          <AlertOctagon className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      {/* ACTIVE STEP CAROUSEL (ONE STEP AT A TIME) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Step Counter Indicator */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between font-mono text-xs">
          <span>
            {currentLanguage === "English" ? "CRITICAL ACTION SEQUENCE" : "కీలక చర్య క్రమం"}
          </span>
          <span className="font-bold text-rose-400">
            {currentStepIndex + 1} / {steps.length}
          </span>
        </div>

        {/* Big step text display */}
        <div className="p-6 md:p-8 space-y-6 min-h-[160px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-bold text-rose-600 uppercase tracking-widest">
                {currentLanguage === "English" ? `Step ${currentStepIndex + 1}` : `దశ ${currentStepIndex + 1}`}
              </h3>
              <p className="text-lg md:text-xl font-medium text-slate-800 leading-relaxed font-sans" id="active-step-content">
                {steps[currentStepIndex]}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Subtitle Telemetry readouts for audio accessibility */}
          {activeSpeechText && !isMuted && (
            <div className="p-2.5 bg-rose-50 rounded-lg flex items-center gap-2 border border-rose-100">
              <Volume2 className="w-3.5 h-3.5 text-rose-600 shrink-0 animate-bounce" />
              <span className="text-[10px] font-medium text-rose-800 line-clamp-1 italic">
                Speaking: "{activeSpeechText}"
              </span>
            </div>
          )}
        </div>

        {/* Carousel Controls */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 flex items-center justify-between gap-3">
          {/* Repeat Button */}
          <button
            type="button"
            id="protocol-repeat-btn"
            onClick={handleRepeat}
            disabled={isMuted}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed select-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {currentLanguage === "English" ? "Repeat" : "మరోసారి చెప్పండి"}
          </button>

          <div className="flex gap-2">
            {/* Prev Button */}
            <button
              type="button"
              id="protocol-prev-btn"
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
              className={`px-3 py-2 border rounded-lg text-xs font-semibold flex items-center gap-1 transition select-none ${
                currentStepIndex === 0
                  ? "border-slate-200 text-slate-300 cursor-not-allowed"
                  : "border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {currentLanguage === "English" ? "Previous" : "వెనుకటి దశ"}
            </button>

            {/* Next Button */}
            <button
              type="button"
              id="protocol-next-btn"
              onClick={handleNext}
              disabled={currentStepIndex === steps.length - 1}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition select-none ${
                currentStepIndex === steps.length - 1
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200"
                  : "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-200 cursor-pointer"
              }`}
            >
              {currentLanguage === "English" ? "Completed, Next" : "పూర్తయింది, తర్వాత"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* DO'S & DON'TS PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Do List */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {currentLanguage === "English" ? "Crucial DO's" : "ఖచ్చితంగా చేయాల్సినవి"}
          </h4>
          <ul className="space-y-2" id="dos-list-ul">
            {dos.map((item, index) => (
              <li key={index} className="text-xs text-emerald-950 flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Don't List */}
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-bold text-red-800 uppercase tracking-widest flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            {currentLanguage === "English" ? "DO NOTS (Dangers)" : "ఎట్టి పరిస్థితుల్లో చేయకూడనివి"}
          </h4>
          <ul className="space-y-2" id="donts-list-ul">
            {donts.map((item, index) => (
              <li key={index} className="text-xs text-red-950 flex items-start gap-2 leading-relaxed">
                <span className="text-red-600 font-bold shrink-0">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* GEOGRAPHIC TRIAGE: FIND HOSPITAL ACTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Maps Integration */}
        <button
          type="button"
          id="find-hospital-btn"
          onClick={handleFindHospital}
          className="p-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm text-left flex items-center gap-4 transition cursor-pointer focus:outline-none"
        >
          <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
            <MapPin className="w-5.5 h-5.5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-950 uppercase tracking-wide">
              {currentLanguage === "English" ? "Find Nearest Hospital" : "సమీప ఆసుపత్రిని కనుగొనండి"}
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {currentLanguage === "English" 
                ? "Locate medical centers with emergency trauma or anti-venom facilities."
                : "అత్యవసర చికిత్స గల ఆసుపత్రుల కోసం మ్యాప్స్ తెరవండి."}
            </p>
          </div>
        </button>

        {/* Redundant Call 108 */}
        <button
          type="button"
          id="protocol-call-ambulance-btn"
          onClick={onCallAmbulance}
          className="p-4 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white rounded-xl shadow-sm text-left flex items-center gap-4 transition cursor-pointer focus:outline-none"
        >
          <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
            <PhoneCall className="w-5.5 h-5.5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wide">
              {currentLanguage === "English" ? "Call 108 Ambulance" : "108 అంబులెన్స్‌కు కాల్ చేయండి"}
            </h4>
            <p className="text-[10px] text-red-100 mt-0.5">
              {currentLanguage === "English"
                ? "Free medical service hotline. Available 24/7 across India."
                : "ఉచిత ప్రభుత్వ సేవ. భారతదేశం అంతటా అందుబాటులో ఉంటుంది."}
            </p>
          </div>
        </button>
      </div>

      {/* Warning Modal */}
      <AnimatePresence>
        {showTtsWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[28px] max-w-sm w-full p-6 shadow-xl border border-amber-100 overflow-hidden"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-200">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 font-sans">
                    Telugu Voice Data Missing
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Telugu voice data is not installed on this device. The system will fall back to reading English step-by-step guides, but we highly recommend installing the voice data for offline emergencies.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowTtsWarningModal(false);
                    setShowMockIntentModal(true);
                  }}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  Install Telugu Voice Data
                </button>
                <button
                  type="button"
                  onClick={() => setShowTtsWarningModal(false)}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Dismiss & Use English Fallback
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mock Intent Modal */}
      <AnimatePresence>
        {showMockIntentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 text-white rounded-[28px] max-w-sm w-full p-6 shadow-xl border border-slate-800"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                    Intent Fired
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    android.os.Bundle
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500">Action:</span>
                    <span className="text-rose-400 break-all">android.speech.tts.engine.INSTALL_TTS_DATA</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500">Locale:</span>
                    <span className="text-blue-400">te_IN (Telugu: India)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500">Fallback:</span>
                    <span className="text-amber-400">Settings.ACTION_ACCESSIBILITY_SETTINGS</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed text-center">
                  The app successfully requested the Android OS to open Text-to-Speech Settings and initiate the background download of Telugu voice resources.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setShowMockIntentModal(false);
                    // Mock that voices are now loaded / installed!
                    setTeluguTtsStatus("supported");
                    showToast("Telugu voice package emulation loaded successfully!");
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer font-sans"
                >
                  Confirm Installation (Mock Done)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl z-50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
