/**
 * Domain types untuk halaman "Klien saya" di akun psikolog.
 * Aggregated dari endpoint /clinic/booking?psikologUserId=...
 */
export type ClientStatus = 'aktif' | 'baru' | 'paket selesai';
export type RiskLevel = 'rendah' | 'sedang' | 'tinggi' | 'belum dinilai';

export type AggregatedClient = {
  id: number;
  name: string;
  initial: string;
  category: string;
  age: number | null;
  service: string;
  sessionN: number;
  sessionTotal: number;
  next: string;
  nextRoom: string | null;
  status: ClientStatus;
  risk: RiskLevel;
  wa: string;
  email: string;
  totalBookings: number;
  lastSession: string | null;
  lastGap: number | null;
  flags: string[];
};

export const RISK_TONE: Record<
  RiskLevel,
  { bg: string; fg: string; dot: string }
> = {
  rendah: {
    bg: 'var(--success-soft, #e0eee2)',
    fg: 'var(--success, #4f8c5b)',
    dot: 'var(--success, #4f8c5b)',
  },
  sedang: {
    bg: 'var(--warn-soft, #fbf3dc)',
    fg: '#8a4a00',
    dot: '#c98a00',
  },
  tinggi: {
    bg: 'var(--danger-soft, #fce4e4)',
    fg: 'var(--danger, #b54141)',
    dot: 'var(--danger, #b54141)',
  },
  'belum dinilai': {
    bg: 'var(--cream-200)',
    fg: 'var(--fg-muted)',
    dot: 'var(--fg-muted)',
  },
};

export const STATUS_TONE: Record<ClientStatus, { bg: string; fg: string }> = {
  aktif: { bg: 'var(--sage-100)', fg: 'var(--sage-800)' },
  baru: { bg: 'var(--teal-700)', fg: '#fff' },
  'paket selesai': { bg: 'var(--cream-200)', fg: 'var(--fg-muted)' },
};

export const CATEGORY_OPTIONS = [
  'Semua',
  'Anak',
  'Remaja',
  'Dewasa',
  'Pasangan',
  'Keluarga',
] as const;

export type CategoryOption = (typeof CATEGORY_OPTIONS)[number];
export type StatusTab = 'Semua' | 'Aktif' | 'Baru' | 'Selesai';
export type SortKey = 'next' | 'name' | 'risk';
