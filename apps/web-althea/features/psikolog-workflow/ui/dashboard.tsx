'use client';

import { useMemo } from 'react';
import { CalendarDays, Clock, Users } from 'lucide-react';
import { useMe } from '@/features/auth/hooks/use-me';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { STATUS_BADGE_CLASS, STATUS_LABEL, type Booking } from '@/features/admin-booking/model/types';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export function PsikologDashboard() {
  const meQuery = useMe();
  const psikologId = meQuery.data?.data.id;

  const todayQuery = useBookingList({
    psikologUserId: psikologId,
    date: todayISO(),
    limit: 50,
  });

  const upcomingQuery = useBookingList({
    psikologUserId: psikologId,
    status: 'confirmed',
    limit: 50,
  });

  const todayBookings = useMemo<Booking[]>(() => todayQuery.data?.data ?? [], [todayQuery.data]);
  const upcoming = useMemo<Booking[]>(() => upcomingQuery.data?.data ?? [], [upcomingQuery.data]);

  if (meQuery.isLoading) {
    return <div className="card-althea p-8 text-center text-fg-muted">Memuat...</div>;
  }

  if (!psikologId) {
    return (
      <div className="card-althea p-8 text-center text-danger">
        Tidak bisa identifikasi user. Coba logout & login ulang.
      </div>
    );
  }

  // Stats
  const todayDone = todayBookings.filter((b) => b.status === 'completed').length;
  const todayTotal = todayBookings.length;
  const todayActive = todayBookings.filter((b) =>
    ['confirmed', 'checked_in', 'in_progress'].includes(b.status),
  ).length;

  return (
    <div className="space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="h1">
          Selamat datang, {meQuery.data?.data.fullName ?? meQuery.data?.data.username}
        </h1>
        <p className="caption mt-1">Berikut ringkasan jadwal & sesi kamu.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-althea p-4 flex items-center gap-4">
          <div className="rounded-lg bg-sage-100 p-3">
            <CalendarDays className="h-6 w-6 text-sage-700" />
          </div>
          <div>
            <div className="caption">Sesi Hari Ini</div>
            <div className="h2">{todayTotal}</div>
          </div>
        </div>
        <div className="card-althea p-4 flex items-center gap-4">
          <div className="rounded-lg bg-rose-100 p-3">
            <Clock className="h-6 w-6 text-rose-500" />
          </div>
          <div>
            <div className="caption">Aktif (akan/sedang)</div>
            <div className="h2">{todayActive}</div>
          </div>
        </div>
        <div className="card-althea p-4 flex items-center gap-4">
          <div className="rounded-lg bg-cream-200 p-3">
            <Users className="h-6 w-6 text-teal-800" />
          </div>
          <div>
            <div className="caption">Selesai Hari Ini</div>
            <div className="h2">{todayDone}</div>
          </div>
        </div>
      </div>

      {/* Today schedule */}
      <div className="space-y-3">
        <h2 className="h2">Jadwal Hari Ini</h2>
        {todayQuery.isLoading ? (
          <div className="card-althea p-8 text-center text-fg-muted">Memuat...</div>
        ) : todayBookings.length === 0 ? (
          <div className="card-althea p-8 text-center text-fg-muted">
            Tidak ada sesi hari ini. Selamat istirahat!
          </div>
        ) : (
          <div className="card-althea overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 border-b border-border text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">Waktu</th>
                  <th className="px-4 py-2 font-medium">Klien</th>
                  <th className="px-4 py-2 font-medium">Layanan</th>
                  <th className="px-4 py-2 font-medium">Ruang</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayBookings.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-b-0 hover:bg-cream-50">
                    <td className="px-4 py-2 font-mono">
                      {formatTime(b.scheduledStart)} - {formatTime(b.scheduledEnd)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-medium">{b.client.name}</div>
                      <div className="caption font-mono">{b.client.phoneWa}</div>
                    </td>
                    <td className="px-4 py-2">{b.service.name}</td>
                    <td className="px-4 py-2">{b.room.name}</td>
                    <td className="px-4 py-2">
                      <span className={`badge ${STATUS_BADGE_CLASS[b.status]}`}>
                        {STATUS_LABEL[b.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upcoming next 5 */}
      <div className="space-y-3">
        <h2 className="h2">Sesi Mendatang</h2>
        {upcoming.length === 0 ? (
          <div className="card-althea p-6 text-center text-fg-muted">
            Belum ada sesi mendatang dikonfirmasi.
          </div>
        ) : (
          <ul className="space-y-2">
            {upcoming.slice(0, 5).map((b) => (
              <li
                key={b.id}
                className="card-althea p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {new Date(b.scheduledStart).toLocaleDateString('id-ID', {
                      weekday: 'short',
                      day: '2-digit',
                      month: 'short',
                    })}{' '}
                    · {formatTime(b.scheduledStart)}
                  </div>
                  <div className="caption">
                    {b.client.name} · {b.service.name}
                  </div>
                </div>
                <span className={`badge ${STATUS_BADGE_CLASS[b.status]}`}>
                  {STATUS_LABEL[b.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
