import { buildAuthHeader } from '@/shared/auth/token.client';
import type { ApiEnvelope } from '@/shared/types/api';

export const REQUEST_TIMEOUT_MS = 10000;

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function requestJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<ApiEnvelope<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const authHeader = buildAuthHeader();
    const response = await fetch(input, {
      cache: 'no-store',
      ...init,
      headers: {
        ...(authHeader ?? {}),
        ...(init?.headers ?? {}),
      },
      signal: controller.signal,
    });

    const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
    if (!payload) {
      throw new HttpError(response.status, 'Invalid response payload.');
    }

    if (!response.ok || !payload.success) {
      const message = payload.message || 'Request failed.';
      throw new HttpError(response.status, message);
    }

    return payload;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new HttpError(504, 'Request timeout.');
    }

    throw new HttpError(502, 'Failed to connect to API backend.');
  } finally {
    clearTimeout(timeout);
  }
}
