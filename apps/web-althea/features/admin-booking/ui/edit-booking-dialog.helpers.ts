/**
 * Pure helper utilities for edit-booking-dialog.
 * No React dependencies — safe to import from anywhere.
 */

export type Slot = { start: string; end: string; label?: string };

export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function hhmm(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function findSlotIdx(slots: Slot[], startHHMM: string, endHHMM: string): number | null {
  let idx = slots.findIndex((s) => s.start === startHHMM && s.end === endHHMM);
  if (idx === -1) idx = slots.findIndex((s) => s.start === startHHMM);
  return idx === -1 ? null : idx;
}

export function fmtRange(startIso: string, endIso: string): string {
  const s = new Date(startIso);
  const e = new Date(endIso);
  const datePart = s.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
  const t = (d: Date) =>
    d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });
  return `${datePart} · ${t(s)}–${t(e)}`;
}
