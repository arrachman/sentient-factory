'use client';

/**
 * All state, derived values, and mutation hooks for EditBookingDialog.
 * The `if (!booking) return null` guard lives in the dialog, NOT here.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  useBookingList,
  useCancelBooking,
  useCompleteBooking,
  useRescheduleBooking,
  useStartBooking,
  useUpdateBooking,
} from '../hooks/use-booking';
import {
  usePsikologAvailabilityForDate,
  usePsikologList,
} from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import type { Booking } from '../model/types';
import { toDateKey } from './booking-wizard/wizard-utils';
import { type Slot, findSlotIdx, hhmm } from './edit-booking-dialog.helpers';

export function useEditBookingState(booking: Booking | null, onClose: () => void) {
  const [date, setDate] = useState('');
  const [slotIdx, setSlotIdx] = useState<number | null>(null);
  const [psikologUserId, setPsikologUserId] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const settingsQuery = useSettings();
  const reschedule = useRescheduleBooking();
  const updateNotes = useUpdateBooking();
  const startMut = useStartBooking();
  const completeMut = useCompleteBooking();
  const cancelMut = useCancelBooking();

  const slots: Slot[] = settingsQuery.data?.data.slotsOfDay ?? [];
  const closedDayOfWeek = settingsQuery.data?.data.closedDayOfWeek ?? [];
  const holidays = settingsQuery.data?.data.holidays ?? [];
  const slotsReady = slots.length > 0;

  // Slot index of the original booking (to detect changes and allow re-selecting
  // the same slot even if the psikolog schedule has changed since booking was made).
  const origSlotIdx = useMemo(() => {
    if (!booking || !slotsReady) return null;
    return findSlotIdx(slots, hhmm(booking.scheduledStart), hhmm(booking.scheduledEnd));
  }, [booking, slots, slotsReady]);

  // Reset when booking changes; re-init slotIdx once clinic slots are loaded.
  useEffect(() => {
    if (!booking) return;
    setDate(toDateKey(new Date(booking.scheduledStart)));
    setPsikologUserId(booking.psikologUserId);
    setRoomId(booking.roomId);
    setReason('');
    setNotes(booking.notes ?? '');
    setSlotIdx(
      slotsReady
        ? findSlotIdx(slots, hhmm(booking.scheduledStart), hhmm(booking.scheduledEnd))
        : null,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.id, slotsReady]);

  const psikologListFiltered = useMemo(() => {
    const all = psikologList.data?.data ?? [];
    if (!booking) return all;
    return all.filter((p) => {
      const ids = p.serviceIds ?? [];
      return ids.length === 0 || ids.includes(booking.serviceId);
    });
  }, [psikologList.data, booking]);

  const selectedPsikolog = useMemo(
    () => psikologList.data?.data.find((p) => p.userId === psikologUserId) ?? null,
    [psikologList.data, psikologUserId],
  );
  const psikologName = selectedPsikolog?.fullName ?? null;

  const availabilityQuery = usePsikologAvailabilityForDate(psikologUserId, date);
  const resolvedAvailability = availabilityQuery.data?.data;
  const psikologClosedToday =
    !!psikologUserId && !!date && !!resolvedAvailability && !resolvedAvailability.isOpen;
  const overrideReason =
    resolvedAvailability?.source === 'override' ? resolvedAvailability.reason : null;

  const psikologDayBookings = useBookingList({
    psikologUserId: psikologUserId ?? undefined,
    date: psikologUserId && date ? date : undefined,
    limit: 50,
    includeCancelled: false,
  });
  const allDayBookings = useBookingList({
    date: date || undefined,
    limit: 100,
    includeCancelled: false,
  });

  const sameAsOriginal =
    !!booking &&
    date === toDateKey(new Date(booking.scheduledStart)) &&
    psikologUserId === booking.psikologUserId;

  const unavailableSlotIdx = useMemo(() => {
    if (!psikologUserId || !date) return new Set<number>();
    const taken = new Set<number>();
    if (psikologClosedToday) {
      slots.forEach((_, i) => taken.add(i));
    } else {
      const allowed = resolvedAvailability?.slotIndices;
      if (allowed !== null && allowed !== undefined) {
        const allowedSet = new Set(allowed);
        slots.forEach((_, idx) => {
          if (!allowedSet.has(idx)) taken.add(idx);
        });
      }
      for (const b of psikologDayBookings.data?.data ?? []) {
        if (booking && b.id === booking.id) continue; // don't block this booking's own slot
        const bStart = new Date(b.scheduledStart).getTime();
        const bEnd = new Date(b.scheduledEnd).getTime();
        slots.forEach((slot, idx) => {
          const slotStart = new Date(`${date}T${slot.start}:00`).getTime();
          const slotEnd = new Date(`${date}T${slot.end}:00`).getTime();
          if (bStart < slotEnd && bEnd > slotStart) taken.add(idx);
        });
      }
    }
    // Original slot can always be re-selected if date & psikolog haven't changed.
    if (sameAsOriginal && origSlotIdx !== null) taken.delete(origSlotIdx);
    return taken;
  }, [
    psikologUserId,
    date,
    psikologClosedToday,
    resolvedAvailability,
    psikologDayBookings.data,
    slots,
    booking,
    sameAsOriginal,
    origSlotIdx,
  ]);

  const selectedSlot = slotIdx !== null ? slots[slotIdx] ?? null : null;

  const occupiedRoomIds = useMemo(() => {
    if (!date || slotIdx === null || !selectedSlot) return new Set<number>();
    const slotStart = new Date(`${date}T${selectedSlot.start}:00`).getTime();
    const slotEnd = new Date(`${date}T${selectedSlot.end}:00`).getTime();
    const occ = new Set<number>();
    for (const b of allDayBookings.data?.data ?? []) {
      if (booking && b.id === booking.id) continue;
      const bStart = new Date(b.scheduledStart).getTime();
      const bEnd = new Date(b.scheduledEnd).getTime();
      if (bStart < slotEnd && bEnd > slotStart) occ.add(b.roomId);
    }
    return occ;
  }, [allDayBookings.data, date, slotIdx, selectedSlot, booking]);

  const status = booking?.status;
  const canReschedule = status === 'checked_in';
  const canEditNotes = status !== 'completed' && status !== 'cancelled';
  const busy =
    reschedule.isPending ||
    updateNotes.isPending ||
    startMut.isPending ||
    completeMut.isPending ||
    cancelMut.isPending;

  const scheduleChanged =
    canReschedule &&
    !!date &&
    slotIdx !== null &&
    booking !== null &&
    (date !== toDateKey(new Date(booking.scheduledStart)) ||
      slotIdx !== origSlotIdx ||
      psikologUserId !== booking.psikologUserId ||
      roomId !== booking.roomId);
  const notesChanged = canEditNotes && notes.trim() !== (booking?.notes ?? '').trim();
  const dirty = scheduleChanged || notesChanged;

  return {
    // form state
    date,
    setDate,
    slotIdx,
    setSlotIdx,
    psikologUserId,
    setPsikologUserId,
    roomId,
    setRoomId,
    reason,
    setReason,
    notes,
    setNotes,
    // data
    slots,
    closedDayOfWeek,
    holidays,
    psikologListFiltered,
    selectedPsikolog,
    psikologName,
    roomList,
    // availability
    resolvedAvailability,
    psikologClosedToday,
    overrideReason,
    psikologDayBookings,
    unavailableSlotIdx,
    occupiedRoomIds,
    selectedSlot,
    // derived flags
    canReschedule,
    canEditNotes,
    busy,
    dirty,
    scheduleChanged,
    notesChanged,
    origSlotIdx,
    // mutations
    reschedule,
    updateNotes,
    startMut,
    completeMut,
    cancelMut,
    // action
    onClose,
  };
}
