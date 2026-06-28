// HR Leave / Cuti — /api/hr/leave/*
import { apiGet, apiPost } from './client';

export interface LeaveType {
  id: string;
  code: string;
  name: string;
  isPaid: boolean;
  defaultQuotaDays?: number | null;
  isActive: boolean;
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type LeaveAction = 'approve' | 'reject' | 'cancel';

export interface LeaveRequest {
  id: string;
  leaveTypeId: string;
  leaveTypeCode?: string;
  leaveTypeName?: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string | null;
  status: LeaveStatus;
  reviewNote?: string | null;
  reviewedAt?: string | null;
  employeeCode?: string | null;
  fullName?: string | null;
  username?: string;
}

export interface LeaveRequestQuery {
  page?: number;
  limit?: number;
  status?: LeaveStatus;
  userId?: number;
  search?: string;
}

export interface LeaveRequestPayload {
  data?: LeaveRequest[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export interface CreateLeaveRequestPayload {
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  reason?: string;
}

export async function listLeaveTypes(): Promise<{ data?: LeaveType[] } | LeaveType[]> {
  return apiGet('/hr/leave/types');
}

export async function listLeaveRequests(query?: LeaveRequestQuery): Promise<LeaveRequestPayload> {
  return apiGet<LeaveRequestPayload>(
    '/hr/leave/requests',
    query as Record<string, string | number | undefined>,
  );
}

export async function createLeaveRequest(
  payload: CreateLeaveRequestPayload,
): Promise<Record<string, unknown>> {
  return apiPost('/hr/leave/requests', payload);
}

export async function applyLeaveAction(
  id: string,
  action: LeaveAction,
  note?: string,
): Promise<Record<string, unknown>> {
  return apiPost(`/hr/leave/requests/${id}/${action}`, { note });
}
