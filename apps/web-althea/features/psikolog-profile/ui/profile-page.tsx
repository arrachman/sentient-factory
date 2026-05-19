'use client';

import { useState } from 'react';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import {
  usePsikologMe,
  usePsikologStats,
  useUpdateAvailability,
  useUpdateProfile,
} from '../hooks/use-profile';
import { AvailabilityGrid } from './availability-grid';
import { ProfileCard } from './profile-card';
import { ProfileMobile } from './profile-mobile';
import { ProfileEditDialog } from './profile-edit-dialog';
import { StatsCard } from './stats-card';

/**
 * Psikolog · Profil Saya — own profile + availability editor.
 *
 * Layout 1fr 2fr:
 *   - Left: ProfileCard (clickable Edit) + StatsCard (live data)
 *   - Right: AvailabilityGrid + CapacityCard
 */
export function ProfilePage() {
  const meQuery = usePsikologMe();
  const statsQuery = usePsikologStats();
  const settingsQuery = useSettings();
  const availMut = useUpdateAvailability();
  const profileMut = useUpdateProfile();
  const [editOpen, setEditOpen] = useState(false);

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

  const slots = settingsQuery.data?.data?.slotsOfDay ?? [];

  return (
    <>
      <ProfileMobile
        p={p}
        stats={statsQuery.data?.data}
        statsLoading={statsQuery.isLoading}
        onEdit={() => setEditOpen(true)}
      />

      <div className="hidden lg:block p-6">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) minmax(0, 2fr)',
          gap: 20,
        }}
      >
        {/* Left column */}
        <div className="flex flex-col" style={{ gap: 12 }}>
          <ProfileCard p={p} onEdit={() => setEditOpen(true)} />
          <StatsCard
            stats={statsQuery.data?.data}
            isLoading={statsQuery.isLoading}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col" style={{ gap: 0 }}>
          <AvailabilityGrid
            initial={p.weeklyAvailability ?? {}}
            slots={slots}
            saving={availMut.isPending}
            onSave={(wa) => availMut.mutate(wa)}
          />
        </div>
      </div>
      </div>

      <ProfileEditDialog
        open={editOpen}
        initial={p}
        submitting={profileMut.isPending}
        onClose={() => setEditOpen(false)}
        onSubmit={(input) =>
          profileMut.mutate(input, {
            onSuccess: () => setEditOpen(false),
          })
        }
      />
    </>
  );
}
