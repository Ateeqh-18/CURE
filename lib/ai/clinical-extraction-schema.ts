import { z } from 'zod';

export const ConfidenceCategorySchema = z.enum(['high', 'medium', 'low']).catch('low');

export const ExtractedFieldMetaSchema = z.object({
  fieldPath: z.string(),
  value: z.string().nullable().optional(),
  confidence: ConfidenceCategorySchema,
  sourcePage: z.number().int().min(1).default(1),
  supportingText: z.string().nullable().optional(),
  needsVerification: z.boolean().default(true),
  reason: z.string().nullable().optional(),
});

export const PatientExtractionSchema = z.object({
  name: z.string().nullable().default(null),
  age: z.union([z.number(), z.string()]).nullable().default(null),
  sex: z.string().nullable().default(null),
  patientId: z.string().nullable().default(null),
  prescriptionDate: z.string().nullable().default(null),
  hospitalOrClinic: z.string().nullable().default(null),
  doctorName: z.string().nullable().default(null),
  doctorSpecialization: z.string().nullable().default(null),
});

export const AllergyExtractionSchema = z.object({
  status: z.enum(['documented', 'none_documented', 'unknown']).catch('unknown'),
  items: z.array(z.string()).default([]),
});

export const MedicationExtractionSchema = z.object({
  originalText: z.string().default(''),
  interpretedName: z.string().nullable().default(null),
  genericName: z.string().nullable().default(null),
  brandName: z.string().nullable().default(null),
  activeIngredient: z.string().nullable().default(null),
  strength: z.string().nullable().default(null),
  dose: z.string().nullable().default(null),
  form: z.string().nullable().default(null),
  route: z.string().nullable().default(null),
  frequency: z.string().nullable().default(null),
  duration: z.string().nullable().default(null),
  timing: z.string().nullable().default(null),
  foodInstructions: z.string().nullable().default(null),
  specialInstructions: z.string().nullable().default(null),
  confidence: ConfidenceCategorySchema,
  needsVerification: z.boolean().default(true),
  verificationReason: z.string().nullable().optional(),
  sourcePage: z.number().int().min(1).default(1),
  supportingText: z.string().nullable().optional(),
});

export const InvestigationExtractionSchema = z.object({
  name: z.string(),
  category: z.enum(['lab', 'imaging', 'scheduled_test', 'other']).catch('other'),
  purpose: z.string().nullable().optional(),
  instructions: z.string().nullable().optional(),
  scheduledDate: z.string().nullable().optional(),
  confidence: ConfidenceCategorySchema,
  needsVerification: z.boolean().default(false),
  sourcePage: z.number().int().min(1).default(1),
});

export const FollowUpExtractionSchema = z.object({
  date: z.string().nullable().default(null),
  doctorOrDepartment: z.string().nullable().default(null),
  instructions: z.string().nullable().default(null),
  confidence: ConfidenceCategorySchema,
  needsVerification: z.boolean().default(false),
  sourcePage: z.number().int().min(1).default(1),
});

export const ProcessingMetadataSchema = z.object({
  provider: z.enum(['gemini', 'ollama']),
  model: z.string(),
  pagesProcessed: z.number().int().min(1).default(1),
  durationMs: z.number().nonnegative().default(0),
  inputKind: z.enum(['image', 'pdf', 'text']).default('image'),
  overallConfidence: ConfidenceCategorySchema,
});

export const ClinicalExtractionSchema = z.object({
  patient: PatientExtractionSchema.default({
    name: null,
    age: null,
    sex: null,
    patientId: null,
    prescriptionDate: null,
    hospitalOrClinic: null,
    doctorName: null,
    doctorSpecialization: null,
  }),
  diagnosis: z.array(z.string()).default([]),
  diagnosisSummary: z.string().nullable().default(null),
  symptoms: z.array(z.string()).default([]),
  medicalHistory: z.array(z.string()).default([]),
  allergies: AllergyExtractionSchema.default({ status: 'unknown', items: [] }),
  existingMedications: z.array(z.string()).default([]),
  observations: z.array(z.string()).default([]),
  medications: z.array(MedicationExtractionSchema).default([]),
  investigations: z.array(InvestigationExtractionSchema).default([]),
  followUp: z.array(FollowUpExtractionSchema).default([]),
  additionalNotes: z.array(z.string()).default([]),
  dietaryAdvice: z.array(z.string()).default([]),
  uncertainFields: z.array(ExtractedFieldMetaSchema).default([]),
  sourceLanguageDetected: z.string().nullable().optional(),
  processingMetadata: ProcessingMetadataSchema.optional(),
});

export type ClinicalExtractionPayload = z.infer<typeof ClinicalExtractionSchema>;
export type ExtractedMedication = z.infer<typeof MedicationExtractionSchema>;
export type ExtractedInvestigation = z.infer<typeof InvestigationExtractionSchema>;
export type ExtractedFollowUp = z.infer<typeof FollowUpExtractionSchema>;
export type ExtractedUncertainField = z.infer<typeof ExtractedFieldMetaSchema>;

export interface ClinicalExtractionResult extends ClinicalExtractionPayload {
  processingMetadata: z.infer<typeof ProcessingMetadataSchema>;
}

