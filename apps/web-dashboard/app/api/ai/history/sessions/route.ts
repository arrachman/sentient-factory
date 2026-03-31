import { NextRequest, NextResponse } from 'next/server';
import { getAiBaseUrl } from '@/shared/ai/ai-base-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const target = new URL('/api/chat/history/sessions', getAiBaseUrl());
    const channel = request.nextUrl.searchParams.get('channel');
    const limit = request.nextUrl.searchParams.get('limit');

    if (channel) {
      target.searchParams.set('channel', channel);
    }
    if (limit) {
      target.searchParams.set('limit', limit);
    }

    const response = await fetch(target, {
      method: 'GET',
      headers: {
        'x-request-id': request.headers.get('x-request-id') || crypto.randomUUID(),
      },
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => ({
      success: false,
      message: 'AI history sessions response is invalid.',
    }));

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch AI history sessions.';
    return NextResponse.json({ success: false, message }, { status: 502 });
  }
}
