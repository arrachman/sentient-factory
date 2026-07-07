// Current-user preferences client — backed by ERP `adm_user_preferences`.
// MDP reuses ERP identity (cookie `erp_token`) and the `/api/erp/*` proxy, so
// appearance settings persist server-side and roam cross-device, shared with
// the user's ERP account. Endpoints: GET/PUT /api/erp/user-preferences/me.

const ERP_BASE = '/api/erp';

export class ErpApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ErpApiError';
    this.status = status;
  }
}

export interface ErpUserPreferences {
  userId: string;
  theme: string | null;
  language: string | null;
  timezone: string | null;
  dateFormat: string | null;
  numberFormat: string | null;
  tablePageSize: number | null;
  sidebarCollapsed: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserPreferencesInput {
  theme?: string;
  language?: string;
  metadata?: Record<string, unknown>;
}

interface ApiEnvelope<T> {
  data: T;
}

async function erpRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${ERP_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = body?.message ?? body?.error?.message ?? `Request failed (${res.status})`;
    throw new ErpApiError(Array.isArray(msg) ? msg.join(', ') : String(msg), res.status);
  }
  return body as T;
}

export async function getMyPreferences(): Promise<ErpUserPreferences | null> {
  const res = await erpRequest<ApiEnvelope<ErpUserPreferences | null>>(
    '/user-preferences/me',
  );
  return res.data ?? null;
}

export async function updateMyPreferences(
  input: UpdateUserPreferencesInput,
): Promise<ErpUserPreferences> {
  const res = await erpRequest<ApiEnvelope<ErpUserPreferences>>(
    '/user-preferences/me',
    { method: 'PUT', body: JSON.stringify(input) },
  );
  return res.data;
}
