import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, EmergencyCategory, Language } from "../types";
import {
  Mic,
  Volume2,
  X,
  AlertTriangle,
  Play,
  Send,
  Sparkles,
  Wifi,
  WifiOff,
  CornerDownLeft
} from "lucide-react";

interface VoiceReporterModalProps {
  profile: UserProfile;
  isOnline: boolean;
  onClose: () => void;
  onProtocolResolved: (category: EmergencyCategory) => void;
}

export default function VoiceReporterModal({
  profile,
  isOnline,
  onClose,
  onProtocolResolved
}: VoiceReporterModalProps) {
  const lang = profile.preferredLanguage;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState("");

  const recognitionRef = useRef<any>(null);

  // Preloaded emergency phrases for easy simulation testing
  const presets = [
    {
      label: "Snakebite (EN)",
      text: "Help, my brother was just bitten by a cobra snake in the grass!",
      lang: "English" as Language
    },
    {
      label: "పాము కాటు (TE)",
      text: "పొలంలో పని చేస్తుంటే పాము కాటు వేసింది, రక్షించండి",
      lang: "Telugu" as Language
    },
    {
      label: "Bleeding (EN)",
      text: "There is blood everywhere! He is bleeding heavily from his arm!",
      lang: "English" as Language
    },
    {
      label: "రక్తస్రావం (TE)",
      text: "కాలు తెగి రక్తం కారుతోంది, ఆగడం లేదు",
      lang: "Telugu" as Language
    },
    {
      label: "Seizure / Fits (EN)",
      text: "She is having a seizure fits on the ground and shaking!",
      lang: "English" as Language
    },
    {
      label: "మూర్ఛ / ఫిట్స్ (TE)",
      text: "ఆమెకు మూర్ఛ వ్యాధి వచ్చింది, నోట్లో నురుగు వస్తోంది",
      lang: "Telugu" as Language
    },
    {
      label: "Drowning (EN)",
      text: "Someone fell into the swimming pool and is drowning, help!",
      lang: "English" as Language
    },
    {
      label: "Burns (EN)",
      text: "His skin burnt on a hot pan and is blisters now, it hurts!",
      lang: "English" as Language
    },
    {
      label: "Electric Shock (TE)",
      text: "కరెంట్ వైరు తాకి షాక్ కొట్టింది, స్పృహ లేదు",
      lang: "Telugu" as Language
    },
    {
      label: "Unrecognized / Gemini Fallback (EN)",
      text: "The patient fell down and has sharp pain in chest.",
      lang: "English" as Language
    }
  ];

  useEffect(() => {
    // Check Speech Recognition Web API support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
      setStatusMessage(
        lang === "English"
          ? "Microphone Speech Recognition is not supported by your browser. Please use the Simulator below."
          : "మీ బ్రౌజర్ మైక్రోఫోన్ వాయిస్ గుర్తింపును సపోర్ట్ చేయదు. దయచేసి క్రింది సిమ్యులేటర్ ఉపయోగించండి."
      );
    } else {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === "English" ? "en-IN" : "te-IN";

      rec.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
        setStatusMessage(
          lang === "English"
            ? "Listening... Speak your medical emergency now."
            : "వింటున్నాము... అత్యవసర పరిస్థితిని మాట్లాడండి."
        );
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processTranscript(text);
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event);
        setIsListening(false);
        if (event.error === "not-allowed") {
          setErrorMessage(
            lang === "English"
              ? "RECORD_AUDIO Microphone permission was denied. Please allow microphone access in your browser or use the simulator."
              : "మైక్రోఫోన్ అనుమతి తిరస్కరించబడింది. దయచేసి మైక్రోఫోన్ యాక్సెస్‌ను అనుమతించండి లేదా సిమ్యులేటర్ ఉపయోగించండి."
          );
        } else {
          setErrorMessage(
            lang === "English"
              ? `Speech Error: ${event.error}. Feel free to use the interactive simulator.`
              : `సమస్య తలెత్తింది: ${event.error}. దయచేసి సిమ్యులేటర్ ఉపయోగించండి.`
          );
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [lang]);

  // Text-To-Speech (SpeechSynthesis) function
  const speakText = (text: string, voiceLang: string) => {
    if (!window.speechSynthesis) return;
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang;
    
    // Try to find a fitting voice
    const voices = window.speechSynthesis.getVoices();
    if (voiceLang.startsWith("te")) {
      const teluguVoice = voices.find(v => v.lang.startsWith("te") || v.name.includes("Telugu") || v.name.includes("India"));
      if (teluguVoice) {
        utterance.voice = teluguVoice;
      }
    }

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error or blocked:", e);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // Dual-language local offline keyword matching logic
  const findOfflineCategory = (text: string): EmergencyCategory | null => {
    const clean = text.toLowerCase();

    // Snakebite keywords
    if (
      clean.includes("snake") ||
      clean.includes("bite") ||
      clean.includes("cobra") ||
      clean.includes("viper") ||
      clean.includes("poison") ||
      clean.includes("పాము") ||
      clean.includes("కాటు") ||
      clean.includes("కరిచింది")
    ) {
      return "SNAKEBITE";
    }

    // Bleeding keywords
    if (
      clean.includes("bleed") ||
      clean.includes("blood") ||
      clean.includes("cut") ||
      clean.includes("wound") ||
      clean.includes("hemorrhage") ||
      clean.includes("రక్తం") ||
      clean.includes("రక్తస్రావం") ||
      clean.includes("గాయం") ||
      clean.includes("దెబ్బ")
    ) {
      return "BLEEDING";
    }

    // Seizure keywords
    if (
      clean.includes("seizure") ||
      clean.includes("fits") ||
      clean.includes("convulsion") ||
      clean.includes("shake") ||
      clean.includes("epilepsy") ||
      clean.includes("మూర్ఛ") ||
      clean.includes("ఫిట్స్") ||
      clean.includes("వణుకు") ||
      clean.includes("స్పృహ")
    ) {
      return "SEIZURE";
    }

    // Drowning keywords
    if (
      clean.includes("drown") ||
      clean.includes("water") ||
      clean.includes("lake") ||
      clean.includes("pool") ||
      clean.includes("river") ||
      clean.includes("suffocate") ||
      clean.includes("నీరు") ||
      clean.includes("మునిగి") ||
      clean.includes("ఈత")
    ) {
      return "DROWNING";
    }

    // Heart Attack keywords
    if (
      clean.includes("heart") ||
      clean.includes("chest") ||
      clean.includes("cardiac") ||
      clean.includes("attack") ||
      clean.includes("pain") ||
      clean.includes("గుండె") ||
      clean.includes("ఛాతీ") ||
      clean.includes("నొప్పి")
    ) {
      return "HEART_ATTACK";
    }

    // Electric shock keywords
    if (
      clean.includes("shock") ||
      clean.includes("electric") ||
      clean.includes("wire") ||
      clean.includes("current") ||
      clean.includes("power line") ||
      clean.includes("కరెంట్") ||
      clean.includes("షాక్") ||
      clean.includes("వైరు") ||
      clean.includes("కరెంటు")
    ) {
      return "ELECTRIC_SHOCK";
    }

    return null;
  };

  const processTranscript = async (textToProcess: string) => {
    if (!textToProcess.trim()) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage(
      lang === "English"
        ? "Processing report... checking local emergency protocols."
        : "విశ్లేషిస్తున్నాము... స్థానిక అత్యవసర ప్రోటోకాల్‌లను తనిఖీ చేస్తున్నాము."
    );

    // 1. ALWAYS run local keyword matching first (works offline)
    const matchedCategory = findOfflineCategory(textToProcess);

    if (matchedCategory) {
      // Found offline match! Launch protocol and announce TTS
      handleLaunchProtocol(matchedCategory, "local");
      return;
    }

    // 2. No offline keyword match. Check online status for Gemini fallback
    if (isOnline) {
      setStatusMessage(
        lang === "English"
          ? "No local keyword match found. Querying Gemini AI for semantic classification..."
          : "కీవర్డ్ ఏదీ సరిపోలలేదు. జెమిని AI సహాయంతో విశ్లేషిస్తున్నాము..."
      );

      try {
        const response = await fetch("/api/gemini/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textToProcess })
        });

        if (!response.ok) {
          let errorMsg = "Failed to contact Gemini classification server.";
          try {
            const errData = await response.json();
            if (errData && errData.error) {
              errorMsg = errData.error;
            }
          } catch (_) {}
          throw new Error(errorMsg);
        }

        const data = await response.json();
        const category = data.category as string;

        const validCategories: EmergencyCategory[] = [
          "HEART_ATTACK",
          "SNAKEBITE",
          "BLEEDING",
          "SEIZURE",
          "DROWNING",
          "ELECTRIC_SHOCK"
        ];

        // 3. Strictly validate Gemini's response
        if (validCategories.includes(category as EmergencyCategory)) {
          handleLaunchProtocol(category as EmergencyCategory, "gemini");
        } else {
          handleUnclassifiedState();
        }
      } catch (err: any) {
        console.error(err);
        setErrorMessage(
          lang === "English"
            ? `Gemini classification failed: ${err.message || "Please choose an emergency card manually."}`
            : `జెమిని విశ్లేషణ విఫలమైంది: ${err.message || "దయచేసి మాన్యువల్‌గా కార్డ్‌ను ఎంచుకోండి."}`
        );
        setIsProcessing(false);
      }
    } else {
      // Offline and no keyword match -> trigger verbal advisory
      handleUnclassifiedState();
    }
  };

  const handleLaunchProtocol = (category: EmergencyCategory, source: "local" | "gemini") => {
    setIsProcessing(false);

    // Speak confirmation in user's preferred language ONLY after resolving protocol
    const speakTextEn = `Launching emergency first-aid protocol for ${category.replace("_", " ")} now. Follow the instructions on your screen.`;
    const speakTextTel = `${category === "HEART_ATTACK" ? "గుండెపోటు" : category === "SNAKEBITE" ? "పాము కాటు" : category === "BLEEDING" ? "రక్తస్రావం" : category === "SEIZURE" ? "మూర్ఛ ఫిట్స్" : category === "DROWNING" ? "నీటిలో మునిగిపోవడం" : "విద్యుత్ షాక్"} అత్యవసర ప్రోటోకాల్ ప్రారంభించబడుతోంది. తెరపై ఉన్న సూచనలను అనుసరించండి.`;

    if (lang === "English") {
      speakText(speakTextEn, "en-IN");
    } else {
      speakText(speakTextTel, "te-IN");
    }

    onProtocolResolved(category);
  };

  const handleUnclassifiedState = () => {
    setIsProcessing(false);

    // Speak alert advising to tap cards manually
    const textEn = "No clear first-aid category could be determined. Please tap one of the six emergency cards on the dashboard immediately.";
    const textTel = "అత్యవసర పరిస్థితిని గుర్తించలేకపోయాము. దయచేసి స్క్రీన్‌పై ఉన్న ఆరు కార్డులలో ఒకదాన్ని వెంటనే నొక్కండి.";

    if (lang === "English") {
      speakText(textEn, "en-IN");
      setErrorMessage(textEn);
    } else {
      speakText(textTel, "te-IN");
      setErrorMessage(textTel);
    }
  };

  const startListening = () => {
    if (!hasSpeechSupport) return;
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = () => {
    if (!hasSpeechSupport) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {}
  };

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setTranscript(textInput);
    processTranscript(textInput);
    setTextInput("");
  };

  const selectPreset = (presetText: string) => {
    setTranscript(presetText);
    processTranscript(presetText);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col my-8"
        id="voice-reporter-modal"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-rose-500 animate-pulse" />
            <h3 className="font-bold text-sm tracking-wide font-sans">
              {lang === "English" ? "AIVO VOICE CLASSIFIER" : "AIVO వాయిస్ విశ్లేషకుడు"}
            </h3>
          </div>
          <button
            type="button"
            id="close-voice-modal"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex-1 space-y-6">
          {/* Active Audio State Panel */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-center flex flex-col items-center justify-center min-h-[140px] relative">
            {/* Online Indicator Badge */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-500">
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-500" />
                  Gemini Ready
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-rose-500" />
                  Local Match Only
                </>
              )}
            </div>

            {isListening ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 h-6">
                  <span className="w-1.5 h-4 bg-rose-600 rounded-full animate-bounce delay-75" />
                  <span className="w-1.5 h-6 bg-rose-600 rounded-full animate-bounce delay-150" />
                  <span className="w-1.5 h-3 bg-rose-600 rounded-full animate-bounce delay-300" />
                  <span className="w-1.5 h-5 bg-rose-600 rounded-full animate-bounce delay-75" />
                  <span className="w-1.5 h-2 bg-rose-600 rounded-full animate-bounce" />
                </div>
                <button
                  type="button"
                  id="stop-listening-btn"
                  onClick={stopListening}
                  className="px-4 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full hover:bg-rose-200 transition"
                >
                  {lang === "English" ? "Stop Listening" : "ఆపండి"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                {hasSpeechSupport ? (
                  <button
                    type="button"
                    id="start-listening-btn"
                    onClick={startListening}
                    disabled={isProcessing}
                    className="w-14 h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer disabled:bg-slate-300 transition"
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                ) : (
                  <div className="w-12 h-12 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center">
                    <Mic className="w-5 h-5" />
                  </div>
                )}
                {hasSpeechSupport && !isProcessing && (
                  <span className="text-xs font-semibold text-rose-600">
                    {lang === "English" ? "Tap Microphone to Speak" : "మాట్లాడటానికి మైక్ నొక్కండి"}
                  </span>
                )}
              </div>
            )}

            <p className="text-xs text-slate-700 font-semibold mt-3 max-w-sm px-2">
              {statusMessage}
            </p>

            {transcript && (
              <div className="mt-4 p-2 bg-white border border-slate-100 rounded-lg w-full text-left">
                <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                  Recognized Transcript:
                </span>
                <p className="text-xs font-medium text-slate-800 italic mt-0.5">
                  "{transcript}"
                </p>
              </div>
            )}
          </div>

          {/* SIMULATOR ASSISTANT (Crucial for iframe/browser testing) */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1 text-slate-700">
              <Sparkles className="w-4 h-4 text-rose-500 animate-spin" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                {lang === "English" ? "Interactive Voice Simulator" : "ఇంటరాక్టివ్ వాయిస్ సిమ్యులేటర్"}
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {lang === "English"
                ? "Since microphone API can be restricted in sandboxed previews, select a quick emergency preset phrase below or type custom voice text to simulate speech input."
                : "మైక్రోఫోన్ అనుమతి లేనప్పుడు అత్యవసర సిమ్యులేషన్ పదబంధాన్ని ఎంచుకోండి లేదా టైప్ చేయండి."}
            </p>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-1.5 max-h-[120px] overflow-y-auto pr-1">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  id={`preset-voice-${index}`}
                  onClick={() => selectPreset(preset.text)}
                  disabled={isProcessing}
                  className="p-1.5 text-left border border-slate-200 hover:border-slate-400 rounded-lg text-[10px] font-medium bg-slate-50 hover:bg-slate-100 truncate transition cursor-pointer"
                  title={preset.text}
                >
                  <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                    preset.lang === "English" ? "bg-sky-400" : "bg-teal-400"
                  }`} />
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom text simulated speech input */}
            <form onSubmit={handleSimulatedSubmit} className="flex gap-2 pt-1">
              <input
                type="text"
                id="simulated-speech-input"
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs"
                placeholder={
                  lang === "English"
                    ? "Type simulated spoken words (e.g. 'heavy bleeding')..."
                    : "మాట్లాడిన పదాలను ఇక్కడ టైప్ చేయండి..."
                }
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={isProcessing}
              />
              <button
                type="submit"
                id="submit-speech-sim-btn"
                disabled={isProcessing || !textInput.trim()}
                className="px-3 bg-slate-900 hover:bg-black text-white rounded-lg flex items-center justify-center transition disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Errors Display */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold flex items-start gap-2"
                id="voice-error-banner"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info banner */}
        <div className="bg-slate-50 p-3 px-4 border-t border-slate-100 text-center">
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">
            {lang === "English"
              ? "All transcription analysis is local-first."
              : "అన్ని విశ్లేషణలు స్థానిక పరికరంలోనే జరుగుతాయి."}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
