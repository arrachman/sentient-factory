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

// ─── URL builder + file download (used by report exports) ─────────────────────

/**
 * Build an absolute API URL from a relative `path` (prepends BASE_URL) and an
 * optional query object. Mirrors the URL-building in the internal fetch helper.
 * Exported because BASE_URL itself stays private.
 */
export function buildApiUrl(
  path: string,
  query?: Record<string, string | number | undefined>,
): string {
  let url = `${BASE_URL}${path}`;
  if (query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url = `${url}?${qs}`;
  }
  return url;
}

/** Extract a filename from a Content-Disposition header, if present. */
function filenameFromDisposition(header: string | null): string | null {
  if (!header) return null;
  const star = /filename\*=(?:UTF-8'')?["']?([^"';]+)/i.exec(header);
  if (star?.[1]) return decodeURIComponent(star[1]);
  const plain = /filename=["']?([^"';]+)/i.exec(header);
  return plain?.[1] ?? null;
}

/**
 * Fetch a streamed file (with cookie auth) and trigger a browser download.
 * Uses the server-provided filename from Content-Disposition when present,
 * else `fallbackName`. Throws ErpApiError on non-ok responses.
 */
export async function downloadFile(
  path: string,
  query: Record<string, string | number | undefined> | undefined,
  fallbackName: string,
): Promise<void> {
  const url = buildApiUrl(path, query);
  const response = await fetch(url, { credentials: 'include' });

  if (!response.ok) {
    const fallbackMessage =
      response.statusText || `Unduhan gagal (HTTP ${response.status})`;
    let apiError: ApiError;
    try {
      const payload = (await response.json()) as {
        error?: ApiError;
        message?: string;
      };
      apiError = payload.error ?? {
        code: `HTTP_${response.status}`,
        message: payload.message ?? fallbackMessage,
      };
    } catch {
      apiError = { code: `HTTP_${response.status}`, message: fallbackMessage };
    }
    throw new ErpApiError(apiError);
  }

  const blob = await response.blob();
  const name =
    filenameFromDisposition(response.headers.get('content-disposition')) ??
    fallbackName;

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

/**
 * POST multipart/form-data (file upload). Content-Type is set by the browser
 * (with boundary) — never set it manually. Same error envelope as `request`.
 */
export async function apiUpload<T>(path: string, form: FormData): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    method: 'POST',
    credentials: 'include',
    body: form,
  });

  if (!response.ok) {
    const fallbackMessage =
      response.statusText || `Unggahan gagal (HTTP ${response.status})`;
    let apiError: ApiError;
    try {
      const payload = (await response.json()) as {
        error?: ApiError;
        message?: string;
      };
      apiError = payload.error ?? {
        code: `HTTP_${response.status}`,
        message: payload.message ?? fallbackMessage,
      };
    } catch {
      apiError = { code: `HTTP_${response.status}`, message: fallbackMessage };
    }
    throw new ErpApiError(apiError);
  }

  return response.json() as Promise<T>;
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>({ method: 'POST', path, body });
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>({ method: 'PATCH', path, body });
}

export function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return request<T>({ method: 'PUT', path, body });
}

export function apiDelete<T>(path: string, body?: unknown): Promise<T> {
  return request<T>({ method: 'DELETE', path, body });
}
