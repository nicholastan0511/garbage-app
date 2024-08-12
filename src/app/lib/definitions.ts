export type GarbageLocation = {
  district: string;
  location: string;
  long: number;
  lat: number;
};

export type Point = google.maps.LatLngLiteral & {
  key: string;
  address: string;
  district: string;
};
