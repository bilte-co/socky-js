import type { HttpRequest } from "@lib/http";
import { parseJson } from "@lib/http";
import type { RouteInfoResponse } from "socky/types";

export function apiRoutes(request: HttpRequest) {
	return {
		async get(from: string, to: string): Promise<RouteInfoResponse> {
			const res = await request(
				`/routes/${encodeURIComponent(from)}/${encodeURIComponent(to)}`,
			);
			return parseJson<RouteInfoResponse>(res);
		},
	};
}
