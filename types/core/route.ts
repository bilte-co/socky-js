import type { Station } from "./station";

export type RouteDistance = {
  nautical_miles: number;
  statute_miles: number;
  kilometers: number;
};

export type RouteLocation = {
  latitude: number;
  longitude: number;
  elevation_m: number;
  elevation_ft: number;
  station?: Station;
};
