import { NextRequest, NextResponse } from 'next/server';
import { PrescriptionData, SafetyAlert, SupportedLanguage } from '@/lib/types';
import { SUPPORTED_LANGUAGES } from '@/lib/translations';
import { generateTreatmentReportPdf } from '@/lib/pdf-generator';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prescription, alerts, language } = body as {
      prescription: PrescriptionData;
      alerts?: SafetyAlert[];
      language: SupportedLanguage;
    };

    if (!prescription || !prescription.patientDetails) {
      return NextResponse.json(
        { error: 'Valid prescription data is required to generate PDF report.' },
        { status: 400 }
      );
    }

    const validLang = SUPPORTED_LANGUAGES.some((l) => l.code === language);
    const targetLang: SupportedLanguage = validLang ? language : 'en';

    const { buffer, fileName } = await generateTreatmentReportPdf(
      prescription,
      Array.isArray(alerts) ? alerts : [],
      targetLang
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': String(buffer.length),
        'X-Cure-Report-Language': targetLang,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    console.error('PDF generation API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate multilingual PDF report.' },
      { status: 500 }
    );
  }
}
