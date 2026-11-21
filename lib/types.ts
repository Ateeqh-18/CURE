export type SupportedLanguage =
  | 'en' // English
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'hi' // Hindi (हिन्दी)
  | 'ta' // Tamil (தமிழ்)
  | 'te' // Telugu (తెలుగు)
  | 'ml' // Malayalam (മലയാളം)
  | 'mr' // Marathi (मराठी)
  | 'bn' // Bengali (বাংলা)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'or' // Odia (ଓଡ଼ିଆ)
  | 'ur'; // Urdu (اردو)

export type ProviderMode = 'auto' | 'gemini' | 'ollama';
export type AiProviderId = 'gemini' | 'ollama';
export type ConfidenceCategory = 'high' | 'medium' | 'low';
export type AllergyStatus = 'documented' | 'none_documented' | 'unknown';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  dir: 'ltr' | 'rtl';
}

export interface PatientDetails {
  name: string;
  age?: number | string | null;
  gender?: 'Male' | 'Female' | 'Other' | string | null;
  uhid?: string | null;
  date?: string | null;
  doctorName?: string | null;
  doctorSpecialization?: string | null;
  hospitalName?: string | null;
  allergyStatus?: AllergyStatus;
  allergies: string[];
  existingMedications: string[];
  existingConditions?: string[];
  observations?: string[];
}

export type FoodInstruction =
  | 'Before food'
  | 'After food'
  | 'With food'
  | 'Empty stomach'
  | 'At bedtime'
  | 'As directed';

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Medicine {
  id: string;
  name: string; // Interpreted or generic display name
  originalWrittenName?: string | null; // Exact written text from prescription
  brandName?: string | null; // Original brand name if identifiable
  activeIngredient?: string | null; // Confidently identified active ingredient
  localizedName?: string; // Native-script localized/transliterated display name
  strength: string; // Exact strength + unit or "Not specified"
  dosage: string; // Dose per administration or "Not specified"
  dosageForm?: string | null; // Tablet, Capsule, Syrup, Inhaler, etc.
  frequency: string; // e.g., "1-0-1 (Twice daily)" or "Not specified"
  localizedFrequency?: string;
  route: string; // Oral, Topical, Inhalation, etc.
  localizedRoute?: string;
  duration: string; // e.g., "14 days", "Ongoing", or "Not specified"
  localizedDuration?: string;
  timing?: string | null;
  foodInstruction: FoodInstruction;
  localizedFoodInstruction?: string;
  timeSlots: TimeSlot[];
  timeRecommendations?: string;
  additionalInstructions?: string;
  purposeSimple: string;
  sideEffects: string[];
  precautions: string[];
  isUncertain?: boolean;
  confidenceCategory?: ConfidenceCategory;
  sourcePage?: number;
  supportingText?: string | null;
  uncertainFields?: string[];
  uncertainReason?: string;
  confidence?: number; // Only used for demo records; AI extractions use confidenceCategory
  imageUrl?: string;
}

export type AlertSeverity = 'critical' | 'high' | 'moderate' | 'low' | 'unverified';

export type AlertType =
  | 'drug_interaction'
  | 'duplicate_ingredient'
  | 'dosage_inconsistency'
  | 'allergy_conflict'
  | 'missing_info'
  | 'existing_med_conflict'
  | 'check_uncompleted';

export interface SafetyAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  medicinesInvolved: string[];
  title: string;
  description: string;
  recommendation: string;
  source: string;
}

export interface DoseStatusEntry {
  status: 'pending' | 'taken' | 'missed';
  takenAt?: string;
}

export interface ScheduleItem {
  id: string;
  medicineId: string;
  medicineName: string;
  localizedMedicineName?: string;
  brandName?: string | null;
  dosage: string;
  slot: TimeSlot;
  time: string;
  foodInstruction: FoodInstruction;
  localizedFoodInstruction?: string;
  status: 'pending' | 'taken' | 'missed';
  takenAt?: string;
  isAmbiguous?: boolean;
  notes?: string;
}

export interface Investigation {
  id: string;
  name: string;
  originalName?: string;
  category?: 'lab' | 'imaging' | 'scheduled_test' | 'other';
  purpose: string;
  instructions?: string | null;
  dueDate?: string | null;
  sourcePage?: number;
  confidenceCategory?: ConfidenceCategory;
  needsVerification?: boolean;
  completed: boolean;
}

export interface FollowUp {
  doctorName?: string | null;
  department?: string | null;
  appointmentDate?: string | null;
  instructions: string;
  isCompleted: boolean;
  isDateAmbiguous?: boolean;
  sourcePage?: number;
}

export interface ProviderAttempt {
  provider: AiProviderId;
  model: string;
  succeeded: boolean;
  durationMs: number;
  error?: string;
}

export interface AiProcessingMeta {
  provider: AiProviderId;
  providerDisplayName: 'Gemini Cloud' | 'Local Qwen AI';
  model: string;
  requestedMode: ProviderMode;
  pagesProcessed: number;
  durationMs: number;
  inputKind: 'image' | 'pdf' | 'text';
  overallConfidence: ConfidenceCategory;
  fallbackUsed: boolean;
  attempts: ProviderAttempt[];
  warnings: string[];
}

export interface TranslationMeta {
  language: SupportedLanguage;
  provider: 'identity' | 'gemini_ai' | 'local_clinical_lexicon' | 'failed_fallback';
  fallbackUsed: boolean;
  warning?: string;
  translatedAt: string;
}

export interface PrescriptionData {
  id: string;
  sourceLanguage?: string;
  originalText?: string;
  documentUrl?: string;
  isDemo?: boolean;
  patientDetails: PatientDetails;
  diagnosis: string[];
  localizedDiagnosis?: string[];
  diagnosisSimplified: string;
  symptoms: string[];
  medicines: Medicine[];
  investigations: Investigation[];
  followUp: FollowUp;
  generalPrecautions: string[];
  dietaryAdvice: string[];
  extractionConfidence?: number; // Deprecated for live AI; prefer overallConfidenceCategory
  overallConfidenceCategory?: ConfidenceCategory;
  uncertainFields: string[];
  aiMeta?: AiProcessingMeta;
  translationMeta?: TranslationMeta;
  createdAt: string;
}
