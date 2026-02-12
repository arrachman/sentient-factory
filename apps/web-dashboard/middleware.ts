import { NextRequest, NextResponse } from 'next/server';

const TOKEN_COOKIE = 'sf_token';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/app') && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (pathname === '/auth/login' && token) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/auth/login'],
};
