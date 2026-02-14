import { NextRequest, NextResponse } from 'next/server';

const REQUEST_TIMEOUT_MS = 10000;
const TOKEN_COOKIE = 'sf_token';

function getApiBaseUrl() {
  return (
    process.env.API_GATEWAY_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:3103'
  );
}

function getAuthHeader(request: NextRequest): string | null {
  const forwardedAuth = request.headers.get('authorization');
  if (forwardedAuth) {
    return forwardedAuth;
  }

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return `Bearer ${token}`;
}

export async function GET(request: NextRequest) {
  const authHeader = getAuthHeader(request);
  if (!authHeader) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized.' },
      { status: 401 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => null);
    return NextResponse.json(
      payload ?? { success: false, message: 'Invalid response from API.' },
      {
        status: response.status,
      },
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: 'Request timeout to API backend.' },
        { status: 504 },
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to connect to API backend.' },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
