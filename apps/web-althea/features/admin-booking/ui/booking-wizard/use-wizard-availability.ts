'use client';

import { useMemo } from 'react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { usePsikologAvailabilityForDate } from '@/features/admin-psikolog/hooks/use-psikolog';
import { pastSlotIdx } from './wizard-utils';
import type { WizardState } from './wizard-types';

interface SlotDef {
  start: string;
  end: string;
  label?: string;
  disabled?: boolean;
}

interface UseWizardAvailabilityParams {
  s: WizardState;
  slots: SlotDef[];
  isMulti: boolean;
}

/**
 * Computes all availability-related derived values for the booking wizard.
 * Operates on sessions[0] for single-session mode; isMulti flag drives intraConflict.
 */
export function useWizardAvailability({
  s,
  slots,
  isMulti,
}: UseWizardAvailabilityParams) {
  const firstSession = s.sessions[0];
  const firstDate = firstSession?.date ?? '';
  const firstSlotIdx = firstSession?.slotIdx ?? null;
  const selectedSlot = firstSlotIdx !== null ? slots[firstSlotIdx] : null;

  const psikologDayBookings = useBookingList({
    psikologUserId: s.psikologUserId ?? undefined,
    date: s.psikologUserId && firstDate ? firstDate : undefined,
    limit: 50,
    includeCancelled: false,
  });

  // Semua booking di tanggal yang dipilih (tidak filter psikolog) —
  // dipakai untuk deteksi ruangan yang sudah terpakai di slot terpilih.
  const allDayBookings = useBookingList({
    date: firstDate || undefined,
    limit: 100,
    includeCancelled: false,
  });

  const availabilityQuery = usePsikologAvailabilityForDate(
    s.psikologUserId,
    firstDate,
  );
  const resolvedAvailability = availabilityQuery.data?.data;

  const psikologClosedToday = useMemo(() => {
    if (!s.psikologUserId || !firstDate) return false;
    if (!resolvedAvailability) return false;
    return !resolvedAvailability.isOpen;
  }, [resolvedAvailability, s.psikologUserId, firstDate]);

  const unavailableSlotIdx = useMemo(() => {
    if (!s.psikologUserId || !firstDate) return new Set<number>();
    if (psikologClosedToday) {
      return new Set<number>(slots.map((_, i) => i));
    }
    const taken = pastSlotIdx(firstDate, slots);
    const allowed = resolvedAvailability?.slotIndices;
    if (allowed !== null && allowed !== undefined) {
      const allowedSet = new Set(allowed);
      slots.forEach((_, idx) => {
        if (!allowedSet.has(idx)) taken.add(idx);
      });
    }
    const bookings = psikologDayBookings.data?.data ?? [];
    for (const b of bookings) {
      const bStart = new Date(b.scheduledStart).getTime();
      const bEnd = new Date(b.scheduledEnd).getTime();
      slots.forEach((slot, idx) => {
        const slotStart = new Date(`${firstDate}T${slot.start}:00`).getTime();
        const slotEnd = new Date(`${firstDate}T${slot.end}:00`).getTime();
        if (bStart < slotEnd && bEnd > slotStart) taken.add(idx);
      });
    }
    return taken;
  }, [
    psikologDayBookings.data,
    slots,
    firstDate,
    s.psikologUserId,
    psikologClosedToday,
    resolvedAvailability,
  ]);

  // RoomId yang sudah terpakai di slot yang dipilih (single-session mode).
  const occupiedRoomIds = useMemo(() => {
    if (!firstDate || firstSlotIdx === null || !selectedSlot) return new Set<number>();
    const slotStart = new Date(`${firstDate}T${selectedSlot.start}:00`).getTime();
    const slotEnd = new Date(`${firstDate}T${selectedSlot.end}:00`).getTime();
    const occupied = new Set<number>();
    for (const b of allDayBookings.data?.data ?? []) {
      const bStart = new Date(b.scheduledStart).getTime();
      const bEnd = new Date(b.scheduledEnd).getTime();
      if (bStart < slotEnd && bEnd > slotStart) {
        occupied.add(b.roomId);
      }
    }
    return occupied;
  }, [allDayBookings.data, firstDate, firstSlotIdx, selectedSlot]);

  // Intra-session conflict (multi mode): sesi yang punya date+slotIdx duplikat.
  const intraConflict = useMemo(() => {
    if (!isMulti) return new Set<number>();
    const seen = new Map<string, number[]>();
    s.sessions.forEach((ses, i) => {
      if (ses.slotIdx === null) return;
      const key = `${ses.date}#${ses.slotIdx}`;
      const arr = seen.get(key) ?? [];
      arr.push(i);
      seen.set(key, arr);
    });
    const conflicts = new Set<number>();
    for (const arr of seen.values()) {
      if (arr.length > 1) arr.forEach((i) => conflicts.add(i));
    }
    return conflicts;
  }, [s.sessions, isMulti]);

  return {
    psikologDayBookings,
    allDayBookings,
    availabilityQuery,
    resolvedAvailability,
    psikologClosedToday,
    unavailableSlotIdx,
    occupiedRoomIds,
    intraConflict,
    selectedSlot,
  };
}
