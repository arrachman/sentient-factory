/**
 * Helper utilities untuk admin-shell.
 *
 * - performLogout: clear cookie + invalidate api-gateway session + redirect
 *   ke /login. Cookie clear di client karena NPM bypass Route Handler.
 * - userInitial: ambil 1 huruf untuk avatar
 * - resolvePageMeta: mapping pathname → breadcrumb { category, label, title }
 */
import { TOKEN_COOKIE } from '@/shared/auth/constants';
import type { NavGroup } from './nav-config';

export async function performLogout() {
  // Fire-and-forget logout API
  fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  }).catch(() => {
    /* ignore — yang penting cookie + redirect */
  });

  // Clear cookie client-side
  if (typeof window !== 'undefined') {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${TOKEN_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
    window.location.href = '/login';
  }
}

export function userInitial(
  name: string | null | undefined,
  fallback: string,
): string {
  const n = (name ?? '').trim() || fallback;
  return n.charAt(0).toUpperCase();
}

export function resolvePageMeta(
  pathname: string,
  nav: NavGroup[],
): { category: string; label: string; title: string } | null {
  for (const group of nav) {
    for (const item of group.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return {
          category: group.category,
          label: item.label,
          title: item.pageTitle ?? item.label,
        };
      }
    }
  }
  return null;
}
