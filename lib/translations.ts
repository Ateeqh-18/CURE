import { LanguageInfo, SupportedLanguage } from './types';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', region: 'Global / India', dir: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'Karnataka', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'North / Central India', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'Tamil Nadu', dir: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'Andhra / Telangana', dir: 'ltr' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', region: 'Kerala', dir: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', region: 'Maharashtra', dir: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', region: 'West Bengal', dir: 'ltr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', region: 'Gujarat', dir: 'ltr' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', region: 'Punjab', dir: 'ltr' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', region: 'Odisha', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', region: 'Pan-India', dir: 'rtl' },
];

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  demoBadge: string;
  disclaimerTitle: string;
  disclaimerTag: string;
  disclaimerText: string;
  disclaimerBullets: [string, string, string];
  tabs: {
    dashboard: string;
    treatmentGuide: string;
    medications: string;
    schedule: string;
    safety: string;
    investigations: string;
    review: string;
    ocrDiagnostics: string;
  };
  actions: {
    uploadPrescription: string;
    sampleCases: string;
    tryDemo: string;
    changeLanguage: string;
    markTaken: string;
    markMissed: string;
    undo: string;
    resetToday: string;
    saveChanges: string;
    savedNotice: string;
    viewDetails: string;
    downloadReport: string;
    generatingPdf: string;
    printGuide: string;
    verifyWithDoctor: string;
    addMedicine: string;
    remove: string;
    addAllergy: string;
    retryTranslation: string;
    back: string;
    processPrescription: string;
    loadCase: string;
    editDetails: string;
    markAttended: string;
    attended: string;
  };
  timeSlots: {
    morning: string;
    afternoon: string;
    evening: string;
    night: string;
  };
  foodInstructions: {
    beforeFood: string;
    afterFood: string;
    withFood: string;
    emptyStomach: string;
    atBedtime: string;
    asDirected: string;
  };
  sections: {
    diagnosisTitle: string;
    diagnosisSubtitle: string;
    todaySchedule: string;
    todayProgress: string;
    safetyAlertsTitle: string;
    safetySubtitle: string;
    investigationsTitle: string;
    followUpTitle: string;
    medicineCardsTitle: string;
    purpose: string;
    dosage: string;
    frequency: string;
    duration: string;
    sideEffects: string;
    precautions: string;
    route: string;
    dailySlots: string;
    symptoms: string;
    generalPrecautions: string;
    dietaryAdvice: string;
  };
  dashboard: {
    criticalConcernTitle: string;
    highRiskTitle: string;
    reviewAlertsBtn: string;
    diagnosisLabel: string;
    conditionsCount: string;
    activeMedications: string;
    prescribedCount: string;
    moreMedications: string;
    nextFollowUp: string;
    asAdvised: string;
    testsAdvised: string;
    trackTestsBtn: string;
    viewMedicineDetailsBtn: string;
    clinicalReviewFallback: string;
    consultantFallback: string;
  };
  patient: {
    clinicalConfidence: string;
    verified: string;
    documentedAllergies: string;
    noAllergiesRecorded: string;
    existingMedications: string;
    noExistingMeds: string;
    reviewRequiredFor: string;
    yearsOld: string;
    notSpecified: string;
    uhid: string;
    sampleCaseTag: string;
  };
  guide: {
    subtitle: string;
    dailyCareTitle: string;
    dailyCareSubtitle: string;
    morningRoutineTitle: string;
    morningRoutineDesc: string;
    afternoonRoutineTitle: string;
    afternoonRoutineDesc: string;
    nightRoutineTitle: string;
    nightRoutineDesc: string;
    medicineCardsSubtitle: string;
  };
  medicine: {
    brandName: string;
    manualVerificationNeeded: string;
    additionalInstructions: string;
    noMedicines: string;
  };
  planner: {
    subtitle: string;
    adherence: string;
    totalDoses: string;
    medicineSingular: string;
    medicinePlural: string;
    takenAt: string;
    ambiguousTitle: string;
    ambiguousDesc: string;
  };
  safety: {
    ruleEngineBadge: string;
    criticalRisks: string;
    highRisks: string;
    moderateConcerns: string;
    incompleteChecks: string;
    protocolTitle: string;
    protocolDesc: string;
    noConflictsTitle: string;
    noConflictsDesc: string;
    medicinesInvolved: string;
    recommendedNextStep: string;
    evidenceReference: string;
  };
  investigations: {
    subtitle: string;
    testsDone: string;
    consultant: string;
    department: string;
    scheduled: string;
    dateNotSpecified: string;
    preVisitInstructions: string;
    diagnosticTestsTitle: string;
    noTestsListed: string;
    purposeLabel: string;
    preparationLabel: string;
    dueLabel: string;
  };
  review: {
    subtitle: string;
    patientIdentityTitle: string;
    fullName: string;
    age: string;
    gender: string;
    rxDate: string;
    doctorName: string;
    hospitalName: string;
    allergiesLabel: string;
    allergyPlaceholder: string;
    medicinesListTitle: string;
    genericName: string;
    brandNameLabel: string;
    strengthLabel: string;
    dosageLabel: string;
    frequencyLabel: string;
    foodLabel: string;
    durationLabel: string;
    routeLabel: string;
    purposeLabel: string;
    uncertainOcrBadge: string;
    saveAndRecalculate: string;
  };
  upload: {
    title: string;
    subtitle: string;
    tryDemoBtn: string;
    dropzoneTitle: string;
    dropzoneSubtitle: string;
    selectedFile: string;
    replaceHint: string;
    backgroundTitle: string;
    allergiesHint: string;
    existingMedsHint: string;
    pasteTextToggle: string;
    pastePlaceholder: string;
    privacyNote: string;
    analyzingTitle: string;
    ocrStep: string;
    extractStep: string;
    safetyStep: string;
  };
  demo: {
    badge: string;
    title: string;
    subtitle: string;
    diagnosisLabel: string;
    syntheticNoticeTitle: string;
    syntheticNoticeDesc: string;
  };
  translation: {
    translatingNotice: string;
    failedWarning: string;
    fallbackNotice: string;
  };
  pdf: {
    reportTitle: string;
    generatedOn: string;
    patientInfoSection: string;
    diagnosisSection: string;
    medicinesSection: string;
    safetySection: string;
    timetableSection: string;
    investigationsSection: string;
    followUpSection: string;
    adviceSection: string;
    disclaimerSection: string;
    unavailable: string;
    errorGenerating: string;
  };
  severities: {
    critical: string;
    high: string;
    moderate: string;
    low: string;
    unverified: string;
  };
  status: {
    taken: string;
    pending: string;
    missed: string;
    completed: string;
  };
  footer: {
    tagline: string;
    capabilities: string;
  };
}

const EN_BASE: TranslationDictionary = {
  appTitle: 'Cure',
  appSubtitle: 'Multilingual Prescription & Medication Safety Assistant',
  demoBadge: 'Demo Mode',
  disclaimerTitle: 'Clinical Notice & Medical Disclaimer',
  disclaimerTag: 'Responsible Healthcare AI',
  disclaimerText:
    'This application helps patients understand and organize their existing prescriptions. It does not replace a doctor’s consultation, diagnosis, or medical advice. Always confirm unclear medication instructions and safety alerts with a qualified healthcare professional.',
  disclaimerBullets: [
    'Automated checks are not a substitute for professional medication review',
    'Never stop prescribed medications without consulting your doctor',
    'Uploaded medical documents remain private and protected',
  ],
  tabs: {
    dashboard: 'Dashboard',
    treatmentGuide: 'Treatment Guide',
    medications: 'Medicines',
    schedule: 'Daily Schedule',
    safety: 'Safety Checks',
    investigations: 'Tests & Follow-up',
    review: 'Review & Edit',
    ocrDiagnostics: 'OCR Diagnostics',
  },
  actions: {
    uploadPrescription: 'Upload Rx',
    sampleCases: 'Sample Cases',
    tryDemo: 'Load Sample Prescription',
    changeLanguage: 'Change Language',
    markTaken: 'Mark Taken',
    markMissed: 'Missed',
    undo: 'Undo',
    resetToday: 'Reset Today',
    saveChanges: 'Save & Update Guide',
    savedNotice: 'Saved & Recalculated!',
    viewDetails: 'View Details',
    downloadReport: 'Download Treatment Report',
    generatingPdf: 'Generating PDF...',
    printGuide: 'Print',
    verifyWithDoctor: 'Confirm with Doctor / Pharmacist',
    addMedicine: 'Add Medicine',
    remove: 'Remove',
    addAllergy: 'Add Allergy',
    retryTranslation: 'Retry Translation',
    back: 'Back',
    processPrescription: 'Process Prescription',
    loadCase: 'Load this case',
    editDetails: 'Edit Medicine Details',
    markAttended: 'Mark as Attended',
    attended: 'Appointment Attended',
  },
  timeSlots: {
    morning: 'Morning (Pratah)',
    afternoon: 'Afternoon (Madhyan)',
    evening: 'Evening (Sandhya)',
    night: 'Night / Bedtime (Ratri)',
  },
  foodInstructions: {
    beforeFood: 'Before food',
    afterFood: 'After food',
    withFood: 'With food',
    emptyStomach: 'Empty stomach',
    atBedtime: 'At bedtime',
    asDirected: 'As directed by physician',
  },
  sections: {
    diagnosisTitle: 'Understanding Your Diagnosis',
    diagnosisSubtitle: 'What your condition means in simple, plain language',
    todaySchedule: "Today's Medication Plan",
    todayProgress: "Today's Adherence Progress",
    safetyAlertsTitle: 'Medication Safety & Risk Alerts',
    safetySubtitle: 'Independent clinical rules cross-referencing drug interactions, duplicates, and allergies',
    investigationsTitle: 'Recommended Medical Tests & Investigations',
    followUpTitle: 'Doctor Follow-up Appointments',
    medicineCardsTitle: 'Prescribed Medicine Details',
    purpose: 'Why it is prescribed (Purpose)',
    dosage: 'Prescribed Dosage',
    frequency: 'How often to take',
    duration: 'Treatment Duration',
    sideEffects: 'Common Possible Side Effects',
    precautions: 'Important Safety Precautions',
    route: 'Route',
    dailySlots: 'Daily Slots',
    symptoms: 'Addressed Symptoms',
    generalPrecautions: 'Important General Precautions',
    dietaryAdvice: 'Dietary & Nutrition Advice',
  },
  dashboard: {
    criticalConcernTitle: 'Critical Safety Concern Detected',
    highRiskTitle: 'High Medication Risk Identified',
    reviewAlertsBtn: 'Review Safety Alerts',
    diagnosisLabel: 'Diagnosis',
    conditionsCount: 'Conditions',
    activeMedications: 'Active Medications',
    prescribedCount: 'Prescribed',
    moreMedications: 'more medications',
    nextFollowUp: 'Next Follow-up',
    asAdvised: 'As Advised',
    testsAdvised: 'diagnostic tests advised',
    trackTestsBtn: 'Track Tests & Appointments',
    viewMedicineDetailsBtn: 'View Medicine Details',
    clinicalReviewFallback: 'Clinical Review',
    consultantFallback: 'Consultant Physician',
  },
  patient: {
    clinicalConfidence: 'Clinical Confidence',
    verified: 'Verified',
    documentedAllergies: 'Documented Allergies',
    noAllergiesRecorded: 'No allergies recorded on prescription. Confirm if you have any drug allergies.',
    existingMedications: 'Regular Existing Medications',
    noExistingMeds: 'None recorded on prescription file.',
    reviewRequiredFor: 'Review Required for',
    yearsOld: 'Yrs',
    notSpecified: 'Not specified',
    uhid: 'UHID',
    sampleCaseTag: 'Sample Case',
  },
  guide: {
    subtitle: 'Personalized, simplified clinical care instructions tailored to your prescription.',
    dailyCareTitle: 'Daily Treatment Care Plan',
    dailyCareSubtitle: 'Follow these simple steps throughout your treatment period.',
    morningRoutineTitle: '1. Morning Routine',
    morningRoutineDesc:
      'Take empty-stomach medications at least 30–45 minutes before tea or breakfast. Take diabetes or blood pressure tablets with or immediately after meals as prescribed.',
    afternoonRoutineTitle: '2. Afternoon & Hydration',
    afternoonRoutineDesc:
      'Take midday tablets with lunch. Stay well-hydrated throughout the day so your kidneys can safely process your medications.',
    nightRoutineTitle: '3. Night & Bedtime Care',
    nightRoutineDesc:
      'Take bedtime cholesterol or allergy tablets with plain water before sleeping. Keep a daily reminder so nighttime doses are not missed.',
    medicineCardsSubtitle: 'Complete details for each prescribed medicine with purpose, side effects, and precautions.',
  },
  medicine: {
    brandName: 'Brand Name',
    manualVerificationNeeded: 'Manual Verification Needed',
    additionalInstructions: 'Additional Instructions',
    noMedicines: 'No medicines extracted yet. Please add or review in the Review & Edit tab.',
  },
  planner: {
    subtitle: 'Track daily doses, mark medicines as taken, and maintain adherence.',
    adherence: 'Adherence',
    totalDoses: 'Total Doses',
    medicineSingular: 'Medicine',
    medicinePlural: 'Medicines',
    takenAt: 'Taken at',
    ambiguousTitle: 'Schedule Confirmation Required',
    ambiguousDesc:
      'Some medications have unclear or as-needed (SOS) frequencies. Do not guess times — confirm exact timings with your doctor or pharmacist.',
  },
  safety: {
    ruleEngineBadge: 'Pharmacopeia Rule Engine',
    criticalRisks: 'Critical Risks',
    highRisks: 'High Risks',
    moderateConcerns: 'Moderate Concerns',
    incompleteChecks: 'Incomplete Checks',
    protocolTitle: 'Crucial Safety Protocol',
    protocolDesc:
      'Never stop taking a prescribed medicine based solely on an automated warning. Show any critical or high alert to your doctor or pharmacist for professional review.',
    noConflictsTitle: 'No Obvious Conflicts Detected',
    noConflictsDesc:
      'The rule engine did not detect duplicate active ingredients or known severe interactions in the reference database for these medicines.',
    medicinesInvolved: 'Medications Involved',
    recommendedNextStep: 'Recommended Next Step',
    evidenceReference: 'Evidence Reference',
  },
  investigations: {
    subtitle: 'Required blood tests, scans, diagnostic procedures, and upcoming doctor follow-ups.',
    testsDone: 'Tests Done',
    consultant: 'Consultant',
    department: 'Department',
    scheduled: 'Scheduled',
    dateNotSpecified: 'Date Not Specified on Rx',
    preVisitInstructions: "Doctor's Pre-Visit Instructions",
    diagnosticTestsTitle: 'Diagnostic Laboratory Investigations',
    noTestsListed: 'No specific diagnostic investigations listed on this prescription.',
    purposeLabel: 'Purpose',
    preparationLabel: 'Preparation',
    dueLabel: 'Due',
  },
  review: {
    subtitle: 'Review OCR and AI extracted fields. Correct any misread words, strengths, dosages, or add missed medicines.',
    patientIdentityTitle: 'Patient Identity & Hospital Records',
    fullName: 'Patient Full Name',
    age: 'Age',
    gender: 'Gender',
    rxDate: 'Prescription Date',
    doctorName: 'Doctor Name',
    hospitalName: 'Hospital / Clinic',
    allergiesLabel: 'Documented Patient Drug Allergies (Critical for Safety Engine)',
    allergyPlaceholder: 'e.g. Penicillin, Sulfa drugs, Aspirin',
    medicinesListTitle: 'Prescribed Medicines List',
    genericName: 'Generic Medicine Name',
    brandNameLabel: 'Brand Name (if any)',
    strengthLabel: 'Strength (e.g. 500 mg)',
    dosageLabel: 'Dosage (e.g. 1 tab)',
    frequencyLabel: 'Frequency (e.g. 1-0-1, BD)',
    foodLabel: 'Food Instruction',
    durationLabel: 'Duration (e.g. 14 days)',
    routeLabel: 'Route',
    purposeLabel: 'Purpose / Explanation for Patient',
    uncertainOcrBadge: 'Uncertain OCR field',
    saveAndRecalculate: 'Save Changes & Recalculate Guide',
  },
  upload: {
    title: 'Upload Doctor Prescription or Discharge Summary',
    subtitle: 'Accepts PDF (multi-page digital or scanned), JPG, JPEG, and PNG. Supports printed and handwritten documents.',
    tryDemoBtn: 'Try Demo Cases (No Upload Needed)',
    dropzoneTitle: 'Click to select prescription file or drag & drop here',
    dropzoneSubtitle: 'Supports multi-page PDF documents, camera photos, or scanned images up to 25MB',
    selectedFile: 'Selected',
    replaceHint: 'Click or drop another file to replace',
    backgroundTitle: 'Patient Background (Optional — improves Safety Checks)',
    allergiesHint: 'Known Drug Allergies (e.g., Penicillin, Sulfa, Aspirin)',
    existingMedsHint: 'Existing Regular Medications (e.g., Ecosprin 75mg, Metformin)',
    pasteTextToggle: 'Or paste raw prescription text / clinical notes',
    pastePlaceholder: 'e.g. Rx: Metformin 500mg 1 tab BD after food, Telma 40mg 1 tab OD morning...',
    privacyNote: 'Your uploaded prescription stays private and is never logged or shared.',
    analyzingTitle: 'Analyzing Prescription with Cure Medical AI...',
    ocrStep: 'Running image preprocessing & OCR on uploaded document...',
    extractStep: 'Extracting structured clinical data, medications & dosages...',
    safetyStep: 'Running clinical drug interaction & allergy safety checks...',
  },
  demo: {
    badge: 'Instant Demo Mode',
    title: 'Select a Realistic Clinical Case',
    subtitle: 'Load synthetic Indian prescriptions to explore OCR review, 12-language translation, safety checks, schedules, and PDF export.',
    diagnosisLabel: 'Diagnosis',
    syntheticNoticeTitle: 'Synthetic Medical Data Notice',
    syntheticNoticeDesc:
      'All demo cases are fictional clinical profiles created strictly for demonstration and not for real medical treatment.',
  },
  translation: {
    translatingNotice: 'Translating complete clinical report...',
    failedWarning: 'Full translation could not be completed. Showing original verified clinical text.',
    fallbackNotice: 'Translated using Cure offline clinical lexicon (configure GEMINI_API_KEY for live neural translation of custom notes).',
  },
  pdf: {
    reportTitle: 'Patient Treatment & Medication Safety Report',
    generatedOn: 'Generated on',
    patientInfoSection: 'Patient & Prescription Details',
    diagnosisSection: 'Diagnosis & Condition Overview',
    medicinesSection: 'Prescribed Medications',
    safetySection: 'Medication Safety & Risk Alerts',
    timetableSection: 'Daily Medication Timetable',
    investigationsSection: 'Recommended Investigations & Lab Tests',
    followUpSection: 'Follow-Up Appointment & Doctor Instructions',
    adviceSection: 'Precautions & Dietary Advice',
    disclaimerSection: 'Medical Disclaimer',
    unavailable: 'Not specified on prescription',
    errorGenerating: 'Failed to generate PDF report. Please try again.',
  },
  severities: {
    critical: 'Critical Risk',
    high: 'High Risk',
    moderate: 'Moderate Risk',
    low: 'Low Risk',
    unverified: 'Check Incomplete / Unverified',
  },
  status: {
    taken: 'Taken',
    pending: 'Upcoming',
    missed: 'Missed',
    completed: 'Completed',
  },
  footer: {
    tagline: 'Cure — Multilingual Prescription & Medication Safety Assistant',
    capabilities: '12 Indian Languages • Independent Pharmacopeia Safety Engine • Multi-Page OCR & Multilingual PDF Reports',
  },
};

