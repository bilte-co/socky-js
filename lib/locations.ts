import type { HttpRequest } from "@lib/http";
import { parseJson } from "@lib/http";
import { encodeLatLng } from "@lib/util";
import type { LocationInfoResponse } from "socky/types";

export function apiLocations(request: HttpRequest) {
	return {
		async get(lat: number, lng: number): Promise<LocationInfoResponse> {
			const encoded = encodeLatLng(lat, lng);
			const res = await request(`/locations/${encoded}`);
			return parseJson<LocationInfoResponse>(res);
		},
	};
}
