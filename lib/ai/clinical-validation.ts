import {
  AiProcessingMeta,
  ConfidenceCategory,
  FoodInstruction,
  Investigation,
  Medicine,
  PrescriptionData,
  ProviderAttempt,
  ProviderMode,
  TimeSlot,
} from '@/lib/types';
import { DRUG_DATABASE, DrugInfo } from '@/lib/drug-database';
import {
  ClinicalExtractionPayload,
  ClinicalExtractionResult,
  ClinicalExtractionSchema,
  ExtractedUncertainField,
} from './clinical-extraction-schema';

/**
 * Extracts raw JSON from a model response (handles accidental markdown fences or leading prose).
 */
export function extractJsonFromModelText(raw: string): unknown {
  const trimmed = raw.trim();
  // Strip ```json ... ``` fences if present
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed;

  try {
    return JSON.parse(candidate);
  } catch {
    // Attempt to isolate outermost JSON object
    const firstBrace = candidate.indexOf('{');
    const lastBrace = candidate.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
    }
    throw new Error('Model returned malformed JSON that could not be parsed.');
  }
}

/**
 * Validates and normalizes raw AI JSON against ClinicalExtractionSchema,
 * enforcing clinical safety invariants (never fabricating missing doses/strengths/allergies).
 */
export function validateAndNormalizeExtraction(
  rawJson: unknown,
  meta: {
    provider: 'gemini' | 'ollama';
    model: string;
    pagesProcessed: number;
    durationMs: number;
    inputKind: 'image' | 'pdf' | 'text';
  }
): ClinicalExtractionResult {
  const parsed = ClinicalExtractionSchema.safeParse(rawJson);
  if (!parsed.success) {
    const issueSummary = parsed.error.issues
      .slice(0, 4)
      .map((i) => `${i.path.join('.') || 'root'}: ${i.message}`)
      .join('; ');
    throw new Error(`Clinical extraction schema validation failed: ${issueSummary}`);
  }

  const data: ClinicalExtractionPayload = parsed.data;
  const uncertainFields: ExtractedUncertainField[] = [...data.uncertainFields];

  // Enforce medication safety & uncertainty invariants
  const normalizedMeds = data.medications.map((med, idx) => {
    const missingCritical: string[] = [];
    if (!med.interpretedName && !med.genericName && !med.brandName) {
      missingCritical.push('medicine name');
    }
    if (!med.strength || !med.strength.trim()) missingCritical.push('strength');
    if (!med.dose || !med.dose.trim()) missingCritical.push('dosage');
    if (!med.frequency || !med.frequency.trim()) missingCritical.push('frequency');
    if (!med.duration || !med.duration.trim()) missingCritical.push('duration');

    const isLowOrMedium = med.confidence === 'low' || med.confidence === 'medium';
    const needsVerification =
      med.needsVerification || isLowOrMedium || missingCritical.length > 0;

    let verificationReason = med.verificationReason || null;
    if (needsVerification && !verificationReason) {
      const reasons: string[] = [];
      if (med.confidence === 'low') reasons.push('Low reading confidence (handwriting/blur)');
      if (missingCritical.length > 0) reasons.push(`Missing or unclear: ${missingCritical.join(', ')}`);
      verificationReason = reasons.join('; ') || 'Manual clinician/patient verification recommended.';
    }

    if (needsVerification) {
      const existsAlready = uncertainFields.some(
        (u) => u.fieldPath === `medications[${idx}]` || u.fieldPath.startsWith(`medications[${idx}].`)
      );
      if (!existsAlready) {
        uncertainFields.push({
          fieldPath: `medications[${idx}]`,
          value: med.originalText || med.interpretedName || null,
          confidence: med.confidence,
          sourcePage: med.sourcePage || 1,
          supportingText: med.supportingText || med.originalText || null,
          needsVerification: true,
          reason: verificationReason,
        });
      }
    }

    return {
      ...med,
      originalText: med.originalText || med.interpretedName || med.brandName || '',
      needsVerification,
      verificationReason,
    };
  });

  // Compute honest overall categorical confidence (never a fake calibrated %)
  let overallConfidence: ConfidenceCategory = 'high';
  if (
    normalizedMeds.length === 0 ||
    normalizedMeds.some((m) => m.confidence === 'low') ||
    uncertainFields.some((u) => u.confidence === 'low')
  ) {
    overallConfidence = 'low';
  } else if (
    normalizedMeds.some((m) => m.confidence === 'medium' || m.needsVerification) ||
    uncertainFields.length > 0
  ) {
    overallConfidence = 'medium';
  }

  // Enforce allergy status consistency
  let allergyStatus = data.allergies.status;
  const allergyItems = data.allergies.items.map((s) => s.trim()).filter(Boolean);
  if (allergyItems.length > 0) {
    allergyStatus = 'documented';
  }

  return {
    ...data,
    allergies: {
      status: allergyStatus,
      items: allergyItems,
    },
    medications: normalizedMeds,
    uncertainFields,
    processingMetadata: {
      provider: meta.provider,
      model: meta.model,
      pagesProcessed: meta.pagesProcessed,
      durationMs: meta.durationMs,
      inputKind: meta.inputKind,
      overallConfidence,
    },
  };
}

