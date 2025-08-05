import type {
  ApiResponse,
  Location,
  RouteDistance,
  RouteLocation,
  Station,
} from "socky/types";

export type LocationInfoResponse = ApiResponse<{
  data: Location;
}>;

export type StationInfoResponse = ApiResponse<{
  data: Station;
}>;

export type StationListResponse = ApiResponse<{
  data: Station[];
}>;

export type RouteInfoResponse = ApiResponse<{
  to: RouteLocation;
  from: RouteLocation;
  distance: RouteDistance;
  bearing: number;
}>;
