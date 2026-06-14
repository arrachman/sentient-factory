// Base response and pagination types for Senti ERP API

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginatedMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  /**
   * Optional active-state filter — supported by most ERP list endpoints
   * (branches, locations, partners, items, …). Backend uses
   * `forbidNonWhitelisted: true`, so resources without an `isActive` column
   * (e.g. item-informations) must strip this in their lib wrapper before
   * forwarding to the API, otherwise NestJS responds 400.
   */
  isActive?: boolean;
}
