'use client';

import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ROLE_DEFAULT_ROUTE, TOKEN_COOKIE, type Role } from '@/shared/auth/constants';
import { authApi, type LoginInput } from '../api/login.api';

/**
 * Set cookie sf_token client-side dari token di response body.
 *
 * KENAPA tidak HttpOnly (server-side via Route Handler)?
 * Route Handler di app/api/auth/login/route.ts hanya jalan saat akses
 * direct ke web-althea (mis. dev server, LAN tanpa NPM). Production via
 * NPM (https://althea.fr-labs.my.id), NPM forward `/api/*` LANGSUNG ke
 * api-gateway:3203, bypass Next.js completely. Akibatnya Set-Cookie
 * header dari Route Handler tidak pernah ter-emit, cookie tidak ada,
 * middleware redirect balik ke /login → user stuck.
 *
 * Trade-off: client-side cookie tidak HttpOnly (JS bisa baca → XSS risk
 * kalau ada injection). Acceptable karena:
 *   - Token short-lived (7 days)
 *   - App tidak terima user HTML, no obvious XSS vector
 *   - Alternatif (config NPM) butuh infra access, deferred
 */
function setAuthCookie(token: string) {
  if (typeof window === 'undefined') return;
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(
    token,
  )}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function clearAuthCookie() {
  if (typeof window === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
}

export function useLogin() {
  const params = useSearchParams();

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (res) => {
      // Set cookie client-side dari token (NPM bypass Next.js Route Handler)
      setAuthCookie(res.data.token);

      toast.success(`Selamat datang, ${res.data.user.fullName || res.data.user.username}`);
      const returnTo = params.get('returnTo');
      const clinicRoles = res.data.user.roles.filter((r) => r.startsWith('clinic-')) as Role[];
      const role = clinicRoles[0] ?? 'clinic-admin';
      const landing = ROLE_DEFAULT_ROUTE[role] ?? '/admin/schedule';
      const target = returnTo && returnTo.startsWith('/') ? returnTo : landing;
      // Hard navigation — bypass RSC cache, biarin middleware run dengan cookie fresh
      window.location.assign(target);
    },
    onError: (err: Error) => {
      toast.error('Login gagal', { description: err.message });
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear cookie client-side (server-side logout endpoint juga ada,
      // tapi NPM-bypass yang sama: set cookie sini supaya pasti hilang)
      clearAuthCookie();
      toast.success('Logged out');
      window.location.assign('/login');
    },
    onError: () => {
      // Even if API logout fails, clear local cookie & redirect
      clearAuthCookie();
      window.location.assign('/login');
    },
  });
}
