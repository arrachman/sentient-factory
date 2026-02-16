import { BaseEntity, DeviceStatus } from './common';

export interface Device extends BaseEntity {
  code: string;
  name: string;
  status: DeviceStatus;
  location?: string;
  metadata?: Record<string, unknown>;
}

export interface DeviceTelemetry {
  deviceId: string;
  timestamp: Date;
  values: Record<string, number | string | boolean | null>;
}
