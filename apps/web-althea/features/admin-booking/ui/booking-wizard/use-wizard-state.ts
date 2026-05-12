'use client';

/**
 * Hook orchestrator untuk Booking Wizard:
 *   - 4 section: client → service → psikolog → schedule+room
 *   - Layanan dengan sessionCount > 1 → multi-sesi: tiap sesi punya date + slot
 *     picker sendiri. Submit ke /booking/package (atomic), bukan /booking.
 *   - Layanan single-session → tetap pakai DateStrip + slot grid existing,
 *     submit ke /booking.
 *   - Reset on dialog open.
 *   - Compute unavailableSlotIdx untuk single-session mode (sessions[0]); multi
 *     mode delegates per-row availability ke SessionRow.
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

export type WizardSession = {
  date: string; // YYYY-MM-DD (TZ klinik)
  slotIdx: number | null;
};

export type WizardState = {
  clientId: number | null;
  serviceId: number | null;
  psikologUserId: number | null;
  roomId: number | null;
  sessions: WizardSession[];
  intervalDays: number;
  bufferOverride: boolean;
  notes: string;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function tomorrowDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toDateKey(d);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

const INIT: WizardState = {
  clientId: null,
  serviceId: null,
  psikologUserId: null,
  roomId: null,
  sessions: [{ date: tomorrowDateStr(), slotIdx: null }],
  intervalDays: 7,
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
    if (open) setS({ ...INIT, sessions: [{ date: tomorrowDateStr(), slotIdx: null }] });
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

  const isMulti = (selectedService?.sessionCount ?? 1) > 1;

  // Saat service berubah → sinkronkan jumlah sesi dengan service.sessionCount.
  // Sesi 1 default H+1, sesi 2..N = sesi 1 + i * intervalDays. Reset semua slot.
  useEffect(() => {
    if (!selectedService) return;
    const count = Math.max(1, selectedService.sessionCount ?? 1);
    setS((prev) => {
      const base = prev.sessions[0]?.date ?? tomorrowDateStr();
      const nextSessions: WizardSession[] = Array.from(
        { length: count },
        (_, i) => ({
          date: i === 0 ? base : addDays(base, i * prev.intervalDays),
          slotIdx: null,
        }),
      );
      return { ...prev, sessions: nextSessions };
    });
  }, [selectedService]);

  function reapplyInterval() {
    setS((prev) => {
      if (prev.sessions.length <= 1) return prev;
      const base = prev.sessions[0].date;
      return {
        ...prev,
        sessions: prev.sessions.map((ses, i) => ({
          date: i === 0 ? base : addDays(base, i * prev.intervalDays),
          slotIdx: i === 0 ? ses.slotIdx : null,
        })),
      };
    });
  }

  function updateSession(i: number, partial: Partial<WizardSession>) {
    setS((prev) => ({
      ...prev,
      sessions: prev.sessions.map((ses, idx) => {
        if (idx !== i) return ses;
        const next = { ...ses, ...partial };
        if (partial.date && partial.date !== ses.date) next.slotIdx = null;
        return next;
      }),
    }));
  }

  const slots = settingsQuery.data?.data.slotsOfDay ?? [];
  const closedDays = settingsQuery.data?.data.closedDayOfWeek ?? [];
  const holidays = settingsQuery.data?.data.holidays ?? [];

  // Single-session helpers (sessions[0])
  const firstSession = s.sessions[0];
  const firstDate = firstSession?.date ?? '';
  const firstSlotIdx = firstSession?.slotIdx ?? null;
  const selectedSlot = firstSlotIdx !== null ? slots[firstSlotIdx] : null;
  const isClosedDay = closedDays.includes(
    new Date(`${firstDate}T00:00:00`).getDay(),
  );

  const psikologDayBookings = useBookingList({
    psikologUserId: s.psikologUserId ?? undefined,
    date: s.psikologUserId && firstDate ? firstDate : undefined,
    limit: 50,
    includeCancelled: false,
  });

  const selectedPsikolog = useMemo(
    () => psikologList.data?.data.find((p) => p.userId === s.psikologUserId),
    [psikologList.data, s.psikologUserId],
  );

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
    const taken = new Set<number>();
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

  const createSingleMut = useMutation({
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

  const createPackageMut = useMutation({
    mutationFn: async (payload: object) => {
      const idempotencyKey = (
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random()}`
      ).replace(/[^a-zA-Z0-9_-]/g, '');
      return apiClient.post<{
        success: boolean;
        data: { packageGroupId: string; sessionCount: number };
      }>('/booking/package', payload, {
        headers: { 'Idempotency-Key': idempotencyKey },
      });
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['clinic', 'booking'] });
      toast.success(`Paket ${res.data.sessionCount} sesi berhasil dibuat`);
      onClose();
    },
    onError: (err: Error) => {
      if (err instanceof ApiError && err.status === 409) {
        const body = err.body as { conflictType?: string; message?: string };
        toast.error(`Conflict: ${body?.conflictType ?? 'unknown'}`, {
          description:
            body?.message ??
            'Bentrok jadwal — adjust slot atau aktifkan buffer override',
        });
        return;
      }
      toast.error('Gagal create paket booking', { description: err.message });
    },
  });

  const submitting = createSingleMut.isPending || createPackageMut.isPending;

  const allSessionsFilled =
    s.sessions.length > 0 && s.sessions.every((ses) => ses.slotIdx !== null);

  const canSubmit =
    !!s.clientId &&
    !!s.serviceId &&
    !!s.psikologUserId &&
    !!s.roomId &&
    allSessionsFilled &&
    intraConflict.size === 0 &&
    !submitting;

  /**
   * Filtered list psikolog berdasarkan layanan terpilih.
   *   - serviceId belum dipilih → tampil semua
   *   - psikolog.serviceIds kosong → handle SEMUA layanan
   *   - psikolog.serviceIds includes serviceId → muncul
   */
  const psikologListFiltered = useMemo(() => {
    const all = psikologList.data?.data ?? [];
    if (!s.serviceId) return all;
    return all.filter((p) => {
      const ids = p.serviceIds ?? [];
      return ids.length === 0 || ids.includes(s.serviceId as number);
    });
  }, [psikologList.data, s.serviceId]);

  function submit() {
    if (!canSubmit || !selectedService) return;
    if (!isMulti) {
      const ses = s.sessions[0];
      if (ses.slotIdx === null) return;
      const slot = slots[ses.slotIdx];
      createSingleMut.mutate({
        clientId: s.clientId,
        serviceId: s.serviceId,
        psikologUserId: s.psikologUserId,
        roomId: s.roomId,
        scheduledStart: buildIso(ses.date, slot.start),
        scheduledEnd: buildIso(ses.date, slot.end),
        sessionN: 1,
        sessionTotal: 1,
        bufferOverride: s.bufferOverride,
        notes: s.notes.trim() || undefined,
      });
      return;
    }
    createPackageMut.mutate({
      clientId: s.clientId,
      serviceId: s.serviceId,
      psikologUserId: s.psikologUserId,
      roomId: s.roomId,
      sessions: s.sessions.map((ses) => {
        const slot = slots[ses.slotIdx as number];
        return {
          scheduledStart: buildIso(ses.date, slot.start),
          scheduledEnd: buildIso(ses.date, slot.end),
        };
      }),
      bufferOverride: s.bufferOverride,
      notes: s.notes.trim() || undefined,
    });
  }

  return {
    state: s,
    setState: setS,
    isMulti,
    updateSession,
    reapplyInterval,
    setIntervalDays: (n: number) =>
      setS((prev) => ({ ...prev, intervalDays: n })),
    clientList,
    serviceList,
    psikologList,
    psikologListFiltered,
    roomList,
    selectedService,
    selectedPsikolog,
    psikologClosedToday,
    slots,
    closedDayOfWeek: closedDays,
    holidays,
    selectedSlot,
    isClosedDay,
    psikologDayBookings,
    availabilityQuery,
    resolvedAvailability,
    unavailableSlotIdx,
    intraConflict,
    allSessionsFilled,
    canSubmit,
    submitting,
    submit,
  };
}
