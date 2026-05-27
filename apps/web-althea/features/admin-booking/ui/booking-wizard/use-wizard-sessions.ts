'use client';

import { useCallback, useEffect } from 'react';
import { addDays, tomorrowDateStr } from './wizard-utils';
import type { WizardSession, WizardState } from './wizard-types';

interface UseWizardSessionsParams {
  selectedService: { sessionCount?: number | null } | undefined;
  s: WizardState;
  setS: React.Dispatch<React.SetStateAction<WizardState>>;
  /** Edit mode: skip auto-expand jadi N rows — kita selalu edit satu booking. */
  isEditMode?: boolean;
}

/**
 * Manages session-count sync and per-session updates.
 * - Syncs sessions array when selectedService changes.
 * - reapplyInterval: recalculates dates for sessions 2..N from base + intervalDays.
 * - updateSession: immutably patches one session; resets slotIdx on date change.
 */
export function useWizardSessions({
  selectedService,
  s,
  setS,
  isEditMode,
}: UseWizardSessionsParams) {
  // Saat service berubah → sinkronkan jumlah sesi dengan service.sessionCount.
  // Sesi 1 default H+1, sesi 2..N = sesi 1 + i * intervalDays. Reset semua slot.
  // Edit mode selalu single-session (edit 1 booking saja), bahkan kalau service
  // baru sessionCount>1 → admin perlu create paket baru kalau mau, bukan via edit.
  useEffect(() => {
    if (!selectedService) return;
    const count = isEditMode ? 1 : Math.max(1, selectedService.sessionCount ?? 1);
    setS((prev) => {
      const base = prev.sessions[0]?.date ?? tomorrowDateStr();
      const nextSessions: WizardSession[] = Array.from(
        { length: count },
        (_, i) => ({
          date: i === 0 ? base : addDays(base, i * prev.intervalDays),
          slotIdx: isEditMode && i === 0 ? (prev.sessions[0]?.slotIdx ?? null) : null,
        }),
      );
      return { ...prev, sessions: nextSessions };
    });
  }, [selectedService, setS, isEditMode]);

  const reapplyInterval = useCallback(() => {
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
  }, [setS]);

  const updateSession = useCallback(
    (i: number, partial: Partial<WizardSession>) => {
      setS((prev) => ({
        ...prev,
        sessions: prev.sessions.map((ses, idx) => {
          if (idx !== i) return ses;
          const next = { ...ses, ...partial };
          if (partial.date && partial.date !== ses.date) next.slotIdx = null;
          return next;
        }),
      }));
    },
    [setS],
  );

  return { reapplyInterval, updateSession };
}
