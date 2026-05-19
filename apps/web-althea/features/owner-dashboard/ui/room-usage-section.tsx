'use client';

/**
 * Section "Pemakaian Ruangan · Slot × Ruangan" (US-O01) — klik sel buka
 * panel detail read-only di sisi kanan.
 *
 * Pakai grid yang sama persis dengan /admin/rooms dan /psikolog/rooms
 * (sticky header + row banding + hover affordance) supaya konsisten cross-role.
 * Detail panel & SLOTS reuse dari psikolog-rooms (read-only, tanpa edit/hapus).
 */
import { useMemo, useState } from 'react';
import type { Booking } from '@/features/admin-booking/model/types';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import type { Room } from '@/features/admin-rooms/model/types';
import { RoomUsageGrid } from '@/features/admin-rooms/ui/room-usage-grid';
import { RoomUsageLegend } from '@/features/admin-rooms/ui/room-usage-legend';
import { RoomDetailPanel } from '@/features/psikolog-rooms/ui/room-detail-panel';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import { todayKey } from '../model/format';

type PickedCell = {
  room: Room;
  slotIdx: number;
  booking: Booking | null;
};

export function RoomUsageSection({
  rooms,
  todayBookings,
  psikologs: _psikologs,
}: {
  rooms: Room[];
  todayBookings: Booking[];
  psikologs: Psikolog[];
}) {
  const [picked, setPicked] = useState<PickedCell | null>(null);
  const dateKey = todayKey();
  const settingsQuery = useSettings();
  const slots = settingsQuery.data?.data.slotsOfDay ?? [];

  const legendPsikologs = useMemo(() => {
    const map = new Map<number, { id: number; short: string; color: string }>();
    for (const b of todayBookings) {
      if (map.has(b.psikolog.id)) continue;
      map.set(b.psikolog.id, {
        id: b.psikolog.id,
        short:
          b.psikolog.fullName?.trim().split(/\s+/)[0] ??
          b.psikolog.email.split('@')[0],
        color:
          b.psikolog.clinicPsikologProfile?.color ?? 'var(--sage-500)',
      });
    }
    return Array.from(map.values());
  }, [todayBookings]);

  return (
    <section className="flex flex-col gap-3">
      <header className="flex flex-col gap-1">
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontSize: 19,
            fontWeight: 500,
            color: 'var(--teal-800)',
          }}
        >
          Pemakaian ruangan · slot × ruangan
        </h2>
        <span className="caption">
          Snapshot ruangan hari ini. Klik sel terisi untuk lihat detail
          booking. Edit penjadwalan dilakukan oleh admin.
        </span>
      </header>

      <div className="flex gap-4 items-start">
        <div
          className="card-althea flex flex-col"
          style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}
        >
          <div
            className="row"
            style={{
              padding: '12px 18px',
              borderBottom: '1px solid var(--border)',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <h3 className="text-sm font-medium" style={{ margin: 0 }}>
              Grid Pemakaian · Slot × Ruangan
            </h3>
            <RoomUsageLegend psikologs={legendPsikologs} />
          </div>
          {rooms.length === 0 ? (
            <div className="py-12 text-center text-fg-muted text-sm">
              Belum ada ruangan terdaftar.
            </div>
          ) : (
            <RoomUsageGrid
              rooms={rooms}
              bookings={todayBookings}
              dateKey={dateKey}
              slots={slots}
              pickedKey={
                picked ? `${picked.room.id}-${picked.slotIdx}` : null
              }
              onPick={(room, slotIdx, booking) =>
                setPicked({ room, slotIdx, booking })
              }
              readOnly
            />
          )}
        </div>

        {picked ? (
          <RoomDetailPanel
            room={picked.room}
            slot={slots[picked.slotIdx]}
            booking={picked.booking}
            onClose={() => setPicked(null)}
          />
        ) : null}
      </div>
    </section>
  );
}
