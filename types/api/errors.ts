export interface ApiError extends Error {
  request: Request;
  response: Response;
}