function mergeDict(overrides: DeepPartial<TranslationDictionary>): TranslationDictionary {
  const result: any = structuredClone(EN_BASE);
  for (const [k, v] of Object.entries(overrides)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && result[k] && typeof result[k] === 'object') {
      result[k] = { ...result[k], ...v };
    } else if (v !== undefined) {
      result[k] = v;
    }
  }
  return result as TranslationDictionary;
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? (T[P] extends Array<any> ? T[P] : DeepPartial<T[P]>) : T[P];
};

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: EN_BASE,

  kn: mergeDict({
    appTitle: 'Cure (ಕ್ಯೂರ್)',
    appSubtitle: 'ಬಹುಭಾಷಾ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಮತ್ತು ಔಷಧಿ ಸುರಕ್ಷತಾ ಸಹಾಯಕ',
    demoBadge: 'ಮಾದರಿ ಮೋಡ್',
    disclaimerTitle: 'ವೈದ್ಯಕೀಯ ಸೂಚನೆ ಮತ್ತು ಹಕ್ಕು ನಿರಾಕರಣೆ',
    disclaimerTag: 'ಜವಾಬ್ದಾರಿಯುತ ಆರೋಗ್ಯ AI',
    disclaimerText:
      'ಈ ಅಪ್ಲಿಕೇಶನ್ ರೋಗಿಗಳಿಗೆ ಅವರ ವೈದ್ಯರ ಚೀಟಿಯನ್ನು ಸುಲಭವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮತ್ತು ವ್ಯವಸ್ಥಿತಗೊಳಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಇದು ವೈದ್ಯರ ಸಮಾಲೋಚನೆ, ರೋಗನಿರ್ಣಯ ಅಥವಾ ವೈದ್ಯಕೀಯ ಸಲಹೆಗೆ ಪರ್ಯಾಯವಲ್ಲ. ಅಸ್ಪಷ್ಟ ಔಷಧಿ ಸೂಚನೆಗಳು ಮತ್ತು ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಯಾವಾಗಲೂ ಅರ್ಹ ವೈದ್ಯರು ಅಥವಾ ಔಷಧ ತಜ್ಞರೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
    disclaimerBullets: [
      'ಸ್ವಯಂಚಾಲಿತ ತಪಾಸಣೆಗಳು ವೃತ್ತಿಪರ ವೈದ್ಯಕೀಯ ಪರಿಶೀಲನೆಗೆ ಪರ್ಯಾಯವಲ್ಲ',
      'ವೈದ್ಯರ ಸಲಹೆಯಿಲ್ಲದೆ ನಿಗದಿತ ಔಷಧಿಗಳನ್ನು ಎಂದಿಗೂ ನಿಲ್ಲಿಸಬೇಡಿ',
      'ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು ಖಾಸಗಿ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿರುತ್ತವೆ',
    ],
    tabs: {
      dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      treatmentGuide: 'ಚಿಕಿತ್ಸಾ ಮಾರ್ಗದರ್ಶಿ',
      medications: 'ಔಷಧಿಗಳು',
      schedule: 'ದೈನಂದಿನ ವೇಳಾಪಟ್ಟಿ',
      safety: 'ಸುರಕ್ಷತಾ ತಪಾಸಣೆ',
      investigations: 'ಪರೀಕ್ಷೆಗಳು ಮತ್ತು ಭೇಟಿ',
      review: 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ತಿದ್ದಿ',
      ocrDiagnostics: 'OCR ರೋಗನಿರ್ಣಯ',
    },
    actions: {
      uploadPrescription: 'ಚೀಟಿ ಅಪ್‌ಲೋಡ್',
      sampleCases: 'ಮಾದರಿ ಪ್ರಕರಣಗಳು',
      tryDemo: 'ಮಾದರಿ ಚೀಟಿ ಲೋಡ್ ಮಾಡಿ',
      changeLanguage: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
      markTaken: 'ತೆಗೆದುಕೊಂಡೆ',
      markMissed: 'ತಪ್ಪಿದೆ',
      undo: 'ರದ್ದುಮಾಡಿ',
      resetToday: 'ಇಂದಿನದು ಮರುಹೊಂದಿಸಿ',
      saveChanges: 'ಉಳಿಸಿ ಮತ್ತು ಅಪ್‌ಡೇಟ್ ಮಾಡಿ',
      savedNotice: 'ಉಳಿಸಲಾಗಿದೆ ಮತ್ತು ನವೀಕರಿಸಲಾಗಿದೆ!',
      viewDetails: 'ವಿವರ ನೋಡಿ',
      downloadReport: 'ಚಿಕಿತ್ಸಾ ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (PDF)',
      generatingPdf: 'PDF ತಯಾರಾಗುತ್ತಿದೆ...',
      printGuide: 'ಮುದ್ರಿಸಿ',
      verifyWithDoctor: 'ವೈದ್ಯರು / ಔಷಧ ತಜ್ಞರೊಂದಿಗೆ ದೃಢೀಕರಿಸಿ',
      addMedicine: 'ಔಷಧಿ ಸೇರಿಸಿ',
      remove: 'ತೆಗೆದುಹಾಕಿ',
      addAllergy: 'ಅಲರ್ಜಿ ಸೇರಿಸಿ',
      retryTranslation: 'ಭಾಷಾಂತರ ಮರುಪ್ರಯತ್ನಿಸಿ',
      back: 'ಹಿಂದಕ್ಕೆ',
      processPrescription: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ವಿಶ್ಲೇಷಿಸಿ',
      loadCase: 'ಈ ಪ್ರಕರಣ ಲೋಡ್ ಮಾಡಿ',
      editDetails: 'ಔಷಧಿ ವಿವರ ತಿದ್ದಿ',
      markAttended: 'ಭೇಟಿ ಪೂರ್ಣಗೊಂಡಿದೆ',
      attended: 'ಭೇಟಿ ಮುಗಿದಿದೆ',
    },
    timeSlots: {
      morning: 'ಬೆಳಿಗ್ಗೆ (ಪ್ರಾತಃಕಾಲ)',
      afternoon: 'ಮಧ್ಯಾಹ್ನ',
      evening: 'ಸಂಜೆ',
      night: 'ರಾತ್ರಿ (ಮಲಗುವ ಮುನ್ನ)',
    },
    foodInstructions: {
      beforeFood: 'ಊಟಕ್ಕೆ ಮುಂಚೆ',
      afterFood: 'ಊಟದ ನಂತರ',
      withFood: 'ಊಟದ ಜೊತೆಗೆ',
      emptyStomach: 'ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ',
      atBedtime: 'ರಾತ್ರಿ ಮಲಗುವಾಗ',
      asDirected: 'ವೈದ್ಯರು ಸೂಚಿಸಿದಂತೆ',
    },
    sections: {
      diagnosisTitle: 'ನಿಮ್ಮ ರೋಗನಿರ್ಣಯವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ',
      diagnosisSubtitle: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಸ್ಥಿತಿಯ ಸರಳ ಕನ್ನಡ ವಿವರಣೆ',
      todaySchedule: 'ಇಂದಿನ ಔಷಧಿ ವೇಳಾಪಟ್ಟಿ',
      todayProgress: 'ಇಂದಿನ ಔಷಧಿ ಸೇವನೆ ಪ್ರಗತಿ',
      safetyAlertsTitle: 'ಔಷಧಿ ಸುರಕ್ಷತೆ ಮತ್ತು ಅಪಾಯದ ಎಚ್ಚರಿಕೆಗಳು',
      safetySubtitle: 'ಔಷಧಿ ಪರಸ್ಪರ ಕ್ರಿಯೆಗಳು, ನಕಲಿ ಅಂಶಗಳು ಮತ್ತು ಅಲರ್ಜಿಗಳ ಸ್ವತಂತ್ರ ಪರಿಶೀಲನೆ',
      investigationsTitle: 'ಶಿಫಾರಸು ಮಾಡಲಾದ ವೈದ್ಯಕೀಯ ಪರೀಕ್ಷೆಗಳು',
      followUpTitle: 'ವೈದ್ಯರ ಮುಂದಿನ ಭೇಟಿ',
      medicineCardsTitle: 'ನಿಗದಿತ ಔಷಧಿಗಳ ವಿವರಗಳು',
      purpose: 'ಏಕೆ ನೀಡಲಾಗಿದೆ (ಉದ್ದೇಶ)',
      dosage: 'ನಿಗದಿತ ಪ್ರಮಾಣ',
      frequency: 'ಎಷ್ಟು ಬಾರಿ ತೆಗೆದುಕೊಳ್ಳಬೇಕು',
      duration: 'ಚಿಕಿತ್ಸೆಯ ಅವಧಿ',
      sideEffects: 'ಸಾಮಾನ್ಯ ಸಂಭಾವ್ಯ ಅಡ್ಡಪರಿಣಾಮಗಳು',
      precautions: 'ಪ್ರಮುಖ ಸುರಕ್ಷತಾ ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು',
      route: 'ಸೇವಿಸುವ ವಿಧಾನ',
      dailySlots: 'ದೈನಂದಿನ ಸಮಯಗಳು',
      symptoms: 'ಲಕ್ಷಣಗಳು',
      generalPrecautions: 'ಪ್ರಮುಖ ಸಾಮಾನ್ಯ ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು',
      dietaryAdvice: 'ಆಹಾರ ಮತ್ತು ಪೋಷಣೆ ಸಲಹೆ',
    },
    dashboard: {
      criticalConcernTitle: 'ಗಂಭೀರ ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆ ಪತ್ತೆಯಾಗಿದೆ',
      highRiskTitle: 'ಹೆಚ್ಚಿನ ಔಷಧಿ ಅಪಾಯ ಗುರುತಿಸಲಾಗಿದೆ',
      reviewAlertsBtn: 'ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆಗಳನ್ನು ನೋಡಿ',
      diagnosisLabel: 'ರೋಗನಿರ್ಣಯ',
      conditionsCount: 'ಸ್ಥಿತಿಗಳು',
      activeMedications: 'ಸಕ್ರಿಯ ಔಷಧಿಗಳು',
      prescribedCount: 'ನಿಗದಿತ',
      moreMedications: 'ಇನ್ನೂ ಔಷಧಿಗಳು',
      nextFollowUp: 'ಮುಂದಿನ ಭೇಟಿ',
      asAdvised: 'ಸೂಚಿಸಿದಂತೆ',
      testsAdvised: 'ಪರೀಕ್ಷೆಗಳನ್ನು ಸೂಚಿಸಲಾಗಿದೆ',
      trackTestsBtn: 'ಪರೀಕ್ಷೆ ಮತ್ತು ಭೇಟಿಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
      viewMedicineDetailsBtn: 'ಔಷಧಿ ವಿವರಗಳನ್ನು ನೋಡಿ',
      clinicalReviewFallback: 'ವೈದ್ಯಕೀಯ ಪರಿಶೀಲನೆ',
      consultantFallback: 'ತಜ್ಞ ವೈದ್ಯರು',
    },
    patient: {
      clinicalConfidence: 'ವೈದ್ಯಕೀಯ ವಿಶ್ವಾಸಾರ್ಹತೆ',
      verified: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
      documentedAllergies: 'ದಾಖಲಾದ ಅಲರ್ಜಿಗಳು',
      noAllergiesRecorded: 'ಚೀಟಿಯಲ್ಲಿ ಯಾವುದೇ ಅಲರ್ಜಿ ದಾಖಲಾಗಿಲ್ಲ. ನಿಮಗೆ ಯಾವುದೇ ಔಷಧಿ ಅಲರ್ಜಿ ಇದ್ದರೆ ದೃಢೀಕರಿಸಿ.',
      existingMedications: 'ಈಗಾಗಲೇ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿರುವ ಔಷಧಿಗಳು',
      noExistingMeds: 'ಚೀಟಿಯಲ್ಲಿ ಯಾವುದೂ ದಾಖಲಾಗಿಲ್ಲ.',
      reviewRequiredFor: 'ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿರುವವು',
      yearsOld: 'ವರ್ಷ',
      notSpecified: 'ನಮೂದಿಸಲಾಗಿಲ್ಲ',
      uhid: 'ರೋಗಿಯ ಸಂಖ್ಯೆ (UHID)',
      sampleCaseTag: 'ಮಾದರಿ ಪ್ರಕರಣ',
    },
    guide: {
      subtitle: 'ನಿಮ್ಮ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಆಧಾರಿತ ಸರಳ, ವೈಯಕ್ತಿಕ ಚಿಕಿತ್ಸಾ ಸೂಚನೆಗಳು.',
      dailyCareTitle: 'ದೈನಂದಿನ ಚಿಕಿತ್ಸಾ ಯೋಜನೆ',
      dailyCareSubtitle: 'ಚಿಕಿತ್ಸೆಯ ಅವಧಿಯಲ್ಲಿ ಈ ಸರಳ ಹಂತಗಳನ್ನು ಅನುಸರಿಸಿ.',
      morningRoutineTitle: '1. ಬೆಳಗಿನ ದಿನಚರಿ',
      morningRoutineDesc: 'ಖಾಲಿ ಹೊಟ್ಟೆಯ ಮಾತ್ರೆಗಳನ್ನು ತಿಂಡಿ ಅಥವಾ ಟೀಗೆ 30–45 ನಿಮಿಷ ಮುಂಚೆ ಸೇವಿಸಿ. ಸಕ್ಕರೆ ಕಾಯಿಲೆ ಮತ್ತು ಬಿಪಿ ಮಾತ್ರೆಗಳನ್ನು ಸೂಚಿಸಿದಂತೆ ಆಹಾರದೊಂದಿಗೆ ಸೇವಿಸಿ.',
      afternoonRoutineTitle: '2. ಮಧ್ಯಾಹ್ನ ಮತ್ತು ನೀರಿನ ಸೇವನೆ',
      afternoonRoutineDesc: 'ಮಧ್ಯಾಹ್ನದ ಔಷಧಿಗಳನ್ನು ಊಟದ ನಂತರ ಸೇವಿಸಿ. ಔಷಧಿಗಳು ಸುರಕ್ಷಿತವಾಗಿ ಕೆಲಸ ಮಾಡಲು ದಿನವಿಡೀ ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ.',
      nightRoutineTitle: '3. ರಾತ್ರಿ ಮತ್ತು ಮಲಗುವ ಮುನ್ನ',
      nightRoutineDesc: 'ಕೊಲೆಸ್ಟ್ರಾಲ್ ಮತ್ತು ಅಲರ್ಜಿ ಮಾತ್ರೆಗಳನ್ನು ಮಲಗುವ ಮುನ್ನ ನೀರಿನೊಂದಿಗೆ ಸೇವಿಸಿ. ರಾತ್ರಿಯ ಡೋಸ್ ತಪ್ಪದಂತೆ ಅಲಾರಾಂ ಇಟ್ಟುಕೊಳ್ಳಿ.',
      medicineCardsSubtitle: 'ಪ್ರತಿ ಔಷಧಿಯ ಉದ್ದೇಶ, ಅಡ್ಡಪರಿಣಾಮಗಳು ಮತ್ತು ಮುನ್ನೆಚ್ಚರಿಕೆಗಳ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ.',
    },
    medicine: {
      brandName: 'ಬ್ರ್ಯಾಂಡ್ ಹೆಸರು',
      manualVerificationNeeded: 'ಕೈಯಾರೆ ಪರಿಶೀಲನೆ ಅಗತ್ಯ',
      additionalInstructions: 'ಹೆಚ್ಚುವರಿ ಸೂಚನೆಗಳು',
      noMedicines: 'ಇನ್ನೂ ಯಾವುದೇ ಔಷಧಿಗಳು ಪತ್ತೆಯಾಗಿಲ್ಲ.',
    },
    planner: {
      subtitle: 'ದೈನಂದಿನ ಡೋಸ್‌ಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳಿ.',
      adherence: 'ಪಾಲನೆ',
      totalDoses: 'ಒಟ್ಟು ಡೋಸ್‌ಗಳು',
      medicineSingular: 'ಔಷಧಿ',
      medicinePlural: 'ಔಷಧಿಗಳು',
      takenAt: 'ತೆಗೆದುಕೊಂಡ ಸಮಯ',
      ambiguousTitle: 'ಸಮಯ ದೃಢೀಕರಣ ಅಗತ್ಯ',
      ambiguousDesc: 'ಕೆಲವು ಔಷಧಿಗಳ ಸಮಯ ಅಸ್ಪಷ್ಟವಾಗಿದೆ. ದಯವಿಟ್ಟು ವೈದ್ಯರು ಅಥವಾ ಔಷಧ ತಜ್ಞರೊಂದಿಗೆ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
    },
    safety: {
      ruleEngineBadge: 'ಫಾರ್ಮಕೋಪಿಯಾ ಸುರಕ್ಷತಾ ಎಂಜಿನ್',
      criticalRisks: 'ಗಂಭೀರ ಅಪಾಯಗಳು',
      highRisks: 'ಹೆಚ್ಚಿನ ಅಪಾಯಗಳು',
      moderateConcerns: 'ಮಧ್ಯಮ ಎಚ್ಚರಿಕೆಗಳು',
      incompleteChecks: 'ಅಪೂರ್ಣ ತಪಾಸಣೆಗಳು',
      protocolTitle: 'ಪ್ರಮುಖ ಸುರಕ್ಷತಾ ನಿಯಮ',
      protocolDesc: 'ಸ್ವಯಂಚಾಲಿತ ಎಚ್ಚರಿಕೆಯ ಆಧಾರದ ಮೇಲೆ ನಿಗದಿತ ಔಷಧಿಯನ್ನು ಎಂದಿಗೂ ನಿಲ್ಲಿಸಬೇಡಿ. ಯಾವುದೇ ಗಂಭೀರ ಎಚ್ಚರಿಕೆಯನ್ನು ನಿಮ್ಮ ವೈದ್ಯರಿಗೆ ತೋರಿಸಿ.',
      noConflictsTitle: 'ಯಾವುದೇ ಪ್ರಮುಖ ಅಪಾಯ ಕಂಡುಬಂದಿಲ್ಲ',
      noConflictsDesc: 'ಈ ಔಷಧಿಗಳಿಗೆ ನಕಲಿ ಅಂಶಗಳು ಅಥವಾ ತೀವ್ರ ಪರಸ್ಪರ ಕ್ರಿಯೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
      medicinesInvolved: 'ಸಂಬಂಧಿತ ಔಷಧಿಗಳು',
      recommendedNextStep: 'ಮುಂದಿನ ಶಿಫಾರಸು ಕ್ರಮ',
      evidenceReference: 'ಆಧಾರ ಮೂಲ',
    },
    investigations: {
      subtitle: 'ಅಗತ್ಯವಿರುವ ರಕ್ತ ಪರೀಕ್ಷೆಗಳು, ಸ್ಕ್ಯಾನ್‌ಗಳು ಮತ್ತು ವೈದ್ಯರ ಮುಂದಿನ ಭೇಟಿಗಳು.',
      testsDone: 'ಪರೀಕ್ಷೆಗಳು ಪೂರ್ಣ',
      consultant: 'ವೈದ್ಯರು',
      department: 'ವಿಭಾಗ',
      scheduled: 'ನಿಗದಿತ ದಿನಾಂಕ',
      dateNotSpecified: 'ದಿನಾಂಕ ನಮೂದಿಸಲಾಗಿಲ್ಲ',
      preVisitInstructions: 'ಭೇಟಿಗೆ ಮುನ್ನ ವೈದ್ಯರ ಸೂಚನೆಗಳು',
      diagnosticTestsTitle: 'ವೈದ್ಯಕೀಯ ಪ್ರಯೋಗಾಲಯ ಪರೀಕ್ಷೆಗಳು',
      noTestsListed: 'ಈ ಚೀಟಿಯಲ್ಲಿ ಯಾವುದೇ ಪರೀಕ್ಷೆಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡಲಾಗಿಲ್ಲ.',
      purposeLabel: 'ಉದ್ದೇಶ',
      preparationLabel: 'ಸಿದ್ಧತೆ',
      dueLabel: 'ಕೊನೆಯ ದಿನಾಂಕ',
    },
    review: {
      subtitle: 'OCR ಹೊರತೆಗೆದ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ. ತಪ್ಪಾಗಿ ಓದಿದ ಪದಗಳು, ಪ್ರಮಾಣ ಅಥವಾ ಔಷಧಿಗಳನ್ನು ತಿದ್ದಿ.',
      patientIdentityTitle: 'ರೋಗಿಯ ವಿವರಗಳು ಮತ್ತು ಆಸ್ಪತ್ರೆ ದಾಖಲೆ',
      fullName: 'ರೋಗಿಯ ಪೂರ್ಣ ಹೆಸರು',
      age: 'ವಯಸ್ಸು',
      gender: 'ಲಿಂಗ',
      rxDate: 'ಚೀಟಿ ದಿನಾಂಕ',
      doctorName: 'ವೈದ್ಯರ ಹೆಸರು',
      hospitalName: 'ಆಸ್ಪತ್ರೆ / ಕ್ಲಿನಿಕ್',
      allergiesLabel: 'ದಾಖಲಾದ ಔಷಧಿ ಅಲರ್ಜಿಗಳು (ಸುರಕ್ಷತಾ ತಪಾಸಣೆಗೆ ಮುಖ್ಯ)',
      allergyPlaceholder: 'ಉದಾ: ಪೆನ್ಸಿಲಿನ್, ಸಲ್ಫಾ, ಆಸ್ಪಿರಿನ್',
      medicinesListTitle: 'ನಿಗದಿತ ಔಷಧಿಗಳ ಪಟ್ಟಿ',
      genericName: 'ಔಷಧಿಯ ಮೂಲ ಹೆಸರು',
      brandNameLabel: 'ಬ್ರ್ಯಾಂಡ್ ಹೆಸರು',
      strengthLabel: 'ಶಕ್ತಿ (ಉದಾ: 500 mg)',
      dosageLabel: 'ಪ್ರಮಾಣ (ಉದಾ: 1 ಮಾತ್ರೆ)',
      frequencyLabel: 'ಆವರ್ತನ (ಉದಾ: 1-0-1, BD)',
      foodLabel: 'ಆಹಾರ ಸೂಚನೆ',
      durationLabel: 'ಅವಧಿ (ಉದಾ: 14 ದಿನಗಳು)',
      routeLabel: 'ಸೇವಿಸುವ ವಿಧಾನ',
      purposeLabel: 'ರೋಗಿಗೆ ಉದ್ದೇಶದ ವಿವರಣೆ',
      uncertainOcrBadge: 'ಅಸ್ಪಷ್ಟ OCR ಕ್ಷೇತ್ರ',
      saveAndRecalculate: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ ಮತ್ತು ಮಾರ್ಗದರ್ಶಿ ನವೀಕರಿಸಿ',
    },
    upload: {
      title: 'ವೈದ್ಯರ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಅಥವಾ ಡಿಸ್ಚಾರ್ಜ್ ಸಾರಾಂಶ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      subtitle: 'PDF (ಬಹು-ಪುಟ), JPG, JPEG ಮತ್ತು PNG ಬೆಂಬಲಿಸುತ್ತದೆ.',
      tryDemoBtn: 'ಮಾದರಿ ಪ್ರಕರಣಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ',
      dropzoneTitle: 'ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಇಲ್ಲಿ ಡ್ರಾಪ್ ಮಾಡಿ',
      dropzoneSubtitle: '25MB ವರೆಗಿನ PDF, ಕ್ಯಾಮೆರಾ ಫೋಟೋ ಅಥವಾ ಸ್ಕ್ಯಾನ್ ಚಿತ್ರಗಳು',
      selectedFile: 'ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ',
      replaceHint: 'ಬದಲಾಯಿಸಲು ಮತ್ತೊಂದು ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ',
      backgroundTitle: 'ರೋಗಿಯ ಹಿನ್ನೆಲೆ (ಐಚ್ಛಿಕ — ಸುರಕ್ಷತಾ ತಪಾಸಣೆಗೆ ನೆರವಾಗುತ್ತದೆ)',
      allergiesHint: 'ತಿಳಿದಿರುವ ಔಷಧಿ ಅಲರ್ಜಿಗಳು (ಉದಾ: ಪೆನ್ಸಿಲಿನ್, ಸಲ್ಫಾ)',
      existingMedsHint: 'ಈಗಾಗಲೇ ಸೇವಿಸುತ್ತಿರುವ ಔಷಧಿಗಳು',
      pasteTextToggle: 'ಅಥವಾ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಪಠ್ಯವನ್ನು ನೇರವಾಗಿ ಅಂಟಿಸಿ',
      pastePlaceholder: 'ಉದಾ: Rx: Metformin 500mg 1 tab BD after food...',
      privacyNote: 'ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು ಗೌಪ್ಯವಾಗಿರುತ್ತವೆ.',
      analyzingTitle: 'Cure ವೈದ್ಯಕೀಯ AI ಮೂಲಕ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
      ocrStep: 'ಚಿತ್ರ ಸಂಸ್ಕರಣೆ ಮತ್ತು OCR ನಡೆಯುತ್ತಿದೆ...',
      extractStep: 'ಔಷಧಿಗಳು ಮತ್ತು ಪ್ರಮಾಣಗಳನ್ನು ಹೊರತೆಗೆಯಲಾಗುತ್ತಿದೆ...',
      safetyStep: 'ಔಷಧಿ ಸುರಕ್ಷತೆ ಮತ್ತು ಅಲರ್ಜಿ ತಪಾಸಣೆ ನಡೆಯುತ್ತಿದೆ...',
    },
    demo: {
      badge: 'ತ್ವರಿತ ಮಾದರಿ ಮೋಡ್',
      title: 'ನೈಜ ಮಾದರಿ ವೈದ್ಯಕೀಯ ಪ್ರಕರಣ ಆಯ್ಕೆಮಾಡಿ',
      subtitle: 'OCR, 12 ಭಾಷೆಗಳ ಅನುವಾದ, ಸುರಕ್ಷತಾ ತಪಾಸಣೆ ಮತ್ತು PDF ರಫ್ತು ಪರೀಕ್ಷಿಸಲು ಮಾದರಿ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಲೋಡ್ ಮಾಡಿ.',
      diagnosisLabel: 'ರೋಗನಿರ್ಣಯ',
      syntheticNoticeTitle: 'ಕೃತಕ ಮಾದರಿ ಡೇಟಾ ಸೂಚನೆ',
      syntheticNoticeDesc: 'ಎಲ್ಲಾ ಮಾದರಿ ಪ್ರಕರಣಗಳು ಕೇವಲ ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ರಚಿಸಲಾದ ಕಾಲ್ಪನಿಕ ದಾಖಲೆಗಳಾಗಿವೆ; ನಿಜವಾದ ಚಿಕಿತ್ಸೆಗೆ ಅಲ್ಲ.',
    },
    translation: {
      translatingNotice: 'ಸಂಪೂರ್ಣ ವೈದ್ಯಕೀಯ ವರದಿಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಅನುವಾದಿಸಲಾಗುತ್ತಿದೆ...',
      failedWarning: 'ಸಂಪೂರ್ಣ ಅನುವಾದ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮೂಲ ಪರಿಶೀಲಿತ ಪಠ್ಯವನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ.',
      fallbackNotice: 'Cure ಆಫ್‌ಲೈನ್ ವೈದ್ಯಕೀಯ ಶಬ್ದಕೋಶದ ಮೂಲಕ ಕನ್ನಡಕ್ಕೆ ಅನುವಾದಿಸಲಾಗಿದೆ.',
    },
    pdf: {
      reportTitle: 'ರೋಗಿಯ ಚಿಕಿತ್ಸೆ ಮತ್ತು ಔಷಧಿ ಸುರಕ್ಷತಾ ವರದಿ',
      generatedOn: 'ತಯಾರಿಸಿದ ದಿನಾಂಕ',
      patientInfoSection: 'ರೋಗಿ ಮತ್ತು ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ವಿವರಗಳು',
      diagnosisSection: 'ರೋಗನಿರ್ಣಯ ಮತ್ತು ವಿವರಣೆ',
      medicinesSection: 'ನಿಗದಿತ ಔಷಧಿಗಳು',
      safetySection: 'ಔಷಧಿ ಸುರಕ್ಷತೆ ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು',
      timetableSection: 'ದೈನಂದಿನ ಔಷಧಿ ವೇಳಾಪಟ್ಟಿ',
      investigationsSection: 'ಶಿಫಾರಸು ಮಾಡಲಾದ ಪರೀಕ್ಷೆಗಳು',
      followUpSection: 'ಮುಂದಿನ ವೈದ್ಯರ ಭೇಟಿ ಮತ್ತು ಸೂಚನೆಗಳು',
      adviceSection: 'ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಆಹಾರ ಸಲಹೆ',
      disclaimerSection: 'ವೈದ್ಯಕೀಯ ಹಕ್ಕು ನಿರಾಕರಣೆ',
      unavailable: 'ಚೀಟಿಯಲ್ಲಿ ನಮೂದಿಸಲಾಗಿಲ್ಲ',
      errorGenerating: 'PDF ವರದಿ ತಯಾರಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    },
    severities: {
      critical: 'ಅತ್ಯಂತ ಗಂಭೀರ ಅಪಾಯ',
      high: 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
      moderate: 'ಮಧ್ಯಮ ಅಪಾಯ',
      low: 'ಕಡಿಮೆ ಅಪಾಯ',
      unverified: 'ಅಪೂರ್ಣ ತಪಾಸಣೆ / ಅಸತ್ಯಾಪಿತ',
    },
    status: {
      taken: 'ತೆಗೆದುಕೊಂಡಿದೆ',
      pending: 'ಬಾಕಿ ಇದೆ',
      missed: 'ತಪ್ಪಿಹೋಗಿದೆ',
      completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    },
    footer: {
      tagline: 'Cure — ಬಹುಭಾಷಾ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಮತ್ತು ಔಷಧಿ ಸುರಕ್ಷತಾ ಸಹಾಯಕ',
      capabilities: '12 ಭಾರತೀಯ ಭಾಷೆಗಳು • ಸ್ವತಂತ್ರ ಔಷಧಿ ಸುರಕ್ಷತಾ ಎಂಜಿನ್ • ಬಹು-ಪುಟ OCR ಮತ್ತು ಬಹುಭಾಷಾ PDF ವರದಿಗಳು',
    },
  }),

  hi: mergeDict({
    appTitle: 'Cure (क्योर)',
    appSubtitle: 'बहुभाषी पर्चा एवं दवा सुरक्षा सहायक',
    demoBadge: 'डेमो मोड',
    disclaimerTitle: 'चिकित्सीय सूचना एवं अस्वीकरण',
    disclaimerTag: 'जिम्मेदार हेल्थकेयर AI',
    disclaimerText:
      'यह एप्लिकेशन मरीजों को उनके मौजूदा पर्चे को समझने और व्यवस्थित करने में मदद करता है। यह डॉक्टर के परामर्श, निदान या चिकित्सीय सलाह का विकल्प नहीं है। किसी भी अस्पष्ट निर्देश या सुरक्षा चेतावनी की पुष्टि हमेशा योग्य डॉक्टर या फार्मासिस्ट से करें।',
    disclaimerBullets: [
      'स्वचालित जाँच पेशेवर चिकित्सीय समीक्षा का विकल्प नहीं है',
      'डॉक्टर की सलाह के बिना निर्धारित दवाएँ कभी बंद न करें',
      'अपलोड किए गए चिकित्सीय दस्तावेज़ निजी और सुरक्षित रहते हैं',
    ],
    tabs: {
      dashboard: 'डैशबोर्ड',
      treatmentGuide: 'उपचार मार्गदर्शिका',
      medications: 'दवाइयाँ',
      schedule: 'दैनिक समय-सारणी',
      safety: 'सुरक्षा जाँच',
      investigations: 'जाँच व फॉलो-अप',
      review: 'समीक्षा व संपादन',
      ocrDiagnostics: 'OCR परीक्षण',
    },
    actions: {
      uploadPrescription: 'पर्चा अपलोड करें',
      sampleCases: 'नमूना मामले',
      tryDemo: 'नमूना पर्चा लोड करें',
      changeLanguage: 'भाषा बदलें',
      markTaken: 'दवा ले ली',
      markMissed: 'छूट गई',
      undo: 'वापस लें',
      resetToday: 'आज का रीसेट करें',
      saveChanges: 'सहेजें व अपडेट करें',
      savedNotice: 'सहेजा व अपडेट किया गया!',
      viewDetails: 'विवरण देखें',
      downloadReport: 'उपचार रिपोर्ट डाउनलोड करें (PDF)',
      generatingPdf: 'PDF बन रहा है...',
      printGuide: 'प्रिंट करें',
      verifyWithDoctor: 'डॉक्टर / फार्मासिस्ट से पुष्टि करें',
      addMedicine: 'दवा जोड़ें',
      remove: 'हटाएँ',
      addAllergy: 'एलर्जी जोड़ें',
      retryTranslation: 'अनुवाद पुनः प्रयास करें',
      back: 'वापस',
      processPrescription: 'पर्चा विश्लेषित करें',
      loadCase: 'यह मामला लोड करें',
      editDetails: 'दवा विवरण संपादित करें',
      markAttended: 'मुलाकात पूर्ण चिह्नित करें',
      attended: 'मुलाकात पूर्ण',
    },
    timeSlots: {
      morning: 'सुबह (प्रातः)',
      afternoon: 'दोपहर (मध्याह्न)',
      evening: 'शाम (संध्या)',
      night: 'रात (सोते समय)',
    },
    foodInstructions: {
      beforeFood: 'भोजन से पहले',
      afterFood: 'भोजन के बाद',
      withFood: 'भोजन के साथ',
      emptyStomach: 'खाली पेट',
      atBedtime: 'सोते समय',
      asDirected: 'डॉक्टर के निर्देशानुसार',
    },
    sections: {
      diagnosisTitle: 'अपनी बीमारी को समझें',
      diagnosisSubtitle: 'आपकी स्थिति का सरल हिंदी में अर्थ',
      todaySchedule: 'आज की दवा समय-सारणी',
      todayProgress: 'आज की दवा प्रगति',
      safetyAlertsTitle: 'दवा सुरक्षा एवं जोखिम चेतावनियाँ',
      safetySubtitle: 'दवा परस्पर-क्रिया, डुप्लिकेट तत्व और एलर्जी की स्वतंत्र जाँच',
      investigationsTitle: 'अनुशंसित चिकित्सीय परीक्षण एवं जाँचें',
      followUpTitle: 'डॉक्टर फॉलो-अप मुलाकात',
      medicineCardsTitle: 'निर्धारित दवाओं का विवरण',
      purpose: 'यह दवा क्यों दी गई है (उद्देश्य)',
      dosage: 'निर्धारित खुराक',
      frequency: 'दिन में कितनी बार लें',
      duration: 'उपचार अवधि',
      sideEffects: 'सामान्य संभावित दुष्प्रभाव',
      precautions: 'महत्वपूर्ण सुरक्षा सावधानियाँ',
      route: 'लेने का तरीका',
      dailySlots: 'दैनिक समय',
      symptoms: 'संबंधित लक्षण',
      generalPrecautions: 'महत्वपूर्ण सामान्य सावधानियाँ',
      dietaryAdvice: 'आहार व पोषण सलाह',
    },
    dashboard: {
      criticalConcernTitle: 'गंभीर सुरक्षा चिंता पाई गई',
      highRiskTitle: 'उच्च दवा जोखिम पहचाना गया',
      reviewAlertsBtn: 'सुरक्षा चेतावनियाँ देखें',
      diagnosisLabel: 'निदान',
      conditionsCount: 'स्थितियाँ',
      activeMedications: 'सक्रिय दवाइयाँ',
      prescribedCount: 'निर्धारित',
      moreMedications: 'और दवाइयाँ',
      nextFollowUp: 'अगली मुलाकात',
      asAdvised: 'सलाह के अनुसार',
      testsAdvised: 'जाँचें अनुशंसित',
      trackTestsBtn: 'जाँच व अपॉइंटमेंट ट्रैक करें',
      viewMedicineDetailsBtn: 'दवा विवरण देखें',
      clinicalReviewFallback: 'चिकित्सीय समीक्षा',
      consultantFallback: 'परामर्शदाता चिकित्सक',
    },
    patient: {
      clinicalConfidence: 'चिकित्सीय विश्वसनीयता',
      verified: 'सत्यापित',
      documentedAllergies: 'दर्ज एलर्जी',
      noAllergiesRecorded: 'पर्चे पर कोई एलर्जी दर्ज नहीं है। यदि आपको किसी दवा से एलर्जी है तो डॉक्टर को बताएं।',
      existingMedications: 'पहले से चल रही दवाइयाँ',
      noExistingMeds: 'पर्चे में कोई अन्य दवा दर्ज नहीं है।',
      reviewRequiredFor: 'समीक्षा आवश्यक',
      yearsOld: 'वर्ष',
      notSpecified: 'उल्लिखित नहीं',
      uhid: 'रोगी आईडी (UHID)',
      sampleCaseTag: 'नमूना मामला',
    },
    guide: {
      subtitle: 'आपके पर्चे के अनुसार सरल एवं स्पष्ट व्यक्तिगत उपचार निर्देश।',
      dailyCareTitle: 'दैनिक उपचार योजना',
      dailyCareSubtitle: 'उपचार अवधि के दौरान इन सरल चरणों का पालन करें।',
      morningRoutineTitle: '1. सुबह की दिनचर्या',
      morningRoutineDesc: 'खाली पेट वाली दवाएँ चाय या नाश्ते से 30–45 मिनट पहले लें। शुगर और बीपी की दवाएँ निर्देशानुसार भोजन के साथ या बाद में लें।',
      afternoonRoutineTitle: '2. दोपहर एवं जलयोजन',
      afternoonRoutineDesc: 'दोपहर की दवाएँ भोजन के बाद लें। दिन भर पर्याप्त पानी पिएँ ताकि दवाएँ सुरक्षित रूप से कार्य करें।',
      nightRoutineTitle: '3. रात एवं सोते समय',
      nightRoutineDesc: 'कोलेस्ट्रॉल और एलर्जी की दवाएँ सोने से पहले पानी के साथ लें। रात की खुराक न छूटे इसके लिए रिमाइंडर सेट करें।',
      medicineCardsSubtitle: 'प्रत्येक दवा का उद्देश्य, दुष्प्रभाव और सावधानियों सहित पूरा विवरण।',
    },
    medicine: {
      brandName: 'ब्रांड नाम',
      manualVerificationNeeded: 'मैनुअल सत्यापन आवश्यक',
      additionalInstructions: 'अतिरिक्त निर्देश',
      noMedicines: 'अभी कोई दवा नहीं निकाली गई है।',
    },
    planner: {
      subtitle: 'दैनिक खुराक ट्रैक करें और समय पर दवा लेना सुनिश्चित करें।',
      adherence: 'नियमितता',
      totalDoses: 'कुल खुराक',
      medicineSingular: 'दवा',
      medicinePlural: 'दवाइयाँ',
      takenAt: 'ली गई समय',
      ambiguousTitle: 'समय पुष्टि आवश्यक',
      ambiguousDesc: 'कुछ दवाओं का समय अस्पष्ट है। अनुमान न लगाएँ — डॉक्टर या फार्मासिस्ट से पुष्टि करें।',
    },
    safety: {
      ruleEngineBadge: 'फार्माकोपिया सुरक्षा इंजन',
      criticalRisks: 'गंभीर जोखिम',
      highRisks: 'उच्च जोखिम',
      moderateConcerns: 'मध्यम चिंताएँ',
      incompleteChecks: 'अधूरी जाँचें',
      protocolTitle: 'महत्वपूर्ण सुरक्षा नियम',
      protocolDesc: 'केवल स्वचालित चेतावनी के आधार पर कोई भी दवा बंद न करें। किसी भी गंभीर चेतावनी को अपने डॉक्टर या फार्मासिस्ट को दिखाएँ।',
      noConflictsTitle: 'कोई स्पष्ट जोखिम नहीं मिला',
      noConflictsDesc: 'इन दवाओं के बीच संदर्भ डेटाबेस में कोई डुप्लिकेट तत्व या गंभीर परस्पर-क्रिया नहीं मिली।',
      medicinesInvolved: 'संबंधित दवाइयाँ',
      recommendedNextStep: 'अगला अनुशंसित कदम',
      evidenceReference: 'प्रमाण संदर्भ',
    },
    investigations: {
      subtitle: 'आवश्यक रक्त परीक्षण, स्कैन और आगामी डॉक्टर मुलाकातें।',
      testsDone: 'परीक्षण पूर्ण',
      consultant: 'चिकित्सक',
      department: 'विभाग',
      scheduled: 'निर्धारित तिथि',
      dateNotSpecified: 'पर्चे पर तिथि नहीं लिखी',
      preVisitInstructions: 'मुलाकात से पहले डॉक्टर के निर्देश',
      diagnosticTestsTitle: 'चिकित्सीय प्रयोगशाला जाँचें',
      noTestsListed: 'इस पर्चे में कोई विशिष्ट जाँच सूचीबद्ध नहीं है।',
      purposeLabel: 'उद्देश्य',
      preparationLabel: 'तैयारी',
      dueLabel: 'देय तिथि',
    },
    review: {
      subtitle: 'OCR द्वारा निकाली गई जानकारी की समीक्षा करें और किसी भी त्रुटि को सुधारें।',
      patientIdentityTitle: 'रोगी की पहचान एवं अस्पताल रिकॉर्ड',
      fullName: 'रोगी का पूरा नाम',
      age: 'आयु',
      gender: 'लिंग',
      rxDate: 'पर्चे की तिथि',
      doctorName: 'डॉक्टर का नाम',
      hospitalName: 'अस्पताल / क्लिनिक',
      allergiesLabel: 'दर्ज दवा एलर्जी (सुरक्षा जाँच के लिए महत्वपूर्ण)',
      allergyPlaceholder: 'जैसे: पेनिसिलिन, सल्फा, एस्पिरिन',
      medicinesListTitle: 'निर्धारित दवाओं की सूची',
      genericName: 'दवा का मूल नाम',
      brandNameLabel: 'ब्रांड नाम',
      strengthLabel: 'शक्ति (जैसे 500 mg)',
      dosageLabel: 'खुराक (जैसे 1 गोली)',
      frequencyLabel: 'आवृत्ति (जैसे 1-0-1, BD)',
      foodLabel: 'भोजन निर्देश',
      durationLabel: 'अवधि (जैसे 14 दिन)',
      routeLabel: 'लेने का तरीका',
      purposeLabel: 'रोगी के लिए उद्देश्य विवरण',
      uncertainOcrBadge: 'अस्पष्ट OCR फ़ील्ड',
      saveAndRecalculate: 'परिवर्तन सहेजें व गाइड अपडेट करें',
    },
    upload: {
      title: 'डॉक्टर का पर्चा या डिस्चार्ज समरी अपलोड करें',
      subtitle: 'PDF (बहु-पृष्ठ), JPG, JPEG और PNG समर्थित हैं।',
      tryDemoBtn: 'नमूना मामले आज़माएँ',
      dropzoneTitle: 'पर्चा फ़ाइल चुनने के लिए क्लिक करें या यहाँ छोड़ें',
      dropzoneSubtitle: '25MB तक के PDF, कैमरा फ़ोटो या स्कैन चित्र',
      selectedFile: 'चयनित',
      replaceHint: 'बदलने के लिए दूसरी फ़ाइल चुनें',
      backgroundTitle: 'रोगी की पृष्ठभूमि (वैकल्पिक — सुरक्षा जाँच को बेहतर बनाता है)',
      allergiesHint: 'ज्ञात दवा एलर्जी (जैसे पेनिसिलिन, सल्फा)',
      existingMedsHint: 'वर्तमान नियमित दवाइयाँ',
      pasteTextToggle: 'या पर्चे का टेक्स्ट सीधे पेस्ट करें',
      pastePlaceholder: 'जैसे: Rx: Metformin 500mg 1 tab BD after food...',
      privacyNote: 'आपके दस्तावेज़ निजी और सुरक्षित रहते हैं।',
      analyzingTitle: 'Cure मेडिकल AI द्वारा पर्चे का विश्लेषण किया जा रहा है...',
      ocrStep: 'इमेज प्रीप्रोसेसिंग और OCR चल रहा है...',
      extractStep: 'दवाइयों और खुराक का विवरण निकाला जा रहा है...',
      safetyStep: 'दवा सुरक्षा और एलर्जी जाँच चल रही है...',
    },
    demo: {
      badge: 'तुरंत डेमो मोड',
      title: 'एक वास्तविक नमूना मामला चुनें',
      subtitle: 'OCR, 12-भाषा अनुवाद, सुरक्षा जाँच और PDF निर्यात का अनुभव करने के लिए नमूना पर्चा लोड करें।',
      diagnosisLabel: 'निदान',
      syntheticNoticeTitle: 'काल्पनिक नमूना डेटा सूचना',
      syntheticNoticeDesc: 'सभी डेमो मामले केवल प्रदर्शन हेतु बनाए गए काल्पनिक रिकॉर्ड हैं, वास्तविक उपचार के लिए नहीं।',
    },
    translation: {
      translatingNotice: 'पूरी चिकित्सीय रिपोर्ट का हिंदी में अनुवाद किया जा रहा है...',
      failedWarning: 'पूर्ण अनुवाद नहीं हो सका। मूल सत्यापित चिकित्सीय जानकारी दिखाई जा रही है।',
      fallbackNotice: 'Cure ऑफ़लाइन चिकित्सीय शब्दकोश से हिंदी में अनुवादित।',
    },
    pdf: {
      reportTitle: 'रोगी उपचार एवं दवा सुरक्षा रिपोर्ट',
      generatedOn: 'निर्माण तिथि',
      patientInfoSection: 'रोगी एवं पर्चे का विवरण',
      diagnosisSection: 'निदान एवं स्थिति का विवरण',
      medicinesSection: 'निर्धारित दवाइयाँ',
      safetySection: 'दवा सुरक्षा एवं जोखिम चेतावनियाँ',
      timetableSection: 'दैनिक दवा समय-सारणी',
      investigationsSection: 'अनुशंसित जाँचें एवं परीक्षण',
      followUpSection: 'फॉलो-अप मुलाकात एवं डॉक्टर के निर्देश',
      adviceSection: 'सावधानियाँ एवं आहार सलाह',
      disclaimerSection: 'चिकित्सीय अस्वीकरण',
      unavailable: 'पर्चे में उल्लिखित नहीं',
      errorGenerating: 'PDF रिपोर्ट बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।',
    },
    severities: {
      critical: 'गंभीर जोखिम',
      high: 'उच्च जोखिम',
      moderate: 'मध्यम जोखिम',
      low: 'कम जोखिम',
      unverified: 'अधूरी जाँच / असत्यापित',
    },
    status: {
      taken: 'ले ली',
      pending: 'आगामी',
      missed: 'छूट गई',
      completed: 'पूर्ण',
    },
    footer: {
      tagline: 'Cure — बहुभाषी पर्चा एवं दवा सुरक्षा सहायक',
      capabilities: '12 भारतीय भाषाएँ • स्वतंत्र फार्माकोपिया सुरक्षा इंजन • मल्टी-पेज OCR एवं बहुभाषी PDF रिपोर्ट',
    },
  }),

  ta: mergeDict({
    appTitle: 'Cure (க்யூர்)',
    appSubtitle: 'பன்மொழி மருந்துச் சீட்டு மற்றும் மருந்து பாதுகாப்பு உதவியாளர்',
    demoBadge: 'மாதிரி நிலை',
    disclaimerTitle: 'மருத்துவ அறிவிப்பு மற்றும் பொறுப்புத் துறப்பு',
    disclaimerTag: 'பொறுப்பான சுகாதார AI',
    disclaimerText:
      'இந்த செயலி நோயாளிகள் தங்கள் மருந்துச் சீட்டை எளிதாகப் புரிந்துகொண்டு ஒழுங்கமைக்க உதவுகிறது. இது மருத்துவரின் ஆலோசனை, நோயறிதல் அல்லது சிகிச்சைக்கு மாற்றல்ல. தெளிவற்ற மருந்து வழிமுறைகள் மற்றும் பாதுகாப்பு எச்சரிக்கைகளை எப்போதும் தகுதியான மருத்துவர் அல்லது மருந்தாளரிடம் உறுதிப்படுத்தவும்.',
    tabs: {
      dashboard: 'முகப்பு',
      treatmentGuide: 'சிகிச்சை வழிகாட்டி',
      medications: 'மருந்துகள்',
      schedule: 'தினசரி அட்டவணை',
      safety: 'பாதுகாப்பு சோதனை',
      investigations: 'பரிசோதனைகள்',
      review: 'மதிப்பாய்வு',
      ocrDiagnostics: 'OCR சோதனை',
    },
    actions: {
      uploadPrescription: 'சீட்டு பதிவேற்று',
      sampleCases: 'மாதிரி வழக்குகள்',
      tryDemo: 'மாதிரி சீட்டு ஏற்று',
      changeLanguage: 'மொழி மாற்று',
      markTaken: 'உட்கொண்டேன்',
      markMissed: 'தவறியது',
      undo: 'ரத்துசெய்',
      resetToday: 'இன்றையதை மீட்டமை',
      saveChanges: 'சேமித்து புதுப்பி',
      savedNotice: 'சேமிக்கப்பட்டது!',
      downloadReport: 'சிகிச்சை அறிக்கை பதிவிறக்கம் (PDF)',
      generatingPdf: 'PDF உருவாகிறது...',
      printGuide: 'அச்சிடு',
      verifyWithDoctor: 'மருத்துவரிடம் உறுதிப்படுத்து',
      addMedicine: 'மருந்து சேர்',
      remove: 'நீக்கு',
      addAllergy: 'ஒவ்வாமை சேர்',
      retryTranslation: 'மீண்டும் மொழிபெயர்',
      back: 'பின்செல்',
      processPrescription: 'சீட்டை பகுப்பாய்வு செய்',
      loadCase: 'இந்த வழக்கை ஏற்று',
      editDetails: 'மருந்து விவரங்களைத் திருத்து',
      markAttended: 'சந்திப்பு முடிந்தது',
      attended: 'சந்திப்பு நிறைவடைந்தது',
    },
    timeSlots: {
      morning: 'காலை',
      afternoon: 'மதியம்',
      evening: 'மாலை',
      night: 'இரவு (தூங்கும் முன்)',
    },
    foodInstructions: {
      beforeFood: 'உணவுக்கு முன்',
      afterFood: 'உணவுக்கு பின்',
      withFood: 'உணவுடன்',
      emptyStomach: 'வெறும் வயிற்றில்',
      atBedtime: 'தூங்கும் முன்',
      asDirected: 'மருத்துவர் அறிவுறுத்தியபடி',
    },
    sections: {
      diagnosisTitle: 'உங்கள் நோயறிதலைப் புரிந்து கொள்ளுங்கள்',
      diagnosisSubtitle: 'உங்கள் உடல்நிலை பற்றிய எளிய தமிழ் விளக்கம்',
      todaySchedule: 'இன்றைய மருந்து அட்டவணை',
      todayProgress: 'இன்றைய மருந்து முன்னேற்றம்',
      safetyAlertsTitle: 'மருந்து பாதுகாப்பு மற்றும் ஆபத்து எச்சரிக்கைகள்',
      safetySubtitle: 'மருந்து இடைவினைகள், இரட்டை மருந்துகள் மற்றும் ஒவ்வாமை சோதனை',
      investigationsTitle: 'பரிந்துரைக்கப்பட்ட மருத்துவ பரிசோதனைகள்',
      followUpTitle: 'மருத்துவரை மீண்டும் சந்திக்கும் நாள்',
      medicineCardsTitle: 'பரிந்துரைக்கப்பட்ட மருந்துகளின் விவரங்கள்',
      purpose: 'மருந்தின் நோக்கம்',
      dosage: 'மருந்தளவு',
      frequency: 'எத்தனை முறை',
      duration: 'சிகிச்சை காலம்',
      sideEffects: 'பொதுவான பக்க விளைவுகள்',
      precautions: 'முக்கிய பாதுகாப்பு முன்னெச்சரிக்கைகள்',
      route: 'எடுக்கும் வழி',
      dailySlots: 'தினசரி நேரங்கள்',
      symptoms: 'அறிகுறிகள்',
      generalPrecautions: 'பொது முன்னெச்சரிக்கைகள்',
      dietaryAdvice: 'உணவு மற்றும் ஊட்டச்சத்து அறிவுரை',
    },
    dashboard: {
      criticalConcernTitle: 'தீவிர பாதுகாப்பு எச்சரிக்கை கண்டறியப்பட்டது',
      highRiskTitle: 'அதிக மருந்து ஆபத்து கண்டறியப்பட்டது',
      reviewAlertsBtn: 'பாதுகாப்பு எச்சரிக்கைகளைப் பார்',
      diagnosisLabel: 'நோயறிதல்',
      conditionsCount: 'நிலைகள்',
      activeMedications: 'செயலில் உள்ள மருந்துகள்',
      prescribedCount: 'பரிந்துரைக்கப்பட்டவை',
      moreMedications: 'மேலும் மருந்துகள்',
      nextFollowUp: 'அடுத்த சந்திப்பு',
      asAdvised: 'அறிவுறுத்தப்பட்டபடி',
      testsAdvised: 'பரிசோதனைகள் பரிந்துரை',
      trackTestsBtn: 'பரிசோதனைகளைக் கண்காணி',
      viewMedicineDetailsBtn: 'மருந்து விவரங்களைப் பார்',
    },
    patient: {
      clinicalConfidence: 'மருத்துவ நம்பகத்தன்மை',
      verified: 'சரிபார்க்கப்பட்டது',
      documentedAllergies: 'பதிவான ஒவ்வாமைகள்',
      noAllergiesRecorded: 'சீட்டில் ஒவ்வாமை பதிவாகவில்லை. மருந்து ஒவ்வாமை இருந்தால் உறுதிப்படுத்தவும்.',
      existingMedications: 'ஏற்கனவே எடுக்கும் மருந்துகள்',
      noExistingMeds: 'சீட்டில் எதுவும் பதிவாகவில்லை.',
      reviewRequiredFor: 'சரிபார்ப்பு தேவை',
      yearsOld: 'வயது',
      notSpecified: 'குறிப்பிடப்படவில்லை',
      sampleCaseTag: 'மாதிரி வழக்கு',
    },
    guide: {
      subtitle: 'உங்கள் மருந்துச் சீட்டிற்கு ஏற்ப எளிய சிகிச்சை வழிமுறைகள்.',
      dailyCareTitle: 'தினசரி சிகிச்சை திட்டம்',
      dailyCareSubtitle: 'சிகிச்சை காலத்தில் இந்த எளிய படிகளைப் பின்பற்றவும்.',
      morningRoutineTitle: '1. காலை வழக்கம்',
      morningRoutineDesc: 'வெறும் வயிற்று மருந்துகளை காலை உணவிற்கு 30–45 நிமிடங்களுக்கு முன் எடுக்கவும். சர்க்கரை மற்றும் ரத்த அழுத்த மருந்துகளை அறிவுறுத்தியபடி எடுக்கவும்.',
      afternoonRoutineTitle: '2. மதியம் மற்றும் நீர்ச்சத்து',
      afternoonRoutineDesc: 'மதிய மாத்திரைகளை உணவிற்குப் பின் எடுக்கவும். நாள் முழுவதும் போதுமான தண்ணீர் குடிக்கவும்.',
      nightRoutineTitle: '3. இரவு பராமரிப்பு',
      nightRoutineDesc: 'கொழுப்பு மற்றும் ஒவ்வாமை மருந்துகளை தூங்கும் முன் தண்ணீருடன் எடுக்கவும்.',
    },
    planner: {
      subtitle: 'தினசரி மருந்து அளவுகளைக் கண்காணித்து நேரத்திற்கு எடுக்கவும்.',
      adherence: 'கடைப்பிடிப்பு',
      totalDoses: 'மொத்த அளவுகள்',
      medicineSingular: 'மருந்து',
      medicinePlural: 'மருந்துகள்',
      takenAt: 'எடுத்த நேரம்',
    },
    safety: {
      criticalRisks: 'தீவிர ஆபத்துகள்',
      highRisks: 'அதிக ஆபத்துகள்',
      moderateConcerns: 'மிதமான எச்சரிக்கைகள்',
      incompleteChecks: 'முழுமையற்ற சோதனைகள்',
      protocolTitle: 'முக்கிய பாதுகாப்பு விதி',
      protocolDesc: 'தானியங்கி எச்சரிக்கையால் மட்டும் பரிந்துரைக்கப்பட்ட மருந்தை நிறுத்த வேண்டாம். மருத்துவரிடம் ஆலோசிக்கவும்.',
      medicinesInvolved: 'சம்பந்தப்பட்ட மருந்துகள்',
      recommendedNextStep: 'பரிந்துரைக்கப்பட்ட அடுத்த நடவடிக்கை',
      evidenceReference: 'ஆதார குறிப்பு',
    },
    investigations: {
      testsDone: 'பரிசோதனைகள் முடிந்தன',
      consultant: 'மருத்துவர்',
      department: 'துறை',
      scheduled: 'திட்டமிடப்பட்ட தேதி',
      dateNotSpecified: 'தேதி குறிப்பிடப்படவில்லை',
      preVisitInstructions: 'மருத்துவரின் அறிவுரைகள்',
      diagnosticTestsTitle: 'மருத்துவ ஆய்வகப் பரிசோதனைகள்',
      purposeLabel: 'நோக்கம்',
      preparationLabel: 'தயாரிப்பு',
      dueLabel: 'கடைசி தேதி',
    },
    pdf: {
      reportTitle: 'நோயாளி சிகிச்சை மற்றும் மருந்து பாதுகாப்பு அறிக்கை',
      generatedOn: 'உருவாக்கப்பட்ட தேதி',
      patientInfoSection: 'நோயாளி மற்றும் சீட்டு விவரங்கள்',
      diagnosisSection: 'நோயறிதல் மற்றும் விளக்கம்',
      medicinesSection: 'பரிந்துரைக்கப்பட்ட மருந்துகள்',
      safetySection: 'மருந்து பாதுகாப்பு எச்சரிக்கைகள்',
      timetableSection: 'தினசரி மருந்து அட்டவணை',
      investigationsSection: 'பரிந்துரைக்கப்பட்ட பரிசோதனைகள்',
      followUpSection: 'அடுத்த மருத்துவ சந்திப்பு',
      adviceSection: 'முன்னெச்சரிக்கைகள் மற்றும் உணவு அறிவுரை',
      disclaimerSection: 'மருத்துவ பொறுப்புத் துறப்பு',
      unavailable: 'குறிப்பிடப்படவில்லை',
      errorGenerating: 'PDF அறிக்கை உருவாக்க முடியவில்லை.',
    },
    severities: {
      critical: 'மிகவும் ஆபத்தானது',
      high: 'அதிக ஆபத்து',
      moderate: 'மிதமான ஆபத்து',
      low: 'குறைந்த ஆபத்து',
      unverified: 'சரிபார்க்கப்படாதது',
    },
    status: {
      taken: 'எடுக்கப்பட்டது',
      pending: 'வரவிருப்பது',
      missed: 'தவறியது',
      completed: 'முடிந்தது',
    },
    footer: {
      tagline: 'Cure — பன்மொழி மருந்துச் சீட்டு மற்றும் மருந்து பாதுகாப்பு உதவியாளர்',
      capabilities: '12 இந்திய மொழிகள் • மருந்து பாதுகாப்பு எஞ்சின் • OCR மற்றும் பன்மொழி PDF அறிக்கைகள்',
    },
  }),

  te: mergeDict({
    appTitle: 'Cure (క్యూర్)',
    appSubtitle: 'బహుభాషా ప్రిస్క్రిప్షన్ & మందుల భద్రతా సహాయకం',
    demoBadge: 'డెమో మోడ్',
    disclaimerTitle: 'వైద్య గమనిక & నిరాకరణ',
    disclaimerTag: 'బాధ్యతాయుత హెల్త్‌కేర్ AI',
    disclaimerText:
      'ఈ అప్లికేషన్ రోగులు తమ ప్రిస్క్రిప్షన్‌ను సులభంగా అర్థం చేసుకోవడానికి సహాయపడుతుంది. ఇది డాక్టర్ సలహా, రోగనిర్ధారణ లేదా చికిత్సకు ప్రత్యామ్నాయం కాదు. స్పష్టత లేని సూచనలను ఎల్లప్పుడూ డాక్టర్ లేదా ఫార్మసిస్ట్‌తో నిర్ధారించుకోండి.',
    tabs: {
      dashboard: 'డ్యాష్‌బోర్డ్',
      treatmentGuide: 'చికిత్స మార్గదర్శి',
      medications: 'మందులు',
      schedule: 'రోజువారీ షెడ్యూల్',
      safety: 'భద్రతా తనిఖీ',
      investigations: 'పరీక్షలు & ఫాలో-అప్',
      review: 'సమీక్ష & మార్పు',
      ocrDiagnostics: 'OCR పరీక్ష',
    },
    actions: {
      uploadPrescription: 'ప్రిస్క్రిప్షన్ అప్‌లోడ్',
      sampleCases: 'నమూనా కేసులు',
      tryDemo: 'నమూనా ప్రిస్క్రిప్షన్ లోడ్',
      changeLanguage: 'భాష మార్చండి',
      markTaken: 'వేసుకున్నాను',
      markMissed: 'మిస్ అయింది',
      undo: 'రద్దు',
      resetToday: 'నేటిది రీసెట్',
      saveChanges: 'సేవ్ & అప్‌డేట్ చేయండి',
      savedNotice: 'సేవ్ చేయబడింది!',
      downloadReport: 'చికిత్స నివేదిక డౌన్‌లోడ్ (PDF)',
      generatingPdf: 'PDF తయారవుతోంది...',
      printGuide: 'ప్రింట్',
      verifyWithDoctor: 'డాక్టర్‌తో నిర్ధారించండి',
      addMedicine: 'మందు జోడించు',
      remove: 'తొలగించు',
      addAllergy: 'అలర్జీ జోడించు',
      retryTranslation: 'మళ్లీ అనువదించు',
      back: 'వెనుకకు',
      processPrescription: 'ప్రిస్క్రిప్షన్ విశ్లేషించు',
      loadCase: 'ఈ కేసు లోడ్ చేయి',
      editDetails: 'మందుల వివరాలు మార్చు',
      markAttended: 'సందర్శన పూర్తయింది',
      attended: 'సందర్శన జరిగింది',
    },
    timeSlots: {
      morning: 'ఉదయం',
      afternoon: 'మధ్యాహ్నం',
      evening: 'సాయంత్రం',
      night: 'రాత్రి (పడుకునే ముందు)',
    },
    foodInstructions: {
      beforeFood: 'భోజనానికి ముందు',
      afterFood: 'భోజనం తర్వాత',
      withFood: 'భోజనంతో పాటు',
      emptyStomach: 'ఖాళీ కడుపుతో',
      atBedtime: 'పడుకునే ముందు',
      asDirected: 'డాక్టర్ సూచించిన విధంగా',
    },
    sections: {
      diagnosisTitle: 'మీ రోగనిర్ధారణను అర్థం చేసుకోండి',
      diagnosisSubtitle: 'మీ ఆరోగ్య పరిస్థితి సులభమైన తెలుగు వివరణ',
      todaySchedule: 'నేటి మందుల షెడ్యూల్',
      todayProgress: 'నేటి మందుల పురోగతి',
      safetyAlertsTitle: 'మందుల భద్రతా హెచ్చరికలు',
      safetySubtitle: 'మందుల మధ్య ప్రతిచర్యలు, నకిలీ పదార్థాలు మరియు అలర్జీ తనిఖీ',
      investigationsTitle: 'సిఫార్సు చేయబడిన వైద్య పరీక్షలు',
      followUpTitle: 'డాక్టర్ తదుపరి సందర్శన',
      medicineCardsTitle: 'నిర్దేశించిన మందుల వివరాలు',
      purpose: 'మందు ప్రయోజనం',
      dosage: 'మోతాదు',
      frequency: 'రోజుకు ఎన్నిసార్లు',
      duration: 'చికిత్స కాలం',
      sideEffects: 'సాధారణ దుష్ప్రభావాలు',
      precautions: 'ముఖ్యమైన జాగ్రత్తలు',
      route: 'తీసుకునే విధానం',
      dailySlots: 'రోజువారీ సమయాలు',
      symptoms: 'లక్షణాలు',
      generalPrecautions: 'సాధారణ జాగ్రత్తలు',
      dietaryAdvice: 'ఆహార సలహాలు',
    },
    dashboard: {
      criticalConcernTitle: 'తీవ్రమైన భద్రతా హెచ్చరిక గుర్తించబడింది',
      highRiskTitle: 'అధిక మందుల ప్రమాదం గుర్తించబడింది',
      reviewAlertsBtn: 'భద్రతా హెచ్చరికలు చూడండి',
      diagnosisLabel: 'రోగనిర్ధారణ',
      conditionsCount: 'సమస్యలు',
      activeMedications: 'ప్రస్తుత మందులు',
      prescribedCount: 'సూచించినవి',
      moreMedications: 'మరిన్ని మందులు',
      nextFollowUp: 'తదుపరి సందర్శన',
      asAdvised: 'సూచించినట్లు',
      testsAdvised: 'పరీక్షలు సూచించబడ్డాయి',
      trackTestsBtn: 'పరీక్షలు & అపాయింట్‌మెంట్లు చూడండి',
      viewMedicineDetailsBtn: 'మందుల వివరాలు చూడండి',
    },
    patient: {
      clinicalConfidence: 'వైద్య విశ్వసనీయత',
      verified: 'ధృవీకరించబడింది',
      documentedAllergies: 'నమోదైన అలర్జీలు',
      noAllergiesRecorded: 'ప్రిస్క్రిప్షన్‌లో అలర్జీ నమోదు కాలేదు.',
      existingMedications: 'ముందుగా వాడుతున్న మందులు',
      noExistingMeds: 'ఏవీ నమోదు కాలేదు.',
      reviewRequiredFor: 'సమీక్ష అవసరం',
      yearsOld: 'సం.',
      notSpecified: 'పేర్కొనబడలేదు',
      sampleCaseTag: 'నమూనా కేసు',
    },
    pdf: {
      reportTitle: 'రోగి చికిత్స & మందుల భద్రతా నివేదిక',
      generatedOn: 'రూపొందించిన తేదీ',
      patientInfoSection: 'రోగి & ప్రిస్క్రిప్షన్ వివరాలు',
      diagnosisSection: 'రోగనిర్ధారణ & వివరణ',
      medicinesSection: 'సూచించిన మందులు',
      safetySection: 'మందుల భద్రతా హెచ్చరికలు',
      timetableSection: 'రోజువారీ మందుల పట్టిక',
      investigationsSection: 'సూచించిన వైద్య పరీక్షలు',
      followUpSection: 'తదుపరి డాక్టర్ సందర్శన',
      adviceSection: 'జాగ్రత్తలు & ఆహార సలహా',
      disclaimerSection: 'వైద్య నిరాకరణ',
      unavailable: 'పేర్కొనబడలేదు',
      errorGenerating: 'PDF నివేదిక తయారీ విఫలమైంది.',
    },
    severities: {
      critical: 'తీవ్రమైన ప్రమాదం',
      high: 'అధిక ప్రమాదం',
      moderate: 'మధ్యస్థ ప్రమాదం',
      low: 'తక్కువ ప్రమాదం',
      unverified: 'తనిఖీ అసంపూర్ణం',
    },
    status: {
      taken: 'వేసుకున్నారు',
      pending: 'రాబోయే సమయం',
      missed: 'మిస్ అయింది',
      completed: 'పూర్తయింది',
    },
    footer: {
      tagline: 'Cure — బహుభాషా ప్రిస్క్రిప్షన్ & మందుల భద్రతా సహాయకం',
      capabilities: '12 భారతీయ భాషలు • భద్రతా ఇంజిన్ • OCR & బహుభాషా PDF నివేదికలు',
    },
  }),

  ml: mergeDict({
    appTitle: 'Cure (ക്യൂർ)',
    appSubtitle: 'ബഹുഭാഷാ കുറിപ്പടി & മരുന്ന് സുരക്ഷാ സഹായി',
    demoBadge: 'ഡെമോ മോഡ്',
    disclaimerTitle: 'വൈദ്യശാസ്ത്ര അറിയിപ്പ് & നിരാകരണം',
    disclaimerText:
      'ഈ ആപ്ലിക്കേഷൻ രോഗികൾക്ക് അവരുടെ കുറിപ്പടി എളുപ്പത്തിൽ മനസ്സിലാക്കാൻ സഹായിക്കുന്നു. ഇത് ഒരു ഡോക്ടറുടെ നേരിട്ടുള്ള ഉപദേശത്തിനോ ചികിത്സയ്ക്കോ പകരമല്ല. സംശയമുള്ള നിർദ്ദേശങ്ങൾ എപ്പോഴും ഡോക്ടറുമായി ഉറപ്പുവരുത്തുക.',
    tabs: {
      dashboard: 'ഡാഷ്‌ബോർഡ്',
      treatmentGuide: 'ചികിത്സാ സഹായി',
      medications: 'മരുന്നുകൾ',
      schedule: 'ദിനചര്യ ഷെഡ്യൂൾ',
      safety: 'സുരക്ഷാ പരിശോധന',
      investigations: 'പരിശോധനകൾ',
      review: 'തിരുത്തുക',
      ocrDiagnostics: 'OCR പരിശോധന',
    },
    actions: {
      uploadPrescription: 'കുറിപ്പടി അപ്‌ലോഡ്',
      sampleCases: 'മാതൃകാ കേസുകൾ',
      tryDemo: 'മാതൃക ലോഡ് ചെയ്യുക',
      changeLanguage: 'ഭാഷ മാറ്റുക',
      markTaken: 'കഴിച്ചു',
      markMissed: 'മുടങ്ങി',
      undo: 'തിരിച്ചെടുക്കുക',
      resetToday: 'റീസെറ്റ്',
      saveChanges: 'സേവ് ചെയ്യുക',
      downloadReport: 'ചികിത്സാ റിപ്പോർട്ട് ഡൗൺലോഡ് (PDF)',
      generatingPdf: 'PDF തയ്യാറാകുന്നു...',
      printGuide: 'പ്രിന്റ്',
      verifyWithDoctor: 'ഡോക്ടറോട് ഉറപ്പുവരുത്തുക',
      loadCase: 'ഈ കേസ് ലോഡ് ചെയ്യുക',
    },
    timeSlots: {
      morning: 'രാവിലെ',
      afternoon: 'ഉച്ചയ്ക്ക്',
      evening: 'വൈകുന്നേരം',
      night: 'രാത്രി (കിടക്കുന്നതിന് മുൻപ്)',
    },
    foodInstructions: {
      beforeFood: 'ഭക്ഷണത്തിന് മുൻപ്',
      afterFood: 'ഭക്ഷണത്തിന് ശേഷം',
      withFood: 'ഭക്ഷണത്തോടൊപ്പം',
      emptyStomach: 'വെറും വയറ്റിൽ',
      atBedtime: 'കിടക്കുന്നതിന് മുൻപ്',
      asDirected: 'ഡോക്ടറുടെ നിർദ്ദേശപ്രകാരം',
    },
    sections: {
      diagnosisTitle: 'രോഗാവസ്ഥ മനസ്സിലാക്കാം',
      diagnosisSubtitle: 'ലളിതമായ മലയാളം വിശദീകരണം',
      todaySchedule: 'ഇന്നത്തെ മരുന്ന് സമയം',
      todayProgress: 'ഇന്നത്തെ പുരോഗതി',
      safetyAlertsTitle: 'മരുന്ന് സുരക്ഷാ മുന്നറിയിപ്പുകൾ',
      investigationsTitle: 'വൈദ്യപരിശോധനകൾ',
      followUpTitle: 'അടുത്ത പരിശോധനാ തീയതി',
      medicineCardsTitle: 'മരുന്നുകളുടെ വിശദാംശങ്ങൾ',
      purpose: 'മരുന്നിന്റെ ഉപയോഗം',
      dosage: 'അളവ്',
      frequency: 'എത്ര തവണ',
      duration: 'എത്ര ദിവസം',
      sideEffects: 'പാർശ്വഫലങ്ങൾ',
      precautions: 'പ്രധാന മുൻകരുതലുകൾ',
      route: 'രീതി',
      dailySlots: 'ദൈനംദിന സമയം',
      symptoms: 'ലക്ഷണങ്ങൾ',
      generalPrecautions: 'പൊതുവായ മുൻകരുതലുകൾ',
      dietaryAdvice: 'ഭക്ഷണ നിർദ്ദേശങ്ങൾ',
    },
    dashboard: {
      criticalConcernTitle: 'ഗുരുതരമായ സുരക്ഷാ മുന്നറിയിപ്പ്',
      highRiskTitle: 'ഉയർന്ന മരുന്ന് അപകടസാധ്യത',
      reviewAlertsBtn: 'മുന്നറിയിപ്പുകൾ കാണുക',
      diagnosisLabel: 'രോഗനിർണ്ണയം',
      conditionsCount: 'അവസ്ഥകൾ',
      activeMedications: 'മരുന്നുകൾ',
      prescribedCount: 'നിർദ്ദേശിച്ചവ',
      nextFollowUp: 'അടുത്ത സന്ദർശനം',
      testsAdvised: 'പരിശോധനകൾ നിർദ്ദേശിച്ചു',
      trackTestsBtn: 'പരിശോധനകൾ കാണുക',
      viewMedicineDetailsBtn: 'മരുന്ന് വിവരങ്ങൾ കാണുക',
    },
    patient: {
      documentedAllergies: 'രേഖപ്പെടുത്തിയ അലർജികൾ',
      existingMedications: 'നിലവിലെ മരുന്നുകൾ',
      yearsOld: 'വയസ്സ്',
      notSpecified: 'രേഖപ്പെടുത്തിയിട്ടില്ല',
    },
    pdf: {
      reportTitle: 'രോഗി ചികിത്സ & മരുന്ന് സുരക്ഷാ റിപ്പോർട്ട്',
      generatedOn: 'തയ്യാറാക്കിയ തീയതി',
      patientInfoSection: 'രോഗി & കുറിപ്പടി വിവരങ്ങൾ',
      diagnosisSection: 'രോഗനിർണ്ണയവും വിശദീകരണവും',
      medicinesSection: 'നിർദ്ദേശിച്ച മരുന്നുകൾ',
      safetySection: 'മരുന്ന് സുരക്ഷാ മുന്നറിയിപ്പുകൾ',
      timetableSection: 'ദൈനംദിന മരുന്ന് പട്ടിക',
      investigationsSection: 'വൈദ്യപരിശോധനകൾ',
      followUpSection: 'തുടർ സന്ദർശനം & നിർദ്ദേശങ്ങൾ',
      adviceSection: 'മുൻകരുതലുകളും ഭക്ഷണക്രമവും',
      disclaimerSection: 'വൈദ്യശാസ്ത്ര നിരാകരണം',
      unavailable: 'രേഖപ്പെടുത്തിയിട്ടില്ല',
      errorGenerating: 'PDF റിപ്പോർട്ട് സൃഷ്ടിക്കാൻ കഴിഞ്ഞില്ല.',
    },
    severities: {
      critical: 'അതീവ ഗുരുതരം',
      high: 'കൂടിയ അപകടസാധ്യത',
      moderate: 'മിതമായ അപകടസാധ്യത',
      low: 'കുറഞ്ഞ അപകടസാധ്യത',
      unverified: 'പരിശോധിച്ചിട്ടില്ല',
    },
    status: {
      taken: 'കഴിച്ചു',
      pending: 'കഴിക്കാനുണ്ട്',
      missed: 'മുങ്ങിപ്പോയി',
      completed: 'പൂർത്തിയായി',
    },
    footer: {
      tagline: 'Cure — ബഹുഭാഷാ കുറിപ്പടി & മരുന്ന് സുരക്ഷാ സഹായി',
      capabilities: '12 ഇന്ത്യൻ ഭാഷകൾ • മരുന്ന് സുരക്ഷാ എഞ്ചിൻ • OCR & PDF റിപ്പോർട്ടുകൾ',
    },
  }),

  mr: mergeDict({
    appTitle: 'Cure (क्युअर)',
    appSubtitle: 'बहुभाषिक प्रिस्क्रिप्शन आणि औषध सुरक्षा सहाय्यक',
    demoBadge: 'डेमो मोड',
    disclaimerTitle: 'वैद्यकीय सूचना व अस्वीकरण',
    disclaimerText:
      'हे ॲप्लिकेशन रुग्णांना डॉक्टरांचे प्रिस्क्रिप्शन समजून घेण्यास मदत करते. हे वैद्यकीय सल्ल्याचा किंवा निदानाचा पर्याय नाही. अस्पष्ट सूचनांची खात्री नेहमी डॉक्टर किंवा फार्मासिस्टकडून करून घ्या.',
    tabs: {
      dashboard: 'डॅशबोर्ड',
      treatmentGuide: 'उपचार मार्गदर्शक',
      medications: 'औषधे',
      schedule: 'दैनिक वेळापत्रक',
      safety: 'सुरक्षा तपासणी',
      investigations: 'चाचण्या व फॉलो-अप',
      review: 'तपासा आणि बदला',
      ocrDiagnostics: 'OCR तपासणी',
    },
    actions: {
      uploadPrescription: 'प्रिस्क्रिप्शन अपलोड',
      sampleCases: 'नमुना प्रकरणे',
      tryDemo: 'नमुना प्रिस्क्रिप्शन पहा',
      changeLanguage: 'भाषा बदला',
      markTaken: 'औषध घेतले',
      markMissed: 'चुकले',
      undo: 'मागे घ्या',
      resetToday: 'रीसेट करा',
      saveChanges: 'जतन करा',
      downloadReport: 'उपचार अहवाल डाउनलोड करा (PDF)',
      generatingPdf: 'PDF तयार होत आहे...',
      printGuide: 'प्रिंट',
      verifyWithDoctor: 'डॉक्टरांकडून खात्री करा',
      loadCase: 'हे प्रकरण लोड करा',
    },
    timeSlots: {
      morning: 'सकाळी',
      afternoon: 'दुपारी',
      evening: 'संध्याकाळी',
      night: 'रात्री (झोपण्यापूर्वी)',
    },
    foodInstructions: {
      beforeFood: 'जेवणापूर्वी',
      afterFood: 'जेवणानंतर',
      withFood: 'जेवणासोबत',
      emptyStomach: 'उपाशी पोटी',
      atBedtime: 'झोपण्यापूर्वी',
      asDirected: 'डॉक्टरांच्या सल्ल्यानुसार',
    },
    sections: {
      diagnosisTitle: 'तुमचे आजारपण समजून घ्या',
      diagnosisSubtitle: 'सोप्या मराठीत आजाराची माहिती',
      todaySchedule: 'आजचे औषध वेळापत्रक',
      todayProgress: 'आजची प्रगती',
      safetyAlertsTitle: 'औषध सुरक्षा सूचना',
      investigationsTitle: 'आवश्यक वैद्यकीय चाचण्या',
      followUpTitle: 'डॉक्टरांची पुढील भेट',
      medicineCardsTitle: 'औषधांचा तपशील',
      purpose: 'औषधाचा उद्देश',
      dosage: 'डोस प्रमाण',
      frequency: 'दिवसातून किती वेळा',
      duration: 'कालावधी',
      sideEffects: 'संभाव्य दुष्परिणाम',
      precautions: 'महत्त्वाची काळजी',
      route: 'घेण्याची पद्धत',
      dailySlots: 'दैनिक वेळा',
      symptoms: 'लक्षणे',
      generalPrecautions: 'सामान्य काळजी',
      dietaryAdvice: 'आहार सल्ला',
    },
    dashboard: {
      criticalConcernTitle: 'गंभीर सुरक्षा इशारा आढळला',
      highRiskTitle: 'जास्त औषध धोका आढळला',
      reviewAlertsBtn: 'सुरक्षा सूचना पहा',
      diagnosisLabel: 'निदान',
      conditionsCount: 'आजार',
      activeMedications: 'सुरू असलेली औषधे',
      prescribedCount: 'लिहून दिलेली',
      nextFollowUp: 'पुढील भेट',
      testsAdvised: 'चाचण्या सुचविल्या आहेत',
      trackTestsBtn: 'चाचण्या व भेटी पहा',
      viewMedicineDetailsBtn: 'औषध तपशील पहा',
    },
    patient: {
      documentedAllergies: 'नोंदवलेली ॲलर्जी',
      existingMedications: 'सध्याची नियमित औषधे',
      yearsOld: 'वर्षे',
      notSpecified: 'नमूद नाही',
    },
    pdf: {
      reportTitle: 'रुग्ण उपचार आणि औषध सुरक्षा अहवाल',
      generatedOn: 'तयार केल्याची तारीख',
      patientInfoSection: 'रुग्ण व प्रिस्क्रिप्शन तपशील',
      diagnosisSection: 'निदान व स्पष्टीकरण',
      medicinesSection: 'लिहून दिलेली औषधे',
      safetySection: 'औषध सुरक्षा सूचना',
      timetableSection: 'दैनिक औषध वेळापत्रक',
      investigationsSection: 'सुचविलेल्या वैद्यकीय चाचण्या',
      followUpSection: 'डॉक्टरांची पुढील भेट व सूचना',
      adviceSection: 'काळजी व आहार सल्ला',
      disclaimerSection: 'वैद्यकीय अस्वीकरण',
      unavailable: 'नमूद नाही',
      errorGenerating: 'PDF अहवाल तयार होऊ शकला नाही.',
    },
    severities: {
      critical: 'अत्यंत गंभीर धोका',
      high: 'जास्त धोका',
      moderate: 'मध्यम धोका',
      low: 'कमी धोका',
      unverified: 'तपासणी अपूर्ण',
    },
    status: {
      taken: 'घेतले',
      pending: 'बाकी',
      missed: 'चुकले',
      completed: 'पूर्ण',
    },
    footer: {
      tagline: 'Cure — बहुभाषिक प्रिस्क्रिप्शन आणि औषध सुरक्षा सहाय्यक',
      capabilities: '12 भारतीय भाषा • औषध सुरक्षा इंजिन • OCR व बहुभाषिक PDF अहवाल',
    },
  }),

  bn: mergeDict({
    appTitle: 'Cure (কিউর)',
    appSubtitle: 'বহুভাষিক প্রেসক্রিপশন ও ওষুধ সুরক্ষা সহকারী',
    demoBadge: 'ডেমো মোড',
    disclaimerTitle: 'চিকিৎসা বিজ্ঞপ্তি ও দাবিত্যাগ',
    disclaimerText:
      'এই অ্যাপ্লিকেশনটি রোগীদের তাদের প্রেসক্রিপশন সহজে বুঝতে এবং সাজিয়ে নিতে সাহায্য করে। এটি ডাক্তারের পরামর্শ বা চিকিৎসার বিকল্প নয়। অস্পষ্ট নির্দেশ সর্বদা ডাক্তার বা ফার্মাসিস্টের সাথে যাচাই করুন।',
    tabs: {
      dashboard: 'ড্যাশবোর্ড',
      treatmentGuide: 'চিকিৎসা নির্দেশিকা',
      medications: 'ওষুধের তালিকা',
      schedule: 'দৈনিক সময়সূচী',
      safety: 'সুরক্ষা যাচাই',
      investigations: 'পরীক্ষা ও ফলো-আপ',
      review: 'পর্যালোচনা ও সম্পাদনা',
      ocrDiagnostics: 'OCR পরীক্ষা',
    },
    actions: {
      uploadPrescription: 'প্রেসক্রিপশন আপলোড',
      sampleCases: 'নমুনা কেস',
      tryDemo: 'নমুনা দেখুন',
      changeLanguage: 'ভাষা পরিবর্তন করুন',
      markTaken: 'খেয়েছি',
      markMissed: 'বাদ গেছে',
      undo: 'বাতিল',
      resetToday: 'রিসেট',
      saveChanges: 'সংরক্ষণ করুন',
      downloadReport: 'চিকিৎসা রিপোর্ট ডাউনলোড করুন (PDF)',
      generatingPdf: 'PDF তৈরি হচ্ছে...',
      printGuide: 'প্রিন্ট',
      verifyWithDoctor: 'ডাক্তারের সাথে নিশ্চিত করুন',
      loadCase: 'এই কেস লোড করুন',
    },
    timeSlots: {
      morning: 'সকাল',
      afternoon: 'দুপুর',
      evening: 'সন্ধ্যা',
      night: 'রাত (শোবার আগে)',
    },
    foodInstructions: {
      beforeFood: 'খাওয়ার আগে',
      afterFood: 'খাওয়ার পর',
      withFood: 'খাবারের সাথে',
      emptyStomach: 'খালি পেটে',
      atBedtime: 'শোবার সময়',
      asDirected: 'ডাক্তারের নির্দেশ অনুযায়ী',
    },
    sections: {
      diagnosisTitle: 'আপনার রোগ বুঝুন',
      diagnosisSubtitle: 'সহজ বাংলায় রোগের বিবরণ',
      todaySchedule: 'আজকের ওষুধের সময়সূচী',
      todayProgress: 'আজকের ওষুধের অগ্রগতি',
      safetyAlertsTitle: 'ওষুধের সুরক্ষা সতর্কতা',
      investigationsTitle: 'প্রয়োজনীয় স্বাস্থ্য পরীক্ষা',
      followUpTitle: 'ডাক্তারের পরবর্তী সাক্ষাৎ',
      medicineCardsTitle: 'ওষুধের বিস্তারিত বিবরণ',
      purpose: 'ওষুধের উদ্দেশ্য',
      dosage: 'মাত্রা',
      frequency: 'দিনে কতবার',
      duration: 'চিকিৎসার মেয়াদ',
      sideEffects: 'সাধারণ পার্শ্বপ্রতিক্রিয়া',
      precautions: 'গুরুত্বপূর্ণ সতর্কতা',
      route: 'সেবন পদ্ধতি',
      dailySlots: 'দৈনিক সময়',
      symptoms: 'উপসর্গ',
      generalPrecautions: 'সাধারণ সতর্কতা',
      dietaryAdvice: 'খাদ্য ও পুষ্টি পরামর্শ',
    },
    dashboard: {
      criticalConcernTitle: 'গুরুতর সুরক্ষা সতর্কতা সনাক্ত হয়েছে',
      highRiskTitle: 'উচ্চ ওষুধের ঝুঁকি চিহ্নিত হয়েছে',
      reviewAlertsBtn: 'সতর্কতাগুলো দেখুন',
      diagnosisLabel: 'রোগ নির্ণয়',
      conditionsCount: 'অবস্থা',
      activeMedications: 'সক্রিয় ওষুধসমূহ',
      prescribedCount: 'নির্ধারিত',
      nextFollowUp: 'পরবর্তী সাক্ষাৎ',
      testsAdvised: 'পরীক্ষা পরামর্শ দেওয়া হয়েছে',
      trackTestsBtn: 'পরীক্ষা ও অ্যাপয়েন্টমেন্ট দেখুন',
      viewMedicineDetailsBtn: 'ওষুধের বিবরণ দেখুন',
    },
    patient: {
      documentedAllergies: 'নথিভুক্ত অ্যালার্জি',
      existingMedications: 'চলমান নিয়মিত ওষুধ',
      yearsOld: 'বছর',
      notSpecified: 'উল্লেখ নেই',
    },
    pdf: {
      reportTitle: 'রোগীর চিকিৎসা ও ওষুধ সুরক্ষা রিপোর্ট',
      generatedOn: 'তৈরির তারিখ',
      patientInfoSection: 'রোগী ও প্রেসক্রিপশনের বিবরণ',
      diagnosisSection: 'রোগ নির্ণয় ও বিবরণ',
      medicinesSection: 'নির্ধারিত ওষুধসমূহ',
      safetySection: 'ওষুধ সুরক্ষা সতর্কতা',
      timetableSection: 'দৈনিক ওষুধের সময়সূচী',
      investigationsSection: 'প্রয়োজনীয় পরীক্ষা-নিরীক্ষা',
      followUpSection: 'পরবর্তী সাক্ষাৎ ও নির্দেশনা',
      adviceSection: 'সতর্কতা ও খাদ্য পরামর্শ',
      disclaimerSection: 'চিকিৎসা দাবিত্যাগ',
      unavailable: 'উল্লেখ নেই',
      errorGenerating: 'PDF রিপোর্ট তৈরি করা যায়নি।',
    },
    severities: {
      critical: 'মারাত্মক ঝুঁকি',
      high: 'উচ্চ ঝুঁকি',
      moderate: 'মাঝারি ঝুঁকি',
      low: 'কম ঝুঁকি',
      unverified: 'অযাচাইকৃত',
    },
    status: {
      taken: 'খেয়েছি',
      pending: 'আসন্ন',
      missed: 'বাদ গেছে',
      completed: 'সম্পন্ন',
    },
    footer: {
      tagline: 'Cure — বহুভাষিক প্রেসক্রিপশন ও ওষুধ সুরক্ষা সহকারী',
      capabilities: '১২টি ভারতীয় ভাষা • সুরক্ষা ইঞ্জিন • OCR ও বহুভাষিক PDF রিপোর্ট',
    },
  }),

  gu: mergeDict({
    appTitle: 'Cure (ક્યોર)',
    appSubtitle: 'બહુભાષી પ્રિસ્ક્રિપ્શન અને દવા સુરક્ષા સહાયક',
    demoBadge: 'ડેમો મોડ',
    disclaimerTitle: 'તબીબી સૂચના અને અસ્વીકરણ',
    disclaimerText:
      'આ એપ્લિકેશન દર્દીઓને તેમના પ્રિસ્ક્રિપ્શન સરળતાથી સમજવામાં મદદ કરે છે. આ ડોક્ટરની સીધી સલાહનો વિકલ્પ નથી. કોઈપણ અસ્પષ્ટ સૂચના ડોક્ટર અથવા ફાર્માસિસ્ટ સાથે ચકાસો.',
    tabs: {
      dashboard: 'ડેશબોર્ડ',
      treatmentGuide: 'સારવાર માર્ગદર્શિકા',
      medications: 'દવાઓ',
      schedule: 'દૈનિક સમયપત્રક',
      safety: 'સુરક્ષા તપાસ',
      investigations: 'તબીબી તપાસ',
      review: 'તપાસો અને સુધારો',
      ocrDiagnostics: 'OCR પરીક્ષણ',
    },
    actions: {
      uploadPrescription: 'પ્રિસ્ક્રિપ્શન અપલોડ',
      sampleCases: 'નમૂના કેસ',
      tryDemo: 'નમૂનો જુઓ',
      changeLanguage: 'ભાષા બદલો',
      markTaken: 'દવા લીધી',
      markMissed: 'ચૂકી ગયા',
      undo: 'રદ કરો',
      resetToday: 'રીસેટ કરો',
      saveChanges: 'સાચવો',
      downloadReport: 'સારવાર રિપોર્ટ ડાઉનલોડ કરો (PDF)',
      generatingPdf: 'PDF બની રહ્યું છે...',
      printGuide: 'પ્રિન્ટ',
      verifyWithDoctor: 'ડોક્ટર સાથે ખાતરી કરો',
      loadCase: 'આ કેસ લોડ કરો',
    },
    timeSlots: {
      morning: 'સવાર',
      afternoon: 'બપોર',
      evening: 'સાંજ',
      night: 'રાત (સૂતા પહેલા)',
    },
    foodInstructions: {
      beforeFood: 'જમ્યા પહેલા',
      afterFood: 'જમ્યા પછી',
      withFood: 'જમવાની સાથે',
      emptyStomach: 'ખાલી પેટે',
      atBedtime: 'સૂતા પહેલા',
      asDirected: 'ડોક્ટરની સૂચના મુજબ',
    },
    sections: {
      diagnosisTitle: 'તમારી બીમારીને સમજો',
      diagnosisSubtitle: 'સરળ ગુજરાતીમાં સમજૂતી',
      todaySchedule: 'આજનું દવા સમયપત્રક',
      todayProgress: 'આજની પ્રગતિ',
      safetyAlertsTitle: 'દવા સુરક્ષા ચેતવણીઓ',
      investigationsTitle: 'જરૂરી તબીબી ટેસ્ટ',
      followUpTitle: 'ડોક્ટરની મુલાકાત',
      medicineCardsTitle: 'દવાઓની સંપૂર્ણ માહિતી',
      purpose: 'દવાનો હેતુ',
      dosage: 'માત્રા',
      frequency: 'દિવસમાં કેટલી વાર',
      duration: 'સમયગાળો',
      sideEffects: 'સામાન્ય આડઅસરો',
      precautions: 'મહત્વપૂર્ણ સાવચેતીઓ',
      route: 'લેવાની રીત',
      dailySlots: 'દૈનિક સમય',
      symptoms: 'લક્ષણો',
      generalPrecautions: 'સામાન્ય સાવચેતીઓ',
      dietaryAdvice: 'આહાર સલાહ',
    },
    dashboard: {
      criticalConcernTitle: 'ગંભીર સુરક્ષા ચેતવણી મળી',
      highRiskTitle: 'વધુ દવા જોખમ ઓળખાયું',
      reviewAlertsBtn: 'સુરક્ષા ચેતવણીઓ જુઓ',
      diagnosisLabel: 'નિદાન',
      conditionsCount: 'સ્થિતિઓ',
      activeMedications: 'ચાલુ દવાઓ',
      prescribedCount: 'સૂચવેલ',
      nextFollowUp: 'આગામી મુલાકાત',
      testsAdvised: 'ટેસ્ટ સૂચવવામાં આવ્યા',
      trackTestsBtn: 'ટેસ્ટ અને મુલાકાત જુઓ',
      viewMedicineDetailsBtn: 'દવા વિગત જુઓ',
    },
    patient: {
      documentedAllergies: 'નોંધાયેલ એલર્જી',
      existingMedications: 'નિયમિત ચાલુ દવાઓ',
      yearsOld: 'વર્ષ',
      notSpecified: 'ઉલ્લેખ નથી',
    },
    pdf: {
      reportTitle: 'દર્દી સારવાર અને દવા સુરક્ષા રિપોર્ટ',
      generatedOn: 'તૈયાર તારીખ',
      patientInfoSection: 'દર્દી અને પ્રિસ્ક્રિપ્શન વિગત',
      diagnosisSection: 'નિદાન અને સમજૂતી',
      medicinesSection: 'સૂચવેલ દવાઓ',
      safetySection: 'દવા સુરક્ષા ચેતવણીઓ',
      timetableSection: 'દૈનિક દવા સમયપત્રક',
      investigationsSection: 'સૂચવેલ તબીબી ટેસ્ટ',
      followUpSection: 'આગામી મુલાકાત અને સૂચનાઓ',
      adviceSection: 'સાવચેતી અને આહાર સલાહ',
      disclaimerSection: 'તબીબી અસ્વીકરણ',
      unavailable: 'ઉલ્લેખ નથી',
      errorGenerating: 'PDF રિપોર્ટ બનાવી શકાયો નથી.',
    },
    severities: {
      critical: 'ગંભીર જોખમ',
      high: 'વધુ જોખમ',
      moderate: 'મધ્યમ જોખમ',
      low: 'ઓછું જોખમ',
      unverified: 'અધૂરી તપાસ',
    },
    status: {
      taken: 'લીધી છે',
      pending: 'બાકી છે',
      missed: 'ચૂકી ગયા',
      completed: 'પૂર્ણ',
    },
    footer: {
      tagline: 'Cure — બહુભાષી પ્રિસ્ક્રિપ્શન અને દવા સુરક્ષા સહાયક',
      capabilities: '12 ભારતીય ભાષાઓ • સુરક્ષા એન્જિન • OCR અને બહુભાષી PDF રિપોર્ટ',
    },
  }),

  pa: mergeDict({
    appTitle: 'Cure (ਕਿਓਰ)',
    appSubtitle: 'ਬਹੁ-ਭਾਸ਼ਾਈ ਪਰਚਾ ਅਤੇ ਦਵਾਈ ਸੁਰੱਖਿਆ ਸਹਾਇਕ',
    demoBadge: 'ਡੈਮੋ ਮੋਡ',
    disclaimerTitle: 'ਡਾਕਟਰੀ ਸੂਚਨਾ ਅਤੇ ਅਸਵੀਕਰਨ',
    disclaimerText:
      'ਇਹ ਐਪਲੀਕੇਸ਼ਨ ਮਰੀਜ਼ਾਂ ਨੂੰ ਉਹਨਾਂ ਦੇ ਡਾਕਟਰ ਦੇ ਪਰਚੇ ਨੂੰ ਸਮਝਣ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ। ਇਹ ਡਾਕਟਰੀ ਸਲਾਹ ਦਾ ਬਦਲ ਨਹੀਂ ਹੈ। ਕਿਸੇ ਵੀ ਸ਼ੱਕ ਲਈ ਹਮੇਸ਼ਾ ਡਾਕਟਰ ਜਾਂ ਫਾਰਮਾਸਿਸਟ ਨਾਲ ਪੁਸ਼ਟੀ ਕਰੋ।',
    tabs: {
      dashboard: 'ਡੈਸ਼ਬੋਰਡ',
      treatmentGuide: 'ਇਲਾਜ ਗਾਈਡ',
      medications: 'ਦਵਾਈਆਂ',
      schedule: 'ਰੋਜ਼ਾਨਾ ਸਮਾਂ-ਸਾਰਣੀ',
      safety: 'ਸੁਰੱਖਿਆ ਜਾਂਚ',
      investigations: 'ਟੈਸਟ ਅਤੇ ਫਾਲੋ-ਅੱਪ',
      review: 'ਸਮੀਖਿਆ ਕਰੋ',
      ocrDiagnostics: 'OCR ਜਾਂਚ',
    },
    actions: {
      uploadPrescription: 'ਪਰਚਾ ਅੱਪਲੋਡ',
      sampleCases: 'ਨਮੂਨਾ ਕੇਸ',
      tryDemo: 'ਨਮੂਨਾ ਦੇਖੋ',
      changeLanguage: 'ਭਾਸ਼ਾ ਬਦਲੋ',
      markTaken: 'ਲੈ ਲਈ',
      markMissed: 'ਛੁੱਟ ਗਈ',
      undo: 'ਵਾਪਸ',
      resetToday: 'ਰੀਸੈਟ',
      saveChanges: 'ਸੇਵ ਕਰੋ',
      downloadReport: 'ਇਲਾਜ ਰਿਪੋਰਟ ਡਾਊਨਲੋਡ ਕਰੋ (PDF)',
      generatingPdf: 'PDF ਬਣ ਰਹੀ ਹੈ...',
      printGuide: 'ਪ੍ਰਿੰਟ',
      verifyWithDoctor: 'ਡਾਕਟਰ ਤੋਂ ਪੁਸ਼ਟੀ ਕਰੋ',
      loadCase: 'ਇਹ ਕੇਸ ਲੋਡ ਕਰੋ',
    },
    timeSlots: {
      morning: 'ਸਵੇਰ',
      afternoon: 'ਦੁਪਹਿਰ',
      evening: 'ਸ਼ਾਮ',
      night: 'ਰਾਤ (ਸੌਣ ਵੇਲੇ)',
    },
    foodInstructions: {
      beforeFood: 'ਖਾਣੇ ਤੋਂ ਪਹਿਲਾਂ',
      afterFood: 'ਖਾਣੇ ਤੋਂ ਬਾਅਦ',
      withFood: 'ਖਾਣੇ ਦੇ ਨਾਲ',
      emptyStomach: 'ਖਾਲੀ ਪੇਟ',
      atBedtime: 'ਸੌਣ ਵੇਲੇ',
      asDirected: 'ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਅਨੁਸਾਰ',
    },
    sections: {
      diagnosisTitle: 'ਆਪਣੀ ਬਿਮਾਰੀ ਨੂੰ ਸਮਝੋ',
      diagnosisSubtitle: 'ਸੌਖੀ ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਣਕਾਰੀ',
      todaySchedule: 'ਅੱਜ ਦੀ ਦਵਾਈ ਦਾ ਸਮਾਂ',
      todayProgress: 'ਅੱਜ ਦੀ ਪ੍ਰਗਤੀ',
      safetyAlertsTitle: 'ਦਵਾਈ ਸੁਰੱਖਿਆ ਚੇਤਾਵਨੀਆਂ',
      investigationsTitle: 'ਲੋੜੀਂਦੇ ਟੈਸਟ',
      followUpTitle: 'ਡਾਕਟਰ ਦੀ ਅਗਲੀ ਮੁਲਾਕਾਤ',
      medicineCardsTitle: 'ਦਵਾਈਆਂ ਦਾ ਪੂਰਾ ਵੇਰਵਾ',
      purpose: 'ਦਵਾਈ ਦਾ ਮਕਸਦ',
      dosage: 'ਖੁਰਾਕ',
      frequency: 'ਦਿਨ ਵਿੱਚ ਕਿੰਨੀ ਵਾਰ',
      duration: 'ਮਿਆਦ',
      sideEffects: 'ਮਾੜੇ ਪ੍ਰਭਾਵ',
      precautions: 'ਜ਼ਰੂਰੀ ਸਾਵਧਾਨੀਆਂ',
      route: 'ਤਰੀਕਾ',
      dailySlots: 'ਰੋਜ਼ਾਨਾ ਸਮਾਂ',
      symptoms: 'ਲੱਛਣ',
      generalPrecautions: 'ਆਮ ਸਾਵਧਾਨੀਆਂ',
      dietaryAdvice: 'ਖੁਰਾਕ ਸਲਾਹ',
    },
    dashboard: {
      criticalConcernTitle: 'ਗੰਭੀਰ ਸੁਰੱਖਿਆ ਚੇਤਾਵਨੀ ਮਿਲੀ',
      highRiskTitle: 'ਵੱਡਾ ਦਵਾਈ ਖਤਰਾ ਪਛਾਣਿਆ ਗਿਆ',
      reviewAlertsBtn: 'ਸੁਰੱਖਿਆ ਚੇਤਾਵਨੀਆਂ ਦੇਖੋ',
      diagnosisLabel: 'ਰੋਗ ਨਿਦਾਨ',
      conditionsCount: 'ਸਥਿਤੀਆਂ',
      activeMedications: 'ਚੱਲ ਰਹੀਆਂ ਦਵਾਈਆਂ',
      prescribedCount: 'ਲਿਖੀਆਂ ਗਈਆਂ',
      nextFollowUp: 'ਅਗਲੀ ਮੁਲਾਕਾਤ',
      testsAdvised: 'ਟੈਸਟ ਲਿਖੇ ਗਏ ਹਨ',
      trackTestsBtn: 'ਟੈਸਟ ਅਤੇ ਮੁਲਾਕਾਤ ਦੇਖੋ',
      viewMedicineDetailsBtn: 'ਦਵਾਈ ਵੇਰਵਾ ਦੇਖੋ',
    },
    patient: {
      documentedAllergies: 'ਦਰਜ ਐਲਰਜੀ',
      existingMedications: 'ਪਹਿਲਾਂ ਤੋਂ ਚੱਲ ਰਹੀਆਂ ਦਵਾਈਆਂ',
      yearsOld: 'ਸਾਲ',
      notSpecified: 'ਦਰਜ ਨਹੀਂ',
    },
    pdf: {
      reportTitle: 'ਮਰੀਜ਼ ਇਲਾਜ ਅਤੇ ਦਵਾਈ ਸੁਰੱਖਿਆ ਰਿਪੋਰਟ',
      generatedOn: 'ਬਣਾਈ ਮਿਤੀ',
      patientInfoSection: 'ਮਰੀਜ਼ ਅਤੇ ਪਰਚੇ ਦਾ ਵੇਰਵਾ',
      diagnosisSection: 'ਬਿਮਾਰੀ ਅਤੇ ਵਿਆਖਿਆ',
      medicinesSection: 'ਲਿਖੀਆਂ ਦਵਾਈਆਂ',
      safetySection: 'ਦਵਾਈ ਸੁਰੱਖਿਆ ਚੇਤਾਵਨੀਆਂ',
      timetableSection: 'ਰੋਜ਼ਾਨਾ ਦਵਾਈ ਸਮਾਂ-ਸਾਰਣੀ',
      investigationsSection: 'ਲੋੜੀਂਦੇ ਟੈਸਟ',
      followUpSection: 'ਅਗਲੀ ਮੁਲਾਕਾਤ ਅਤੇ ਹਦਾਇਤਾਂ',
      adviceSection: 'ਸਾਵਧਾਨੀਆਂ ਅਤੇ ਖੁਰਾਕ ਸਲਾਹ',
      disclaimerSection: 'ਡਾਕਟਰੀ ਅਸਵੀਕਰਨ',
      unavailable: 'ਦਰਜ ਨਹੀਂ',
      errorGenerating: 'PDF ਰਿਪੋਰਟ ਨਹੀਂ ਬਣ ਸਕੀ।',
    },
    severities: {
      critical: 'ਗੰਭੀਰ ਖਤਰਾ',
      high: 'ਵੱਡਾ ਖਤਰਾ',
      moderate: 'ਦਰਮਿਆਨਾ ਖਤਰਾ',
      low: 'ਘੱਟ ਖਤਰਾ',
      unverified: 'ਅਧੂਰੀ ਜਾਂਚ',
    },
    status: {
      taken: 'ਲੈ ਲਈ',
      pending: 'ਬਾਕੀ',
      missed: 'ਛੁੱਟ ਗਈ',
      completed: 'ਪੂਰਾ',
    },
    footer: {
      tagline: 'Cure — ਬਹੁ-ਭਾਸ਼ਾਈ ਪਰਚਾ ਅਤੇ ਦਵਾਈ ਸੁਰੱਖਿਆ ਸਹਾਇਕ',
      capabilities: '12 ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ • ਸੁਰੱਖਿਆ ਇੰਜਣ • OCR ਅਤੇ PDF ਰਿਪੋਰਟਾਂ',
    },
  }),

  or: mergeDict({
    appTitle: 'Cure (କ୍ୟୋର୍)',
    appSubtitle: 'ବହୁଭାଷୀ ପ୍ରେସକ୍ରିପସନ୍ ଏବଂ ଔଷଧ ସୁରକ୍ଷା ସହାୟକ',
    demoBadge: 'ଡେମୋ ମୋଡ୍',
    disclaimerTitle: 'ଡାକ୍ତରୀ ସୂଚନା ଏବଂ ଅସ୍ୱୀକାର',
    disclaimerText:
      'ଏହି ଆପ୍ଲିକେସନ୍ ରୋଗୀମାନଙ୍କୁ ସେମାନଙ୍କର ପ୍ରେସକ୍ରିପସନ୍ ବୁଝିବାରେ ସାହାଯ୍ୟ କରେ। ଏହା ଡାକ୍ତରଙ୍କ ପରାମର୍ଶର ବିକଳ୍ପ ନୁହେଁ। ଅସ୍ପଷ୍ଟ ନିର୍ଦ୍ଦେଶ ସର୍ବଦା ଡାକ୍ତରଙ୍କ ସହ ନିଶ୍ଚିତ କରନ୍ତୁ।',
    tabs: {
      dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
      treatmentGuide: 'ଚିକିତ୍ସା ମାର୍ଗଦର୍ଶିକା',
      medications: 'ଔଷଧ ସମୂହ',
      schedule: 'ଦୈନିକ ସମୟସାରଣୀ',
      safety: 'ସୁରକ୍ଷା ଯାଞ୍ଚ',
      investigations: 'ପରୀକ୍ଷା ଓ ଫଲୋ-ଅପ୍',
      review: 'ଯାଞ୍ଚ ଓ ସଂଶୋଧନ',
      ocrDiagnostics: 'OCR ପରୀକ୍ଷା',
    },
    actions: {
      uploadPrescription: 'ଅପଲୋଡ୍ କରନ୍ତୁ',
      sampleCases: 'ନମୁନା ମାମଲା',
      tryDemo: 'ନମୁନା ଦେଖନ୍ତୁ',
      changeLanguage: 'ଭାଷା ବଦଳାନ୍ତୁ',
      markTaken: 'ଖାଇଲି',
      markMissed: 'ଭୁଲିଗଲି',
      undo: 'ଫେରାନ୍ତୁ',
      resetToday: 'ରିସେଟ୍',
      saveChanges: 'ସେଭ୍ କରନ୍ତୁ',
      downloadReport: 'ଚିକିତ୍ସା ରିପୋର୍ଟ ଡାଉନଲୋଡ୍ କରନ୍ତୁ (PDF)',
      generatingPdf: 'PDF ତିଆରି ହେଉଛି...',
      printGuide: 'ପ୍ରିଣ୍ଟ',
      verifyWithDoctor: 'ଡାକ୍ତରଙ୍କ ସହ ନିଶ୍ଚିତ କରନ୍ତୁ',
      loadCase: 'ଏହି ନମୁନା ଲୋଡ୍ କରନ୍ତୁ',
    },
    timeSlots: {
      morning: 'ସକାଳ',
      afternoon: 'ଦ୍ୱିପ୍ରହର',
      evening: 'ସନ୍ଧ୍ୟା',
      night: 'ରାତି (ଶୋଇବା ପୂର୍ବରୁ)',
    },
    foodInstructions: {
      beforeFood: 'ଖାଇବା ପୂର୍ବରୁ',
      afterFood: 'ଖାଇବା ପରେ',
      withFood: 'ଖାଇବା ସହିତ',
      emptyStomach: 'ଖାଲି ପେଟରେ',
      atBedtime: 'ଶୋଇବା ପୂର୍ବରୁ',
      asDirected: 'ଡାକ୍ତରଙ୍କ ନିର୍ଦ୍ଦେଶ ଅନୁଯାୟୀ',
    },
    sections: {
      diagnosisTitle: 'ଆପଣଙ୍କ ରୋଗକୁ ବୁଝନ୍ତୁ',
      diagnosisSubtitle: 'ସହଜ ଓଡ଼ିଆରେ ରୋଗ ବିବରଣୀ',
      todaySchedule: 'ଆଜିର ଔଷଧ ସମୟସାରଣୀ',
      todayProgress: 'ଆଜିର ପ୍ରଗତି',
      safetyAlertsTitle: 'ଔଷଧ ସୁରକ୍ଷା ସତର୍କତା',
      investigationsTitle: 'ଡାକ୍ତରୀ ପରୀକ୍ଷା',
      followUpTitle: 'ଡାକ୍ତରଙ୍କ ପରବର୍ତ୍ତୀ ସାକ୍ଷାତ',
      medicineCardsTitle: 'ଔଷଧର ବିସ୍ତୃତ ତଥ୍ୟ',
      purpose: 'ଔଷଧର ଉଦ୍ଦେଶ୍ୟ',
      dosage: 'ପରିମାଣ',
      frequency: 'ଦିନକୁ କେତେ ଥର',
      duration: 'ଅବଧି',
      sideEffects: 'ପାର୍ଶ୍ୱ ପ୍ରତିକ୍ରିୟା',
      precautions: 'ଜରୁରୀ ସାବଧାନତା',
      route: 'ସେବନ ପଦ୍ଧତି',
      dailySlots: 'ଦୈନିକ ସମୟ',
      symptoms: 'ଲକ୍ଷଣ',
      generalPrecautions: 'ସାଧାରଣ ସାବଧାନତା',
      dietaryAdvice: 'ଖାଦ୍ୟ ପରାମର୍ଶ',
    },
    dashboard: {
      criticalConcernTitle: 'ଗୁରୁତର ସୁରକ୍ଷା ସତର୍କତା ଚିହ୍ନଟ',
      highRiskTitle: 'ଉଚ୍ଚ ଔଷଧ ବିପଦ ଚିହ୍ନଟ',
      reviewAlertsBtn: 'ସତର୍କତା ଦେଖନ୍ତୁ',
      diagnosisLabel: 'ରୋଗ ନିର୍ଣ୍ଣୟ',
      conditionsCount: 'ଅବସ୍ଥା',
      activeMedications: 'ସକ୍ରିୟ ଔଷଧ',
      prescribedCount: 'ନିର୍ଦ୍ଧାରିତ',
      nextFollowUp: 'ପରବର୍ତ୍ତୀ ସାକ୍ଷାତ',
      testsAdvised: 'ପରୀକ୍ଷା ପରାମର୍ଶ',
      trackTestsBtn: 'ପରୀକ୍ଷା ଦେଖନ୍ତୁ',
      viewMedicineDetailsBtn: 'ଔଷଧ ବିବରଣୀ ଦେଖନ୍ତୁ',
    },
    patient: {
      documentedAllergies: 'ନଥିଭୁକ୍ତ ଆଲର୍ଜି',
      existingMedications: 'ଚଳିତ ଔଷଧ',
      yearsOld: 'ବର୍ଷ',
      notSpecified: 'ଉଲ୍ଲେଖ ନାହିଁ',
    },
    pdf: {
      reportTitle: 'ରୋଗୀ ଚିକିତ୍ସା ଏବଂ ଔଷଧ ସୁରକ୍ଷା ରିପୋର୍ଟ',
      generatedOn: 'ପ୍ରସ୍ତୁତ ତାରିଖ',
      patientInfoSection: 'ରୋଗୀ ଓ ପ୍ରେସକ୍ରିପସନ୍ ବିବରଣୀ',
      diagnosisSection: 'ରୋଗ ନିର୍ଣ୍ଣୟ ଓ ବ୍ୟାଖ୍ୟା',
      medicinesSection: 'ନିର୍ଦ୍ଧାରିତ ଔଷଧ ସମୂହ',
      safetySection: 'ଔଷଧ ସୁରକ୍ଷା ସତର୍କତା',
      timetableSection: 'ଦୈନିକ ଔଷଧ ସମୟସାରଣୀ',
      investigationsSection: 'ଆବଶ୍ୟକ ଡାକ୍ତରୀ ପରୀକ୍ଷା',
      followUpSection: 'ପରବର୍ତ୍ତୀ ସାକ୍ଷାତ ଓ ନିର୍ଦ୍ଦେଶ',
      adviceSection: 'ସାବଧାନତା ଓ ଖାଦ୍ୟ ପରାମର୍ଶ',
      disclaimerSection: 'ଡାକ୍ତରୀ ଅସ୍ୱୀକାର',
      unavailable: 'ଉଲ୍ଲେଖ ନାହିଁ',
      errorGenerating: 'PDF ରିପୋର୍ଟ ତିଆରି ହୋଇପାରିଲା ନାହିଁ।',
    },
    severities: {
      critical: 'ଅତ୍ୟନ୍ତ ବିପଦଜନକ',
      high: 'ଉଚ୍ଚ ବିପଦ',
      moderate: 'ମଧ୍ୟମ ବିପଦ',
      low: 'କମ୍ ବିପଦ',
      unverified: 'ଅପରୀକ୍ଷିତ',
    },
    status: {
      taken: 'ଖାଇସାରିଛି',
      pending: 'ଖାଇବାକୁ ଅଛି',
      missed: 'ଭୁଲିଯାଇଛି',
      completed: 'ସମ୍ପୂର୍ଣ୍ଣ',
    },
    footer: {
      tagline: 'Cure — ବହୁଭାଷୀ ପ୍ରେସକ୍ରିପସନ୍ ଏବଂ ଔଷଧ ସୁରକ୍ଷା ସହାୟକ',
      capabilities: '12 ଭାରତୀୟ ଭାଷା • ସୁରକ୍ଷା ଇଞ୍ଜିନ୍ • OCR ଏବଂ PDF ରିପୋର୍ଟ',
    },
  }),

  ur: mergeDict({
    appTitle: 'Cure (کیور)',
    appSubtitle: 'کثیر لسانی نسخہ اور ادویات کی حفاظتی معاونت',
    demoBadge: 'ڈیمو موڈ',
    disclaimerTitle: 'طبی اطلاع اور دستبرداری',
    disclaimerTag: 'ذمہ دار ہیلتھ کیئر AI',
    disclaimerText:
      'یہ ایپلیکیشن مریضوں کو ان کے موجودہ نسخے کو سمجھنے اور ترتیب دینے میں مدد کرتی ہے۔ یہ ڈاکٹر کے مشورے، تشخیص یا طبی علاج کا متبادل نہیں ہے۔ کسی بھی غیر واضح ہدایت یا حفاظتی تنبیہ کی تصدیق ہمیشہ مستند ڈاکٹر یا فارماسسٹ سے کریں۔',
    disclaimerBullets: [
      'خودکار جانچ پیشہ ورانہ طبی جائزے کا متبادل نہیں ہے',
      'ڈاکٹر کے مشورے کے بغیر تجویز کردہ ادویات کبھی بند نہ کریں',
      'اپ لوڈ کردہ طبی دستاویزات نجی اور محفوظ رہتی ہیں',
    ],
    tabs: {
      dashboard: 'ڈیش بورڈ',
      treatmentGuide: 'رہنمائے علاج',
      medications: 'ادویات',
      schedule: 'روزانہ شیڈول',
      safety: 'حفاظتی جانچ',
      investigations: 'ٹیسٹ اور فالو اپ',
      review: 'جائزہ اور ترمیم',
      ocrDiagnostics: 'OCR تشخیص',
    },
    actions: {
      uploadPrescription: 'نسخہ اپ لوڈ کریں',
      sampleCases: 'نمونہ کیسز',
      tryDemo: 'نمونہ نسخہ لوڈ کریں',
      changeLanguage: 'زبان تبدیل کریں',
      markTaken: 'دوا لے لی',
      markMissed: 'چھوٹ گئی',
      undo: 'واپس',
      resetToday: 'آج کا ری سیٹ',
      saveChanges: 'محفوظ اور اپ ڈیٹ کریں',
      savedNotice: 'محفوظ ہو گیا!',
      downloadReport: 'علاج کی رپورٹ ڈاؤن لوڈ کریں (PDF)',
      generatingPdf: 'PDF بن رہی ہے...',
      printGuide: 'پرنٹ',
      verifyWithDoctor: 'ڈاکٹر یا فارماسسٹ سے تصدیق کریں',
      addMedicine: 'دوا شامل کریں',
      remove: 'ہٹائیں',
      addAllergy: 'الرجی شامل کریں',
      retryTranslation: 'دوبارہ ترجمہ کریں',
      back: 'واپس',
      processPrescription: 'نسخے کا تجزیہ کریں',
      loadCase: 'یہ کیس لوڈ کریں',
      editDetails: 'ادویات کی تفصیلات ترمیم کریں',
      markAttended: 'ملاقات مکمل',
      attended: 'ملاقات ہو گئی',
    },
    timeSlots: {
      morning: 'صبح',
      afternoon: 'دوپہر',
      evening: 'شام',
      night: 'رات (سوتے وقت)',
    },
    foodInstructions: {
      beforeFood: 'کھانے سے پہلے',
      afterFood: 'کھانے کے بعد',
      withFood: 'کھانے کے ساتھ',
      emptyStomach: 'خالی پیٹ',
      atBedtime: 'سوتے وقت',
      asDirected: 'ڈاکٹر کی ہدایت کے مطابق',
    },
    sections: {
      diagnosisTitle: 'اپنی بیماری کو سمجھیں',
      diagnosisSubtitle: 'سادہ اردو میں بیماری کی وضاحت',
      todaySchedule: 'آج کی ادویات کا شیڈول',
      todayProgress: 'آج کی پیش رفت',
      safetyAlertsTitle: 'ادویات کی حفاظتی تنبیہات',
      safetySubtitle: 'ادویات کے باہمی اثرات، دوہرے اجزاء اور الرجی کی خودکار جانچ',
      investigationsTitle: 'تجویز کردہ طبی ٹیسٹ',
      followUpTitle: 'ڈاکٹر سے اگلی ملاقات',
      medicineCardsTitle: 'تجویز کردہ ادویات کی تفصیلات',
      purpose: 'دوا کا مقصد',
      dosage: 'خوراک',
      frequency: 'دن میں کتنی بار',
      duration: 'علاج کی مدت',
      sideEffects: 'عام ممکنہ ضمنی اثرات',
      precautions: 'اہم حفاظتی احتیاطیں',
      route: 'استعمال کا طریقہ',
      dailySlots: 'روزانہ اوقات',
      symptoms: 'علامات',
      generalPrecautions: 'عام احتیاطیں',
      dietaryAdvice: 'غذائی مشورہ',
    },
    dashboard: {
      criticalConcernTitle: 'سنگین حفاظتی خطرہ دریافت ہوا',
      highRiskTitle: 'ادویات کا زیادہ خطرہ شناخت ہوا',
      reviewAlertsBtn: 'حفاظتی تنبیہات دیکھیں',
      diagnosisLabel: 'تشخیص',
      conditionsCount: 'امراض',
      activeMedications: 'جاری ادویات',
      prescribedCount: 'تجویز کردہ',
      moreMedications: 'مزید ادویات',
      nextFollowUp: 'اگلی ملاقات',
      asAdvised: 'ہدایت کے مطابق',
      testsAdvised: 'ٹیسٹ تجویز کیے گئے',
      trackTestsBtn: 'ٹیسٹ اور ملاقات دیکھیں',
      viewMedicineDetailsBtn: 'ادویات کی تفصیلات دیکھیں',
    },
    patient: {
      clinicalConfidence: 'طبی اعتماد',
      verified: 'تصدیق شدہ',
      documentedAllergies: 'درج شدہ الرجیز',
      noAllergiesRecorded: 'نسخے میں کوئی الرجی درج نہیں ہے۔ اگر آپ کو کسی دوا سے الرجی ہو تو ڈاکٹر کو بتائیں۔',
      existingMedications: 'پہلے سے جاری ادویات',
      noExistingMeds: 'نسخے میں کوئی درج نہیں۔',
      reviewRequiredFor: 'جائزہ درکار ہے',
      yearsOld: 'سال',
      notSpecified: 'درج نہیں',
      sampleCaseTag: 'نمونہ کیس',
    },
    guide: {
      subtitle: 'آپ کے نسخے کے مطابق سادہ اور واضح علاج کی ہدایات۔',
      dailyCareTitle: 'روزانہ علاج کا منصوبہ',
      dailyCareSubtitle: 'علاج کے دوران ان سادہ مراحل پر عمل کریں۔',
      morningRoutineTitle: '1. صبح کا معمول',
      morningRoutineDesc: 'خالی پیٹ والی ادویات ناشتے سے 30 تا 45 منٹ پہلے لیں۔ شوگر اور بلڈ پریشر کی گولیاں ہدایت کے مطابق لیں۔',
      afternoonRoutineTitle: '2. دوپہر اور پانی کا استعمال',
      afternoonRoutineDesc: 'دوپہر کی ادویات کھانے کے بعد لیں اور دن بھر مناسب پانی پئیں۔',
      nightRoutineTitle: '3. رات اور سوتے وقت',
      nightRoutineDesc: 'کولیسٹرول اور الرجی کی ادویات سونے سے پہلے پانی کے ساتھ لیں۔',
    },
    planner: {
      subtitle: 'روزانہ خوراکوں کا ریکارڈ رکھیں اور وقت پر دوا لیں۔',
      adherence: 'پابندی',
      totalDoses: 'کل خوراکیں',
      medicineSingular: 'دوا',
      medicinePlural: 'ادویات',
      takenAt: 'لینے کا وقت',
    },
    safety: {
      criticalRisks: 'سنگین خطرات',
      highRisks: 'زیادہ خطرات',
      moderateConcerns: 'درمیانے خدشات',
      incompleteChecks: 'نامکمل جانچ',
      protocolTitle: 'اہم حفاظتی اصول',
      protocolDesc: 'صرف خودکار تنبیہ کی بنیاد پر کوئی بھی دوا بند نہ کریں۔ کسی بھی سنگین تنبیہ کے بارے میں ڈاکٹر یا فارماسسٹ سے مشورہ کریں۔',
      medicinesInvolved: 'شامل ادویات',
      recommendedNextStep: 'تجویز کردہ اگلا قدم',
      evidenceReference: 'حوالہ',
    },
    investigations: {
      testsDone: 'ٹیسٹ مکمل',
      consultant: 'ڈاکٹر',
      department: 'شعبہ',
      scheduled: 'مقررہ تاریخ',
      dateNotSpecified: 'تاریخ درج نہیں',
      preVisitInstructions: 'ملاقات سے قبل ڈاکٹر کی ہدایات',
      diagnosticTestsTitle: 'طبی لیبارٹری ٹیسٹ',
      purposeLabel: 'مقصد',
      preparationLabel: 'تیاری',
      dueLabel: 'مقررہ تاریخ',
    },
    pdf: {
      reportTitle: 'مریض کے علاج اور ادویات کی حفاظتی رپورٹ',
      generatedOn: 'تیاری کی تاریخ',
      patientInfoSection: 'مریض اور نسخے کی تفصیلات',
      diagnosisSection: 'تشخیص اور وضاحت',
      medicinesSection: 'تجویز کردہ ادویات',
      safetySection: 'ادویات کی حفاظتی تنبیہات',
      timetableSection: 'روزانہ ادویات کا شیڈول',
      investigationsSection: 'تجویز کردہ لیبارٹری ٹیسٹ',
      followUpSection: 'ڈاکٹر سے اگلی ملاقات اور ہدایات',
      adviceSection: 'احتیاطیں اور غذائی مشورے',
      disclaimerSection: 'طبی دستبرداری',
      unavailable: 'درج نہیں',
      errorGenerating: 'PDF رپورٹ تیار نہیں ہو سکی۔',
    },
    severities: {
      critical: 'انتہائی خطرناک',
      high: 'زیادہ خطرہ',
      moderate: 'درمیانہ خطرہ',
      low: 'کم خطرہ',
      unverified: 'غیر تصدیق شدہ',
    },
    status: {
      taken: 'لے لی',
      pending: 'باقی',
      missed: 'چھوٹ گئی',
      completed: 'مکمل',
    },
    footer: {
      tagline: 'Cure — کثیر لسانی نسخہ اور ادویات کی حفاظتی معاونت',
      capabilities: '12 ہندوستانی زبانیں • حفاظتی انجن • OCR اور کثیر لسانی PDF رپورٹس',
    },
  }),
};

