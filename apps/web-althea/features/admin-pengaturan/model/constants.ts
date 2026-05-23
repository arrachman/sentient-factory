/**
 * Konstanta domain Pengaturan klinik.
 *
 * - SETTINGS_TABS: daftar tab kiri di sidebar pengaturan
 * - HARI: 7 hari urut Senin–Minggu (key id sengaja English supaya match
 *   day-of-week index 0=Sun..6=Sat di JS Date.getDay())
 * - DEFAULT_SLOT: bentuk default saat user tambah slot baru
 */
import type { SlotDef } from '../api/settings.api';

export const SETTINGS_TABS = [
  { key: 'klinik', label: 'Profil Klinik', hint: 'Identitas & kontak' },
  { key: 'slot', label: 'Slot Operasional', hint: 'Jam slot booking & hari tutup' },
  {
    key: 'pembayaran',
    label: 'Pembayaran',
    hint: 'Metode & invoice',
    disabled: true,
    reason: 'Add-on · tidak aktif di Paket Standard',
  },
  {
    key: 'keamanan',
    label: 'Keamanan',
    hint: 'Sesi & akses',
    disabled: true,
    reason: 'Add-on · tidak aktif di Paket Standard',
  },
] as const;

export type TabKey = (typeof SETTINGS_TABS)[number]['key'];

/** Hari dengan index sesuai JS Date.getDay() (0=Sun..6=Sat). */
export const HARI: Array<{ index: number; label: string }> = [
  { index: 1, label: 'Senin' },
  { index: 2, label: 'Selasa' },
  { index: 3, label: 'Rabu' },
  { index: 4, label: 'Kamis' },
  { index: 5, label: 'Jumat' },
  { index: 6, label: 'Sabtu' },
  { index: 0, label: 'Minggu' },
];

export const DEFAULT_SLOT: SlotDef = {
  start: '09:00',
  end: '10:30',
  label: '',
};
