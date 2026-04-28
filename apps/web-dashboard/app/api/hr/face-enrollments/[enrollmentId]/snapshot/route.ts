import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthHeader } from '@/shared/auth/token.server';

const REQUEST_TIMEOUT_MS = 10000;

function getApiBaseUrl() {
  return process.env.API_GATEWAY_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3103';
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ enrollmentId: string }> },
) {
  const authHeader = getServerAuthHeader(request);
  if (!authHeader) {
    return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
  }

  const { enrollmentId } = await context.params;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const base = getApiBaseUrl();
    const response = await fetch(`${base}/api/hr/face-enrollments/${encodeURIComponent(enrollmentId)}/snapshot`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      return NextResponse.json(
        payload ?? { success: false, message: 'Failed to fetch face enrollment snapshot.' },
        { status: response.status },
      );
    }

    const bytes = await response.arrayBuffer();
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
        'Content-Disposition':
          response.headers.get('content-disposition') || 'inline; filename="face-enrollment-snapshot"',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json({ success: false, message: 'Request timeout to API backend.' }, { status: 504 });
    }

    return NextResponse.json({ success: false, message: 'Failed to connect to API backend.' }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
