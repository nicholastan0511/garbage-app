"use client";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

const UserFitHandler = ({
  userLocation,
}: {
  userLocation: google.maps.LatLngLiteral;
}) => {
  const map = useMap();
  const bounds = new google.maps.LatLngBounds();
  console.log("user loc", userLocation);

  // fit bounds user location upon initial page access
  useEffect(() => {
    if (!userLocation.lat || !userLocation.lng || !map) return;
    console.log("im called");
    bounds.extend(userLocation);
    map.fitBounds(bounds);
    map.setZoom(15);
  }, []);

  return null;
};

export default UserFitHandler;
