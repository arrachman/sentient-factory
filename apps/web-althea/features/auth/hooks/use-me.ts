'use client';

import { useQuery } from '@tanstack/react-query';
import { meApi } from '../api/me.api';

/**
 * Get current authenticated user dari /auth/me endpoint.
 * Cached 5 menit (user info jarang berubah dalam 1 session).
 */
export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => meApi.getMe(),
    staleTime: 5 * 60 * 1000, // 5 min
    retry: 1,
  });
}

/**
 * Helper: extract clinic role dari roles array.
 * Return first clinic-* role found.
 */
export function pickClinicRole(roles: string[] | undefined): string | null {
  if (!Array.isArray(roles)) return null;
  return roles.find((r) => r.startsWith('clinic-')) ?? null;
}
