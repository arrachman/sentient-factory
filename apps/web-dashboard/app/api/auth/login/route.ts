import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE } from '@/shared/auth/constants';

const LOGIN_TIMEOUT_MS = 10000;

function getApiBaseUrl() {
  return process.env.API_GATEWAY_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3103';
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { success: false, message: 'Email dan password wajib diisi.' },
      { status: 400 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LOGIN_TIMEOUT_MS);

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);
    const result = NextResponse.json(payload ?? { success: false, message: 'Invalid response from API.' }, {
      status: response.status,
    });

    const token = payload?.data?.token;
    if (response.ok && token) {
      result.cookies.set(TOKEN_COOKIE, token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      });
    }

    return result;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: 'Login request timeout ke API backend.' },
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
