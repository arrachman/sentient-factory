'use client';

import { useState } from 'react';
import {
  usePsikologMe,
  usePsikologStats,
  useUpdateProfile,
} from '../hooks/use-profile';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import { ProfileCard } from './profile-card';
import { ProfileMobile } from './profile-mobile';
import { ProfileEditDialog } from './profile-edit-dialog';
import { StatsCard } from './stats-card';
import { AvailabilityGrid } from './availability-grid';
import { AvailabilityOverridesSection } from '@/features/psikolog-schedule/ui/availability-overrides-section';

export function ProfilePage() {
  const meQuery = usePsikologMe();
  const statsQuery = usePsikologStats();
  const settingsQuery = useSettings();
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

  const slots = settingsQuery.data?.data.slotsOfDay ?? [];

  return (
    <>
      <ProfileMobile
        p={p}
        stats={statsQuery.data?.data}
        statsLoading={statsQuery.isLoading}
        onEdit={() => setEditOpen(true)}
      />

      {/* Desktop: 2-column grid — left profile info, right availability editor */}
      <div
        className="hidden lg:grid p-6"
        style={{
          gridTemplateColumns: '340px 1fr',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* Left column */}
        <div className="flex flex-col" style={{ gap: 16 }}>
          <ProfileCard p={p} onEdit={() => setEditOpen(true)} />
          <StatsCard
            stats={statsQuery.data?.data}
            isLoading={statsQuery.isLoading}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col" style={{ gap: 16 }}>
          {slots.length > 0 ? (
            <AvailabilityGrid
              initial={p.weeklyAvailability ?? {}}
              slots={slots}
              readOnly
            />
          ) : (
            <div className="card-althea" style={{ padding: 22 }}>
              <span className="eyebrow">Availability mingguan</span>
              <p className="caption" style={{ marginTop: 8 }}>
                Slot operasional belum dikonfigurasi. Admin perlu mengatur slot di{' '}
                <span style={{ color: 'var(--sage-700)' }}>/admin/pengaturan</span>.
              </p>
            </div>
          )}
          {/* Override & cuti — psikolog bisa set sendiri */}
          <div className="card-althea" style={{ padding: 22 }}>
            <span className="eyebrow">Override & Cuti</span>
            <h2
              style={{
                margin: '2px 0 12px',
                fontFamily: 'var(--font-serif)',
                fontSize: 18,
                fontWeight: 500,
                color: 'var(--teal-800)',
              }}
            >
              Pengecualian per-tanggal
            </h2>
            <AvailabilityOverridesSection />
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
