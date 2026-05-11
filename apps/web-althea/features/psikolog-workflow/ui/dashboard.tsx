'use client';

/**
 * Psikolog · Dashboard — orchestrator slim.
 *
 * Layout: greeting → 4 stat cards → 2-col grid (jadwal hari ini · queue + chart).
 */
import { usePsikologDashboard } from '../hooks/use-psikolog-dashboard';
import { formatDayLong } from '../model/format';
import { ActionQueueCard } from './action-queue-card';
import { StatCard } from './stat-card';
import { TodayScheduleCard } from './today-schedule-card';
import { WeekMiniChart } from './week-mini-chart';

export function PsikologDashboard() {
  const page = usePsikologDashboard();

  if (page.isLoading) {
    return (
      <div className="card-althea" style={{ padding: 32, textAlign: 'center' }}>
        <p className="caption">Memuat...</p>
      </div>
    );
  }
  if (!page.psikologId) {
    return (
      <div className="card-althea" style={{ padding: 32, textAlign: 'center' }}>
        <p className="caption" style={{ color: 'var(--danger, #b54141)' }}>
          Tidak bisa identifikasi user. Coba logout & login ulang.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 28 }}>
      <Greeting today={page.today} greetName={page.greetName} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
          marginBottom: 22,
        }}
      >
        <StatCard
          label="Sesi hari ini"
          value={page.isStatsLoading ? '—' : page.todayTotal}
          hint={page.todayHint}
        />
        <StatCard
          label="Sesi minggu ini"
          value={page.isStatsLoading ? '—' : page.weekTotal}
          hint={
            page.weekTotal === 0
              ? 'belum ada sesi minggu ini'
              : `tersebar di ${page.weekData.filter((d) => d > 0).length} hari`
          }
        />
        <StatCard
          label="Klien aktif"
          value={page.klienAktif === null ? '—' : page.klienAktif}
          hint="30 hari terakhir"
        />
        <StatCard
          label="Catatan tertunda"
          value={page.isStatsLoading ? '—' : page.catatanTertunda}
          hint={
            page.catatanTertunda === 0
              ? 'semua catatan up to date'
              : 'isi sebelum akhir minggu'
          }
          tone={page.catatanTertunda > 0 ? 'warn' : 'normal'}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
          gap: 20,
        }}
      >
        <TodayScheduleCard
          today={page.today}
          bookings={page.todayBookings}
          isLoading={page.isTodayLoading}
        />
        <div className="flex flex-col" style={{ gap: 12 }}>
          <ActionQueueCard queue={page.queue} />
          <WeekMiniChart weekData={page.weekData} />
        </div>
      </div>
    </div>
  );
}

function Greeting({ today, greetName }: { today: string; greetName: string }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h1
        style={{
          margin: 0,
          fontFamily: 'var(--font-serif)',
          fontSize: 22,
          fontWeight: 500,
          color: 'var(--teal-800)',
        }}
      >
        Selamat datang, {greetName}
      </h1>
      <span
        className="caption"
        style={{ marginTop: 4, display: 'block' }}
      >
        {formatDayLong(today)} · Berikut ringkasan jadwal & sesi kamu hari
        ini.
      </span>
    </div>
  );
}
