import { NextRequest, NextResponse } from 'next/server';
import { PrescriptionData, SafetyAlert, SupportedLanguage } from '@/lib/types';
import { SUPPORTED_LANGUAGES } from '@/lib/translations';
import { callGeminiDetailed } from '@/lib/gemini-client';
import { translateClinicalBundle, localizeDiseaseName } from '@/lib/clinical-translator';

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prescription,
      alerts,
      text,
      targetLanguage,
      simulateFailure,
    } = body as {
      prescription?: PrescriptionData;
      alerts?: SafetyAlert[];
      text?: string;
      targetLanguage: SupportedLanguage;
      simulateFailure?: boolean;
    };

    const validLang = SUPPORTED_LANGUAGES.some((l) => l.code === targetLanguage);
    if (!targetLanguage || !validLang) {
      return NextResponse.json(
        { error: `Unsupported or missing targetLanguage: ${targetLanguage}` },
        { status: 400 }
      );
    }

    // Mode A: Full Structured Clinical Report Translation
    if (prescription) {
      const result = await translateClinicalBundle(
        prescription,
        Array.isArray(alerts) ? alerts : [],
        targetLanguage,
        { simulateFailure: Boolean(simulateFailure) }
      );

      if (result.meta.provider === 'failed_fallback') {
        return NextResponse.json(
          {
            success: false,
            prescription: result.prescription,
            alerts: result.alerts,
            meta: result.meta,
            error: result.meta.warning || 'Translation failed. Preserving original clinical text.',
          },
          { status: 503 }
        );
      }

      return NextResponse.json({
        success: true,
        prescription: result.prescription,
        alerts: result.alerts,
        meta: result.meta,
      });
    }

    // Mode B: Single String Translation (backward compatibility)
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Either prescription object or text string is required.' },
        { status: 400 }
      );
    }

    if (targetLanguage === 'en') {
      return NextResponse.json({
        success: true,
        translatedText: text,
        language: 'en',
        source: 'identity',
      });
    }

    if (simulateFailure) {
      return NextResponse.json(
        {
          success: false,
          translatedText: text,
          language: targetLanguage,
          source: 'failed_fallback',
          error: 'Translation service unavailable. Showing original text.',
        },
        { status: 503 }
      );
    }

    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === targetLanguage);
    const targetName = langObj ? `${langObj.name} (${langObj.nativeName})` : targetLanguage;

    if (process.env.GEMINI_API_KEY) {
      const prompt = `Translate this medical text into authentic native-script ${targetName}. Preserve all medicine names, brand names, strengths, dosages, and numeric units accurately. Output only the translation.\n\n${text}`;
      const res = await callGeminiDetailed(prompt, undefined, { timeoutMs: 20000 });
      if (res.ok && res.text) {
        return NextResponse.json({
          success: true,
          translatedText: res.text.trim(),
          language: targetLanguage,
          source: `gemini_ai (${res.model})`,
        });
      }
    }

    const localized = localizeDiseaseName(text, targetLanguage);
    return NextResponse.json({
      success: true,
      translatedText: localized,
      language: targetLanguage,
      source: 'local_clinical_lexicon',
    });
  } catch (error: any) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Translation failed' },
      { status: 500 }
    );
  }
}
