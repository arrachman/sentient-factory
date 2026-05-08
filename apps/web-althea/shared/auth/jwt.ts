import { ROLES_CLAIM, pickClinicRole, type Role } from './constants';

/**
 * Decode JWT payload tanpa verifikasi (middleware ringan).
 * Verifikasi signature dilakukan oleh api-gateway saat call protected endpoint.
 *
 * Edge runtime tidak bisa pakai `jsonwebtoken`, jadi decode manual.
 * JANGAN dipakai untuk auth decision yang sensitive — ini hanya untuk
 * routing hint. Selalu re-validate di server-side fetch.
 */
export function decodeJwtPayload<T = Record<string, unknown>>(
  token: string,
): T | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const json = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Extract clinic-* role dari JWT token.
 * User mungkin punya multiple roles — pick first clinic-* role.
 */
export function extractRoleFromToken(token: string | undefined): Role | null {
  if (!token) return null;
  const payload = decodeJwtPayload<Record<string, unknown>>(token);
  if (!payload) return null;
  const claim = payload[ROLES_CLAIM];
  if (!Array.isArray(claim)) return null;
  return pickClinicRole(claim as string[]);
}
