// HTTP client for Senti HR.
//
// Transport (fetch wrapper, error envelope, upload/download) lives in the shared
// @sentient-factory/ui-kit (Tier 1) via `createApiClient`. This file only binds
// the HR base URL and re-exports the verbs, so every `@/lib/api/client` import
// stays stable.
//
// Base URL strategy (FRONTEND-DESIGN-SYSTEM §4.2): SAME-ORIGIN.
//   - Browser calls `/api/*` which next.config.mjs rewrites → shared api-gateway.
//   - Auth resources hit `/api/auth/*`; HR resources hit `/api/hr/*`.
//   - Auth cookie is the platform `sf_token` (sent via credentials: 'include').
//   - BigInt IDs arrive as strings.
// Override with NEXT_PUBLIC_HR_API_URL (e.g. an absolute gateway URL) if ever
// deployed on its own origin.

import { createApiClient, SentiApiError } from '@sentient-factory/ui-kit';

const BASE_URL = process.env.NEXT_PUBLIC_HR_API_URL ?? '/api';

const client = createApiClient({ baseUrl: BASE_URL });

/** HR-named alias of the shared error class (identical shape + behaviour). */
export const HrApiError = SentiApiError;

export const {
  apiGet,
  apiPost,
  apiPatch,
  apiPut,
  apiDelete,
  apiUpload,
  downloadFile,
  buildApiUrl,
} = client;