// Complete localized patient, medicine & review field labels for all remaining Indian languages
const EXTRA_FIELD_LABELS: Partial<Record<SupportedLanguage, {
  fullName: string;
  age: string;
  gender: string;
  rxDate: string;
  doctorName: string;
  hospitalName: string;
  uhid: string;
  genericName: string;
  brandName: string;
  foodLabel: string;
}>> = {
  ta: {
    fullName: 'நோயாளியின் பெயர்',
    age: 'வயது',
    gender: 'பாலினம்',
    rxDate: 'சீட்டு தேதி',
    doctorName: 'மருத்துவர் பெயர்',
    hospitalName: 'மருத்துவமனை / கிளினிக்',
    uhid: 'நோயாளி எண் (UHID)',
    genericName: 'மருந்தின் மூலப் பெயர்',
    brandName: 'பிராண்ட் பெயர்',
    foodLabel: 'உணவு அறிவுரை',
  },
  te: {
    fullName: 'రోగి పూర్తి పేరు',
    age: 'వయస్సు',
    gender: 'లింగం',
    rxDate: 'ప్రిస్క్రిప్షన్ తేదీ',
    doctorName: 'డాక్టర్ పేరు',
    hospitalName: 'ఆసుపత్రి / క్లినిక్',
    uhid: 'రోగి ఐడి (UHID)',
    genericName: 'మందు అసలు పేరు',
    brandName: 'బ్రాండ్ పేరు',
    foodLabel: 'ఆహార సూచన',
  },
  ml: {
    fullName: 'രോഗിയുടെ പേര്',
    age: 'വയസ്സ്',
    gender: 'ലിംഗം',
    rxDate: 'കുറിപ്പടി തീയതി',
    doctorName: 'ഡോക്ടറുടെ പേര്',
    hospitalName: 'ആശുപത്രി / ക്ലിനിക്',
    uhid: 'രോഗി ഐഡി (UHID)',
    genericName: 'മരുന്നിന്റെ അടിസ്ഥാന നാമം',
    brandName: 'ബ്രാൻഡ് നാമം',
    foodLabel: 'ഭക്ഷണ നിർദ്ദേശം',
  },
  mr: {
    fullName: 'रुग्णाचे पूर्ण नाव',
    age: 'वय',
    gender: 'लिंग',
    rxDate: 'प्रिस्क्रिप्शन तारीख',
    doctorName: 'डॉक्टरांचे नाव',
    hospitalName: 'रुग्णालय / क्लिनिक',
    uhid: 'रुग्ण क्रमांक (UHID)',
    genericName: 'औषधाचे मूळ नाव',
    brandName: 'ब्रँड नाव',
    foodLabel: 'आहार सूचना',
  },
  bn: {
    fullName: 'রোগীর সম্পূর্ণ নাম',
    age: 'বয়স',
    gender: 'লিঙ্গ',
    rxDate: 'প্রেসক্রিপশনের তারিখ',
    doctorName: 'ডাক্তারের নাম',
    hospitalName: 'হাসপাতাল / ক্লিনিক',
    uhid: 'রোগী আইডি (UHID)',
    genericName: 'ওষুধের মূল নাম',
    brandName: 'ব্র্যান্ড নাম',
    foodLabel: 'খাবার নির্দেশনা',
  },
  gu: {
    fullName: 'દર્દીનું પૂરું નામ',
    age: 'ઉંમર',
    gender: 'લિંગ',
    rxDate: 'પ્રિસ્ક્રિપ્શન તારીખ',
    doctorName: 'ડોક્ટરનું નામ',
    hospitalName: 'હોસ્પિટલ / ક્લિનિક',
    uhid: 'દર્દી આઈડી (UHID)',
    genericName: 'દવાનું મૂળ નામ',
    brandName: 'બ્રાન્ડ નામ',
    foodLabel: 'ભોજન સૂચના',
  },
  pa: {
    fullName: 'ਮਰੀਜ਼ ਦਾ ਪੂਰਾ ਨਾਮ',
    age: 'ਉਮਰ',
    gender: 'ਲਿੰਗ',
    rxDate: 'ਪਰਚੇ ਦੀ ਮਿਤੀ',
    doctorName: 'ਡਾਕਟਰ ਦਾ ਨਾਮ',
    hospitalName: 'ਹਸਪਤਾਲ / ਕਲੀਨਿਕ',
    uhid: 'ਮਰੀਜ਼ ਆਈਡੀ (UHID)',
    genericName: 'ਦਵਾਈ ਦਾ ਮੂਲ ਨਾਮ',
    brandName: 'ਬ੍ਰਾਂਡ ਨਾਮ',
    foodLabel: 'ਖਾਣੇ ਦੀ ਹਦਾਇਤ',
  },
  or: {
    fullName: 'ରୋଗୀଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ନାମ',
    age: 'ବୟସ',
    gender: 'ଲିଙ୍ଗ',
    rxDate: 'ପ୍ରେସକ୍ରିପସନ୍ ତାରିଖ',
    doctorName: 'ଡାକ୍ତରଙ୍କ ନାମ',
    hospitalName: 'ଡାକ୍ତରଖାନା / କ୍ଲିନିକ୍',
    uhid: 'ରୋଗୀ ଆଇଡି (UHID)',
    genericName: 'ଔଷଧର ମୂଳ ନାମ',
    brandName: 'ବ୍ରାଣ୍ଡ୍ ନାମ',
    foodLabel: 'ଖାଦ୍ୟ ନିର୍ଦ୍ଦେଶ',
  },
  ur: {
    fullName: 'مریض کا پورا نام',
    age: 'عمر',
    gender: 'جنس',
    rxDate: 'نسخے کی تاریخ',
    doctorName: 'ڈاکٹر کا نام',
    hospitalName: 'ہسپتال / کلینک',
    uhid: 'مریض شناخت (UHID)',
    genericName: 'دوا کا اصل نام',
    brandName: 'برانڈ کا نام',
    foodLabel: 'کھانے کی ہدایت',
  },
};

for (const [langCode, labels] of Object.entries(EXTRA_FIELD_LABELS)) {
  const dict = TRANSLATIONS[langCode as SupportedLanguage];
  if (dict && labels) {
    dict.patient.uhid = labels.uhid;
    dict.medicine.brandName = labels.brandName;
    dict.review.fullName = labels.fullName;
    dict.review.age = labels.age;
    dict.review.gender = labels.gender;
    dict.review.rxDate = labels.rxDate;
    dict.review.doctorName = labels.doctorName;
    dict.review.hospitalName = labels.hospitalName;
    dict.review.genericName = labels.genericName;
    dict.review.brandNameLabel = labels.brandName;
    dict.review.foodLabel = labels.foodLabel;
  }
}

