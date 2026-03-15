import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';

import { NextRequest, NextResponse } from 'next/server';
import { getAiBaseUrl } from '@/shared/ai/ai-base-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type WorkflowTestRequestPayload = {
  prompt?: unknown;
  question?: unknown;
  messages?: unknown;
  include_schema?: unknown;
  include_samples?: unknown;
  execute_read_only_query?: unknown;
  schema_key?: unknown;
};

function getRequestId(request: NextRequest) {
  return request.headers.get('x-request-id') || crypto.randomUUID();
}

function postJson(body: string, requestId: string): Promise<{ statusCode: number; payload: string }> {
  return new Promise((resolve, reject) => {
    const target = new URL('/api/chat/query/trigger', getAiBaseUrl());
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
        timeout: 10_000,
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

function toBoolean(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback;
}

function toNonEmptyString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

export async function POST(request: NextRequest) {
  try {
    const requestId = getRequestId(request);
    const requestPayload = (await request.json().catch(() => null)) as WorkflowTestRequestPayload | null;
    const question =
      toNonEmptyString(requestPayload?.question) || toNonEmptyString(requestPayload?.prompt) || '';

    const bodyPayload = {
      question,
      messages: Array.isArray(requestPayload?.messages) ? requestPayload.messages : [],
      include_schema: toBoolean(requestPayload?.include_schema, true),
      include_samples: toBoolean(requestPayload?.include_samples, false),
      execute_read_only_query: toBoolean(requestPayload?.execute_read_only_query, false),
      schema_key: toNonEmptyString(requestPayload?.schema_key),
      request_id: requestId,
    };

    const response = await postJson(JSON.stringify(bodyPayload), requestId);
    const responsePayload = JSON.parse(response.payload || '{}') as unknown;
    const status =
      response.statusCode >= 200 &&
      response.statusCode < 300 &&
      responsePayload &&
      typeof responsePayload === 'object' &&
      'data' in responsePayload
        ? 202
        : response.statusCode;

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
