'use client';

import { useMemo } from 'react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import { SPECIALTY_LABEL, type Psikolog } from '@/features/admin-psikolog/model/types';
import { RoomUsageGrid, RoomUsageLegend } from '@/components/clinic/room-usage-grid';

// ============================================================================
// Helpers
// ============================================================================

function pad(n: number) {
  return String(n).padStart(2, '0');
}
function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function todayKey(): string {
  return dateKey(new Date());
}
function formatRupiahShort(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)} jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)} rb`;
  return `Rp ${n.toLocaleString('id-ID')}`;
}
function formatDateLong(d: Date): string {
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

const DEFAULT_PSIKOLOG_COLOR = 'var(--sage-500)';
const SVC_DOT: Record<string, string> = {
  konseling: 'var(--sage-500)',
  terapi: '#be8c5a',
  anak: '#daa520',
  tes: '#896db3',
};

// Group rooms by type → label
const ROOM_GROUP_LABEL: Record<string, string> = {
  konseling: 'Konseling',
  anak: 'Anak (Terapi & Playground)',
  tes: 'Tes Psikologi',
  seminar: 'Seminar',
};
const ROOM_GROUP_COLOR: Record<string, string> = {
  konseling: 'var(--sage-500)',
  anak: '#daa520',
  tes: '#896db3',
  seminar: '#4a7090',
};

// Default fallback (kalau settings belum di-load atau slot kosong).
// Real value diambil dari ClinicSettings.slotsOfDay.length (lihat OwnerDashboardPage).
const DEFAULT_SLOTS_PER_DAY = 6;

// ============================================================================
// Sub-components
// ============================================================================

function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card-althea" style={{ padding: 18 }}>
      <span className="caption">{label}</span>
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 28,
          fontWeight: 500,
          color: 'var(--teal-800)',
          marginTop: 4,
        }}
      >
        {value}
      </div>
      {sub && (
        <span
          className="caption"
          style={{ marginTop: 4, color: 'var(--sage-700)', fontSize: 11, display: 'block' }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

function PsikologRow({
  p,
  todayCount,
  totalActive,
  slotsPerDay,
}: {
  p: Psikolog;
  todayCount: number;
  totalActive: number;
  slotsPerDay: number;
}) {
  const max = slotsPerDay;
  const pct = Math.min(100, (todayCount / max) * 100);
  const color = p.color ?? DEFAULT_PSIKOLOG_COLOR;
  const initial = (p.fullName ?? p.email).slice(0, 2).toUpperCase();
  const rawSpecialty =
    Array.isArray(p.specialty) && p.specialty.length > 0 ? p.specialty[0] : null;
  const specialty = rawSpecialty
    ? SPECIALTY_LABEL[rawSpecialty] ?? rawSpecialty
    : p.title;
  return (
    <div
      className="flex items-center gap-3"
      style={{
        padding: '10px 12px',
        background: 'var(--cream-50)',
        borderRadius: 8,
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: color,
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {initial}
      </span>
      <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-800)' }}>
            {p.fullName ?? p.email}
          </span>
          <span
            style={{
              fontSize: 12,
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--fg-muted)',
            }}
          >
            {todayCount}/{max} hari ini · {totalActive} klien aktif
          </span>
        </div>
        <div
          style={{
            height: 4,
            background: 'var(--cream-200)',
            borderRadius: 999,
            marginTop: 5,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: pct >= 100 ? 'var(--danger, #b54141)' : color,
              transition: 'width .2s ease',
            }}
          />
        </div>
        {specialty && (
          <span className="caption" style={{ fontSize: 10.5, marginTop: 3 }}>
            {specialty}
          </span>
        )}
      </div>
    </div>
  );
}

function RoomUtilizationRow({
  label,
  used,
  max,
  color,
}: {
  label: string;
  used: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.min(100, (used / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span style={{ fontSize: 12.5, color: 'var(--fg)', flex: 1 }}>{label}</span>
      <div
        style={{
          flex: 2,
          height: 6,
          background: 'var(--cream-200)',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <div style={{ width: `${pct}%`, height: '100%', background: color }} />
      </div>
      <span
        style={{
          fontSize: 11,
          color: 'var(--fg-muted)',
          fontVariantNumeric: 'tabular-nums',
          width: 56,
          textAlign: 'right',
        }}
      >
        {used}/{max} slot
      </span>
    </div>
  );
}

function ServiceRow({
  name,
  count,
  category,
}: {
  name: string;
  count: number;
  category: string;
}) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-2">
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: SVC_DOT[category] ?? SVC_DOT.konseling,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 12.5, color: 'var(--fg)' }}>{name}</span>
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--teal-800)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {count}
      </span>
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

export default function OwnerDashboardPage() {
  const today = useBookingList({ date: todayKey(), limit: 200, includeCancelled: false });
  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const serviceList = useServiceList({ limit: 200, isActive: true });
  const settingsQuery = useSettings();
  const slotsPerDay =
    settingsQuery.data?.data.slotsOfDay?.length || DEFAULT_SLOTS_PER_DAY;
  // Last 30 days bookings untuk revenue & 7-day trend (best effort dengan endpoint yg ada)
  const monthBookings = useBookingList({ limit: 500, includeCancelled: false });

  const todayBookings = today.data?.data ?? [];
  const psikologs = psikologList.data?.data ?? [];
  const rooms = roomList.data?.data ?? [];
  const services = serviceList.data?.data ?? [];
  const allBookings = monthBookings.data?.data ?? [];

  // ------------- KPI computations -------------
  const kpi = useMemo(() => {
    const sesiToday = todayBookings.length;
    const totalSlots = psikologs.length * slotsPerDay;
    const utilPsikolog = totalSlots > 0 ? Math.round((sesiToday / totalSlots) * 100) : 0;

    const usedRoomIds = new Set(todayBookings.map((b) => b.room.id));
    const utilRuangan = rooms.length > 0 ? Math.round((usedRoomIds.size / rooms.length) * 100) : 0;

    // Revenue this month — sum completed booking basePrice across allBookings filtered by month
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
    const monthRevenue = allBookings
      .filter((b) => b.status === 'completed' && b.scheduledStart.startsWith(thisMonth))
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
  }, [todayBookings, psikologs.length, rooms, allBookings, slotsPerDay]);

  // ------------- Performa psikolog -------------
  const psikologPerf = useMemo(() => {
    return psikologs.map((p) => {
      const todayCount = todayBookings.filter((b) => b.psikologUserId === p.userId).length;
      const totalActive = new Set(
        allBookings
          .filter((b) => b.psikologUserId === p.userId && b.status !== 'cancelled')
          .map((b) => b.client.id),
      ).size;
      return { p, todayCount, totalActive };
    });
  }, [psikologs, todayBookings, allBookings, slotsPerDay]);

  // Owner notes (auto-generated based on underutilized psikolog)
  const ownerNote = useMemo(() => {
    const under = psikologPerf
      .filter((row) => row.todayCount / slotsPerDay <= 0.3 && row.totalActive < 5)
      .map((row) => row.p.fullName ?? row.p.email);
    if (under.length === 0) {
      return 'Semua psikolog di atas threshold utilisasi 30% — kapasitas merata hari ini.';
    }
    return `${under.slice(0, 2).join(' & ')} masih underutilized hari ini. Pertimbangkan rebalance jadwal atau marketing fokus ke spesialisasi mereka.`;
  }, [psikologPerf]);

  // ------------- 7-day trend -------------
  const weekTrend = useMemo(() => {
    const today = new Date();
    const days: { label: string; count: number; isToday: boolean }[] = [];
    const dayLabels = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = dateKey(d);
      const count = allBookings.filter((b) => b.scheduledStart.startsWith(key)).length;
      const dayIdx = (d.getDay() + 6) % 7; // Mon=0
      days.push({ label: dayLabels[dayIdx], count, isToday: i === 0 });
    }
    return days;
  }, [allBookings]);

  const weekTotal = weekTrend.reduce((sum, d) => sum + d.count, 0);
  const weekMax = Math.max(...weekTrend.map((d) => d.count), 1);

  // ------------- Utilisasi ruangan grouped -------------
  const roomGroups = useMemo(() => {
    const byType: Record<string, { used: number; max: number }> = {};
    for (const r of rooms) {
      const t = r.type ?? 'konseling';
      if (!byType[t]) byType[t] = { used: 0, max: 0 };
      byType[t].max += slotsPerDay;
      const usedSlotsForRoom = todayBookings.filter((b) => b.room.id === r.id).length;
      byType[t].used += usedSlotsForRoom;
    }
    return byType;
  }, [rooms, todayBookings, slotsPerDay]);

  // ------------- Top services this month -------------
  const topServices = useMemo(() => {
    const counts: Record<number, { name: string; category: string; count: number }> = {};
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
    for (const b of allBookings) {
      if (b.status === 'cancelled') continue;
      if (!b.scheduledStart.startsWith(thisMonth)) continue;
      const id = b.service.id;
      if (!counts[id]) {
        counts[id] = { name: b.service.name, category: b.service.category, count: 0 };
      }
      counts[id].count += 1;
    }
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [allBookings]);

  return (
    <div className="flex flex-col" style={{ padding: 28, gap: 22 }}>
      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <KpiCard
          label="Sesi hari ini"
          value={kpi.sesiToday}
          sub={`${kpi.activePsikologCount} psikolog · ${kpi.usedRoomCount} ruangan terpakai`}
        />
        <KpiCard
          label="Utilisasi psikolog"
          value={`${kpi.utilPsikolog}%`}
          sub={`${kpi.activePsikologCount} psikolog · rata-rata ${slotsPerDay} slot`}
        />
        <KpiCard
          label="Utilisasi ruangan"
          value={`${kpi.utilRuangan}%`}
          sub={`${kpi.usedRoomCount} dari ${kpi.totalRoomCount} ruangan terpakai`}
        />
        <KpiCard
          label="Revenue bulan ini"
          value={kpi.monthRevenue > 0 ? formatRupiahShort(kpi.monthRevenue) : '—'}
          sub={kpi.monthRevenue > 0 ? 'dari sesi completed' : 'belum ada sesi completed'}
        />
      </div>

      {/* Performa + Trend grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
        {/* Performa psikolog */}
        <div className="card-althea" style={{ padding: 20 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-serif)',
                fontSize: 19,
                fontWeight: 500,
                color: 'var(--teal-800)',
              }}
            >
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
                <PsikologRow
                  key={row.p.id}
                  p={row.p}
                  todayCount={row.todayCount}
                  totalActive={row.totalActive}
                  slotsPerDay={slotsPerDay}
                />
              ))
            )}
          </div>
        </div>

        {/* Right column: chart + notes */}
        <div className="flex flex-col gap-3">
          <div className="card-althea" style={{ padding: 20 }}>
            <h2
              style={{
                margin: '0 0 14px',
                fontFamily: 'var(--font-serif)',
                fontSize: 17,
                fontWeight: 500,
                color: 'var(--teal-800)',
              }}
            >
              Sesi 7 hari terakhir
            </h2>
            <div className="flex" style={{ alignItems: 'flex-end', gap: 8, height: 120 }}>
              {weekTrend.map((d, i) => {
                const h = (d.count / weekMax) * 100;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center"
                    style={{ flex: 1, gap: 4 }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: `${Math.max(h, 4)}%`,
                        background: d.isToday ? 'var(--sage-500)' : 'var(--sage-200)',
                        borderRadius: 4,
                      }}
                      title={`${d.label}: ${d.count} sesi`}
                    />
                    <span className="caption" style={{ fontSize: 10 }}>
                      {d.label}
                    </span>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--teal-800)' }}>
                      {d.count}
                    </span>
                  </div>
                );
              })}
            </div>
            <div
              className="flex items-center justify-between"
              style={{ marginTop: 12 }}
            >
              <span className="caption">Total · {weekTotal} sesi</span>
              <span
                className="caption"
                style={{ color: 'var(--sage-700)', fontWeight: 600 }}
              >
                {formatDateLong(new Date()).split(',')[0]}
              </span>
            </div>
          </div>
          <div
            className="card-althea"
            style={{ padding: 16, background: 'var(--info-soft)', borderColor: '#cfdde8' }}
          >
            <span className="eyebrow" style={{ color: '#2c4a60' }}>
              Catatan owner
            </span>
            <p
              style={{
                fontSize: 12.5,
                color: '#2c4a60',
                margin: '6px 0 0',
                lineHeight: 1.5,
              }}
            >
              {ownerNote}
            </p>
          </div>
        </div>
      </div>

      {/* Ruangan + Layanan grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card-althea" style={{ padding: 20 }}>
          <h2
            style={{
              margin: '0 0 14px',
              fontFamily: 'var(--font-serif)',
              fontSize: 17,
              fontWeight: 500,
              color: 'var(--teal-800)',
            }}
          >
            Utilisasi ruangan
          </h2>
          <div className="flex flex-col gap-2">
            {Object.entries(roomGroups).length === 0 ? (
              <span className="caption text-fg-muted">Belum ada ruangan terdaftar.</span>
            ) : (
              Object.entries(roomGroups).map(([type, agg]) => (
                <RoomUtilizationRow
                  key={type}
                  label={ROOM_GROUP_LABEL[type] ?? type}
                  used={agg.used}
                  max={agg.max}
                  color={ROOM_GROUP_COLOR[type] ?? 'var(--sage-500)'}
                />
              ))
            )}
          </div>
        </div>

        <div className="card-althea" style={{ padding: 20 }}>
          <h2
            style={{
              margin: '0 0 14px',
              fontFamily: 'var(--font-serif)',
              fontSize: 17,
              fontWeight: 500,
              color: 'var(--teal-800)',
            }}
          >
            Layanan terlaris bulan ini
          </h2>
          <div className="flex flex-col">
            {topServices.length === 0 ? (
              <span className="caption text-fg-muted">
                Belum ada sesi bulan ini — data akan muncul setelah ada booking.
              </span>
            ) : (
              topServices.map((s) => (
                <ServiceRow
                  key={s.name}
                  name={s.name}
                  count={s.count}
                  category={s.category}
                />
              ))
            )}
            {/* Reference utility (avoid TS warning) */}
            <span className="caption" style={{ marginTop: 8, fontSize: 10.5 }}>
              Total katalog: {services.length} layanan aktif
            </span>
          </div>
        </div>
      </div>

      {/* Pemakaian Ruangan · Slot × Ruangan — read-only grid (US-O01) */}
      <div className="card-althea overflow-hidden">
        <div
          className="flex items-start justify-between gap-3 flex-wrap"
          style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex flex-col">
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-serif)',
                fontSize: 17,
                fontWeight: 500,
                color: 'var(--teal-800)',
              }}
            >
              Pemakaian Ruangan · Slot × Ruangan
            </h2>
            <span className="caption" style={{ marginTop: 2 }}>
              Read-only · ringkasan untuk pencarian ruangan kosong. Edit penjadwalan
              dilakukan oleh admin.
            </span>
          </div>
          {psikologs.length > 0 && <RoomUsageLegend psikologs={psikologs} compact />}
        </div>
        {rooms.length === 0 ? (
          <div className="py-12 text-center text-fg-muted text-sm">
            Belum ada ruangan terdaftar.
          </div>
        ) : (
          <RoomUsageGrid
            rooms={rooms}
            bookings={todayBookings}
            dateKey={todayKey()}
            compact
          />
        )}
      </div>
    </div>
  );
}
