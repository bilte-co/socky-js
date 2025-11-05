import { apiAircraft } from "@lib/aircraft";
import { apiFlights } from "@lib/flights";
import {
	type HttpRequest,
	delay,
	isRetryableNetworkError,
	jitterDelay,
	shouldRetry,
	toApiError,
} from "@lib/http";
import { apiLocations } from "@lib/locations";
import { apiPositions } from "@lib/positions";
import { apiRoutes } from "@lib/routes";
import { apiStations } from "@lib/stations";

import type { SockyOptions } from "socky/types";

const SDK_VERSION = "0.4.4";

export class Socky {
	private readonly request: HttpRequest;

	public readonly aircraft: ReturnType<typeof apiAircraft>;
	public readonly flights: ReturnType<typeof apiFlights>;
	public readonly locations: ReturnType<typeof apiLocations>;
	public readonly positions: ReturnType<typeof apiPositions>;
	public readonly routes: ReturnType<typeof apiRoutes>;
	public readonly stations: ReturnType<typeof apiStations>;

	constructor(opts: SockyOptions) {
		if (!opts.apiKey) {
			throw new Error("API key is required");
		}

		const baseUrl = opts.baseUrl?.endsWith("/")
			? opts.baseUrl
			: `${opts.baseUrl || "https://api.socky.flights"}/`;
		const version = opts.version || "v1";
		const fetchFn = opts.fetch || globalThis.fetch;
		const defaultTimeout = opts.timeoutMs ?? 30_000;
		const retries = opts.retries ?? 2;
		const backoff = opts.retryBackoffMs ?? 250;
		const allowOverrideAuth = opts.allowOverrideAuth ?? false;

		const sdkUA = `socky-js/${SDK_VERSION}${opts.userAgent ? ` ${opts.userAgent}` : ""}`;

		this.request = async (path, init = {}) => {
			const url = new URL(`${baseUrl}${version}${path}`);

			const headers = new Headers(init.headers ?? {});
			headers.set("Accept", "application/json");
			headers.set("X-Socky-SDK", sdkUA);

			if (!allowOverrideAuth || !headers.has("Authorization")) {
				headers.set("Authorization", `Bearer ${opts.apiKey}`);
			}

			let body = init.body;
			if (
				body != null &&
				!(body instanceof FormData) &&
				!(body instanceof URLSearchParams) &&
				typeof body === "object"
			) {
				headers.set("Content-Type", "application/json");
				body = JSON.stringify(body);
			}

			const controller = new AbortController();
			const timeout = setTimeout(
				() => controller.abort(),
				init.timeoutMs ?? defaultTimeout,
			);

			let attempt = 0;
			let lastErr: unknown;

			try {
				while (true) {
					try {
						const res = await fetchFn(url.toString(), {
							...init,
							body,
							headers,
							signal: init.signal ?? controller.signal,
						});

						if (res.ok) return res;

						const apiError = await toApiError(url.toString(), res);

						if (shouldRetry(res) && attempt < retries) {
							await delay(jitterDelay(backoff, attempt, apiError.retryAfterMs));
							attempt++;
							continue;
						}

						throw apiError;
					} catch (err) {
						lastErr = err;

						if (attempt < retries && isRetryableNetworkError(err)) {
							await delay(jitterDelay(backoff, attempt));
							attempt++;
							continue;
						}

						throw err;
					}
				}
			} finally {
				clearTimeout(timeout);
			}
		};

		this.aircraft = apiAircraft(this.request);
		this.flights = apiFlights(this.request);
		this.locations = apiLocations(this.request);
		this.positions = apiPositions(this.request);
		this.routes = apiRoutes(this.request);
		this.stations = apiStations(this.request);
	}
}

export { ApiError } from "@lib/error";
export type { Page } from "socky/types";
