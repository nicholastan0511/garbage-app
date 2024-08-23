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

export interface MapHandlerProps {
  place: google.maps.places.PlaceResult | null;
  marker: google.maps.marker.AdvancedMarkerElement | null;
}

export type SearchLocation =
  | (google.maps.LatLngLiteral & { name: string; address: string })
  | undefined;
