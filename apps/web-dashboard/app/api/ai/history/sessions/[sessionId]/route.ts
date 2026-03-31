import { NextRequest, NextResponse } from 'next/server';
import { getAiBaseUrl } from '@/shared/ai/ai-base-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await context.params;
  try {
    const response = await fetch(
      `${getAiBaseUrl()}/api/chat/history/sessions/${sessionId}`,
      {
        method: 'PATCH',
        headers: {
          'content-type': request.headers.get('content-type') || 'application/json',
          'x-request-id': request.headers.get('x-request-id') || crypto.randomUUID(),
        },
        body: await request.text(),
        cache: 'no-store',
      },
    );

    const payload = await response.json().catch(() => ({
      success: false,
      message: 'AI history session rename response is invalid.',
    }));

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to rename AI history session.';
    return NextResponse.json({ success: false, message }, { status: 502 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await context.params;
  try {
    const response = await fetch(
      `${getAiBaseUrl()}/api/chat/history/sessions/${sessionId}`,
      {
        method: 'DELETE',
        headers: {
          'x-request-id': request.headers.get('x-request-id') || crypto.randomUUID(),
        },
        cache: 'no-store',
      },
    );

    const payload = await response.json().catch(() => ({
      success: false,
      message: 'AI history session delete response is invalid.',
    }));

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete AI history session.';
    return NextResponse.json({ success: false, message }, { status: 502 });
  }
}
