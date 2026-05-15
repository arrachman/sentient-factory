/**
 * Format helpers untuk halaman User & Role.
 */
import type { ClinicRoleName, ClinicUser } from './types';
import { ROLE_INFO, type RoleInfo } from './role-config';

/**
 * User punya array roles (multiple). Pilih yang pertama kena ROLE_INFO
 * sebagai "primary" — dipakai untuk warna avatar & badge tabel.
 */
export function pickPrimaryRole(u: ClinicUser): RoleInfo | null {
  for (const r of u.roles) {
    const info = ROLE_INFO.find((x) => x.key === (r.name as ClinicRoleName));
    if (info) return info;
  }
  return null;
}

/**
 * Render `lastLogin` sebagai relative time:
 *   < 5 menit  → "Sekarang aktif"
 *   < 1 jam    → "X menit lalu"
 *   < 24 jam   → "X jam lalu"
 *   = 1 hari   → "Kemarin · HH:mm"
 *   < 7 hari   → "X hari lalu"
 *   else       → tanggal panjang
 */
export function formatLastLogin(iso: string | null): string {
  if (!iso) return 'Belum pernah';
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 5) return 'Sekarang aktif';
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  const day = Math.floor(hr / 24);
  if (day === 1) {
    return (
      'Kemarin · ' +
      d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    );
  }
  if (day < 7) return `${day} hari lalu`;
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format absolute timestamp untuk subline aktivitas terakhir.
 * "12 Mei 2026 · 14:30" — atau "—" kalau belum pernah login.
 */
export function formatLoginTimestamp(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  const tanggal = d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const jam = d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${tanggal} · ${jam}`;
}

export function userInitial(u: ClinicUser): string {
  return (u.fullName || u.username || u.email).slice(0, 2).toUpperCase();
}
