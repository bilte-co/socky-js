import type { HttpRequest } from "@lib/http";
import { addIfDefined, parseJson } from "@lib/http";
import type {
	Aircraft,
	AircraftLastPositionResponse,
	FlightResponse,
	Page,
} from "socky/types";

export function apiAircraft(request: HttpRequest) {
	return {
		async list(cursor?: string, limit?: number): Promise<Page<Aircraft>> {
			const params = new URLSearchParams();
			addIfDefined(params, "cursor", cursor);
			addIfDefined(params, "limit", limit);

			const url = `/aircraft?${params.toString()}`;
			const res = await request(url);
			const data = await parseJson<{
				items: Aircraft[];
				next_cursor?: string;
				has_more?: boolean;
			}>(res);

			return {
				items: data.items,
				nextCursor: data.next_cursor,
				hasMore: data.has_more ?? Boolean(data.next_cursor),
			};
		},

		async get(registration: string): Promise<Aircraft> {
			const res = await request(`/aircraft/${encodeURIComponent(registration)}`);
			return parseJson<Aircraft>(res);
		},

		async position(
			registration: string,
		): Promise<AircraftLastPositionResponse> {
			const res = await request(
				`/aircraft/${encodeURIComponent(registration)}/position`,
			);
			return parseJson<AircraftLastPositionResponse>(res);
		},

		async flights(
			registration: string,
			options: {
				cursor?: string;
				limit?: number;
				start?: string;
				end?: string;
				origin?: string;
				destination?: string;
			} = {},
		): Promise<Page<FlightResponse>> {
			const { cursor, limit, start, end, origin, destination } = options;
			const params = new URLSearchParams();
			addIfDefined(params, "cursor", cursor);
			addIfDefined(params, "limit", limit);
			addIfDefined(params, "start", start);
			addIfDefined(params, "end", end);
			addIfDefined(
				params,
				"origin",
				origin ? origin.trim().toUpperCase() : undefined,
			);
			addIfDefined(
				params,
				"destination",
				destination ? destination.trim().toUpperCase() : undefined,
			);

			const url = `/aircraft/${encodeURIComponent(registration)}/flights?${params.toString()}`;
			const res = await request(url);
			const data = await parseJson<{
				items: FlightResponse[];
				next_cursor?: string;
				has_more?: boolean;
			}>(res);

			return {
				items: data.items,
				nextCursor: data.next_cursor,
				hasMore: data.has_more ?? Boolean(data.next_cursor),
			};
		},
	};
}
