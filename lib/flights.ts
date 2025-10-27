import type { FlightResponse, FlightTrackResponse } from "socky/types";

export function apiFlights(request: typeof fetch) {
  return {
    async get(ulid: string): Promise<FlightResponse> {
      const res = await request(`/flights/${ulid}`);
      if (!res.ok)
        throw new Error(`Failed to fetch flight: ${res.statusText}`);

      return res.json();
    },

    async track(ulid: string): Promise<FlightTrackResponse> {
      const res = await request(`/flights/${ulid}/track`);
      if (!res.ok)
        throw new Error(`Failed to fetch flight track: ${res.statusText}`);

      return res.json();
    },
  };
}
