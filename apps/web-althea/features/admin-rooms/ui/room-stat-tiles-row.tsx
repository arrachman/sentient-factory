/**
 * Baris 4 stat tiles di header halaman Pemakaian Ruangan.
 * Bind langsung ke output `useRoomsPage().stats`.
 */
import { StatTile } from './room-stat-tile';

export function RoomStatTilesRow({
  stats,
}: {
  stats: {
    total: number;
    sessions: number;
    slotsAvailable: number;
    utilization: number;
    empty: number;
  };
}) {
  return (
    <div
      className="px-7 pb-4"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
      }}
    >
      <StatTile lbl="Total ruangan" val={stats.total} sub="aktif semua" />
      <StatTile
        lbl="Sesi hari ini"
        val={stats.sessions}
        sub={`dari ${stats.slotsAvailable} kapasitas slot`}
      />
      <StatTile
        lbl="Utilisasi rata-rata"
        val={`${stats.utilization}%`}
        sub="berdasarkan booking"
      />
      <StatTile
        lbl="Ruangan kosong"
        val={stats.empty}
        sub="sepanjang hari"
      />
    </div>
  );
}
