// HTTP client for Senti ERP backend
// Base URL: NEXT_PUBLIC_ERP_API_URL env (required in production)
// Cookies (erp_token) are sent automatically via credentials: 'include'
// BigInt IDs are expected as strings (backend serialises BigInt → string)

import type { ApiError } from './types';

const BASE_URL =
  process.env.NEXT_PUBLIC_ERP_API_URL ?? 'https://erp.fr-labs.my.id/api/erp';

// ─── Error ────────────────────────────────────────────────────────────────────

export class ErpApiError extends Error {
  readonly code: string;
  readonly details?: unknown;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ErpApiError';
    this.code = error.code;
    this.details = error.details;
  }
}

// ─── Internal fetch helper ────────────────────────────────────────────────────

interface RequestOptions {
  method: string;
  path: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

async function request<T>(options: RequestOptions): Promise<T> {
  const { method, path, body, params } = options;

  let url = `${BASE_URL}${path}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url = `${url}?${qs}`;
  }

  const init: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(url, init);

  if (!response.ok) {
    const fallbackMessage =
      response.statusText || `Request gagal (HTTP ${response.status})`;
    let apiError: ApiError;

    try {
      const payload = (await response.json()) as {
        error?: ApiError;
        message?: string;
      };
      const fromPayload = payload.error ?? {
        code: `HTTP_${response.status}`,
        message: payload.message ?? fallbackMessage,
      };
      apiError = {
        ...fromPayload,
        message: fromPayload.message || fallbackMessage,
      };
    } catch {
      apiError = {
        code: `HTTP_${response.status}`,
        message: fallbackMessage,
      };
    }

    throw new ErpApiError(apiError);
  }

  // 204 No Content — return undefined cast as T
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ─── Public helpers ───────────────────────────────────────────────────────────

export function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  return request<T>({ method: 'GET', path, params });
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>({ method: 'POST', path, body });
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>({ method: 'PATCH', path, body });
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>({ method: 'DELETE', path });
}
