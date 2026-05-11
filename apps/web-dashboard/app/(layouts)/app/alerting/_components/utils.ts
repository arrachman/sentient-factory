import { BellRing, CheckCircle2, Siren, TriangleAlert } from 'lucide-react';
import type { AlertSeverity, AlertStatus } from '../_lib/mock-data';

export function moduleLabelFromKey(moduleKey: string) {
  switch ((moduleKey || '').toLowerCase()) {
    case 'sales':
      return 'Sales';
    case 'finance':
      return 'Finance';
    case 'warehouse':
      return 'Warehouse';
    case 'purchasing':
      return 'Purchasing';
    default:
      return moduleKey || 'Unknown';
  }
}

export function normalizeTemplateChannel(
  channel: string | null | undefined,
): 'wa-group' | 'wa-personal' | 'email' | null {
  const value = String(channel || '').trim().toLowerCase();
  if (value === 'wa-group' || value === 'wa-personal' || value === 'email') {
    return value;
  }
  return null;
}

export function severityFromAnomalyLevel(level: string | null | undefined): AlertSeverity {
  switch ((level || '').toLowerCase()) {
    case 'critical':
      return 'critical';
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    default:
      return 'low';
  }
}

export function alertStatusFromInsightStatus(status: string | null | undefined): AlertStatus {
  switch ((status || '').toLowerCase()) {
    case 'reviewed':
      return 'acknowledged';
    case 'archived':
      return 'resolved';
    default:
      return 'open';
  }
}

export function formatDimensions(dimensions: Record<string, unknown>) {
  const entries = Object.entries(dimensions || {}).filter(
    ([, value]) => value !== null && value !== undefined && value !== '',
  );
  if (!entries.length) return 'Overall metric scope';
  return entries.map(([key, value]) => `${key}: ${String(value)}`).join(', ');
}

export function severityBadgeClass(severity: AlertSeverity) {
  switch (severity) {
    case 'critical':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'high':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'medium':
      return 'bg-sky-100 text-sky-700 border-sky-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function statusBadgeClass(status: string) {
  switch (status) {
    case 'open':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'acknowledged':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'resolved':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'muted':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'connected':
    case 'delivered':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'sent':
    case 'queued':
      return 'bg-sky-100 text-sky-700 border-sky-200';
    case 'failed':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'draft':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function summaryIcon(label: string) {
  switch (label) {
    case 'Active Alerts':
      return BellRing;
    case 'Critical Alerts':
      return Siren;
    case 'Notifications Sent':
      return CheckCircle2;
    default:
      return TriangleAlert;
  }
}
