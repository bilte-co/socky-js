export type StationNearReq = {
  distance?: number;
  latitude?: number;
  longitude?: number;
  unit?: "ft" | "m" | "km" | "mi" | "nm";
};
