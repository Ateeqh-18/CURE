import { NextRequest, NextResponse } from 'next/server';
import { aiProviderManager } from '@/lib/ai/provider-manager';
import { ProviderMode } from '@/lib/types';

/**
 * Legacy /api/ocr route — Tesseract has been retired from the primary pipeline.
 * Delegates directly to the multimodal Vision AI pipeline (Gemini Cloud + Local Qwen2.5-VL).
 */
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const typedText = (formData.get('text') as string | null) || undefined;
    const rawMode = formData.get('providerMode') as string | null;
    const mode: ProviderMode =
      rawMode === 'gemini' || rawMode === 'ollama' || rawMode === 'auto' ? rawMode : 'auto';

    let fileBuffer: Buffer | undefined;
    if (file) {
      const ab = await file.arrayBuffer();
      fileBuffer = Buffer.from(ab);
    }

    const result = await aiProviderManager.process({
      mode,
      fileBuffer,
      fileName: file?.name,
      mimeType: file?.type,
      typedText,
    });

    if (!result.success) {
      const isBadInput = /empty|unsupported|corrupted|invalid.*pdf|exceeds/i.test(result.error || '');
      return NextResponse.json(
        {
          success: false,
          deprecatedNotice: 'Tesseract OCR has been retired. Use /api/process-prescription with Gemini Cloud or Local Qwen AI.',
          ...result,
        },
        { status: isBadInput ? 400 : 503 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        deprecatedNotice: 'Processed via direct Vision AI (Tesseract retired). Prefer /api/process-prescription.',
        ...result,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Vision AI processing failed.' },
      { status: 500 }
    );
  }
}
