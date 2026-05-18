// Senti ERP API client — public surface
// Re-exports from types, client, and auth modules

export type {
  ApiError,
  ApiResponse,
  PaginatedMeta,
  PaginatedResponse,
  PaginationParams,
} from './types';

export { ErpApiError, apiGet, apiPost, apiPatch, apiDelete } from './client';

export type { ErpAuthUser } from './auth';
export { login, logout, getMe } from './auth';
