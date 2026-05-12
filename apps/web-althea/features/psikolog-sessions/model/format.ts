/**
 * Format & SOAP serialization helpers untuk Catatan Klinis.
 *
 * Backend cuma simpan freeform `noteText` string — kita serialize SOAP
 * jadi format `[S · Subjective]\nbody\n\n[O · Objective]\nbody\n\n…` lalu
 * parse balik saat load.
 */
import { SOAP_LABELS } from './constants';
import type { ServiceKind } from './types';

export function formatSessionTime(start: string): string {
  return new Date(start).toLocaleString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatSessionShort(start: string): string {
  return new Date(start).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

export function formatTimeOnly(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function toServiceKind(category: string): ServiceKind {
  const c = category.toLowerCase();
  if (c === 'anak' || c === 'kanak-kanak') return 'anak';
  if (c === 'pasangan' || c === 'keluarga') return 'pasangan';
  if (c === 'tes' || c === 'tes_psikologi') return 'tes';
  return 'dewasa';
}

export function serializeSOAP(
  soap: Record<string, string>,
  kind: ServiceKind,
): string {
  const labels = SOAP_LABELS[kind];
  return labels
    .map((l) => `[${l.label}]\n${(soap[l.key] ?? '').trim()}`)
    .filter((s) => s.split('\n').slice(1).join('').trim().length > 0)
    .join('\n\n');
}

export function parseSOAPFromNote(
  noteText: string,
  kind: ServiceKind,
): Record<string, string> {
  const result: Record<string, string> = {};
  const labels = SOAP_LABELS[kind];
  for (const l of labels) {
    const re = new RegExp(
      `\\[${l.label.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\]\\s*([\\s\\S]*?)(?=\\n\\n\\[|$)`,
    );
    const match = noteText.match(re);
    result[l.key] = match ? match[1].trim() : '';
  }
  return result;
}
