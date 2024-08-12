"use client";

import {
  APIProvider,
  AdvancedMarker,
  useMap,
  Map,
} from "@vis.gl/react-google-maps";
import { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";
import { Point } from "../lib/definitions";
import Image from "next/image";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";

export const MapComponent = ({
  children,
  points,
}: {
  children: ReactNode;
  points: Point[];
}) => {
  const position: google.maps.LatLngLiteral = {
    lat: 25.019238810705918,
    lng: 121.5355982944703,
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}>
      {children}
      <div className="h-2/3 w-2/3 rounded-xl">
        <Map
          defaultCenter={position}
          mapId={process.env.NEXT_PUBLIC_MAP_ID}
          defaultZoom={17}
        >
          <Markers points={points} />
        </Map>
      </div>
    </APIProvider>
  );
};

const Markers = ({ points }: { points: Point[] }) => {
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
    console.log("IM RENDERED");
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
        />
      ))}
    </>
  );
};

const MarkerComponent = ({
  point,
  setMarkerRef,
}: {
  point: Point;
  setMarkerRef: any;
}) => {
  return (
    <AdvancedMarker
      position={point}
      key={point.key}
      ref={(marker) => setMarkerRef(marker, point.key)}
    >
      <Image src="garbage-colored.svg" alt="garbage" width={30} height={30} />
    </AdvancedMarker>
  );
};
