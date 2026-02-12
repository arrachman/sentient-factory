import { NextRequest, NextResponse } from 'next/server';

const MENU_TIMEOUT_MS = 10000;
const TOKEN_COOKIE = 'sf_token';

function getApiBaseUrl() {
  return process.env.API_GATEWAY_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3103';
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized.' },
      { status: 401 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MENU_TIMEOUT_MS);

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/menus/sidebar`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    const payload = await response.json().catch(() => null);
    return NextResponse.json(payload ?? { success: false, message: 'Invalid response from API.' }, {
      status: response.status,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: 'Menu request timeout ke API backend.' },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { success: false, message: 'Gagal konek ke API backend.' },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
