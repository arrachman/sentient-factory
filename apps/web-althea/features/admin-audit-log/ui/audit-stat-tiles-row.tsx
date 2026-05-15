/**
 * Baris 4 stat tiles untuk halaman Audit Log.
 * Gunakan tone danger untuk BR-04 + warn untuk login gagal yang aktif.
 */
import { AuditStatTile } from './audit-stat-tile';

export function AuditStatTilesRow({
  stats,
}: {
  stats: {
    todayCount: number;
    deniedCount: number;
    loginFailCount: number;
    clientChangesCount: number;
    clientChangesActiveUsers: number;
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
      <AuditStatTile
        lbl="Event hari ini"
        val={stats.todayCount.toLocaleString('id-ID')}
        sub="diambil real-time"
      />
      <AuditStatTile
        lbl="Akses ditolak"
        val={stats.deniedCount.toLocaleString('id-ID')}
        sub="psikolog × klien lain"
        tone={stats.deniedCount > 0 ? 'danger' : 'base'}
      />
      <AuditStatTile
        lbl="Login gagal"
        val={stats.loginFailCount.toLocaleString('id-ID')}
        sub={
          stats.loginFailCount > 0
            ? '1 akun terkunci 15′'
            : 'tidak ada anomali'
        }
        tone={stats.loginFailCount > 0 ? 'warn' : 'base'}
      />
      <AuditStatTile
        lbl="Perubahan data klien"
        val={stats.clientChangesCount.toLocaleString('id-ID')}
        sub={`${stats.clientChangesActiveUsers} user aktif`}
      />
    </div>
  );
}
