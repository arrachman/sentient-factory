export const SETTINGS_ID = 1; // Single-row config table

export type WaDeviceStatus = {
  connected: boolean;
  deviceName?: string;
  devicePhone?: string;
  quota?: number;
  expired?: string;
  raw?: unknown;
};

export type FonnteDevice = {
  name?: string;
  device?: string;
  status?: string;
  token?: string;
  quota?: number | string;
  expired?: string;
  expiredDate?: string;
  package?: string;
  autoread?: string;
  isActive: boolean;
};

export type WaDeviceListResponse = {
  devices: FonnteDevice[];
  activeDeviceToken: string | null;
  raw?: unknown;
};
