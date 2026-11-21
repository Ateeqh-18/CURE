import { AiProviderId, ProviderMode } from '@/lib/types';
import { ClinicalExtractionResult } from './clinical-extraction-schema';

export interface DocumentPageImage {
  pageNumber: number;
  buffer: Buffer;
  mimeType: 'image/png' | 'image/jpeg' | 'image/webp';
  width?: number;
  height?: number;
  renderWarning?: string;
}

export interface PrescriptionProcessInput {
  mode: ProviderMode;
  kind: 'image' | 'pdf' | 'text';
  fileName?: string;
  mimeType?: string;
  /** Original uploaded buffer (preserved untouched) */
  originalBuffer?: Buffer;
  /** Prepared image(s) for vision models (single image or rendered PDF pages) */
  pageImages?: DocumentPageImage[];
  totalPages: number;
  /** Manually typed prescription text */
  typedText?: string;
  patientAllergies?: string[];
  patientExistingMeds?: string[];
  timeoutMs?: number;
}

export interface ProviderHealthStatus {
  id: AiProviderId;
  displayName: 'Gemini Cloud' | 'Local Qwen AI';
  configured: boolean;
  reachable: boolean;
  ready: boolean;
  model: string;
  availableModels?: string[];
  baseUrl?: string;
  error?: string;
  setupInstructions?: string[];
}

export interface VisionAiProvider {
  readonly id: AiProviderId;
  readonly displayName: 'Gemini Cloud' | 'Local Qwen AI';
  getStatus(options?: { liveCheck?: boolean }): Promise<ProviderHealthStatus>;
  processPrescription(input: PrescriptionProcessInput): Promise<ClinicalExtractionResult>;
}
