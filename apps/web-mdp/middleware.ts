import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Route guard for /app/** — MDP reuses ERP auth (erp_token cookie). Login page
 * not yet implemented; pass-through until the auth UI lands (Phase 2).
 */
export function middleware(_request: NextRequest) {
  // TODO(Phase 2): redirect to /login when erp_token cookie is absent.
  return NextResponse.next();
}

export const config = {
  matcher: '/app/:path*',
};
