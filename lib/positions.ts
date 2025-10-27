import type { AircraftLastPositionResponse } from "socky/types";

export function apiPositions(request: typeof fetch) {
  return {
    async latest(
      tails: string | string[],
    ): Promise<AircraftLastPositionResponse[]> {
      const arr = Array.isArray(tails) ? tails : [tails];
      const tailsParam = encodeURIComponent(arr.join(","));

      const res = await request(`/positions?tails=${tailsParam}`);
      if (!res.ok)
        throw new Error(`Failed to fetch positions: ${res.statusText}`);

      return res.json();
    },
  };
}
