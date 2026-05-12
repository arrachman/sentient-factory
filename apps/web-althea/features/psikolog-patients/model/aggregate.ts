/**
 * Aggregator: dari array Booking[] ke AggregatedClient[].
 *
 * Dipakai saat psikolog buka halaman "Klien saya". Backend belum punya
 * endpoint khusus per-psikolog × per-klien, jadi kita derive dari list
 * booking yang owned by psikolog yg sedang login.
 *
 * Derivation rules:
 *   - status: 1 booking → 'baru'; sessionN >= sessionTotal → 'paket selesai';
 *     else 'aktif'
 *   - risk: stub berdasarkan gap waktu sesi terakhir (backend belum punya
 *     PHQ-9 / GAD-7 endpoint). 21 hari+ → 'sedang'; <7 hari → 'rendah'.
 *   - flags: 'intake' (klien baru), 'high-engagement' (>=5 sesi),
 *     'terminasi' (paket selesai).
 *   - next: booking terdekat di masa depan yang masih aktif.
 *   - lastGap: jumlah hari sejak sesi terakhir (selesai atau lewat).
 */
import type { Booking } from '@/features/admin-booking/model/types';
import type {
  AggregatedClient,
  ClientStatus,
  RiskLevel,
} from './types';
import { clientInitial, formatNext } from './format';

export function deriveStatus(
  totalBookings: number,
  sessionN: number,
  sessionTotal: number,
): ClientStatus {
  if (totalBookings === 1) return 'baru';
  if (sessionTotal > 0 && sessionN >= sessionTotal) return 'paket selesai';
  return 'aktif';
}

export function deriveRisk(
  lastGapDays: number | null,
  totalBookings: number,
): RiskLevel {
  if (totalBookings <= 1) return 'belum dinilai';
  if (lastGapDays === null) return 'belum dinilai';
  if (lastGapDays > 21) return 'sedang';
  if (lastGapDays < 7) return 'rendah';
  return 'belum dinilai';
}

type AggInternal = AggregatedClient & { _bookings: Booking[] };

function makeBaseClient(b: Booking): AggInternal {
  return {
    id: b.client.id,
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
  };
}

function applyNextBooking(c: AggInternal, now: Date) {
  const sortedFuture = c._bookings
    .filter(
      (b) =>
        new Date(b.scheduledStart) >= now &&
        b.status !== 'cancelled' &&
        b.status !== 'completed',
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledStart).getTime() -
        new Date(b.scheduledStart).getTime(),
    );
  const next = sortedFuture[0];
  if (next) {
    c.next = formatNext(new Date(next.scheduledStart));
    c.nextRoom = next.room.name;
    c.service = next.service.name;
    c.sessionN = next.sessionN;
    c.sessionTotal = next.sessionTotal;
  }
}

function applyLastSession(c: AggInternal, now: Date) {
  const sortedPast = c._bookings
    .filter(
      (b) =>
        b.status === 'completed' || new Date(b.scheduledStart) < now,
    )
    .sort(
      (a, b) =>
        new Date(b.scheduledStart).getTime() -
        new Date(a.scheduledStart).getTime(),
    );
  const last = sortedPast[0];
  if (last) {
    const lastDate = new Date(last.scheduledStart);
    c.lastSession = lastDate.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
    });
    c.lastGap = Math.max(
      0,
      Math.floor((now.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000)),
    );
  }
}

function applyFlags(c: AggInternal) {
  if (c.totalBookings === 1 && c.status === 'baru') c.flags.push('intake');
  if (c.totalBookings >= 5 && c.status === 'aktif')
    c.flags.push('high-engagement');
  if (c.status === 'paket selesai') c.flags.push('terminasi');
}

export function aggregateClients(bookings: Booking[]): AggregatedClient[] {
  const map = new Map<number, AggInternal>();
  for (const b of bookings) {
    const cid = b.client.id;
    const existing = map.get(cid);
    if (existing) {
      existing._bookings.push(b);
      existing.totalBookings += 1;
    } else {
      map.set(cid, makeBaseClient(b));
    }
  }

  const now = new Date();
  const out: AggregatedClient[] = [];
  for (const c of map.values()) {
    applyNextBooking(c, now);
    applyLastSession(c, now);
    c.status = deriveStatus(c.totalBookings, c.sessionN, c.sessionTotal);
    c.risk = deriveRisk(c.lastGap, c.totalBookings);
    applyFlags(c);
    out.push(c);
  }
  return out;
}
