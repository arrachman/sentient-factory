'use client';

import { usePsikologMe, useUpdateAvailability } from '../hooks/use-profile';
import { AvailabilityGrid } from './availability-grid';
import { CapacityCard } from './capacity-card';
import { ProfileCard } from './profile-card';
import { StatsCard } from './stats-card';

/**
 * Psikolog · Profil Saya — own profile + availability editor.
 *
 * Layout 1fr 2fr:
 *   - Left: ProfileCard + StatsCard
 *   - Right: AvailabilityGrid + CapacityCard
 */
export function ProfilePage() {
  const meQuery = usePsikologMe();
  const updateMut = useUpdateAvailability();

  if (meQuery.isLoading) {
    return (
      <div className="card-althea" style={{ padding: 32, textAlign: 'center', margin: 28 }}>
        <p className="caption">Memuat profil...</p>
      </div>
    );
  }

  if (meQuery.error) {
    return (
      <div
        className="card-althea"
        style={{
          padding: 32,
          textAlign: 'center',
          margin: 28,
          color: 'var(--danger, #b54141)',
        }}
      >
        <p className="caption">
          Gagal memuat profil: {(meQuery.error as Error).message}
        </p>
      </div>
    );
  }

  const p = meQuery.data?.data;
  if (!p) return null;

  return (
    <div style={{ padding: 28 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) minmax(0, 2fr)',
          gap: 20,
        }}
      >
        {/* Left column */}
        <div className="flex flex-col" style={{ gap: 12 }}>
          <ProfileCard p={p} />
          <StatsCard
            stats={[
              { value: '—', label: 'Sesi 30 hari' },
              { value: '—', label: 'Klien aktif' },
              { value: '—', label: 'Kehadiran' },
              { value: '—', label: 'Rating klien' },
            ]}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col" style={{ gap: 0 }}>
          <AvailabilityGrid
            initial={p.weeklyAvailability ?? {}}
            saving={updateMut.isPending}
            onSave={(wa) => updateMut.mutate(wa)}
          />
          <CapacityCard defaultSlots={p.defaultSlots} />
        </div>
      </div>
    </div>
  );
}
