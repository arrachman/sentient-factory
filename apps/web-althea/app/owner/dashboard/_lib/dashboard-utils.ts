export function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey(): string {
  return dateKey(new Date());
}

export function formatRupiahShort(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)} jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)} rb`;
  return `Rp ${n.toLocaleString('id-ID')}`;
}

export function formatDateLong(d: Date): string {
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export const DEFAULT_PSIKOLOG_COLOR = 'var(--sage-500)';

export const SVC_DOT: Record<string, string> = {
  konseling: 'var(--sage-500)',
  terapi: '#be8c5a',
  anak: '#daa520',
  tes: '#896db3',
};

export const ROOM_GROUP_LABEL: Record<string, string> = {
  konseling: 'Konseling',
  anak: 'Anak (Terapi & Playground)',
  tes: 'Tes Psikologi',
  seminar: 'Seminar',
};

export const ROOM_GROUP_COLOR: Record<string, string> = {
  konseling: 'var(--sage-500)',
  anak: '#daa520',
  tes: '#896db3',
  seminar: '#4a7090',
};

export const DEFAULT_SLOTS_PER_DAY = 6;
