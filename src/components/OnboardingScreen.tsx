import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { UserProfile, PRESET_CHRONIC_CONDITIONS, PRESET_ALLERGIES, PRESET_MEDICATIONS, Language } from "../types";
import { Shield, Save, User, Phone, Check, AlertCircle, RefreshCw } from "lucide-react";

interface OnboardingScreenProps {
  initialProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

export default function OnboardingScreen({
  initialProfile,
  onSave,
  onCancel,
  isEditMode = false,
}: OnboardingScreenProps) {
  const [fullName, setFullName] = useState("");
  const [biologicalSex, setBiologicalSex] = useState<"Male" | "Female" | "Other" | "">("");
  const [ageYears, setAgeYears] = useState<number | "">("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [chronicConditions, setChronicConditions] = useState<string[]>([]);
  const [knownAllergies, setKnownAllergies] = useState<string[]>([]);
  const [activeMedications, setActiveMedications] = useState<string[]>([]);
  const [emergencyContact1, setEmergencyContact1] = useState("");
  const [emergencyContact2, setEmergencyContact2] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<Language>("English");
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  // Custom additions inputs
  const [customCondition, setCustomCondition] = useState("");
  const [customAllergy, setCustomAllergy] = useState("");
  const [customMed, setCustomMed] = useState("");

  // Validation state
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialProfile) {
      setFullName(initialProfile.fullName);
      setBiologicalSex(initialProfile.biologicalSex);
      setAgeYears(initialProfile.ageYears);
      setBloodGroup(initialProfile.bloodGroup);
      setChronicConditions(initialProfile.chronicConditions || []);
      setKnownAllergies(initialProfile.knownAllergies || []);
      setActiveMedications(initialProfile.activeMedications || []);
      setEmergencyContact1(initialProfile.emergencyContact1);
      setEmergencyContact2(initialProfile.emergencyContact2);
      setPreferredLanguage(initialProfile.preferredLanguage);
      setDisclaimerAccepted(true); // Pre-accepted if editing
    }
  }, [initialProfile]);

  const handleToggleChip = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddCustom = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setValue("");
    }
  };

  const validate = (): boolean => {
    if (!fullName.trim()) {
      setValidationError(preferredLanguage === "English" ? "Full Name is required" : "పూర్తి పేరు అవసరం");
      return false;
    }
    if (!biologicalSex) {
      setValidationError(preferredLanguage === "English" ? "Biological Sex selection is required" : "లింగం ఎంపిక అవసరం");
      return false;
    }
    if (ageYears === "" || Number(ageYears) <= 0 || Number(ageYears) > 120) {
      setValidationError(preferredLanguage === "English" ? "Please enter a valid age (1-120)" : "దయచేసి సరైన వయస్సు నమోదు చేయండి (1-120)");
      return false;
    }
    if (!bloodGroup) {
      setValidationError(preferredLanguage === "English" ? "Blood Group is required" : "రక్త గ్రూప్ అవసరం");
      return false;
    }
    if (!emergencyContact1.trim()) {
      setValidationError(preferredLanguage === "English" ? "Primary Emergency Contact is required" : "ప్రాథమిక అత్యవసర కాంటాక్ట్ అవసరం");
      return false;
    }
    // Simple phone format validation (Indian numbers often 10 digits, allow standard characters)
    const phoneRegex = /^[0-9\s+-]{10,15}$/;
    if (!phoneRegex.test(emergencyContact1.replace(/\s+/g, ""))) {
      setValidationError(preferredLanguage === "English" ? "Primary Emergency Contact must be a valid phone number" : "ప్రాథమిక అత్యవసర కాంటాక్ట్ నంబర్ చెల్లుబాటు అయ్యేది కాదు");
      return false;
    }
    if (emergencyContact2.trim() && !phoneRegex.test(emergencyContact2.replace(/\s+/g, ""))) {
      setValidationError(preferredLanguage === "English" ? "Secondary Emergency Contact must be a valid phone number" : "ద్వితీయ అత్యవసర కాంటాక్ట్ నంబర్ చెల్లుబాటు అయ్యేది కాదు");
      return false;
    }
    if (!disclaimerAccepted) {
      setValidationError(preferredLanguage === "English" ? "You must accept the safety notice disclaimer to proceed" : "కొనసాగడానికి మీరు భద్రతా నోటీసు నిరాకరణను అంగీకరించాలి");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const profile: UserProfile = {
      id: initialProfile?.id || "user_profile_primary",
      fullName: fullName.trim(),
      biologicalSex: biologicalSex as any,
      ageYears: Number(ageYears),
      bloodGroup,
      chronicConditions,
      knownAllergies,
      activeMedications,
      emergencyContact1: emergencyContact1.trim(),
      emergencyContact2: emergencyContact2.trim(),
      preferredLanguage,
    };

    onSave(profile);
  };

  const isFormComplete =
    fullName.trim() &&
    biologicalSex &&
    ageYears !== "" &&
    bloodGroup &&
    emergencyContact1.trim() &&
    disclaimerAccepted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden"
      id="onboarding-card"
    >
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white text-center relative">
        <div className="absolute right-4 top-4 bg-white/20 hover:bg-white/30 text-white rounded-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5 cursor-pointer select-none transition"
             onClick={() => setPreferredLanguage(prev => prev === "English" ? "Telugu" : "English")}>
          <RefreshCw className="w-3.5 h-3.5" />
          {preferredLanguage === "English" ? "తెలుగు" : "English"}
        </div>
        <div className="w-12 h-12 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-3">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold font-sans tracking-tight">
          {isEditMode 
            ? (preferredLanguage === "English" ? "Edit Emergency Medical Profile" : "అత్యవసర వైద్య ప్రొఫైల్ సవరించండి")
            : (preferredLanguage === "English" ? "Set Up Your Local Emergency Profile" : "మీ అత్యవసర ప్రొఫైల్ సెట్ చేసుకోండి")
          }
        </h1>
        <p className="text-white/80 text-sm mt-1 max-w-lg mx-auto">
          {preferredLanguage === "English"
            ? "Your medical data stays strictly on-device. It will never be uploaded to any server or cloud database."
            : "మీ వైద్య డేటా ఖచ్చితంగా మీ పరికరంలో మాత్రమే ఉంటుంది. ఇది ఏ సర్వర్ లేదా క్లౌడ్ డేటాబేస్కు అప్‌లోడ్ చేయబడదు."}
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
        {/* Personal Details Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-rose-500" />
            {preferredLanguage === "English" ? "Personal Medical Identity" : "వ్యక్తిగత వైద్య గుర్తింపు"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="full-name-input">
                {preferredLanguage === "English" ? "Full Name *" : "పూర్తి పేరు *"}
              </label>
              <input
                id="full-name-input"
                type="text"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm transition"
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="sex-select">
                  {preferredLanguage === "English" ? "Biological Sex *" : "లింగం *"}
                </label>
                <select
                  id="sex-select"
                  className="w-full px-2 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white transition"
                  value={biologicalSex}
                  onChange={(e) => setBiologicalSex(e.target.value as any)}
                  required
                >
                  <option value="">--</option>
                  <option value="Male">{preferredLanguage === "English" ? "Male" : "పురుషుడు"}</option>
                  <option value="Female">{preferredLanguage === "English" ? "Female" : "స్త్రీ"}</option>
                  <option value="Other">{preferredLanguage === "English" ? "Other" : "ఇతర"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="age-input">
                  {preferredLanguage === "English" ? "Age (Years) *" : "వయస్సు (సంవత్సరాలు) *"}
                </label>
                <input
                  id="age-input"
                  type="number"
                  min="1"
                  max="120"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm transition"
                  placeholder="e.g. 35"
                  value={ageYears}
                  onChange={(e) => setAgeYears(e.target.value === "" ? "" : Number(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="blood-group-select">
                {preferredLanguage === "English" ? "Blood Group *" : "రక్త గ్రూప్ *"}
              </label>
              <select
                id="blood-group-select"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white transition"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
              >
                <option value="">-- Select Blood Group --</option>
                <option value="A+">A +ve</option>
                <option value="A-">A -ve</option>
                <option value="B+">B +ve</option>
                <option value="B-">B -ve</option>
                <option value="O+">O +ve</option>
                <option value="O-">O -ve</option>
                <option value="AB+">AB +ve</option>
                <option value="AB-">AB -ve</option>
                <option value="HH">Bombay Blood Group (HH)</option>
                <option value="Unknown">Unknown / దేనికీ సరిపోలదు</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="language-select">
                {preferredLanguage === "English" ? "Preferred Language *" : "ప్రాధాన్య భాష *"}
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  id="lang-eng-btn"
                  className={`py-1.5 px-3 rounded-lg border text-sm font-semibold transition ${
                    preferredLanguage === "English"
                      ? "bg-rose-50 border-rose-500 text-rose-700 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                  onClick={() => setPreferredLanguage("English")}
                >
                  English
                </button>
                <button
                  type="button"
                  id="lang-tel-btn"
                  className={`py-1.5 px-3 rounded-lg border text-sm font-semibold transition ${
                    preferredLanguage === "Telugu"
                      ? "bg-rose-50 border-rose-500 text-rose-700 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                  onClick={() => setPreferredLanguage("Telugu")}
                >
                  తెలుగు (Telugu)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts Section */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-500" />
            {preferredLanguage === "English" ? "Emergency Contacts (India)" : "అత్యవసర సంప్రదింపులు (భారతదేశం)"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="contact-1-input">
                {preferredLanguage === "English" ? "Primary Emergency Contact *" : "ప్రాథమిక అత్యవసర కాంటాక్ట్ *"}
              </label>
              <input
                id="contact-1-input"
                type="tel"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm transition"
                placeholder="e.g. +91 9876543210"
                value={emergencyContact1}
                onChange={(e) => setEmergencyContact1(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="contact-2-input">
                {preferredLanguage === "English" ? "Secondary Emergency Contact" : "ద్వితీయ అత్యవసర కాంటాక్ట్"}
              </label>
              <input
                id="contact-2-input"
                type="tel"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm transition"
                placeholder="e.g. 040-23456789"
                value={emergencyContact2}
                onChange={(e) => setEmergencyContact2(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Chronic Conditions (Multi-select) */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <span className="block text-sm font-semibold text-slate-700">
              {preferredLanguage === "English" ? "Chronic Health Conditions" : "దీర్ఘకాలిక ఆరోగ్య సమస్యలు"}
            </span>
            <span className="block text-xs text-slate-500 mt-0.5">
              {preferredLanguage === "English"
                ? "Select all that apply. Used to check drug safety in medication scanner."
                : "వర్తించే అన్నింటినీ ఎంచుకోండి. మందుల స్కానర్‌లో భద్రతను తనిఖీ చేయడానికి ఉపయోగించబడుతుంది."}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_CHRONIC_CONDITIONS.map((cond) => {
              const selected = chronicConditions.includes(cond);
              return (
                <button
                  type="button"
                  key={cond}
                  id={`chip-cond-${cond}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 cursor-pointer transition select-none ${
                    selected
                      ? "bg-rose-50 border-rose-500 text-rose-700 font-semibold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                  onClick={() => handleToggleChip(chronicConditions, setChronicConditions, cond)}
                >
                  {selected && <Check className="w-3 h-3" />}
                  {cond}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              id="custom-condition-input"
              className="px-3 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs w-full"
              placeholder={preferredLanguage === "English" ? "Add custom condition..." : "ఇతర సమస్యను జోడించండి..."}
              value={customCondition}
              onChange={(e) => setCustomCondition(e.target.value)}
            />
            <button
              type="button"
              id="add-condition-btn"
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              onClick={() => handleAddCustom(customCondition, setCustomCondition, chronicConditions, setChronicConditions)}
            >
              +
            </button>
          </div>
        </div>

        {/* Known Allergies (Multi-select) */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <span className="block text-sm font-semibold text-slate-700">
              {preferredLanguage === "English" ? "Known Allergies" : "అలర్జీలు (Allergies)"}
            </span>
            <span className="block text-xs text-slate-500 mt-0.5">
              {preferredLanguage === "English"
                ? "Select known active chemical or drug allergies to avoid dangerous reactions."
                : "ప్రమాదకరమైన ప్రతిచర్యలను నివారించడానికి తెలిసిన రసాయన లేదా ఔషధ అలర్జీలను ఎంచుకోండి."}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_ALLERGIES.map((allergy) => {
              const selected = knownAllergies.includes(allergy);
              return (
                <button
                  type="button"
                  key={allergy}
                  id={`chip-allergy-${allergy}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 cursor-pointer transition select-none ${
                    selected
                      ? "bg-amber-50 border-amber-500 text-amber-800 font-semibold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                  onClick={() => handleToggleChip(knownAllergies, setKnownAllergies, allergy)}
                >
                  {selected && <Check className="w-3 h-3 text-amber-600" />}
                  {allergy}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              id="custom-allergy-input"
              className="px-3 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs w-full"
              placeholder={preferredLanguage === "English" ? "Add custom allergy..." : "ఇతర అలర్జీని జోడించండి..."}
              value={customAllergy}
              onChange={(e) => setCustomAllergy(e.target.value)}
            />
            <button
              type="button"
              id="add-allergy-btn"
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              onClick={() => handleAddCustom(customAllergy, setCustomAllergy, knownAllergies, setKnownAllergies)}
            >
              +
            </button>
          </div>
        </div>

        {/* Current Active Medications (Multi-select) */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <span className="block text-sm font-semibold text-slate-700">
              {preferredLanguage === "English" ? "Current Active Medications" : "ప్రస్తుతం వాడుతున్న మందులు"}
            </span>
            <span className="block text-xs text-slate-500 mt-0.5">
              {preferredLanguage === "English"
                ? "Helps detect drug-drug interactions when scanning new medications."
                : "కొత్త మందులను స్కాన్ చేస్తున్నప్పుడు ప్రతికూల కలయికలను గుర్తించడంలో సహాయపడుతుంది."}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {PRESET_MEDICATIONS.map((med) => {
              const selected = activeMedications.includes(med);
              return (
                <button
                  type="button"
                  key={med}
                  id={`chip-med-${med}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 cursor-pointer transition select-none ${
                    selected
                      ? "bg-blue-50 border-blue-500 text-blue-700 font-semibold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                  onClick={() => handleToggleChip(activeMedications, setActiveMedications, med)}
                >
                  {selected && <Check className="w-3 h-3 text-blue-600" />}
                  {med}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              id="custom-med-input"
              className="px-3 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs w-full"
              placeholder={preferredLanguage === "English" ? "Add custom medication..." : "ఇతర మందు జోడించండి..."}
              value={customMed}
              onChange={(e) => setCustomMed(e.target.value)}
            />
            <button
              type="button"
              id="add-med-btn"
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              onClick={() => handleAddCustom(customMed, setCustomMed, activeMedications, setActiveMedications)}
            >
              +
            </button>
          </div>
        </div>

        {/* Disclaimer Safety Notice */}
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                {preferredLanguage === "English" ? "Important Medical Safety Notice" : "ముఖ్యమైన వైద్య భద్రతా నోటీసు"}
              </h4>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                {preferredLanguage === "English"
                  ? "AIVO is designed as an emergency first-aid instruction assistant and is NOT a substitute for professional medical treatment, diagnosis, or rapid ambulance response. Always contact official medical authorities (108 in India) immediately during a critical life-threatening emergency. All profile details stay stored strictly on your local browser cache (Room DB equivalent) and never leave your device."
                  : "AIVO అత్యవసర ప్రథమ చికిత్స సూచనల సహాయకుడిగా మాత్రమే రూపొందించబడింది మరియు ఇది వృత్తిపరమైన వైద్య చికిత్స, రోగనిర్ధారణ లేదా వేగవంతమైన అంబులెన్స్ ప్రతిస్పందనకు ప్రత్యామ్నాయం కాదు. ప్రాణాపాయ అత్యవసర పరిస్థితుల్లో ఎల్లప్పుడూ వెంటనే అధికారిక వైద్య సహాయాన్ని (భారతదేశంలో 108) సంప్రదించండి. మీ ప్రొఫైల్ వివరాలన్నీ ఖచ్చితంగా మీ స్థానిక బ్రౌజర్ క్యాష్ (రూమ్ DB సమానం) లో మాత్రమే నిల్వ చేయబడతాయి మరియు మీ పరికరాన్ని వదిలి వెళ్లవు."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pl-1">
            <input
              type="checkbox"
              id="disclaimer-checkbox"
              className="w-4 h-4 text-rose-600 border-rose-300 rounded focus:ring-rose-500 cursor-pointer"
              checked={disclaimerAccepted}
              onChange={(e) => setDisclaimerAccepted(e.target.checked)}
              required
            />
            <label htmlFor="disclaimer-checkbox" className="text-xs font-semibold text-rose-950 cursor-pointer select-none">
              {preferredLanguage === "English" 
                ? "I understand and accept this mandatory medical disclaimer. *"
                : "నేను ఈ తప్పనిసరి వైద్య నిరాకరణను అర్థం చేసుకున్నాను మరియు అంగీకరిస్తున్నాను. *"}
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {isEditMode && onCancel && (
            <button
              type="button"
              id="cancel-onboarding-btn"
              onClick={onCancel}
              className="w-full sm:w-1/3 py-2.5 px-4 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              {preferredLanguage === "English" ? "Cancel" : "రద్దు చేయి"}
            </button>
          )}
          <button
            type="submit"
            id="save-profile-btn"
            disabled={!isFormComplete}
            className={`w-full sm:flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition ${
              isFormComplete
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200 cursor-pointer"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            }`}
          >
            <Save className="w-4 h-4" />
            {isEditMode
              ? (preferredLanguage === "English" ? "Update Medical Profile" : "ప్రొఫైల్ నవీకరించండి")
              : (preferredLanguage === "English" ? "Create Emergency Profile" : "ప్రొఫైల్ సృష్టించండి")
            }
          </button>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{validationError}</span>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}
