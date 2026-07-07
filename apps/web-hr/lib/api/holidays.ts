// HR Holidays / Kalender Libur — /api/hr/holidays/*
import { apiGet, apiPost, apiPatch, apiDelete } from './client';

export interface HrHoliday {
  id: string;
  holidayDate: string;
  name: string;
  isRecurring: boolean;
  region?: string | null;
  isActive: boolean;
}

export interface HolidayQuery {
  year?: number;
}

export interface CreateHolidayPayload {
  holidayDate: string;
  name: string;
  isRecurring?: boolean;
  region?: string;
  isActive?: boolean;
}

export type UpdateHolidayPayload = Partial<CreateHolidayPayload>;

export async function listHolidays(
  query?: HolidayQuery,
): Promise<{ data?: HrHoliday[] } | HrHoliday[]> {
  return apiGet('/hr/holidays', query as Record<string, string | number | undefined>);
}

export async function createHoliday(payload: CreateHolidayPayload): Promise<Record<string, unknown>> {
  return apiPost('/hr/holidays', payload);
}

export async function updateHoliday(
  id: string,
  payload: UpdateHolidayPayload,
): Promise<Record<string, unknown>> {
  return apiPatch(`/hr/holidays/${id}`, payload);
}

export async function deleteHoliday(id: string): Promise<Record<string, unknown>> {
  return apiDelete(`/hr/holidays/${id}`);
}
