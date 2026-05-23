import { apiClient } from '@/lib/api-client';
import type { CreateTemplateInput, ListResponse, Template, WaLog } from '../model/types';

type TemplateParams = { page?: number; limit?: number; category?: string; search?: string; isActive?: boolean };
type LogParams = { page?: number; limit?: number; status?: string; recipientPhone?: string; templateId?: number };
type WaStatsResponse = { success: boolean; data: { sentToday: number; readToday: number; failedToday: number; readRate: number } };

export type SchedulerType = 'h1' | 'm30' | 'feedback_h1';
export type TriggerSchedulerInput = {
  type: SchedulerType;
  testPhone?: string;
  windowCenterMinutes?: number;
  dryRun?: boolean;
};
export type TriggerSchedulerResult = {
  success: boolean;
  data: {
    type: string;
    dispatched: number;
    skipped: number;
    bookingIds: number[];
    testBookingId?: number;
    dryRun: boolean;
  };
};

function qs(p: Record<string, string | number | boolean | undefined>): string {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) if (v !== undefined && v !== '') u.set(k, String(v));
  const s = u.toString();
  return s ? `?${s}` : '';
}

export const waApi = {
  listTemplates: (p: TemplateParams = {}) => apiClient.get<ListResponse<Template>>(`/wa/template${qs(p)}`),
  createTemplate: (input: CreateTemplateInput) =>
    apiClient.post<{ success: boolean; data: Template }>(`/wa/template`, input),
  updateTemplate: (id: number, input: Partial<CreateTemplateInput>) =>
    apiClient.patch<{ success: boolean; data: Template }>(`/wa/template/${id}`, input),
  removeTemplate: (id: number) => apiClient.delete<{ success: boolean }>(`/wa/template/${id}`),
  listLogs: (p: LogParams = {}) => apiClient.get<ListResponse<WaLog>>(`/wa/log${qs(p)}`),
  getStats: (date?: string) => apiClient.get<WaStatsResponse>(`/wa/stats${date ? `?date=${date}` : ''}`),
  sendTest: (input: { phone: string; templateId?: number; body?: string; variables?: Record<string, string> }) =>
    apiClient.post<{ success: boolean; data: { logId: number; status: string; messageId: string } }>(`/wa/send-test`, input),
  triggerScheduler: (input: TriggerSchedulerInput) =>
    apiClient.post<TriggerSchedulerResult>(`/wa/scheduler/run`, input),
};
