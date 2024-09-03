export const haversine_distance = (
  mk1: google.maps.LatLngLiteral,
  mk2: google.maps.LatLngLiteral
) => {
  const R = 6371.071; // Radius of the Earth in miles
  const rlat1 = mk1.lat * (Math.PI / 180); // Convert degrees to radians
  const rlat2 = mk2.lat * (Math.PI / 180); // Convert degrees to radians
  const difflat = rlat2 - rlat1; // Radian difference (latitudes)
  const difflon = (mk2.lng - mk1.lng) * (Math.PI / 180); // Radian difference (longitudes)

  const d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    );
  return d;
};

export const calcBearing = (
  from: google.maps.LatLngLiteral,
  to: google.maps.LatLngLiteral
) => {
  const fromLat = (from.lat * Math.PI) / 180;
  const fromLng = (from.lng * Math.PI) / 180;
  const toLat = (to.lat * Math.PI) / 180;
  const toLng = (to.lng * Math.PI) / 180;

  const dLng = toLng - fromLng;
  const y = Math.sin(dLng) * Math.cos(toLat);
  const x =
    Math.cos(fromLat) * Math.sin(toLat) -
    Math.sin(fromLat) * Math.cos(toLat) * Math.cos(dLng);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;

  return (bearing + 360) % 360;
};
