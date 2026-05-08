import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE } from '@/shared/auth/constants';
import { ENV } from '@/config/env';

/**
 * Next.js Route Handler proxy untuk /api/auth/login.
 *
 * Flow:
 * 1. Client POST /api/auth/login dengan { email, password }
 * 2. Route Handler forward ke api-gateway (server-to-server, no CORS)
 * 3. Set sf_token sebagai HttpOnly cookie (XSS-safe)
 * 4. Return response body (token tetap di body untuk backward compat)
 *
 * Improvement vs document.cookie approach (Slice 0):
 * - Cookie HttpOnly = XSS tidak bisa baca token
 * - SameSite=Lax = CSRF protection dasar
 * - Secure flag aktif di prod (HTTPS only)
 */
export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
  }

  // Forward ke api-gateway
  let upstream: Response;
  try {
    upstream = await fetch(`${ENV.API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward client headers berguna untuk auditing
        'X-Forwarded-For': request.headers.get('x-forwarded-for') ?? '',
        'User-Agent': request.headers.get('user-agent') ?? '',
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: 'Tidak bisa konek ke server. Coba lagi.',
        error: err instanceof Error ? err.message : 'unknown',
      },
      { status: 502 },
    );
  }

  const data = await upstream.json().catch(() => ({}));

  // Build response — pass through body
  const response = NextResponse.json(data, { status: upstream.status });

  // Kalau sukses, set HttpOnly cookie
  if (upstream.ok && data?.success && data?.data?.token) {
    response.cookies.set({
      name: TOKEN_COOKIE,
      value: data.data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
  }

  return response;
}
