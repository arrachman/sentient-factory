'use client';

import { useMemo } from 'react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import { RoomUsageGrid, RoomUsageLegend } from '@/components/clinic/room-usage-grid';
import {
  dateKey,
  DEFAULT_SLOTS_PER_DAY,
  formatDateLong,
  formatRupiahShort,
  pad,
  ROOM_GROUP_COLOR,
  ROOM_GROUP_LABEL,
  todayKey,
} from './_lib/dashboard-utils';
import {
  KpiCard,
  PsikologRow,
  RoomUtilizationRow,
  ServiceRow,
} from './_components/dashboard-widgets';

export default function OwnerDashboardPage() {
  const today = useBookingList({ date: todayKey(), limit: 200, includeCancelled: false });
  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const serviceList = useServiceList({ limit: 200, isActive: true });
  const settingsQuery = useSettings();
  const slotsPerDay = settingsQuery.data?.data.slotsOfDay?.length || DEFAULT_SLOTS_PER_DAY;
  const monthBookings = useBookingList({ limit: 500, includeCancelled: false });

  const todayBookings = today.data?.data ?? [];
  const psikologs = psikologList.data?.data ?? [];
  const rooms = roomList.data?.data ?? [];
  const services = serviceList.data?.data ?? [];
  const allBookings = monthBookings.data?.data ?? [];

  const kpi = useMemo(() => {
    const sesiToday = todayBookings.length;
    const totalSlots = psikologs.length * slotsPerDay;
    const utilPsikolog = totalSlots > 0 ? Math.round((sesiToday / totalSlots) * 100) : 0;
    const usedRoomIds = new Set(todayBookings.map((b) => b.room.id));
    const utilRuangan = rooms.length > 0 ? Math.round((usedRoomIds.size / rooms.length) * 100) : 0;
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
    const monthRevenue = allBookings
      .filter((b) => b.status === 'completed' && b.scheduledStart.startsWith(thisMonth))
      .reduce((sum, b) => sum + Number(b.service.basePrice), 0);
    return { sesiToday, utilPsikolog, utilRuangan, monthRevenue, activePsikologCount: psikologs.length, usedRoomCount: usedRoomIds.size, totalRoomCount: rooms.length };
  }, [todayBookings, psikologs.length, rooms, allBookings, slotsPerDay]);

  const psikologPerf = useMemo(() => psikologs.map((p) => {
    const todayCount = todayBookings.filter((b) => b.psikologUserId === p.userId).length;
    const totalActive = new Set(allBookings.filter((b) => b.psikologUserId === p.userId && b.status !== 'cancelled').map((b) => b.client.id)).size;
    return { p, todayCount, totalActive };
  }), [psikologs, todayBookings, allBookings]);

  const ownerNote = useMemo(() => {
    const under = psikologPerf
      .filter((row) => row.todayCount / slotsPerDay <= 0.3 && row.totalActive < 5)
      .map((row) => row.p.fullName ?? row.p.email);
    return under.length === 0
      ? 'Semua psikolog di atas threshold utilisasi 30% — kapasitas merata hari ini.'
      : `${under.slice(0, 2).join(' & ')} masih underutilized hari ini. Pertimbangkan rebalance jadwal atau marketing fokus ke spesialisasi mereka.`;
  }, [psikologPerf, slotsPerDay]);

  const weekTrend = useMemo(() => {
    const now = new Date();
    const dayLabels = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      const key = dateKey(d);
      return { label: dayLabels[(d.getDay() + 6) % 7], count: allBookings.filter((b) => b.scheduledStart.startsWith(key)).length, isToday: i === 6 };
    });
  }, [allBookings]);

  const weekTotal = weekTrend.reduce((sum, d) => sum + d.count, 0);
  const weekMax = Math.max(...weekTrend.map((d) => d.count), 1);

  const roomGroups = useMemo(() => {
    const byType: Record<string, { used: number; max: number }> = {};
    for (const r of rooms) {
      const t = r.type ?? 'konseling';
      if (!byType[t]) byType[t] = { used: 0, max: 0 };
      byType[t].max += slotsPerDay;
      byType[t].used += todayBookings.filter((b) => b.room.id === r.id).length;
    }
    return byType;
  }, [rooms, todayBookings, slotsPerDay]);

  const topServices = useMemo(() => {
    const counts: Record<number, { name: string; category: string; count: number }> = {};
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
    for (const b of allBookings) {
      if (b.status === 'cancelled' || !b.scheduledStart.startsWith(thisMonth)) continue;
      const id = b.service.id;
      if (!counts[id]) counts[id] = { name: b.service.name, category: b.service.category, count: 0 };
      counts[id].count += 1;
    }
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [allBookings]);

  return (
    <div className="flex flex-col" style={{ padding: 28, gap: 22 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <KpiCard label="Sesi hari ini" value={kpi.sesiToday} sub={`${kpi.activePsikologCount} psikolog · ${kpi.usedRoomCount} ruangan terpakai`} />
        <KpiCard label="Utilisasi psikolog" value={`${kpi.utilPsikolog}%`} sub={`${kpi.activePsikologCount} psikolog · rata-rata ${slotsPerDay} slot`} />
        <KpiCard label="Utilisasi ruangan" value={`${kpi.utilRuangan}%`} sub={`${kpi.usedRoomCount} dari ${kpi.totalRoomCount} ruangan terpakai`} />
        <KpiCard label="Revenue bulan ini" value={kpi.monthRevenue > 0 ? formatRupiahShort(kpi.monthRevenue) : '—'} sub={kpi.monthRevenue > 0 ? 'dari sesi completed' : 'belum ada sesi completed'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
        <div className="card-althea" style={{ padding: 20 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 19, fontWeight: 500, color: 'var(--teal-800)' }}>
              Performa psikolog · hari ini
            </h2>
            <span className="caption">{psikologs.length} psikolog aktif</span>
          </div>
          <div className="flex flex-col gap-2">
            {psikologList.isLoading ? (
              <span className="caption text-fg-muted">Memuat data psikolog...</span>
            ) : psikologPerf.length === 0 ? (
              <span className="caption text-fg-muted">Belum ada psikolog aktif.</span>
            ) : (
              psikologPerf.map((row) => (
                <PsikologRow key={row.p.id} p={row.p} todayCount={row.todayCount} totalActive={row.totalActive} slotsPerDay={slotsPerDay} />
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="card-althea" style={{ padding: 20 }}>
            <h2 style={{ margin: '0 0 14px', fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, color: 'var(--teal-800)' }}>
              Sesi 7 hari terakhir
            </h2>
            <div className="flex" style={{ alignItems: 'flex-end', gap: 8, height: 120 }}>
              {weekTrend.map((d, i) => (
                <div key={i} className="flex flex-col items-center" style={{ flex: 1, gap: 4 }}>
                  <div style={{ width: '100%', height: `${Math.max((d.count / weekMax) * 100, 4)}%`, background: d.isToday ? 'var(--sage-500)' : 'var(--sage-200)', borderRadius: 4 }} title={`${d.label}: ${d.count} sesi`} />
                  <span className="caption" style={{ fontSize: 10 }}>{d.label}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--teal-800)' }}>{d.count}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between" style={{ marginTop: 12 }}>
              <span className="caption">Total · {weekTotal} sesi</span>
              <span className="caption" style={{ color: 'var(--sage-700)', fontWeight: 600 }}>{formatDateLong(new Date()).split(',')[0]}</span>
            </div>
          </div>
          <div className="card-althea" style={{ padding: 16, background: 'var(--info-soft)', borderColor: '#cfdde8' }}>
            <span className="eyebrow" style={{ color: '#2c4a60' }}>Catatan owner</span>
            <p style={{ fontSize: 12.5, color: '#2c4a60', margin: '6px 0 0', lineHeight: 1.5 }}>{ownerNote}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card-althea" style={{ padding: 20 }}>
          <h2 style={{ margin: '0 0 14px', fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, color: 'var(--teal-800)' }}>
            Utilisasi ruangan
          </h2>
          <div className="flex flex-col gap-2">
            {Object.entries(roomGroups).length === 0 ? (
              <span className="caption text-fg-muted">Belum ada ruangan terdaftar.</span>
            ) : (
              Object.entries(roomGroups).map(([type, agg]) => (
                <RoomUtilizationRow key={type} label={ROOM_GROUP_LABEL[type] ?? type} used={agg.used} max={agg.max} color={ROOM_GROUP_COLOR[type] ?? 'var(--sage-500)'} />
              ))
            )}
          </div>
        </div>
        <div className="card-althea" style={{ padding: 20 }}>
          <h2 style={{ margin: '0 0 14px', fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, color: 'var(--teal-800)' }}>
            Layanan terlaris bulan ini
          </h2>
          <div className="flex flex-col">
            {topServices.length === 0 ? (
              <span className="caption text-fg-muted">Belum ada sesi bulan ini.</span>
            ) : (
              topServices.map((s) => <ServiceRow key={s.name} name={s.name} count={s.count} category={s.category} />)
            )}
            <span className="caption" style={{ marginTop: 8, fontSize: 10.5 }}>Total katalog: {services.length} layanan aktif</span>
          </div>
        </div>
      </div>

      <div className="card-althea overflow-hidden">
        <div className="flex items-start justify-between gap-3 flex-wrap" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
          <div className="flex flex-col">
            <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 500, color: 'var(--teal-800)' }}>
              Pemakaian Ruangan · Slot × Ruangan
            </h2>
            <span className="caption" style={{ marginTop: 2 }}>Read-only · ringkasan untuk pencarian ruangan kosong.</span>
          </div>
          {psikologs.length > 0 && <RoomUsageLegend psikologs={psikologs} compact />}
        </div>
        {rooms.length === 0 ? (
          <div className="py-12 text-center text-fg-muted text-sm">Belum ada ruangan terdaftar.</div>
        ) : (
          <RoomUsageGrid rooms={rooms} bookings={todayBookings} dateKey={todayKey()} compact />
        )}
      </div>
    </div>
  );
}
