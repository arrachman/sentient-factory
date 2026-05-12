/**
 * Helper fetch dengan cache:'no-store' yang return-nya null kalau response gagal,
 * konsisten dipakai di seluruh HR page-view.
 */
import type { ApiEnvelope } from './types';

export async function fetchJson<T>(
  url: string,
): Promise<ApiEnvelope<T> | null> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) return null;
  return (await response.json()) as ApiEnvelope<T>;
}

export async function putJson<T>(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => null)) as
    | (ApiEnvelope<T> & { message?: string; error?: string })
    | null;
  if (!response.ok) {
    throw new Error(payload?.message ?? payload?.error ?? 'Request failed.');
  }
  return payload;
}

export async function postJson<T>(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => null)) as
    | (ApiEnvelope<T> & { message?: string; error?: string })
    | null;
  if (!response.ok) {
    throw new Error(payload?.message ?? payload?.error ?? 'Request failed.');
  }
  return payload;
}
