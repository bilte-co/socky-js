import { encodeLatLng } from "@lib/util";
import type { LocationInfoResponse } from "socky/types";

export function apiLocations(request: typeof fetch) {
  return {
    async get(lat: number, lng: number): Promise<LocationInfoResponse> {
      const encoded = encodeLatLng(lat, lng);
      const res = await request(`/locations/${encoded}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch location info: ${res.statusText}`);
      }
      return res.json();
    },
  };
}
