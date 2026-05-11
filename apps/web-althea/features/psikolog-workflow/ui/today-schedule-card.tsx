import type { Booking } from '@/features/admin-booking/model/types';
import { formatDayLong } from '../model/format';
import { TodaySessionRow } from './today-session-row';

/**
 * Card "Jadwal hari ini" — list sesi hari ini + link ke /psikolog/schedule.
 */
export function TodayScheduleCard({
  today,
  bookings,
  isLoading,
}: {
  today: string;
  bookings: Booking[];
  isLoading: boolean;
}) {
  return (
    <div className="card-althea" style={{ padding: 20 }}>
      <div
        className="flex items-start justify-between"
        style={{ marginBottom: 14 }}
      >
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
        <a
          href="/psikolog/schedule"
          className="btn btn-outline btn-sm"
        >
          Lihat semua →
        </a>
      </div>
      <div className="flex flex-col" style={{ gap: 8 }}>
        {isLoading ? (
          <div
            className="caption"
            style={{ padding: 20, textAlign: 'center' }}
          >
            Memuat...
          </div>
        ) : bookings.length === 0 ? (
          <div
            className="caption"
            style={{ padding: 20, textAlign: 'center' }}
          >
            Tidak ada sesi hari ini. Selamat istirahat!
          </div>
        ) : (
          bookings.map((b) => <TodaySessionRow key={b.id} b={b} />)
        )}
      </div>
    </div>
  );
}
