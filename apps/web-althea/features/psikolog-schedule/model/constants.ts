/**
 * Konstanta UI untuk halaman Jadwal Saya (psikolog).
 * Granularitas 1 jam (08–17), 6 hari kerja (Sen–Sab).
 */
export const SLOTS = [
  '08.00',
  '09.00',
  '10.00',
  '11.00',
  '12.00',
  '13.00',
  '14.00',
  '15.00',
  '16.00',
  '17.00',
];

export const SLOT_BASE_HOUR = 8;
export const SLOT_HEIGHT = 56; // px

// 7 hari penuh (Sen-Min) untuk grid Minggu — biar admin/psikolog selalu lihat
// Sabtu+Minggu untuk konteks libur, bukan cuma hari kerja.
export const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
export const DAY_LABELS_FULL = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export type ViewMode = 'Hari' | 'Minggu' | 'Bulan';

// ============================================================================
// Filter constants
// ============================================================================

export type StatusFilter = 'all' | 'next' | 'now' | 'done';
export type CategoryFilter = 'all' | 'konseling' | 'terapi' | 'anak' | 'tes';
export type SesiTypeFilter = 'all' | 'tunggal' | 'multi' | 'last';

export const STATUS_FILTER_LABEL: Record<StatusFilter, string> = {
  all: 'Semua',
  next: 'Akan datang',
  now: 'Berlangsung',
  done: 'Selesai',
};

export const CATEGORY_FILTER_LABEL: Record<CategoryFilter, string> = {
  all: 'Semua',
  konseling: 'Konseling',
  terapi: 'Terapi',
  anak: 'Anak',
  tes: 'Tes',
};

export const SESI_TYPE_LABEL: Record<SesiTypeFilter, string> = {
  all: 'Semua',
  tunggal: 'Tunggal',
  multi: 'Paket',
  last: 'Sesi akhir',
};

export type ScheduleFilters = {
  status: StatusFilter;
  category: CategoryFilter;
  sesiType: SesiTypeFilter;
  clientQuery: string;
};

export const EMPTY_FILTERS: ScheduleFilters = {
  status: 'all',
  category: 'all',
  sesiType: 'all',
  clientQuery: '',
};
