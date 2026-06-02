import {
  GENDER_LABEL,
  type ClientStatus,
} from '@/features/admin-clients/model/types';
import type { BookingStatus } from '@/features/admin-booking/model/types';

export const STATUS_STYLE: Record<BookingStatus, { bg: string; color: string }> = {
  checked_in: { bg: '#dbeafe', color: '#1e40af' },
  in_progress: { bg: '#5b8a66', color: '#fff' },
  completed: { bg: '#ece6d3', color: '#6b6047' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

export const CLIENT_STATUS_STYLE: Record<ClientStatus, { bg: string; color: string }> = {
  aktif: { bg: '#dcebe0', color: '#385a43' },
  baru: { bg: '#fef3c7', color: '#92400e' },
  selesai: { bg: '#ece6d3', color: '#6b6047' },
};

export const DEFAULT_AVATAR_PALETTE = { bg: '#dcebe0', fg: '#385a43' };

export const SVC_CATEGORY_LABEL: Record<string, string> = {
  konseling: 'Konseling',
  terapi: 'Terapi Dewasa',
  anak: 'Terapi Anak',
  tes: 'Tes Psikologi',
};

export function genderLabel(g: string | null | undefined): string {
  if (!g) return '—';
  if (g === 'L' || g === 'P') return GENDER_LABEL[g];
  if (g === 'male') return 'Laki-laki';
  if (g === 'female') return 'Perempuan';
  return g;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatLongDate(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateMedium(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
