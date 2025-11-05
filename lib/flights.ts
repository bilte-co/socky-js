import type { HttpRequest } from "@lib/http";
import { parseJson } from "@lib/http";
import type { FlightResponse, FlightTrackResponse } from "socky/types";

export function apiFlights(request: HttpRequest) {
	return {
		async get(ulid: string): Promise<FlightResponse> {
			const res = await request(`/flights/${encodeURIComponent(ulid)}`);
			return parseJson<FlightResponse>(res);
		},

		async track(ulid: string): Promise<FlightTrackResponse> {
			const res = await request(`/flights/${encodeURIComponent(ulid)}/track`);
			return parseJson<FlightTrackResponse>(res);
		},
	};
}
