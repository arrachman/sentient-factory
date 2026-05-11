import { apiClient } from '@/lib/api-client';
import type { Psikolog } from '@/features/admin-psikolog/model/types';

export type WeeklyAvailability = Record<
  string,
  { isOpen: boolean; slotIndices?: number[] }
>;

export const psikologProfileApi = {
  /** Get own profile (lookup by JWT userId server-side) */
  getMe: () =>
    apiClient.get<{ success: boolean; data: Psikolog }>(`/psikolog/me`),

  /** Update own weekly availability (which days × slots are open) */
  updateAvailability: (weeklyAvailability: WeeklyAvailability) =>
    apiClient.patch<{
      success: boolean;
      data: Psikolog;
      message: string;
    }>(`/psikolog/me/availability`, { weeklyAvailability }),
};
