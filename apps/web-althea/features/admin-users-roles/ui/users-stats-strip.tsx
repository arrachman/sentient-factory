/**
 * 4 stat cards di header: Total user, Sedang login, 2FA aktif, Role.
 */
import { ROLE_INFO } from '../model/role-config';
import { UserStatCard } from './user-stat-card';

export function UsersStatsStrip({
  stats,
}: {
  stats: {
    total: number;
    active: number;
    inactive: number;
    sedangLogin: number;
  };
}) {
  return (
    <div
      style={{
        padding: '0 28px 16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 14,
      }}
    >
      <UserStatCard
        label="Total user"
        value={stats.total}
        sub={`${stats.active} aktif · ${stats.inactive} nonaktif`}
      />
      <UserStatCard
        label="Sedang login"
        value={stats.sedangLogin}
        sub="sesi aktif sekarang"
      />
      <UserStatCard
        label="2FA aktif"
        value="—"
        sub="wajib untuk admin & psikolog"
      />
      <UserStatCard
        label="Role"
        value={ROLE_INFO.length}
        sub="6 level akses berbeda"
      />
    </div>
  );
}
