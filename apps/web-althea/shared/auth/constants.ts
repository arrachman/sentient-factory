/**
 * Token cookie name — sama dengan web-dashboard agar SSO antar app
 * di domain yang sama jalan tanpa konfigurasi tambahan.
 */
export const TOKEN_COOKIE = 'sf_token';

/**
 * Role claim key dalam JWT payload (decode dari sf_token).
 * api-gateway emits `roles: string[]` (auth.service.ts).
 */
export const ROLES_CLAIM = 'roles';

/**
 * 6 internal staff roles untuk Althea Psychology clinic system.
 * Prefix `clinic-` di Role table (m0_role) untuk distinguish dari ERP roles.
 *
 * See ADR 003.
 */
export type Role =
  | 'clinic-admin'
  | 'clinic-psikolog'
  | 'clinic-owner'
  | 'clinic-resepsionis'
  | 'clinic-marketing'
  | 'clinic-intern';

export const ALL_ROLES: Role[] = [
  'clinic-admin',
  'clinic-psikolog',
  'clinic-owner',
  'clinic-resepsionis',
  'clinic-marketing',
  'clinic-intern',
];

/**
 * Default landing route per role setelah login.
 *
 * URL convention: prefixed dengan role slug (mis. /admin/dashboard) supaya
 * URL distinct antar role — Next.js tidak allow parallel pages dengan path sama.
 */
export const ROLE_DEFAULT_ROUTE: Record<Role, string> = {
  'clinic-admin': '/admin/dashboard',
  'clinic-psikolog': '/psikolog/dashboard',
  'clinic-owner': '/owner/dashboard',
  'clinic-resepsionis': '/resepsionis/dashboard',
  'clinic-marketing': '/marketing/dashboard',
  'clinic-intern': '/intern/dashboard',
};

/**
 * Mapping route prefix → role yang boleh akses.
 * Admin bypass (akses semua) di-handle terpisah di middleware.
 */
export const ROLE_ROUTE_PREFIXES: Record<Role, string[]> = {
  'clinic-admin': ['/admin'],
  'clinic-psikolog': ['/psikolog'],
  'clinic-owner': ['/owner'],
  'clinic-resepsionis': ['/resepsionis'],
  'clinic-marketing': ['/marketing'],
  'clinic-intern': ['/intern'],
};

/**
 * Map JWT role claim (string from API) ke Role type, return null kalau invalid.
 * User bisa punya multiple roles — pick first clinic-* role found.
 */
export function pickClinicRole(roles: string[] | undefined): Role | null {
  if (!Array.isArray(roles)) return null;
  for (const r of roles) {
    if (ALL_ROLES.includes(r as Role)) {
      return r as Role;
    }
  }
  return null;
}
