"use client";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

const MapHandler = ({ district }: { district: string }) => {
  const bounds = new google.maps.LatLngBounds();
  const map = useMap();

  // fitbounds to chosen district
  useEffect(() => {
    console.log("district", district);
    if (!map || !district) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { address: `${district}, Taipei, Taiwan` },
      (res, status) => {
        if (status === "OK" && res) {
          const latlng = res[0].geometry.location;
          bounds.extend(latlng);
          map.fitBounds(bounds);
          map.setZoom(15);
        }
      }
    );
  }, [map, district]);

  return null;
};

export default MapHandler;
