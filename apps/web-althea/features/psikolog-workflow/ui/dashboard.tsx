'use client';

import { useMemo } from 'react';
import { Bell, CheckSquare } from 'lucide-react';
import { useMe } from '@/features/auth/hooks/use-me';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import type { Booking } from '@/features/admin-booking/model/types';

// ============================================================================
// Helpers
// ============================================================================

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatDayLong(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

function bookingTone(b: Booking): 'done' | 'now' | 'next' {
  if (b.status === 'completed') return 'done';
  if (b.status === 'in_progress') return 'now';
  return 'next';
}

function shortService(svcName: string, sessionN: number, sessionTotal: number): string {
  if (sessionTotal > 1) return `${svcName} · Sesi ${sessionN}/${sessionTotal}`;
  return svcName;
}

// ============================================================================
// Sub-components
// ============================================================================

function StatCard({
  label,
  value,
  hint,
  tone = 'normal',
}: {
  label: string;
  value: string | number;
  hint: string;
  tone?: 'normal' | 'warn';
}) {
  const isWarn = tone === 'warn';
  return (
    <div
      className="card-althea"
      style={{
        padding: 18,
        background: isWarn ? 'var(--warn-soft, #fbf3dc)' : 'var(--bg-elev, #fff)',
        borderColor: isWarn ? '#e5d5a8' : 'var(--border)',
      }}
    >
      <span className="caption">{label}</span>
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 32,
          fontWeight: 500,
          color: 'var(--teal-800)',
          lineHeight: 1.1,
          marginTop: 4,
        }}
      >
        {value}
      </div>
      <span
        className="caption"
        style={{
          marginTop: 4,
          color: isWarn ? '#7a5a1f' : 'var(--fg-muted)',
        }}
      >
        {hint}
      </span>
    </div>
  );
}

