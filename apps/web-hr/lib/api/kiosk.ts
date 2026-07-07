// HR Kiosk — shared-device clock + PIN management (/api/hr/kiosk/*)
import { apiGet, apiPost, apiPut, apiDelete } from './client';

export interface KioskRosterEntry {
  appUserId: string;
  employeeCode?: string | null;
  fullName: string;
  hasPin: boolean;
  faceEnrollmentStatus?: string;
}

export type KioskAction = 'in' | 'out';

export interface KioskClockPayload {
  action: KioskAction;
  worksiteId: number;
  appUserId: number;
  pin?: string;
  faceScore?: number;
}

export interface KioskClockResult {
  sessionId: number | null;
  action: KioskAction;
  method: string;
}

export async function listKioskRoster(): Promise<
  KioskRosterEntry[] | { data: KioskRosterEntry[] }
> {
  return apiGet('/hr/kiosk/roster');
}

export async function kioskClock(
  payload: KioskClockPayload,
): Promise<KioskClockResult | { data: KioskClockResult }> {
  return apiPost('/hr/kiosk/clock', payload);
}

export async function setKioskPin(appUserId: string, pin: string): Promise<void> {
  await apiPut<void>(`/hr/kiosk/pin/${appUserId}`, { pin });
}

export async function clearKioskPin(appUserId: string): Promise<void> {
  await apiDelete<void>(`/hr/kiosk/pin/${appUserId}`);
}
