import { apiClient } from '@/lib/api-client';

export type SlotDef = { start: string; end: string; label?: string };

export type ClinicSettings = {
  id: number;
  clinicName: string;
  address: string | null;
  timezone: string;
  currency: string;
  /** Slot operasional klinik (booking harus pas dengan salah satu). */
  slotsOfDay: SlotDef[];
  /** Hari tutup klinik (0=Minggu, 1=Senin, ..., 6=Sabtu). */
  closedDayOfWeek: number[];
  holidays: string[];
  bufferMinutes: number;
  taxEnabled: boolean;
  taxPercentage: string | number;
  dpPercentage: string | number;
  waSendEnabled: boolean;
  waCountryCode: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateSettingsInput = Partial<{
  clinicName: string;
  address: string;
  timezone: string;
  currency: string;
  slotsOfDay: SlotDef[];
  closedDayOfWeek: number[];
  holidays: string[];
  bufferMinutes: number;
  taxEnabled: boolean;
  taxPercentage: number;
  dpPercentage: number;
  waSendEnabled: boolean;
  waCountryCode: string;
}>;

export const settingsApi = {
  get: () => apiClient.get<{ success: boolean; data: ClinicSettings }>('/settings'),
  update: (input: UpdateSettingsInput) =>
    apiClient.patch<{ success: boolean; data: ClinicSettings }>('/settings', input),
};
