// HR Policy — overtime & break rules — /api/hr/policy/*
import { apiGet, apiPut } from './client';

export interface OvertimePolicy {
  overtimeEnabled: boolean;
  dailyRegularHours: number;
  weeklyRegularHours: number;
  overtimeMultiplier: number;
  breakMinutes: number;
  breakPaid: boolean;
  countHolidayAsOvertime: boolean;
}

export type UpdateOvertimePolicyPayload = Partial<OvertimePolicy>;

export async function getOvertimePolicy(): Promise<{ data: OvertimePolicy } | OvertimePolicy> {
  return apiGet('/hr/policy/overtime');
}

export async function updateOvertimePolicy(
  payload: UpdateOvertimePolicyPayload,
): Promise<{ data: OvertimePolicy } | OvertimePolicy> {
  return apiPut('/hr/policy/overtime', payload);
}
