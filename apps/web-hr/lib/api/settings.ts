// HR Settings — /api/hr/settings
import { apiGet, apiPatch } from './client';

export interface HrSetting {
  key: string;
  value: unknown;
  label?: string;
  description?: string;
  group?: string;
}

/** Backend may return an array of settings or a flat key→value object. */
export async function getSettings(): Promise<HrSetting[] | Record<string, unknown> | { data: unknown }> {
  return apiGet('/hr/settings');
}

export async function updateSetting(settingKey: string, value: unknown): Promise<Record<string, unknown>> {
  return apiPatch(`/hr/settings/${settingKey}`, { value });
}

/** Normalize whatever the backend returns into a flat HrSetting[] for rendering. */
export function normalizeSettings(payload: unknown): HrSetting[] {
  if (!payload) return [];
  const raw = (payload as { data?: unknown }).data ?? payload;
  if (Array.isArray(raw)) {
    return raw.map((s) => {
      const o = s as Record<string, unknown>;
      return {
        key: String(o.key ?? o.settingKey ?? o.name ?? ''),
        value: o.value,
        label: o.label as string | undefined,
        description: o.description as string | undefined,
        group: o.group as string | undefined,
      };
    });
  }
  if (typeof raw === 'object') {
    return Object.entries(raw as Record<string, unknown>).map(([key, value]) => ({ key, value }));
  }
  return [];
}
