/**
 * Aggregator pure-function untuk dashboard owner — semua derive state
 * dari `Booking[]`, `Psikolog[]`, `Room[]`, `slotsPerDay`.
 *
 * Diisolasi di model/ supaya hook/page-nya tipis & gampang di-unit-test
 * tanpa render React.
 */
import type { Booking } from '@/features/admin-booking/model/types';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import type { Room } from '@/features/admin-rooms/model/types';
import { dateKey, pad2 } from './format';

export type Kpi = {
  sesiToday: number;
  utilPsikolog: number;
  utilRuangan: number;
  monthRevenue: number;
  activePsikologCount: number;
  usedRoomCount: number;
  totalRoomCount: number;
};

export type PsikologRowData = {
  p: Psikolog;
  todayCount: number;
  totalActive: number;
};

export type WeekDay = { label: string; count: number; isToday: boolean };

export type RoomGroupAgg = { used: number; max: number };

export type TopService = {
  id?: number;
  name: string;
  category: string;
  count: number;
};

const WEEK_DAY_LABELS = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'];

export function computeKpi({
  todayBookings,
  psikologs,
  rooms,
  allBookings,
  slotsPerDay,
}: {
  todayBookings: Booking[];
  psikologs: Psikolog[];
  rooms: Room[];
  allBookings: Booking[];
  slotsPerDay: number;
}): Kpi {
  const sesiToday = todayBookings.length;
  const totalSlots = psikologs.length * slotsPerDay;
  const utilPsikolog =
    totalSlots > 0 ? Math.round((sesiToday / totalSlots) * 100) : 0;
  const usedRoomIds = new Set(todayBookings.map((b) => b.room.id));
  const utilRuangan =
    rooms.length > 0
      ? Math.round((usedRoomIds.size / rooms.length) * 100)
      : 0;
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`;
  const monthRevenue = allBookings
    .filter(
      (b) =>
        b.status === 'completed' && b.scheduledStart.startsWith(thisMonth),
    )
    .reduce((sum, b) => sum + Number(b.service.basePrice), 0);
  return {
    sesiToday,
    utilPsikolog,
    utilRuangan,
    monthRevenue,
    activePsikologCount: psikologs.length,
    usedRoomCount: usedRoomIds.size,
    totalRoomCount: rooms.length,
  };
}

export function computePsikologPerf({
  psikologs,
  todayBookings,
  allBookings,
}: {
  psikologs: Psikolog[];
  todayBookings: Booking[];
  allBookings: Booking[];
}): PsikologRowData[] {
  return psikologs.map((p) => {
    const todayCount = todayBookings.filter(
      (b) => b.psikologUserId === p.userId,
    ).length;
    const totalActive = new Set(
      allBookings
        .filter(
          (b) =>
            b.psikologUserId === p.userId && b.status !== 'cancelled',
        )
        .map((b) => b.client.id),
    ).size;
    return { p, todayCount, totalActive };
  });
}

export function computeOwnerNote(
  psikologPerf: PsikologRowData[],
  slotsPerDay: number,
): string {
  const under = psikologPerf
    .filter(
      (row) => row.todayCount / slotsPerDay <= 0.3 && row.totalActive < 5,
    )
    .map((row) => row.p.fullName ?? row.p.email);
  if (under.length === 0) {
    return 'Semua psikolog di atas threshold utilisasi 30% — kapasitas merata hari ini.';
  }
  return `${under.slice(0, 2).join(' & ')} masih underutilized hari ini. Pertimbangkan rebalance jadwal atau marketing fokus ke spesialisasi mereka.`;
}

export function computeWeekTrend(allBookings: Booking[]): WeekDay[] {
  const today = new Date();
  const days: WeekDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = dateKey(d);
    const count = allBookings.filter((b) =>
      b.scheduledStart.startsWith(key),
    ).length;
    const dayIdx = (d.getDay() + 6) % 7; // Mon=0
    days.push({ label: WEEK_DAY_LABELS[dayIdx], count, isToday: i === 0 });
  }
  return days;
}

export function computeRoomGroups({
  rooms,
  todayBookings,
  slotsPerDay,
}: {
  rooms: Room[];
  todayBookings: Booking[];
  slotsPerDay: number;
}): Record<string, RoomGroupAgg> {
  const byType: Record<string, RoomGroupAgg> = {};
  for (const r of rooms) {
    const t = r.type ?? 'konseling';
    if (!byType[t]) byType[t] = { used: 0, max: 0 };
    byType[t].max += slotsPerDay;
    const usedSlotsForRoom = todayBookings.filter(
      (b) => b.room.id === r.id,
    ).length;
    byType[t].used += usedSlotsForRoom;
  }
  return byType;
}

export function computeTopServices(allBookings: Booking[]): TopService[] {
  const counts: Record<
    number,
    { name: string; category: string; count: number }
  > = {};
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`;
  for (const b of allBookings) {
    if (b.status === 'cancelled') continue;
    if (!b.scheduledStart.startsWith(thisMonth)) continue;
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
