/**
 * Format helpers untuk halaman Notifikasi WA.
 */
import { RECIPIENT_STYLE, STATUS_STYLE } from './constants';

export function formatTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
  });
}

export function getRecipStyle(r: string) {
  return (
    RECIPIENT_STYLE[r] || {
      bg: 'var(--cream-100)',
      fg: 'var(--fg-muted)',
      label: r,
    }
  );
}

export function getStatusStyle(s: string) {
  return STATUS_STYLE[s] || { bg: 'var(--cream-100)', fg: 'var(--fg-muted)' };
}

export function isToday(iso: string | null): boolean {
  if (!iso) return false;
  const created = new Date(iso);
  const today = new Date();
  return (
    created.getFullYear() === today.getFullYear() &&
    created.getMonth() === today.getMonth() &&
    created.getDate() === today.getDate()
  );
}
