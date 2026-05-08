'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { STATUS_BADGE_CLASS, STATUS_LABEL } from '@/features/admin-booking/model/types';
import { useMe } from '@/features/auth/hooks/use-me';

const TIME_SLOTS = ['08:00', '10:00', '13:00', '15:00', '17:00', '19:00'];

function pad(n: number) { return String(n).padStart(2, '0'); }
function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function shiftDate(key: string, days: number): string {
  const d = new Date(key);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function PsikologSchedulePage() {
  const me = useMe();
  const myUserId = me.data?.data.id;
  const [date, setDate] = useState(todayKey());

  const list = useBookingList({ psikologUserId: myUserId, date, limit: 50 });
  const items = list.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="h1">Jadwal Saya</h1>
          <p className="caption mt-1">Jadwal sesi {me.data?.data.fullName ?? 'Anda'}.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setDate(shiftDate(date, -1))} className="btn btn-outline btn-icon">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-althea max-w-[180px]" />
          <button type="button" onClick={() => setDate(shiftDate(date, 1))} className="btn btn-outline btn-icon">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setDate(todayKey())} className="btn btn-outline">Hari ini</button>
        </div>
      </div>

      <div className="space-y-2">
        {TIME_SLOTS.map((t) => {
          const slotStart = new Date(`${date}T${t}:00`);
          const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);
          const booking = items.find((b) => {
            const bs = new Date(b.scheduledStart);
            const be = new Date(b.scheduledEnd);
            return bs < slotEnd && be > slotStart;
          });
          return (
            <div key={t} className="card-althea-flat p-3 flex items-center gap-4">
              <div className="font-mono text-sm font-semibold text-teal-800 min-w-[60px]">{t}</div>
              {booking ? (
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{booking.client.name}</div>
                    <div className="caption">{booking.service.name} • {booking.room.name}</div>
                  </div>
                  <span className={`badge ${STATUS_BADGE_CLASS[booking.status]}`}>{STATUS_LABEL[booking.status]}</span>
                </div>
              ) : (
                <div className="flex-1 text-fg-muted text-sm">— Slot kosong</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
