"use client";

import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import Para from "./para-direction";

const Directions = ({
  userLocation,
  destination,
}: {
  userLocation: google.maps.LatLngLiteral | undefined;
  destination: google.maps.LatLngLiteral;
}) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);

  const selectedRoute = routes[routeIndex];
  const leg = selectedRoute?.legs[0];

  // instantiate function state
  useEffect(() => {
    if (!map || !routesLibrary) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [map, routesLibrary]);

  // render direction when ready
  useEffect(() => {
    if (
      !directionsService ||
      !directionsRenderer ||
      !userLocation ||
      !userLocation.lat ||
      !userLocation.lng ||
      !destination.lat ||
      !destination.lng
    )
      return;

    directionsService
      .route({
        origin: userLocation,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((res) => {
        directionsRenderer.setDirections(res);
        setRoutes(res.routes);
      });
  }, [directionsService, directionsRenderer, userLocation]);

  // render different routes on route switch
  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) return null;

  return (
    <div className="absolute left-3 bottom-3 xl:bottom-auto xl:left-auto xl:top-3 xl:right-3 glass rounded-xl flex flex-col py-3 px-5 justify-center 2xl:gap-5 w-1/2 xl:w-1/3 overflow-x-scroll">
      <div>
        <h1 className="text-sm xl:text-lg text-black">
          {selectedRoute.summary}
        </h1>
        <div>
          <Para>Start: {leg.start_address}</Para>
          <Para>End: {leg.end_address}</Para>
          <Para>Distance: {leg.distance?.text}</Para>
          <Para>Duration: {leg.duration?.text}</Para>
        </div>
      </div>
      <div>
        <h1 className="text-sm text-black font-extrabold xl:text-lg">
          Other routes
        </h1>
        <ul className="list-disc pl-3">
          {routes.map((route, index) => {
            return (
              <li
                key={route.summary}
                onClick={() => setRouteIndex(index)}
                className="text-black font-light text-xs xl:text-sm hover:cursor-pointer leading-none"
              >
                {route.summary}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Directions;
