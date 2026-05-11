'use client';

/**
 * Psikolog · Pemakaian Ruangan (read-only) — orchestrator.
 *
 * Layout:
 *   - Toolbar (date nav + type filter)
 *   - 4 stat tiles (total / sessions today / utilization / empty rooms)
 *   - Main split: usage grid (left) + detail panel (right, kalau cell di-pick)
 *
 * Berbeda dari /admin/rooms:
 *   - No CRUD (Tambah/Atur/Edit/Hapus buttons)
 *   - Detail panel read-only (tidak ada button Edit/Hapus)
 *   - Footer note: "hubungi admin untuk booking"
 *
 * Backend `/clinic/room` GET endpoints terbuka untuk ALL_ROLES — psikolog
 * boleh akses read.
 */
import { Bell } from 'lucide-react';
import { RoomStatTilesRow } from '@/features/admin-rooms/ui/room-stat-tiles-row';
import { RoomUsageGrid } from '@/features/admin-rooms/ui/room-usage-grid';
import { RoomUsageLegend } from '@/features/admin-rooms/ui/room-usage-legend';
import { SLOTS } from '@/features/admin-rooms/model/constants';
import { usePsikologRooms } from '../hooks/use-psikolog-rooms';
import { RoomDetailPanel } from './room-detail-panel';
import { RoomsToolbar } from './rooms-toolbar';
import { useMemo } from 'react';

export function PsikologRoomsPage() {
  const page = usePsikologRooms();

  // Legend psikologs aktif hari ini (mirror admin)
  const todayPsikolog = useMemo(() => {
    const map = new Map<
      number,
      { id: number; short: string; color: string }
    >();
    for (const b of page.bookings) {
      if (!map.has(b.psikolog.id)) {
        map.set(b.psikolog.id, {
          id: b.psikolog.id,
          short:
            b.psikolog.fullName?.trim().split(/\s+/)[0] ??
            b.psikolog.email.split('@')[0],
          color:
            b.psikolog.clinicPsikologProfile?.color ?? 'var(--sage-500)',
        });
      }
    }
    return Array.from(map.values());
  }, [page.bookings]);

  if (!page.ready) {
    return (
      <div style={{ padding: 24 }}>
        <div className="caption">Memuat ruangan...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <PageHeader />

      <RoomsToolbar
        date={page.date}
        typeFilter={page.typeFilter}
        onChangeDate={page.setDate}
        onChangeType={page.setTypeFilter}
        onShiftPrev={page.shiftPrev}
        onShiftNext={page.shiftNext}
        onResetToToday={page.resetToToday}
      />

      <RoomStatTilesRow stats={page.stats} />

      <div
        className="px-7 pb-7 flex-1 min-h-0"
        style={{ display: 'flex', gap: 16 }}
      >
        <GridCard>
          <GridHeader legendPsikologs={todayPsikolog} />
          <GridBody
            isLoading={page.isLoading}
            hasRooms={page.rooms.length > 0}
          >
            <RoomUsageGrid
              rooms={page.rooms}
              bookings={page.bookings}
              dateKey={page.date}
              pickedKey={
                page.picked
                  ? `${page.picked.room.id}-${page.picked.slotIdx}`
                  : null
              }
              onPick={page.pickCell}
            />
          </GridBody>
        </GridCard>

        {page.picked ? (
          <RoomDetailPanel
            room={page.picked.room}
            slot={SLOTS[page.picked.slotIdx]}
            booking={page.picked.booking}
            onClose={page.clearPicked}
          />
        ) : null}
      </div>

      <Footnote />
    </div>
  );
}

// ============================================================================
// Local layout slivers
// ============================================================================

function PageHeader() {
  return (
    <div className="px-7 pt-6 pb-2">
      <div className="eyebrow">Klinis · Ruangan</div>
      <h1 className="h1 mt-1">Pemakaian Ruangan</h1>
      <p className="caption mt-1">
        Lihat ketersediaan ruangan klinik hari ini — read-only. Untuk
        reservasi atau perubahan, hubungi admin.
      </p>
    </div>
  );
}

function GridCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="card-althea flex flex-col"
      style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}
    >
      {children}
    </div>
  );
}

function GridHeader({
  legendPsikologs,
}: {
  legendPsikologs: Parameters<typeof RoomUsageLegend>[0]['psikologs'];
}) {
  return (
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
      <h2 className="text-base font-medium" style={{ margin: 0 }}>
        Grid Pemakaian · Slot × Ruangan
      </h2>
      <RoomUsageLegend psikologs={legendPsikologs} />
    </div>
  );
}

function GridBody({
  isLoading,
  hasRooms,
  children,
}: {
  isLoading: boolean;
  hasRooms: boolean;
  children: React.ReactNode;
}) {
  if (isLoading) {
    return (
      <div className="caption" style={{ padding: 24, textAlign: 'center' }}>
        Memuat data ruangan…
      </div>
    );
  }
  if (!hasRooms) {
    return (
      <div className="caption" style={{ padding: 24, textAlign: 'center' }}>
        Belum ada ruangan untuk filter ini.
      </div>
    );
  }
  return <>{children}</>;
}

function Footnote() {
  return (
    <div
      className="flex items-start gap-2 mx-7"
      style={{
        marginBottom: 14,
        padding: 12,
        background: 'var(--info-soft, #e6f0f7)',
        borderRadius: 8,
        border: '1px solid #cfdde8',
      }}
    >
      <Bell
        size={14}
        style={{
          color: 'var(--info, #4a90c0)',
          flexShrink: 0,
          marginTop: 2,
        }}
      />
      <span className="caption" style={{ color: '#2c4a60' }}>
        Tampilan ini read-only — psikolog dapat memantau slot ruangan tapi
        tidak melakukan reservasi langsung. Untuk booking ke ruangan tertentu,
        hubungi admin klinik.
      </span>
    </div>
  );
}
