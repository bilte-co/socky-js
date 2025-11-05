import type { HttpRequest } from "@lib/http";
import { parseJson } from "@lib/http";
import type { AircraftLastPositionResponse } from "socky/types";

export function apiPositions(request: HttpRequest) {
	return {
		async latest(
			tails: string | string[],
		): Promise<AircraftLastPositionResponse[]> {
			const arr = Array.isArray(tails) ? tails : [tails];
			const tailsParam = encodeURIComponent(arr.join(","));

			const res = await request(`/positions?tails=${tailsParam}`);
			return parseJson<AircraftLastPositionResponse[]>(res);
		},
	};
}
