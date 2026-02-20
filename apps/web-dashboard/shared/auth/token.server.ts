import { NextRequest } from 'next/server';
import { TOKEN_COOKIE } from '@/shared/auth/constants';

export function getServerToken(request: NextRequest): string {
  const forwardedAuth = request.headers.get('authorization');
  if (forwardedAuth?.trim()) {
    return forwardedAuth.replace(/^Bearer\s+/i, '').trim();
  }

  return request.cookies.get(TOKEN_COOKIE)?.value ?? '';
}

export function getServerAuthHeader(request: NextRequest): string | null {
  const forwardedAuth = request.headers.get('authorization');
  if (forwardedAuth?.trim()) {
    return forwardedAuth;
  }

  const token = getServerToken(request);
  if (!token) {
    return null;
  }

  return `Bearer ${token}`;
}
