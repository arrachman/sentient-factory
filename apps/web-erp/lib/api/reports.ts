// ERP Report Templates — CRUD + SQL executor
// Endpoints: /erp/reports

import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { PaginatedResponse, PaginationParams } from './types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RptTemplateRecord {
  id: string;
  code: string;
  name: string;
  module: string;
  description?: string | null;
  templateJson: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SqlQueryResult {
  rows: Record<string, unknown>[];
  count: number;
  columns: string[];
}

export interface ReportListParams extends PaginationParams {
  module?: string;
  isActive?: boolean;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export function listReportTemplates(params: ReportListParams = {}) {
  const q: Record<string, string> = {};
  if (params.page) q.page = String(params.page);
  if (params.limit) q.limit = String(params.limit);
  if (params.search) q.search = params.search;
  if (params.module) q.module = params.module;
  if (params.isActive !== undefined) q.isActive = String(params.isActive);
  if (params.sortBy) q.sortBy = params.sortBy;
  if (params.sortDir) q.sortDir = params.sortDir;
  return apiGet<PaginatedResponse<RptTemplateRecord>>('/reports', q);
}

export function getReportTemplate(id: string) {
  return apiGet<RptTemplateRecord>(`/reports/${id}`);
}

export function createReportTemplate(data: {
  code: string;
  name: string;
  module: string;
  description?: string;
  templateJson?: Record<string, unknown>;
}) {
  return apiPost<RptTemplateRecord>('/reports', data);
}

export function updateReportTemplate(
  id: string,
  data: Partial<{ name: string; module: string; description: string; templateJson: Record<string, unknown>; isActive: boolean }>,
) {
  return apiPatch<RptTemplateRecord>(`/reports/${id}`, data);
}

export function deleteReportTemplate(id: string) {
  return apiDelete<{ id: string }>(`/reports/${id}`);
}

export function executeSqlQuery(sql: string, params: Record<string, unknown> = {}, limit = 100) {
  return apiPost<SqlQueryResult>('/reports/execute-sql', { sql, params, limit });
}
