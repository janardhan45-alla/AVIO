export type Language = "English" | "Telugu";

export interface UserProfile {
  id: string;
  fullName: string;
  biologicalSex: "Male" | "Female" | "Other" | "";
  ageYears: number | "";
  bloodGroup: string;
  chronicConditions: string[];
  knownAllergies: string[];
  activeMedications: string[];
  emergencyContact1: string;
  emergencyContact2: string;
  preferredLanguage: Language;
}

export type EmergencyCategory =
  | "HEART_ATTACK"
  | "SNAKEBITE"
  | "BLEEDING"
  | "SEIZURE"
  | "DROWNING"
  | "ELECTRIC_SHOCK";

export interface OfflineProtocol {
  category: EmergencyCategory;
  titleEnglish: string;
  titleTelugu: string;
  englishSteps: string[];
  teluguSteps: string[];
  doListEnglish: string[];
  doListTelugu: string[];
  dontListEnglish: string[];
  dontListTelugu: string[];
}

export interface ScanResult {
  medicationName: string;
  activeIngredients: string;
  verdict: "safe" | "caution" | "unsafe";
  reasoning: string;
  recommendation: string;
}

// Preset Chips for the Onboarding / Settings Screen
export const PRESET_CHRONIC_CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Epilepsy",
  "Kidney Disease",
  "Thyroid Disorder",
  "COPD"
];

export const PRESET_ALLERGIES = [
  "Penicillin",
  "Sulfa Drugs",
  "Aspirin",
  "Ibuprofen",
  "Peanuts",
  "Latex",
  "Shellfish",
  "Bee Stings",
  "Nuts"
];

export const PRESET_MEDICATIONS = [
  "Metformin",
  "Amlodipine",
  "Levothyroxine",
  "Atorvastatin",
  "Albuterol Inhaler",
  "Espirin",
  "Levetiracetam",
  "Phenytoin",
  "Insulin"
];

