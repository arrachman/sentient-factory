import { NextRequest, NextResponse } from 'next/server';
import { getAiBaseUrl } from '@/shared/ai/ai-base-url';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(`${getAiBaseUrl()}/api/schema/semantic`);
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => null);
    return NextResponse.json(payload ?? { success: false, message: 'Invalid response from AI engine.' }, {
      status: response.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to connect to AI engine.';
    return NextResponse.json({ success: false, message }, { status: 502 });
  }
}
