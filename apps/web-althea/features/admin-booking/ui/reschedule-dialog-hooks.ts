import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  usePsikologList,
  usePsikologAvailabilityForDate,
} from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { resolveServiceSlots } from '@/features/admin-layanan/model/slot';
import { type SlotBookingInfo } from './booking-wizard/slot-grid';
import { pastSlotIdx } from './booking-wizard/wizard-utils';
import { STATUS_LABEL, type Booking } from '../model/types';
import { isoToDateKey, isoToTimeHHMM } from './reschedule-dialog-utils';

export function useRescheduleDialogState(booking: Booking | null) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number | null>(null);
  const [psikologUserId, setPsikologUserId] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [weekRange, setWeekRange] = useState<{ from: string; to: string } | null>(null);

  const handleWeekChange = useCallback((from: string, to: string) => {
    setWeekRange((prev) =>
      prev && prev.from === from && prev.to === to ? prev : { from, to },
    );
  }, []);

  useEffect(() => {
    if (booking) {
      setSelectedDate(isoToDateKey(booking.scheduledStart));
      setPsikologUserId(booking.psikologUserId);
      setRoomId(booking.roomId);
      setReason('');
      setSelectedSlotIdx(null);
    }
  }, [booking]);

  return {
    selectedDate, setSelectedDate,
    selectedSlotIdx, setSelectedSlotIdx,
    psikologUserId, setPsikologUserId,
    roomId, setRoomId,
    reason, setReason,
    weekRange,
    handleWeekChange,
  };
}

export function useRescheduleDialogData(booking: Booking | null) {
  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const serviceList = useServiceList({ limit: 200, isActive: true });
  const settingsQuery = useSettings();

  const globalSlots = settingsQuery.data?.data.slotsOfDay ?? [];
  const closedDays = settingsQuery.data?.data.closedDayOfWeek ?? [];
  const holidays = settingsQuery.data?.data.holidays ?? [];

  const selectedService = useMemo(
    () => serviceList.data?.data.find((sv) => sv.id === booking?.serviceId),
    [serviceList.data, booking?.serviceId],
  );

  const slots = useMemo(
    () => resolveServiceSlots(globalSlots, selectedService?.slotOverrides),
    [globalSlots, selectedService],
  );

  const psikologListFiltered = useMemo(() => {
    const all = psikologList.data?.data ?? [];
    if (!booking?.serviceId) return all;
    return all.filter((p) => {
      const ids = p.serviceIds ?? [];
      return ids.length === 0 || ids.includes(booking.serviceId);
    });
  }, [psikologList.data, booking?.serviceId]);

  return {
    psikologList,
    roomList,
    slots,
    closedDays,
    holidays,
    psikologListFiltered,
  };
}

export function useRescheduleSlotComputation(
  booking: Booking | null,
  psikologUserId: number | null,
  selectedDate: string,
  selectedSlotIdx: number | null,
  slots: ReturnType<typeof resolveServiceSlots>,
) {
  const psikologDayBookings = useBookingList({
    psikologUserId: psikologUserId ?? undefined,
    date: psikologUserId && selectedDate ? selectedDate : undefined,
    limit: 50,
    includeCancelled: false,
  });

  const allDayBookings = useBookingList({
    date: selectedDate || undefined,
    limit: 100,
    includeCancelled: false,
  });

  const selectedSlot = selectedSlotIdx !== null ? slots[selectedSlotIdx] : null;

  const occupiedRoomIds = useMemo(() => {
    if (!selectedDate || !selectedSlot) return new Set<number>();
    const sStart = new Date(`${selectedDate}T${selectedSlot.start}:00`).getTime();
    const sEnd = new Date(`${selectedDate}T${selectedSlot.end}:00`).getTime();
    const occupied = new Set<number>();
    for (const b of (allDayBookings.data?.data ?? []).filter((b) => b.id !== booking?.id)) {
      const bStart = new Date(b.scheduledStart).getTime();
      const bEnd = new Date(b.scheduledEnd).getTime();
      if (bStart < sEnd && bEnd > sStart) occupied.add(b.roomId);
    }
    return occupied;
  }, [allDayBookings.data, selectedDate, selectedSlot, booking?.id]);

  return { psikologDayBookings, selectedSlot, occupiedRoomIds };
}

