import { NextRequest, NextResponse } from 'next/server';

// Auth gate for web-hr (Next 16 `proxy` convention, formerly `middleware`).
// Every /app/* screen consumes /api/hr/* which is guarded by the shared gateway
// (ErpJwtAuthGuard, cookie `sf_token`). Without a session the pages would render
// then fail every fetch with 401 ("Gagal memuat data"). Redirect to /login
// *before* the shell renders when the session cookie is absent, preserving the
// target as `returnTo`. (Presence-only check — an expired or invalid token still
// passes here; that case is caught client-side by the shell's session guard
// which sends the user to /login too.)
const SESSION_COOKIE = 'sf_token';

export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url);
  const { pathname, search } = request.nextUrl;
  loginUrl.searchParams.set('returnTo', `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

// Guard only the authenticated app shell. /login, /api/* (proxied to gateway),
// and static assets stay public.
export const config = {
  matcher: ['/app/:path*'],
};
