import { NextRequest, NextResponse } from 'next/server';
import { aiProviderManager } from '@/lib/ai/provider-manager';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const liveCheck = req.nextUrl.searchParams.get('live') === '1';
    const status = await aiProviderManager.getAllStatuses({ liveGeminiCheck: liveCheck });
    return NextResponse.json(status, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to inspect AI provider status.' },
      { status: 500 }
    );
  }
}
