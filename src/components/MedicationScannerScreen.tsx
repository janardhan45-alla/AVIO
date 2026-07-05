import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, ScanResult } from "../types";
import {
  ArrowLeft,
  Camera,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  RefreshCw,
  Sparkles,
  Zap,
  Play
} from "lucide-react";

interface MedicationScannerScreenProps {
  profile: UserProfile;
  onBack: () => void;
}

export default function MedicationScannerScreen({
  profile,
  onBack
}: MedicationScannerScreenProps) {
  const lang = profile.preferredLanguage;

  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3 Interactive simulated medication presets (blister pack graphics + data)
  // Paracetamol, Ibuprofen, Metformin
  const simulatedMedications = [
    {
      id: "sim-para",
      name: "Paracetamol 500mg",
      brand: "Crocin Advance / Dolo 650",
      active: "Paracetamol (Acetaminophen) 500mg",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'><rect width='200' height='120' fill='%23F1F5F9' stroke='%2394A3B8' stroke-width='4' rx='10'/><rect x='10' y='10' width='180' height='30' fill='%233B82F6' rx='5'/><text x='100' y='30' fill='white' font-family='sans-serif' font-size='12' font-weight='bold' text-anchor='middle'>DOLO 650 / CROCIN</text><text x='100' y='65' fill='%231E293B' font-family='sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>PARACETAMOL 500mg</text><text x='100' y='85' fill='%23475569' font-family='sans-serif' font-size='9' text-anchor='middle'>Rx Blister Pack - Analgesic</text><circle cx='30' cy='105' r='6' fill='%23E2E8F0'/><circle cx='65' cy='105' r='6' fill='%23E2E8F0'/><circle cx='100' cy='105' r='6' fill='%23E2E8F0'/><circle cx='135' cy='105' r='6' fill='%23E2E8F0'/><circle cx='170' cy='105' r='6' fill='%23E2E8F0'/></svg>"
    },
    {
      id: "sim-ibu",
      name: "Ibuprofen 400mg",
      brand: "Brufen 400 / Combiflam",
      active: "Ibuprofen 400mg (NSAID)",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'><rect width='200' height='120' fill='%23FEF2F2' stroke='%23FCA5A5' stroke-width='4' rx='10'/><rect x='10' y='10' width='180' height='30' fill='%23EF4444' rx='5'/><text x='100' y='30' fill='white' font-family='sans-serif' font-size='12' font-weight='bold' text-anchor='middle'>BRUFEN 400mg</text><text x='100' y='65' fill='%231E293B' font-family='sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>IBUPROFEN 400mg</text><text x='100' y='85' fill='%23475569' font-family='sans-serif' font-size='9' text-anchor='middle'>NSAID - Pain Relief Warning</text><circle cx='40' cy='105' r='8' fill='%23FCA5A5'/><circle cx='100' cy='105' r='8' fill='%23FCA5A5'/><circle cx='160' cy='105' r='8' fill='%23FCA5A5'/></svg>"
    },
    {
      id: "sim-met",
      name: "Metformin Hydrochloride 1000mg",
      brand: "Glycomet 1000 / Glyciphage",
      active: "Metformin Hydrochloride 1000mg",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'><rect width='200' height='120' fill='%23ECFDF5' stroke='%236EE7B7' stroke-width='4' rx='10'/><rect x='10' y='10' width='180' height='30' fill='%2310B981' rx='5'/><text x='100' y='30' fill='white' font-family='sans-serif' font-size='12' font-weight='bold' text-anchor='middle'>GLYCOMET 1000 SR</text><text x='100' y='65' fill='%231E293B' font-family='sans-serif' font-size='11' font-weight='bold' text-anchor='middle'>METFORMIN HCl 1000mg</text><text x='100' y='85' fill='%23475569' font-family='sans-serif' font-size='9' text-anchor='middle'>Anti-Diabetic Oral Hypoglycemic</text><ellipse cx='50' cy='105' rx='14' ry='6' fill='%23A7F3D0'/><ellipse cx='150' cy='105' rx='14' ry='6' fill='%23A7F3D0'/></svg>"
    }
  ];

  // Request camera and setup preview
  useEffect(() => {
    initCamera();

    // MUST release/unbind the camera when the user navigates away from this screen (unmounts!)
    return () => {
      releaseCamera();
    };
  }, []);

  const initCamera = async () => {
    setErrorMessage(null);
    try {
      // In sandboxed frames, getUserMedia might trigger security errors or be undefined
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCamera(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });

      setCameraStream(stream);
      setHasCamera(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setHasCamera(false);
    }
  };

  const releaseCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => {
        track.stop();
      });
      setCameraStream(null);
    }
  };

  // Capture photo from video stream
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/jpeg");
      setPhotoDataUrl(dataUrl);

      // Stop camera tracks right after capture to preserve battery / resource
      releaseCamera();
      
      // Perform Gemini analysis
      analyzeMedication(dataUrl);
    }
  };

  // Convert SVG presets to base64 JPEG-equivalent canvas images for actual Gemini processing!
  const capturePreset = (presetSvg: string) => {
    setIsScanning(true);
    setPhotoDataUrl(presetSvg);
    setScanResult(null);
    setErrorMessage(null);

    // Create an image element to parse the SVG and draw onto canvas
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(presetSvg.replace("data:image/svg+xml;utf8,", ""));
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 240;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, 400, 240);
        ctx.drawImage(img, 0, 0, 400, 240);
        const dataUrl = canvas.toDataURL("image/jpeg");
        analyzeMedication(dataUrl);
      }
    };
    img.onerror = () => {
      // Fallback
      analyzeMedication(presetSvg);
    };
  };

  // Sends the blister image along with the user profile to our backend API proxy
  const analyzeMedication = async (imageB64: string) => {
    setIsScanning(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/gemini/scan-medication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageB64,
          profile: profile
        })
      });

      if (!response.ok) {
        let errMsg = "Failed to contact medical analyzer backend.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errMsg = errData.error;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      setScanResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        lang === "English"
          ? `Failed to analyze blister pack: ${err.message || "Ensure your server is online with a valid Gemini API key."}`
          : `మందుల ప్యాకెట్ విశ్లేషణ విఫలమైంది: ${err.message || "జెమిని API కీ సెట్ చేయబడిందో లేదో తనిఖీ చేయండి."}`
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleRetake = () => {
    setPhotoDataUrl(null);
    setScanResult(null);
    setErrorMessage(null);
    initCamera();
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <button
          type="button"
          id="scanner-back-btn"
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-600 hover:text-rose-600 font-semibold text-xs cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "English" ? "Back to Dashboard" : "డాష్‌బోర్డ్‌కి తిరిగి వెళ్లు"}
        </button>
        <span className="text-xs font-mono font-bold text-slate-400 uppercase">
          AI Pharmacy Audit
        </span>
      </div>

      {/* Screen Title */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold font-sans">
            {lang === "English" ? "Medication Safety Scanner" : "మందుల భద్రతా స్కానర్"}
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {lang === "English"
              ? "Photograph blister pack. Cross-references against allergies, conditions, and active drugs in your profile."
              : "మందుల ప్యాకెట్ ఫోటో తీయండి. మీ ప్రొఫైల్‌తో సరిపోల్చి భద్రతను విశ్లేషిస్తుంది."}
          </p>
        </div>
        <div className="w-9 h-9 bg-rose-500/10 text-rose-400 rounded-lg flex items-center justify-center shrink-0">
          <Camera className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* CAMERA SCREEN / ACTIVE PREVIEW */}
        <div className="md:col-span-6 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden flex flex-col min-h-[380px] shadow-sm">
          {photoDataUrl ? (
            /* CAPTURED STATE DISPLAY */
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[280px]">
              {photoDataUrl.startsWith("data:image/svg") ? (
                <div dangerouslySetInnerHTML={{ __html: photoDataUrl }} className="w-full max-w-[300px] h-auto p-4" />
              ) : (
                <img src={photoDataUrl} alt="Captured blister pack" className="w-full h-auto max-h-[300px] object-contain" />
              )}
              {isScanning && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white space-y-3 z-10">
                  <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold tracking-wider uppercase animate-pulse">
                    {lang === "English" ? "Gemini AI Analyzing..." : "జెమిని విశ్లేషిస్తోంది..."}
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* ACTIVE CAMERA STREAM STATE */
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[280px]">
              {hasCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover min-h-[280px]"
                />
              ) : (
                <div className="p-6 text-center text-slate-400 space-y-3">
                  <Camera className="w-10 h-10 mx-auto opacity-35" />
                  <p className="text-xs font-semibold leading-relaxed max-w-xs">
                    {lang === "English"
                      ? "Real camera is blocked or not available in this browser sandbox. Use the interactive simulator presets below!"
                      : "ఈ పరికరంలో కెమెరా అందుబాటులో లేదు. దయచేసి క్రింది సిమ్యులేటర్ ఉపయోగించండి!"}
                  </p>
                </div>
              )}

              {/* Simulated scan retarget frame */}
              {hasCamera && (
                <div className="absolute inset-0 border-[3px] border-dashed border-rose-500/40 m-8 rounded-xl pointer-events-none flex items-center justify-center">
                  <span className="bg-rose-600/75 text-[9px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-widest">
                    {lang === "English" ? "Place Blister Pack Here" : "మందుల ప్యాకెట్ ఇక్కడ ఉంచండి"}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Canvas hidden element */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Camera Buttons Panel */}
          <div className="bg-slate-900 p-4 flex items-center justify-between gap-3 text-white">
            {photoDataUrl ? (
              <button
                type="button"
                id="retake-photo-btn"
                onClick={handleRetake}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {lang === "English" ? "Scan Another Pack" : "మళ్లీ స్కాన్ చేయి"}
              </button>
            ) : (
              <button
                type="button"
                id="shutter-capture-btn"
                disabled={!hasCamera}
                onClick={capturePhoto}
                className="mx-auto w-12 h-12 bg-red-600 hover:bg-red-500 active:scale-95 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-full border-4 border-white flex items-center justify-center shadow-lg transition cursor-pointer"
                title={lang === "English" ? "Take Photo" : "ఫోటో తీయి"}
              >
                <span className="w-4 h-4 bg-white rounded-full" />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PRESET SIMULATOR & SAFETY DIAGNOSTICS */}
        <div className="md:col-span-6 space-y-6">
          {/* SIMULATED PRESET SELECTOR (Works in iframe previews) */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {lang === "English" ? "Interactive Medication Presets" : "ఇంటరాక్టివ్ మందుల నమూనాలు"}
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {lang === "English"
                ? "Test real Gemini AI safety verification instantly. Choose a simulated blister pack below to load, snap a high-fidelity rendering, and cross-reference against your saved profile!"
                : "కింది నమూనా మందులలో ఒకదానిని ఎంచుకుని, మీ ప్రొఫైల్‌తో జెమిని AI భద్రతా విశ్లేషణను తనిఖీ చేయండి."}
            </p>

            <div className="space-y-2">
              {simulatedMedications.map((med) => (
                <button
                  key={med.id}
                  type="button"
                  id={`btn-preset-med-${med.id}`}
                  disabled={isScanning}
                  onClick={() => capturePreset(med.image)}
                  className="w-full p-2.5 text-left border border-slate-200 hover:border-rose-300 rounded-xl bg-slate-50 hover:bg-rose-50/20 flex items-center justify-between transition cursor-pointer group"
                >
                  <div className="space-y-0.5">
                    <span className="block text-xs font-bold text-slate-900 group-hover:text-rose-700 transition">
                      {med.name}
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      Brand: {med.brand}
                    </span>
                  </div>
                  <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* AI DIAGNOSTIC REPORT RESULTS */}
          <AnimatePresence mode="wait">
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
                id="scanner-report-card"
              >
                {/* Header Verdict Banner */}
                <div className={`p-4 text-white flex items-center justify-between ${
                  scanResult.verdict === "safe"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-700"
                    : scanResult.verdict === "caution"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-600"
                    : "bg-gradient-to-r from-red-600 to-rose-700"
                }`}>
                  <div className="flex items-center gap-2">
                    {scanResult.verdict === "safe" && <CheckCircle className="w-5 h-5" id="verdict-safe-icon" />}
                    {scanResult.verdict === "caution" && <AlertTriangle className="w-5 h-5" id="verdict-caution-icon" />}
                    {scanResult.verdict === "unsafe" && <XCircle className="w-5 h-5" id="verdict-unsafe-icon" />}
                    <span className="font-bold text-sm tracking-wide uppercase font-sans">
                      {lang === "English" ? `Safety Verdict: ${scanResult.verdict}` : `భద్రతా విశ్లేషణ: ${
                        scanResult.verdict === "safe" ? "సురక్షితం" : scanResult.verdict === "caution" ? "హెచ్చరిక" : "ప్రమాదం"
                      }`}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Medication Details */}
                  <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">
                        {lang === "English" ? "Medication Name" : "మందు పేరు"}
                      </span>
                      <span className="block text-xs font-bold text-slate-800" id="result-med-name">
                        {scanResult.medicationName}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase">
                        {lang === "English" ? "Active Ingredients" : "క్రియాశీల పదార్థాలు"}
                      </span>
                      <span className="block text-xs font-semibold text-slate-700" id="result-active-ingredients">
                        {scanResult.activeIngredients}
                      </span>
                    </div>
                  </div>

                  {/* Clinical Reasoning */}
                  <div className="space-y-1">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">
                      {lang === "English" ? "Safety Analysis & Profile Match" : "ప్రొఫైల్ విశ్లేషణ"}
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium" id="result-reasoning">
                      {scanResult.reasoning}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">
                      {lang === "English" ? "Pharmacist Recommendation" : "ఫార్మసిస్ట్ సలహా"}
                    </span>
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed" id="result-recommendation">
                      {scanResult.recommendation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
