/**
 * Aggregator pure-function untuk Owner Dashboard & Analitik.
 *
 * Semua agregat di-derive dari `Booking[]` yang sudah di-scope ke periode aktif
 * (Harian / Mingguan / Bulanan) + master data (psikolog, room, service) +
 * `slotsPerDay` global.
 */
import type { Booking } from '@/features/admin-booking/model/types';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import type { Room } from '@/features/admin-rooms/model/types';
import { dateKey } from './format';
import type { PeriodRange } from './period';

export type Kpi = {
  sesiPeriod: number;
  utilPsikolog: number;
  utilRuangan: number;
  periodRevenue: number;
  activePsikologCount: number;
  usedRoomCount: number;
  totalRoomCount: number;
};

export type PsikologRowData = {
  p: Psikolog;
  periodCount: number;
  totalActive: number;
};

export type TrendBar = {
  key: string;
  label: string;
  sub: string;
  count: number;
  isCurrent: boolean;
};

export type RoomGroupAgg = { used: number; max: number };

export type TopService = {
  id?: number;
  name: string;
  category: string;
  count: number;
};

const WEEK_DAY_LABELS = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
  'Minggu',
];

export function computeKpi({
  periodBookings,
  psikologs,
  rooms,
  slotsPerDay,
  rangeDays,
}: {
  periodBookings: Booking[];
  psikologs: Psikolog[];
  rooms: Room[];
  slotsPerDay: number;
  rangeDays: number;
}): Kpi {
  const sesiPeriod = periodBookings.length;
  const dayCount = Math.max(rangeDays, 1);
  const totalPsikologSlots = psikologs.length * slotsPerDay * dayCount;
  const utilPsikolog =
    totalPsikologSlots > 0
      ? Math.round((sesiPeriod / totalPsikologSlots) * 100)
      : 0;
  const totalRoomSlots = rooms.length * slotsPerDay * dayCount;
  const usedRoomSlots = periodBookings.length;
  const utilRuangan =
    totalRoomSlots > 0
      ? Math.round((usedRoomSlots / totalRoomSlots) * 100)
      : 0;
  const usedRoomIds = new Set(periodBookings.map((b) => b.room.id));
  const periodRevenue = periodBookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + Number(b.service.basePrice), 0);
  return {
    sesiPeriod,
    utilPsikolog,
    utilRuangan,
    periodRevenue,
    activePsikologCount: psikologs.length,
    usedRoomCount: usedRoomIds.size,
    totalRoomCount: rooms.length,
  };
}

export function computePsikologPerf({
  psikologs,
  periodBookings,
}: {
  psikologs: Psikolog[];
  periodBookings: Booking[];
}): PsikologRowData[] {
  return psikologs.map((p) => {
    const periodCount = periodBookings.filter(
      (b) => b.psikologUserId === p.userId,
    ).length;
    const totalActive = new Set(
      periodBookings
        .filter(
          (b) =>
            b.psikologUserId === p.userId && b.status !== 'cancelled',
        )
        .map((b) => b.client.id),
    ).size;
    return { p, periodCount, totalActive };
  });
}

export function computeOwnerNote(
  psikologPerf: PsikologRowData[],
  slotsPerDay: number,
  rangeDays: number,
): string {
  const denom = slotsPerDay * Math.max(rangeDays, 1);
  const under = psikologPerf
    .filter((row) => row.periodCount / denom <= 0.3 && row.totalActive < 5)
    .map((row) => row.p.fullName ?? row.p.email);
  if (under.length === 0) {
    return 'Semua psikolog di atas threshold utilisasi 30% — kapasitas merata di periode ini.';
  }
  return `${under.slice(0, 2).join(' & ')} masih underutilized di periode ini. Pertimbangkan rebalance jadwal atau marketing fokus ke spesialisasi mereka.`;
}

/**
 * Trend bars per periode:
 *  - Harian:   6 bar per slot operasional (anchor day)
 *  - Mingguan: 7 bar per hari
 *  - Bulanan:  N bar per hari
 */
export function computeTrend({
  range,
  periodBookings,
  slotsOfDay,
}: {
  range: PeriodRange;
  periodBookings: Booking[];
  slotsOfDay: { start: string; end: string }[];
}): TrendBar[] {
  if (range.mode === 'Harian') {
    const dayBookings = periodBookings.filter((b) =>
      b.scheduledStart.startsWith(range.anchor),
    );
    const bars: TrendBar[] = slotsOfDay.map((s, idx) => {
      const count = dayBookings.filter((b) => {
        const t = b.scheduledStart.slice(11, 16);
        return t === s.start;
      }).length;
      return {
        key: `slot-${idx}`,
        label: `Slot ${idx + 1}`,
        sub: `${s.start}–${s.end}`,
        count,
        isCurrent: false,
      };
    });
    return bars;
  }

  const today = dateKey(new Date());
  return range.days.map((key) => {
    const d = new Date(key);
    const dayIdx = (d.getDay() + 6) % 7;
    const count = periodBookings.filter((b) =>
      b.scheduledStart.startsWith(key),
    ).length;
    const sub = d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
    return {
      key,
      label:
        range.mode === 'Mingguan'
          ? WEEK_DAY_LABELS[dayIdx]
          : String(d.getDate()),
      sub,
      count,
      isCurrent: key === today,
    };
  });
}

export function computeRoomGroups({
  rooms,
  periodBookings,
  slotsPerDay,
  rangeDays,
}: {
  rooms: Room[];
  periodBookings: Booking[];
  slotsPerDay: number;
  rangeDays: number;
}): Record<string, RoomGroupAgg> {
  const byType: Record<string, RoomGroupAgg> = {};
  const days = Math.max(rangeDays, 1);
  for (const r of rooms) {
    const t = r.type ?? 'konseling';
    if (!byType[t]) byType[t] = { used: 0, max: 0 };
    byType[t].max += slotsPerDay * days;
    const usedSlotsForRoom = periodBookings.filter(
      (b) => b.room.id === r.id,
    ).length;
    byType[t].used += usedSlotsForRoom;
  }
  return byType;
}

export function computeTopServices(periodBookings: Booking[]): TopService[] {
  const counts: Record<
    number,
    { name: string; category: string; count: number }
  > = {};
  for (const b of periodBookings) {
    if (b.status === 'cancelled') continue;
    const id = b.service.id;
    if (!counts[id]) {
      counts[id] = {
        name: b.service.name,
        category: b.service.category,
        count: 0,
      };
    }
    counts[id].count += 1;
  }
  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}
