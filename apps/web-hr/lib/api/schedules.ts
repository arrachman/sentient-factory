// HR Schedules — Shifts & assignments (/api/hr/shifts, /api/hr/shift-assignments)
import { apiGet, apiPost, apiPatch, apiDelete } from './client';

export interface HrShift {
  id: string;
  code: string;
  name: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  breakMinutes: number;
  isActive: boolean;
}

export interface CreateShiftPayload {
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  breakMinutes?: number;
  isActive?: boolean;
}

export type UpdateShiftPayload = Partial<CreateShiftPayload>;

export interface HrShiftAssignment {
  id: string;
  userId: string;
  shiftId: string;
  workDate: string;
  shiftCode?: string;
  shiftName?: string;
  startTime?: string;
  endTime?: string;
  employeeCode?: string | null;
  fullName?: string | null;
  username?: string;
}

export interface ShiftAssignmentQuery {
  dateFrom?: string;
  dateTo?: string;
  userId?: number;
}

export interface CreateShiftAssignmentPayload {
  appUserId: number;
  shiftId: number;
  workDate: string;
}

export async function listShifts(): Promise<HrShift[] | { data: HrShift[] }> {
  return apiGet('/hr/shifts');
}

export async function createShift(payload: CreateShiftPayload): Promise<{ id: string }> {
  return apiPost('/hr/shifts', payload);
}

export async function updateShift(id: string, payload: UpdateShiftPayload): Promise<{ id: string }> {
  return apiPatch(`/hr/shifts/${id}`, payload);
}

export async function deleteShift(id: string): Promise<void> {
  await apiDelete<void>(`/hr/shifts/${id}`);
}

export async function listShiftAssignments(
  query?: ShiftAssignmentQuery,
): Promise<HrShiftAssignment[] | { data: HrShiftAssignment[] }> {
  return apiGet('/hr/shift-assignments', query as Record<string, string | number | undefined>);
}

export async function createShiftAssignment(
  payload: CreateShiftAssignmentPayload,
): Promise<{ id: string }> {
  return apiPost('/hr/shift-assignments', payload);
}

export async function deleteShiftAssignment(id: string): Promise<void> {
  await apiDelete<void>(`/hr/shift-assignments/${id}`);
}