const SHARED_CLINICAL_RULES = `
CRITICAL CLINICAL SAFETY RULES (CLINICAL CORRECTNESS IS MORE IMPORTANT THAN COMPLETENESS):
1. NEVER guess illegible or partially unreadable medicine names. Retain the exact visible writing in "originalText", set "interpretedName" to null if uncertain, set "confidence": "low", and set "needsVerification": true.
2. NEVER infer or invent missing strength, dosage, route, frequency, or duration. Leave missing fields strictly as null.
3. NEVER invent follow-up dates, patient age, sex, or laboratory tests that do not appear in the document.
4. NEVER convert an ambiguous abbreviation (e.g., unclear scribble or "SOS" / "PRN") into a definite fixed morning/night schedule.
5. ALWAYS preserve the exact original written medicine text in "originalText" alongside "interpretedName".
6. Distinguish "brandName" (e.g., "Dolo 650", "Glycomet 500 SR", "Augmentin 625") from "genericName" and "activeIngredient" (only fill genericName/activeIngredient when confidently identified).
7. Keep unknown allergies strictly separate from explicitly documented absence of allergies:
   - If allergens are written (e.g., "Penicillin"), set allergies.status = "documented" and list them in allergies.items.
   - If the document explicitly writes "NKDA", "No known drug allergies", or "Allergies: None", set allergies.status = "none_documented" and items = [].
   - If allergies are not mentioned anywhere, set allergies.status = "unknown" and items = [].
8. Preserve all numbers and units EXACTLY as written (e.g., "500 mg", "650 mg", "40 mg", "1 tablet", "1-0-1", "5 days").
9. Do NOT manufacture numeric confidence percentages. Use ONLY categorical confidence: "high", "medium", or "low".
10. Record every ambiguous, smudged, illegible, or missing safety-critical field inside "uncertainFields" with sourcePage and reason.
`;

const JSON_SHAPE_SPEC = `
Return ONLY a single valid JSON object (no markdown fences, no commentary) matching this exact schema:
{
  "patient": {
    "name": string | null,
    "age": number | string | null,
    "sex": string | null,
    "patientId": string | null,
    "prescriptionDate": string | null,
    "hospitalOrClinic": string | null,
    "doctorName": string | null,
    "doctorSpecialization": string | null
  },
  "diagnosis": string[],
  "diagnosisSummary": string | null,
  "symptoms": string[],
  "medicalHistory": string[],
  "allergies": {
    "status": "documented" | "none_documented" | "unknown",
    "items": string[]
  },
  "existingMedications": string[],
  "observations": string[],
  "medications": [
    {
      "originalText": string,
      "interpretedName": string | null,
      "genericName": string | null,
      "brandName": string | null,
      "activeIngredient": string | null,
      "strength": string | null,
      "dose": string | null,
      "form": string | null,
      "route": string | null,
      "frequency": string | null,
      "duration": string | null,
      "timing": string | null,
      "foodInstructions": string | null,
      "specialInstructions": string | null,
      "confidence": "high" | "medium" | "low",
      "needsVerification": boolean,
      "verificationReason": string | null,
      "sourcePage": number,
      "supportingText": string | null
    }
  ],
  "investigations": [
    {
      "name": string,
      "category": "lab" | "imaging" | "scheduled_test" | "other",
      "purpose": string | null,
      "instructions": string | null,
      "scheduledDate": string | null,
      "confidence": "high" | "medium" | "low",
      "needsVerification": boolean,
      "sourcePage": number
    }
  ],
  "followUp": [
    {
      "date": string | null,
      "doctorOrDepartment": string | null,
      "instructions": string | null,
      "confidence": "high" | "medium" | "low",
      "needsVerification": boolean,
      "sourcePage": number
    }
  ],
  "additionalNotes": string[],
  "dietaryAdvice": string[],
  "uncertainFields": [
    {
      "fieldPath": string,
      "value": string | null,
      "confidence": "high" | "medium" | "low",
      "sourcePage": number,
      "supportingText": string | null,
      "needsVerification": true,
      "reason": string
    }
  ],
  "sourceLanguageDetected": string | null
}
`;

export function buildVisionClinicalPrompt(pageContext?: {
  pageNumbers: number[];
  totalPages: number;
}): string {
  const pageNote = pageContext
    ? `You are analyzing page(s) ${pageContext.pageNumbers.join(', ')} of a ${pageContext.totalPages}-page medical document. Assign the exact "sourcePage" number for every medication, investigation, follow-up, and uncertainField.`
    : `Analyze all pages of the attached medical prescription or hospital discharge summary and assign accurate "sourcePage" numbers (starting at 1).`;

  return `You are a senior clinical pharmacist and multimodal medical document understanding specialist for Indian healthcare prescriptions and hospital discharge summaries (including handwritten doctor prescriptions, printed clinic pads, and mixed English/regional Indian language instructions).

${pageNote}

Understand the visual layout, columns, Rx grouping, dosage grids (e.g., 1-0-1, 1-1-1, OD, BD, TDS, HS, SOS), food cues (AC/PC, before/after food, empty stomach, regional cues), investigations, and follow-up sections directly from the document image(s).
${SHARED_CLINICAL_RULES}
${JSON_SHAPE_SPEC}`;
}

export function buildTypedTextClinicalPrompt(typedText: string): string {
  return `You are a senior clinical pharmacist extracting structured clinical information from manually typed prescription notes for an Indian patient.
${SHARED_CLINICAL_RULES}
${JSON_SHAPE_SPEC}

Typed Prescription Text:
"""
${typedText}
"""`;
}
