import { apiClient } from '@/lib/api-client';
import type { Psikolog } from '@/features/admin-psikolog/model/types';

export type WeeklyAvailability = Record<
  string,
  { isOpen: boolean; slotIndices?: number[] }
>;

export type UpdateProfileInput = {
  fullName?: string;
  title?: string;
  bio?: string;
  color?: string;
  /**
   * Base64 data URL (data:image/...;base64,...) atau URL absolut.
   * `null` untuk hapus avatar (fallback ke colored initial).
   * `undefined` = tidak ubah.
   */
  avatarUrl?: string | null;
};

export type ProfileStats = {
  sesi30Hari: number;
  klienAktif: number;
  /** Persentase kehadiran (completed / total). Null kalau belum ada data 30d. */
  kehadiran: number | null;
  /** Belum ada endpoint rating — selalu null untuk sekarang. */
  ratingKlien: number | null;
};

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

  /** Self-edit safe profile fields (fullName, title, bio, color) */
  updateMe: (input: UpdateProfileInput) =>
    apiClient.patch<{ success: boolean; data: Psikolog }>(`/psikolog/me`, input),

  /** Get 30-day stats (sesi/klien/kehadiran/rating) */
  getStats: () =>
    apiClient.get<{ success: boolean; data: ProfileStats }>(`/psikolog/me/stats`),
};
