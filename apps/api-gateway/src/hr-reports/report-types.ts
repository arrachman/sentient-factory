/**
 * Uniform HR report contract. Every report — attendance recap, project hours,
 * leave recap — resolves to the SAME `HrReportDataset` shape so the on-screen
 * table, the CSV/XLSX exporters, and the frontend all consume one structure.
 * Reports are derived aggregations over existing hr_* tables (no new tables).
 */

/** Semantic cell type → drives alignment + number formatting in view & export. */
export type HrReportColType = 'text' | 'number' | 'hours' | 'days' | 'status';

export interface HrReportColumn {
  key: string;
  header: string;
  type: HrReportColType;
}

/** One aggregate shown in the report summary bar. */
export interface HrReportSummaryItem {
  label: string;
  value: string | number;
  type?: HrReportColType;
}

/** Query inputs common to all reports (each report uses the subset it needs). */
export interface HrReportFilters {
  dateFrom?: string;
  dateTo?: string;
  userId?: number;
  projectId?: number;
}

/** The resolved dataset — fed identically to the table view and the exporters. */
export interface HrReportDataset {
  key: string;
  title: string;
  columns: HrReportColumn[];
  rows: Record<string, unknown>[];
  summary: HrReportSummaryItem[];
  filters: HrReportFilters;
  generatedAt: string;
}

/** A single report definition contributed by the service. */
export interface HrReportDef {
  key: string;
  title: string;
  description: string;
  columns: HrReportColumn[];
  resolve: (filters: HrReportFilters) => Promise<{
    rows: Record<string, unknown>[];
    summary?: HrReportSummaryItem[];
  }>;
}

/** Lightweight catalog entry returned by GET /hr/reports. */
export interface HrReportCatalogItem {
  key: string;
  title: string;
  description: string;
  columns: HrReportColumn[];
}

export type HrReportFormat = 'csv' | 'xlsx';
