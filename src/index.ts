import { apiAircraft } from "@lib/aircraft";
import { apiFlights } from "@lib/flights";
import { apiLocations } from "@lib/locations";
import { apiPositions } from "@lib/positions";
import { apiRoutes } from "@lib/routes";
import { apiStations } from "@lib/stations";

import type { SockyOptions } from "socky/types";

export class Socky {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly version: string;
  private readonly request: typeof fetch;

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
    this.apiKey = opts.apiKey;

    if (opts.baseUrl && !opts.baseUrl.endsWith("/")) {
      opts.baseUrl += "/";
    }
    this.baseUrl = opts.baseUrl || "https://api.socky.flights/";

    this.version = opts.version || "v1";

    this.request = (path, options = {}) => {
      const url = new URL(`${this.baseUrl}${this.version}${path}`);

      const headers: Record<string, string> = {
        Accept: "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        ...(options.headers as Record<string, string> || {}),
      };

      if (options.body) {
        headers["Content-Type"] = "application/json";
      }

      return fetch(url, {
        ...options,
        headers: headers as HeadersInit,
      });
    };

    this.aircraft = apiAircraft(this.request);
    this.flights = apiFlights(this.request);
    this.locations = apiLocations(this.request);
    this.positions = apiPositions(this.request);
    this.routes = apiRoutes(this.request);
    this.stations = apiStations(this.request);
  }
}

if (typeof window !== "undefined") {
  // biome-ignore lint/suspicious/noExplicitAny: Allow global access to Socky
  (window as any).Socky = Socky;
}
