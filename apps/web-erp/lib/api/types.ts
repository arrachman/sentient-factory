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
   * (branches, locations, partners, items, …). Endpoints that don't expose
   * `isActive` simply ignore unknown query params.
   */
  isActive?: boolean;
}
