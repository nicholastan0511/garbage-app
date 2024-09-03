"use client";

import {
  APIProvider,
  AdvancedMarker,
  useMap,
  Map,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { ReactNode } from "react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Point, SearchLocation } from "../lib/definitions";
import Image from "next/image";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import SearchBar from "./places-search";
import { calcBearing } from "../lib/helper";

export const MapComponent = ({
  children,
  points,
  userLocation,
  searchLocation,
}: {
  children: ReactNode;
  points: Point[];
  userLocation: google.maps.LatLngLiteral | undefined;
  searchLocation: SearchLocation;
}) => {
  const position: google.maps.LatLngLiteral = {
    lat: 25.019238810705918,
    lng: 121.5355982944703,
  };

  const [handleInfoWindowClick, setHandleInfoWindowClick] = useState<
    ((key: string) => void) | null
  >(null);

  // This callback is passed to Infos to manage the state internally
  const setHandleInfoWindowClickCallback = useCallback(
    (callback: (key: string) => void) => {
      setHandleInfoWindowClick(() => callback);
    },
    []
  );

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}>
      <div className="h-5/6 w-full xl:w-5/6 rounded-xl p-5 shadow-lg bg-gray-100">
        <Map
          defaultCenter={position}
          mapId={process.env.NEXT_PUBLIC_MAP_ID}
          defaultZoom={17}
          fullscreenControl={false}
          mapTypeControl={false}
        >
          <SearchBar />
          <Markers
            points={points}
            handleInfoWindowClick={handleInfoWindowClick}
            userLocation={userLocation}
          />
          <Infos
            points={points}
            setHandleInfoWindowClick={setHandleInfoWindowClickCallback}
          />
          {/* render selected marker once searchLocation is ready */}
          {searchLocation && (
            <SelectedMarker
              position={{ lat: searchLocation.lat, lng: searchLocation.lng }}
              name={searchLocation.name}
              address={searchLocation.address}
            />
          )}
          {children}
        </Map>
      </div>
    </APIProvider>
  );
};

const Markers = ({
  points,
  handleInfoWindowClick,
  userLocation,
}: {
  points: Point[];
  handleInfoWindowClick: any;
  userLocation: google.maps.LatLngLiteral | undefined;
}) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };
  return (
    <>
      {points.map((point) => (
        <MarkerComponent
          point={point}
          key={point.key}
          setMarkerRef={setMarkerRef}
          handleInfoWindowClick={handleInfoWindowClick}
        />
      ))}

      {userLocation && userLocation.lat && userLocation.lng ? (
        <UserMarker userLocation={userLocation} />
      ) : null}
    </>
  );
};

const UserMarker = ({
  userLocation,
}: {
  userLocation: google.maps.LatLngLiteral;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [bearing, setBearing] = useState(0);
  const [prevPosition, setPrevPosition] = useState(userLocation);

  // for every change in userLocation, update bearing
  useEffect(() => {
    if (prevPosition.lat && prevPosition.lng) {
      setPrevPosition((prevPosition) => {
        const newBearing = calcBearing(prevPosition, userLocation);
        setBearing(newBearing);
        return userLocation;
      });
    }
  }, [userLocation]);

  return (
    <>
      <AdvancedMarker
        position={userLocation}
        style={{
          transform: `rotate(${bearing}deg)`,
          transition: "transform 0.5s ease",
        }}
        onClick={() => setOpen(true)}
      >
        <Image src="user.svg" width={50} height={50} alt="user" />
      </AdvancedMarker>
      {open && (
        <InfoWindow position={userLocation} onClose={() => setOpen(false)}>
          <p className="text-black text-sm">You are here!</p>
        </InfoWindow>
      )}
    </>
  );
};

const MarkerComponent = ({
  point,
  setMarkerRef,
  handleInfoWindowClick,
}: {
  point: Point;
  setMarkerRef?: any;
  handleInfoWindowClick: any;
}) => {
  return (
    <>
      <AdvancedMarker
        position={point}
        key={point.key}
        ref={(marker) => setMarkerRef(marker, point.key)}
        onClick={() => handleInfoWindowClick(point.key)}
      >
        <Image src="garbage-colored.svg" alt="garbage" width={30} height={30} />
      </AdvancedMarker>
    </>
  );
};

// Isolate info window state
const Infos = ({
  points,
  setHandleInfoWindowClick,
}: {
  points: Point[];
  setHandleInfoWindowClick: (callback: (key: string) => void) => void;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [infoWindows, setInfoWindows] = useState<string[]>([]);

  const handleInfoWindowClick = useCallback((key: string) => {
    setInfoWindows((prev) => [...prev, key]);
  }, []);

  const closeInfoWindow = useCallback((key: string) => {
    setInfoWindows((prev) => prev.filter((k) => k !== key));
  }, []);

  // Register the callback function to be used by Markers
  useEffect(() => {
    setHandleInfoWindowClick(handleInfoWindowClick);
  }, [handleInfoWindowClick, setHandleInfoWindowClick]);

  const handleShowRoute = (point: Point) => {
    const { lat, lng } = point;
    const params = new URLSearchParams(searchParams);
    if (lat) params.set("destination_lat", lat.toString());
    if (lng) params.set("destination_lng", lng.toString());
    replace(`${pathname}?${params.toString()}`);
    closeInfoWindow(point.key);
  };

  // Memoize the info windows to avoid re-rendering the component
  const infoWindowComponents = useMemo(() => {
    return infoWindows.map((key) => {
      const point = points.find((point) => point.key === key);
      return (
        key &&
        point && (
          <InfoWindow
            key={key}
            onClose={() => closeInfoWindow(key)}
            position={{
              lat: point.lat,
              lng: point.lng,
            }}
          >
            <div className="flex flex-col gap-3">
              <h1 className="text-extrabold text-xl text-black font-bold">
                {point.district}
              </h1>
              <p className="text-black font-light">{point.address}</p>
              <button
                className="btn btn-primary btn-sm uppercase text-white"
                onClick={() => handleShowRoute(point)}
              >
                Show route
              </button>
            </div>
          </InfoWindow>
        )
      );
    });
  }, [infoWindows, points, closeInfoWindow]);

  return <>{infoWindowComponents}</>;
};

const SelectedMarker = ({
  position,
  name,
  address,
}: {
  position: google.maps.LatLngLiteral;
  name: string;
  address: string;
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <AdvancedMarker position={position} onClick={() => setOpen(true)}>
        <Image
          src="pointer_selected.svg"
          alt="selected pointer"
          width={30}
          height={30}
        ></Image>
      </AdvancedMarker>
      {open && (
        <InfoWindow position={position} onClose={() => setOpen(false)}>
          <h1 className="text-black text-lg font-bold">{name}</h1>
          <p className="text-black">{address}</p>
        </InfoWindow>
      )}
    </div>
  );
};
