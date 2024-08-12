"use client";

import {
  APIProvider,
  AdvancedMarker,
  useMap,
  Map,
  InfoWindow,
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
  const [infoWindows, setInfoWindows] = useState<string[]>([]);

  const handleInfoWindowClick = (key: string) => {
    setInfoWindows((prev) => [...prev, key]);
  };

  const closeOneInfoWindow = (key: string) => {
    setInfoWindows((prev) => {
      const temp = [...prev].filter((p) => p !== key);
      return temp;
    });
  };

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
          handleInfoWindowClick={handleInfoWindowClick}
        />
      ))}
      {infoWindows.map((key) => {
        const point = points.find((point) => point.key);
        return (
          key && (
            <InfoWindow
              key={key}
              onClose={() => closeOneInfoWindow(key)}
              position={{
                lat: point?.lat as number,
                lng: point?.lng as number,
              }}
            >
              <p>{point?.address}</p>
            </InfoWindow>
          )
        );
      })}
    </>
  );
};

const MarkerComponent = ({
  point,
  setMarkerRef,
  handleInfoWindowClick,
}: {
  point: Point;
  setMarkerRef: any;
  handleInfoWindowClick: any;
}) => {
  // will trigger rerendering of one marker component, which will trigger the ref, which will trigger the setMarkerRef, triggering the state mounted on the Markers component, triggering the rerendering of the entire Markers component and its subcomponent
  // const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <AdvancedMarker
        position={point}
        key={point.key}
        ref={(marker) => setMarkerRef(marker, point.key)}
        onClick={() => handleInfoWindowClick(point.key)}
        // onClick={() => setOpen(true)}
      >
        <Image src="garbage-colored.svg" alt="garbage" width={30} height={30} />
      </AdvancedMarker>
      {/* {open && (
        <InfoWindow onClose={() => setOpen(false)}>
          <p className="text-black">{point.address}</p>
        </InfoWindow>
      )} */}
    </>
  );
};
