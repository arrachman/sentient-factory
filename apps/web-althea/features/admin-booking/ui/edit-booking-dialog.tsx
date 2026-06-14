'use client';

/**
 * Form edit booking terpadu. Satu surface UX, tapi setiap perubahan
 * dispatch ke endpoint backend yang sudah tervalidasi:
 *  - jadwal / ruang / psikolog → POST /booking/:id/reschedule (cek konflik + WA + history)
 *  - status                    → start / complete / cancel (state machine + WA + audit)
 *  - catatan                   → PATCH /booking/:id (notes only)
 *
 * State + mutations → useEditBookingState
 * Schedule section  → EditBookingSchedulePanel
 */
import { X } from 'lucide-react';
import { STATUS_BADGE_CLASS, STATUS_LABEL, type Booking } from '../model/types';
import { buildIso } from './booking-wizard/wizard-utils';
import { fmtRange } from './edit-booking-dialog.helpers';
import { useEditBookingState } from './use-edit-booking-state';
import { EditBookingSchedulePanel } from './edit-booking-schedule-panel';

export function EditBookingDialog({
  booking,
  onClose,
}: {
  booking: Booking | null;
  onClose: () => void;
}) {
  const state = useEditBookingState(booking, onClose);

  if (!booking) return null;

  const {
    date, slotIdx, psikologUserId, setPsikologUserId, roomId, setRoomId,
    reason, setReason, notes, setNotes,
    slots, closedDayOfWeek, holidays,
    psikologListFiltered, selectedPsikolog, psikologName, roomList,
    resolvedAvailability, psikologClosedToday, overrideReason,
    psikologDayBookings, unavailableSlotIdx, occupiedRoomIds,
    canReschedule, canEditNotes, busy, dirty, scheduleChanged,
    reschedule, updateNotes, startMut, completeMut, cancelMut,
    setDate, setSlotIdx,
  } = state;

  const { status } = booking;

  const bookingId = booking.id;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!dirty) return;
    try {
      if (scheduleChanged && slotIdx !== null) {
        const slot = slots[slotIdx];
        await reschedule.mutateAsync({
          id: bookingId,
          input: {
            scheduledStart: buildIso(date, slot.start),
            scheduledEnd: buildIso(date, slot.end),
            psikologUserId: psikologUserId ?? undefined,
            roomId: roomId ?? undefined,
            reason: reason.trim() || undefined,
          },
        });
      }
      if (state.notesChanged) {
        await updateNotes.mutateAsync({ id: bookingId, input: { notes: notes.trim() } });
      }
      onClose();
    } catch {
      // error toast handled in individual hooks
    }
  }

  function doStart() {
    startMut.mutate(bookingId, { onSuccess: onClose });
  }
  function doComplete() {
    completeMut.mutate(bookingId, { onSuccess: onClose });
  }
  function doCancel() {
    const r = window.prompt('Alasan pembatalan (opsional):') ?? '';
    cancelMut.mutate({ id: bookingId, reason: r.trim() || undefined }, { onSuccess: onClose });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card-althea w-full max-w-xl max-h-[90vh] overflow-y-auto bg-card">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="h2">Edit Booking #{booking.id}</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className={`badge ${STATUS_BADGE_CLASS[status]}`}>{STATUS_LABEL[status]}</span>
              <span className="caption">
                {booking.client.name} — {booking.service.name}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-icon btn-sm"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={save} className="space-y-3 px-6 py-4">
          {/* Schedule section */}
          {!canReschedule ? (
            <>
              <div className="rounded-md border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
                Jadwal, ruang & psikolog hanya bisa diubah saat status{' '}
                <strong>Check-in</strong>. Booking ini <strong>{STATUS_LABEL[status]}</strong>.
              </div>
              <div className="rounded-md border border-border bg-cream-50 px-3 py-2.5 text-sm">
                <div className="caption mb-0.5">Jadwal saat ini</div>
                <div className="font-medium text-teal-800">
                  {fmtRange(booking.scheduledStart, booking.scheduledEnd)}
                </div>
                <div className="caption mt-1">
                  Psikolog: {booking.psikolog?.fullName ?? '—'} · Ruang:{' '}
                  {booking.room?.name ?? '—'}
                </div>
              </div>
            </>
          ) : (
            <EditBookingSchedulePanel
              psikologListFiltered={psikologListFiltered}
              psikologUserId={psikologUserId}
              setPsikologUserId={setPsikologUserId}
              psikologName={psikologName}
              selectedPsikolog={selectedPsikolog}
              date={date}
              setDate={setDate}
              closedDayOfWeek={closedDayOfWeek}
              holidays={holidays}
              resolvedAvailability={resolvedAvailability}
              psikologClosedToday={psikologClosedToday}
              overrideReason={overrideReason}
              slots={slots}
              slotIdx={slotIdx}
              setSlotIdx={setSlotIdx}
              unavailableSlotIdx={unavailableSlotIdx}
              psikologDayBookingsLoading={psikologDayBookings.isLoading}
              roomId={roomId}
              setRoomId={setRoomId}
              roomListData={roomList.data?.data ?? []}
              occupiedRoomIds={occupiedRoomIds}
              scheduleChanged={scheduleChanged}
              reason={reason}
              setReason={setReason}
            />
          )}

          {/* Notes */}
          <div>
            <label className="caption mb-1 block">Catatan booking</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!canEditNotes}
              rows={3}
              className="input-althea h-auto py-2 disabled:opacity-60"
              placeholder={canEditNotes ? 'Catatan internal booking…' : 'Tidak bisa diubah'}
            />
          </div>

          {/* Status action buttons */}
          {(status === 'checked_in' || status === 'in_progress') && (
            <div className="flex flex-wrap gap-2 border-t border-border pt-3">
              <span className="caption self-center mr-1">Ubah status:</span>
              {status === 'checked_in' && (
                <button
                  type="button"
                  onClick={doStart}
                  disabled={busy}
                  className="btn btn-outline btn-sm"
                >
                  Mulai sesi
                </button>
              )}
              {status === 'in_progress' && (
                <button
                  type="button"
                  onClick={doComplete}
                  disabled={busy}
                  className="btn btn-outline btn-sm"
                >
                  Tandai selesai
                </button>
              )}
              <button
                type="button"
                onClick={doCancel}
                disabled={busy}
                className="btn btn-outline btn-sm text-danger"
              >
                Batalkan
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
              Tutup
            </button>
            <button type="submit" disabled={busy || !dirty} className="btn btn-primary btn-sm">
              {busy ? 'Menyimpan…' : 'Simpan perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
