import { fetchAllGarbageData, fetchUserLocality } from "./lib/data";
import { MapComponent } from "./ui/map";
import Geolocation from "./ui/geolocation";
import Image from "next/image";
import Directions from "./ui/directions";
import { haversine_distance } from "./lib/helper";
import Menu from "./ui/map-menu";
import ClosestLocation from "./ui/closest-location";
import { Point, SearchLocation } from "./lib/definitions";
import AlertLocation from "./ui/alert-location";
import AlertData from "./ui/alert-data";
import MapHandler from "./ui/map-fit-handler";

const mockData = [
  {
    lat: 25.083019,
    lng: 121.507258,
    key: "bd852f88-2287-4d55-a20d-137f9ea08c3e",
    address: "環河北路三段跨堤路橋入口處",
    district: "Shilin",
  },
];

const localities: { [key: string]: string } = {
  "Da’an": "大安區",
  Shilin: "士林區",
  "Xinyi District": "信義",
  "Wenshan District": "文山區",
  Nangang: "南港區",
  "Songshan District": "松山區",
  "Zhongshan District": "中山區",
  "Datong District": "大同區",
  Neihu: "內湖區",
  Beitou: "北投區",
  "Zhongzheng District": "中正區",
  "Wan-hua": "萬華區",
};

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    lat: string;
    lng: string;
    destination_lat: string;
    destination_lng: string;
    district: string;
    search_lat: string;
    search_lng: string;
    search_name: string;
    search_address: string;
  };
}) {
  // format data to fit Point type
  const data = await fetchAllGarbageData();
  const extractedLatLng = data.map((point) => {
    return {
      lat: parseFloat(point.lat),
      lng: parseFloat(point.long),
      key: point.id,
      address: point.location,
      district: point.district,
    };
  });

  // parse latitude and longitude
  const lat = searchParams?.lat;
  const lng = searchParams?.lng;

  const userLocation = {
    lat: parseFloat(lat as string),
    lng: parseFloat(lng as string),
  };

  let userLocality: string | null = null;
  let city: string | null = null;
  if (userLocation.lat && userLocation.lng) {
    const data = await fetchUserLocality(userLocation);
    userLocality = data.locality;
    city = data.city;
  }

  // filter garbage locations based on user's locality
  let filteredLocations = extractedLatLng.filter((location) => {
    let district;
    if (userLocality) district = localities[userLocality];
    return location.district === district;
  });

  const locationsWithDistance = filteredLocations.map((location) => {
    const distance = haversine_distance(userLocation, {
      lat: location.lat,
      lng: location.lng,
    });

    return {
      ...location,
      distance: Math.round(distance * 100) / 100,
    };
  });

  let closestLocation: (Point & { distance: number }) | null = null;

  if (locationsWithDistance) {
    locationsWithDistance.forEach((location, index) => {
      if (index === 0) closestLocation = location;
      else if (closestLocation && location.distance < closestLocation.distance)
        closestLocation = location;
    });
  }

  const destination = {
    lat: parseFloat(searchParams?.destination_lat as string),
    lng: parseFloat(searchParams?.destination_lng as string),
  };

  if (searchParams?.district) {
    filteredLocations = extractedLatLng.filter(
      (location) => location.district === searchParams.district
    );
  }

  let searchLocation: SearchLocation = undefined;
  if (searchParams && searchParams.search_lat && searchParams.search_lng) {
    searchLocation = {
      lat: parseFloat(searchParams.search_lat),
      lng: parseFloat(searchParams.search_lng),
      name: searchParams.search_name,
      address: searchParams.search_address,
    };
  }

  console.log(userLocation);

  return (
    <div className="h-screen w-screen bg-white">
      <div className="h-full flex flex-col justify-center items-center gap-5 font-bold text-2xl">
        <div className="flex justify-center w-5/6 items-center">
          <Menu localities={localities} defaultValue={searchParams?.district} />
        </div>
        <Geolocation />
        {!userLocality && <AlertLocation />}
        {!closestLocation && userLocality && <AlertData city={city} />}

        <MapComponent
          points={filteredLocations}
          userLocation={userLocation}
          searchLocation={searchLocation}
        >
          {closestLocation && (
            <ClosestLocation closestLocation={closestLocation} />
          )}
          <Directions userLocation={userLocation} destination={destination} />
          {searchParams && searchParams.district && (
            <MapHandler district={searchParams.district} />
          )}
        </MapComponent>
      </div>
    </div>
  );
}
