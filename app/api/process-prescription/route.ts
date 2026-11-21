import { NextRequest, NextResponse } from 'next/server';
import { aiProviderManager } from '@/lib/ai/provider-manager';
import { ProviderMode } from '@/lib/types';

export const maxDuration = 120;

function parseStringList(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((s) => String(s).trim()).filter(Boolean);
    } catch {
      return raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}

function parseProviderMode(raw: unknown): ProviderMode {
  if (raw === 'gemini' || raw === 'ollama' || raw === 'auto') return raw;
  return 'auto';
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let mode: ProviderMode = 'auto';
    let fileBuffer: Buffer | undefined;
    let fileName: string | undefined;
    let mimeType: string | undefined;
    let typedText: string | undefined;
    let patientAllergies: string[] = [];
    let patientExistingMeds: string[] = [];
    let timeoutMs: number | undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      mode = parseProviderMode(formData.get('providerMode'));
      typedText =
        ((formData.get('typedText') as string | null) ||
          (formData.get('text') as string | null) ||
          undefined);
      patientAllergies = parseStringList(formData.get('patientAllergies'));
      patientExistingMeds = parseStringList(formData.get('patientExistingMeds'));
      const rawTimeout = formData.get('timeoutMs') as string | null;
      if (rawTimeout) timeoutMs = Math.max(1000, parseInt(rawTimeout, 10) || 45000);

      if (file && file.size > 0) {
        const ab = await file.arrayBuffer();
        fileBuffer = Buffer.from(ab);
        fileName = file.name;
        mimeType = file.type;
      } else if (file && file.size === 0) {
        return NextResponse.json(
          { success: false, error: 'Uploaded file is empty (0 bytes).' },
          { status: 400 }
        );
      }
    } else {
      const body = await req.json();
      mode = parseProviderMode(body?.providerMode);
      typedText =
        typeof body?.typedText === 'string'
          ? body.typedText
          : typeof body?.text === 'string'
          ? body.text
          : undefined;
      patientAllergies = parseStringList(body?.patientAllergies);
      patientExistingMeds = parseStringList(body?.patientExistingMeds);
      if (typeof body?.timeoutMs === 'number') timeoutMs = body.timeoutMs;
    }

    if (!fileBuffer && (!typedText || !typedText.trim())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please upload a prescription image/PDF (PNG, JPG, WEBP, PDF) or enter typed prescription text.',
        },
        { status: 400 }
      );
    }

    const result = await aiProviderManager.process({
      mode,
      fileBuffer,
      fileName,
      mimeType,
      typedText,
      patientAllergies,
      patientExistingMeds,
      timeoutMs,
    });

    if (!result.success) {
      const isBadInput = /empty|unsupported|corrupted|invalid.*pdf|exceeds/i.test(result.error || '');
      return NextResponse.json(result, { status: isBadInput ? 400 : 503 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error('Process prescription API error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Unexpected error while processing prescription.',
      },
      { status: 500 }
    );
  }
}
