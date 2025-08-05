export type SockyOptions = {
  apiKey: string;
  baseUrl?: string;
  version?: string;
};

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  next_cursor: string;
};

export type ErrorResponse = {
  success: false;
  error: string;
};

export type ApiResponse<T> =
  | SuccessResponse<T>
  | PaginatedResponse<T>
  | ErrorResponse;
