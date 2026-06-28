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
