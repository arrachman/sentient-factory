import type { DayAvailability, DayKey } from '@/features/admin-psikolog/model/types';

export type TabKey = 'weekly' | 'overrides';

export type AvailabilityDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Current weeklyAvailability dari psikolog (untuk pre-populate). */
  initial: Record<string, DayAvailability> | null;
};

export const DEFAULT_FALLBACK: Record<DayKey, DayAvailability> = {
  monday: { isOpen: true },
  tuesday: { isOpen: true },
  wednesday: { isOpen: true },
  thursday: { isOpen: true },
  friday: { isOpen: true },
  saturday: { isOpen: false },
  sunday: { isOpen: false },
};