export function useRescheduleFiltering(
  booking: Booking | null,
  psikologUserId: number | null,
  selectedDate: string,
  weekRange: { from: string; to: string } | null,
) {
  const psikologWeekBookings = useBookingList({
    psikologUserId: psikologUserId ?? undefined,
    dateFrom: psikologUserId && weekRange ? weekRange.from : undefined,
    dateTo: psikologUserId && weekRange ? weekRange.to : undefined,
    limit: 200,
    includeCancelled: false,
  });

  const bookingCountByDate = useMemo(() => {
    if (!psikologUserId) return undefined;
    const counts: Record<string, number> = {};
    for (const b of psikologWeekBookings.data?.data ?? []) {
      const key = isoToDateKey(b.scheduledStart);
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, [psikologWeekBookings.data, psikologUserId]);

  return { bookingCountByDate };
}

export function useRescheduleAvailability(
  booking: Booking | null,
  psikologUserId: number | null,
  selectedDate: string,
  psikologDayBookings: ReturnType<typeof useBookingList>,
  slots: ReturnType<typeof resolveServiceSlots>,
) {
  const availabilityQuery = usePsikologAvailabilityForDate(psikologUserId, selectedDate);
  const resolvedAvailability = availabilityQuery.data?.data;

  const psikologClosedToday = useMemo(() => {
    if (!psikologUserId || !selectedDate || !resolvedAvailability) return false;
    return !resolvedAvailability.isOpen;
  }, [resolvedAvailability, psikologUserId, selectedDate]);

  const slotBookingsByIdx = useMemo(() => {
    const map = new Map<number, SlotBookingInfo>();
    if (!selectedDate || !psikologUserId) return map;
    const otherBookings = (psikologDayBookings.data?.data ?? []).filter(
      (b) => b.id !== booking?.id,
    );
    for (const b of otherBookings) {
      const bStart = new Date(b.scheduledStart).getTime();
      const bEnd = new Date(b.scheduledEnd).getTime();
      slots.forEach((slot, idx) => {
        const sStart = new Date(`${selectedDate}T${slot.start}:00`).getTime();
        const sEnd = new Date(`${selectedDate}T${slot.end}:00`).getTime();
        if (bStart < sEnd && bEnd > sStart && !map.has(idx)) {
          map.set(idx, {
            clientName: b.client.name,
            statusLabel: STATUS_LABEL[b.status] ?? b.status,
          });
        }
      });
    }
    if (booking && isoToDateKey(booking.scheduledStart) === selectedDate) {
      const selfStart = isoToTimeHHMM(booking.scheduledStart);
      const selfIdx = slots.findIndex((s) => s.start === selfStart);
      if (selfIdx !== -1) {
        map.set(selfIdx, {
          clientName: booking.client.name,
          statusLabel: 'sesi saat ini',
        });
      }
    }
    return map;
  }, [psikologDayBookings.data, slots, selectedDate, psikologUserId, booking]);

  const unavailableSlotIdx = useMemo(() => {
    if (!psikologUserId || !selectedDate) return new Set<number>();
    if (psikologClosedToday) return new Set<number>(slots.map((_, i) => i));

    const taken = pastSlotIdx(selectedDate, slots);
    const allowed = resolvedAvailability?.slotIndices;
    if (allowed !== null && allowed !== undefined) {
      const allowedSet = new Set(allowed);
      slots.forEach((_, idx) => {
        if (!allowedSet.has(idx)) taken.add(idx);
      });
    }
    const otherBookings = (psikologDayBookings.data?.data ?? []).filter(
      (b) => b.id !== booking?.id,
    );
    for (const b of otherBookings) {
      const bStart = new Date(b.scheduledStart).getTime();
      const bEnd = new Date(b.scheduledEnd).getTime();
      slots.forEach((slot, idx) => {
        const sStart = new Date(`${selectedDate}T${slot.start}:00`).getTime();
        const sEnd = new Date(`${selectedDate}T${slot.end}:00`).getTime();
        if (bStart < sEnd && bEnd > sStart) taken.add(idx);
      });
    }
    if (booking && isoToDateKey(booking.scheduledStart) === selectedDate) {
      const selfStart = isoToTimeHHMM(booking.scheduledStart);
      const selfIdx = slots.findIndex((s) => s.start === selfStart);
      if (selfIdx !== -1) taken.add(selfIdx);
    }
    return taken;
  }, [
    psikologDayBookings.data,
    slots,
    selectedDate,
    psikologUserId,
    psikologClosedToday,
    resolvedAvailability,
    booking,
  ]);

  return { resolvedAvailability, psikologClosedToday, slotBookingsByIdx, unavailableSlotIdx };
}
