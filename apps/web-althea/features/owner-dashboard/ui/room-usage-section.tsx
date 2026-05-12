import type { Booking } from '@/features/admin-booking/model/types';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import type { Room } from '@/features/admin-rooms/model/types';
import {
  RoomUsageGrid,
  RoomUsageLegend,
} from '@/components/clinic/room-usage-grid';
import { todayKey } from '../model/format';

/**
 * Section "Pemakaian Ruangan · Slot × Ruangan" (US-O01) — read-only grid.
 * Owner cuma boleh lihat, edit penjadwalan tetap di admin.
 */
export function RoomUsageSection({
  rooms,
  todayBookings,
  psikologs,
}: {
  rooms: Room[];
  todayBookings: Booking[];
  psikologs: Psikolog[];
}) {
  return (
    <div className="card-althea overflow-hidden">
      <div
        className="flex items-start justify-between gap-3 flex-wrap"
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
        }}
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
            Read-only · ringkasan untuk pencarian ruangan kosong. Edit
            penjadwalan dilakukan oleh admin.
          </span>
        </div>
        {psikologs.length > 0 ? (
          <RoomUsageLegend psikologs={psikologs} compact />
        ) : null}
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
  );
}
