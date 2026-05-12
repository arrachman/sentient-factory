/**
 * Domain types untuk halaman Admin · Penjadwalan.
 */
import type { BookingStatus } from '@/features/admin-booking/model/types';

export type SlotDef = { start: string; end: string };

export type ViewMode = 'Hari' | 'Minggu' | 'Bulan';

export type TimeOfDay = 'pagi' | 'siang' | 'sore';
export type SesiType = 'all' | 'tunggal' | 'multi' | 'last';

export type Filters = {
  // Basic
  psikologIds: Set<number>;
  categories: Set<string>;
  roomIds: Set<number>;
  statuses: Set<BookingStatus>;
  // Advanced
  clientQuery: string;
  timeOfDay: Set<TimeOfDay>;
  serviceIds: Set<number>;
  sesiType: SesiType;
};
