/**
 * Constants UI Owner Dashboard.
 */
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

/**
 * Fallback ketika ClinicSettings.slotsOfDay belum loaded atau kosong.
 */
export const DEFAULT_SLOTS_PER_DAY = 4;