/**
 * Merges multiple page-batch ClinicalExtractionResult objects (used for multi-page Ollama PDFs)
 * while preserving exact sourcePage references and deduplicating cleanly.
 */
export function mergeMultiPageExtractions(
  batchResults: ClinicalExtractionResult[],
  meta: {
    provider: 'gemini' | 'ollama';
    model: string;
    totalPages: number;
    durationMs: number;
  }
): ClinicalExtractionResult {
  if (batchResults.length === 1) {
    return {
      ...batchResults[0],
      processingMetadata: {
        ...batchResults[0].processingMetadata,
        pagesProcessed: meta.totalPages,
        durationMs: meta.durationMs,
      },
    };
  }

  const pickFirst = <T>(getter: (r: ClinicalExtractionResult) => T | null | undefined): T | null => {
    for (const r of batchResults) {
      const v = getter(r);
      if (v !== null && v !== undefined && String(v).trim() !== '') return v;
    }
    return null;
  };

  const uniqueStrings = (getter: (r: ClinicalExtractionResult) => string[]): string[] => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const r of batchResults) {
      for (const s of getter(r)) {
        const clean = s.trim();
        if (clean && !seen.has(clean.toLowerCase())) {
          seen.add(clean.toLowerCase());
          out.push(clean);
        }
      }
    }
    return out;
  };

  const allAllergyItems = uniqueStrings((r) => r.allergies.items);
  let allergyStatus: 'documented' | 'none_documented' | 'unknown' = 'unknown';
  if (allAllergyItems.length > 0) allergyStatus = 'documented';
  else if (batchResults.some((r) => r.allergies.status === 'none_documented')) {
    allergyStatus = 'none_documented';
  }

  const medications = batchResults.flatMap((r) => r.medications);
  const investigations = batchResults.flatMap((r) => r.investigations);
  const followUp = batchResults.flatMap((r) => r.followUp);
  const uncertainFields = batchResults.flatMap((r) => r.uncertainFields);
  const summaries = batchResults
    .map((r) => r.diagnosisSummary)
    .filter((s): s is string => Boolean(s && s.trim()));

  let overallConfidence: ConfidenceCategory = 'high';
  if (batchResults.some((r) => r.processingMetadata.overallConfidence === 'low')) {
    overallConfidence = 'low';
  } else if (batchResults.some((r) => r.processingMetadata.overallConfidence === 'medium')) {
    overallConfidence = 'medium';
  }

  return {
    patient: {
      name: pickFirst((r) => r.patient.name),
      age: pickFirst((r) => r.patient.age),
      sex: pickFirst((r) => r.patient.sex),
      patientId: pickFirst((r) => r.patient.patientId),
      prescriptionDate: pickFirst((r) => r.patient.prescriptionDate),
      hospitalOrClinic: pickFirst((r) => r.patient.hospitalOrClinic),
      doctorName: pickFirst((r) => r.patient.doctorName),
      doctorSpecialization: pickFirst((r) => r.patient.doctorSpecialization),
    },
    diagnosis: uniqueStrings((r) => r.diagnosis),
    diagnosisSummary: summaries.length > 0 ? summaries.join(' ') : null,
    symptoms: uniqueStrings((r) => r.symptoms),
    medicalHistory: uniqueStrings((r) => r.medicalHistory),
    allergies: {
      status: allergyStatus,
      items: allAllergyItems,
    },
    existingMedications: uniqueStrings((r) => r.existingMedications),
    observations: uniqueStrings((r) => r.observations),
    medications,
    investigations,
    followUp,
    additionalNotes: uniqueStrings((r) => r.additionalNotes),
    dietaryAdvice: uniqueStrings((r) => r.dietaryAdvice),
    uncertainFields,
    sourceLanguageDetected: pickFirst((r) => r.sourceLanguageDetected) || undefined,
    processingMetadata: {
      provider: meta.provider,
      model: meta.model,
      pagesProcessed: meta.totalPages,
      durationMs: meta.durationMs,
      inputKind: 'pdf',
      overallConfidence,
    },
  };
}

