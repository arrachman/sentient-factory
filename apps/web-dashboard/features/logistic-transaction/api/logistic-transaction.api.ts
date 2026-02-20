import { requestJson } from '@/shared/api/http';

export async function fetchOutboundList(query: URLSearchParams) {
  return requestJson<unknown>(`/api/outbound?${query.toString()}`);
}

export async function fetchOutboundById(uuid: string) {
  return requestJson<unknown>(`/api/outbound/${uuid}`);
}

export async function createOutbound(payload: unknown) {
  return requestJson<unknown>('/api/outbound', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateOutbound(uuid: string, payload: unknown) {
  return requestJson<unknown>(`/api/outbound/${uuid}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