function TodaySessionRow({ b }: { b: Booking }) {
  const tone = bookingTone(b);
  return (
    <div
      className="flex items-center gap-3"
      style={{
        padding: 14,
        borderRadius: 10,
        background: tone === 'now' ? 'var(--sage-50)' : 'var(--cream-50)',
        border: '1px solid ' + (tone === 'now' ? 'var(--sage-300)' : 'transparent'),
        opacity: tone === 'done' ? 0.62 : 1,
      }}
    >
      <div className="flex flex-col" style={{ width: 60, flexShrink: 0 }}>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--teal-800)',
            fontFamily: 'var(--font-serif)',
          }}
        >
          {formatTime(b.scheduledStart)}
        </span>
      </div>
      <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--teal-800)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={b.client.name}
        >
          {b.client.name}
        </span>
        <span className="caption" style={{ marginTop: 2 }}>
          {shortService(b.service.name, b.sessionN, b.sessionTotal)} · {b.room.name}
        </span>
      </div>
      {tone === 'done' && (
        <span
          className="badge"
          style={{ background: 'var(--cream-200)', color: 'var(--fg-muted)', height: 22 }}
        >
          Selesai
        </span>
      )}
      {tone === 'now' && (
        <span className="badge badge-sage" style={{ height: 22 }}>
          Berlangsung
        </span>
      )}
      {tone === 'next' && (
        <button type="button" className="btn btn-ghost btn-sm">
          Buka
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Main
// ============================================================================

export function PsikologDashboard() {
  const meQuery = useMe();
  const psikologId = meQuery.data?.data.id;
  const today = todayISO();
  const greetName = (meQuery.data?.data.fullName ?? meQuery.data?.data.username ?? 'Psikolog').split(
    ' ',
  )[0];

  const todayQuery = useBookingList({
    psikologUserId: psikologId,
    date: today,
    limit: 50,
  });

  const todayBookings = useMemo<Booking[]>(
    () => todayQuery.data?.data ?? [],
    [todayQuery.data],
  );

  // Stats
  const stats = useMemo(() => {
    const total = todayBookings.length;
    const done = todayBookings.filter((b) => b.status === 'completed').length;
    const now = todayBookings.filter((b) => b.status === 'in_progress').length;
    return {
      todayTotal: total,
      todayHint: total === 0 ? 'tidak ada sesi hari ini' : `${done} selesai · ${now} berlangsung`,
    };
  }, [todayBookings]);

  // Action queue (UI stub — backend belum punya per-psikolog action queue endpoint)
  const queue: Array<{ icon: typeof Bell; title: string; sub: string }> = useMemo(() => {
    const q: Array<{ icon: typeof Bell; title: string; sub: string }> = [];
    const completedNoNote = todayBookings.filter((b) => b.status === 'completed').slice(0, 1);
    if (completedNoNote.length > 0) {
      q.push({
        icon: CheckSquare,
        title: 'Catatan sesi belum diisi',
        sub: `${completedNoNote[0].client.name} · sesi pagi`,
      });
    }
    const multiSesi = todayBookings.find((b) => b.sessionTotal > 1 && b.sessionN === b.sessionTotal - 1);
    if (multiSesi) {
      q.push({
        icon: Bell,
        title: 'Paket akan habis',
        sub: `${multiSesi.client.name} · sesi ${multiSesi.sessionN}/${multiSesi.sessionTotal}`,
      });
    }
    return q;
  }, [todayBookings]);

  // Week distribution (placeholder — needs week-range fetch)
  const weekData = [stats.todayTotal, 0, 0, 0, 0, 0, 0];
  const weekLabels = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'];
  const weekTotal = weekData.reduce((a, b) => a + b, 0);

  if (meQuery.isLoading) {
    return (
      <div className="card-althea" style={{ padding: 32, textAlign: 'center' }}>
        <p className="caption">Memuat...</p>
      </div>
    );
  }

  if (!psikologId) {
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
      {/* Greeting (mockup ada di top header juga, kita kasih sub-greeting di body) */}
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
        <span className="caption" style={{ marginTop: 4, display: 'block' }}>
          {formatDayLong(today)} · Berikut ringkasan jadwal & sesi kamu hari ini.
        </span>
      </div>

      {/* Stat strip — 4 cards */}
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
          value={stats.todayTotal}
          hint={stats.todayHint}
        />
        <StatCard
          label="Sesi minggu ini"
          value={weekTotal}
          hint="dari kapasitas 24 (stub)"
        />
        <StatCard
          label="Klien aktif"
          value="—"
          hint="endpoint stats belum tersedia"
        />
        <StatCard
          label="Catatan tertunda"
          value={todayBookings.filter((b) => b.status === 'completed').length}
          hint="isi sebelum akhir hari"
          tone="warn"
        />
      </div>

      {/* Two-column: Jadwal hari ini + Right column (queue + chart) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
          gap: 20,
        }}
      >
        {/* Jadwal hari ini */}
        <div className="card-althea" style={{ padding: 20 }}>
          <div className="flex items-start justify-between" style={{ marginBottom: 14 }}>
            <div className="flex flex-col">
              <span className="eyebrow">{formatDayLong(today)}</span>
              <h2
                style={{
                  margin: '2px 0 0',
                  fontFamily: 'var(--font-serif)',
                  fontSize: 19,
                  fontWeight: 500,
                  color: 'var(--teal-800)',
                }}
              >
                Jadwal hari ini
              </h2>
            </div>
            <a href="/psikolog/schedule" className="btn btn-outline btn-sm">
              Lihat semua →
            </a>
          </div>
          <div className="flex flex-col" style={{ gap: 8 }}>
            {todayQuery.isLoading ? (
              <div className="caption" style={{ padding: 20, textAlign: 'center' }}>
                Memuat...
              </div>
            ) : todayBookings.length === 0 ? (
              <div className="caption" style={{ padding: 20, textAlign: 'center' }}>
                Tidak ada sesi hari ini. Selamat istirahat!
              </div>
            ) : (
              todayBookings.map((b) => <TodaySessionRow key={b.id} b={b} />)
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col" style={{ gap: 12 }}>
          {/* Perlu tindakan */}
          <div className="card-althea" style={{ padding: 20 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-serif)',
                  fontSize: 17,
                  fontWeight: 500,
                  color: 'var(--teal-800)',
                }}
              >
                Perlu tindakan
              </h2>
              <span
                className="badge"
                style={{ background: 'var(--warn-soft, #fbf3dc)', color: '#7a5a1f', height: 20 }}
              >
                {queue.length}
              </span>
            </div>
            {queue.length === 0 ? (
              <div className="caption" style={{ padding: 12, textAlign: 'center' }}>
                Belum ada tindakan tertunda.
              </div>
            ) : (
              <div className="flex flex-col" style={{ gap: 0 }}>
                {queue.map((q, i) => {
                  const Ic = q.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2"
                      style={{
                        padding: '10px 4px',
                        borderTop: i ? '1px solid var(--border)' : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: 'var(--cream-100)',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Ic size={13} style={{ color: 'var(--teal-700)' }} />
                      </div>
                      <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}>
                          {q.title}
                        </span>
                        <span className="caption" style={{ fontSize: 11, marginTop: 1 }}>
                          {q.sub}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mini chart sesi minggu */}
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
              Sesi minggu ini
            </h2>
            <div className="flex items-end" style={{ gap: 8, height: 100 }}>
              {weekData.map((v, i) => {
                const max = Math.max(...weekData, 4);
                const isToday = i === 0;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center"
                    style={{ flex: 1, gap: 4 }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: max > 0 ? (v / max) * 80 : 0,
                        background: isToday ? 'var(--sage-500)' : 'var(--sage-200)',
                        borderRadius: 4,
                      }}
                    />
                    <span className="caption" style={{ fontSize: 10 }}>
                      {weekLabels[i]}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between" style={{ marginTop: 12 }}>
              <span className="caption">Total · {weekTotal} sesi</span>
              <span className="caption" style={{ color: 'var(--sage-700)', fontWeight: 600 }}>
                stub · butuh week-range query
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
