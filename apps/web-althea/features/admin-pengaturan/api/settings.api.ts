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
  // Pengingat sesi otomatis
  notifConfirmKlien: boolean;
  notifConfirmPsikolog: boolean;
  notifH1Klien: boolean;
  notifH1SendTime: string;
  notifM30Klien: boolean;
  notifFollowupKlien: boolean;
  notifFollowupDelayHours: number;
  notifFeedbackKlien: boolean;
  notifFeedbackSendTime: string;
  notifSesiLanjutanKlien: boolean;
  notifSesiLanjutanDays: number;
  notifPaketHabisKlien: boolean;
  notifMingguKosongPsikolog: boolean;
  notifMingguKosongDaysBefore: number;
  notifMingguKosongThreshold: number;
  // Perubahan jadwal
  notifRescheduleKlien: boolean;
  notifReschedulePsikolog: boolean;
  notifCancelKlien: boolean;
  notifCancelPsikolog: boolean;
  notifUbahRuanganKlien: boolean;
  notifUbahRuanganPsikolog: boolean;
  notifUbahLayananKlien: boolean;
  notifUbahLayananPsikolog: boolean;
  // Onboarding & pembayaran
  notifWelcomeKlien: boolean;
  notifWelcomePsikolog: boolean;
  notifInviteStaff: boolean;
  notifOtpUser: boolean;
  notifDpKlien: boolean;
  notifBuktiPembayaranKlien: boolean;
  notifPelunasanKlien: boolean;
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
  // Pengingat sesi otomatis
  notifConfirmKlien: boolean;
  notifConfirmPsikolog: boolean;
  notifH1Klien: boolean;
  notifH1SendTime: string;
  notifM30Klien: boolean;
  notifFollowupKlien: boolean;
  notifFollowupDelayHours: number;
  notifFeedbackKlien: boolean;
  notifFeedbackSendTime: string;
  notifSesiLanjutanKlien: boolean;
  notifSesiLanjutanDays: number;
  notifPaketHabisKlien: boolean;
  notifMingguKosongPsikolog: boolean;
  notifMingguKosongDaysBefore: number;
  notifMingguKosongThreshold: number;
  // Perubahan jadwal
  notifRescheduleKlien: boolean;
  notifReschedulePsikolog: boolean;
  notifCancelKlien: boolean;
  notifCancelPsikolog: boolean;
  notifUbahRuanganKlien: boolean;
  notifUbahRuanganPsikolog: boolean;
  notifUbahLayananKlien: boolean;
  notifUbahLayananPsikolog: boolean;
  // Onboarding & pembayaran
  notifWelcomeKlien: boolean;
  notifWelcomePsikolog: boolean;
  notifInviteStaff: boolean;
  notifOtpUser: boolean;
  notifDpKlien: boolean;
  notifBuktiPembayaranKlien: boolean;
  notifPelunasanKlien: boolean;
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
