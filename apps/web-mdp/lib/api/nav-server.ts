import { cookies } from 'next/headers';
import type { NavNode } from './foundation';

const INTERNAL_API_URL =
  process.env.MDP_INTERNAL_API_URL ??
  process.env.ERP_INTERNAL_API_URL ??
  'http://localhost:3203';

/**
 * Server-side fetch of the role-filtered nav tree, forwarding the ERP auth
 * cookie. Rendering the sidebar from this on the server means the first paint
 * already has the correct menu — no client fallback→fetch swap (the refresh
 * glitch). Returns [] on any failure so the client falls back gracefully.
 */
export async function fetchNavServer(): Promise<NavNode[]> {
  try {
    const cookieHeader = (await cookies()).toString();
    const res = await fetch(`${INTERNAL_API_URL}/api/mdp/menus/nav`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { success: boolean; data: NavNode[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}
