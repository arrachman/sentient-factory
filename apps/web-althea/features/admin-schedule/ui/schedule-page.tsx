'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import {
  STATUS_BADGE_CLASS,
  STATUS_LABEL,
  type Booking,
} from '@/features/admin-booking/model/types';

const TIME_SLOTS = ['08:00', '10:00', '13:00', '15:00', '17:00', '19:00'];
const SLOT_DURATION_MIN = 60; // visualisasi default

function pad(n: number) { return String(n).padStart(2, '0'); }
function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function todayKey(): string { return toDateKey(new Date()); }
function shiftDate(key: string, days: number): string {
  const d = new Date(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

function formatDate(key: string): string {
  return new Date(key).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Find booking yang overlap dengan slot tertentu (psikolog × waktu).
 * Slot waktu = TIME_SLOTS[i] sampai +60 menit (default).
 */
function findBookingForSlot(
  bookings: Booking[],
  psikologUserId: number,
  dateKey: string,
  slotTime: string,
): Booking | null {
  const slotStart = new Date(`${dateKey}T${slotTime}:00`);
  const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MIN * 60 * 1000);

  return (
    bookings.find((b) => {
      if (b.psikologUserId !== psikologUserId) return false;
      const bStart = new Date(b.scheduledStart);
      const bEnd = new Date(b.scheduledEnd);
      // overlap test
      return bStart < slotEnd && bEnd > slotStart;
    }) || null
  );
}

const SVC_BAR_CLASS: Record<string, string> = {
  konseling: 'svc-bar-konseling',
  terapi: 'svc-bar-terapi',
  anak: 'svc-bar-anak',
  tes: 'svc-bar-tes',
};

export function SchedulePage() {
  const [date, setDate] = useState<string>(todayKey());

  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const bookingList = useBookingList({ date, limit: 200, includeCancelled: false });

  const psikologs = psikologList.data?.data ?? [];
  const bookings = bookingList.data?.data ?? [];

  const stats = useMemo(() => {
    const total = bookings.length;
    const byStatus: Record<string, number> = {};
    for (const b of bookings) {
      byStatus[b.status] = (byStatus[b.status] ?? 0) + 1;
    }
    return { total, byStatus };
  }, [bookings]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="h1">Jadwal</h1>
          <p className="caption mt-1">Grid jadwal psikolog × time slot. Klik slot untuk detail.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setDate(shiftDate(date, -1))} className="btn btn-outline btn-icon" aria-label="Hari sebelumnya">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-althea max-w-[180px]"
          />
          <button type="button" onClick={() => setDate(shiftDate(date, 1))} className="btn btn-outline btn-icon" aria-label="Hari berikutnya">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setDate(todayKey())} className="btn btn-outline">
            Hari ini
          </button>
        </div>
      </div>

      <div className="card-althea-flat p-3 text-sm">
        <strong>{formatDate(date)}</strong>
        <span className="caption ml-3">— {stats.total} booking aktif</span>
        {Object.entries(stats.byStatus).map(([k, v]) => (
          <span key={k} className="ml-2 caption">
            • {STATUS_LABEL[k as keyof typeof STATUS_LABEL] ?? k}: {v}
          </span>
        ))}
      </div>

      {psikologList.isLoading || bookingList.isLoading ? (
        <div className="card-althea p-8 text-center text-fg-muted">Memuat jadwal...</div>
      ) : psikologs.length === 0 ? (
        <div className="card-althea p-8 text-center text-fg-muted">Belum ada psikolog.</div>
      ) : (
        <div className="card-althea overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-teal-800 sticky left-0 bg-cream-100 z-10 min-w-[180px]">
                  Psikolog
                </th>
                {TIME_SLOTS.map((t) => (
                  <th key={t} className="px-2 py-2 text-center font-medium text-teal-800 min-w-[160px]">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {psikologs.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2 sticky left-0 bg-card z-10 border-r border-border">
                    <div className="flex items-center gap-2">
                      <span
                        className="avatar avatar-sm"
                        style={p.color ? { backgroundColor: p.color, color: '#fff' } : undefined}
                      >
                        {(p.fullName || p.email).slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <div className="font-medium text-teal-800">{p.fullName ?? p.email}</div>
                        {p.title && <div className="caption">{p.title}</div>}
                      </div>
                    </div>
                  </td>
                  {TIME_SLOTS.map((t) => {
                    const booking = findBookingForSlot(bookings, p.userId, date, t);
                    if (!booking) {
                      return (
                        <td key={t} className="px-2 py-2 align-top">
                          <div className="h-16 rounded-md border border-dashed border-border" aria-label="empty slot" />
                        </td>
                      );
                    }
                    const svcClass = SVC_BAR_CLASS[booking.service.category] ?? 'svc-bar-konseling';
                    return (
                      <td key={t} className="px-2 py-2 align-top">
                        <div className={`h-16 rounded-md p-2 text-xs ${svcClass} overflow-hidden`}>
                          <div className="font-semibold truncate">{booking.client.name}</div>
                          <div className="truncate text-[11px]">{booking.service.name}</div>
                          <div className="mt-0.5 flex items-center gap-1 text-[10px]">
                            <span className={`badge ${STATUS_BADGE_CLASS[booking.status]} text-[10px] h-5 px-1.5`}>
                              {STATUS_LABEL[booking.status]}
                            </span>
                            <span className="opacity-60">#{booking.id}</span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card-althea-flat p-3 text-xs text-fg-muted">
        <strong>Legend service-type:</strong>
        <span className="ml-2 inline-block w-4 h-4 align-middle rounded-sm svc-bar-konseling"></span> Konseling
        <span className="ml-3 inline-block w-4 h-4 align-middle rounded-sm svc-bar-terapi"></span> Terapi
        <span className="ml-3 inline-block w-4 h-4 align-middle rounded-sm svc-bar-anak"></span> Anak
        <span className="ml-3 inline-block w-4 h-4 align-middle rounded-sm svc-bar-tes"></span> Tes
      </div>
    </div>
  );
}
