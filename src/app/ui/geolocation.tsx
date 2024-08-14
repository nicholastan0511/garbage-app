"use client";

import { useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const Geolocation = () => {
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const pathname = usePathname();
  const { replace } = useRouter();

  const searchParams = useSearchParams();

  const handleSearch = (location: google.maps.LatLngLiteral) => {
    const params = new URLSearchParams(searchParams);
    if (location.lat) {
      params.set("lat", location.lat.toString());
    }

    if (location.lng) {
      params.set("lng", location.lng.toString());
    }

    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    // check if browser supports geolocation api
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          console.log(position);
          setLocation({ lat, lng });
        },
        (err) => {
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError("User denied the request for Geolocation.");
              break;
            case err.POSITION_UNAVAILABLE:
              setError("Location information is unavailable.");
              break;
            case err.TIMEOUT:
              setError("The request to get user location timed out.");
              break;
            default:
              setError("An unknown error occurred.");
              break;
          }
        }
      );
    }
  }, []);

  useEffect(() => {
    if (location && location.lng && location.lng) {
      handleSearch(location);
    }
  }, [location]);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {location ? (
        <p>
          Latitude: {location.lat}, Longitude: {location.lng}
        </p>
      ) : (
        !error && <p>Fetching location...</p>
      )}
    </div>
  );
};

export default Geolocation;
