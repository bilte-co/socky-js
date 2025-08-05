import type { Runway } from "./runway";

export type Station = {
  id: string;
  iata: string;
  icao: string;
  fa_code: string;
  gps_code: string;
  local_code: string;
  name: string;
  elevation_ft: number;
  elevation_meters: number;
  latitude: number;
  longitude: number;
  timezone: string;
  station_type: string;
  city: string;
  state: string;
  region: string;
  country: string;
  runways: Runway[];
};
