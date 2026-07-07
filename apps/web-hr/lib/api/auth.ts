// Platform auth (shared api-gateway). HR reuses the platform session cookie
// `sf_token`; web-hr does not own login — it relies on an existing platform
// session. getMe() returns 401 (HrApiError) when unauthenticated.
import { apiGet } from './client';

export interface HrAuthUser {
  id: string;
  username: string;
  name: string;
  email?: string | null;
  roles?: string[];
  [key: string]: unknown;
}

/** GET /api/auth/me — current platform user. Throws HrApiError(401) if no session. */
export async function getMe(): Promise<HrAuthUser> {
  // Platform may wrap in { data } or return the user directly — normalize.
  const res = await apiGet<HrAuthUser | { data: HrAuthUser }>('/auth/me');
  return (res as { data?: HrAuthUser }).data ?? (res as HrAuthUser);
}

// Same cookie the login page writes (see app/login/page.tsx). HR's `sf_token` is
// set client-side (NOT HttpOnly), so logout is purely client-side: drop the
// cookie and hard-navigate to /login. No backend logout endpoint is involved.
const SESSION_COOKIE = 'sf_token';

/** Clear the client-set session cookie. Path/SameSite must match the login write
 *  for the deletion to take. The caller is responsible for navigating to /login. */
export function clearSession(): void {
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
