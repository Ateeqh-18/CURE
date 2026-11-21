import { AiProviderId, PrescriptionData, ProviderAttempt, ProviderMode } from '@/lib/types';
import { ClinicalExtractionResult } from './clinical-extraction-schema';
import { clinicalResultToPrescriptionData } from './clinical-validation';
import { prepareUploadedDocument } from './document-prep';
import { GeminiVisionProvider } from './gemini-provider';
import { OllamaVisionProvider } from './ollama-provider';
import { PrescriptionProcessInput, ProviderHealthStatus } from './provider-interface';

export interface SanitizedDiagnosticRecord {
  timestamp: string;
  requestedMode: ProviderMode;
  activeProvider: AiProviderId | null;
  model: string | null;
  succeeded: boolean;
  durationMs: number;
  pagesProcessed: number;
  extractedMedicationCount: number;
  extractedFieldCount: number;
  uncertainFieldCount: number;
  attempts: ProviderAttempt[];
  error?: string;
}

export interface ProviderManagerStatus {
  gemini: ProviderHealthStatus;
  ollama: ProviderHealthStatus;
  recommendedActiveProvider: AiProviderId | 'none';
  lastRun: SanitizedDiagnosticRecord | null;
}

export interface ProcessPrescriptionOutput {
  success: boolean;
  extraction?: ClinicalExtractionResult;
  prescription?: PrescriptionData;
  attempts: ProviderAttempt[];
  warnings: string[];
  error?: string;
  diagnostic: SanitizedDiagnosticRecord;
}

// Sanitized in-memory telemetry for /ai-diagnostics (NEVER stores API keys or patient PHI)
let lastSanitizedRun: SanitizedDiagnosticRecord | null = null;

function countExtractedFields(res: ClinicalExtractionResult): number {
  let count = 0;
  for (const val of Object.values(res.patient)) {
    if (val !== null && val !== undefined && String(val).trim() !== '') count++;
  }
  count += res.diagnosis.length;
  count += res.symptoms.length;
  count += res.allergies.items.length;
  count += res.existingMedications.length;
  count += res.medications.length;
  count += res.investigations.length;
  count += res.followUp.length;
  return count;
}

export class AiProviderManager {
  private readonly gemini = new GeminiVisionProvider();
  private readonly ollama = new OllamaVisionProvider();

  async getAllStatuses(options: { liveGeminiCheck?: boolean } = {}): Promise<ProviderManagerStatus> {
    const [geminiStatus, ollamaStatus] = await Promise.all([
      this.gemini.getStatus({ liveCheck: Boolean(options.liveGeminiCheck) }),
      this.ollama.getStatus(),
    ]);

    let recommendedActiveProvider: AiProviderId | 'none' = 'none';
    if (geminiStatus.ready) recommendedActiveProvider = 'gemini';
    else if (ollamaStatus.ready) recommendedActiveProvider = 'ollama';

    return {
      gemini: geminiStatus,
      ollama: ollamaStatus,
      recommendedActiveProvider,
      lastRun: lastSanitizedRun,
    };
  }

