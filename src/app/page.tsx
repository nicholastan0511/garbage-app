import { fetchAllGarbageData, fetchUserLocality } from "./lib/data";
import { MapComponent } from "./ui/map";
import Geolocation from "./ui/geolocation";
import Image from "next/image";

const mockData = [
  {
    lat: 25.083019,
    lng: 121.507258,
    key: "bd852f88-2287-4d55-a20d-137f9ea08c3e",
    address: "環河北路三段跨堤路橋入口處",
    district: "Shilin",
  },
];

const localities = {
  "Da'an": "大安區",
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

  let userLocality = null;
  if (userLocation.lat && userLocation.lng) {
    userLocality = await fetchUserLocality(userLocation);
    console.log(userLocality.locality);
  }

  const destination = {
    lat: parseFloat(searchParams?.destination_lat as string),
    lng: parseFloat(searchParams?.destination_lng as string),
  };

  return (
    <div className="h-screen w-screen bg-white">
      <div className="h-full flex flex-col justify-center items-center gap-5 font-bold text-2xl">
        <div className="flex gap-5">
          <h1 className="text-black">Taipei Bins</h1>
          <Image src="garbage.svg" height={20} width={30} alt="bin" />
        </div>
        <Geolocation />
        <MapComponent
          points={extractedLatLng}
          userLocation={userLocation}
          destination={destination}
        >
          <></>
        </MapComponent>
      </div>
    </div>
  );
}
