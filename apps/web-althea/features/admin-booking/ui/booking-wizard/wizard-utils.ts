function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function tomorrowDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toDateKey(d);
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function buildIso(dateStr: string, timeHHMM: string): string {
  const d = new Date(`${dateStr}T${timeHHMM}:00`);
  return d.toISOString();
}

/** Tanggal hari ini (TZ lokal admin = WIB) sebagai YYYY-MM-DD. */
export function todayDateStr(): string {
  return toDateKey(new Date());
}

/** True kalau `dateStr` jatuh sebelum hari ini (sudah lampau). */
export function isPastDate(dateStr: string): boolean {
  if (!dateStr) return false;
  return dateStr < todayDateStr();
}

/**
 * Set index slot yang waktunya sudah terlewat.
 * Hanya relevan saat `dateStr` == hari ini — slot dengan jam mulai <= sekarang
 * di-block. Untuk tanggal masa depan: kosong. Tanggal lampau: semua slot
 * (tanggalnya sendiri sudah di-block di DateStrip, ini jaring pengaman).
 */
export function pastSlotIdx(
  dateStr: string,
  slots: { start: string }[],
): Set<number> {
  const past = new Set<number>();
  if (!dateStr) return past;
  const today = todayDateStr();
  if (dateStr > today) return past;
  if (dateStr < today) {
    slots.forEach((_, i) => past.add(i));
    return past;
  }
  const now = Date.now();
  slots.forEach((slot, i) => {
    const start = new Date(`${dateStr}T${slot.start}:00`).getTime();
    if (start <= now) past.add(i);
  });
  return past;
}