  async process(params: {
    mode: ProviderMode;
    fileBuffer?: Buffer;
    fileName?: string;
    mimeType?: string;
    typedText?: string;
    patientAllergies?: string[];
    patientExistingMeds?: string[];
    timeoutMs?: number;
  }): Promise<ProcessPrescriptionOutput> {
    const overallStart = Date.now();
    const mode: ProviderMode = params.mode || 'auto';
    const attempts: ProviderAttempt[] = [];
    const warnings: string[] = [];

    // Prepare document input (validates file, renders PDF pages when needed — ZERO Tesseract)
    let processInput: PrescriptionProcessInput;
    try {
      if (params.typedText && params.typedText.trim().length > 0 && !params.fileBuffer) {
        processInput = {
          mode,
          kind: 'text',
          typedText: params.typedText.trim(),
          totalPages: 1,
          patientAllergies: params.patientAllergies,
          patientExistingMeds: params.patientExistingMeds,
          timeoutMs: params.timeoutMs,
        };
      } else if (params.fileBuffer) {
        const prepared = await prepareUploadedDocument(
          params.fileBuffer,
          params.mimeType,
          params.fileName,
          { renderPdfPages: true }
        );
        warnings.push(...prepared.warnings);
        processInput = {
          mode,
          kind: prepared.kind,
          fileName: params.fileName,
          mimeType: prepared.mimeType,
          originalBuffer: prepared.originalBuffer,
          pageImages: prepared.pageImages,
          totalPages: prepared.totalPages,
          patientAllergies: params.patientAllergies,
          patientExistingMeds: params.patientExistingMeds,
          timeoutMs: params.timeoutMs,
        };
      } else {
        throw new Error('Please upload a prescription image/PDF or enter typed prescription text.');
      }
    } catch (prepErr: any) {
      const diag: SanitizedDiagnosticRecord = {
        timestamp: new Date().toISOString(),
        requestedMode: mode,
        activeProvider: null,
        model: null,
        succeeded: false,
        durationMs: Date.now() - overallStart,
        pagesProcessed: 0,
        extractedMedicationCount: 0,
        extractedFieldCount: 0,
        uncertainFieldCount: 0,
        attempts: [],
        error: prepErr?.message || 'Document preparation failed.',
      };
      lastSanitizedRun = diag;
      return {
        success: false,
        attempts: [],
        warnings,
        error: diag.error,
        diagnostic: diag,
      };
    }

    // Strict provider execution order according to selected mode:
    // - 'gemini': ONLY Gemini Cloud (never switches to Ollama)
    // - 'ollama': ONLY Local Qwen AI (NEVER calls Gemini or sends patient data to cloud!)
    // - 'auto': Gemini Cloud first -> Local Qwen AI fallback
    const providerOrder =
      mode === 'gemini'
        ? [this.gemini]
        : mode === 'ollama'
        ? [this.ollama]
        : [this.gemini, this.ollama];

    let extraction: ClinicalExtractionResult | null = null;
    let fallbackUsed = false;

    for (let idx = 0; idx < providerOrder.length; idx++) {
      const provider = providerOrder[idx];
      const attemptStart = Date.now();
      const modelLabel =
        provider.id === 'gemini'
          ? (process.env.GEMINI_MODEL || 'gemini-2.5-flash')
          : this.ollama.getModel();

      try {
        extraction = await provider.processPrescription(processInput);
        attempts.push({
          provider: provider.id,
          model: extraction.processingMetadata.model,
          succeeded: true,
          durationMs: Date.now() - attemptStart,
        });
        if (idx > 0) {
          fallbackUsed = true;
          const prevErr = attempts[0]?.error;
          warnings.push(
            `Primary provider (Gemini Cloud) failed (${prevErr || 'unavailable'}); processed locally using ${provider.displayName} (${extraction.processingMetadata.model}).`
          );
        }
        break;
      } catch (err: any) {
        attempts.push({
          provider: provider.id,
          model: modelLabel,
          succeeded: false,
          durationMs: Date.now() - attemptStart,
          error: err?.message || `${provider.displayName} failed.`,
        });
      }
    }

    if (!extraction) {
      const combinedError =
        mode === 'auto'
          ? `Both AI providers failed. Gemini Cloud: ${attempts[0]?.error || 'unavailable'} | Local Qwen AI: ${attempts[1]?.error || 'unavailable'}. Configure GEMINI_API_KEY in .env.local OR install Ollama and run "ollama pull ${this.ollama.getModel()}".`
          : attempts[0]?.error || 'Selected AI provider could not process the document.';

      const diag: SanitizedDiagnosticRecord = {
        timestamp: new Date().toISOString(),
        requestedMode: mode,
        activeProvider: null,
        model: null,
        succeeded: false,
        durationMs: Date.now() - overallStart,
        pagesProcessed: processInput.totalPages,
        extractedMedicationCount: 0,
        extractedFieldCount: 0,
        uncertainFieldCount: 0,
        attempts,
        error: combinedError,
      };
      lastSanitizedRun = diag;

      return {
        success: false,
        attempts,
        warnings,
        error: combinedError,
        diagnostic: diag,
      };
    }

    const prescription = clinicalResultToPrescriptionData(extraction, {
      requestedMode: mode,
      fallbackUsed,
      attempts,
      warnings,
      patientAllergiesOverride: params.patientAllergies,
      patientExistingMedsOverride: params.patientExistingMeds,
      originalText: params.typedText,
    });

    const diag: SanitizedDiagnosticRecord = {
      timestamp: new Date().toISOString(),
      requestedMode: mode,
      activeProvider: extraction.processingMetadata.provider,
      model: extraction.processingMetadata.model,
      succeeded: true,
      durationMs: Date.now() - overallStart,
      pagesProcessed: extraction.processingMetadata.pagesProcessed,
      extractedMedicationCount: extraction.medications.length,
      extractedFieldCount: countExtractedFields(extraction),
      uncertainFieldCount: extraction.uncertainFields.length,
      attempts,
    };
    lastSanitizedRun = diag;

    return {
      success: true,
      extraction,
      prescription,
      attempts,
      warnings,
      diagnostic: diag,
    };
  }
}

export const aiProviderManager = new AiProviderManager();
