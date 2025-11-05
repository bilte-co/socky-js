import type { HttpRequest } from "@lib/http";
import { addIfDefined, parseJson } from "@lib/http";
import { paginateItems, paginatePages } from "@lib/paginate";

import type {
	Page,
	Station,
	StationInfoResponse,
	StationListResponse,
	StationNearReq,
} from "socky/types";

export function apiStations(request: HttpRequest) {
	return {
		async get(code: string): Promise<StationInfoResponse> {
			const res = await request(`/stations/${encodeURIComponent(code)}`);
			return parseJson<StationInfoResponse>(res);
		},

		async list(cursor?: string, limit?: number): Promise<Page<Station>> {
			const params = new URLSearchParams();
			addIfDefined(params, "cursor", cursor);
			addIfDefined(params, "limit", limit);

			const url = `/stations?${params.toString()}`;
			const res = await request(url);
			const data = await parseJson<{
				data: Station[];
				next_cursor?: string;
				has_more?: boolean;
			}>(res);

			return {
				items: data.data,
				nextCursor: data.next_cursor,
				hasMore: data.has_more ?? Boolean(data.next_cursor),
			};
		},

		async search(query: string): Promise<StationListResponse> {
			const params = new URLSearchParams();
			addIfDefined(params, "q", query);

			const url = `/stations/search?${params.toString()}`;
			const res = await request(url);
			return parseJson<StationListResponse>(res);
		},

		async proximity(query: StationNearReq): Promise<StationListResponse> {
			const params = new URLSearchParams();
			addIfDefined(params, "lat", query.latitude);
			addIfDefined(params, "lng", query.longitude);
			addIfDefined(params, "distance", query.distance);
			addIfDefined(params, "unit", query.unit);

			const url = `/stations/proximity?${params.toString()}`;
			const res = await request(url);
			return parseJson<StationListResponse>(res);
		},

		async near(
			code: string,
			query: StationNearReq,
		): Promise<StationListResponse> {
			const params = new URLSearchParams();
			addIfDefined(params, "distance", query.distance);
			addIfDefined(params, "unit", query.unit);

			const url = `/stations/${encodeURIComponent(code)}/near?${params.toString()}`;
			const res = await request(url);
			return parseJson<StationListResponse>(res);
		},

		paginatePages(limit?: number, pageLimit?: number) {
			return paginatePages<Station>(
				async (cursor?: string) => {
					return apiStations(request).list(cursor, limit);
				},
				pageLimit,
			);
		},

		paginateItems(limit?: number, pageLimit?: number) {
			return paginateItems<Station>(
				async (cursor?: string) => {
					return apiStations(request).list(cursor, limit);
				},
				pageLimit,
			);
		},
	};
}
