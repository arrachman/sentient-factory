import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE } from '@/shared/auth/constants';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const { pathname, search } = request.nextUrl;

  const isLegacyOverviewQuery =
    pathname === '/app' &&
    request.nextUrl.searchParams.get('domain') === 'm1' &&
    request.nextUrl.searchParams.get('period') === 'all' &&
    request.nextUrl.searchParams.get('groupBy') === 'sumber' &&
    request.nextUrl.searchParams.get('sortBy') === 'id' &&
    request.nextUrl.searchParams.get('metricView') === 'totalMetric';

  if (isLegacyOverviewQuery) {
    return NextResponse.redirect(new URL('/app/overview', request.url));
  }

  if (pathname.startsWith('/app') && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('returnTo', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/auth/login' && token) {
    const returnTo = request.nextUrl.searchParams.get('returnTo');
    if (returnTo && returnTo.startsWith('/')) {
      return NextResponse.redirect(new URL(returnTo, request.url));
    }
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/auth/login'],
};
