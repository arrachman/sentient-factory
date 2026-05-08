'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ROLE_DEFAULT_ROUTE, type Role } from '@/shared/auth/constants';
import { authApi, type LoginInput } from '../api/login.api';

/**
 * Login mutation. Cookie sf_token di-set sebagai HttpOnly via Next.js
 * Route Handler `/api/auth/login` (server-side) — tidak perlu set
 * cookie client-side.
 *
 * Middleware membaca cookie HttpOnly via request.cookies.
 */
export function useLogin() {
  const router = useRouter();
  const params = useSearchParams();

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (res) => {
      toast.success(`Selamat datang, ${res.data.user.fullName || res.data.user.username}`);
      const returnTo = params.get('returnTo');
      const clinicRoles = res.data.user.roles.filter((r) => r.startsWith('clinic-')) as Role[];
      const role = clinicRoles[0] ?? 'clinic-admin';
      const landing = ROLE_DEFAULT_ROUTE[role] ?? '/admin/schedule';
      router.push(returnTo && returnTo.startsWith('/') ? returnTo : landing);
      router.refresh();
    },
    onError: (err: Error) => {
      toast.error('Login gagal', { description: err.message });
    },
  });
}

export function useLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      toast.success('Logged out');
      router.push('/login');
      router.refresh();
    },
  });
}
