import { apiClient } from '@/lib/api-client';

export type SlotDef = { start: string; end: string; label?: string };

export type ClinicSettings = {
  id: number;
  clinicName: string;
  address: string | null;
  timezone: string;
  currency: string;
  slotsOfDay: SlotDef[];
  closedDayOfWeek: number[];
  holidays: string[];
  taxEnabled: boolean;
  taxPercentage: string | number;
  dpPercentage: string | number;
  // WA master
  waSendEnabled: boolean;
  waCountryCode: string;
  waSenderNumber: string;
  // WA delivery & retry
  waRetryCount: number;
  waRetryDelayMinutes: number;
  waSendWindowStart: string;
  waSendWindowEnd: string;
  notifFailedSendEmail: boolean;
  // Email
  emailInvoiceAfterPayment: boolean;
  emailWeeklyRecap: boolean;
  emailMonthlyPsikolog: boolean;
  // Notifikasi — timing/delay. Recipient routing (klien/psikolog) di-pegang
  // oleh ClinicWaTemplate.recipients, akses lewat /clinic/wa/template.
  notifH1SendTime: string;
  notifFollowupDelayHours: number;
  notifFeedbackSendTime: string;
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
  taxEnabled: boolean;
  taxPercentage: number;
  dpPercentage: number;
  // WA master
  waSendEnabled?: boolean;
  waCountryCode?: string;
  waSenderNumber?: string;
  // WA delivery & retry
  waRetryCount: number;
  waRetryDelayMinutes: number;
  waSendWindowStart: string;
  waSendWindowEnd: string;
  notifFailedSendEmail: boolean;
  // Email
  emailInvoiceAfterPayment: boolean;
  emailWeeklyRecap: boolean;
  emailMonthlyPsikolog: boolean;
  // Notifikasi — timing/delay
  notifH1SendTime: string;
  notifFollowupDelayHours: number;
  notifFeedbackSendTime: string;
}>;

export type WaDeviceStatus = {
  connected: boolean;
  deviceName?: string;
  devicePhone?: string;
  quota?: number;
  expired?: string;
};

export const settingsApi = {
  get: () => apiClient.get<{ success: boolean; data: ClinicSettings }>('/settings'),
  update: (input: UpdateSettingsInput) =>
    apiClient.patch<{ success: boolean; data: ClinicSettings }>('/settings', input),
  getWaStatus: () => apiClient.get<WaDeviceStatus>('/settings/wa-status'),
};
