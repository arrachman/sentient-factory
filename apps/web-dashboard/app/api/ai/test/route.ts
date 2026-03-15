import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';

import { NextRequest, NextResponse } from 'next/server';
import { getAiBaseUrl } from '@/shared/ai/ai-base-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getRequestId(request: NextRequest) {
  return request.headers.get('x-request-id') || crypto.randomUUID();
}

function postJson(body: string, requestId: string): Promise<{ statusCode: number; payload: string }> {
  return new Promise((resolve, reject) => {
    const target = new URL('/api/chat/test', getAiBaseUrl());
    const transport = target.protocol === 'https:' ? httpsRequest : httpRequest;
    const upstream = transport(
      target,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body).toString(),
          'x-request-id': requestId,
        },
        timeout: 180_000,
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on('data', (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        response.on('end', () => {
          resolve({
            statusCode: response.statusCode ?? 502,
            payload: Buffer.concat(chunks).toString('utf8'),
          });
        });
      },
    );

    upstream.on('timeout', () => {
      upstream.destroy(new Error('AI engine request timed out.'));
    });
    upstream.on('error', reject);
    upstream.write(body);
    upstream.end();
  });
}

export async function POST(request: NextRequest) {
  try {
    const requestId = getRequestId(request);
    const requestPayload = await request.json().catch(() => null);
    const prompt =
      requestPayload && typeof requestPayload === 'object' && 'prompt' in requestPayload
        ? String(requestPayload.prompt ?? '')
        : '';

    const body = JSON.stringify({
      prompt,
      request_id: requestId,
    });

    const response = await postJson(body, requestId);
    const responsePayload = JSON.parse(response.payload || '{}') as unknown;

    return NextResponse.json(responsePayload, {
      status: response.statusCode,
      headers: {
        'x-request-id': requestId,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to connect to AI engine.';
    return NextResponse.json({ success: false, message }, { status: 502 });
  }
}
