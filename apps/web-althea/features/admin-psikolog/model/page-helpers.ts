/**
 * Page-level helpers untuk halaman Admin · Psikolog.
 *
 * Stats di file ini adalah STUB — backend belum ada endpoint stats per
 * psikolog (klien aktif, sesi minggu ini, utilisasi, rating). Generate
 * deterministic placeholder dari `psikolog.id` supaya tidak flicker.
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

export type PsikologStats = {
  clients: number;
  weekSessions: number;
  weekCap: number;
  todayClients: number;
  todayMax: number;
  recentlyFreed: boolean;
  utilization: number;
  rating: string;
  since: number;
};

export function stubStats(p: Psikolog): PsikologStats {
  const seed = p.id;
  const clients = 8 + ((seed * 3) % 18);
  const weekCap = [14, 16, 18, 20][seed % 4];
  const weekSessions = Math.max(0, weekCap - (seed % 5));
  const todayMax = 4;
  const todayClients = Math.min(todayMax, seed % 5);
  const recentlyFreed = seed % 7 === 0;
  const utilization = Math.round((weekSessions / weekCap) * 100);
  const rating = (4.6 + ((seed * 13) % 5) / 10).toFixed(1);
  const since = 2018 + (seed % 6);
  return {
    clients,
    weekSessions,
    weekCap,
    todayClients,
    todayMax,
    recentlyFreed,
    utilization,
    rating,
    since,
  };
}

export function weekDistribution(p: Psikolog): number[] {
  const seed = p.id;
  return HARI_SHORT.map((_, i) => Math.max(0, (seed + i * 3) % 5));
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
