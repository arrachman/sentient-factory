// HR User Preferences — per-user appearance config (Setting → Tampilan).
// /api/hr/user-preferences/me — 1:1 port of ERP user-preferences, scoped to
// the HR platform auth (cookie `sf_token`, guard JwtAuthGuard). The UI tweaks
// (primary/density/fontScale/sidebar/sidebarMenu/urlRouting) ride in `metadata`
// JSON; theme/language are first-class columns.
import { apiGet, apiPut } from './client';
import type { ApiResponse } from './types';

/**
 * `metadata` holds the Setting → Tampilan UI tweaks (primary, density,
 * fontScale, sidebar, sidebarMenu, urlRouting). Kept as a plain record here so
 * `lib/api` does not depend on `components/` — the `use-appearance` hook casts
 * it to `Partial<Tweaks>`.
 */
export type HrUserPreferencesMetadata = Record<string, unknown>;

export interface HrUserPreferences {
  userId: string;
  theme: string | null;
  language: string | null;
  metadata: HrUserPreferencesMetadata | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateHrUserPreferencesInput {
  theme?: string;
  language?: string;
  metadata?: HrUserPreferencesMetadata;
}

/** GET /hr/user-preferences/me → null when the user has not saved anything yet. */
export async function getMyPreferences(): Promise<HrUserPreferences | null> {
  const res = await apiGet<ApiResponse<HrUserPreferences | null>>(
    '/hr/user-preferences/me',
  );
  return res.data ?? null;
}

/** PUT /hr/user-preferences/me → upsert current user's appearance config. */
export async function updateMyPreferences(
  input: UpdateHrUserPreferencesInput,
): Promise<HrUserPreferences> {
  const res = await apiPut<ApiResponse<HrUserPreferences>>(
    '/hr/user-preferences/me',
    input,
  );
  return res.data;
}
