/**
 * Export AuditEvent[] ke CSV file lewat browser blob download.
 * Header & kolom selaras dengan timeline UI (id/time/date/category/severity/
 * action/target/actor/role/ip/device).
 */
import type { AuditEvent } from './types';

const HEADER = [
  'id',
  'time',
  'date',
  'category',
  'severity',
  'action',
  'target',
  'actor',
  'role',
  'ip',
  'device',
];

function escapeCell(value: unknown): string {
  const s = String(value ?? '');
  return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function exportAuditCsv(events: AuditEvent[]) {
  const rows = events.map((e) => [
    e.id,
    e.time,
    e.date,
    e.category,
    e.severity,
    e.actionLabel,
    e.target,
    e.actor,
    e.actorRole,
    e.ip,
    e.device,
  ]);
  const csv = [HEADER, ...rows].map((r) => r.map(escapeCell).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
