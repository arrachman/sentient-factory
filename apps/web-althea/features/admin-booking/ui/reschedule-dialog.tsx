'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api-client';
import { DateStrip } from './booking-wizard/date-strip';
import { SlotGrid } from './booking-wizard/slot-grid';
import { buildIso } from './booking-wizard/wizard-utils';
import { type Booking } from '../model/types';
import {
  useRescheduleDialogState,
  useRescheduleDialogData,
  useRescheduleSlotComputation,
  useRescheduleFiltering,
  useRescheduleAvailability,
} from './reschedule-dialog-hooks';
import {
  RescheduleDialogPsikologField,
  RescheduleDialogAvailabilityWarnings,
  RescheduleDialogRoomField,
  RescheduleDialogReasonField,
} from './reschedule-dialog-form';

export function RescheduleDialog({
  booking,
  onClose,
}: {
  booking: Booking | null;
  onClose: () => void;
}) {
  const {
    selectedDate, setSelectedDate,
    selectedSlotIdx, setSelectedSlotIdx,
    psikologUserId, setPsikologUserId,
    roomId, setRoomId,
    reason, setReason,
    weekRange,
    handleWeekChange,
  } = useRescheduleDialogState(booking);

  const { psikologList, roomList, slots, closedDays, holidays, psikologListFiltered } =
    useRescheduleDialogData(booking);

  const selectedPsikolog = psikologList.data?.data.find((p) => p.userId === psikologUserId) ?? null;

  const { psikologDayBookings, selectedSlot, occupiedRoomIds } = useRescheduleSlotComputation(
    booking,
    psikologUserId,
    selectedDate,
    selectedSlotIdx,
    slots,
  );

  const { bookingCountByDate } = useRescheduleFiltering(
    booking,
    psikologUserId,
    selectedDate,
    weekRange,
  );

  const { resolvedAvailability, psikologClosedToday, slotBookingsByIdx, unavailableSlotIdx } =
    useRescheduleAvailability(booking, psikologUserId, selectedDate, psikologDayBookings, slots);

  const qc = useQueryClient();
  const mut = useMutation({
    mutationFn: async (payload: object) => {
      if (!booking) throw new Error('No booking selected');
      return apiClient.post(`/booking/${booking.id}/reschedule`, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clinic', 'booking'] });
      toast.success('Booking di-reschedule');
      onClose();
    },
    onError: (err: Error) => {
      if (err instanceof ApiError && err.status === 409) {
        const body = err.body as { conflictType?: string; conflictBookingId?: number };
        toast.error(`Conflict ${body?.conflictType}`, {
          description: `Bertabrakan dengan booking #${body?.conflictBookingId}.`,
        });
        return;
      }
      toast.error('Gagal reschedule', { description: err.message });
    },
  });

  if (!booking) return null;

  const canSubmit =
    !!selectedDate &&
    selectedSlotIdx !== null &&
    !unavailableSlotIdx.has(selectedSlotIdx) &&
    !!psikologUserId &&
    !mut.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !selectedSlot) return;
    mut.mutate({
      scheduledStart: buildIso(selectedDate, selectedSlot.start),
      scheduledEnd: buildIso(selectedDate, selectedSlot.end),
      psikologUserId: psikologUserId ?? undefined,
      roomId: roomId ?? undefined,
      reason: reason.trim() || undefined,
    });
  }

  const overrideReason =
    resolvedAvailability?.source === 'override' ? resolvedAvailability.reason : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card-althea w-full max-w-xl max-h-[92vh] flex flex-col bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4 flex-shrink-0">
          <div>
            <h2 className="h2">Reschedule Booking #{booking.id}</h2>
            <p className="caption mt-1">
              {booking.client.name} — {booking.service.name}
            </p>
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="space-y-4 px-6 py-4">
            <RescheduleDialogPsikologField
              psikologUserId={psikologUserId}
              psikologListFiltered={psikologListFiltered}
              onChangePsikolog={(id) => {
                setPsikologUserId(id);
                setSelectedSlotIdx(null);
              }}
            />

            <DateStrip
              selectedDate={selectedDate}
              psikolog={selectedPsikolog}
              psikologUserId={psikologUserId}
              closedDayOfWeek={closedDays}
              holidays={holidays}
              onChangeDate={(date) => {
                setSelectedDate(date);
                setSelectedSlotIdx(null);
              }}
              bookingCountByDate={bookingCountByDate}
              onWeekChange={handleWeekChange}
            />

            <RescheduleDialogAvailabilityWarnings
              psikologClosedToday={psikologClosedToday}
              psikologFullName={selectedPsikolog?.fullName}
              resolvedAvailabilitySource={resolvedAvailability?.source}
              overrideReason={overrideReason ?? null}
            />

            <SlotGrid
              slots={slots}
              unavailableSlotIdx={unavailableSlotIdx}
              slotIdx={selectedSlotIdx}
              psikologName={selectedPsikolog?.fullName ?? null}
              isLoadingBookings={psikologDayBookings.isLoading}
              onPick={(idx) => setSelectedSlotIdx(idx)}
              slotBookings={slotBookingsByIdx}
            />

            <RescheduleDialogRoomField
              roomId={roomId}
              roomList={roomList.data?.data ?? []}
              selectedSlotIdx={selectedSlotIdx}
              occupiedRoomIds={occupiedRoomIds}
              onChangeRoom={setRoomId}
            />

            <RescheduleDialogReasonField
              reason={reason}
              onChangeReason={setReason}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-border px-6 py-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
              Batal
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn btn-primary btn-sm disabled:opacity-50"
            >
              {mut.isPending ? 'Menyimpan...' : 'Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
