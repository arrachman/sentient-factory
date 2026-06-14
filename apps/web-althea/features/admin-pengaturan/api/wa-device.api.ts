import { apiClient } from '@/lib/api-client';

export type WaDevice = {
  name?: string;
  device?: string;
  status?: string;
  token?: string;
  quota?: number;
  expired?: string;
  expiredDate?: string;
  package?: string;
  autoread?: string;
  isActive: boolean;
};

export type WaDeviceListResponse = {
  devices: WaDevice[];
  activeDeviceToken: string | null;
};

export type AddWaDeviceInput = {
  name: string;
  phone: string;
  autoread?: 'on' | 'off';
};

export type AddWaDeviceResponse = {
  deviceToken: string;
  devicePhone: string;
};

export type GetWaDeviceQrInput = {
  deviceToken: string;
};

export type GetWaDeviceQrResponse = {
  qrUrl?: string;
  alreadyConnected: boolean;
};

export type CheckWaDeviceResponse = {
  connected: boolean;
  devicePhone?: string;
  deviceName?: string;
};

export type ActivateWaDeviceInput = {
  deviceToken: string;
  devicePhone?: string;
  removePrevious?: boolean;
};

export type ActivateWaDeviceResponse = {
  success: true;
  data: { waActiveDeviceToken: string; waSenderNumber?: string };
};

export const waDeviceApi = {
  list: () => apiClient.get<WaDeviceListResponse>('/settings/wa-devices'),
  add: (input: AddWaDeviceInput) =>
    apiClient.post<AddWaDeviceResponse>('/settings/wa-devices', input),
  getQr: (input: GetWaDeviceQrInput) =>
    apiClient.post<GetWaDeviceQrResponse>('/settings/wa-devices/qr', input),
  check: (input: GetWaDeviceQrInput) =>
    apiClient.post<CheckWaDeviceResponse>('/settings/wa-devices/check', input),
  activate: (input: ActivateWaDeviceInput) =>
    apiClient.post<ActivateWaDeviceResponse>(
      '/settings/wa-devices/activate',
      input,
    ),
  remove: (devicePhone: string) =>
    apiClient.delete<{ success: true }>(
      `/settings/wa-devices/${encodeURIComponent(devicePhone)}`,
    ),
};
