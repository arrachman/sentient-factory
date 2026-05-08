'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { TOKEN_COOKIE } from '@/shared/auth/constants';
import { authApi, type LoginInput } from '../api/login.api';

/**
 * Set cookie sf_token client-side. Cookie ini dibaca oleh middleware
 * untuk role-based routing.
 *
 * Note: cookie tidak HttpOnly (set via JS), karena api-gateway return
 * token di body. Untuk hardening, future: pakai Next.js Route Handler
 * yang relay ke api-gateway + set HttpOnly cookie server-side.
 */
function setAuthCookie(token: string) {
  // 7 days, same-site lax (CSRF-safe enough for clinic domain SSO)
  const maxAge = 7 * 24 * 60 * 60;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(
    token,
  )}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

export function useLogin() {
  const router = useRouter();
  const params = useSearchParams();

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (res) => {
      setAuthCookie(res.data.token);
      toast.success(`Selamat datang, ${res.data.user.fullName || res.data.user.username}`);
      const returnTo = params.get('returnTo');
      router.push(returnTo && returnTo.startsWith('/') ? returnTo : '/dashboard');
      router.refresh();
    },
    onError: (err: Error) => {
      toast.error('Login gagal', { description: err.message });
    },
  });
}
