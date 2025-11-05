export type SockyOptions = {
  apiKey: string;
  baseUrl?: string;
  version?: string;
  timeoutMs?: number;
  retries?: number;
  retryBackoffMs?: number;
  fetch?: typeof globalThis.fetch;
  userAgent?: string;
  allowOverrideAuth?: boolean;
};

export type Page<T> = {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
};

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  next_cursor?: string;
  has_more?: boolean;
};

export type ErrorResponse = {
  success: false;
  error: string;
  code?: string;
};

export type ApiResponse<T> =
  | SuccessResponse<T>
  | PaginatedResponse<T>
  | ErrorResponse;
