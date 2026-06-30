import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'erp_token';

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

export const config = {
  matcher: ['/app/:path*'],
};
