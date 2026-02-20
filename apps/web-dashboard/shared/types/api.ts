export type ApiSuccess<T> = {
  success: true;
  message?: string;
  data: T;
  meta?: {
    page?: number;
    totalPages?: number;
    total?: number;
    limit?: number;
  };
};

export type ApiFailure = {
  success: false;
  message: string;
  errors?: unknown;
};

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;
