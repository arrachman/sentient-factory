// HR Reports & Export — /api/hr/reports/*
import { apiGet, downloadFile } from './client';

export type HrReportColType = 'text' | 'number' | 'hours' | 'days' | 'status';

export interface HrReportColumn {
  key: string;
  header: string;
  type: HrReportColType;
}

export interface HrReportSummaryItem {
  label: string;
  value: string | number;
  type?: HrReportColType;
}

export interface HrReportCatalogItem {
  key: string;
  title: string;
  description: string;
  columns: HrReportColumn[];
}

export interface HrReportDataset {
  key: string;
  title: string;
  columns: HrReportColumn[];
  rows: Record<string, unknown>[];
  summary: HrReportSummaryItem[];
  generatedAt: string;
}

export interface HrReportFilters {
  dateFrom?: string;
  dateTo?: string;
  userId?: number;
  projectId?: number;
}

export type HrReportFormat = 'csv' | 'xlsx';

export async function listReportCatalog(): Promise<
  HrReportCatalogItem[] | { data: HrReportCatalogItem[] }
> {
  return apiGet('/hr/reports');
}

export async function getReport(
  key: string,
  filters?: HrReportFilters,
): Promise<HrReportDataset | { data: HrReportDataset }> {
  return apiGet(`/hr/reports/${key}`, filters as Record<string, string | number | undefined>);
}

export async function downloadReport(
  key: string,
  format: HrReportFormat,
  filters?: HrReportFilters,
): Promise<void> {
  await downloadFile(
    `/hr/reports/${key}/export`,
    { ...(filters ?? {}), format } as Record<string, string | number | undefined>,
    `hr-${key}.${format}`,
  );
}
