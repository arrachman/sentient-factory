/**
 * Konstanta UI untuk halaman Notifikasi WA.
 */
import type { CreateTemplateInput, WaCategory } from './types';

export const CATEGORY_HINT: Record<WaCategory, string> = {
  pengingat: 'Cron-scheduled berdasarkan booking',
  jadwal: 'Dipicu oleh aksi admin',
  onboarding: 'Pendaftaran klien & staff',
  bayar: 'DP, pelunasan, bukti bayar',
};

export const RECIPIENT_STYLE: Record<
  string,
  { bg: string; fg: string; label: string }
> = {
  klien: { bg: 'var(--sage-100)', fg: 'var(--sage-800)', label: 'klien' },
  psikolog: { bg: '#dde8f1', fg: '#3b5b75', label: 'psikolog' },
  staff: { bg: 'var(--cream-200)', fg: '#6b5320', label: 'staff' },
  user: { bg: 'var(--info-soft)', fg: 'var(--info)', label: 'user' },
};

export const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  dibaca: { bg: 'var(--success-soft)', fg: 'var(--success)' },
  sampai: { bg: 'var(--info-soft)', fg: 'var(--info)' },
  terkirim: { bg: 'var(--info-soft)', fg: 'var(--info)' },
  gagal: { bg: 'var(--danger-soft)', fg: 'var(--danger)' },
  queued: { bg: 'var(--warning-soft)', fg: '#8a4a00' },
};

export const COMMON_VARIABLES = [
  '{{nama_klien}}',
  '{{tanggal}}',
  '{{waktu_sesi}}',
  '{{nama_psikolog}}',
  '{{nama_ruangan}}',
  '{{nama_layanan}}',
  '{{no_rekam_medis}}',
  '{{kode_otp}}',
  '{{jumlah_dp}}',
  '{{link_feedback}}',
  '{{alasan_reschedule}}',
];

export const EMPTY_TEMPLATE: CreateTemplateInput = {
  name: '',
  category: 'pengingat',
  triggerEvent: '',
  body: '',
  recipients: ['klien'],
  isActive: true,
};
