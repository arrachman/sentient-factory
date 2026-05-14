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
