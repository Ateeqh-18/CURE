import { GoogleGenAI } from '@google/genai';

/**
 * Unified Google Gemini text/multimodal helper for Cure (used by translation & auxiliary routes).
 * Uses the official @google/genai SDK and reads credentials strictly from process.env.GEMINI_API_KEY.
 */

export type GeminiErrorType =
  | 'missing_key'
  | 'invalid_key'
  | 'rate_limit'
  | 'timeout'
  | 'unsupported_file'
  | 'model_not_found'
  | 'network_error'
  | 'api_error'
  | 'empty_response';

export interface GeminiCallResult {
  ok: boolean;
  text: string | null;
  model?: string;
  statusCode?: number;
  errorType?: GeminiErrorType;
  errorMessage?: string;
}

const DEFAULT_MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
const SUPPORTED_INLINE_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'application/pdf',
]);

export async function callGeminiDetailed(
  prompt: string,
  inlineMedia?: { data: string; mimeType: string },
  options: {
    responseJson?: boolean;
    timeoutMs?: number;
    temperature?: number;
    apiKeyOverride?: string;
  } = {}
): Promise<GeminiCallResult> {
  const apiKey = (options.apiKeyOverride ?? process.env.GEMINI_API_KEY ?? '').trim();
  if (!apiKey) {
    return {
      ok: false,
      text: null,
      errorType: 'missing_key',
      errorMessage: 'GEMINI_API_KEY is not configured in environment variables.',
    };
  }

  if (inlineMedia && !SUPPORTED_INLINE_MIMES.has(inlineMedia.mimeType.toLowerCase())) {
    return {
      ok: false,
      text: null,
      errorType: 'unsupported_file',
      errorMessage: `Unsupported media type for Gemini Vision: ${inlineMedia.mimeType}`,
    };
  }

  const configuredModel = process.env.GEMINI_MODEL?.trim();
  const modelsToTry = configuredModel
    ? [configuredModel, ...DEFAULT_MODELS.filter((m) => m !== configuredModel)]
    : DEFAULT_MODELS;

  const timeoutMs = options.timeoutMs ?? 25000;
  const ai = new GoogleGenAI({ apiKey });

  let lastError: GeminiCallResult = {
    ok: false,
    text: null,
    errorType: 'api_error',
    errorMessage: 'Gemini request failed.',
  };

  for (const model of modelsToTry) {
    const parts: any[] = [{ text: prompt }];
    if (inlineMedia) {
      parts.push({
        inlineData: {
          mimeType: inlineMedia.mimeType === 'image/jpg' ? 'image/jpeg' : inlineMedia.mimeType,
          data: inlineMedia.data,
        },
      });
    }

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`TIMEOUT:${timeoutMs}`)), timeoutMs);
      });

      const response = await Promise.race([
        ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts }],
          config: {
            temperature: options.temperature ?? 0.1,
            ...(options.responseJson ? { responseMimeType: 'application/json' } : {}),
          },
        }),
        timeoutPromise,
      ]);

      const combinedText = (response?.text || '').trim();
      if (!combinedText) {
        lastError = {
          ok: false,
          text: null,
          model,
          errorType: 'empty_response',
          errorMessage: 'Gemini returned an empty response.',
        };
        continue;
      }

      return {
        ok: true,
        text: combinedText,
        model,
        statusCode: 200,
      };
    } catch (err: any) {
      const msg = String(err?.message || err || 'Gemini API error');
      const status = typeof err?.status === 'number' ? err.status : undefined;

      if (msg.startsWith('TIMEOUT:')) {
        lastError = {
          ok: false,
          text: null,
          model,
          errorType: 'timeout',
          errorMessage: `Gemini request timed out after ${timeoutMs}ms.`,
        };
        continue;
      }

      if (status === 401 || status === 403 || /api key not valid|invalid.*api.*key|permission_denied/i.test(msg)) {
        return {
          ok: false,
          text: null,
          model,
          statusCode: status ?? 401,
          errorType: 'invalid_key',
          errorMessage: 'Gemini API key is invalid or unauthorized.',
        };
      }

      if (status === 429 || /quota|rate.?limit|resource_exhausted/i.test(msg)) {
        lastError = {
          ok: false,
          text: null,
          model,
          statusCode: status ?? 429,
          errorType: 'rate_limit',
          errorMessage: `Gemini model ${model} rate limit or quota exceeded.`,
        };
        continue; // Try fallback model with available quota
      }

      if (status === 404 || /not_found|model.*not found|no longer available/i.test(msg)) {
        lastError = {
          ok: false,
          text: null,
          model,
          statusCode: 404,
          errorType: 'model_not_found',
          errorMessage: `Model ${model} not available.`,
        };
        continue;
      }

      lastError = {
        ok: false,
        text: null,
        model,
        statusCode: status,
        errorType: /fetch failed|enotfound|econnrefused/i.test(msg) ? 'network_error' : 'api_error',
        errorMessage: msg.slice(0, 260),
      };
    }
  }

  return lastError;
}

export async function callGemini(
  prompt: string,
  base64Image?: { data: string; mimeType: string },
  responseJson: boolean = false
): Promise<string | null> {
  const result = await callGeminiDetailed(prompt, base64Image, { responseJson });
  return result.ok ? result.text : null;
}
