'use client';

/**
 * Hook orchestrator untuk Booking Wizard:
 *   - 4-step state (client → service → psikolog → schedule+room)
 *   - Reset on dialog open
 *   - Fetch lookup data (clients, services, psikolog, rooms, settings, day bookings)
 *   - Compute unavailableSlotIdx (cek conflict dengan booking psikolog di tgl tsb)
 *   - Submit mutation dengan idempotency key + 409 conflict handling
 */
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, ApiError } from '@/lib/api-client';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { useClientList } from '@/features/admin-clients/hooks/use-client';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import {
  usePsikologList,
  usePsikologAvailabilityForDate,
} from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';

export type WizardStep = 1 | 2 | 3 | 4;

export type WizardState = {
  step: WizardStep;
  clientId: number | null;
  serviceId: number | null;
  date: string;
  slotIdx: number | null;
  psikologUserId: number | null;
  roomId: number | null;
  bufferOverride: boolean;
  notes: string;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function tomorrowDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const INIT: WizardState = {
  step: 1,
  clientId: null,
  serviceId: null,
  date: tomorrowDateStr(),
  slotIdx: null,
  psikologUserId: null,
  roomId: null,
  bufferOverride: false,
  notes: '',
};

function buildIso(dateStr: string, timeHHMM: string): string {
  const d = new Date(`${dateStr}T${timeHHMM}:00`);
  return d.toISOString();
}

export function useWizardState({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [s, setS] = useState<WizardState>(INIT);
  const qc = useQueryClient();

  useEffect(() => {
    if (open) setS({ ...INIT });
  }, [open]);

  const clientList = useClientList({ limit: 200 });
  const serviceList = useServiceList({ limit: 200, isActive: true });
  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const settingsQuery = useSettings();

  const selectedService = useMemo(
    () => serviceList.data?.data.find((sv) => sv.id === s.serviceId),
    [serviceList.data, s.serviceId],
  );

  /**
   * Filtered list psikolog berdasarkan layanan terpilih.
   * Logic:
   *   - serviceId belum dipilih → tampil semua psikolog
   *   - psikolog.serviceIds kosong → handle SEMUA layanan, tetap muncul
   *   - psikolog.serviceIds includes serviceId → muncul
   *   - selain itu → di-filter out
   */
  const psikologListFiltered = useMemo(() => {
    const all = psikologList.data?.data ?? [];
    if (!s.serviceId) return all;
    return all.filter((p) => {
      const ids = p.serviceIds ?? [];
      return ids.length === 0 || ids.includes(s.serviceId as number);
    });
  }, [psikologList.data, s.serviceId]);

  const slots = settingsQuery.data?.data.slotsOfDay ?? [];
  const closedDays = settingsQuery.data?.data.closedDayOfWeek ?? [];
  const selectedSlot = s.slotIdx !== null ? slots[s.slotIdx] : null;
  const isClosedDay = closedDays.includes(
    new Date(`${s.date}T00:00:00`).getDay(),
  );

  const psikologDayBookings = useBookingList({
    psikologUserId: s.psikologUserId ?? undefined,
    date: s.psikologUserId && s.date ? s.date : undefined,
    limit: 50,
    includeCancelled: false,
  });

  // Selected psikolog (untuk akses weeklyAvailability fallback)
  const selectedPsikolog = useMemo(
    () => psikologList.data?.data.find((p) => p.userId === s.psikologUserId),
    [psikologList.data, s.psikologUserId],
  );

  // Resolve effective availability dari backend (merge date override + weekly).
  // Single source of truth — sama dengan logic assertPsikologAvailable.
  const availabilityQuery = usePsikologAvailabilityForDate(
    s.psikologUserId,
    s.date,
  );
  const resolvedAvailability = availabilityQuery.data?.data;

  // Cek apakah psikolog tidak praktik di hari `s.date`.
  const psikologClosedToday = useMemo(() => {
    if (!s.psikologUserId || !s.date) return false;
    if (!resolvedAvailability) return false; // still loading — don't gate
    return !resolvedAvailability.isOpen;
  }, [resolvedAvailability, s.psikologUserId, s.date]);

  const unavailableSlotIdx = useMemo(() => {
    if (!s.psikologUserId || !s.date) return new Set<number>();
    if (psikologClosedToday) {
      // Psikolog libur (weekly off / override closed) → semua slot disabled.
      return new Set<number>(slots.map((_, i) => i));
    }
    const taken = new Set<number>();

    // 1. Slot di luar window availability psikolog (weeklyAvailability slotIndices /
    //    override slotIndices). null = "semua slot OK kalau isOpen".
    const allowed = resolvedAvailability?.slotIndices;
    if (allowed !== null && allowed !== undefined) {
      const allowedSet = new Set(allowed);
      slots.forEach((_, idx) => {
        if (!allowedSet.has(idx)) taken.add(idx);
      });
    }

    // 2. Slot yang sudah di-booking psikolog di tanggal tsb (overlap).
    const bookings = psikologDayBookings.data?.data ?? [];
    for (const b of bookings) {
      const bStart = new Date(b.scheduledStart).getTime();
      const bEnd = new Date(b.scheduledEnd).getTime();
      slots.forEach((slot, idx) => {
        const slotStart = new Date(`${s.date}T${slot.start}:00`).getTime();
        const slotEnd = new Date(`${s.date}T${slot.end}:00`).getTime();
        if (bStart < slotEnd && bEnd > slotStart) taken.add(idx);
      });
    }
    return taken;
  }, [
    psikologDayBookings.data,
    slots,
    s.date,
    s.psikologUserId,
    psikologClosedToday,
    resolvedAvailability,
  ]);

  const createMut = useMutation({
    mutationFn: async (payload: object) => {
      const idempotencyKey = (
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random()}`
      ).replace(/[^a-zA-Z0-9_-]/g, '');
      return apiClient.post<{ success: boolean; data: { id: number } }>(
        '/booking',
        payload,
        { headers: { 'Idempotency-Key': idempotencyKey } },
      );
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['clinic', 'booking'] });
      toast.success(`Booking #${res.data.id} berhasil dibuat`);
      onClose();
    },
    onError: (err: Error) => {
      if (err instanceof ApiError && err.status === 409) {
        const body = err.body as {
          conflictType?: string;
          conflictBookingId?: number;
        };
        toast.error(`Conflict: ${body?.conflictType ?? 'unknown'}`, {
          description: `Booking #${body?.conflictBookingId} bertabrakan. Pilih slot/psikolog/ruang lain, atau aktifkan "Buffer override".`,
        });
        return;
      }
      toast.error('Gagal create booking', { description: err.message });
    },
  });

  function next() {
    setS((p) => ({ ...p, step: Math.min(4, p.step + 1) as WizardStep }));
  }
  function prev() {
    setS((p) => ({ ...p, step: Math.max(1, p.step - 1) as WizardStep }));
  }

  function canNext(): boolean {
    if (s.step === 1) return s.clientId !== null;
    if (s.step === 2) return s.serviceId !== null;
    if (s.step === 3) return s.psikologUserId !== null;
    if (s.step === 4)
      return Boolean(s.date && s.slotIdx !== null && s.roomId !== null);
    return false;
  }

  function submit() {
    if (
      !s.clientId ||
      !s.serviceId ||
      !s.psikologUserId ||
      !s.roomId ||
      !selectedSlot
    )
      return;
    createMut.mutate({
      clientId: s.clientId,
      serviceId: s.serviceId,
      psikologUserId: s.psikologUserId,
      roomId: s.roomId,
      scheduledStart: buildIso(s.date, selectedSlot.start),
      scheduledEnd: buildIso(s.date, selectedSlot.end),
      sessionN: 1,
      sessionTotal: selectedService?.sessionCount ?? 1,
      bufferOverride: s.bufferOverride,
      notes: s.notes.trim() || undefined,
    });
  }

  return {
    state: s,
    setState: setS,
    clientList,
    serviceList,
    psikologList,
    psikologListFiltered,
    roomList,
    selectedService,
    selectedPsikolog,
    psikologClosedToday,
    slots,
    selectedSlot,
    isClosedDay,
    psikologDayBookings,
    availabilityQuery,
    resolvedAvailability,
    unavailableSlotIdx,
    submitting: createMut.isPending,
    next,
    prev,
    canNext,
    submit,
  };
}
