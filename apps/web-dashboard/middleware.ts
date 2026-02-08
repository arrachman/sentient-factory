import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session");
  const { pathname } = request.nextUrl;

  // Paths that are public (no auth needed)
  const publicPaths = ["/auth/login", "/auth/register"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If authenticated and trying to access public auth pages, redirect to dashboard
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If not authenticated and trying to access protected pages, redirect to login
  if (!session && !isPublicPath) {
    const loginUrl = new URL("/auth/login", request.url);
    // Optional: Add redirect param to return to original page after login
    // loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - metronic (static assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|metronic).*)",
  ],
};
