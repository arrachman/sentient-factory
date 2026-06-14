/**
 * Konstanta UI domain Admin · Penjadwalan.
 */
import type { Filters, SlotDef, TimeOfDay } from './types';

export const SVC_COLOR: Record<
  string,
  { fill: string; bar: string; text: string }
> = {
  konseling: {
    fill: 'rgba(91,138,102,0.12)',
    bar: 'var(--sage-500)',
    text: 'var(--teal-800)',
  },
  terapi: { fill: 'rgba(190,140,90,0.14)', bar: '#be8c5a', text: '#5a3d20' },
  anak: { fill: 'rgba(218,165,32,0.16)', bar: '#daa520', text: '#5e4310' },
  tes: { fill: 'rgba(137,109,179,0.14)', bar: '#896db3', text: '#3e2c5e' },
};

export const SVC_CATEGORIES = [
  'konseling',
  'terapi',
  'anak',
  'tes',
] as const;

export const SVC_LABEL: Record<string, string> = {
  konseling: 'Konseling',
  terapi: 'Terapi',
  anak: 'Anak',
  tes: 'Tes',
};

export const DAY_LABELS_SHORT = [
  'Sen',
  'Sel',
  'Rab',
  'Kam',
  'Jum',
  'Sab',
  'Min',
];

export const TIME_OF_DAY_LABEL: Record<
  TimeOfDay,
  { label: string; range: string }
> = {
  pagi: { label: 'Pagi', range: '08–12' },
  siang: { label: 'Siang', range: '13–16' },
  sore: { label: 'Sore', range: '17–21' },
};

export const EMPTY_FILTERS: Filters = {
  psikologIds: new Set(),
  categories: new Set(),
  roomIds: new Set(),
  statuses: new Set(),
  clientQuery: '',
  timeOfDay: new Set(),
  serviceIds: new Set(),
  sesiType: 'all',
};
