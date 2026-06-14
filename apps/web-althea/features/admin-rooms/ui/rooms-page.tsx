'use client';

/**
 * Admin · Pemakaian Ruangan — orchestrator.
 *
 * Mirror dari mockup `apps/psychology-design/AdminRooms.jsx`.
 * Logic state & data ada di hook `useRoomsPage()`. Sub-komponen masing-masing
 * di file terpisah (`rooms-toolbar`, `room-stat-tile`, `room-usage-grid`,
 * `room-usage-legend`, `room-detail-panel`, `room-crud-drawer`).
 */
import { useRoomsPage } from '../hooks/use-rooms-page';
import { RoomCrudDrawer } from './room-crud-drawer';
import { RoomDetailPanel } from './room-detail-panel';
import { RoomReassignDialog } from './room-reassign-dialog';
import { RoomsMobile } from './rooms-mobile';
import { RoomStatTilesRow } from './room-stat-tiles-row';
import { RoomUsageGrid } from './room-usage-grid';
import { RoomUsageLegend } from './room-usage-legend';
import { RoomsToolbar } from './rooms-toolbar';

export function RoomsPage() {
  const page = useRoomsPage();

  return (
    <>
      <RoomsMobile
        rooms={page.rooms}
        bookings={page.bookings}
        isLoading={page.isLoading}
      />

      <div className="hidden lg:flex flex-col h-full min-h-0">
        <RoomsToolbar
          date={page.date}
          onChangeDate={page.setDate}
          onOpenCrud={page.openCrud}
          onCreate={page.startCreate}
        />

        <RoomStatTilesRow stats={page.stats} />

        <div
          className="px-6 pb-6 flex-1 min-h-0"
          style={{ display: 'flex', gap: 16 }}
        >
          <GridCard>
            <GridHeader legendPsikologs={page.todayPsikolog} />
            <GridBody
              isLoading={page.isLoading}
              hasRooms={page.rooms.length > 0}
            >
              <RoomUsageGrid
                rooms={page.rooms}
                bookings={page.bookings}
                dateKey={page.date}
                slots={page.slots}
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
              slot={page.slots[page.picked.slotIdx]}
              booking={page.picked.booking}
              onClose={page.clearPicked}
              onEditMaster={() => page.startEdit(page.picked!.room)}
              onDelete={() => page.deleteRoom(page.picked!.room)}
              onDeactivate={() => page.deactivateRoom(page.picked!.room)}
              onReassignBooking={page.startReassign}
            />
          ) : null}
        </div>
      </div>

      {page.crudOpen ? (
        <RoomCrudDrawer
          rooms={page.rooms}
          editing={page.editing}
          form={page.form}
          submitting={page.submitting}
          onClose={page.closeCrud}
          onChangeForm={page.setForm}
          onSubmit={page.submitForm}
          onCreateNew={page.startCreate}
          onEdit={page.startEdit}
          onDelete={page.deleteRoom}
          onDeactivate={page.deactivateRoom}
        />
      ) : null}

      {page.reassignBooking && page.picked ? (
        <RoomReassignDialog
          booking={page.reassignBooking}
          currentRoom={page.picked.room}
          rooms={page.rooms}
          submitting={page.reassignSubmitting}
          onClose={page.cancelReassign}
          onSubmit={page.submitReassign}
        />
      ) : null}
    </>
  );
}

// =====================================================================
// Local layout slivers
// =====================================================================

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
        Grid Pemakaian Ruangan
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
        Belum ada ruangan. Klik "Tambah Ruangan" untuk membuat.
      </div>
    );
  }
  return <>{children}</>;
}