function lookupDrugReference(medName: string, brandName?: string | null): DrugInfo | null {
  const haystack = `${medName} ${brandName || ''}`.toLowerCase();
  for (const [key, drug] of Object.entries(DRUG_DATABASE)) {
    if (haystack.includes(key) || haystack.includes(drug.genericName.toLowerCase())) {
      return drug;
    }
    for (const b of drug.brandNames) {
      const clean = b.replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase();
      if (clean.length >= 3 && haystack.includes(clean)) return drug;
    }
  }
  return null;
}

function mapFrequencyToSafeSlots(
  freq: string | null,
  timing: string | null,
  needsVerification: boolean
): TimeSlot[] {
  // Clinical Rule: Never generate a confident schedule from an ambiguous or SOS/missing frequency
  const combined = `${freq || ''} ${timing || ''}`.toLowerCase().trim();
  if (!combined || /\b(sos|prn|as needed|unclear|ambiguous|unspecified)\b/.test(combined)) {
    return [];
  }

  const numMatch = combined.match(/\b([012])\s*[-–/]\s*([012])\s*[-–/]\s*([012])(?:\s*[-–/]\s*([012]))?\b/);
  if (numMatch) {
    const slots: TimeSlot[] = [];
    if (parseInt(numMatch[1], 10) > 0) slots.push('morning');
    if (parseInt(numMatch[2], 10) > 0) slots.push('afternoon');
    if (numMatch[4] !== undefined) {
      if (parseInt(numMatch[3], 10) > 0) slots.push('evening');
      if (parseInt(numMatch[4], 10) > 0) slots.push('night');
    } else if (parseInt(numMatch[3], 10) > 0) {
      slots.push('night');
    }
    return slots;
  }

  if (/\b(qid|four times|4 times)\b/.test(combined)) return ['morning', 'afternoon', 'evening', 'night'];
  if (/\b(tds|tid|thrice|three times|3 times)\b/.test(combined)) return ['morning', 'afternoon', 'night'];
  if (/\b(bd|bid|twice|two times|2 times|morning and night)\b/.test(combined)) return ['morning', 'night'];
  if (/\b(hs|bedtime|night|at night)\b/.test(combined)) return ['night'];
  if (/\b(afternoon|lunch)\b/.test(combined)) return ['afternoon'];
  if (/\b(od|once daily|once a day|morning)\b/.test(combined)) return ['morning'];

  // If frequency couldn't be parsed unambiguously, return empty slots for manual confirmation
  return needsVerification ? [] : [];
}

