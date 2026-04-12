import { NextRequest, NextResponse } from 'next/server';
import { getAiBaseUrl } from '@/shared/ai/ai-base-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getRequestId(request: NextRequest) {
  return request.headers.get('x-request-id') || crypto.randomUUID();
}

export async function POST(request: NextRequest) {
  try {
    const requestId = getRequestId(request);
    const target = new URL('/api/chat/query/trigger', getAiBaseUrl());
    const contentType = request.headers.get('content-type') || '';

    let upstreamBody: BodyInit;
    let upstreamHeaders: HeadersInit = {
      'x-request-id': requestId,
    };

    if (contentType.toLowerCase().includes('multipart/form-data')) {
      const formData = await request.formData();
      formData.set('request_id', requestId);
      formData.set('model_profile', 'fast');
      upstreamBody = formData;
    } else {
      const requestPayload = await request.json().catch(() => null);
      upstreamBody = JSON.stringify({
        ...(requestPayload && typeof requestPayload === 'object' ? requestPayload : {}),
        request_id: requestId,
        model_profile: 'fast',
      });
      upstreamHeaders = {
        ...upstreamHeaders,
        'Content-Type': 'application/json',
      };
    }

    const response = await fetch(target, {
      method: 'POST',
      headers: upstreamHeaders,
      body: upstreamBody,
      cache: 'no-store',
    });
    const responsePayload = (await response.json().catch(() => ({}))) as unknown;
    const status =
      response.status >= 200 &&
      response.status < 300 &&
      responsePayload &&
      typeof responsePayload === 'object' &&
      'data' in responsePayload
        ? 202
        : response.status;

    return NextResponse.json(responsePayload, {
      status,
      headers: {
        'x-request-id': requestId,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to connect to AI engine.';
    return NextResponse.json({ success: false, message }, { status: 502 });
  }
}
