import { NextRequest, NextResponse } from 'next/server';

function getAiBaseUrl() {
  return process.env.AI_ENGINE_URL || 'http://172.17.0.1:8001';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const response = await fetch(`${getAiBaseUrl()}/api/chat/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
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
