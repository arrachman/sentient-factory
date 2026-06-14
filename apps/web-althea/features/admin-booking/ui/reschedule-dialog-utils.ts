import { toDateKey } from './booking-wizard/wizard-utils';

export function isoToDateKey(iso: string): string {
  return toDateKey(new Date(iso));
}

export function isoToTimeHHMM(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
