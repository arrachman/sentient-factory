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
 */
export const ROLE_DEFAULT_ROUTE: Record<Role, string> = {
  'clinic-admin': '/dashboard',
  'clinic-psikolog': '/dashboard',
  'clinic-owner': '/dashboard',
  'clinic-resepsionis': '/dashboard',
  'clinic-marketing': '/dashboard',
  'clinic-intern': '/dashboard',
};

/**
 * Mapping route prefix → role yang boleh akses.
 * Admin bypass (akses semua) di-handle terpisah di middleware.
 *
 * Route group syntax `(name)` di Next.js tidak mempengaruhi URL —
 * semua role landing di `/dashboard`, route group menentukan layout
 * & components yang dirender.
 */
export const ROLE_ROUTE_PREFIXES: Record<Role, string[]> = {
  'clinic-admin': [
    '/dashboard',
    '/psikolog',
    '/layanan',
    '/rooms',
    '/clients',
    '/users-roles',
    '/notif-wa',
    '/audit-log',
    '/pengaturan',
  ],
  'clinic-psikolog': ['/dashboard', '/schedule', '/sessions', '/patients'],
  'clinic-owner': ['/dashboard'],
  'clinic-resepsionis': ['/dashboard'],
  'clinic-marketing': ['/dashboard'],
  'clinic-intern': ['/dashboard'],
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
