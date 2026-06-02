import { FonnteDevice } from './wa-device.types';

export type FonnteResponse = {
  ok: boolean;
  status: number;
  json: Record<string, unknown>;
};

/** POST form-urlencoded ke Fonnte API; ok = HTTP ok && json.status !== false. */
export async function fonntePost(
  apiUrl: string,
  path: string,
  authToken: string,
  body: Record<string, string>,
): Promise<FonnteResponse> {
  const form = new URLSearchParams();
  for (const [k, v] of Object.entries(body)) form.set(k, v);
  const res = await fetch(`${apiUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: authToken,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });
  let json: Record<string, unknown> = {};
  try {
    json = (await res.json()) as Record<string, unknown>;
  } catch {
    // ignore parse error, leave json empty
  }
  return { ok: res.ok && json.status !== false, status: res.status, json };
}

/** Ambil array `data` device dari payload Fonnte (toleran ke shape tak terduga). */
export function extractDeviceList(json: unknown): Array<Record<string, unknown>> {
  return Array.isArray((json as { data?: unknown }).data)
    ? (json as { data: Array<Record<string, unknown>> }).data
    : [];
}

/** Normalisasi satu raw device Fonnte ke FonnteDevice + tandai aktif. */
export function mapFonnteDevice(
  d: Record<string, unknown>,
  activeToken: string | null,
): FonnteDevice {
  const token = typeof d.token === 'string' ? d.token : undefined;
  const quotaRaw = d.quota;
  const quota =
    typeof quotaRaw === 'number'
      ? quotaRaw
      : typeof quotaRaw === 'string'
        ? Number.parseInt(quotaRaw, 10)
        : undefined;
  return {
    name: typeof d.name === 'string' ? d.name : undefined,
    device: typeof d.device === 'string' ? d.device : undefined,
    status: typeof d.status === 'string' ? d.status : undefined,
    token,
    quota: Number.isFinite(quota as number) ? (quota as number) : undefined,
    expired: typeof d.expired === 'string' ? d.expired : undefined,
    expiredDate: typeof d['expired-date'] === 'string' ? (d['expired-date'] as string) : undefined,
    package: typeof d.package === 'string' ? d.package : undefined,
    autoread: typeof d.autoread === 'string' ? d.autoread : undefined,
    isActive: !!activeToken && token === activeToken,
  };
}
