(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __moduleCache = /* @__PURE__ */ new WeakMap;
  var __toCommonJS = (from) => {
    var entry = __moduleCache.get(from), desc;
    if (entry)
      return entry;
    entry = __defProp({}, "__esModule", { value: true });
    if (from && typeof from === "object" || typeof from === "function")
      __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
        get: () => from[key],
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      }));
    __moduleCache.set(from, entry);
    return entry;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {
        get: all[name],
        enumerable: true,
        configurable: true,
        set: (newValue) => all[name] = () => newValue
      });
  };

  // index.ts
  var exports_socky_js = {};
  __export(exports_socky_js, {
    Socky: () => Socky
  });

  // lib/util.ts
  function encodeLatLng(lat, lng) {
    const buffer = new ArrayBuffer(16);
    const view = new DataView(buffer);
    view.setFloat64(0, lat);
    view.setFloat64(8, lng);
    let binary = "";
    for (let i = 0;i < 16; i++) {
      binary += String.fromCharCode(view.getUint8(i));
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  // lib/locations.ts
  function apiLocations(request) {
    return {
      async get(lat, lng) {
        const encoded = encodeLatLng(lat, lng);
        const res = await request(`/locations/${encoded}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch location info: ${res.statusText}`);
        }
        return res.json();
      }
    };
  }

  // lib/routes.ts
  function apiRoutes(request) {
    return {
      async get(from, to) {
        const res = await request(`/routes/${from}/${to}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch route info: ${res.statusText}`);
        }
        return res.json();
      }
    };
  }

  // lib/paginate.ts
  async function* paginate(fetchPage, pageLimit) {
    let cursor;
    const limit = 20;
    let pageCount = 0;
    while (true) {
      const page = await fetchPage(cursor, limit);
      yield page.data;
      cursor = page.next_cursor;
      pageCount++;
      if (!cursor || pageLimit && pageCount >= pageLimit) {
        break;
      }
    }
  }

  // lib/stations.ts
  function apiStations(request) {
    return {
      async get(code) {
        const res = await request(`/stations/${code}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch station info: ${res.statusText}`);
        }
        return res.json();
      },
      async list(cursor, limit) {
        const basePath = "/stations";
        const params = new URLSearchParams;
        if (cursor)
          params.set("cursor", cursor);
        if (limit)
          params.set("limit", limit.toString());
        const url = `${basePath}?${params.toString()}`;
        const res = await request(url);
        if (!res.ok)
          throw new Error(`Failed to list stations`);
        return res.json();
      },
      async search(query) {
        const basePath = "/stations/search";
        const params = new URLSearchParams;
        if (query)
          params.set("q", query);
        const url = `${basePath}?${params.toString()}`;
        const res = await request(url);
        if (!res.ok)
          throw new Error(`Failed to search stations`);
        return res.json();
      },
      async proximity(query) {
        const basePath = "/stations/proximity";
        const params = new URLSearchParams;
        if (query.latitude)
          params.set("lat", query.latitude.toString());
        if (query.longitude)
          params.set("lng", query.longitude.toString());
        if (query.distance)
          params.set("distance", query.distance.toString());
        if (query.unit)
          params.set("unit", query.unit);
        const url = `${basePath}?${params.toString()}`;
        const res = await request(url);
        if (!res.ok)
          throw new Error(`Failed to search nearby stations`);
        return res.json();
      },
      async near(code, query) {
        const basePath = `/stations/${code}/near`;
        const params = new URLSearchParams;
        if (query.distance)
          params.set("distance", query.distance.toString());
        if (query.unit)
          params.set("unit", query.unit);
        const url = `${basePath}?${params.toString()}`;
        const res = await request(url);
        if (!res.ok)
          throw new Error(`Failed to search stations`);
        return res.json();
      },
      paginate: (request2) => paginate((cursor, limit) => {
        return apiStations(request2).list(cursor, limit);
      })
    };
  }

  // index.ts
  class Socky {
    apiKey;
    baseUrl;
    version;
    request;
    locations;
    routes;
    stations;
    constructor(opts) {
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
            ...options.headers || {}
          }
        });
      };
      this.locations = apiLocations(this.request);
      this.routes = apiRoutes(this.request);
      this.stations = apiStations(this.request);
    }
  }
  if (typeof window !== "undefined") {
    window.Socky = Socky;
  }
})();

//# debugId=4B0A4CD3ADEB6A2E64756E2164756E21
//# sourceMappingURL=socky.js.map
