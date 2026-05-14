import type { Booking } from '@/features/admin-booking/model/types';

export type ClientStatus = 'aktif' | 'baru' | 'paket selesai';
export type RiskLevel = 'rendah' | 'sedang' | 'tinggi' | 'belum dinilai';

export type AggregatedClient = {
  id: number;
  name: string;
  initial: string;
  category: string;
  age: number | null;
  service: string;
  sessionN: number;
  sessionTotal: number;
  next: string;
  nextRoom: string | null;
  status: ClientStatus;
  risk: RiskLevel;
  wa: string;
  email: string;
  totalBookings: number;
  lastSession: string | null;
  lastGap: number | null;
  flags: string[];
};

export const RISK_TONE: Record<RiskLevel, { bg: string; fg: string; dot: string }> = {
  rendah: { bg: 'var(--success-soft, #e0eee2)', fg: 'var(--success, #4f8c5b)', dot: 'var(--success, #4f8c5b)' },
  sedang: { bg: 'var(--warn-soft, #fbf3dc)', fg: '#8a4a00', dot: '#c98a00' },
  tinggi: { bg: 'var(--danger-soft, #fce4e4)', fg: 'var(--danger, #b54141)', dot: 'var(--danger, #b54141)' },
  'belum dinilai': { bg: 'var(--cream-200)', fg: 'var(--fg-muted)', dot: 'var(--fg-muted)' },
};

export const STATUS_TONE: Record<ClientStatus, { bg: string; fg: string }> = {
  aktif: { bg: 'var(--sage-100)', fg: 'var(--sage-800)' },
  baru: { bg: 'var(--teal-700)', fg: '#fff' },
  'paket selesai': { bg: 'var(--cream-200)', fg: 'var(--fg-muted)' },
};

export const CATEGORY_OPTIONS = ['Semua', 'Anak', 'Remaja', 'Dewasa', 'Pasangan', 'Keluarga'] as const;

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatNext(start: Date): string {
  const today = new Date();
  if (isSameDay(start, today)) {
    return `Hari ini · ${start.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  }
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (isSameDay(start, tomorrow)) {
    return `Besok · ${start.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return (
    start.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) +
    ` · ${start.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
  );
}

function clientInitial(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function deriveStatus(totalBookings: number, sessionN: number, sessionTotal: number): ClientStatus {
  if (totalBookings === 1) return 'baru';
  if (sessionTotal > 0 && sessionN >= sessionTotal) return 'paket selesai';
  return 'aktif';
}

// Risk stub — backend belum punya GAD-7/PHQ-9. Derive dari activity gap sebagai placeholder.
function deriveRisk(lastGapDays: number | null, totalBookings: number): RiskLevel {
  if (totalBookings <= 1) return 'belum dinilai';
  if (lastGapDays === null) return 'belum dinilai';
  if (lastGapDays > 21) return 'sedang';
  if (lastGapDays < 7) return 'rendah';
  return 'belum dinilai';
}

export function aggregateClients(bookings: Booking[]): AggregatedClient[] {
  const map = new Map<number, AggregatedClient & { _bookings: Booking[] }>();
  for (const b of bookings) {
    const cid = b.client.id;
    const existing = map.get(cid);
    if (existing) {
      existing._bookings.push(b);
      existing.totalBookings += 1;
    } else {
      map.set(cid, {
        id: cid,
        name: b.client.name,
        initial: clientInitial(b.client.name),
        category: 'Dewasa',
        age: null,
        service: b.service.name,
        sessionN: b.sessionN,
        sessionTotal: b.sessionTotal,
        next: '—',
        nextRoom: null,
        status: 'aktif',
        risk: 'belum dinilai',
        wa: b.client.phoneWa,
        email: '',
        totalBookings: 1,
        lastSession: null,
        lastGap: null,
        flags: [],
        _bookings: [b],
      });
    }
  }

  const now = new Date();
  const out: AggregatedClient[] = [];
  for (const c of map.values()) {
    const sortedFuture = c._bookings
      .filter(
        (b) =>
          new Date(b.scheduledStart) >= now &&
          b.status !== 'cancelled' &&
          b.status !== 'completed',
      )
      .sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime());
    const nextBooking = sortedFuture[0];
    if (nextBooking) {
      c.next = formatNext(new Date(nextBooking.scheduledStart));
      c.nextRoom = nextBooking.room.name;
      c.service = nextBooking.service.name;
      c.sessionN = nextBooking.sessionN;
      c.sessionTotal = nextBooking.sessionTotal;
    }

    const sortedPast = c._bookings
      .filter((b) => b.status === 'completed' || new Date(b.scheduledStart) < now)
      .sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime());
    const lastBooking = sortedPast[0];
    if (lastBooking) {
      const lastDate = new Date(lastBooking.scheduledStart);
      c.lastSession = lastDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      c.lastGap = Math.max(
        0,
        Math.floor((now.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000)),
      );
    }

    c.status = deriveStatus(c.totalBookings, c.sessionN, c.sessionTotal);
    c.risk = deriveRisk(c.lastGap, c.totalBookings);

    if (c.totalBookings === 1 && c.status === 'baru') c.flags.push('intake');
    if (c.totalBookings >= 5 && c.status === 'aktif') c.flags.push('high-engagement');
    if (c.status === 'paket selesai') c.flags.push('terminasi');

    out.push(c);
  }

  return out;
}

// suppress unused warning — pad is used internally only
void pad;
