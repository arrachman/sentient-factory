import { NextRequest, NextResponse } from 'next/server';
import { getAiBaseUrl } from '@/shared/ai/ai-base-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ requestId: string }> },
) {
  const { requestId } = await context.params;
  try {
    const response = await fetch(`${getAiBaseUrl()}/api/chat/progress/${requestId}`, {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
        'x-request-id': request.headers.get('x-request-id') || requestId,
      },
      cache: 'no-store',
    });

    if (!response.ok || !response.body) {
      const message = await response.text().catch(() => '');
      return NextResponse.json(
        {
          success: false,
          message: message || 'AI engine progress stream is unavailable.',
          request_id: requestId,
        },
        { status: response.status || 502 },
      );
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to connect to AI engine progress stream.';
    return NextResponse.json(
      {
        success: false,
        message,
        request_id: requestId,
      },
      { status: 502 },
    );
  }
}
