import { NextRequest, NextResponse } from 'next/server';
import { getAiBaseUrl } from '@/shared/ai/ai-base-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ promptId: string }> },
) {
  const { promptId } = await context.params;
  try {
    const response = await fetch(
      `${getAiBaseUrl()}/api/chat/history/prompts/${promptId}`,
      {
        method: 'GET',
        headers: {
          'x-request-id': request.headers.get('x-request-id') || crypto.randomUUID(),
        },
        cache: 'no-store',
      },
    );

    const payload = await response.json().catch(() => ({
      success: false,
      message: 'AI history prompt detail response is invalid.',
    }));

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch AI history prompt detail.';
    return NextResponse.json({ success: false, message }, { status: 502 });
  }
}
