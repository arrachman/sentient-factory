/**
 * Page-level helpers untuk halaman Admin · Psikolog.
 *
 * Stats di-zero sampai backend menyediakan endpoint stats per psikolog
 * (klien aktif, sesi minggu ini, utilisasi, rating). Jangan tampilkan
 * angka palsu — psikolog baru harus terlihat kosong di dashboard.
 */
import { SPECIALTY_LABEL, type Psikolog } from './types';

export const FILTER_TABS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'Semua' },
  { key: 'klinis_dewasa', label: 'Klinis Dewasa' },
  { key: 'anak_remaja', label: 'Anak & Remaja' },
  { key: 'tes_psikologi', label: 'Tes' },
  { key: 'keluarga', label: 'Keluarga' },
];

export const HARI_SHORT = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function specialtyLabel(s: string): string {
  return SPECIALTY_LABEL[s] ?? s;
}

export function psikologInitial(p: Psikolog): string {
  return (p.fullName ?? p.email).slice(0, 2).toUpperCase();
}

/**
 * Ambil specialty pertama untuk display singkat di card; kalau null,
 * fallback ke `title`.
 */
export function primarySpecialtyText(p: Psikolog): string {
  if (Array.isArray(p.specialty) && p.specialty.length > 0) {
    return specialtyLabel(p.specialty[0]);
  }
  return p.title ?? '';
}
