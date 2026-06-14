import { useEffect, useMemo, useState } from 'react';
import {
  DAY_KEYS,
  type DayAvailability,
  type DayKey,
} from '@/features/admin-psikolog/model/types';
import { DEFAULT_FALLBACK } from './availability-dialog.types';

type Slot = { start: string; end?: string; label?: string };

type UseAvailabilityDraftParams = {
  open: boolean;
  initial: Record<string, DayAvailability> | null;
  slots: Slot[];
};

type UseAvailabilityDraftReturn = {
  draft: Record<DayKey, DayAvailability>;
  toggleSlot: (day: DayKey, slotIdx: number) => void;
  toggleDayClosed: (day: DayKey) => void;
  isSlotChecked: (day: DayKey, slotIdx: number) => boolean;
  totalActiveSlots: number;
};

export function useAvailabilityDraft({
  open,
  initial,
  slots,
}: UseAvailabilityDraftParams): UseAvailabilityDraftReturn {
  const [draft, setDraft] = useState<Record<DayKey, DayAvailability>>(DEFAULT_FALLBACK);

  // Hydrate draft saat dialog dibuka / initial berubah
  useEffect(() => {
    if (!open) return;
    if (initial && Object.keys(initial).length > 0) {
      // Pastikan semua DAY_KEYS ada (kalau kosong, fallback to {isOpen: false})
      const filled: Record<DayKey, DayAvailability> = {} as Record<DayKey, DayAvailability>;
      for (const day of DAY_KEYS) {
        filled[day] = (initial[day] as DayAvailability) ?? { isOpen: false };
      }
      setDraft(filled);
    } else {
      setDraft(DEFAULT_FALLBACK);
    }
  }, [open, initial]);

  const totalActiveSlots = useMemo(() => {
    let n = 0;
    for (const day of DAY_KEYS) {
      const cfg = draft[day];
      if (!cfg.isOpen) continue;
      // isOpen + slotIndices undefined = semua slot
      n += Array.isArray(cfg.slotIndices) ? cfg.slotIndices.length : slots.length;
    }
    return n;
  }, [draft, slots.length]);

  function toggleSlot(day: DayKey, slotIdx: number) {
    setDraft((prev) => {
      const cfg = prev[day];
      const current: number[] = Array.isArray(cfg.slotIndices)
        ? cfg.slotIndices
        : cfg.isOpen
          ? slots.map((_, i) => i) // implicit all → make explicit before edit
          : [];
      const next = current.includes(slotIdx)
        ? current.filter((i) => i !== slotIdx)
        : [...current, slotIdx].sort((a, b) => a - b);
      return {
        ...prev,
        [day]: {
          isOpen: next.length > 0,
          slotIndices: next.length === slots.length ? undefined : next,
        },
      };
    });
  }

  function toggleDayClosed(day: DayKey) {
    setDraft((prev) => {
      const isClosed = !prev[day].isOpen;
      return {
        ...prev,
        [day]: isClosed
          ? { isOpen: true } // open all default
          : { isOpen: false },
      };
    });
  }

  function isSlotChecked(day: DayKey, slotIdx: number): boolean {
    const cfg = draft[day];
    if (!cfg.isOpen) return false;
    if (!Array.isArray(cfg.slotIndices)) return true; // all open
    return cfg.slotIndices.includes(slotIdx);
  }

  return { draft, toggleSlot, toggleDayClosed, isSlotChecked, totalActiveSlots };
}