function mapFoodInstruction(raw: string | null): FoodInstruction {
  const lower = (raw || '').toLowerCase();
  if (/empty stomach|fasting/.test(lower)) return 'Empty stomach';
  if (/before food|before meal|before breakfast|\bac\b/.test(lower)) return 'Before food';
  if (/after food|after meal|after breakfast|after dinner|\bpc\b/.test(lower)) return 'After food';
  if (/with food|with meal|with milk/.test(lower)) return 'With food';
  if (/bedtime|before sleep|\bhs\b/.test(lower)) return 'At bedtime';
  return 'As directed';
}

/**
 * Adapts the unified ClinicalExtractionResult into Cure's canonical PrescriptionData
 * so every downstream module (Review, Dashboard, Safety Engine, Planner, Investigations,
 * 12-Language Translator, PDF Export) consumes it seamlessly without data loss.
 */
export function clinicalResultToPrescriptionData(
  result: ClinicalExtractionResult,
  options: {
    requestedMode: ProviderMode;
    fallbackUsed: boolean;
    attempts: ProviderAttempt[];
    warnings?: string[];
    patientAllergiesOverride?: string[];
    patientExistingMedsOverride?: string[];
    originalText?: string;
  }
): PrescriptionData {
  const providerDisplayName: 'Gemini Cloud' | 'Local Qwen AI' =
    result.processingMetadata.provider === 'gemini' ? 'Gemini Cloud' : 'Local Qwen AI';

  const aiMeta: AiProcessingMeta = {
    provider: result.processingMetadata.provider,
    providerDisplayName,
    model: result.processingMetadata.model,
    requestedMode: options.requestedMode,
    pagesProcessed: result.processingMetadata.pagesProcessed,
    durationMs: result.processingMetadata.durationMs,
    inputKind: result.processingMetadata.inputKind,
    overallConfidence: result.processingMetadata.overallConfidence,
    fallbackUsed: options.fallbackUsed,
    attempts: options.attempts,
    warnings: options.warnings || [],
  };

  const mergedAllergies = Array.from(
    new Set([...(result.allergies.items || []), ...(options.patientAllergiesOverride || [])])
  );
  const allergyStatus =
    mergedAllergies.length > 0 ? 'documented' : result.allergies.status;

  const mergedExistingMeds = Array.from(
    new Set([...(result.existingMedications || []), ...(options.patientExistingMedsOverride || [])])
  );

  const medicines: Medicine[] = result.medications.map((m, idx) => {
    const primaryName =
      m.interpretedName || m.genericName || m.brandName || m.originalText || 'Unreadable Medicine';
    const refDrug = lookupDrugReference(primaryName, m.brandName);
    const uncertainFields: string[] = [];
    if (!m.interpretedName && !m.genericName) uncertainFields.push('medicine name');
    if (!m.strength) uncertainFields.push('strength');
    if (!m.dose) uncertainFields.push('dosage');
    if (!m.frequency) uncertainFields.push('frequency');
    if (!m.duration) uncertainFields.push('duration');

    const timeSlots = mapFrequencyToSafeSlots(m.frequency, m.timing, m.needsVerification);

    return {
      id: `med-ai-${idx + 1}`,
      name: m.genericName || m.interpretedName || m.originalText || 'Unreadable Medicine',
      originalWrittenName: m.originalText || null,
      brandName: m.brandName || null,
      activeIngredient: m.activeIngredient || m.genericName || null,
      strength: m.strength || 'Not specified',
      dosage: m.dose || 'Not specified',
      dosageForm: m.form || null,
      frequency: m.frequency || 'Not specified',
      route: m.route || 'Oral',
      duration: m.duration || 'Not specified',
      timing: m.timing || null,
      foodInstruction: mapFoodInstruction(m.foodInstructions),
      timeSlots,
      additionalInstructions: m.specialInstructions || undefined,
      purposeSimple: refDrug
        ? refDrug.primaryPurpose
        : 'Prescribed medication — confirm exact purpose with your doctor or pharmacist.',
      sideEffects: refDrug
        ? refDrug.commonSideEffects
        : ['Reference data unavailable — confirm possible side effects with your pharmacist.'],
      precautions: refDrug
        ? refDrug.precautions
        : ['Confirm exact dosage, timing, and precautions with your doctor before taking.'],
      isUncertain: m.needsVerification,
      confidenceCategory: m.confidence,
      sourcePage: m.sourcePage || 1,
      supportingText: m.supportingText || m.originalText || null,
      uncertainFields,
      uncertainReason: m.verificationReason || undefined,
    };
  });

  const investigations: Investigation[] = result.investigations.map((inv, idx) => ({
    id: `inv-ai-${idx + 1}`,
    name: inv.name,
    originalName: inv.name,
    category: inv.category,
    purpose: inv.purpose || 'Advised diagnostic investigation from prescription.',
    instructions: inv.instructions || null,
    dueDate: inv.scheduledDate || null,
    sourcePage: inv.sourcePage || 1,
    confidenceCategory: inv.confidence,
    needsVerification: inv.needsVerification,
    completed: false,
  }));

  const firstFollowUp = result.followUp[0];
  const combinedFollowUpInstructions = result.followUp
    .map((f) => [f.date ? `Date: ${f.date}` : null, f.doctorOrDepartment, f.instructions].filter(Boolean).join(' — '))
    .filter(Boolean)
    .join('; ');

  const uncertainLabels = Array.from(
    new Set([
      ...result.uncertainFields.map(
        (u) =>
          `${u.fieldPath}${u.sourcePage ? ` (Page ${u.sourcePage})` : ''}: ${u.reason || 'Needs verification'}`
      ),
      ...(options.warnings || []),
    ])
  );

  return {
    id: `rx-ai-${Date.now()}`,
    sourceLanguage: result.sourceLanguageDetected || undefined,
    originalText: options.originalText,
    isDemo: false,
    patientDetails: {
      name: result.patient.name || 'Not specified on document',
      age: result.patient.age ?? null,
      gender: result.patient.sex ?? null,
      uhid: result.patient.patientId ?? null,
      date: result.patient.prescriptionDate ?? null,
      doctorName: result.patient.doctorName ?? null,
      doctorSpecialization: result.patient.doctorSpecialization ?? null,
      hospitalName: result.patient.hospitalOrClinic ?? null,
      allergyStatus,
      allergies: mergedAllergies,
      existingMedications: mergedExistingMeds,
      existingConditions: result.medicalHistory || [],
      observations: result.observations || [],
    },
    diagnosis: result.diagnosis || [],
    diagnosisSimplified:
      result.diagnosisSummary ||
      (result.diagnosis.length > 0
        ? `Documented diagnosis: ${result.diagnosis.join(', ')}. Follow your prescribed plan and review any flagged items with your doctor.`
        : 'No explicit diagnosis was documented on this prescription. Confirm with your doctor.'),
    symptoms: result.symptoms || [],
    medicines,
    investigations,
    followUp: {
      doctorName: firstFollowUp?.doctorOrDepartment || result.patient.doctorName || null,
      department: result.patient.doctorSpecialization || null,
      appointmentDate: firstFollowUp?.date || null,
      instructions:
        combinedFollowUpInstructions || 'No specific follow-up instructions were found on this document.',
      isCompleted: false,
      isDateAmbiguous: !firstFollowUp?.date,
      sourcePage: firstFollowUp?.sourcePage || 1,
    },
    generalPrecautions: result.additionalNotes || [],
    dietaryAdvice: result.dietaryAdvice || [],
    overallConfidenceCategory: result.processingMetadata.overallConfidence,
    uncertainFields: uncertainLabels,
    aiMeta,
    createdAt: new Date().toISOString(),
  };
}
