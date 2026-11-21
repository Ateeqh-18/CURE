import { GoogleGenAI } from '@google/genai';
import {
  buildTypedTextClinicalPrompt,
  buildVisionClinicalPrompt,
  ClinicalExtractionResult,
} from './clinical-extraction-schema';
import {
  extractJsonFromModelText,
  validateAndNormalizeExtraction,
} from './clinical-validation';
import {
  PrescriptionProcessInput,
  ProviderHealthStatus,
  VisionAiProvider,
} from './provider-interface';

const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';
const FALLBACK_GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
];

function classifyGeminiError(err: any): { message: string; fatalAuth: boolean } {
  const msg = String(err?.message || err || 'Unknown Gemini error');
  const status = err?.status || err?.statusCode;
  if (
    /API_KEY_INVALID|API key not valid|401|403|PERMISSION_DENIED/i.test(msg) ||
    status === 401 ||
    status === 403
  ) {
    return {
      message: 'Gemini authentication failed (invalid or unauthorized GEMINI_API_KEY).',
      fatalAuth: true,
    };
  }
  if (/503|UNAVAILABLE|high demand/i.test(msg) || status === 503) {
    return {
      message: 'Model temporarily experiencing high demand (503).',
      fatalAuth: false,
    };
  }
  if (/429|RESOURCE_EXHAUSTED|quota|rate limit/i.test(msg) || status === 429) {
    return {
      message: 'Model quota or rate limit exceeded (429).',
      fatalAuth: false,
    };
  }
  if (/404|NOT_FOUND|no longer available/i.test(msg) || status === 404) {
    return {
      message: 'Model unavailable or deprecated (404).',
      fatalAuth: false,
    };
  }
  if (/timeout|aborted|ETIMEDOUT/i.test(msg)) {
    return {
      message: 'Gemini API request timed out.',
      fatalAuth: false,
    };
  }
  if (/fetch failed|ENOTFOUND|ECONNREFUSED|network/i.test(msg)) {
    return {
      message: 'Unable to reach Gemini Cloud API (network error).',
      fatalAuth: false,
    };
  }
  return {
    message: `Gemini API error: ${msg.slice(0, 220)}`,
    fatalAuth: false,
  };
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Gemini request timed out after ${timeoutMs}ms`)), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}

export class GeminiVisionProvider implements VisionAiProvider {
  readonly id = 'gemini' as const;
  readonly displayName = 'Gemini Cloud' as const;

  private getApiKey(): string {
    return (process.env.GEMINI_API_KEY || '').trim();
  }

  private getConfiguredModel(): string {
    return (process.env.GEMINI_MODEL || '').trim() || DEFAULT_GEMINI_MODEL;
  }

  private getModelsToTry(): string[] {
    const primary = this.getConfiguredModel();
    return [primary, ...FALLBACK_GEMINI_MODELS.filter((m) => m !== primary)];
  }

  async getStatus(options: { liveCheck?: boolean } = {}): Promise<ProviderHealthStatus> {
    const apiKey = this.getApiKey();
    const model = this.getConfiguredModel();

    if (!apiKey) {
      return {
        id: 'gemini',
        displayName: 'Gemini Cloud',
        configured: false,
        reachable: false,
        ready: false,
        model,
        error: 'GEMINI_API_KEY is not set in server environment (.env.local).',
        setupInstructions: [
          'Obtain an API key from Google AI Studio (https://aistudio.google.com/apikey).',
          'Add GEMINI_API_KEY=your_key_here to .env.local (server-side only, never NEXT_PUBLIC).',
          'Optionally set GEMINI_MODEL=gemini-3.8-flash (or gemini-3.5-flash-lite) and restart the server.',
        ],
      };
    }

    if (!options.liveCheck) {
      return {
        id: 'gemini',
        displayName: 'Gemini Cloud',
        configured: true,
        reachable: true,
        ready: true,
        model,
      };
    }

    // Live lightweight connection check across configured + fallback models (never exposes API key)
    const ai = new GoogleGenAI({ apiKey });
    const failures: string[] = [];

    for (const candidateModel of this.getModelsToTry()) {
      try {
        const res = await withTimeout(
          ai.models.generateContent({
            model: candidateModel,
            contents: [{ role: 'user', parts: [{ text: 'Reply with OK' }] }],
          }),
          10000
        );
        if (res.text) {
          return {
            id: 'gemini',
            displayName: 'Gemini Cloud',
            configured: true,
            reachable: true,
            ready: true,
            model: candidateModel,
          };
        }
      } catch (err: any) {
        const classified = classifyGeminiError(err);
        failures.push(`${candidateModel}: ${classified.message}`);
        if (classified.fatalAuth) {
          return {
            id: 'gemini',
            displayName: 'Gemini Cloud',
            configured: true,
            reachable: false,
            ready: false,
            model: candidateModel,
            error: classified.message,
          };
        }
      }
    }

    return {
      id: 'gemini',
      displayName: 'Gemini Cloud',
      configured: true,
      reachable: false,
      ready: false,
      model,
      error: failures.join(' | ') || 'No configured Gemini model responded.',
    };
  }

  async processPrescription(input: PrescriptionProcessInput): Promise<ClinicalExtractionResult> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error(
        'Gemini Cloud is not configured: GEMINI_API_KEY is missing in .env.local.'
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const timeoutMs = input.timeoutMs ?? 45000;
    const models = this.getModelsToTry();
    const startTime = Date.now();

    // Build multimodal parts directly — ZERO Tesseract involvement
    const buildParts = (useNativePdf: boolean): any[] => {
      if (input.kind === 'text') {
        const prompt = buildTypedTextClinicalPrompt(input.typedText || '');
        return [{ text: prompt }];
      }

      const pageNumbers =
        input.pageImages && input.pageImages.length > 0
          ? input.pageImages.map((p) => p.pageNumber)
          : Array.from({ length: input.totalPages }, (_, i) => i + 1);

      const prompt = buildVisionClinicalPrompt({
        pageNumbers,
        totalPages: input.totalPages,
      });

      const parts: any[] = [{ text: prompt }];

      // Native PDF input for Gemini when supported & buffer provided
      if (input.kind === 'pdf' && useNativePdf && input.originalBuffer) {
        parts.push({
          inlineData: {
            mimeType: 'application/pdf',
            data: input.originalBuffer.toString('base64'),
          },
        });
        return parts;
      }

      // Direct image or rendered PDF page images
      if (input.pageImages && input.pageImages.length > 0) {
        for (const page of input.pageImages) {
          parts.push({
            text: `--- Document Page ${page.pageNumber} of ${input.totalPages} ---`,
          });
          parts.push({
            inlineData: {
              mimeType: page.mimeType,
              data: page.buffer.toString('base64'),
            },
          });
        }
        return parts;
      }

      if (input.originalBuffer && input.mimeType) {
        parts.push({
          inlineData: {
            mimeType: input.mimeType === 'image/jpg' ? 'image/jpeg' : input.mimeType,
            data: input.originalBuffer.toString('base64'),
          },
        });
        return parts;
      }

      throw new Error('No document image, PDF, or typed text was supplied to Gemini Vision.');
    };

    const attemptErrors: string[] = [];
    const perModelTimeoutMs = Math.min(timeoutMs, 25000);

    for (const model of models) {
      // For PDFs: try native PDF input first; if rejected, fall back to rendered page images
      const strategies =
        input.kind === 'pdf' && input.pageImages && input.pageImages.length > 0
          ? [true, false]
          : [input.kind === 'pdf'];

      for (const useNativePdf of strategies) {
        try {
          const parts = buildParts(useNativePdf);
          const response = await withTimeout(
            ai.models.generateContent({
              model,
              contents: [{ role: 'user', parts }],
              config: {
                temperature: 0.1,
                responseMimeType: 'application/json',
              },
            }),
            perModelTimeoutMs
          );

          const rawText = (response.text || '').trim();
          if (!rawText) {
            throw new Error(`Gemini model ${model} returned an empty response.`);
          }

          const rawJson = extractJsonFromModelText(rawText);
          return validateAndNormalizeExtraction(rawJson, {
            provider: 'gemini',
            model,
            pagesProcessed: input.totalPages || 1,
            durationMs: Date.now() - startTime,
            inputKind: input.kind,
          });
        } catch (err: any) {
          const classified = classifyGeminiError(err);
          attemptErrors.push(`${model}: ${classified.message}`);

          // Immediately stop retrying on invalid API key / auth failure
          if (classified.fatalAuth) {
            throw new Error(classified.message);
          }

          // If the model itself is 503/404/429/timed out, skip straight to the next fallback model
          if (/503|404|429|timed out|high demand|deprecated|quota/i.test(classified.message)) {
            break;
          }
          // Otherwise (e.g. native PDF rejected), try next strategy (rendered pages) or next model
        }
      }
    }

    throw new Error(
      attemptErrors.length > 0
        ? `Gemini Cloud models unavailable (${attemptErrors.join(' | ')})`
        : 'Gemini Cloud processing failed.'
    );
  }
}
