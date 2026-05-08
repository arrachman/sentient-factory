import { apiClient } from '@/lib/api-client';

export type DayHours = { open: string | null; close: string | null; isOpen: boolean };

export type ClinicSettings = {
  id: number;
  clinicName: string;
  address: string | null;
  timezone: string;
  currency: string;
  operatingHours: Record<string, DayHours>;
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
  operatingHours: Record<string, DayHours>;
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
