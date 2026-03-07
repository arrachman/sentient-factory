import { NextRequest, NextResponse } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';
import { TOKEN_COOKIE } from '@/shared/auth/constants';

export async function POST(request: NextRequest) {
  const response = await proxyToApi(request, 'POST', '/api/auth/logout');
  response.cookies.set(TOKEN_COOKIE, '', {
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });
  return response;
}
