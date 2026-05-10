'use client';

import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ROLE_DEFAULT_ROUTE, type Role } from '@/shared/auth/constants';
import { authApi, type LoginInput } from '../api/login.api';

/**
 * Login mutation. Cookie sf_token di-set sebagai HttpOnly via Next.js
 * Route Handler `/api/auth/login` (server-side) — tidak perlu set
 * cookie client-side.
 *
 * Middleware membaca cookie HttpOnly via request.cookies.
 *
 * Navigation strategy: pakai hard navigation (window.location.assign)
 * SETELAH login sukses. Alasan:
 *   1. RSC cache dari halaman login (rendered SEBELUM cookie ada) bisa
 *      stale — router.push() + router.refresh() kadang race dan tidak
 *      navigate, user stuck di /login.
 *   2. Hard navigation memastikan middleware run server-side dengan
 *      cookie yang baru di-set, sehingga role-based routing fresh.
 *   3. Login adalah one-time event — overhead full reload acceptable.
 */
export function useLogin() {
  const params = useSearchParams();

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (res) => {
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
      toast.success('Logged out');
      // Hard navigation: cookie sudah di-clear server-side, paksa reload
      // supaya RSC cache user-context ikut bersih.
      window.location.assign('/login');
    },
  });
}
