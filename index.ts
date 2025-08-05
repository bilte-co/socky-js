import { apiLocations } from "@lib/locations";
import { apiRoutes } from "@lib/routes";
import { apiStations } from "@lib/stations";

import type { SockyOptions } from "socky/types";

export class Socky {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly version: string;
  private readonly request: typeof fetch;

  public readonly locations: ReturnType<typeof apiLocations>;
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

      return fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          ...(options.headers || {}),
        },
      });
    };

    this.locations = apiLocations(this.request);
    this.routes = apiRoutes(this.request);
    this.stations = apiStations(this.request);
  }
}

if (typeof window !== "undefined") {
  // biome-ignore lint/suspicious/noExplicitAny: Allow global access to Socky
  (window as any).Socky = Socky;
}
