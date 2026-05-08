import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE } from '@/shared/auth/constants';
import { ENV } from '@/config/env';

/**
 * Logout — clear HttpOnly cookie + notify api-gateway untuk invalidate session.
 */
export async function POST(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  // Best-effort logout di api-gateway (don't fail kalau upstream error)
  if (token) {
    try {
      await fetch(`${ENV.API_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // ignore — kita tetap clear cookie
    }
  }

  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.set({
    name: TOKEN_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
