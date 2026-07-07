// OEE overlay (derived metric; A × P × Q computed from mes/qms). No tables;
// computed on-the-fly server-side.
import { qs, request } from './client';

export interface OeeRatios {
  availability: number | null;
  performance: number | null;
  quality: number | null;
  oee: number | null;
}

export interface OeeWorkCenterRow extends OeeRatios {
  workCenter: { id: string; code: string; name: string };
  plannedSeconds: number;
  downtimeSeconds: number;
  operatingSeconds: number;
  idealCycleSeconds: number | null;
  goodCount: number;
  scrapCount: number;
  totalCount: number;
  ncrCount: number;
  flags: { missingCalendar: boolean; missingIdealCycle: boolean };
}

export interface OeeSummary extends OeeRatios {
  workCenterCount: number;
  plannedSeconds: number;
  operatingSeconds: number;
  goodCount: number;
  totalCount: number;
  ncrCount: number;
}

export interface OeeReport {
  window: { from: string; to: string };
  summary: OeeSummary;
  workCenters: OeeWorkCenterRow[];
}

/** OEE = derived overlay (no tables); computed on-the-fly server-side. */
export function fetchOee(q: { from?: string; to?: string; workCenterId?: string } = {}) {
  return request<{ success: boolean; data: OeeReport }>(`/oee${qs(q)}`);
}
