import { fetchAllGarbageData } from "./lib/data";
import { MapComponent } from "./ui/map";
import Geolocation from "./ui/geolocation";
import Image from "next/image";
import { lusitana } from "./ui/fonts";

const mockData = [
  {
    lat: 25.083019,
    lng: 121.507258,
    key: "bd852f88-2287-4d55-a20d-137f9ea08c3e",
    address: "環河北路三段跨堤路橋入口處",
    district: "Shilin",
  },
];

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    lat: string;
    lng: string;
  };
}) {
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

  const lat = searchParams?.lat;
  const lng = searchParams?.lng;

  const userLocation = {
    lat: parseFloat(lat as string),
    lng: parseFloat(lng as string),
  };

  return (
    <div className="h-screen w-screen bg-white">
      <div className="h-full flex flex-col justify-center items-center gap-5 font-bold text-2xl">
        <div className="flex gap-5">
          <h1 className={`${lusitana.className} text-black`}>Taipei Bins</h1>
          <Image src="garbage.svg" height={20} width={30} alt="bin" />
        </div>
        <Geolocation />
        <MapComponent points={mockData} userLocation={userLocation}>
          <></>
        </MapComponent>
      </div>
    </div>
  );
}
