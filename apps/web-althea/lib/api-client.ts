/**
 * Thin fetch wrapper yang call api-gateway dengan namespace `/clinic/*`.
 *
 * Pattern:
 *   - Server component: pakai server-side fetch dengan cookie forwarded.
 *   - Client component: pakai browser fetch (cookie auto-included same-origin).
 *
 * Dipanggil dari `features/<name>/api/*.api.ts`. Jangan call `fetch` raw
 * di komponen — selalu via wrapper ini supaya error handling konsisten.
 *
 * NEXT_PUBLIC_API_URL harus include `/api` global prefix dari NestJS,
 * mis. `http://192.168.1.150:3203/api`.
 */

import { ENV } from '@/config/env';

const API_BASE = ENV.API_URL.replace(/\/$/, '');
const CLINIC_NAMESPACE = '/clinic';

export type ApiClientOptions = RequestInit & {
  /**
   * Skip auto-prefix `/clinic`. Default false.
   * Gunakan true kalau call endpoint yang bukan domain clinic (e.g. /auth/login).
   */
  skipNamespace?: boolean;
};

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { skipNamespace, headers, ...rest } = options;
  const finalPath = skipNamespace
    ? path
    : `${CLINIC_NAMESPACE}${path.startsWith('/') ? path : `/${path}`}`;
  const url = `${API_BASE}${finalPath}`;

  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    ...rest,
  });

  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json');
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (isJson && (body as { message?: string })?.message) ||
      `Request failed: ${response.status}`;
    throw new ApiError(response.status, message, body);
  }

  return body as T;
}

export const apiClient = {
  get: <T>(path: string, options?: ApiClientOptions) =>
    apiFetch<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, data?: unknown, options?: ApiClientOptions) =>
    apiFetch<T>(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  put: <T>(path: string, data?: unknown, options?: ApiClientOptions) =>
    apiFetch<T>(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  patch: <T>(path: string, data?: unknown, options?: ApiClientOptions) =>
    apiFetch<T>(path, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(path: string, options?: ApiClientOptions) =>
    apiFetch<T>(path, { ...options, method: 'DELETE' }),
};
