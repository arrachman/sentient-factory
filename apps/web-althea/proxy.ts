import { NextRequest, NextResponse } from 'next/server';
import {
  ROLE_DEFAULT_ROUTE,
  ROLE_ROUTE_PREFIXES,
  TOKEN_COOKIE,
  type Role,
} from '@/shared/auth/constants';
import { extractRoleFromToken } from '@/shared/auth/jwt';

const PUBLIC_PATHS = ['/login', '/register'];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isAllowedForRole(pathname: string, role: Role): boolean {
  // Admin bypass: akses semua route
  if (role === 'clinic-admin') return true;
  const prefixes = ROLE_ROUTE_PREFIXES[role];
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = extractRoleFromToken(token);

  // Public path: kalau sudah login, redirect ke dashboard role
  if (isPublicPath(pathname)) {
    if (role) {
      const returnTo = request.nextUrl.searchParams.get('returnTo');
      if (returnTo && returnTo.startsWith('/')) {
        return NextResponse.redirect(new URL(returnTo, request.url));
      }
      return NextResponse.redirect(
        new URL(ROLE_DEFAULT_ROUTE[role], request.url),
      );
    }
    return NextResponse.next();
  }

  // Protected path: butuh login
  if (!role) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Role guard: cek apakah user boleh akses path ini
  if (!isAllowedForRole(pathname, role)) {
    return NextResponse.redirect(
      new URL(ROLE_DEFAULT_ROUTE[role], request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  /**
   * Cocokkan semua route kecuali aset & API.
   * Next.js skip otomatis: `_next/*`, `favicon.ico`, file dengan ext.
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
