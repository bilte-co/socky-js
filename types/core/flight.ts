import type { Aircraft } from "./aircraft";
import type { Position } from "./position";
import type { Station } from "./station";

export type FlightStatus =
  | "scheduled"
  | "pending"
  | "active"
  | "complete"
  | "unknown"
  | "error";

export type FlightResponse = {
  id: string;
  inbound_flight_id?: string | null;
  flight_number?: string | null;
  origin_station?: Station | null;
  destination_station?: Station | null;
  aircraft?: Aircraft | null;
  scheduled_off?: string | null;
  scheduled_on?: string | null;
  actual_off?: string | null;
  actual_on?: string | null;
  status: FlightStatus;
  origin_station_code?: string | null;
  destination_station_code?: string | null;
};

export type FlightTrackResponse = {
  flight: FlightResponse;
  positions: Position[];
};

export type AircraftLastPositionResponse = FlightResponse & {
  last_position: Position;
  aircraft: Aircraft;
};
