import { paginate } from "@lib/paginate";

import type {
  PaginatedResponse,
  Station,
  StationInfoResponse,
  StationListResponse,
  StationNearReq,
} from "socky/types";

export function apiStations(request: typeof fetch) {
  return {
    async get(code: string): Promise<StationInfoResponse> {
      const res = await request(`/stations/${code}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch station info: ${res.statusText}`);
      }
      return res.json();
    },

    async list(
      cursor?: string,
      limit?: number,
    ): Promise<PaginatedResponse<Station>> {
      const basePath = "/stations";
      const params = new URLSearchParams();

      if (cursor) params.set("cursor", cursor);
      if (limit) params.set("limit", limit.toString());

      const url = `${basePath}?${params.toString()}`;

      const res = await request(url);
      if (!res.ok) throw new Error(`Failed to list stations`);

      return res.json();
    },

    async search(query: string): Promise<StationListResponse> {
      const basePath = "/stations/search";
      const params = new URLSearchParams();

      if (query) params.set("q", query);

      const url = `${basePath}?${params.toString()}`;

      const res = await request(url);
      if (!res.ok) throw new Error(`Failed to search stations`);

      return res.json();
    },

    async proximity(query: StationNearReq): Promise<StationListResponse> {
      const basePath = "/stations/proximity";
      const params = new URLSearchParams();

      if (query.latitude) params.set("lat", query.latitude.toString());
      if (query.longitude) params.set("lng", query.longitude.toString());
      if (query.distance) params.set("distance", query.distance.toString());
      if (query.unit) params.set("unit", query.unit);

      const url = `${basePath}?${params.toString()}`;

      const res = await request(url);
      if (!res.ok) throw new Error(`Failed to search nearby stations`);

      return res.json();
    },

    async near(
      code: string,
      query: StationNearReq,
    ): Promise<StationListResponse> {
      const basePath = `/stations/${code}/near`;
      const params = new URLSearchParams();

      if (query.distance) params.set("distance", query.distance.toString());
      if (query.unit) params.set("unit", query.unit);

      const url = `${basePath}?${params.toString()}`;
      const res = await request(url);
      if (!res.ok) throw new Error(`Failed to search stations`);

      return res.json();
    },

    paginate: (request: typeof fetch) =>
      paginate<Station>(
        (cursor?: string | undefined, limit?: number | undefined) => {
          return apiStations(request).list(cursor, limit); // call list repeatedly
        },
      ),
  };
}
