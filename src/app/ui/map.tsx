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
import { Point } from "../lib/definitions";
import Image from "next/image";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
import Directions from "./directions";

export const MapComponent = ({
  children,
  points,
  userLocation,
}: {
  children: ReactNode;
  points: Point[];
  userLocation: google.maps.LatLngLiteral | undefined;
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
      {children}
      <div className="h-2/3 w-2/3 rounded-xl">
        <Map
          defaultCenter={position}
          mapId={process.env.NEXT_PUBLIC_MAP_ID}
          defaultZoom={17}
          fullscreenControl={false}
        >
          <Markers
            points={points}
            handleInfoWindowClick={handleInfoWindowClick}
            userLocation={userLocation}
          />
          <Infos
            points={points}
            setHandleInfoWindowClick={setHandleInfoWindowClickCallback}
          />
          <Directions userLocation={userLocation} />
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

  console.log(userLocation);
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

  return (
    <>
      <AdvancedMarker position={userLocation} onClick={() => setOpen(true)}>
        <Image src="user.svg" width={40} height={40} alt="user" />
      </AdvancedMarker>
      {open && (
        <InfoWindow position={userLocation} onClose={() => setOpen(false)}>
          <p>You are here!</p>
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
            <h1 className="text-bold text-xl">{point.district}</h1>
            <p>{point.address}</p>
          </InfoWindow>
        )
      );
    });
  }, [infoWindows, points, closeInfoWindow]);

  return <>{infoWindowComponents}</>;
};
