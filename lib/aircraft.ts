import type {
  Aircraft,
  AircraftLastPositionResponse,
  FlightResponse,
  PaginatedItems,
} from "socky/types";

export function apiAircraft(request: typeof fetch) {
  return {
    async list(
      cursor?: string,
      limit?: number,
    ): Promise<PaginatedItems<Aircraft>> {
      const params = new URLSearchParams();
      if (cursor) params.set("cursor", cursor);
      if (limit) params.set("limit", limit.toString());

      const url = `/aircraft?${params.toString()}`;
      const res = await request(url);
      if (!res.ok) throw new Error("Failed to list aircraft");

      return res.json();
    },

    async get(registration: string): Promise<Aircraft> {
      const res = await request(`/aircraft/${registration}`);
      if (!res.ok)
        throw new Error(`Failed to fetch aircraft: ${res.statusText}`);

      return res.json();
    },

    async position(
      registration: string,
    ): Promise<AircraftLastPositionResponse> {
      const res = await request(`/aircraft/${registration}/position`);
      if (!res.ok)
        throw new Error(`Failed to fetch aircraft position: ${res.statusText}`);

      return res.json();
    },

    async flights(
      registration: string,
      cursor?: string,
      limit?: number,
    ): Promise<PaginatedItems<FlightResponse>> {
      const params = new URLSearchParams();
      if (cursor) params.set("cursor", cursor);
      if (limit) params.set("limit", limit.toString());

      const url = `/aircraft/${registration}/flights?${params.toString()}`;
      const res = await request(url);
      if (!res.ok) throw new Error("Failed to fetch aircraft flights");

      return res.json();
    },
  };
}
