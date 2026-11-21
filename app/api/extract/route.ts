import { NextRequest, NextResponse } from 'next/server';
import { aiProviderManager } from '@/lib/ai/provider-manager';
import { ProviderMode } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 120;

function parseProviderMode(value: unknown): ProviderMode {
  if (value === 'gemini' || value === 'ollama' || value === 'auto') {
    return value;
  }
  return 'auto';
}

/**
 * Typed-text clinical extraction endpoint.
 * Routes directly through Cure's unified Cloud (Gemini) + Local (Ollama Qwen2.5-VL) AI Provider Manager.
 * Never fabricates demo data when providers are unavailable.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text =
      typeof body?.typedText === 'string'
        ? body.typedText.trim()
        : typeof body?.text === 'string'
        ? body.text.trim()
        : '';
    const mode = parseProviderMode(body?.providerMode);
    const patientAllergies = Array.isArray(body?.patientAllergies)
      ? body.patientAllergies.map((s: unknown) => String(s).trim()).filter(Boolean)
      : [];
    const patientExistingMeds = Array.isArray(body?.patientExistingMeds)
      ? body.patientExistingMeds.map((s: unknown) => String(s).trim()).filter(Boolean)
      : [];

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Prescription text is required for extraction.' },
        { status: 400 }
      );
    }

    const aiResponse = await aiProviderManager.process({
      mode,
      typedText: text,
      patientAllergies,
      patientExistingMeds,
    });

    if (!aiResponse.success || !aiResponse.prescription) {
      return NextResponse.json(
        {
          success: false,
          error: aiResponse.error || 'Clinical AI extraction failed.',
          providerMode: mode,
          attempts: aiResponse.attempts,
          diagnostic: aiResponse.diagnostic,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      data: aiResponse.prescription,
      prescription: aiResponse.prescription,
      extraction: aiResponse.extraction,
      source: `${aiResponse.diagnostic.activeProvider} (${aiResponse.diagnostic.model})`,
      attempts: aiResponse.attempts,
      diagnostic: aiResponse.diagnostic,
    });
  } catch (error: any) {
    console.error('Extract API error:', error?.message || error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Clinical extraction failed.' },
      { status: 500 }
    );
  }
}
