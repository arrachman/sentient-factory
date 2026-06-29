/**
 * Shared formatting helpers for HR report rendering (view parity + exports).
 * Numeric types stay numeric in XLSX (Excel keeps them sortable); CSV and the
 * column-width pass use the display string.
 */
import { HrReportColType, HrReportColumn, HrReportSummaryItem } from './report-types';

const NUMERIC_TYPES: ReadonlySet<HrReportColType> = new Set(['number', 'hours', 'days']);

export function isNumericType(type: HrReportColType): boolean {
  return NUMERIC_TYPES.has(type);
}

export function alignFor(col: Pick<HrReportColumn, 'type'>): 'left' | 'right' {
  return isNumericType(col.type) ? 'right' : 'left';
}

export function rawNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function formatCellValue(value: unknown, type: HrReportColType): string {
  if (value === null || value === undefined) return '';
  if (isNumericType(type)) {
    const n = rawNumber(value);
    if (n === null) return String(value);
    const digits = type === 'number' ? 0 : 2;
    return n.toLocaleString('id-ID', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  }
  return String(value);
}

export function formatSummaryValue(item: HrReportSummaryItem): string {
  if (item.type) return formatCellValue(item.value, item.type);
  return String(item.value);
}

/** exceljs numFmt per numeric type (null = no special format). */
export function excelNumFmt(type: HrReportColType): string | null {
  if (type === 'number') return '#,##0';
  if (type === 'hours' || type === 'days') return '#,##0.00';
  return null;
}

export function formatGeneratedAt(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

export function buildFilename(key: string, generatedAt: string, ext: string): string {
  const stamp = generatedAt.slice(0, 10).replace(/-/g, '');
  return `hr-${key}-${stamp}.${ext}`;
}
