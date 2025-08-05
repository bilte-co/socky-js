import type { RouteInfoResponse } from "socky/types";

export function apiRoutes(request: typeof fetch) {
  return {
    async get(from: string, to: string): Promise<RouteInfoResponse> {
      const res = await request(`/routes/${from}/${to}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch route info: ${res.statusText}`);
      }
      return res.json();
    },
  };
}
