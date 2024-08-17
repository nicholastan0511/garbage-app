import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

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

  console.log("destination", destination);

  // instantiate function state
  useEffect(() => {
    if (!map || !routesLibrary) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [map, routesLibrary]);

  // render direction when ready
  useEffect(() => {
    if (!directionsService || !directionsRenderer || !userLocation) return;

    directionsService
      .route({
        origin: userLocation,
        destination: destination || "National Taiwan University",
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

  console.log(routes);

  if (!leg) return null;

  return (
    <div className="absolute top-3 right-3 bg-white rounded-xl p-5 flex flex-col gap-5">
      <div>
        <h1>{selectedRoute.summary}</h1>
        <div>
          <p className="font-light text-lg">Start: {leg.start_address}</p>
          <p className="font-light text-lg">End: {leg.end_address}</p>
          <p className="font-light text-lg">Distance: {leg.distance?.text}</p>
          <p className="font-light text-lg">Duration: {leg.distance?.text}</p>
        </div>
      </div>
      <div>
        <h1>Other routes</h1>
        <ul className="list-disc pl-10">
          {routes.map((route, index) => {
            return (
              <li
                key={route.summary}
                onClick={() => setRouteIndex(index)}
                className="font-light text-lg hover:cursor-pointer"
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