// Seeded Offline Protocols
export const SEEDED_PROTOCOLS: OfflineProtocol[] = [
  {
    category: "HEART_ATTACK",
    titleEnglish: "Heart Attack (గుండెపోటు)",
    titleTelugu: "గుండెపోటు (Heart Attack)",
    englishSteps: [
      "Call 108 immediately.",
      "Help the person sit down in a comfortable, half-sitting position and loosen tight clothing.",
      "Ask if they have prescribed heart medication (e.g. aspirin/nitroglycerin) and help them take it if so.",
      "Keep them calm and still, monitor breathing and consciousness.",
      "If they become unresponsive and stop breathing normally, begin CPR if trained.",
      "Stay with them until help arrives."
    ],
    teluguSteps: [
      "వెంటనే 108 కి కాల్ చేయండి.",
      "బాధితుడిని సౌకర్యవంతంగా అర-కూర్చునే (half-sitting) స్థితిలో కూర్చోబెట్టండి మరియు బిగుతుగా ఉండే బట్టలను సడలించండి.",
      "వారికి గుండె సంబంధిత మందులు (ఉదా. ఆస్పిరిన్/నైట్రోగ్లిజరిన్) సూచించబడి ఉంటే అడగండి మరియు అవి వేసుకోవడానికి సహాయపడండి.",
      "వారిని ప్రశాంతంగా ఉంచండి, శ్వాస మరియు స్పృహను పర్యవేక్షించండి.",
      "ఒకవేళ వారు స్పృహ కోల్పోయి సాధారణ శ్వాస ఆగిపోతే, శిక్షణ పొందినట్లయితే వెంటనే CPR ప్రారంభించండి.",
      "సహాయం వచ్చే వరకు వారితోనే ఉండండి."
    ],
    doListEnglish: [
      "Keep them calm.",
      "Loosen clothing.",
      "Call for help immediately.",
      "Note the time symptoms started."
    ],
    doListTelugu: [
      "వారిని ప్రశాంతంగా ఉంచండి.",
      "బిగుతు దుస్తులను సడలించండి.",
      "వెంటనే సహాయం కోసం కాల్ చేయండి.",
      "లక్షణాలు ప్రారంభమైన సమయాన్ని గుర్తించండి."
    ],
    dontListEnglish: [
      "Don't let them walk around or exert themselves.",
      "Don't give food or water.",
      "Don't give medication unless it's their own prescribed heart medication.",
      "Don't leave them alone."
    ],
    dontListTelugu: [
      "నడవనివ్వవద్దు లేదా శ్రమించనివ్వవద్దు.",
      "ఆహారం లేదా నీరు ఇవ్వవద్దు.",
      "వారి స్వంత ప్రిస్క్రిప్షన్ గుండె మందులు కాకుండా వేరే ఏ ఇతర మందులూ ఇవ్వవద్దు.",
      "వారిని ఒంటరిగా వదిలివేయవద్దు."
    ]
  },
  {
    category: "SNAKEBITE",
    titleEnglish: "Snakebite (పాము కాటు)",
    titleTelugu: "పాము కాటు (Snakebite)",
    englishSteps: [
      "Keep the victim completely calm and still. Movement accelerates the spread of venom through the bloodstream.",
      "Immobilize the bitten limb (similar to splinting a fracture) and keep it positioned at or below the level of the heart.",
      "Gently remove any tight clothing, rings, bracelets, or jewelry near the bite site before swelling begins.",
      "Clean the bite area gently with water. Do NOT rub, scrub, or wash off venom completely if medical testing is required later.",
      "Call India Emergency Services (108) immediately or transport the victim to the nearest hospital stocked with Anti-Snake Venom (ASV)."
    ],
    teluguSteps: [
      "బాధితుడిని పూర్తిగా ప్రశాంతంగా మరియు కదలకుండా ఉంచండి. కదలికలు రక్తప్రవాహం ద్వారా విషం వ్యాప్తిని వేగవంతం చేస్తాయి.",
      "కాటు వేసిన అవయవాన్ని కదలకుండా ఉంచండి (ఫ్రాక్చర్‌కు కట్టు కట్టినట్లు) మరియు దానిని గుండె స్థాయికి సమానంగా లేదా అంతకంటే తక్కువగా ఉంచండి.",
      "వాపు ప్రారంభమవడానికి ముందే కాటు వేసిన ప్రదేశానికి సమీపంలో ఉన్న బిగుతుగా ఉన్న బట్టలు, ఉంగరాలు, గాజులు లేదా ఆభరణాలను సున్నితంగా తొలగించండి.",
      "కాటు వేసిన ప్రదేశాన్ని నీటితో సున్నితంగా శుభ్రం చేయండి. తదుపరి వైద్య పరీక్షల కోసం విషాన్ని పూర్తిగా కడగకండి మరియు రుద్దకండి.",
      "వెంటనే భారత అత్యవసర సేవలకు (108) కాల్ చేయండి లేదా యాంటీ-స్నేక్ వెనమ్ (ASV) అందుబాటులో ఉన్న సమీప ఆసుపత్రికి బాధితుడిని తరలించండి."
    ],
    doListEnglish: [
      "Keep the bitten limb still and low.",
      "Note the exact time of the bite.",
      "Try to memorize the color, size, and shape of the snake if safe.",
      "Reassure the victim that most snakebites are treatable."
    ],
    doListTelugu: [
      "కాటు వేసిన భాగాన్ని కదలకుండా, గుండె కంటే కిందగా ఉంచండి.",
      "కాటు వేసిన ఖచ్చితమైన సమయాన్ని గుర్తించుకోండి.",
      "సురక్షితంగా ఉంటే పాము రంగు, పరిమాణం మరియు ఆకారాన్ని గుర్తుంచుకోవడానికి ప్రయత్నించండి.",
      "చాలా పాము కాట్లకు చికిత్స ఉందని బాధితుడికి ధైర్యం చెప్పండి."
    ],
    dontListEnglish: [
      "Do NOT cut or incise the wound.",
      "Do NOT try to suck the venom out with your mouth.",
      "Do NOT apply a tight tourniquet (can cut off circulation and lead to amputation).",
      "Do NOT apply ice, electricity, or traditional herbal pastes directly."
    ],
    dontListTelugu: [
      "గాయాన్ని కోయడం లేదా గాట్లు పెట్టడం చేయవద్దు.",
      "నోటితో విషాన్ని పీల్చడానికి ప్రయత్నించవద్దు.",
      "బిగుతైన టోర్నికెట్ (రక్త ప్రసరణ ఆపేలా గట్టిగా కట్టడం) కట్టవద్దు.",
      "మంచు, విద్యుత్ షాక్‌లు లేదా సాంప్రదాయ మూలికా పేస్ట్‌లను నేరుగా రాయవద్దు."
    ]
  },
  {
    category: "BLEEDING",
    titleEnglish: "Severe Bleeding (రక్తస్రావం)",
    titleTelugu: "తీవ్ర రక్తస్రావం (Bleeding)",
    englishSteps: [
      "Apply direct, firm pressure to the bleeding wound using a clean cloth, sterile bandage, or even your bare gloved hands.",
      "Elevate the bleeding limb above the level of the patient's heart, if there is no sign of a bone fracture.",
      "Have the victim lie down flat, and cover them with a blanket to maintain normal body temperature and prevent medical shock.",
      "If the blood seeps through the bandage, do NOT remove it. Apply another clean bandage directly over the first one and keep pressing.",
      "Secure the bandage with moderate pressure and call 108 immediately if the bleeding is pulsatile, heavy, or does not stop after 10 minutes."
    ],
    teluguSteps: [
      "శుభ్రమైన గుడ్డ, స్టెరైల్ బ్యాండేజ్ లేదా గ్లోవ్స్ వేసుకున్న చేతులతో రక్తస్రావం అవుతున్న గాయంపై నేరుగా, గట్టిగా ఒత్తిడి చేయండి.",
      "ఎముక విరిగినట్లు అనిపించకపోతే, రక్తస్రావం అవుతున్న అవయవాన్ని బాధితుడి గుండె స్థాయి కంటే ఎత్తులో ఉంచండి.",
      "బాధితుడిని నిటారుగా పడుకోబెట్టండి మరియు శరీర ఉష్ణోగ్రతను కాపాడుకోవడానికి, షాక్‌కు గురికాకుండా ఉండటానికి వారిపై దుప్పటి కప్పండి.",
      "రక్తం బ్యాండేజ్ నుండి పైకి వస్తే, దానిని తీసివేయవద్దు. మొదటి దానిపైనే మరొక శుభ్రమైన బ్యాండేజీని వేసి ఒత్తిడిని కొనసాగించండి.",
      "మితమైన ఒత్తిడితో కట్టును భద్రపరచండి. రక్తం చిమ్ముతున్నా, భారీగా ఉన్నా లేదా 10 నిమిషాల తర్వాత కూడా ఆగకపోతే వెంటనే 108 కి కాల్ చేయండి."
    ],
    doListEnglish: [
      "Use clean materials to apply pressure.",
      "Keep pressure steady for at least 5-10 minutes without checking.",
      "Help the person lie down to improve blood flow to brain."
    ],
    doListTelugu: [
      "ఒత్తిడి చేయడానికి శుభ్రమైన పదార్థాలను ఉపయోగించండి.",
      "కనీసం 5-10 నిమిషాల పాటు ఒత్తిడిని స్థిరంగా ఉంచండి (ఆగిందో లేదో పదే పదే చూడవద్దు).",
      "మెదడుకు రక్త ప్రసరణను మెరుగుపరచడానికి బాధితుడిని పడుకోబెట్టండి."
    ],
    dontListEnglish: [
      "Do NOT pull out any deeply embedded foreign objects (like glass or knives) - apply pressure around them.",
      "Do NOT remove the original blood-soaked dressings.",
      "Do NOT wash deep wounds under rushing water as this can dislodge clots."
    ],
    dontListTelugu: [
      "గాయంలో గుచ్చుకున్న వస్తువులను (గాజు ముక్కలు, కత్తులు) బయటకు లాగవద్దు - వాటి చుట్టూ ఒత్తిడి చేయండి.",
      "రక్తంతో తడిసిన మొదటి కట్టును తీసివేయవద్దు.",
      "లోతైన గాయాలను పంపు నీటి కింద కడగవద్దు, ఇది రక్తం గడ్డకట్టడాన్ని నిరోధించవచ్చు."
    ]
  },
  {
    category: "SEIZURE",
    titleEnglish: "Seizure / Fits (మూర్ఛ / ఫిట్స్)",
    titleTelugu: "మూర్ఛ / ఫిట్స్ (Seizure)",
    englishSteps: [
      "Gently ease the person onto the ground to prevent a hard fall, and immediately clear the surrounding area of any sharp or hard objects.",
      "Gently roll the person onto their side (recovery position) as soon as possible to keep their airway open and prevent choking on saliva.",
      "Place a soft, flat object (like a folded jacket, sweater, or small pillow) under their head to protect it from injury.",
      "Loosen any tight clothing around their neck, such as neckties, collars, or scarves, to assist their breathing.",
      "Observe and time the duration of the seizure. Reassure them as they regain consciousness. Do NOT hold them down or force anything into their mouth."
    ],
    teluguSteps: [
      "వ్యక్తి కింద పడి దెబ్బలు తగలకుండా మెల్లగా నేలపై పడుకోబెట్టండి మరియు వెంటనే చుట్టుపక్కల ఉన్న పదునైన లేదా గట్టి వస్తువులను తొలగించండి.",
      "వారి శ్వాసనాళాన్ని తెరిచి ఉంచడానికి మరియు లాలాజలం గొంతులో పడకుండా ఉండటానికి వీలైనంత త్వరగా వారిని ఒక పక్కకు తిప్పండి.",
      "తల గాయాల నుండి రక్షించడానికి వారి తల కింద మృదువైన వస్తువును (మడతపెట్టిన జాకెట్, స్వెటర్ లేదా చిన్న దిండు) ఉంచండి.",
      "శ్వాస తీసుకోవడానికి వీలుగా మెడ చుట్టూ ఉన్న బిగుతైన దుస్తులను (టైలు, కాలర్లు లేదా స్కార్ఫ్‌లు) సడలించండి.",
      "మూర్ఛ ఎంత సమయం వస్తుందో గమనించండి. స్పృహ వచ్చిన తర్వాత వారికి ధైర్యం చెప్పండి. వారిని బలవంతంగా పట్టుకోవద్దు లేదా నోట్లో ఏమీ పెట్టవద్దు."
    ],
    doListEnglish: [
      "Stay calm and keep others back.",
      "Turn the person onto their side.",
      "Protect their head from concrete or hard surfaces."
    ],
    doListTelugu: [
      "ప్రశాంతంగా ఉండండి మరియు ఇతరులను దూరంగా ఉంచండి.",
      "వ్యక్తిని ఒక పక్కకు తిప్పండి.",
      "గట్టి నేల నుండి వారి తల దెబ్బతినకుండా రక్షించండి."
    ],
    dontListEnglish: [
      "Do NOT put anything in the mouth (especially metal keys, spoons, or fingers). This is dangerous and can break teeth.",
      "Do NOT try to hold the person down or restrain their movements.",
      "Do NOT give water, food, or medication until they are fully awake."
    ],
    dontListTelugu: [
      "నోట్లో ఏమీ పెట్టవద్దు (ముఖ్యంగా ఇనుప తాళాలు, స్పూన్లు లేదా వేళ్లు). ఇది ప్రమాదకరం మరియు దంతాలు విరిగిపోవచ్చు.",
      "వ్యక్తిని గట్టిగా పట్టుకోవడానికి లేదా వారి కదలికలను నిరోధించడానికి ప్రయత్నించవద్దు.",
      "పూర్తిగా స్పృహ వచ్చే వరకు నీరు, ఆహారం లేదా మందులు ఇవ్వవద్దు."
    ]
  },
  {
    category: "DROWNING",
    titleEnglish: "Drowning (నీటిలో మునిగిపోవడం)",
    titleTelugu: "నీటిలో మునిగిపోవడం (Drowning)",
    englishSteps: [
      "Safely pull the victim out of the water. Do NOT place yourself in danger; use a flotation device or stick if available.",
      "Lay the victim flat on a firm surface and check for responsiveness by tapping their shoulders and shouting.",
      "Check for breathing. If the victim is NOT breathing, immediately begin CPR starting with chest compressions.",
      "Perform CPR: Give 30 hard and fast chest compressions in the center of the chest, followed by 2 mouth-to-mouth rescue breaths.",
      "Continue CPR cycles without interruption until emergency medical help (108) arrives, or the victim begins breathing and coughing."
    ],
    teluguSteps: [
      "బాధితుడిని సురక్షితంగా నీటి నుండి బయటకు తీయండి. మిమ్మల్ని మీరు ప్రమాదంలో పడేసుకోవద్దు; అందుబాటులో ఉంటే కర్ర లేదా రక్షణ వలయం ఉపయోగించండి.",
      "బాధితుడిని గట్టి ఉపరితలంపై నిటారుగా పడుకోబెట్టండి మరియు భుజాలపై తట్టి, గట్టిగా పిలిచి స్పందన ఉందో లేదో తనిఖీ చేయండి.",
      "శ్వాసను తనిఖీ చేయండి. బాధితుడు శ్వాస తీసుకోకపోతే, వెంటనే ఛాతీ కదలికలతో CPR ప్రారంభించండి.",
      "CPR చేయండి: ఛాతీ మధ్యలో 30 సార్లు గట్టిగా మరియు వేగంగా నొక్కండి, ఆపై 2 సార్లు నోటి ద్వారా శ్వాసను ఇవ్వండి.",
      "అత్యవసర వైద్య సహాయం (108) వచ్చే వరకు లేదా బాధితుడు శ్వాస తీసుకోవడం మరియు దగ్గడం ప్రారంభించే వరకు అంతరాయం లేకుండా CPR కొనసాగించండి."
    ],
    doListEnglish: [
      "Ensure personal safety during rescue.",
      "Start CPR immediately if breathing is absent.",
      "Remove wet clothes and wrap in dry blankets once breathing."
    ],
    doListTelugu: [
      "రక్షించేటప్పుడు వ్యక్తిగత భద్రతను నిర్ధారించుకోండి.",
      "శ్వాస లేకపోతే వెంటనే CPR ప్రారంభించండి.",
      "శ్వాస వచ్చిన తర్వాత తడి బట్టలు తీసివేసి పొడి దుప్పట్లలో కప్పండి."
    ],
    dontListEnglish: [
      "Do NOT waste time trying to squeeze water out of the stomach or lungs before starting CPR.",
      "Do NOT leave the victim unattended even if they seem completely fine (risk of secondary delayed drowning)."
    ],
    dontListTelugu: [
      "CPR ప్రారంభించడానికి ముందు పొట్ట నుండి లేదా ఊపిరితిత్తుల నుండి నీటిని పిండటానికి సమయాన్ని వృథా చేయవద్దు.",
      "బాధితుడు పూర్తిగా కోలుకున్నట్లు అనిపించినా ఒంటరిగా వదిలివేయవద్దు (సెకండరీ లేదా ఆలస్యమైన మునిగిపోయే ప్రమాదం ఉంది)."
    ]
  },
  {
    category: "ELECTRIC_SHOCK",
    titleEnglish: "Electric Shock (విద్యుత్ షాక్)",
    titleTelugu: "విద్యుత్ షాక్ (Electric Shock)",
    englishSteps: [
      "Do NOT touch the victim if they are still in contact with the live electrical source. You will be shocked too.",
      "Turn off the main electrical power switch/breaker immediately, or use a dry wooden stick, plastic broom, or rubber mat to safely push the source away.",
      "Once safe and separated, assess the victim's responsiveness, pulse, and breathing immediately.",
      "If there is no pulse or breathing, immediately begin CPR (30 compressions followed by 2 rescue breaths).",
      "Cover any entrance/exit burn wounds with a clean, dry, sterile dressing and treat the victim for shock while waiting for 108 ambulance."
    ],
    teluguSteps: [
      "బాధితుడు ఇంకా విద్యుత్ ప్రవాహంతో సంబంధంలో ఉంటే వారిని తాకవద్దు. అలా చేస్తే మీకు కూడా షాక్ తగులుతుంది.",
      "వెంటనే ప్రధాన విద్యుత్ పవర్ స్విచ్ ఆఫ్ చేయండి, లేదా పొడి కర్ర, ప్లాస్టిక్ చీపురు లేదా రబ్బరు మ్యాట్‌తో విద్యుత్ వైరును పక్కకు నెట్టండి.",
      "సురక్షితంగా విడదీసిన తర్వాత, వెంటనే బాధితుడి స్పందన, పల్స్ మరియు శ్వాసను తనిఖీ చేయండి.",
      "పల్స్ లేదా శ్వాస లేకపోతే, వెంటనే CPR ప్రారంభించండి (30 సార్లు ఛాతీని నొక్కడం, 2 సార్లు కృత్రిమ శ్వాస ఇవ్వడం).",
      "కాలిపోయిన గాయాలపై పొడి, శుభ్రమైన బట్టను కప్పండి మరియు 108 అంబులెన్స్ వచ్చే వరకు బాధితుడికి ధైర్యం చెప్తూ వెచ్చగా ఉంచండి."
    ],
    doListEnglish: [
      "Isolate the electrical source before touching.",
      "Check breathing and heart rate immediately after separation.",
      "Stand on a dry wooden board or rubber mat during rescue."
    ],
    doListTelugu: [
      "తాకడానికి ముందు విద్యుత్ వనరును వేరు చేయండి.",
      "వేరు చేసిన వెంటనే శ్వాస మరియు గుండె కొట్టుకోవడాన్ని తనిఖీ చేయండి.",
      "రక్షించేటప్పుడు పొడి చెక్క పలక లేదా రబ్బరు మ్యాట్‌పై నిలబడండి."
    ],
    dontListEnglish: [
      "Do NOT approach a victim near high-voltage lines until power is confirmed off by professionals.",
      "Do NOT apply water or wet materials near active electricity.",
      "Do NOT touch the victim with bare hands while they are connected to electricity."
    ],
    dontListTelugu: [
      "అధిక వోల్టేజ్ లైన్ల వద్ద విద్యుత్ నిలిపివేసినట్లు నిర్ధారించే వరకు బాధితుడి దగ్గరకు వెళ్లవద్దు.",
      "విద్యుత్ ప్రవాహం ఉన్న చోట నీరు లేదా తడి వస్తువులను ఉపయోగించవద్దు.",
      "కరెంట్ ప్రవహిస్తున్నప్పుడు బాధితుడిని ఖాళీ చేతులతో తాకవద్దు."
    ]
  }
];
