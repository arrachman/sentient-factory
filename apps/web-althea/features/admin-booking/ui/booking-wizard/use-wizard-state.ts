'use client';

/**
 * Orchestrator hook for the Booking Wizard.
 * Owns master state (s/setS), list queries, derived memos, and assembles
 * the full public API by delegating to useWizardSessions, useWizardAvailability,
 * and useWizardMutations.
 */
import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useClientList } from '@/features/admin-clients/hooks/use-client';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import { resolveServiceSlots } from '@/features/admin-layanan/model/slot';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import { buildIso, tomorrowDateStr } from './wizard-utils';
import { INIT, WizardState, WizardSession } from './wizard-types';
import { useWizardSessions } from './use-wizard-sessions';
import { useWizardAvailability } from './use-wizard-availability';
import { useWizardMutations } from './use-wizard-mutations';

export type { WizardSession, WizardState };

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

  // --- List queries ---
  const clientList = useClientList({ limit: 200 });
  const serviceList = useServiceList({ limit: 200, isActive: true });
  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const settingsQuery = useSettings();

  // --- Derived memos ---
  const selectedService = useMemo(
    () => serviceList.data?.data.find((sv) => sv.id === s.serviceId),
    [serviceList.data, s.serviceId],
  );

  const selectedPsikolog = useMemo(
    () => psikologList.data?.data.find((p) => p.userId === s.psikologUserId),
    [psikologList.data, s.psikologUserId],
  );

  /** Psikolog filtered by selected service (empty serviceIds = handles all). */
  const psikologListFiltered = useMemo(() => {
    const all = psikologList.data?.data ?? [];
    if (!s.serviceId) return all;
    return all.filter((p) => {
      const ids = p.serviceIds ?? [];
      return ids.length === 0 || ids.includes(s.serviceId as number);
    });
  }, [psikologList.data, s.serviceId]);

  const isMulti = (selectedService?.sessionCount ?? 1) > 1;

  // Slot resolution: service overrides may shift time ranges; indices stay global-aligned.
  const globalSlots = settingsQuery.data?.data.slotsOfDay ?? [];
  const slots = useMemo(
    () => resolveServiceSlots(globalSlots, selectedService?.slotOverrides),
    [globalSlots, selectedService],
  );
  const closedDays = settingsQuery.data?.data.closedDayOfWeek ?? [];
  const holidays = settingsQuery.data?.data.holidays ?? [];

  const firstDate = s.sessions[0]?.date ?? '';
  const isClosedDay = closedDays.includes(new Date(`${firstDate}T00:00:00`).getDay());

  // --- Sub-hooks ---
  const { reapplyInterval, updateSession } = useWizardSessions({ selectedService, s, setS });

  const {
    psikologDayBookings,
    availabilityQuery,
    resolvedAvailability,
    psikologClosedToday,
    unavailableSlotIdx,
    occupiedRoomIds,
    intraConflict,
    selectedSlot,
  } = useWizardAvailability({ s, slots, isMulti });

  const { createSingleMut, createPackageMut } = useWizardMutations({ onClose, qc });

  // --- Submit ---
  const submitting = createSingleMut.isPending || createPackageMut.isPending;
  const allSessionsFilled = s.sessions.length > 0 && s.sessions.every((ses) => ses.slotIdx !== null);
  const canSubmit =
    !!s.clientId && !!s.serviceId && !!s.psikologUserId && !!s.roomId &&
    allSessionsFilled && intraConflict.size === 0 && !submitting;

  function submit() {
    if (!canSubmit || !selectedService) return;
    if (!isMulti) {
      const ses = s.sessions[0];
      if (ses.slotIdx === null) return;
      const slot = slots[ses.slotIdx];
      createSingleMut.mutate({
        clientId: s.clientId, serviceId: s.serviceId,
        psikologUserId: s.psikologUserId, roomId: s.roomId,
        scheduledStart: buildIso(ses.date, slot.start),
        scheduledEnd: buildIso(ses.date, slot.end),
        sessionN: 1, sessionTotal: 1,
        notes: s.notes.trim() || undefined,
      });
      return;
    }
    createPackageMut.mutate({
      clientId: s.clientId, serviceId: s.serviceId,
      psikologUserId: s.psikologUserId, roomId: s.roomId,
      sessions: s.sessions.map((ses) => {
        const slot = slots[ses.slotIdx as number];
        return { scheduledStart: buildIso(ses.date, slot.start), scheduledEnd: buildIso(ses.date, slot.end) };
      }),
      notes: s.notes.trim() || undefined,
    });
  }

  return {
    state: s, setState: setS, isMulti,
    updateSession, reapplyInterval,
    setIntervalDays: (n: number) => setS((prev) => ({ ...prev, intervalDays: n })),
    clientList, serviceList, psikologList, psikologListFiltered,
    roomList, selectedService, selectedPsikolog,
    slots, closedDayOfWeek: closedDays, holidays, isClosedDay,
    selectedSlot, psikologDayBookings, availabilityQuery,
    resolvedAvailability, psikologClosedToday,
    unavailableSlotIdx, occupiedRoomIds, intraConflict,
    allSessionsFilled, canSubmit, submitting, submit,
  };
}
